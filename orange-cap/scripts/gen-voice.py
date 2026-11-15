"""Generate the voiceover with Kokoro (local, free) and build the beat-quantized timeline.

Usage (from the project root, in a venv with `kokoro-onnx soundfile faster-whisper`):
    python scripts/gen-voice.py --model <dir with model.onnx + voices.npz> [--whisper <dir>]

Writes public/vo/<id>.wav and src/timeline.json. Every scene length is derived from how long
its line takes to say, rounded up to whole beats so every cut lands on the music.
"""
import argparse
import json
import math
import pathlib

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
BPM = 120
BEAT = 60 / BPM  # seconds
BAR_BEATS = 4

# Seconds of breathing room around each line.
VO_LEAD = {"hook": 0.12, "season": 0.12, "tally": 0.35, "outro": 0.35}
TAIL = {"hook": 0.2, "season": 0.22, "tally": 2.2, "outro": 1.6}
MIN_BEATS = {"hook": 8, "season": 3, "tally": 12, "outro": 8}


def beats_for(kind, duration):
    return max(MIN_BEATS[kind], math.ceil((VO_LEAD[kind] + duration + TAIL[kind]) / BEAT))


def to_bar(beats):
    return math.ceil(beats / BAR_BEATS) * BAR_BEATS


def trim(audio, sr, thresh=0.01, pad=0.03):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    a = max(0, idx[0] - int(pad * sr))
    b = min(len(audio), idx[-1] + int(pad * sr))
    return audio[a:b]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--whisper", help="faster-whisper model dir, for word timings (optional)")
    args = ap.parse_args()

    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    model = pathlib.Path(args.model)
    tts = Kokoro(str(model / "model.onnx"), str(model / "voices.npz"))
    asr = None
    if args.whisper:
        from faster_whisper import WhisperModel

        asr = WhisperModel(args.whisper, device="cpu", compute_type="int8")

    out_dir = ROOT / "public" / "vo"
    out_dir.mkdir(parents=True, exist_ok=True)
    lines = {}
    for line in script["lines"]:
        if "phonemes" in line:  # hand-written pronunciation, e.g. Indian names espeak gets wrong
            audio, sr = tts.create(line["phonemes"], voice=script["voice"], speed=script["speed"], is_phonemes=True)
        else:
            audio, sr = tts.create(line["text"], voice=script["voice"], speed=script["speed"], lang=line.get("lang", "en-us"))
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        audio = audio * (0.9 / max(1e-6, np.abs(audio).max()))
        sf.write(out_dir / f"{line['id']}.wav", audio, sr, subtype="PCM_16")
        words = []
        if asr is not None:
            n = int(len(audio) * 16000 / sr)
            a16 = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
            segs, _ = asr.transcribe(a16, language="en", word_timestamps=True, beam_size=5)
            for s in segs:
                words += [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for w in s.words]
        lines[line["id"]] = {"duration": round(len(audio) / sr, 3), "words": words}
        print(f"{line['id']:6s} {len(audio) / sr:5.2f}s  {' '.join(w['w'] for w in words)}")

    # ---- timeline (in beats) ----
    hook_beats = to_bar(beats_for("hook", lines["hook"]["duration"]))
    season_ids = [l["id"] for l in script["lines"] if l["id"].isdigit()]
    season_beats = [beats_for("season", lines[i]["duration"]) for i in season_ids]
    season_beats[-1] += to_bar(sum(season_beats)) - sum(season_beats)  # land the tally on a bar
    tally_beats = to_bar(beats_for("tally", lines["tally"]["duration"]))
    outro_beats = to_bar(beats_for("outro", lines["outro"]["duration"]))

    cursor = 0
    sections = {}
    for name, beats in [("hook", hook_beats), ("seasons", sum(season_beats)), ("tally", tally_beats), ("outro", outro_beats)]:
        sections[name] = {"start": cursor, "beats": beats}
        cursor += beats

    seasons = []
    s_cursor = sections["seasons"]["start"]
    for sid, beats in zip(season_ids, season_beats):
        seasons.append({"year": int(sid), "start": s_cursor, "beats": beats})
        s_cursor += beats

    cues = [{"id": "hook", "at": sections["hook"]["start"] * BEAT + VO_LEAD["hook"]}]
    cues += [{"id": str(s["year"]), "at": s["start"] * BEAT + VO_LEAD["season"]} for s in seasons]
    cues += [{"id": "tally", "at": sections["tally"]["start"] * BEAT + VO_LEAD["tally"]}]
    cues += [{"id": "outro", "at": sections["outro"]["start"] * BEAT + VO_LEAD["outro"]}]
    for c in cues:
        c["at"] = round(c["at"], 3)
        c.update(lines[c["id"]])

    timeline = {"bpm": BPM, "totalBeats": cursor, "sections": sections, "seasons": seasons, "vo": cues}
    (ROOT / "src" / "timeline.json").write_text(json.dumps(timeline, indent=1))
    print(f"total {cursor} beats = {cursor * BEAT:.1f}s (hook {hook_beats}, seasons {sum(season_beats)}, tally {tally_beats}, outro {outro_beats})")


if __name__ == "__main__":
    main()

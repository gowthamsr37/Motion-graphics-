"""Narration + scene timeline for "When The Scoreboard Went Silent".

Usage (venv with kokoro-onnx soundfile faster-whisper):
    python scripts/gen-voice.py --model <dir with model.onnx + voices.npz> --whisper <faster-whisper dir>

Each scene lasts: lead-in (board opens) + narration + hold (reading time / dramatic pause).
Writes public/vo/<scene>.wav and src/timeline.json (seconds, plus word timings for syncing numbers to speech).
"""
import argparse
import json
import pathlib

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent


def trim(audio, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--whisper", required=True)
    args = ap.parse_args()
    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    model = pathlib.Path(args.model)
    tts = Kokoro(str(model / "model.onnx"), str(model / "voices.npz"))
    from faster_whisper import WhisperModel

    asr = WhisperModel(args.whisper, device="cpu", compute_type="int8")
    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)

    cursor = 0.0
    scenes = []
    for sc in script["scenes"]:
        parts = []
        seg_times = []
        t = 0.0
        for seg in sc["segments"]:  # segments let us place natural pauses between sentences
            if "phonemes" in seg:
                a, sr = tts.create(seg["phonemes"], voice=script["voice"], speed=sc.get("speed", script["speed"]), is_phonemes=True)
            else:
                a, sr = tts.create(seg["text"], voice=script["voice"], speed=sc.get("speed", script["speed"]), lang="en-us")
            clip = trim(np.asarray(a, dtype=np.float32), sr)
            parts.append(clip)
            seg_times.append({"caption": seg["caption"], "s": round(t, 3), "e": round(t + len(clip) / sr, 3)})
            t += len(clip) / sr + int(seg.get("pause", 0.35) * sr) / sr
            parts.append(np.zeros(int(seg.get("pause", 0.35) * sr), dtype=np.float32))
        audio = np.concatenate(parts[:-1])
        audio = audio * (0.9 / max(1e-6, np.abs(audio).max()))
        sf.write(out / f"{sc['id']}.wav", audio, sr, subtype="PCM_16")
        dur = len(audio) / sr
        n = int(len(audio) * 16000 / sr)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
        segs, _ = asr.transcribe(a16, language="en", word_timestamps=True, beam_size=5)
        words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
        start = cursor
        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "start": round(start, 3), "duration": round(length, 3),
                       "vo": {"at": round(start + sc["lead"], 3), "duration": round(dur, 3), "words": words, "segments": seg_times}})
        cursor += length
        print(f"{sc['id']}: {dur:5.2f}s speech, scene {length:5.2f}s | {' '.join(w['w'] for w in words)}")
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}, indent=1))
    print(f"total {cursor:.1f}s")


if __name__ == "__main__":
    main()

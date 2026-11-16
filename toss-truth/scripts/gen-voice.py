"""Narration + beat-quantised timeline for "Win the toss, win the match?".

Usage (venv with kokoro-onnx, soundfile, faster-whisper):
    python scripts/gen-voice.py --kokoro <dir with kokoro-v1.0.onnx + voices-v1.0.bin> --whisper <faster-whisper model dir>

For every scene: synthesise each line with Kokoro, join them with the scripted pauses, transcribe the
result with faster-whisper for word timings, then align the on-screen caption words ("show") to the
spoken words so every caption token knows when it is said. Scene lengths are rounded up to whole
music beats so cuts land on the beat.

Writes public/vo/<scene>.wav and src/timeline.json (all times in seconds).
"""
import argparse
import difflib
import json
import math
import pathlib
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent


def trim(audio, sr, thresh=0.008, pad=0.03):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))]


def norm(w):
    w = w.lower().replace("’", "'")
    w = re.sub(r"[^a-z0-9.']", "", w)
    return w.strip(".'")


def align(tokens, words):
    """Give every caption token a start/end from whisper's words (difflib on normalised text)."""
    a = [norm(t["t"]) for t in tokens]
    b = [norm(w["w"]) for w in words]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                tokens[i1 + k]["s"], tokens[i1 + k]["e"] = words[j1 + k]["s"], words[j1 + k]["e"]
        elif op == "replace" and j2 > j1:
            # spread the replaced span's time evenly over the caption tokens
            s, e = words[j1]["s"], words[j2 - 1]["e"]
            n = i2 - i1
            for k in range(n):
                tokens[i1 + k]["s"] = round(s + (e - s) * k / n, 3)
                tokens[i1 + k]["e"] = round(s + (e - s) * (k + 1) / n, 3)
    # anything still unmatched: interpolate between neighbours
    for i, t in enumerate(tokens):
        if "s" in t:
            continue
        prev = next((tokens[j]["e"] for j in range(i - 1, -1, -1) if "e" in tokens[j]), 0.0)
        nxt = next((tokens[j]["s"] for j in range(i + 1, len(tokens)) if "s" in tokens[j]), prev + 0.3)
        t["s"], t["e"] = round(prev, 3), round(max(prev + 0.05, nxt), 3)
    return tokens


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kokoro", required=True)
    ap.add_argument("--whisper", required=True)
    args = ap.parse_args()
    cfg = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    kdir = pathlib.Path(args.kokoro)
    tts = Kokoro(str(kdir / "kokoro-v1.0.onnx"), str(kdir / "voices-v1.0.bin"))
    from faster_whisper import WhisperModel

    asr = WhisperModel(args.whisper, device="cpu", compute_type="int8")
    beat = 60.0 / cfg["bpm"]
    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)

    cursor = 0.0
    scenes = []
    for sc in cfg["scenes"]:
        parts, lines, tokens = [], [], []
        t = 0.0
        sr = 24000
        for li, line in enumerate(sc["lines"]):
            ph = tts.tokenizer.phonemize(line["say"], cfg["lang"])
            for a_, b_ in cfg.get("fix", []):
                ph = ph.replace(a_, b_)
            audio, sr = tts.create(ph, voice=cfg["voice"], speed=sc.get("speed", cfg["speed"]), is_phonemes=True)
            clip = trim(np.asarray(audio, dtype=np.float32), sr)
            parts.append(clip)
            lines.append({"show": line["show"], "s": round(t, 3), "e": round(t + len(clip) / sr, 3)})
            tokens += [{"t": w, "line": li} for w in line["show"].split()]
            pause = line.get("pause", 0.3)
            t += len(clip) / sr + pause
            parts.append(np.zeros(int(pause * sr), dtype=np.float32))
        audio = np.concatenate(parts[:-1])
        audio = audio * (0.92 / max(1e-6, float(np.abs(audio).max())))
        sf.write(out / f"{sc['id']}.wav", audio, sr, subtype="PCM_16")
        dur = len(audio) / sr

        n16 = int(len(audio) * 16000 / sr)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n16), np.arange(len(audio)), audio).astype(np.float32)
        segs, _ = asr.transcribe(a16, language="en", word_timestamps=True, beam_size=5)
        words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
        tokens = align(tokens, words)
        # keep tokens inside their own line's span (whisper can drift across a pause)
        for tk in tokens:
            ln = lines[tk["line"]]
            tk["s"] = round(min(max(tk["s"], ln["s"]), ln["e"]), 3)
            tk["e"] = round(min(max(tk["e"], tk["s"] + 0.04), ln["e"] + 0.05), 3)

        raw = sc["lead"] + dur + sc["hold"]
        length = math.ceil(raw / beat - 1e-6) * beat
        scenes.append({
            "id": sc["id"], "start": round(cursor, 3), "duration": round(length, 3),
            "vo": {"at": round(cursor + sc["lead"], 3), "duration": round(dur, 3)},
            "lines": lines, "tokens": tokens, "heard": " ".join(w["w"] for w in words),
        })
        cursor += length
        print(f"{sc['id']:8s} speech {dur:5.2f}s scene {length:5.2f}s | {' '.join(w['w'] for w in words)}")
    timeline = {"bpm": cfg["bpm"], "total": round(cursor, 3), "scenes": scenes}
    (ROOT / "src" / "timeline.json").write_text(json.dumps(timeline, indent=1))
    print(f"total {cursor:.2f}s")


if __name__ == "__main__":
    main()

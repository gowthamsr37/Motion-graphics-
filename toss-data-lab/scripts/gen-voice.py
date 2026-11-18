"""Narration + scene timeline for "Data Lab #01: the toss".

Usage (venv with kokoro-onnx + soundfile):
    python scripts/gen-voice.py --model <dir with model.onnx + voices.npz>

Each sentence is synthesized on its own, so sentence boundaries are exact. Word timings inside a
sentence are estimated from each word's share of the sentence's phonemes (no ASR model needed).
Each scene lasts: lead-in + narration + hold. Writes public/vo/<scene>.wav and src/timeline.json.
"""
import argparse
import json
import pathlib
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent


def trim(audio, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))]


def word_times(caption, phonemes, dur):
    """Spread the caption's words over the clip by phoneme share (punctuation adds a short beat)."""
    words = caption.split()
    groups = [g for g in re.split(r"\s+", phonemes.strip()) if g]
    weights = []
    if len(groups) == len(words):
        weights = [len(re.sub(r"[ˈˌ]", "", g)) + 1.5 for g in groups]
    else:  # spoken text differs from caption (numbers written as digits): fall back to letter counts
        weights = [len(re.sub(r"[^A-Za-z0-9]", "", w)) * (2.2 if re.search(r"\d", w) else 1) + 1.5 for w in words]
    for i, w in enumerate(words):
        if re.search(r"[,.:;?!]$", w):
            weights[i] += 2
    total = sum(weights)
    t, out = 0.0, []
    for w, k in zip(words, weights):
        d = dur * k / total
        out.append({"w": w, "s": round(t, 3), "e": round(t + d * 0.92, 3)})
        t += d
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    args = ap.parse_args()
    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    model = pathlib.Path(args.model)
    tts = Kokoro(str(model / "model.onnx"), str(model / "voices.npz"))
    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)

    cursor = 0.0
    scenes = []
    for sc in script["scenes"]:
        parts, seg_times, words = [], [], []
        t = 0.0
        for seg in sc["segments"]:
            lang = seg.get("lang", script.get("lang", "en-us"))
            ph = tts.tokenizer.phonemize(seg["text"], lang)
            for a_, b_ in script.get("fix", []):
                ph = ph.replace(a_, b_)
            a, sr = tts.create(ph, voice=script["voice"], speed=sc.get("speed", script["speed"]), is_phonemes=True)
            clip = trim(np.asarray(a, dtype=np.float32), sr)
            d = len(clip) / sr
            parts.append(clip)
            seg_times.append({"caption": seg["caption"], "s": round(t, 3), "e": round(t + d, 3)})
            words += [{**w, "s": round(w["s"] + t, 3), "e": round(w["e"] + t, 3)} for w in word_times(seg["caption"], ph, d)]
            pause = seg.get("pause", 0.35)
            parts.append(np.zeros(int(pause * sr), dtype=np.float32))
            t += d + int(pause * sr) / sr
            print(f"   {ph}")
        audio = np.concatenate(parts[:-1])
        audio = audio * (0.9 / max(1e-6, np.abs(audio).max()))
        sf.write(out / f"{sc['id']}.wav", audio, sr, subtype="PCM_16")
        dur = len(audio) / sr
        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "start": round(cursor, 3), "duration": round(length, 3),
                       "vo": {"at": round(cursor + sc["lead"], 3), "duration": round(dur, 3), "words": words, "segments": seg_times}})
        cursor += length
        print(f"{sc['id']}: {dur:5.2f}s speech, scene {length:5.2f}s")
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}, indent=1))
    print(f"total {cursor:.1f}s")


if __name__ == "__main__":
    main()

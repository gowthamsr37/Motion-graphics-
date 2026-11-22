"""Lip-sync data for the presenter: per-frame mouth opening (from the voice's loudness) and mouth shape (from Kokoro's
phonemes, spread across each sentence). Run after gen-voice.py.
Usage: <tts venv>/bin/python analysis/mouth.py   ->  src/mouth.json  {"fps": 30, "open": [0..100], "shape": [0..4]}
shape: 0 neutral/open vowel, 1 wide (i, e), 2 round (o, u, w), 3 closed (m, b, p), 4 teeth (f, v)
"""
import json
import pathlib

import numpy as np
import soundfile as sf
from kokoro_onnx.tokenizer import Tokenizer

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
TL = json.load(open(ROOT / "src" / "timeline.json"))
VO = json.load(open(ROOT / "scripts" / "voiceover.json"))
tok = Tokenizer()
N = int(round(TL["total"] * FPS))
open_ = np.zeros(N)
shape = np.zeros(N, dtype=int)

CLS = {}
for ch in "iɪeɛæj":
    CLS[ch] = 1
for ch in "oɔuʊw":
    CLS[ch] = 2
for ch in "mbp":
    CLS[ch] = 3
for ch in "fv":
    CLS[ch] = 4
for ch in "ɑʌəɚaɜ":
    CLS[ch] = 0

# loudness reference across all narration
waves = {}
for s in TL["scenes"]:
    a, sr = sf.read(ROOT / "public" / "vo" / f'{s["id"]}.wav')
    if a.ndim > 1:
        a = a.mean(axis=1)
    waves[s["id"]] = (a, sr)
allr = np.concatenate([np.sqrt(np.convolve(a ** 2, np.ones(800) / 800, mode="same")) for a, _ in waves.values()])
ref = 20 * np.log10(np.percentile(allr[allr > 1e-4], 95) + 1e-9)

segs = {s["id"]: s for s in VO["scenes"]}
for s in TL["scenes"]:
    a, sr = waves[s["id"]]
    at = s["vo"]["at"]
    for f in range(int(at * FPS), min(N, int((at + len(a) / sr) * FPS) + 1)):
        c = int((f / FPS - at) * sr)
        w = a[max(0, c - 600): c + 600]
        if len(w) == 0:
            continue
        db = 20 * np.log10(np.sqrt(np.mean(w ** 2)) + 1e-9)
        open_[f] = np.clip((db - (ref - 28)) / 24, 0, 1) ** 1.25
    # shapes: spread each sentence's phonemes over its spoken span
    for g, sg in zip(s["vo"]["segments"], segs[s["id"]]["segments"]):
        ph = tok.phonemize(sg["text"], "en-us")
        for x, y in VO.get("fix", []):
            ph = ph.replace(x, y)
        chars = [CLS[c] for c in ph if c in CLS]
        if not chars:
            continue
        f0, f1 = int((at + g["s"]) * FPS), int((at + g["e"]) * FPS)
        for f in range(f0, min(N, f1 + 1)):
            k = int((f - f0) / max(1, f1 - f0) * (len(chars) - 1))
            shape[f] = chars[k]

# smoothing: quick to open, softer to close
sm = np.zeros(N)
for i in range(N):
    prev = sm[i - 1] if i else 0
    k = 0.65 if open_[i] > prev else 0.4
    sm[i] = prev + k * (open_[i] - prev)
json.dump({"fps": FPS, "open": [int(round(v * 100)) for v in sm], "shape": [int(v) for v in shape]}, open(ROOT / "src" / "mouth.json", "w"), separators=(",", ":"))
print("frames", N, "speaking", int((sm > 0.08).sum()), "shape counts", np.bincount(shape, minlength=5).tolist())

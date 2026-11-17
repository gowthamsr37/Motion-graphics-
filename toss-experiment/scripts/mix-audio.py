"""Mix the Reel's audio exactly as src/Main.tsx does (narration + ducked score + SFX) → out/mix.wav.

Used with chunked, muted video renders: render the picture in pieces, mix the sound once, then mux.
Main.tsx: narration at volume 1 on its frames; score × 0.6 × duck(frame); sfx × 0.9.
duck: 0.95 open → 0.40 under narration, eased in/out over fps/4 frames around each cue.
"""
import json
import pathlib

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS, SR = 30, 48000
tl = json.loads((ROOT / "src" / "timeline.json").read_text())
total_f = int(round(tl["total"] * FPS))
N = int(round(total_f / FPS * SR))


def bezier(x1, y1, x2, y2):
    def f(t):
        # solve x(u) = t by bisection, return y(u)
        lo, hi = np.zeros_like(t), np.ones_like(t)
        for _ in range(40):
            u = (lo + hi) / 2
            x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3
            lo = np.where(x < t, u, lo)
            hi = np.where(x < t, hi, u)
        u = (lo + hi) / 2
        return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3
    return f


ease = bezier(0.65, 0, 0.35, 1)
cues = [(round(s["vo"]["at"] * FPS), round(s["vo"]["duration"] * FPS)) for s in tl["scenes"]]
ramp = round(FPS / 4)
frames = np.arange(total_f + 1, dtype=np.float64)
d = np.zeros_like(frames)
for f0, du in cues:
    a, b = f0 - 2, f0 + du + 2
    up = np.clip((frames - (a - ramp)) / ramp, 0, 1)
    down = np.clip(((b + ramp) - frames) / ramp, 0, 1)
    k = np.where(frames < a, ease(up), np.where(frames > b, ease(down), 1.0))
    k = np.where((frames < a - ramp) | (frames > b + ramp), 0, k)
    d = np.maximum(d, k)
vol_f = (0.95 + (0.40 - 0.95) * d) * 0.6
vol = np.interp(np.arange(N) / SR * FPS, frames, vol_f)

out = np.zeros((N, 2), dtype=np.float64)
score, _ = sf.read(ROOT / "public" / "audio" / "score.wav")
sfx, _ = sf.read(ROOT / "public" / "audio" / "sfx.wav")
out[: min(N, len(score))] += score[:N] * vol[: min(N, len(score)), None]
out[: min(N, len(sfx))] += sfx[:N] * 0.9
for s in tl["scenes"]:
    a, sr = sf.read(ROOT / "public" / "vo" / f"{s['id']}.wav")
    a = np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a)
    st = int(round(round(s["vo"]["at"] * FPS) / FPS * SR))
    n = min(len(a), N - st)
    out[st : st + n] += a[:n, None]
peak = np.abs(out).max()
if peak > 0.98:
    out *= 0.98 / peak
sf.write(ROOT / "out" / "mix.wav", out.astype(np.float32), SR, subtype="PCM_24")
print(f"mix.wav {N / SR:.2f}s peak {peak:.2f}")

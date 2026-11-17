"""Export the narration on its own, aligned to the video timeline, plus an .srt subtitle file.

Usage: python scripts/export-narration.py   (numpy + soundfile; ffmpeg on PATH)
Writes out/Toss_Experiment_Narration.wav (48 kHz, loudness-normalised speech) and
out/Toss_Experiment_Subtitles.srt.
"""
import json
import pathlib
import subprocess

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)
FPS, SR = 30, 48000
tl = json.loads((ROOT / "src" / "timeline.json").read_text())
total = int(round(tl["total"] * FPS))
mix = np.zeros(int(total / FPS * SR) + SR, dtype=np.float32)
srt = []


def ts(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


n = 1
for s in tl["scenes"]:
    a, sr = sf.read(ROOT / "public" / "vo" / f"{s['id']}.wav", dtype="float32")
    a = np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a).astype(np.float32)
    start = int(round(round(s["vo"]["at"] * FPS) / FPS * SR))  # same frame-rounding as the video
    mix[start : start + len(a)] += a
    for g in s["vo"]["segments"]:
        t0 = round(s["vo"]["at"] * FPS) / FPS + g["s"]
        t1 = round(s["vo"]["at"] * FPS) / FPS + g["e"]
        srt.append(f"{n}\n{ts(t0)} --> {ts(t1)}\n{g['caption']}\n")
        n += 1
mix = mix[: int(total / FPS * SR)]
raw = OUT / "narration_raw.wav"
sf.write(raw, mix, SR, subtype="PCM_16")
final = OUT / "Toss_Experiment_Narration.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", str(final)], check=True)
raw.unlink()
(OUT / "Toss_Experiment_Subtitles.srt").write_text("\n".join(srt), encoding="utf-8")
print("wrote", final, "and subtitles:", n - 1, "cues")

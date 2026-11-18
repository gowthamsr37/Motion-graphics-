"""subtitles.srt from src/timeline.json: one cue per narrated sentence, in film time.

Usage: python3 scripts/gen-srt.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
tl = json.loads((ROOT / "src" / "timeline.json").read_text())

cues = []
for sc in tl["scenes"]:
    at = sc["vo"]["at"]
    for seg in sc["vo"]["segments"]:
        cues.append([at + seg["s"], at + seg["e"] + 0.25, " ".join(seg["chunks"])])
for i in range(len(cues) - 1):  # never overlap the next sentence
    cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.05)


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


out = "\n".join(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{text}\n" for i, (a, b, text) in enumerate(cues))
(ROOT / "subtitles.srt").write_text(out)
print(f"{len(cues)} cues, last ends {cues[-1][1]:.2f}s")

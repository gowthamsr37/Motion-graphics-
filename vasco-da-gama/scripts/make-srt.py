"""Write YouTube subtitles (captions.srt) from src/timeline.json."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
tl = json.loads((ROOT / "src" / "timeline.json").read_text())
ts = lambda t: f"{int(t//3600):02d}:{int(t%3600//60):02d}:{int(t%60):02d},{int(round((t%1)*1000)):03d}"
rows, n = [], 1
for s in tl["scenes"]:
    for g in s["vo"]["segments"]:
        a, b = s["vo"]["at"] + g["s"], s["vo"]["at"] + g["e"] + 0.25
        rows.append(f"{n}\n{ts(a)} --> {ts(b)}\n{g['caption']}\n"); n += 1
(ROOT / "captions.srt").write_text("\n".join(rows))
print(n - 1, "cues")

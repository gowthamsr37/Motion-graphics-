"""Write out/IQR_Explained.srt (the exact subtitle pages shown on screen) and the narration script with timestamps."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
tl = json.loads((ROOT / "src" / "timeline.json").read_text())


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


pages = []
for s in tl["scenes"]:
    for c in s["vo"]["captions"]:
        pages.append((s["vo"]["at"] + c["s"], s["vo"]["at"] + c["e"], " ".join(w["w"] for w in c["words"])))
lines = []
for i, (a, b, text) in enumerate(pages, 1):
    b = min(b, pages[i][0] - 0.01) if i < len(pages) else b
    lines += [str(i), f"{ts(a)} --> {ts(b)}", text, ""]
out = ROOT / "out"
out.mkdir(exist_ok=True)
(out / "IQR_Explained.srt").write_text("\n".join(lines))
print(f"{len(pages)} subtitle pages")

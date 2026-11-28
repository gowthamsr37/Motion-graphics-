"""Tile frame PNGs into a labelled contact sheet: python3 scripts/sheet.py out.png a.png b.png ..."""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert("RGB") for f in files]
w, h = ims[0].size
sheet = Image.new("RGB", (w * len(ims) + 10 * (len(ims) - 1), h + 40), (40, 40, 40))
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    sheet.paste(im, (i * (w + 10), 40))
    d.text((i * (w + 10) + 8, 10), f.split("/")[-1], fill=(255, 255, 0))
sheet.save(out)

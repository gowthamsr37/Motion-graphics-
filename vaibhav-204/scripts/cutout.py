# Background removal with BiRefNet (ONNX): writes RGBA cut-outs.
import sys, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
model, out_dir, *imgs = sys.argv[1:]
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
inp = sess.get_inputs()[0]; size = inp.shape[2] if isinstance(inp.shape[2], int) else 1024
for path in imgs:
    im = Image.open(path).convert("RGB")
    x = np.asarray(im.resize((size, size), Image.BICUBIC), dtype=np.float32) / 255.0
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    y = sess.run(None, {inp.name: x})[-1][0, 0]
    y = 1 / (1 + np.exp(-y)) if y.min() < 0 or y.max() > 1 else y
    m = Image.fromarray((np.clip(y, 0, 1) * 255).astype(np.uint8)).resize(im.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(0.8))
    rgba = im.copy(); rgba.putalpha(m)
    bbox = m.point(lambda v: 255 if v > 24 else 0).getbbox()
    name = path.split("/")[-1].rsplit(".", 1)[0]
    rgba.save(f"{out_dir}/{name}.png"); print(name, im.size, "bbox", bbox)

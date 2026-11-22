#!/usr/bin/env bash
# One-time setup of the Python tools: Kokoro TTS (voice), faster-whisper (word timings), BiRefNet (photo cut-outs).
# Installs into $BTS_TOOLS (default ~/.cache/bts-tools). Safe to re-run: finished steps are skipped. Needs ~450 MB.
set -euo pipefail
T=${BTS_TOOLS:-$HOME/.cache/bts-tools}
HF=https://huggingface.co
mkdir -p "$T/kokoro/voices" "$T/whisper"
get() { [ -s "$2" ] || { echo "↓ $(basename "$2")"; curl -sSfL --retry 3 --max-time 900 -o "$2.part" "$1" && mv "$2.part" "$2"; }; }

[ -x "$T/venv/bin/python" ] || python3 -m venv "$T/venv"
"$T/venv/bin/pip" install -q kokoro-onnx==0.6.1 faster-whisper==1.2.1 soundfile numpy pillow onnxruntime

# Kokoro-82M (ONNX). am_michael is the series narrator; a few alternates for variety.
get "$HF/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/onnx/model.onnx" "$T/kokoro/model.onnx"
for v in am_michael af_heart am_fenrir am_puck bm_george bm_lewis af_bella bf_emma; do
  get "$HF/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices/$v.bin" "$T/kokoro/voices/$v.bin"
done
"$T/venv/bin/python" -I - "$T/kokoro" <<'PY'
import glob, os, sys, numpy as np
d = sys.argv[1]
voices = {os.path.basename(p)[:-4]: np.fromfile(p, dtype=np.float32).reshape(-1, 1, 256) for p in glob.glob(f"{d}/voices/*.bin")}
np.savez(f"{d}/voices.npz", **voices)
print("voices:", ", ".join(sorted(voices)))
PY

# faster-whisper base.en for word timings
for f in config.json model.bin tokenizer.json vocabulary.txt; do
  get "$HF/Systran/faster-whisper-base.en/resolve/main/$f" "$T/whisper/$f"
done

# BiRefNet lite for background removal (scripts/cutout.py)
get "$HF/onnx-community/BiRefNet_lite-ONNX/resolve/main/onnx/model.onnx" "$T/birefnet.onnx"

echo "tools ready in $T"

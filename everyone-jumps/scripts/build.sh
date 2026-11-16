#!/usr/bin/env bash
# Rebuild everything: score + SFX, bundle, render, then master to -14 LUFS for YouTube.
# Usage: BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
# The Earth is WebGL: in headless/CPU-only environments use --gl=swangle (set below).
set -euo pipefail
cd "$(dirname "$0")/.."
B=${BROWSER:+--browser-executable=$BROWSER}
node scripts/gen-audio.mjs > /dev/null
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir out/bundle | tail -1
npx remotion render out/bundle EveryoneJumps out/raw.mp4 --codec h264 --crf 16 --concurrency 4 --gl=swangle --timeout=120000 --overwrite $B > out/render.log 2>&1
ffmpeg -hide_banner -i out/raw.mp4 -af alimiter=limit=0.8:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
python3 - <<'PY'
import json, subprocess
m = json.load(open("out/loudnorm.json"))
af = (f"alimiter=limit=0.8:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/raw.mp4", "-c:v", "copy", "-af", af, "-ar", "48000", "-ac", "2",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "out/What_If_Everyone_Jumped.mp4"], check=True)
PY
ffmpeg -hide_banner -i out/What_If_Everyone_Jumped.mp4 -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):"

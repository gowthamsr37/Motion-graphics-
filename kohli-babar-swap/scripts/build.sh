#!/usr/bin/env bash
# Rebuild everything: score + SFX, bundle, render, cover still, then master to -14 LUFS for Instagram.
# Usage: BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
set -euo pipefail
NAME=${NAME:-Beyond_The_Scoreboard_The_Swap}   # output file name (new-reel.sh sets this)
cd "$(dirname "$0")/.."
mkdir -p out
B=${BROWSER:+--browser-executable=$BROWSER}
node scripts/gen-audio.mjs > /dev/null
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir out/bundle | tail -1
npx remotion render out/bundle Film out/raw.mp4 --codec h264 --crf 16 --concurrency 4 --overwrite $B > out/render.log 2>&1
npx remotion still out/bundle Cover out/${NAME}_Cover.png --overwrite $B | tail -1
ffmpeg -hide_banner -i out/raw.mp4 -af alimiter=limit=0.7:level=false:attack=3:release=60,loudnorm=I=-14:TP=-2:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
NAME="$NAME" python3 - <<'PY'
import json, os, subprocess
NAME = os.environ["NAME"]
m = json.load(open("out/loudnorm.json"))
af = (f"alimiter=limit=0.7:level=false:attack=3:release=60,loudnorm=I=-14:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/raw.mp4", "-c:v", "copy", "-af", af, "-ar", "48000", "-ac", "2",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", f"out/{NAME}.mp4"], check=True)
PY
ffmpeg -hide_banner -i out/$NAME.mp4 -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):"

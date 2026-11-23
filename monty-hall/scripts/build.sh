#!/usr/bin/env bash
# Rebuild everything: score + SFX, bundle, render, cover still, then master to -14 LUFS for Instagram.
# Usage: BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
B=${BROWSER:+--browser-executable=$BROWSER}
node scripts/gen-audio.mjs > /dev/null
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir out/bundle | tail -1
npx remotion render out/bundle MontyHall out/raw.mp4 --codec h264 --crf 16 --concurrency 4 --overwrite $B > out/render.log 2>&1
npx remotion still out/bundle Cover out/Monty_Hall_Cover.png --overwrite $B | tail -1
ffmpeg -hide_banner -i out/raw.mp4 -af alimiter=limit=0.7:level=false:attack=3:release=60,loudnorm=I=-14:TP=-2:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
python3 - <<'PY'
import json, subprocess
m = json.load(open("out/loudnorm.json"))
af = (f"alimiter=limit=0.7:level=false:attack=3:release=60,loudnorm=I=-14:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.7:level=false:attack=0.5:release=50")  # keeps true peak at about -2 dBTP
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/raw.mp4", "-c:v", "copy", "-af", af, "-ar", "48000", "-ac", "2",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "out/Monty_Hall.mp4"], check=True)
# narration-only stem and an .srt of the on-screen subtitles
subprocess.run(["python3", "scripts/export-srt.py"], check=True)
PY
ffmpeg -hide_banner -i out/Monty_Hall.mp4 -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):"

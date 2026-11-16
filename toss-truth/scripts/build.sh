#!/usr/bin/env bash
# Full rebuild: synthesise score + SFX, bundle, render, cover still, master to -14 LUFS / -1.5 dBTP.
# Usage: BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
# (Narration is only regenerated when the script changes: python scripts/gen-voice.py --kokoro <dir> --whisper <dir>)
set -euo pipefail
cd "$(dirname "$0")/.."
B=${BROWSER:+--browser-executable=$BROWSER}
mkdir -p out
node scripts/gen-audio.mjs
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir out/bundle | tail -1
npx remotion render out/bundle TossTruth out/raw.mp4 --codec h264 --crf 16 --concurrency 4 --overwrite $B > out/render.log 2>&1
npx remotion still out/bundle Cover out/Toss_Truth_Cover.png --overwrite $B | tail -1
# two-pass loudness normalisation for Instagram / Shorts
ffmpeg -hide_banner -i out/raw.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
AF=$(python3 -c "import json; m=json.load(open('out/loudnorm.json')); print(f\"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true\")")
ffmpeg -v error -y -i out/raw.mp4 -c:v copy -af "$AF" -ar 48000 -ac 2 -c:a aac -b:a 256k -movflags +faststart out/Toss_Truth_Reel.mp4
ffmpeg -hide_banner -i out/Toss_Truth_Reel.mp4 -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):"

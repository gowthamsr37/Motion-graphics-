#!/usr/bin/env bash
# Rebuild everything: score + SFX, bundle, render, cover, master to -14 LUFS, separate narration.
# Usage: BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
# The 3D scenes are WebGL: on machines without a GPU, render with --gl=swangle (as below).
set -euo pipefail
cd "$(dirname "$0")/.."
B=${BROWSER:+--browser-executable=$BROWSER}
mkdir -p out
node scripts/gen-audio.mjs > /dev/null
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir out/bundle | tail -1
npx remotion render out/bundle TossExperiment out/raw.mp4 --codec h264 --crf 16 --concurrency 4 --gl=swangle --timeout=120000 --overwrite $B > out/render.log 2>&1
npx remotion still out/bundle Cover out/Toss_Experiment_Cover.png --gl=swangle --overwrite $B | tail -1
ffmpeg -hide_banner -i out/raw.mp4 -af alimiter=limit=0.8:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
python3 - <<'PY'
import json, subprocess
m = json.load(open("out/loudnorm.json"))
af = (f"alimiter=limit=0.8:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/raw.mp4", "-c:v", "copy", "-af", af, "-ar", "48000", "-ac", "2",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "out/Beyond_The_Scoreboard_Toss_Experiment.mp4"], check=True)
PY
python3 scripts/export-narration.py
ffmpeg -hide_banner -i out/Beyond_The_Scoreboard_Toss_Experiment.mp4 -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):"

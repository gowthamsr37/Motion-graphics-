#!/usr/bin/env bash
# Rebuild everything: score + SFX, bundle, render the picture in resumable chunks, mix the sound,
# master to -14 LUFS, render the cover, export the narration + subtitles.
# Usage: BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
# The 3D scenes are WebGL: on machines without a GPU, render with --gl=swangle (as below).
set -euo pipefail
cd "$(dirname "$0")/.."
B=${BROWSER:+--browser-executable=$BROWSER}
mkdir -p out
node scripts/gen-audio.mjs > /dev/null
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir out/bundle | tail -1
# picture: four muted chunks (a failed or interrupted chunk can be re-run on its own)
: > out/chunks.txt
for r in 0-999 1000-1999 2000-2999 3000-3871; do
  [ -s "out/chunk_$r.mp4" ] || npx remotion render out/bundle TossExperiment "out/chunk_$r.mp4" --frames=$r --codec h264 --crf 16 --muted --concurrency 4 --gl=swangle --timeout=120000 --overwrite $B > "out/render_$r.log" 2>&1
  echo "file 'chunk_$r.mp4'" >> out/chunks.txt
done
ffmpeg -v error -y -f concat -safe 0 -i out/chunks.txt -c copy out/picture.mp4
# sound: the same mix as src/Main.tsx, then a limiter and two-pass loudness normalisation
python3 scripts/mix-audio.py
AF="alimiter=limit=0.8:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11"
ffmpeg -hide_banner -i out/mix.wav -af "$AF:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
python3 - <<'PY'
import json, subprocess
m = json.load(open("out/loudnorm.json"))
af = ("alimiter=limit=0.8:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:"
      f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/picture.mp4", "-i", "out/mix.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                "-af", af, "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart",
                "out/Beyond_The_Scoreboard_Toss_Experiment.mp4"], check=True)
PY
npx remotion still out/bundle Cover out/Toss_Experiment_Cover.png --gl=swangle --overwrite $B | tail -1
python3 scripts/export-narration.py
ffmpeg -hide_banner -i out/Beyond_The_Scoreboard_Toss_Experiment.mp4 -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):"

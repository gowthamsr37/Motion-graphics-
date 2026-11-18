#!/usr/bin/env bash
# Render the film in resumable chunks (software WebGL is slow; a chunk that already exists is skipped),
# then join them losslessly. Usage: bash scripts/render-chunks.sh [chunkFrames]
set -uo pipefail
cd "$(dirname "$0")/.."
BROWSER=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
STEP=${1:-520}
TOTAL=$(node -e 'const t=require("./src/timeline.json"); console.log(Math.round(t.total*30))')
mkdir -p out/chunks
[ -d out/bundle-render ] || npx remotion bundle src/index.ts --out-dir out/bundle-render > /dev/null
i=0
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=$(printf "out/chunks/c%02d.mp4" $i)
  if [ ! -s "$f" ]; then
    echo "$(date +%T) chunk $i frames $a-$b"
    npx remotion render out/bundle-render Film "$f.tmp.mp4" --frames=$a-$b --codec h264 --crf 15 --muted --gl=swangle \
      --concurrency 4 --browser-executable="$BROWSER" --log=error --overwrite > out/chunks/c$i.log 2>&1 && mv "$f.tmp.mp4" "$f" || { echo "chunk $i FAILED"; tail -5 out/chunks/c$i.log; exit 1; }
  fi
  i=$((i+1))
done
ls out/chunks/c*.mp4 | sed "s/^/file '/; s/\$/'/; s/out\/chunks\///" > out/chunks/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/video-silent.mp4 && echo "$(date +%T) joined: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/video-silent.mp4)s"

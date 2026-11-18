#!/usr/bin/env bash
# One-command rebuild: score + SFX → mix/master → 3D render (chunked, resumable) → mux → cover → deliverables.
# Narration is only regenerated when the script changes (needs the Kokoro + sherpa-onnx models, see README):
#   python scripts/gen-voice.py --kokoro <dir> --asr <dir>
set -euo pipefail
cd "$(dirname "$0")/.."
B=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
npx tsx scripts/gen-audio.ts
bash scripts/mix.sh
BROWSER=$B bash scripts/render-chunks.sh 520
mkdir -p out/deliver
ffmpeg -v error -y -i out/video-silent.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 19 -maxrate 14M -bufsize 28M \
  -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -af lowpass=f=17000:p=2 -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart \
  out/deliver/Beyond_The_Scoreboard_Does_The_Toss_Matter.mp4
npx remotion still out/bundle-render Cover out/deliver/Beyond_The_Scoreboard_Does_The_Toss_Matter_Cover.png --gl=swangle --browser-executable="$B" --overwrite
ffmpeg -v error -y -i public/vo/narration.wav -ar 48000 -c:a pcm_s16le out/deliver/narration.wav
cp subtitles.srt CAPTION.md out/deliver/
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact out/deliver/Beyond_The_Scoreboard_Does_The_Toss_Matter.mp4

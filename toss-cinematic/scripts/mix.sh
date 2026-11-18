#!/usr/bin/env bash
# Mix narration + music + effects and master to -14 LUFS / -1.5 dBTP (two-pass loudnorm). Writes out/mix.wav.
set -euo pipefail
cd "$(dirname "$0")/.."
MUSIC_DB=${MUSIC_DB:--9.5}
SFX_DB=${SFX_DB:--4}
G="[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0[vo];[1:a]volume=${MUSIC_DB}dB[mu];[2:a]volume=${SFX_DB}dB[fx];[vo][mu][fx]amix=inputs=3:normalize=0:duration=longest,alimiter=limit=0.8:level=false:attack=4:release=80"
ffmpeg -hide_banner -nostats -i public/vo/narration.wav -i public/audio/music.wav -i public/audio/sfx.wav -filter_complex "$G,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p' > out/loudnorm.json
python3 - "$G" <<'PY'
import json, subprocess, sys
m = json.load(open("out/loudnorm.json"))
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/vo/narration.wav", "-i", "public/audio/music.wav", "-i", "public/audio/sfx.wav",
                "-filter_complex", sys.argv[1] + "," + ln + ",aresample=48000", "-ac", "2", "-c:a", "pcm_s16le", "out/mix.wav"], check=True)
PY
ffmpeg -hide_banner -nostats -i out/mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak|LRA):" | tr -s ' '

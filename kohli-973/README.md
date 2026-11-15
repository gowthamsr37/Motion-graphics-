# Beyond The Scoreboard — "973: The Season That Almost Had Everything" (Virat Kohli, IPL 2016)

55.5-second Instagram Reel (1080×1920, 30 fps, H.264 + AAC 48 kHz stereo, −14 LUFS), built in Remotion on the
same Adelaide-style scoreboard system as "When The Scoreboard Went Silent".

Scenes: hook (27 from 1,000 · 8 from the trophy) → the season (973 · 16 inns · 81.08 · 152.03 · 4×100 · 7×50) →
century register (100* 63 GL, 108* 58 RPS, 109 55 GL, 113 50 KXIP) → 113 (50), 9 stitches, 15-over match →
cumulative runs to 919 and the Qualifier 1 duck (RCB still qualified) → the final (SRH 208/7 v RCB 200/7, Kohli 54 (35),
SRH won by 8) → legacy (973 · Orange Cap · runners-up · "Some seasons win trophies. Some seasons become history.").

Cumulative runs: 75, 154, 187, 267, 367, 381, 433, 541, 561, 568, 677, 752, 865, 919, 919, 973.

Narration: local Kokoro voice `hm_omega` (Hindi-trained male) reading English with British pronunciation rules and
hand-written phonemes for names and key words (`scripts/voiceover.json`).

Photo credit (caption): "Ashish Reddy and Shikhar Dhawan with the IPL trophy 2016" — Msnlalithprem, CC0, via Wikimedia Commons.

Deliverables: `out/Beyond_The_Scoreboard_Virat_Kohli_973.mp4`, `out/Beyond_The_Scoreboard_Kohli_973_Cover.png`
(`Cover` still), `out/Kohli_2016_Voiceover.mp3`.

Rebuild: `npm install && npm run audio && npm run render`, then master with ffmpeg loudnorm (see the Silent Scoreboard README);
cover: `npx remotion still src/index.ts Cover out/cover.png`.

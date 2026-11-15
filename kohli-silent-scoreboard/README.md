# Beyond The Scoreboard — "When The Scoreboard Went Silent" (Virat Kohli)

An 89-second Instagram Reel documentary (1080×1920, 30 fps, H.264 + AAC 48 kHz stereo), built in
[Remotion](https://remotion.dev). Everything on screen lives inside an Adelaide-Oval-style manual scoreboard:
timber panels that drop open, tin number plates that flip, status lamps, the board clock, a calendar-year
average chart, and a subtitle strip.

| # | Scene | What the board does |
|---|---|---|
| 1 | The hook | Board flickers on, plates spin and stop dead on **1021 DAYS** · without an international century |
| 2 | Before the silence | India v Bangladesh scorecard, Kohli **136**; a 2018 century photo fades to grey |
| 3 | Three years of struggle | Test average table + chart, one year per click: 68.00 → 19.33 → 28.21 → 26.50, "below 30" line |
| 4 | Weight of expectations | Test century counter 2020–22 stuck at 00, ticking clock |
| 5 | The twist | Format verdicts + Test v T20I bars (2021: 28.21 v 74.75 · 2022: 26.50 v 55.79) |
| 6 | First breakthrough | Asia Cup scorecard, **122 not out**; the days counter spins back 1021 → 0000 |
| 7 | One wait remained | Test drought Nov 2019 → Mar 2023; Ahmedabad scorecard **186**; counter 00 → 01 |
| 8 | Comeback in numbers | Chart extends to 2023 (55.92) in green |
| 9 | Ending | "Even the greatest struggle." → "Form can fade." → "Greatness is tested in the comeback." → brand |

## Facts used (calendar-year, not rolling)

| | Tests | Average | Check |
|---|---|---|---|
| 2019 | 8 | 68.00 | 612 runs ÷ 9 outs |
| 2020 | 3 | 19.33 | 116 ÷ 6 |
| 2021 | 11 | 28.21 | 536 ÷ 19 |
| 2022 | 6 | 26.50 | 265 ÷ 10 |
| 2023 | 8 | 55.92 | 671 ÷ 12 |

T20I: 2021 74.75 (299 ÷ 4), 2022 55.79 (781 ÷ 14). Last century before the drought: 136 v Bangladesh,
23 Nov 2019 (Eden Gardens). Drought ended: 122* v Afghanistan, Asia Cup, 8 Sep 2022 (1021 days, as reported
by the ICC). Test drought ended: 186 v Australia, Ahmedabad, 12 Mar 2023.

## Credits (paste into the Instagram caption)

```
Photos: "Virat Kohli after his century at Trent Bridge" (Aug 2018) by Dun.can, CC BY 2.0, via Wikimedia Commons ·
Ahmedabad Test, 9 Mar 2023: Prime Minister's Office, Government of India (GODL-India), via Wikimedia Commons.
Narration, music and sound design are original.
```

## Run it

```bash
npm install
npm run audio      # synthesizes public/audio/* (score, crowd, scoreboard SFX) from src/timeline.json
npm run render     # -> out/raw.mp4
ffmpeg -i out/raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -ac 2 -c:a aac -b:a 256k -movflags +faststart out/reel.mp4
```

`public/vo/*.wav` and `src/timeline.json` are committed. To change the narration, edit `scripts/voiceover.json`
(segments, captions, pauses, lead-in/hold per scene) and run `scripts/gen-voice.py` (Kokoro + faster-whisper,
see the IPL Champions README for model setup), then `npm run audio`. Scene lengths follow the narration.

## Where things live

- `src/data.ts` — every statistic shown. `src/timing.ts` — scene/word timing from the narration.
- `src/components/` — board, panels, number plates, chart, clock, photo plate, subtitle strip.
- `src/scenes/Act1–3.tsx` — the nine scenes. `src/Main.tsx` — layering and the sound mix.

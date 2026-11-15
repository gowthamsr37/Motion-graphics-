# Beyond The Scoreboard — India vs Pakistan: The Last-Ball Miracle (U19 Asia Cup Final, 14 Nov 2026)

A 68.8-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS with a −1.5 dBTP ceiling.
It is built in Remotion on the same Adelaide-style scoreboard system as the earlier Beyond The Scoreboard reels.
The hook "3 RUNS. 1 BALL. 1 WICKET." is on screen and spoken within the first 2 seconds.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Beyond_The_Scoreboard_India_Pakistan_U19.mp4` | the finished Reel: visuals, narration, score, crowd and SFX |
| `Beyond_The_Scoreboard_India_Pakistan_U19_Cover.png` | 1080×1920 cover; the headline sits inside the centre 1080×1440 profile-grid crop |
| `India_Pakistan_U19_Narration.mp3` | narration only, on the Reel's timeline (192 kbps, 48 kHz, −16 LUFS) |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Storyboard

| # | Time | Scene |
| --- | --- | --- |
| 1 | 0.0–7.3 s | Hook: three counters spin and stop on 3 RUNS / 1 BALL / 1 WICKET, then the board rewinds |
| 2 | 7.3–14.2 s | Pakistan 337/9 (Usman Khan 107, Abdul Qadir 80, Farhan Yousaf 60); INDIA TARGET 338 |
| 3 | 14.2–22.8 s | The chase: Sehwag 58, Lakshya 80, then eight wicket lamps and 252/8 |
| 4 | 22.8–33.3 s | Graph A milestone rail; BATTING AT NO. 10 MOHIT ULVA; 57-run ninth-wicket stand with Manal Chauhan; 309/9; ONE WICKET REMAINING |
| 5–6 | 33.3–56.6 s | Graph B, the final over, ball by ball: 8 off 6 → dot → wide → four singles → 3 off 1 → freeze → FOUR → INDIA WIN |
| 7 | 56.6–68.8 s | Champions board: 9th U19 Asia Cup title, MOHIT ULVA 49* (26), "Heroes are not always at the top of the scorecard." (spoken), brand lockup |

## Facts used, and where they come from

- **Pakistan 337/9.** Usman Khan 107 (111), Abdul Qadir 80 (54), Farhan Yousaf (c) 60 (63). Sources: ESPN scorecard, PTI via ThePrint and Telangana Today.
  - The brief gave Farhan Yousaf's figures as 63 (60). PTI reports "a 63-ball 60", so the Reel uses **60 (63)**.
- **India 339/9; won by one wicket off the last ball.** Aaryavir Sehwag 58 (61), Lakshya Raichandani (c) 80 (101). Sources: ESPN match report and scorecard, BCCI, Open Magazine.
- **The chase:** 252/8, then a 57-run ninth-wicket stand between Manal Chauhan 47 (32) and Mohit Ulva, then 309/9. Mohit Ulva finished 49* (26).
- **The final over:** 8 needed. It was bowled by legspinner Ahmed Hussain. There was no boundary off the first five legal balls, 3 were needed off the last ball, and Ulva hit a four.
- India's 9th U19 Asia Cup title.

**Ball-order note.** The exact order 49.1 dot → wide → four singles (330/9 → 335/9) comes from the brief. It is consistent with every verified total: 8 needed off the over, 3 off 1, and 339/9 at the finish. However, no source I could reach lists the individual deliveries, so that order is not independently confirmed.

### Sources

- ESPN match page and scorecard: <https://www.espn.com/cricket/series/8616/game/1558444/india-under-19s-vs-pakistan-under-19s-final-asian-cricket-council-under-19s-asia-cup-2026-27> · <https://www.espn.com/cricket/series/8616/scorecard/1558444/india-under-19s-vs-pakistan-under-19s-final-asian-cricket-council-under-19s-asia-cup-2026-27>
- BCCI: <https://www.bcci.tv/news/article/india-u19-clinch-asia-cup-after-heroic-last-ball-win-over-pakistan>
- ThePrint (PTI): <https://theprint.in/sport/u19-asia-cup-final-usman-khans-hundred-lifts-pakistan-to-337-for-9-against-india/3098671/>
- Telangana Today: <https://telanganatoday.com/u19-asia-cup-final-pakistan-reach-337-9-on-back-of-usman-khans-century>
- Yahoo Sports: <https://sports.yahoo.com/articles/asia-cup-u-19-final-133910101.html>
- Open Magazine: <https://openthemagazine.com/sports/india-beat-pakistan-in-u19-asia-cup-final-how-mohit-ulva-sealed-a-last-ball-one-wicket-thriller> · <https://openthemagazine.com/sports/quick-take-india-needed-three-off-the-last-ball-to-beat-pakistan-seven-things-to-know-about-the-u-19-asia-cup-final>
- Outlook India (squad, Lakshya captain): <https://www.outlookindia.com/sports/cricket/anvay-dravid-aaryavir-sehwag-in-indias-u19-asia-cup-squad-lakshya-to-lead>

## Audio, and its limits

- **Narration:** Kokoro TTS with the `am_michael` voice at its natural 1.0× pace, with real pauses between lines (the same narrator as the Kohli reels, as requested). It is a US-English voice, not Indian English; ElevenLabs and Azure were not available in this environment.
  - Player names use hand-written phonemes (Sehwag, Lakshya, Mohit Ulva, Manal Chauhan).
  - The voice is not modelled on any real commentator.
- **Music, crowd and SFX:** all original, synthesized in `scripts/gen-audio.mjs` (strings, piano, timpani, brass, heartbeat, ticking, flips, bat on ball, crowd roar). No samples, no licensed tracks.
- **Mix:** music and crowd duck under every line, and the effects are placed off the spoken words.
  - The final-ball crack lands in the pause before "FOUR!", and the roar swells after "INDIA WIN".
  - Every narration line was checked by speech-to-text on the final mix.
  - To audition the bed without the voice: `npx remotion render out/bundle LastBallMiracle out/bed.wav --codec wav --props '{"noVo":true}'`.
- **No match photos or footage are used.** The Reel is pure scoreboard graphics; nothing from the broadcast is recreated.

## Project layout

```
scripts/voiceover.json   narration script, pauses, phonemes
scripts/gen-voice.py     TTS + word timestamps → public/vo/*.wav + src/timeline.json
scripts/gen-audio.mjs    score, crowd and SFX → public/audio/*.wav (timed from timeline.json)
scripts/build.sh         gen-audio → bundle → render → cover → −14 LUFS master
src/data.ts              every number shown on screen
src/timeline.json        scene + word timings (the whole edit follows the voice)
src/scenes/Act1.tsx      S1 hook, S2 Pakistan innings, S3 chase + collapse
src/scenes/Act2.tsx      S4 Mohit Ulva + Manal Chauhan stand (Graph A)
src/scenes/Act3.tsx      S5–S6 final over (Graph B), S7 champions
src/Cover.tsx            cover still
src/Main.tsx             composition, masthead, subtitles, sound mix
```

## Rebuild

```bash
npm install
# only if the narration changes (needs kokoro-onnx, soundfile, faster-whisper):
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh   # BROWSER optional
npx remotion studio src/index.ts                              # edit live
```

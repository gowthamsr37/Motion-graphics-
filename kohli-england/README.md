# Beyond The Scoreboard — Virat Kohli: The England Nightmare (2014 → 2018)

A 118-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.
It is built in Remotion on the Adelaide-style scoreboard system used by the earlier Beyond The Scoreboard reels.
The narration is built on the brief's script, extended as a story: a hook question ("So what changed?"), a "let's go back to 2014" turn, and a spoken walk-through of every graph as it builds. It runs at a natural pace and scene lengths follow the voice.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Beyond_The_Scoreboard_Kohli_England.mp4` | the finished Reel |
| `Beyond_The_Scoreboard_Kohli_England_Cover.png` | 1080×1920 cover; "134 RUNS. 10 INNINGS. THE ENGLAND NIGHTMARE" sits inside the 1080×1440 grid crop |
| `Kohli_England_Narration.mp3` | narration only, on the Reel's timeline (192 kbps, 48 kHz, −16 LUFS) |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Scenes

| # | Scene | What's on the board, and what the narrator says |
| --- | --- | --- |
| 1 | The hook | Two counters spin and land on 149 (2018 first innings) and 134 (2014 series) as each is spoken. The 2014 Old Trafford scoreboard sits beside Kohli batting in 2018. "So what changed?" |
| 2 | The nightmare | "Let's go back to England, 2014": the year plate rewinds 2018 → 2014. Then 5 Tests, 10 innings, average 13.40, 2 ducks, no fifty and a highest of 39, each flipping in on its word |
| 3 | Ten innings | **Graph 1.** "Every bar is one innings" (all ten rise); "the dotted line is fifty"; "he never reached it". Trent Bridge, Lord's and Old Trafford are spotlighted as they are named |
| 4 | Anderson's trap | 4 red wicket lamps; the off-stump corridor *illustration* (labelled as not ball-tracking data) shows the ball moving away to the edge |
| 5 | Four years later | The year flips 2014 → 2018 and the light warms; patience, leaving well, the right ball |
| 6 | The 149 | "The red line is his whole 2014 series." A target panel shows all ten 2014 innings = 134. The counter crosses the line on "he went past it", lands on 149 (225), and the board swings to Kohli's 2018 hundred celebration. 2014 total 134, difference +15 |
| 7 | Transformation | **Graphs 2–4.** "Grey is 2014, gold is 2018" (the key lights as it is said); runs 134 vs 593 (scale 0–600); average 13.40 vs 59.30 (0–60); centuries 0 → 2; fifties 0 → 3; Anderson dismissals 4 vs 0 |
| 8 | The legacy | **Graph 5.** "Add up every run, innings by innings": the grey 2014 line draws on "barely moves", the gold 2018 line on "takes off". Series 3–1 and 4–1; "Same country. Same challenge. A different batter."; Beyond The Scoreboard; one click |

## Statistics

Every number comes from the brief's verified figures, which are kept in `src/data.ts` and not changed:

- **2014:** 5 Tests, 10 innings, 134 runs, average 13.40, highest 39, no fifties, no hundreds, two ducks, dismissed by Anderson 4 times.
  - Innings: 1, 8, 25, 0, 39, 28, 0, 7, 6, 20.
  - England won the series 3–1.
- **2018:** 5 Tests, 10 innings, 593 runs, average 59.30, 2 hundreds, 3 fifties, dismissed by Anderson 0 times.
  - Innings: 149, 51, 23, 17, 97, 103, 46, 58, 49, 0.
  - England won the series 4–1.
  - Edgbaston, first innings: 149 off 225 balls.

The innings lists sum to 134 and 593, and 134/10 = 13.40 and 593/10 = 59.30, so the totals, averages and cumulative chart all agree.

## Photographs

All photos are genuine, from Wikimedia Commons, under free licences, and each is credited on screen with its real place and date. As agreed, Kohli photos in Test whites are used where they suit the story even when they come from another match of the 2018 tour; the caption always shows where each was actually taken.

| File | Shows | Used in | Credit / licence |
| --- | --- | --- | --- |
| `otr-scoreboard-2014.jpg` | Old Trafford scoreboard, 4th Test, 8 Aug 2014 (shows IND 152) | hook, cover | Anthony O'Neil · CC BY-SA 2.0 |
| `kohli-batting-tb-2018.jpg` | Kohli batting, Trent Bridge, Aug 2018 | hook, four years later | It's No Game · CC BY 2.0 |
| `kohli-leaves-tb-2018.jpg` | Kohli walking off, Trent Bridge, Aug 2018 (cold-graded) | the nightmare | It's No Game · CC BY 2.0 |
| `tb-2014-a.jpg` | Trent Bridge, 1st Test, 10 Jul 2014 | ten innings | DncnH · CC BY 2.0 |
| `otr-covers-2014.jpg` | Old Trafford under covers, Aug 2014 | ten innings | Anthony O'Neil · CC BY-SA 2.0 |
| `anderson-perth-2013.jpg` | James Anderson bowling, Perth, Dec 2013 | Anderson's trap | Dan Heap · CC BY 2.0 |
| `kohli-century-tb-2018.jpg` | Kohli raising his bat after his hundred, Trent Bridge, 20 Aug 2018 | the 149 payoff, legacy, cover | Dun.can · CC BY 2.0 |
| `otr-ground-2014.jpg` | Old Trafford, 4th Test, Aug 2014 | transformation | Anthony O'Neil · CC BY-SA 2.0 |
| `kohli-fielding-tb-2018.jpg` | Kohli in the field, Trent Bridge, Aug 2018 | transformation | Dun.can · CC BY 2.0 |
| `otr-rain-2014.jpg` | Rain and umbrellas, Old Trafford, Aug 2014 | legacy | Anthony O'Neil · CC BY-SA 2.0 |

Source pages and full metadata are in `public/photos/credits.json`.
- Commons has no freely licensed photo of Kohli batting in England in 2014, and none of the Edgbaston 2018 celebration.
- Its only Kohli-in-Test-whites photos are from the 2018 Trent Bridge Test, so those carry the story.
- Nothing is AI-generated and no match footage is used.

## Audio, and its limits

- **Narration:** Kokoro TTS, `am_michael` voice at a natural 1.0× pace with breathing pauses; the script is in `scripts/voiceover.json`. This is the same narrator as the earlier reels. It is a US-English voice, not Indian English; no premium Indian-English neural voice (ElevenLabs, Azure) is available in this environment.
  - Names use hand-tuned phonemes: Virat, Edgbaston, innings, "off stump", "one and eight", "four-one".
- **Music, crowd and effects:** all original, synthesized in `scripts/gen-audio.mjs`. No samples and no licensed tracks.
  - D minor drone, low strings and a slow pulse through 2014.
  - The harmony lifts (F – C – G – D) when the year flips to 2018.
  - A timpani roll builds through the count and a full D-major brass, timpani and crowd peak lands on 149.
  - Reflective piano at the end, then one mechanical click.
- **Mix:** music and crowd duck under every line, and effects are placed off the spoken words.
  - To audition the mix without the voice: `npx remotion render out/bundle EnglandNightmare out/bed.wav --codec wav --props '{"noVo":true}'`.

## Project layout

```
scripts/voiceover.json   the narration (exact script), pauses, phoneme fixes
scripts/gen-voice.py     TTS + word timestamps → public/vo/*.wav + src/timeline.json
scripts/gen-audio.mjs    score, crowd and SFX → public/audio/*.wav (timed from timeline.json)
scripts/build.sh         gen-audio → bundle → render → cover → −14 LUFS master
src/data.ts              every statistic shown on screen
src/photos.ts            photo registry with on-screen credits
src/components/Charts.tsx  innings bars, comparison bars, cumulative chart, off-stump illustration
src/components/Photo.tsx   photo frame with Ken Burns move, cold/warm grade, place + credit plate
src/scenes/Story.tsx     the eight scenes
src/Main.tsx             composition, lighting story, subtitles, sound mix
src/Cover.tsx            cover still
```

## Rebuild

```bash
npm install
# only if the narration changes (needs kokoro-onnx, soundfile, faster-whisper):
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh   # BROWSER optional
npx remotion studio src/index.ts                              # edit live
```

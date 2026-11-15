# Beyond The Scoreboard — Virat Kohli: The England Nightmare (2014 → 2018)

A 96-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.
It is built in Remotion on the Adelaide-style scoreboard system used by the earlier Beyond The Scoreboard reels.
The narration is the brief's script, word for word, at a natural pace; scene lengths follow the voice.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Beyond_The_Scoreboard_Kohli_England.mp4` | the finished Reel |
| `Beyond_The_Scoreboard_Kohli_England_Cover.png` | 1080×1920 cover; "134 RUNS. 10 INNINGS. THE ENGLAND NIGHTMARE" sits inside the 1080×1440 grid crop |
| `Kohli_England_Narration.mp3` | narration only, on the Reel's timeline (192 kbps, 48 kHz, −16 LUFS) |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Scenes

| # | Scene | What's on the board |
| --- | --- | --- |
| 1 | The hook | Two mechanical counters spin and land on 149 (2018 first innings) and 134 (2014 series) as each is spoken; 2014 and 2018 photos side by side |
| 2 | The nightmare | 5 Tests · 10 innings · 134 runs · average 13.40 · ducks 2 · fifties 0 · highest 39, each flipping in on its word |
| 3 | Ten innings | **Graph 1:** the ten 2014 innings as bars on a true 0–50 scale, paired by ground; ducks in red, 39 in amber, the fifty line "never reached" |
| 4 | Anderson's trap | 4 red wicket lamps; an off-stump corridor *illustration*, labelled as not ball-tracking data |
| 5 | Four years later | The year plate flips 2014 → 2018 and the lighting warms from steel-blue to amber; patience · leaving well · the right ball |
| 6 | The 149 | The counter climbs past a 134 marker on a 0–150 rail and lands on 149 (225); 2014 total 134, difference +15 |
| 7 | Transformation | **Graphs 2 & 3:** runs 134 vs 593 (scale 0–600) and average 13.40 vs 59.30 (scale 0–60); centuries 0 → 2, fifties 0 → 3; **Graph 4:** Anderson dismissals 4 vs 0 |
| 8 | The legacy | **Graph 5:** cumulative runs, innings 1–10, both tours on one 0–600 scale; series results; "Same country. Same challenge. A different batter."; Beyond The Scoreboard; one final click |

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

All photos are genuine, from Wikimedia Commons, under free licences. Each is credited on screen and captioned with its real place and date.

| File | Shows | Credit / licence |
| --- | --- | --- |
| `otr-scoreboard-2014.jpg` | Old Trafford scoreboard, 4th Test, 8 Aug 2014 (shows IND 152) | Anthony O'Neil · CC BY-SA 2.0 |
| `otr-rain-2014.jpg` | Rain and umbrellas, Old Trafford, Aug 2014 | Anthony O'Neil · CC BY-SA 2.0 |
| `otr-ground-2014.jpg` | Old Trafford, 4th Test, Aug 2014 | Anthony O'Neil · CC BY-SA 2.0 |
| `otr-covers-2014.jpg` | Old Trafford under covers, Aug 2014 | Anthony O'Neil · CC BY-SA 2.0 |
| `tb-2014-a.jpg` | Trent Bridge, 1st Test, 10 Jul 2014 | DncnH · CC BY 2.0 |
| `anderson-perth-2013.jpg` | James Anderson bowling, Perth, Dec 2013 | Dan Heap · CC BY 2.0 |
| `kohli-batting-tb-2018.jpg` | Kohli batting, 3rd Test, Trent Bridge, Aug 2018 | It's No Game · CC BY 2.0 |
| `kohli-century-tb-2018.jpg` | Kohli after his hundred, Trent Bridge, 20 Aug 2018 | Dun.can · CC BY 2.0 |
| `kohli-leaves-tb-2018.jpg` | Kohli leaving the field after his hundred, Trent Bridge, Aug 2018 | It's No Game · CC BY 2.0 |
| `edgbaston-2018.jpg` | Mohammed Shami at Edgbaston, 1st Test, 3 Aug 2018 | Aidan Sammons · CC BY 2.0 |

Source pages and full metadata are in `public/photos/credits.json`. Three unused extras are also there: `tb-2014-b`, `broad-anderson-2014` and `tb-2018-wide`.

**What could not be found under a free licence, and so is not in the Reel:**
- a photo of Kohli himself on the 2014 tour
- a photo of an Anderson dismissal of Kohli
- a photo of the Edgbaston 2018 celebration

Instead, 2014 is shown through photos of the actual Tests at Trent Bridge and Old Trafford. Anderson is shown bowling in Perth in 2013, captioned as such. Edgbaston is shown with a genuine photo from that Test, and his 2018 hundred celebration is the Trent Bridge one, captioned as such. Nothing is AI-generated and no match footage is used.

## Audio, and its limits

- **Narration:** Kokoro TTS, `am_michael` voice at a natural 1.0× pace with breathing pauses. This is the same narrator as the earlier reels. It is a US-English voice, not Indian English; no premium Indian-English neural voice (ElevenLabs, Azure) is available in this environment.
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

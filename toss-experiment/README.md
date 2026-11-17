# Beyond The Scoreboard: Does winning the toss actually win cricket matches?

An Instagram Reel built as a cricket experiment.

- **Format:** 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.
- **Length:** about 129 seconds. The brief's script is read word for word at a natural documentary pace (about 155 words per minute). Fitting it into 105 seconds would mean rushing, which the brief rules out.
- **Brand:** Beyond The Scoreboard typography (League Gothic and Oswald). No episode numbers.

## What's in it

About 45% of the runtime is real-time 3D, 35% data graphics and 20% genuine photographs.

| # | Scene | What you see |
|---|---|---|
| 1 | **The hook** | A gold toss coin spins in slow motion above a packed, floodlit 3D stadium. The camera orbits a low "hero" angle, with the stands and lights blurred into bokeh. The coin freezes in mid-air on "toss" (bullet time). **WIN THE TOSS = WIN THE MATCH?** follows, then **IPL 51.6%** against a subtle 50% baseline. |
| 2 | **The first shock** | An aerial orbit over the stadium, with a four-format chart on a true 0–100% scale and a 50% "coin flip" line. TESTS 54.3%, ODIs 49.6%, T20Is 50.3% and IPL 51.6% each reveal on their spoken number, with sample sizes and their gap from 50 in points. |
| 3 | **You are the captain** | A captain's-eye view from the batting crease under lights: "IPL · under lights", "dew likely later". A coin flicks up in front of you and you win the toss. **BAT FIRST / BOWL FIRST** cards appear, then a ticking **3 · 2 · 1** with no narration so viewers can decide. |
| 4 | **The captain's dilemma** | A licensed photo of an IPL captain (Gautam Gambhir, KKR, 2014). A split screen shows **BOWL FIRST 54.7%** and **BAT FIRST 45.3%** on the same 0–100% scale, each with an illustrative T20 innings worm. Then **CORRELATION IS NOT CAUSATION**, with a diagram: conditions drive both the decision and the result. |
| 5 | **But wait…** | A pattern-interrupt slam. **IPL 2024: 44%** of 71 matches and **2025: 61%** of 70 appear as equally scaled bars, with a 3D coin turning between them ("same coin · same 50–50"). Then a simulation: 48 fair-coin seasons of 70 matches land between about 38% and 62%, and both real seasons sit inside that range. |
| 6 | **The day-night experiment** | A 3D stadium time-lapse from 3:30 pm to 8:30 pm. The sun sets, the sky turns pink and then navy, and the floodlights strike with a relay clunk and hum. The research panel shows **DAYTIME ≈0 PTS** and **DAY-NIGHT +3.3 PTS**, labelled as estimated toss effect in percentage points. The camera then dives into the grass, where dew beads catch the lights, tagged *Illustration · evening dew*. |
| 7 | **Test cricket's hidden advantage** | **+4.9 percentage points.** A 3D Test pitch, lit by a low raking sun, ages from **Day 1 to Day 3 to Day 5**: footmarks, then an opening crack network. Two illustrative deliveries pitch on the same spot: a true bounce, and one off a crack that deviates and keeps low. |
| 8 | **The real lesson** | A montage cut to the words: a 1930s toss photo, the bat-or-bowl choice, IPL floodlights, a 3D worn pitch, Old Trafford rain, a "THE TOSS WILL BE DELAYED" board, a day Test, and dew. A diagram builds alongside it: **TOSS → CHOICE → MATCH**, with **CONDITIONS** (pitch, weather, format, dew) shaping both the choice and how much it is worth. |
| 9 | **Ending and loop** | Back to the spinning coin. The four formats appear ("usually, not by much"), then day-night +3.3 and Test +4.9 ("in the right conditions"). **THE TOSS DOESN'T GUARANTEE VICTORY. CONDITIONS CHANGE ITS VALUE.** The coin drops onto the pitch, bounces and settles with a metallic ring. **BEYOND THE SCOREBOARD.** The last second is the opening shot, timed to flow straight into frame 0 for a seamless replay loop. |

## Data (exactly as supplied in the brief; see `src/data.ts`)

- **Toss winner won the match** (decided men's matches; draws, ties and no-results excluded; internationals between ICC Full Members):

  | Format | Decided matches | Toss winner won |
  |---|---|---|
  | Tests | 725 | 54.3% |
  | ODIs | 1,946 | 49.6% |
  | T20Is | 1,073 | 50.3% |
  | IPL | 1,218 | 51.6% |

- **IPL, by the toss-winning captain's decision:** chose to field 54.7%, chose to bat 45.3%. Shown as observational. The Reel says on screen that this is not a guaranteed effect of bowling first.
- **IPL seasons:** 2024 about 44% (71 decided matches), 2025 about 61% (70).
- **2023 study, 35,000+ matches.** Estimated toss effect on winning probability:
  - daytime international limited-overs ≈ 0
  - day-night international limited-overs +3.3 points
  - Tests +4.9 points

  These are labelled as percentage points, never as win rates.
- **The one derived number** is the fair-coin range for a 70-match season: 50 ± 1.96·√(0.25/70) = 50 ± 11.7, so 38.3%–61.7%. The dot plot is a seeded simulation and is labelled as one.
- **Charts:**
  - Every win-rate chart uses a true 0–100% axis with the 50% line, so no difference is exaggerated.
  - The effect chart uses a labelled 0–5 percentage-point axis.
  - The innings worms in scene 4 and the ball paths in scene 7 are tagged as illustrations.
- **References:**
  - [Cricsheet](https://cricsheet.org/)
  - [gsood.com cricket paper](https://gsood.com/research/papers/cricket_paper.pdf)
  - [HTFT predictions](https://htftpredictions.com/does-winning-the-toss-win-cricket-matches.php)
  - [Cricket Studio toss-effect research](https://players.cricketstudio.ai/research/toss-effect)

## Photographs

Every photo is genuine and freely licensed, from Wikimedia Commons, and credited on screen. Details are in `public/photos/credits.json`.

| File | Shows | Credit / licence |
|---|---|---|
| `gambhir-ipl-2014.jpg` | Gautam Gambhir, KKR captain, IPL 2014 | Kolkata Knight Riders, CC BY 3.0 |
| `toss-bradman.jpg` | A 1930s toss: Don Bradman and Gubby Allen | Unknown author, public domain (Australia) |
| `toss-delayed-2017.jpg` | "The toss will be delayed", Australia v India, Women's World Cup, 20 Jul 2017 | Robert Drummond, CC0 |
| `chin-floodlights-2014.jpg` | Chinnaswamy floodlights, IPL, May 2014 | Ramesh NG, CC BY-SA 2.0 |
| `otr-rain-2014.jpg` | Rain at Old Trafford, Aug 2014 | Anthony O'Neil, CC BY-SA 2.0 |
| `tb-2018-wide.jpg` | Day Test at Trent Bridge, Aug 2018 | Dun.can, CC BY 2.0 |

**Not available:** a freely licensed photo of a captain inspecting the pitch, or of a toss in progress at an IPL match. Wikimedia Commons search was rate-limited from this environment. Those moments are therefore shown as labelled 3D illustrations, or not shown. No photo is presented as something it is not, and no imagery is AI-generated.

## How it's built

- **Remotion 4 + React.** Every frame is a pure function of the frame number.
- **3D (`src/three/`)** is plain Three.js, drawn synchronously on every frame (`GLScene.tsx`). The captured frame always matches the frame number, which matters when rendering in sequence.
  - **Stadium (`stadium.ts`):**
    - An outfield with mowing stripes.
    - The pitch with real crease geometry: stumps 20.12 m apart, popping creases 1.22 m in front, return creases.
    - A two-tier stepped bowl with about 40,000 instanced spectators and twinkling phone lights.
    - A roof canopy, LED boards and six floodlight pylons with lamp grids, halos, haze beams and spotlights.
    - A sky dome with sun, clouds and stars.
    - A single time-of-day value drives sun height, sky colours, light levels and the moment the floodlights strike.
  - **Coin (`coin.ts`):**
    - Gold metal with an original embossed design: crossed bats and ball, the brand ring, stumps and TOSS on the reverse. It is drawn as a height map and converted to a normal map.
    - A reeded edge, and reflections from a cube-mapped stadium environment.
    - It flips end over end about a horizontal axis. The landing uses a real drop height, damped bounces and a decaying Euler's-disk wobble.
  - **Pitch (`scripts/gen-pitch.py`):**
    - Days 1, 3 and 5 are 2048² colour and normal maps for a 3.05 m patch around the popping crease.
    - The cracks are Voronoi edges on domain-warped coordinates; they meander and open with time.
    - Footmarks sit outside off stump, and rough dusty patches appear by day 5.
  - **Dew (`views.tsx`):** about 5,000 instanced grass blades with water beads lit by floodlight reflections.
- **Narration (`scripts/gen-voice.py`):**
  - Kokoro TTS (ONNX) with the `hm_omega` male voice. It is a Hindi-trained voice, reading English with British-style English pronunciation (the closest match to Indian English).
  - Word timings come straight from the model's own duration predictor, so subtitles, numbers and visual beats land on the spoken word.
  - Phoneme fixes:
    - "ODIs" is spoken "O-D-Is" (the default sounded like "oh-dee").
    - Clearer "bowl" and "match" vowels.
    - A short breath in "toss winners won, fifty-four percent".
    - The years are read "twenty twenty-four" and "twenty twenty-five".
  - Checked with an offline Whisper model; the transcript matches the script apart from homophones (dew/due, weather/whether) and a couple of accent slips.
- **Audio (`scripts/gen-audio.mjs`):** an original score and sound design, synthesized in code with no samples. It reads the same timeline as the visuals.
  - **Score:** a suspense pulse and a held breath on the freeze; a curious staccato under the numbers; ticking anticipation for the captain's call; a hard "but wait" hit with a reverse swell; atmospheric pads for the day-night time-lapse; deep low strings for the Test pitch; a warm build for the lesson; a reflective resolve for the ending.
  - **Effects:** stadium crowd ambience, the coin flick and spin shimmer, a metallic landing with an accelerating rattle, mechanical data clacks, countdown ticks, the floodlight relay and hum, dew droplets, ball bounces, dry soil crackle and camera shutters.
  - The music ducks under the narration.
- **Safe areas.** Headlines start at y ≥ 250. Subtitles are centred at y ≈ 1392, between x = 120 and 920, clear of Instagram's header, caption block and right-hand button rail. The cover keeps its text inside the 3:4 profile-grid crop.

## Deliverables (in `out/` after a build)

- `Beyond_The_Scoreboard_Toss_Experiment.mp4`: the finished Reel.
- `Toss_Experiment_Cover.png`: the 9:16 cover.
- `Toss_Experiment_Narration.wav`: the narration alone, aligned to the video.
- `Toss_Experiment_Subtitles.srt`: subtitles.
- `CAPTION.md`: the Instagram caption and hashtags.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <dir with kokoro-v1.0.onnx + voices-v1.0.bin>   # only if the script changes
python scripts/gen-pitch.py                                                          # pitch textures (numpy + pillow)
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

The 3D scenes are WebGL. Without a GPU, render with `--gl=swangle`, as `build.sh` does.

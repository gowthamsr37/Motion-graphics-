# The Uniform Distribution Explained in 2 Minutes

The fourteenth **Data Science Made Simple** Reel for **@curious_datascientist**, and the first of the "other kinds of distributions" promised in the normal distribution and CLT Reels: 100 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It's built in the simple style the user asked for after the CLT remake:
- a plain-words definition card right after the hook;
- one everyday example per idea (a dice for discrete, waiting for a bus for continuous);
- chance = area, shown step by step;
- the average in the middle;
- a recap that repeats the definition;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: BINOMIAL DISTRIBUTION chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Uniform_Distribution.mp4` | the finished Reel |
| `Uniform_Distribution_Cover.png` | 1080×1920 cover: THE UNIFORM DISTRIBUTION · explained in 2 minutes, six equal dice bars (discrete) and a flat 0–10 min rectangle (continuous), @curious_datascientist |
| `Uniform_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Discrete (the dice) | cyan (series colour) |
| Continuous (the bus wait) | green (series colour) |
| Chance = area | violet |
| The quiz slice | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:11 | **Hook** | Three cards pop in on their words: FAIR DICE (rolling), LUCKY DRAW (a raffle box), RANDOM NUMBER (a phone with changing digits). WHAT DO THEY HAVE IN COMMON? Six equal bars rise in every card: EVERY OUTCOME EQUALLY LIKELY → **THE UNIFORM DISTRIBUTION** · explained simply. |
| 2 | 0:11–0:21 | **The definition** | IN SIMPLE WORDS: a 3-line card. 1 Every possible **OUTCOME**; 2 gets the **SAME CHANCE** (1/6 · 1/6); 3 so the shape is **FLAT** (a flat-rectangle icon). Then THAT'S THE UNIFORM DISTRIBUTION. |
| 3 | 0:21–0:31 | **Discrete: a fair dice** | A dice tumbles and lands on 6. Six equal bars rise over the six faces, each with **1/6**. SIX EQUAL BARS → **DISCRETE UNIFORM**. |
| 4 | 0:31–0:45 | **Continuous: waiting for a bus** | WAITING FOR A BUS: a timeline with a bus at 0 and at 10 min (A BUS EVERY 10 MINUTES). You arrive at random, and the orange wait readout jumps (wait 7.2 → 1.5 → 9.1 → 4.4 …): ANYWHERE FROM 0 TO 10. A green flat rectangle rises over a 0–10 min axis: **A FLAT RECTANGLE**. |
| 5 | 0:45–0:57 | **Area is chance** | CHANCE = AREA · MEASURE THE AREA. A "10 wide" brace and a "1/10 tall" marker, then **10 × 1/10 = 1**. The slice from 0–3 min fills violet (3/10): **WAIT UNDER 3 MIN = 30%**. |
| 6 | 0:57–1:04 | **The average** | RIGHT IN THE MIDDLE: two panels. DICE bars with a centre line at **3.5**; BUS WAIT rectangle with a centre line at **5 min**. |
| 7 | 1:04–1:14 | **Remember** | UNIFORM DISTRIBUTION pill and a recap flow: **EVERY OUTCOME EQUALLY LIKELY** ↓ **A FLAT SHAPE** ↓ **AVERAGE IN THE MIDDLE**. Then a phone rolling random digits: HOW COMPUTERS MAKE RANDOM NUMBERS. |
| 8 | 1:14–1:40 | **Quiz, teaser and CTA** | QUICK QUIZ. A TRAIN EVERY 20 MIN: a flat rectangle on a 0–20 min axis, with a dashed line at 15. "Chance you wait **OVER 15 MIN?**" Options 75% / 25% / 15% / 50% with the 5-second countdown. **25%**: confetti and strikes ("that's under 15", "not 15/100", "too big"). The 15–20 slice fills orange (5 min): **5 OF 20 MINUTES = 1/4 = 25%**. Teaser: NEXT · BINOMIAL (spiky bars). End card: NEXT: BINOMIAL DISTRIBUTION, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Equally likely · Flat shape · Area = chance · Mean in middle. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:10.67)
- `0:00.45` A fair dice. A lucky draw. A random number on your phone.
- `0:04.25` What do they have in common?
- `0:05.86` Every outcome is equally likely. That's the uniform distribution.

**S2 · The definition** (0:10.67–0:21.35)
- `0:11.12` Here's the definition, in simple words.
- `0:13.72` A uniform distribution gives every possible outcome the same chance.
- `0:18.17` So its shape is flat, like a rectangle.

**S3 · Discrete: a dice** (0:21.35–0:31.43)
- `0:21.80` Let's start with a fair dice.
- `0:23.52` Six outcomes, and each one has a chance of 1 in 6.
- `0:26.99` Six equal bars. That's a discrete uniform distribution.

**S4 · Continuous: waiting for a bus** (0:31.43–0:44.65)
- `0:31.88` Now a continuous one.
- `0:33.48` A bus comes every 10 minutes, and you reach the stop at a random time.
- `0:37.79` Your wait can be anywhere from 0 to 10 minutes, all equally likely.
- `0:41.98` So its shape is a flat rectangle.

**S5 · Area is chance** (0:44.65–0:56.89)
- `0:45.10` To find a chance, measure the area.
- `0:47.33` The rectangle is 10 wide and 1/10 tall, so the total area is 1.
- `0:51.89` The chance of waiting less than 3 minutes? 3/10, or 30%.

**S6 · The average** (0:56.89–1:03.58)
- `0:57.34` And the average? It's right in the middle.
- `0:59.55` For the dice, 3.5. For the bus, 5 minutes.

**S7 · Remember** (1:03.58–1:14.19)
- `1:04.03` So remember: uniform means every outcome is equally likely.
- `1:08.00` A flat shape, with the average right in the middle.
- `1:10.77` It's even how computers make random numbers.

**S8 · Quiz, teaser and CTA** (1:14.19–1:40.36)
- `1:14.54` Quick quiz!
- `1:15.57` A train comes every 20 minutes, and you arrive at a random time.
- `1:19.70` What's the chance you wait more than 15 minutes?
- `1:27.59` 25%!
- `1:29.08` 15 to 20 is 5 minutes out of 20. That's one quarter.
- `1:33.24` Next, we'll count successes with the binomial distribution.
- `1:37.09` Follow for data science made simple!

*(Between "What's the chance you wait more than 15 minutes?" and "25%!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Definition:** a uniform distribution gives every outcome in its range the same probability.
  - **Discrete:** each of n outcomes has probability 1/n.
  - **Continuous** on [a, b]: the density is the constant 1/(b − a).
- **Dice:** 6 outcomes, each 1/6; the mean is (1 + 6) ÷ 2 = **3.5**.
- **Bus wait:** a bus every 10 minutes and a random arrival time make the wait uniform on [0, 10].
  - Density 1/10; total area 10 × 1/10 = 1.
  - P(wait < 3) = 3/10 = **30%**.
  - Mean (0 + 10) ÷ 2 = **5 min**.
- The random waits shown in scene 4 (7.2, 1.5, 9.1, 4.4, 2.8, 6.3 min) are illustrative draws.
- **Random numbers:** computers' basic random-number generators produce (pseudo-)random numbers that are uniform on [0, 1). Other distributions are built from them.
- **Quiz:** a train every 20 minutes and a random arrival make the wait uniform on [0, 20]. P(wait > 15) = (20 − 15) ÷ 20 = **25%**.
  - The distractors: 75% (that's P(wait < 15)), 15% (treating 15 as a percentage), 50%.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, blips on the three vignettes, and the riser, impact and crash on "uniform".
- Definition: calm "flow", with a blip per line and a rising lead on "flat".
- Examples: marimba "play", with dice ticks, a clink on landing, hops and clicks as the wait jumps, and a glide as the rectangle rises.
- Area and average: groove, with a bell arpeggio on "total area is 1".
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–12 frames before their words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `central-limit-theorem/` (`REF=central-limit-theorem bash .claude/skills/data-science-explainer/new-video.sh uniform-distribution UniformDistribution Uniform_Distribution`). It adds `src/components/Explain.tsx`: `DefCard` (numbered definition card), `RecapFlow`, `FlatIcon` / `BarsIcon` / `CurveIcon` and `Teaser`. `SoundTrack.tsx` gains the reusable `pops()` and `quiz()` hit helpers.

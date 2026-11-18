# Confidence Intervals Explained Simply (v2)

The remake of the confidence-interval Reel for **@curious_datascientist**. The user found the first version (`confidence-intervals/`) hard to follow and asked for a simpler explanation, more examples, and a definition viewers can give in an interview, using up to about 170 s. 2:54, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

What's new compared with v1:
- a relatable **news-poll hook** ("52% ± 3%");
- the **fishing analogy** (a single number is a spear, a range is a net);
- an **INTERVIEW ANSWER** card with the formal definition, revealed phrase by phrase;
- **two labelled examples** (the poll, delivery-time averages);
- the recipe as three numbered steps plus a worked example that labels every number (spread 10, n = 100, standard error 1, margin 2); the user asked what the 10 and 100 were, so the narration now names them;
- the "95%" misreading struck out;
- what widens or narrows the range (data and confidence level);
- a quiz on the most common mix-up: a CI is for the **average**, not for individual people.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: HYPOTHESIS TESTING chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Confidence_Intervals_Simple.mp4` | the finished Reel |
| `Confidence_Intervals_Simple_Cover.png` | 1080×1920 cover: CONFIDENCE INTERVALS · explained simply, "52% ± 3% · WHAT DOES IT MEAN?" over the 49–55% range, + INTERVIEW-READY DEFINITION tag, @curious_datascientist |
| `Confidence_Intervals_Simple.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code

| Concept | Colour |
| --- | --- |
| The estimate (sample value) | cyan |
| The range, the margin of error | violet |
| The true population value, "catches it" | green |
| A miss, the misreading | orange / red |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:13 | **Hook** | A NEWS POLL card: **52%** support the new metro line (1,000 VOTERS SURVEYED), and **± 3%** stamps on. **WHAT DOES ± 3% MEAN?** → **CONFIDENCE INTERVALS** · EXPLAINED SIMPLY. |
| 2 | 0:13–0:25 | **Why a range** | **WE CAN'T ASK EVERYONE**: a crowd of dots, with circled samples landing on their words (52%, 51%, 54%) and chips SAMPLE 1 · 2 · 3. Then DIFFERENT 1,000 PEOPLE: DIFFERENT ANSWER → **ONE NUMBER CAN MISLEAD**. |
| 3 | 0:25–0:36 | **The net** | Two panels with the same swimming fish (the true value). **ONE NUMBER = A SPEAR**: the spear flies past (MISSED ✗). **A RANGE = A NET**: the net sweeps round it (CAUGHT ✓). Then **CONFIDENCE INTERVAL = THE NET**. |
| 4 | 0:36–0:53 | **Interview definition** | INTERVIEW ANSWER badge and quote card. The definition reveals phrase by phrase with key words lit: *a range of values* (violet) · *calculated from a sample* (cyan) · *the true population value* (green). Then CONFIDENCE LEVEL (LIKE 95%): how **reliable** that method is. |
| 5 | 0:53–1:06 | **Example 1: the poll** | **52% ± 3% = 49% TO 55%** on a percentage line, the cyan estimate dot and the violet range. Then a green dashed "?" box: **THE TRUE SUPPORT IS LIKELY IN HERE**. |
| 6 | 1:06–1:19 | **Example 2: averages** | FOOD APP · 100 ORDERS · AVERAGE DELIVERY **32 MIN** · SPREAD (SD): 10 MIN → **95% CI: 30 TO 34 MINUTES** on a minutes line. |
| 7 | 1:19–1:45 | **The recipe** | ALWAYS THE SAME: **1 ESTIMATE ± MARGIN OF ERROR** · **2 MARGIN = 2 × STANDARD ERROR** (for 95%: 1.96 to be exact) · **3 STANDARD ERROR = SPREAD ÷ √n**. Then an OUR EXAMPLE: DELIVERY TIMES panel that labels every number: **SPREAD (SD) 10 MIN** and **SAMPLE SIZE n 100** chips → **STD ERROR = 10 ÷ √100 = 10 ÷ 10 = 1 MIN** (row 3 lights up) → **MARGIN = 2 × 1 = 2 MIN** (row 2 lights up) → **32 ± 2 = 30 TO 34 MIN**. |
| 8 | 1:45–2:00 | **What 95% really means** | The myth card "95% CHANCE THIS RANGE IS RIGHT" is struck out ✗. REPEAT THE SURVEY MANY TIMES: 20 simulated surveys stack up around the green TRUE VALUE line; 19 catch it and one misses (orange), with a live counter. Then **ABOUT 95 IN 100 RANGES CATCH IT**. |
| 9 | 2:00–2:13 | **What changes the width** | **MORE DATA: NARROWER**: n = 100 ± 2, n = 400 ± 1. **MORE CONFIDENCE: WIDER**: 90% ± 1.6, 95% ± 2, 99% ± 2.6. |
| 10 | 2:13–2:22 | **Remember** | A RANGE, NOT ONE NUMBER ↓ ESTIMATE ± MARGIN OF ERROR ↓ LIKELY HOLDS THE TRUE VALUE. |
| 11 | 2:22–2:54 | **Quiz, teaser and CTA** | QUICK QUIZ: a moon icon, AVERAGE SLEEP: 7 H · 95% CI: 6.5 TO 7.5 H. "95% of people sleep that long? **YES OR NO?**" Options YES / NO / AT 99% / CAN'T SAY with the 5-second countdown. **NO!** wins confetti, and the wrong options are struck ("common trap", "still no", "we can"). Then **IT'S ABOUT THE AVERAGE, NOT PEOPLE**. Teaser: NEXT: IS IT REAL? · HYPOTHESIS TESTING (a coin). End card: NEXT: HYPOTHESIS TESTING, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips A range · Estimate ± margin · 95 of 100 · For the average. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:13.49)
- `0:00.45` A news poll says: 52% of voters support a new metro line, plus or minus 3%.
- `0:07.12` What does that plus or minus 3 actually mean? It's a confidence interval. Let's make it simple.

**S2 · Why a range** (0:13.49–0:24.56)
- `0:13.94` Pollsters can't ask everyone, so they ask a sample of 1,000 people.
- `0:18.61` Another 1,000 might give 51, or 54.
- `0:21.85` So one number alone can mislead.

**S3 · The net** (0:24.56–0:35.90)
- `0:25.01` Think of fishing.
- `0:26.18` A single number is like a spear: you'll probably miss.
- `0:29.38` A range is like a net: far more likely to catch the fish.
- `0:32.99` A confidence interval is that net.

**S4 · Interview definition** (0:35.90–0:53.41)
- `0:36.35` Here's the definition you can use in an interview.
- `0:39.18` A confidence interval is a range of values, calculated from a sample, that is likely to contain the true population value.
- `0:47.05` And the confidence level, like 95%, tells how reliable that method is.

**S5 · Example 1: the poll** (0:53.41–1:05.88)
- `0:53.86` Example one: the poll.
- `0:55.68` 52, plus or minus 3, means a range from 49 to 55%.
- `1:01.46` The true support among all voters is likely somewhere in there.

**S6 · Example 2: averages** (1:05.88–1:18.55)
- `1:06.33` Example two: averages.
- `1:08.42` A food app checks 100 orders. The average delivery time is 32 minutes.
- `1:13.41` Its 95% confidence interval is 30 to 34 minutes.

**S7 · The recipe** (1:18.55–1:45.32)
- `1:19.00` The recipe is always the same: estimate, plus or minus a margin of error.
- `1:24.06` For 95%, the margin is about two standard errors.
- `1:28.06` And the standard error is the spread, divided by the square root of the sample size.
- `1:33.02` In our example, the spread is 10 minutes, and the sample size is 100.
- `1:37.70` The square root of 100 is 10, so the standard error is 1 minute.
- `1:41.86` And the margin is 2 times that: 2 minutes.

**S8 · What 95% means** (1:45.32–2:00.88)
- `1:45.77` Now, the part most people get wrong.
- `1:48.02` 95% does not mean a 95% chance that this one range is right.
- `1:53.76` It means: repeat the survey 100 times, and about 95 of the ranges will catch the true value.

**S9 · What changes the width** (2:00.88–2:13.06)
- `2:01.33` Two things change the width.
- `2:03.04` More data makes it narrower: four times the sample halves the margin.
- `2:07.28` More confidence makes it wider: to be 99% sure, you need a bigger net.

**S10 · Remember** (2:13.06–2:22.49)
- `2:13.51` So remember: a confidence interval is an estimate, plus or minus a margin of error.
- `2:19.11` A range that likely contains the true value.

**S11 · Quiz, teaser and CTA** (2:22.49–2:54.05)
- `2:22.84` Quick quiz!
- `2:23.87` Average sleep is 7 hours, with a 95% confidence interval of 6.5 to 7.5 hours.
- `2:31.08` Does that mean 95% of people sleep that long?
- `2:39.79` No!
- `2:40.59` It's a range for the average, not for individual people. Lots of people sleep less, or more.
- `2:46.52` Next: how do we decide if something is real? Hypothesis testing.
- `2:50.78` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definition:** a confidence interval is a range computed from sample data that, by its construction method, contains the true population parameter in a stated share of repeated samples (the confidence level). "Likely to contain the true value" is the standard plain-language version.
  - "95% chance that this one range is right" is the classic misreading: once computed, a given interval either contains the parameter or not. The narration says this explicitly.
- **Poll:** with n = 1,000 and p = 0.52, SE = √(0.52 × 0.48 / 1000) = 1.58 points, so the 95% margin is 1.96 × 1.58 = 3.1 ≈ **± 3 points** (49–55%).
  - The other samples (51%, 54%) are illustrative and well within normal sampling variation (± 2 SE).
- **Averages:** SD 10 min and n = 100 give SE = 10/√100 = **1 min**. The 95% margin is 1.96 × 1 ≈ **2**, so the interval is 32 ± 2 = **30 to 34** min (exactly 30.04–33.96).
- **Scene 8:** 20 simulated surveys (`components/CI.tsx`, seed 3), each with 100 values from N(32, 10²) and its own m ± 1.96 · s/√n. Exactly 1 of 20 misses (19/20 = 95%).
- **Scene 9:**
  - n = 400: SE = 0.5, margin 0.98 ≈ **± 1**. The margin ∝ 1/√n, so 4× the data halves it.
  - Confidence levels (z): 90% = 1.645 → **± 1.6**; 95% = 1.96 → **± 2**; 99% = 2.576 → **± 2.6**.
- **Quiz:** a CI for the mean describes uncertainty about the **average**. Individual values spread far wider: with an SD of about 1 hour, roughly 95% of people would fall within about ± 2 hours of the mean, not ± 0.5. So "95% of people sleep 6.5–7.5 hours" is wrong.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a pop on the poll card, a stamp on "± 3%", a glitch before the question, and the whoosh, impact and chime on "confidence interval".
- Why a range and the net: calm "flow", with ticks as the crowd appears, pops per sample, a whoosh for the spear and a stamp on the miss, a glide for the net and a ding on the catch.
- The definition and the examples: marimba "play", with a chime on the badge, blips on the key phrases, glides as the ranges grow and a ding on "true support".
- The recipe, what 95% means and the width: groove, with step tones per recipe step, a ding on "margin is 2", a stamp on the myth, a tick per survey range, a ding on "catch", and glides and pops per width row.
- Recap: build, with a crash on entry and step tones per line.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `distributions-guide/` (`REF=distributions-guide bash .claude/skills/data-science-explainer/new-video.sh confidence-intervals-v2 ConfidenceIntervalsV2 Confidence_Intervals_Simple`). It adds `src/components/Simple.tsx`: the `InterviewCard` (badge, quote card, phrase-by-phrase reveal and a note line) and the `ExampleTag`. It reuses `CI.tsx` (the 20 surveys) and `Clt.tsx` (`Radical`).

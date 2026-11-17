# The Exponential Distribution Explained in 2 Minutes

The seventeenth **Data Science Made Simple** Reel for **@curious_datascientist**, and the fourth in the distributions arc (after uniform, binomial and Poisson): 113 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Same simple structure as the other distribution Reels:
- a hook question (the same chai stall as the Poisson Reel, 4 customers an hour: one just left, so how long until the next?);
- a plain-words definition card;
- one everyday example built up step by step (the gaps between customers → a falling shape);
- the shape, with two chances read off it;
- the surprise (most waits are shorter than the average);
- no memory;
- a recap that repeats the definition and pairs it with Poisson;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: WHICH DISTRIBUTION? chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Exponential_Distribution.mp4` | the finished Reel |
| `Exponential_Distribution_Cover.png` | 1080×1920 cover: THE EXPONENTIAL DISTRIBUTION · explained in 2 minutes, the waiting-time curve on a 0–60 min axis with 0–15 min shaded green, a stopwatch, @curious_datascientist |
| `Exponential_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Waiting times, the gaps, the curve | cyan |
| The average | violet |
| Short waits | green |
| Long waits, time already waited | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:11 | **Hook** | The CHAI STALL from the Poisson Reel: **4 CUSTOMERS AN HOUR (AVERAGE)**. A customer walks off to the right ("One just left"). **NEXT ONE WHEN?** and a WAITING stopwatch pill counts up fast → **THE EXPONENTIAL DISTRIBUTION** with a burst · explained simply. |
| 2 | 0:11–0:26 | **The definition** | IN SIMPLE WORDS: a 4-line card that fills on the spoken words. 1 Measures **WAITING TIME** (stopwatch); 2 until **THE NEXT EVENT** (a gap bracket); 3 at a **STEADY RATE**, at random; 4 short waits: **MOST COMMON** (a falling curve). All four tick green: THAT'S THE EXPONENTIAL DISTRIBUTION. |
| 3 | 0:26–0:40 | **The gaps** | One timeline: five customers arrive. **AVERAGE GAP = 15 MIN**: dashed violet ticks at 15, 30, 45, 60. **REAL GAPS VARY**: brackets land on each spoken gap: 6 MIN and 3 (green, short), 22 and 31 (orange, long). Then **80 GAPS, SORTED BY LENGTH**: 80 simulated gaps drop as dots into 5-minute columns (0–60 min) and the columns fall from left to right. |
| 4 | 0:40–0:53 | **The shape** | AVERAGE WAIT = 15 MIN: the curve sweeps in, a glowing dot at the top: **HIGHEST AT 0**. **SHORT WAITS ARE MOST COMMON**. "WITHIN 5 MIN?": 0–5 shades green → **ABOUT 28%** (badge 28%). "OVER 30 MIN?": 30–60 shades orange → **ABOUT 14%** (badge 14%). |
| 5 | 0:53–1:03 | **The surprise** | A violet line rises at 15: **AVERAGE 15 MIN**. 0–15 fills green (**63%**) and 15–60 orange (**37%**): **63% ARE SHORTER** than the average gap. Three orange dots glow out on the tail: **A FEW LONG GAPS** · **PULL THE AVERAGE UP →**. |
| 6 | 1:03–1:14 | **No memory** | ALREADY WAITED: a stopwatch runs to **10:00** while 0–10 on the curve shades orange (WAITED). **✗ NEXT CUSTOMER: NOT ANY SOONER**. From minute 10 the same curve starts again (the old one dims and turns dashed) and a violet bracket spans 10 → 25: **STILL 15 MIN AHEAD, ON AVERAGE**. |
| 7 | 1:14–1:28 | **Remember** | EXPONENTIAL DISTRIBUTION pill and a recap flow: **MEASURES WAITING TIME** ↓ **UNTIL THE NEXT EVENT** ↓ **RANDOM, STEADY RATE**. Then two cards: **POISSON** · COUNTS THE EVENTS (dots on a line) and **EXPONENTIAL** · MEASURES THE GAPS (a bracket between two dots). |
| 8 | 1:28–1:53 | **Quiz, teaser and CTA** | QUICK QUIZ. A 0–60 min hour bar with 6 buses at random minutes: **6 BUSES AN HOUR (AVERAGE)**. "Average wait **BETWEEN BUSES?**" Options 6 MIN / 10 MIN / 60 MIN / 1 MIN with the 5-second countdown. **10 MINUTES**: confetti and strikes ("that's the rate", "that's an hour", "too short"). The buses slide to one every 10 minutes (six green "10" segments): **60 MIN ÷ 6 BUSES = 10 MIN**. Teaser: NEXT: A CHEAT SHEET · WHICH ONE? (flat, bars, bell and falling-curve icons). End card: NEXT: WHICH DISTRIBUTION?, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Waiting time · Next event · Steady rate · Mean = 1 / rate. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Poisson" is phoneme-patched to *pwah-SOHN*, and "fifteen" and "fourteen" are patched to stress their second syllable.

**S1 · Hook** (0:00.00–0:10.58)
- `0:00.45` A chai stall gets 4 customers an hour, on average.
- `0:03.91` One just left. How long until the next one walks in?
- `0:07.34` The exponential distribution answers that.

**S2 · The definition** (0:10.58–0:26.30)
- `0:11.03` Here's the definition, in simple words.
- `0:13.64` The exponential distribution measures the waiting time until the next event.
- `0:18.44` The events happen at random, at a steady average rate.
- `0:21.60` Short waits are the most common, and long waits get rarer and rarer.

**S3 · The gaps** (0:26.30–0:40.01)
- `0:26.75` Watch the gaps between customers.
- `0:28.80` 4 an hour means one every 15 minutes, on average.
- `0:32.37` But real gaps vary: 6 minutes, then 22, then 3, then 31.
- `0:36.92` Collect many gaps, and a shape appears.

**S4 · The shape** (0:40.01–0:53.38)
- `0:40.46` The curve starts highest at zero, and slides down.
- `0:43.60` So short waits are the most common.
- `0:45.68` The next customer within 5 minutes? About 28%.
- `0:49.47` Longer than half an hour? Only about 14%.

**S5 · The surprise** (0:53.38–1:03.33)
- `0:53.83` Here's a surprise.
- `0:55.17` The average gap is 15 minutes, yet about 63% of gaps are shorter.
- `1:00.14` A few very long gaps pull the average up.

**S6 · No memory** (1:03.33–1:14.22)
- `1:03.78` It also has no memory.
- `1:05.43` Waited 10 minutes already? That doesn't make the next customer come any sooner.
- `1:09.89` From any moment, the wait ahead still averages 15 minutes.

**S7 · Remember** (1:14.22–1:27.84)
- `1:14.67` So remember: the exponential distribution measures the waiting time until the next event, when events happen at random at a steady rate.
- `1:22.81` Poisson counts the events. Exponential measures the gaps between them.

**S8 · Quiz, teaser and CTA** (1:27.84–1:53.20)
- `1:28.19` Quick quiz!
- `1:29.22` Buses come at random, 6 an hour on average.
- `1:32.22` What's the average wait between buses?
- `1:39.82` 10 minutes!
- `1:40.89` Flip the rate: 60 minutes, divided by 6 buses, is 10 minutes.
- `1:45.30` Next: so many distributions! Which one should you use? A quick cheat sheet.
- `1:49.93` Follow for data science made simple!

*(Between "What's the average wait between buses?" and "10 minutes!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Definition:** when events happen independently at a constant average rate λ (a Poisson process), the waiting time T until the next event is exponential: density λe^(−λt), P(T > t) = e^(−λt), mean 1/λ.
- **The stall:** λ = 4 an hour gives a mean wait of 60 ÷ 4 = **15 min**, so P(T > t) = e^(−t/15).
  - P(T ≤ 5) = 1 − e^(−1/3) = **28.3%** ("about 28%").
  - P(T > 30) = e^(−2) = **13.5%** ("about 14%").
  - P(T < 15) = 1 − e^(−1) = **63.2%** ("about 63% of gaps are shorter"); P(T > 15) = 36.8% (shown as 37%).
  - The density is highest at t = 0 and falls steadily, so short waits are the most common. The median wait is 15 ln 2 ≈ 10.4 min, below the mean: the long right tail pulls the mean up.
- **No memory:** P(T > s + t | T > s) = P(T > t). Having waited 10 minutes, the extra wait is again exponential with mean 15 min. For example, P(T > 25 | T > 10) = e^(−1) = P(T > 15).
- **Scene 3:**
  - The gaps 6, 22, 3 and 31 min are illustrative (mean 15.5).
  - The 80 gaps are a seeded exponential simulation (`expSamples(15, 80, 99)`), checked before use. Mean 14.5 min; 63% under 15 min; columns 23, 14, 13, 10, 10, 5, 1, 0, 0, 1, 1, 0 in 5-minute bins; 2 gaps over 60 min are off the chart.
- **Poisson ↔ exponential:** in a Poisson process the counts per interval are Poisson and the gaps between events are exponential.
- **Quiz:** 6 buses an hour at random gives a mean wait between buses of 60 ÷ 6 = **10 min** (mean = 1/rate).
  - The distractors: 6 min (the rate read as a time), 60 min (the hour), 1 min.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a door sound and footsteps as the customer leaves, stopwatch ticks, and the riser, impact and crash on "exponential".
- Definition: calm "flow", with a blip per line.
- The gaps and the shape: marimba "play", with clicks on each spoken gap, ticks as the dots drop, and glides as the bands fill.
- The surprise and no memory: groove, with hops on the tail dots, stopwatch ticks, a glitch on "doesn't" and a ding on "still".
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words (the scene 3 whoosh and dot ticks start after "Collect many"). The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `poisson-distribution/` (`REF=poisson-distribution bash .claude/skills/data-science-explainer/new-video.sh exponential-distribution ExponentialDistribution Exponential_Distribution`). It adds `src/components/Exp.tsx`:
- `expPdf`, `expCdf` and a seeded `expSamples`;
- `ExpCurve`, a curve chart with shaded bands and a shift `t0` for "no memory";
- `MinAxis`, `Stopwatch`, `GapIcon` and `DotsIcon`.

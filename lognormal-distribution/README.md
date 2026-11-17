# The Log-Normal Distribution Explained in 2 Minutes

The twentieth **Data Science Made Simple** Reel for **@curious_datascientist**: skewed data whose logs form a bell. 2:05, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Part of the "explain it very well" batch, so every term is explained before it is used:
- a hook;
- a plain-words definition card;
- what a log is ("it counts the zeros");
- the same 100 house prices on a normal scale and on a log scale;
- why it happens (growth by percentages);
- where it shows up, plus a data-science tip (take the log);
- a recap;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: BERNOULLI & GEOMETRIC chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Lognormal_Distribution.mp4` | the finished Reel |
| `Lognormal_Distribution_Cover.png` | 1080×1920 cover: THE LOG-NORMAL DISTRIBUTION · explained in 2 minutes, "SKEWED? TAKE THE LOG." with a skewed curve (normal scale) → a bell (log scale), @curious_datascientist |
| `Lognormal_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Prices on a normal scale (the skew, the long tail) | orange |
| The log scale, the bell | violet |
| Counting zeros, positive values | cyan |
| Percentage growth, the tip | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:15 | **Hook** | A street of houses pops in; two big ones glow orange: **MOST MODERATE, A FEW HUGE**. Their 100 prices drop as dots on a price axis: **A LONG TAIL TO THE RIGHT**. On "change the scale" every dot glides to the log axis: **A PERFECT BELL** → **THE LOG-NORMAL DISTRIBUTION** with a burst. |
| 2 | 0:15–0:31 | **The definition** | IN SIMPLE WORDS: a 3-line card. 1 Only **POSITIVE VALUES** (> 0); 2 **SKEWED** to the right; 3 take the log: **A NORMAL BELL**. Then **LOG-NORMAL = ITS LOGS ARE NORMAL**. |
| 3 | 0:31–0:45 | **What's a log?** | **A LOG COUNTS THE ZEROS**: 10 → log = 1, 100 → log = 2, 1,000 → log = 3, zeros lit cyan, each on its word. A log axis 1 · 10 · 100 · 1,000 · 10,000 with equal steps, each hop marked ×10: A LOG SCALE: EVERY STEP IS ×10. |
| 4 | 0:45–1:00 | **Two scales** | ON A NORMAL SCALE: 100 house prices (lakh rupees) drop into 20-lakh columns. A bracket marks **BUNCHED ON THE LEFT**; the dots of 100 lakh and up glow orange: **A FEW FAR RIGHT**. **ON A LOG SCALE**: every dot glides to its log column (ticks 5 · 50 · 500) and a dashed green normal curve traces over the result: **A SYMMETRIC BELL**. |
| 5 | 1:00–1:16 | **Why it happens** | **PRICES GROW BY PERCENTAGES**. A 20 LAKH FLAT and a 2 CRORE VILLA as bars; +10% adds **+2 L** to one and **+20 L** to the other (green caps). On "multiplies" five years of +10% play (YEAR 1 → 5): ₹32 L vs ₹322 L, **+12 L** vs **+122 L**: **BIG VALUES STRETCH OUT**. |
| 6 | 1:16–1:31 | **Where it shows up + a tip** | Chips land on their words: INCOMES, HOUSE PRICES, TIME TO FINISH A TASK, STOCK PRICES. A **DATA SCIENCE TIP** card: SKEWED DATA → **TAKE THE LOG** → A BELL; **MANY MODELS WORK BETTER ON A BELL**. |
| 7 | 1:31–1:39 | **Remember** | LOG-NORMAL DISTRIBUTION pill and a recap flow: **POSITIVE VALUES** ↓ **SKEWED TO THE RIGHT** ↓ **LOGS: A NORMAL BELL**. |
| 8 | 1:39–2:05 | **Quiz, teaser and CTA** | QUICK QUIZ. A violet bell: ON A LOG SCALE. "On a normal scale? **WHAT SHAPE?**" Options BELL / SKEWED RIGHT / FLAT / SKEWED LEFT with the 5-second countdown. **SKEWED RIGHT**: confetti and strikes ("that's the log scale", "that's uniform", "wrong side"); the bell morphs into a right-skewed curve (THE SAME DATA, NORMAL SCALE); **BUNCHED LEFT, LONG TAIL RIGHT**. Teaser: NEXT: BERNOULLI & GEOMETRIC · YES OR NO? End card: NEXT: BERNOULLI & GEOMETRIC, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Positive values · Skewed right · Logs are normal · Take the log. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Lakh" is phoneme-patched to *laakh*, and "Bernoulli" to *ber-NOO-lee*. (Whisper's English model writes "lakh" as "lock" and "crore" as "core"; the spoken words are right.)

**S1 · Hook** (0:00.00–0:15.37)
- `0:00.45` House prices in a city: most are moderate, but a few are very expensive.
- `0:05.34` Plot them, and the shape leans to the left, with a long tail to the right.
- `0:09.44` But change the scale, and they form a perfect bell.
- `0:12.52` That's the log-normal distribution.

**S2 · The definition** (0:15.37–0:30.59)
- `0:15.82` Here's the definition, in simple words.
- `0:18.42` A log-normal distribution has only positive values, and it's skewed to the right.
- `0:23.52` But take the log of every value, and you get a normal bell curve.
- `0:27.53` That's the name: its logs are normal.

**S3 · What's a log?** (0:30.59–0:44.83)
- `0:31.04` So what's a log? Here's the easy way to think about it.
- `0:34.27` A log counts the zeros. The log of 10 is 1. The log of 100 is 2. The log of 1,000 is 3.
- `0:41.25` So on a log scale, each step means times ten.

**S4 · Two scales** (0:44.83–0:59.70)
- `0:45.28` Here are 100 house prices, in lakhs of rupees.
- `0:48.50` On a normal scale, most are bunched on the left, and a few stretch far to the right.
- `0:53.30` Now switch to a log scale.
- `0:55.26` The same prices form a symmetric bell. That's log-normal.

**S5 · Why it happens** (0:59.70–1:16.12)
- `1:00.15` Why does this happen? Because prices grow by percentages.
- `1:03.75` A 10% rise adds 2 lakh to a 20 lakh flat, but 20 lakh to a 2 crore villa.
- `1:09.54` Growth that multiplies, instead of adding, stretches the big values out. That makes the long tail.

**S6 · Where and a tip** (1:16.12–1:30.62)
- `1:16.57` You'll see log-normal data everywhere: incomes, house prices, the time to finish a task, and stock prices.
- `1:23.75` Data science tip: when your data looks like this, take the log. Many models work better on a bell shape.

**S7 · Remember** (1:30.62–1:38.83)
- `1:31.07` So remember: log-normal values are positive, and skewed to the right.
- `1:35.63` Take their logs, and you get a normal bell.

**S8 · Quiz, teaser and CTA** (1:38.83–2:05.31)
- `1:39.18` Quick quiz!
- `1:40.21` A dataset makes a perfect bell on a log scale.
- `1:43.21` What shape does it have on a normal scale?
- `1:50.80` Skewed to the right!
- `1:52.14` A bell on a log scale means log-normal: bunched on the left, with a long tail to the right.
- `1:57.63` Next: the simplest distributions of all, Bernoulli and geometric.
- `2:02.04` Follow for data science made simple!

*(Between "What shape does it have on a normal scale?" and "Skewed to the right!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Definition:** X is log-normal when ln X (equivalently log₁₀ X) is normally distributed. X is then always positive and right-skewed.
- **"A log counts the zeros":** log₁₀ of 10, 100 and 1,000 is 1, 2 and 3. This is exact for powers of ten and a teaching shortcut in general; log₁₀ 50 ≈ 1.7, between 1 and 2 zeros.
- **Scene 4 data:** 100 evenly spaced quantiles (not random draws) of a log-normal with median 50 lakh and log-SD 0.6 (log₁₀-SD 0.26).
  - Range 10.7–234.5 lakh, mean 59.7.
  - 20-lakh columns: 6, 29, 27, 16, 10, 5, 3, 1, 1, 1, 0, 1, 0 (right-skewed); 12 prices are 100 lakh or more.
  - On log₁₀ bins of 0.1 (5 to 500 lakh) the counts are symmetric around 50 lakh: 1, 2, 3, 7, 9, 13, 15, 15, 13, 10, 6, 3, 2, 1.
  - The dashed curve is the matching normal density on the log axis.
- **Why:** multiplicative growth gives a log-normal shape, because the log of a product is a sum of logs and sums of many small effects tend towards a normal (the central limit theorem on the log scale).
  - +10% of 20 lakh = **2 lakh**; +10% of 2 crore (200 lakh) = **20 lakh**.
  - Five years at +10%: × 1.1⁵ = × 1.611, so 20 → **32.2 lakh** (+12) and 200 → **322 lakh** (+122).
- **Uses:** incomes, house prices, task-completion times and stock prices (in the standard geometric Brownian motion model) are classic approximately log-normal examples.
- **Tip:** a log transform of right-skewed positive data is a standard preprocessing step. It makes the data more symmetric, which suits models that assume normal errors or are sensitive to large values.
- **Quiz:** if the log of the data is normal, the data itself is log-normal, which is **right-skewed** on a linear scale.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, hops as the houses appear, a sparkle on the big two, ticks as the dots drop, a glide as they fly into the bell, and the riser, impact and crash on "log-normal".
- Definition: calm "flow", with a blip per line and a ding on "its logs are normal".
- What's a log and two scales: marimba "play", with step tones on 10, 100 and 1,000, blips on each ×10 hop, ticks as the dots drop, a whoosh and glide on "switch", and a ding on the bell.
- Why and uses: groove, with blips on +2 L and +20 L, a step per year of growth, blips per chip and a sparkle on the tip.
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `pareto-distribution/` (`REF=pareto-distribution bash .claude/skills/data-science-explainer/new-video.sh lognormal-distribution LognormalDistribution Lognormal_Distribution`). It adds:
- `src/data.ts`, the 100 prices;
- `src/components/PriceDots.tsx`: the dot plot that morphs between a linear and a log scale (`dotPos`, `bellY`, `MorphAxis`).

# What Is a Probability Distribution? Explained in 2 Minutes

The eleventh **Data Science Made Simple** Reel for **@curious_datascientist**: 111 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It's the bridge into the distribution videos promised at the end of the normal distribution Reel. It covers:
- what a probability distribution is: every possible outcome, how likely each one is, and that all the chances add up to 1;
- the two kinds, using the series' own colours for discrete (cyan) and continuous (green) data;
- discrete with one dice (six bars of 1/6, stacking to 1), then two dice (36 combinations become the 2–12 triangle; 7 is most likely, 2 and 12 rarest);
- continuous with height (one exact value has chance 0; the area under the curve is the chance; 158–172 cm ≈ 68%; total area 1);
- why it matters (customers per hour, battery life, rain tomorrow);
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: POPULATION VS SAMPLE chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Probability_Distribution.mp4` | the finished Reel |
| `Probability_Distribution_Cover.png` | 1080×1920 cover: WHAT IS A PROBABILITY DISTRIBUTION? · explained in 2 minutes, two-dice bars (discrete, 7 highlighted) next to a curve with a shaded area (continuous), @curious_datascientist |
| `Probability_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Discrete (dice, bars, counts) | cyan (series colour) |
| Continuous (height, curves, measurements) | green (series colour) |
| Probability, area, "total = 1", the most likely total | violet |
| The rarest outcomes (2 and 12), sunny | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | WHAT WILL YOU GET? A dice tumbles and lands; "can't know for sure". Six faces flip in with 1/6 each, rise into six equal bars, and **PROBABILITY DISTRIBUTION** slams in. |
| 2 | 0:09–0:19 | **What it is** | TOMORROW'S WEATHER: an OUTCOME / CHANCE table (sunny 0.5, cloudy 0.3, rainy 0.2). A dashed 100% bar fills segment by segment (50% · 30% · 20%): **0.5 + 0.3 + 0.2 = 1**. |
| 3 | 0:19–0:25 | **Two kinds** | A PROBABILITY DISTRIBUTION pill wires down to two cards. **DISCRETE** (things you count: dice, bars) in cyan and **CONTINUOUS** (things you measure: ruler, a smooth curve) in green. |
| 4 | 0:25–0:36 | **One dice** | Six faces with 1/6 chips, then six bars (BAR HEIGHT = PROBABILITY). STACK ALL SIX: the bars fly into one column, **6 × 1/6 = 1**. |
| 5 | 0:36–0:48 | **Two dice** | Two dice tumble and land 3 + 4 = 7. A 6 × 6 grid of all **36 COMBINATIONS** (each cell shows its total) appears, and the six 7s light up violet ("6 of them make 7"). Every cell drops into a bar for its total, forming the 2–12 triangle: **7 IS THE MOST LIKELY** (6/36). Then 2 and 12 turn orange, **the rarest** (1/36 each). |
| 6 | 0:48–1:05 | **Continuous** | A green height curve (144–186 cm). A needle at **165.0000…** cm has rolling digits: "chance of this exact value = **0**" (A LINE HAS NO WIDTH). **AREA = CHANCE**: a violet band sweeps out, then settles on 158–172 cm with a bracket: **68%**. **TOTAL AREA = 1**: the whole curve fills. |
| 7 | 1:05–1:16 | **Why it matters** | UNCERTAINTY → NUMBERS, then three cards, each with its own distribution. **CUSTOMERS PER HOUR** (a count: Poisson-shaped bars). **BATTERY LIFE** (a measurement: a curve). **RAIN TOMORROW?** (two outcomes: 0.3 / 0.7). |
| 8 | 1:16–1:31 | **The complete picture** | PROBABILITY DISTRIBUTION pill and three cards. **OUTCOMES + CHANCES** (the weather list); **DISCRETE** (bar height = probability, two-dice triangle); **CONTINUOUS** (area under curve = probability). Then **EITHER WAY, TOTAL = 1**. |
| 9 | 1:31–1:51 | **Quiz + CTA** | QUICK QUIZ. Two coins flip. "Chance of exactly **ONE HEAD?**" Options 1/4 / 1/2 / 3/4 / 1/3 with the 5-second countdown. **1/2**: confetti and strikes ("that's just HT", "too many", "4 outcomes"). The four outcomes HH · HT · TH · TT appear; HT and TH glow: **2 OF 4 OUTCOMES = 1/2**. End card: NEXT: POPULATION VS SAMPLE, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Total = 1 · Discrete · Continuous · Area = chance. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.09)
- `0:00.45` Roll a dice. What will you get?
- `0:02.50` You can't know for sure.
- `0:03.98` But you can know the chance of every outcome.
- `0:06.43` That's a probability distribution.

**S2 · What it is** (0:09.09–0:18.74)
- `0:09.54` A probability distribution lists every possible outcome, and how likely each one is.
- `0:14.98` And all the chances add up to 1, or 100%.

**S3 · Two kinds** (0:18.74–0:24.88)
- `0:19.19` There are two kinds.
- `0:20.50` Discrete, for things you count. And continuous, for things you measure.

**S4 · Discrete: one dice** (0:24.88–0:35.71)
- `0:25.33` Roll a fair dice: 6 outcomes, each with a chance of 1 in 6.
- `0:29.81` Drawn as bars, the heights are the probabilities.
- `0:32.77` Stack all six, and they add up to 1.

**S5 · Discrete: two dice** (0:35.71–0:48.20)
- `0:36.16` Now roll two dice, and add them.
- `0:38.25` There are 36 combinations, and 6 of them make 7.
- `0:41.83` So 7 is the most likely total.
- `0:44.29` 2 and 12 are the rarest, with just one way each.

**S6 · Continuous** (0:48.20–1:05.39)
- `0:48.65` Height is continuous. It can take any value, so the chance of one exact value is zero.
- `0:54.38` Instead, the chance is the area under the curve.
- `0:57.21` The area between 158 and 172 centimetres is about 68%.
- `1:03.05` And the total area is 1.

**S7 · Why it matters** (1:05.39–1:15.75)
- `1:05.84` Distributions turn uncertainty into numbers you can plan with.
- `1:09.53` How many customers will walk in?
- `1:11.41` How long will a battery last?
- `1:13.20` What's the chance of rain tomorrow?

**S8 · The complete picture** (1:15.75–1:30.58)
- `1:16.20` Here's the complete picture.
- `1:17.84` A probability distribution shows every outcome and its chance.
- `1:21.79` Discrete: the bar heights are probabilities.
- `1:24.49` Continuous: the areas under the curve are probabilities.
- `1:27.94` Either way, the total is 1.

**S9 · Quiz and call to action** (1:30.58–1:50.55)
- `1:30.93` Quick quiz!
- `1:31.96` You flip a coin twice.
- `1:33.50` What's the chance of getting exactly one head?
- `1:41.34` One half!
- `1:42.41` Of the four outcomes, two have exactly one head: heads-tails, and tails-heads.
- `1:47.28` Follow for data science made simple!

*(Between "What's the chance of getting exactly one head?" and "One half!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **One fair dice:** six equally likely outcomes, each 1/6; 6 × 1/6 = 1.
- **Two dice:** 6 × 6 = 36 equally likely ordered pairs.
  - Ways to make each total, from 2 to 12: 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1. The grid cells are counted into those columns in code (`S5TwoDice.tsx`).
  - P(7) = 6/36 = 1/6 ≈ 16.7%, the most likely total. P(2) = P(12) = 1/36.
- **Weather example:** illustrative chances 0.5 + 0.3 + 0.2 = 1.
- **Continuous, P(exact value) = 0:** for a continuous random variable, any single exact value has probability 0; probabilities come from areas (integrals of the density) over intervals.
- **Heights:** the normal distribution Reel's example (mean 165 cm, SD 7 cm). 158–172 cm is ±1 SD, so about 68% (68.27%). The total area under any probability density is 1.
- **Customers per hour:** the bars are the Poisson distribution with mean 4 (P(k) = e^−4 · 4^k / k!, k = 0…9), scaled to the tallest bar.
- **Battery life:** shown as a generic smooth curve.
- **Rain tomorrow:** illustrative 0.3 / 0.7.
- **Quiz:** two fair coin flips give four equally likely outcomes, HH, HT, TH, TT. Exactly one head occurs in HT and TH, so 2/4 = **1/2**.
  - The distractors: 1/4 (counting only HT, forgetting TH), 3/4 (too many; that's "at least one head"), 1/3 (treating "0, 1 or 2 heads" as equally likely).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro ticks while the dice tumbles, a clink as it lands, ascending blips for the six faces, and the riser, impact and crash on "probability distribution".
- What it is and two kinds: calm "flow", with step tones as the 100% bar fills and a ding on "1".
- Dice scenes: marimba "play", with ticks, rising blips as the bars stack, a bell arpeggio on "= 1", shuffle and tick cascade as the 36 cells fall into bars, and a lead on "most likely".
- Continuous: "flow", with a stamp on "zero" and a lead on "total area is 1".
- Why it matters: groove.
- Overview: build.
- Quiz: suspense countdown, then the finale.

SFX land 6–12 frames before their words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `z-score/` (`REF=z-score bash .claude/skills/data-science-explainer/new-video.sh probability-distribution ProbabilityDistribution Probability_Distribution`). It adds `src/components/Prob.tsx`: `Die`, `Coin`, `SunGlyph`, `CloudGlyph`, `BatteryGlyph` and `MiniBars`.

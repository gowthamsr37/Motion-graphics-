# The Central Limit Theorem Explained in 2 Minutes (v2, simpler)

The thirteenth **Data Science Made Simple** Reel for **@curious_datascientist**, remade on request: the first version wasn't easy enough to follow and never stated the definition. 111 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

What changed from v1:
- **The definition is stated outright**, in plain words, right after the hook. It's built on screen as a 5-line card:
  1. take MANY RANDOM SAMPLES;
  2. find the AVERAGE of each;
  3. the averages form a BELL CURVE;
  4. even if the data ISN'T A BELL;
  5. samples of 30 OR MORE.

  It's repeated as a recap ("Many samples, one average each, and those averages make a bell curve, whatever the original shape").
- **One running, everyday example** instead of dice + bus waits + several formulas: monthly salaries in a city (skewed, like the skewness Reel). It's shown step by step with a step tracker: pick 30 → average → again → repeat → a bell.
- **A "why" scene**: big salaries get mixed with ordinary ones, so extremes cancel out and averages land near the middle.
- **No formulas.** The standard error is described in words ("bigger samples make it narrower, so your estimate gets more precise").
- **The quiz tests the definition itself** (what shape do averages of a skewed dataset make?).

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: MORE DISTRIBUTIONS chip on the end card. v1's scenes are kept for reference in `reference/v1/scenes` (not compiled).

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Central_Limit_Theorem.mp4` | the finished Reel (v2) |
| `Central_Limit_Theorem_Cover.png` | 1080×1920 cover: THE CENTRAL LIMIT THEOREM · explained in 2 minutes, skewed salary bars → the bell of sample averages, @curious_datascientist |
| `Central_Limit_Theorem.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The original (skewed) data, the big salaries | orange |
| Samples, the 30 people picked | cyan |
| Averages, the bell curve | green |
| Precision (bigger samples, narrower bell) | violet |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:08 | **Hook** | WHY IS THE BELL CURVE EVERYWHERE? A green bell draws, with cards for HEIGHTS, EXAM SCORES, MEASUREMENT ERRORS and POLL RESULTS. EVEN WHEN THE DATA ISN'T A BELL? Three odd shapes (skewed, flat, two humps) with "?" badges. **THE CENTRAL LIMIT THEOREM** slams in · EXPLAINED SIMPLY. |
| 2 | 0:08–0:24 | **The definition** | THE DEFINITION · IN SIMPLE WORDS: five dashed rows fill in on the spoken words. 1 Take **MANY RANDOM SAMPLES** (three sample circles); 2 Find the **AVERAGE** of each (46 · 36 · 40); 3 Averages form a **BELL CURVE** (mini bell); 4 Even if the data **ISN'T A BELL** (mini skewed shape); 5 Samples of **30 OR MORE** (n = 30+). All five tick green: THAT'S THE CENTRAL LIMIT THEOREM. |
| 3 | 0:24–0:33 | **The example** | AN EXAMPLE · SALARIES IN A CITY: orange salary bars from ₹0K to ₹160K. MOST EARN A LITTLE (the tall left bars boxed) and A FEW EARN A LOT (the long tail boxed), then the stamp **SKEWED, NOT A BELL**. |
| 4 | 0:33–0:49 | **Step by step** | A tracker reads PICK 30 → AGAIN → REPEAT. Step 1: 30 random people light up on the salary axis (big earners orange), their AVERAGE ₹46K line rises, and the average drops as a green dot into THE AVERAGES chart below. Step 2: another 30, ₹36K. Step 3: a "samples" counter runs to 140 as averages rain down and pile up. Look! The salary chart fades and a bell traces over the pile: **A BELL CURVE! FROM SKEWED SALARIES**. |
| 5 | 0:49–1:01 | **Why it happens** | WHY? Three random groups of 30 on the salary axis, each with A FEW HUGE ONES (orange, up to ₹192K) among many ordinary salaries. EXTREMES CANCEL OUT: each group's average tick lands at ₹40K, ₹39K and ₹42K, inside a green band, NEAR THE MIDDLE. |
| 6 | 1:01–1:10 | **Two bonus facts** | City salaries above, the averages' bell below on the same scale. A dashed **TRUE AVERAGE ₹40K** line runs through both: the bell is centred on it. Then SAMPLES OF 30 → **SAMPLES OF 120**: the bell turns violet, taller and narrower, MORE PRECISE. |
| 7 | 1:10–1:24 | **Remember** | REMEMBER · THE CENTRAL LIMIT THEOREM: **MANY SAMPLES** ↓ **ONE AVERAGE EACH** ↓ **A BELL CURVE**, with ANY ORIGINAL SHAPE (three odd shapes). Then a crowd with a few dots picked → A FEW THOUSAND DESCRIBE A COUNTRY. |
| 8 | 1:24–1:51 | **Quiz, teaser and CTA** | QUICK QUIZ. VERY SKEWED DATA (an orange curve) with a SAMPLES OF 50 chip. "What shape **WILL YOU SEE?**" Options Skewed / Bell curve / Flat / Two peaks with the 5-second countdown. **A BELL CURVE**: confetti and strikes ("that's the data", "not flat", "just one"). The skewed shape slides left, an arrow points to THEIR AVERAGES (a green bell): ANY SHAPE IN, A BELL OUT. Teaser: IN FUTURE VIDEOS · MORE DISTRIBUTIONS. End card: NEXT: MORE DISTRIBUTIONS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Many samples · Their averages · Bell curve · Any shape. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences, no formulas; numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:08.40)
- `0:00.45` Why does the bell curve show up everywhere?
- `0:02.79` Even when the data isn't shaped like a bell?
- `0:05.29` The answer is the Central Limit Theorem.

**S2 · The definition** (0:08.40–0:23.84)
- `0:08.85` Here's what it says, in simple words.
- `0:11.04` Take many random samples, and find the average of each one.
- `0:14.82` Those averages will form a bell curve, even if the original data isn't a bell.
- `0:19.76` You just need big enough samples, usually 30 or more.

**S3 · The example** (0:23.84–0:33.44)
- `0:24.29` Let's see it with an example.
- `0:25.99` Here are the salaries in a city.
- `0:27.88` Most people earn a little, and a few earn a lot.
- `0:30.70` So the data is skewed, not a bell.

**S4 · Step by step** (0:33.44–0:48.81)
- `0:33.89` Step 1: pick 30 people at random, and find their average salary.
- `0:38.36` Step 2: pick another 30, and find their average.
- `0:41.53` Step 3: repeat this again and again, and plot every average.
- `0:45.70` Look! The averages form a bell curve.

**S5 · Why it happens** (0:48.81–1:00.66)
- `0:49.26` Why does this happen?
- `0:50.71` In a random group of 30, the few huge salaries get mixed with many ordinary ones.
- `0:56.08` So the extremes cancel out, and most averages land near the middle.

**S6 · Two bonus facts** (1:00.66–1:10.33)
- `1:01.11` Two bonus facts.
- `1:02.42` The bell is centred on the true average of the whole city.
- `1:05.54` And bigger samples make it narrower, so your estimate gets more precise.

**S7 · Remember** (1:10.33–1:24.21)
- `1:10.78` So remember the Central Limit Theorem.
- `1:13.00` Many samples, one average each, and those averages make a bell curve, whatever the original shape.
- `1:19.25` That's why a survey of a few thousand people can describe a whole country.

**S8 · Quiz, teaser and CTA** (1:24.21–1:50.65)
- `1:24.56` Quick quiz!
- `1:25.59` Some data is very skewed. You take many samples of 50, and plot their averages.
- `1:30.82` What shape will you see?
- `1:37.71` A bell curve!
- `1:38.89` With big enough samples, the averages form a bell, whatever the original shape.
- `1:43.62` In future videos, we'll explore other kinds of distributions.
- `1:47.38` Follow for data science made simple!

*(Between "What shape will you see?" and "A bell curve!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **The definition:** the CLT says that for independent random samples of size n from a population with a finite mean μ and standard deviation σ, the distribution of the sample mean gets closer and closer to a normal distribution (mean μ, standard deviation σ/√n) as n grows, whatever the population's shape. The video says it in plain words. "Big enough samples, usually 30 or more" is the standard rule of thumb; very skewed data can need more.
- **The salaries** (`src/components/Salary.tsx`): a log-normal model of monthly salaries in ₹ thousand (median ₹30K, log-SD 0.75).
  - Mean ₹39.7K, SD ₹34.5K, skewness about 3; 7% of people earn over ₹90K. That makes it a strongly right-skewed population (illustrative, not real city data).
  - The bars are the exact share in each ₹10K bin from ₹0K to ₹160K.
- **The samples:** 140 random samples of 30 people, seeded (`normals(8000 + i, …)`).
  - Their averages have mean ₹39.9K and SD ₹6.7K (theory: ₹39.7K and 34.5 ÷ √30 = ₹6.3K), ranging from ₹27.5K to ₹64.8K. Skewness drops from about 3 to 0.7, already close to a bell.
  - Step 1's average is ₹45.7K (shown ₹46K); step 2's is ₹36.2K.
  - The overlaid bell is Normal(39.7, 6.3) scaled to the dot count.
- **Why it happens:** groups 5, 12 and 19 each contain big earners (top salaries ₹127K, ₹130K and ₹192K), yet average ₹40.1K, ₹38.7K and ₹42.4K. A single ₹192K salary moves the average of 30 by only about ₹5K.
- **Bonus facts:** the bell of averages is centred on the population mean (₹39.7K, shown as ₹40K). Its spread is σ/√n: ₹6.3K for samples of 30 and ₹3.15K for samples of 120 (4× the sample, half the spread). The bells drawn there are the normal approximations.
- **Surveys:** a random sample of about 1,000 gives a margin of error of about ±3 points for the whole country, because precision depends on the sample size, not the population size. That's the CLT at work.
- **Quiz:** for very skewed data, the averages of many samples of 50 are approximately normal, so a bell curve.
  - The distractors: "Skewed" (that's the original data, not the averages), "Flat", "Two peaks".

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, and the riser, impact and crash on "Central Limit Theorem".
- Definition: calm "flow", with an ascending blip per line, a rising lead on "bell curve" and a ding as all five lines tick.
- Example and steps: marimba "play", with ticks as the bars grow, a stamp on "skewed", step tones, glides for the average lines, hops as the averages drop, a tick stream as they rain down, and a bell arpeggio plus ta-da on "a bell curve".
- Why and bonus facts: groove, with a lead on "near the middle".
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

Scaffolded from `population-vs-sample/`. v2 adds `src/components/Salary.tsx` (the salary model, samples, averages, `PopBars`, `K` labels, `AxisLabels`); `src/components/Clt.tsx` (exact dice and Gamma densities, `AreaChart`, `BarChart`, `Radical`) is kept from v1.

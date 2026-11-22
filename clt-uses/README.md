# How Can 1,000 People Predict an Election? (the CLT in real life)

A practical follow-up to `central-limit-theorem/` for **@curious_datascientist**. **Version 2:** the user found the first cut (five uses, each explained briefly) hard to follow, and asked to *explain only one example in detail, then say "similarly it's used in" and list the others*. So the reel now walks one election poll end to end: the yes/no raw data → the poll result is an average → repeated polls stack into a bell (the CLT) → standard error 1.6% → 52% ± 3% (margin of error = 95% confidence interval) → 4× the people halves the margin. Then it quickly tours A/B tests, factories, insurance and ML, states the one rule, and ends with the caption-poll prompt. 2:39, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

**Title card from frame 0** (house rule): HOW CAN 1,000 PEOPLE PREDICT AN ELECTION? · THE CENTRAL LIMIT THEOREM IN REAL LIFE, the big ELECTION POLLS tile (THE DETAILED EXAMPLE) and the four small "+ 4 MORE PLACES IT'S USED" tiles are all on screen by about 1.5 s.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `CLT_Real_World_Uses.mp4` | the finished Reel |
| `CLT_Real_World_Uses_Cover.png` | 1080×1920 cover = the title card: HOW CAN 1,000 PEOPLE PREDICT AN ELECTION?, a 52% ± 3% tile (WHERE DOES THE ± COME FROM?), the four other uses, SAVE THIS ONE, @curious_datascientist |
| `CLT_Real_World_Uses.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Colour code

The poll example cyan · the bell of poll results yellow · the 95% range / margin of error green · "not a bell" and "no CLT" red · in the tour: A/B tests orange, factories green, insurance violet, machine learning pink `#F0ABFC` (the ML-series accent).

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Title card (from frame 0)** | HOW CAN 1,000 PEOPLE PREDICT AN ELECTION? · THE CENTRAL LIMIT THEOREM IN REAL LIFE; ELECTION POLLS tile (THE DETAILED EXAMPLE); + 4 MORE PLACES IT'S USED: A/B TESTS · FACTORIES · INSURANCE · ML, wiggling on "4 more"; SAVE THIS ONE bookmark. |
| 2 | **The problem** | A crowd of dim dots (MILLIONS OF VOTERS); 1,000 light up (ASK 1,000 AT RANDOM); EACH PERSON: YES OR NO; two bars YES / NO; a struck-out bell: THE RAW DATA IS NOT A BELL CURVE. |
| 3 | **The poll result is an average** | Counter rolls to 520 / 1,000 YES = 52%; a row of 1s and 0s drops in (YES = 1 · NO = 0); AVERAGE = 520 ÷ 1,000 = 0.52; A POLL RESULT IS JUST AN AVERAGE. |
| 4 | **Run the poll again and again** | POLL 1, 2, 3, 4 …; the results 51, 53, 52, 50, 54 drop onto a 47–57% axis, then ~150 more stack into a histogram; a yellow bell draws over it; MOST LAND NEAR THE MIDDLE (green band); THAT'S THE CENTRAL LIMIT THEOREM · YES/NO ANSWERS → AVERAGES FORM A BELL. |
| 5 | **How wide is the bell?** | SPREAD = STANDARD ERROR; SE = √( p × (1 − p) / n ); = √( 0.52 × 0.48 / 1,000 ); ABOUT 0.016 = 1.6%; a small bell with the 1 SE = 1.6% bracket. |
| 6 | **The margin of error** | The 95% band (±2 SE) fills on the bell; 2 SE = 2 × 1.6% = ABOUT 3%; bracket TRUE SUPPORT: PROBABLY 49% TO 55%; 52% ± 3%; ± 3% = MARGIN OF ERROR · 49 TO 55 = 95% CONFIDENCE INTERVAL; NO CLT = NO ± AT ALL. |
| 7 | **Want a smaller margin?** | ASK 4× AS MANY PEOPLE; a second bell (n = 4,000, ± 1.5%) half as wide under the first (n = 1,000, ± 3%); 4× THE PEOPLE = HALF THE MARGIN. |
| 8 | **Similarly, it's used in** | SAME IDEA AS ELECTION POLLS · SIMILARLY, IT'S USED IN; four tiles land one per sentence and glow while spoken: A/B TESTS (average spend per user, A vs B) · FACTORIES (average weight of 5 bottles, every hour) · INSURANCE (average claim of thousands of customers) · MACHINE LEARNING (accuracy = average of right / wrong). |
| 9 | **The rule + save moment** | SINGLE VALUES: CAN BE MESSY → AVERAGES: FORM A BELL → THE BELL TELLS YOU: HOW SURE TO BE; SAVE THIS · SEND IT TO A FRIEND. |
| 10 | **Your turn, teaser and CTA** | YOUR TURN · ONE CUSTOMER'S SPEND: SKEWED · AVERAGE OF 500: NORMAL? · VOTE IN THE CAPTION POLL; teaser NEXT: THREE OR MORE GROUPS · ANOVA; end card. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "A/B" is written "A-B" in the TTS text; "version A" is phoneme-patched.

**S1 · Title card** (0:00.00–0:09.31)
- `0:00.20` 5 ways the Central Limit Theorem runs the real world.
- `0:03.84` Election polls, A/B tests, factories, insurance, and machine learning. Save this one!

**S2 · 30-second recap** (0:09.31–0:22.11)
- `0:09.71` Quick recap. Take many samples and average each one.
- `0:12.93` Even if the data is skewed, those averages form a bell curve.
- `0:16.75` And their spread, the standard error, is sigma over root n. More data, a narrower bell.

**S3 · Use 1: election polls** (0:22.11–0:48.23)
- `0:22.51` Use one: election polls.
- `0:24.48` A pollster asks 1,000 voters out of millions. Each answer is just yes or no, nowhere near a bell curve.
- `0:31.62` But the share saying yes is an average, so it's roughly normal. That's why 52% ±3% is a real 95% range.
- `0:41.29` And to halve that margin, you need 4 times the people: 4,000 voters gives ±1.5%.

**S4 · Use 2: A/B tests** (0:48.23–1:04.29)
- `0:48.63` Use two: A/B tests.
- `0:50.51` Customer spending is very skewed: most people spend a little, and a few spend a lot.
- `0:55.68` But the average spend over thousands of users is normal. That's why a simple z or t test can compare version A with version B.

**S5 · Use 3: factories** (1:04.29–1:20.80)
- `1:04.69` Use three: factories.
- `1:06.31` Every hour, a juice plant weighs 5 bottles and plots their average on a control chart.
- `1:11.60` The averages stay within 3 standard errors, 99.7% of the time. A point outside the lines means: stop the machine.

**S6 · Use 4: insurance** (1:20.80–1:38.18)
- `1:21.20` Use four: insurance.
- `1:22.97` One customer's claims are unpredictable: nothing for years, then one huge claim.
- `1:28.17` But across 100,000 customers, the average claim is very predictable. Its standard error shrinks about 300 times. That's how premiums are set.

**S7 · Use 5: machine learning** (1:38.18–2:03.06)
- `1:38.58` Use five: machine learning.
- `1:40.35` A model scores 90% accuracy on 1,000 test examples. Each prediction is just right or wrong.
- `1:47.50` But accuracy is an average, so it's roughly normal, with a standard error of about 1%. The true accuracy is about 88 to 92%.
- `1:57.17` Test on 10,000 examples, and the range tightens to about ±0.6%.

**S8 · The common thread** (2:03.06–2:16.61)
- `2:03.45` See the pattern? The raw data is messy, but averages behave. That's why the bell curve shows up everywhere.
- `2:10.14` In fact, every z-test, t-test, and confidence interval on this page leans on this one theorem.

**S9 · Interview traps** (2:16.60–2:31.60)
- `2:17.00` Two interview traps.
- `2:18.43` One: the theorem is about averages, not the data. Individual values stay skewed.
- `2:23.69` Two: it needs independent samples and enough data: about 30 for mild skew, far more for heavy tails like incomes.

**S10 · The cheat sheet** (2:31.60–2:41.74)
- `2:32.00` Here are all five, on one screen.
- `2:33.92` Save this, and send it to a friend who's learning data science.

**S11 · Poll, teaser and CTA** (2:41.74–2:55.66)
- `2:42.09` Your turn: one customer's spend is skewed. Is the average spend of 500 customers roughly normal? Vote in the caption poll!
- `2:50.01` Next: comparing three or more groups. ANOVA.
- `2:52.94` Follow for data science made simple!

total 175.662

## Accuracy notes (every number checked)

- **Raw data:** each answer is Bernoulli (1 = yes, 0 = no), so the sample proportion p̂ = 520/1,000 = 0.52 is literally the sample mean. The CLT says p̂ is approximately normal for large n (np and n(1 − p) both ≫ 10 here).
- **Repeated polls (scene 4):** the stacked results are drawn from N(52, 1.58) and rounded to whole percents, the sampling distribution for n = 1,000 and p = 0.52; the first five shown (51, 53, 52, 50, 54) are illustrative.
- **Standard error:** √(0.52 × 0.48 / 1,000) = 0.0158 → "about 1.6%".
- **Margin:** 95% of a normal lies within 1.96 SE ("about 2"); 1.96 × 1.58 = 3.1% → "52% ± 3%", 49–55%. That ± is the margin of error, and 49–55% is the 95% confidence interval for the true support.
- **4× the people:** with n = 4,000, SE = 0.79% and the margin is 1.55% ("± 1.5%"), because SE ∝ 1/√n.
- **The four other uses** (illustrative, no new numbers): A/B tests compare average spend per user (spend is skewed, its average is near normal); X̄ control charts plot the average of small subgroups (5 bottles an hour); insurers price on the average claim of many policyholders; test accuracy is the mean of 0/1 correctness.
- **Poll question:** yes, the mean of 500 independent customers is approximately normal unless spending is extremely heavy-tailed.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `z-vs-t/` (`REF=z-vs-t bash .claude/skills/data-science-explainer/new-video.sh clt-uses CltUses CLT_Real_World_Uses`). Version 2 rewrote the script and scenes (S1Title, S2Problem, S3Average, S4Repeat, S5Width, S6Margin, S7Bigger, S8Similar, S9Rule, S10Poll). Kit: `src/components/Uses.tsx` (the five uses with drawn icons: ballot, A/B phones, bottle, shield, network; `UseHeader`, `UseDots`, skew and bell helpers).

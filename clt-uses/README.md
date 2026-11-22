# 5 Ways the Central Limit Theorem Runs the Real World

A practical follow-up to `central-limit-theorem/` for **@curious_datascientist**: election polls, A/B tests, factory control charts, insurance and machine learning, each with real numbers, then the common thread, two interview traps, a one-screen cheat sheet and a caption-poll prompt. 2:56, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

**Built around the user's insight from the which-test reel:** the title card and everything the reel will cover are on screen from **frame 0**. THE CENTRAL LIMIT THEOREM · 5 REAL-WORLD USES and all five use tiles appear by about 1.5 s, before the narration has even named them, so viewers know what they'll get in the first 2–3 seconds (the moment people decide to skip). This is now a house rule (see the skill).

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `CLT_Real_World_Uses.mp4` | the finished Reel |
| `CLT_Real_World_Uses_Cover.png` | 1080×1920 cover = the title card: THE CENTRAL LIMIT THEOREM · 5 REAL-WORLD USES, the five use tiles over a faint bell, SAVE THIS FOR YOUR INTERVIEW, @curious_datascientist |
| `CLT_Real_World_Uses.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Colour code

Polls cyan · A/B tests orange (version A green) · factories green · insurance violet · machine learning pink `#F0ABFC` (the ML-series accent) · the averages / bells violet · "stop" red.

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Title card (from frame 0)** | THE CENTRAL LIMIT THEOREM · 5 REAL-WORLD USES over a faint bell; the five tiles (ELECTION POLLS · A/B TESTS · FACTORIES · INSURANCE · MACHINE LEARNING) pop in by ~1.5 s, then each lights up as it's named; SAVE THIS ONE bookmark. |
| 2 | **The CLT in 10 seconds** | A skewed RAW DATA curve → AVERAGE MANY SAMPLES arrow → AVERAGES: A BELL; SE = σ/√n; the bell narrows: MORE DATA = A NARROWER BELL. |
| 3 | **Use 1: election polls** | Use dots (1/5); 200-dot sample of yes / no; 1,000 VOTERS OUT OF MILLIONS; EACH: YES / NO; the bell of poll results (47–57%) with the 49–55% band and bracket; 52% ±3% = A REAL 95% RANGE; then 4× THE PEOPLE = HALF THE MARGIN (±1.5%). |
| 4 | **Use 2: A/B tests** | ONE CUSTOMER'S SPEND: VERY SKEWED (A FEW BIG SPENDERS); two bells of AVERAGE SPEND for A (green) and B (orange); SO A SIMPLE z OR t TEST CAN COMPARE THEM. |
| 5 | **Use 3: factories** | A control chart: EACH DOT = AVERAGE OF 5 BOTTLES, EVERY HOUR around the 200 centre line; ±3 SE lines; INSIDE ±3 SE: 99.7% OF THE TIME; the last dot jumps out and flashes red: POINT OUTSIDE THE LINES: STOP THE MACHINE. |
| 6 | **Use 4: insurance** | ONE CUSTOMER'S CLAIMS, YEAR BY YEAR: flat bars, then ONE HUGE CLAIM; the bell of the AVERAGE CLAIM OF 100,000 CUSTOMERS narrows; SE ÷ 316 (ROOT OF 100,000); THAT'S HOW PREMIUMS ARE SET. |
| 7 | **Use 5: machine learning** | A 400-square sample of right / wrong predictions fills; ACCURACY 90%; the accuracy bell with the 88–92% band; ACCURACY IS AN AVERAGE: SE ABOUT 1%; TRUE ACCURACY: ABOUT 88% TO 92%; then 10,000 TEST EXAMPLES: ±0.6%. |
| 8 | **The common thread** | Five rows (one per use), each mini curve morphing from RAW: MESSY to AVERAGE: BELL; MESSY DATA, BUT AVERAGES BEHAVE; z-TEST · t-TEST · CONFIDENCE INTERVALS: ALL OF THEM LEAN ON THE CLT. |
| 9 | **Two interview traps** | 1 AVERAGES, NOT THE DATA (individual values stay skewed) · 2 INDEPENDENT + ENOUGH DATA (about 30 for mild skew, far more for heavy tails like incomes). |
| 10 | **The cheat sheet** | Five rows: icon · USE · RAW DATA, THEN AVERAGE · WHAT IT GIVES YOU; held ~6 s; SEND and SAVE badges drop on their words. |
| 11 | **Your turn, teaser and CTA** | YOUR TURN · ONE CUSTOMER'S SPEND: SKEWED · A YES / B NO · AVERAGE OF 500: NORMAL? · VOTE IN THE CAPTION POLL; teaser NEXT: THREE OR MORE GROUPS · ANOVA; end card chips Polls · A/B tests · Factories · Insurance + ML. |

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

- **Polls:** n = 1,000, p̂ = 0.52: SE = √(0.52·0.48/1000) = 0.0158; 95% margin = 1.96 × 0.0158 = 3.1% → "52% ± 3%" (49–55%). With n = 4,000 the margin halves to 1.55% ("±1.5%"), because SE ∝ 1/√n.
- **A/B tests:** the shapes are illustrative (a right-skewed spend distribution vs two normal sampling distributions of the mean); no specific numbers are claimed.
- **Control charts:** Shewhart X̄ charts put limits at ±3 standard errors of the subgroup mean; under normality 99.73% of in-control averages fall inside ("99.7%"). The CLT is why X̄ is close to normal even when single bottles aren't.
- **Insurance:** the SE of the average claim is σ/√n; √100,000 = 316.2 ("shrinks about 300 times"). This is the law of large numbers plus the CLT behind pooling risk.
- **ML accuracy:** n = 1,000, p = 0.90: SE = √(0.9·0.1/1000) = 0.0095 ("about 1%"); 95% range 90% ± 1.86% = 88.1–91.9% ("about 88 to 92%"). With n = 10,000: ±0.59% ("±0.6%").
- **Conditions:** independence and enough data; "about 30" is the usual rule of thumb for moderate skew; heavy-tailed data (incomes, claims) need much larger n, and infinite-variance data never satisfy the classic CLT.
- **Poll question:** yes, the mean of 500 independent customers is approximately normal unless spending is extremely heavy-tailed.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `z-vs-t/` (`REF=z-vs-t bash .claude/skills/data-science-explainer/new-video.sh clt-uses CltUses CLT_Real_World_Uses`). New: `src/components/Uses.tsx` (the five uses with drawn icons: ballot, A/B phones, bottle, shield, network; `UseHeader`, `UseDots`, skew and bell helpers).

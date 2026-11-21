# The t-Test, Step by Step

A full worked two-sample t-test for **@curious_datascientist**, built like `z-test/` (third cut): the textbook definition, when to use it, one- vs two-tailed hypotheses up front, the formula, the full calculation (averages, variances, pooled variance, standard error, t), degrees of freedom, reading the **t table** (critical value and a p-value bracket), both decisions, and a caption-poll prompt instead of an in-video quiz. 2:59, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `T_Test_Explained.mp4` | the finished Reel |
| `T_Test_Explained_Cover.png` | 1080×1920 cover: FORMULA · CALCULATION · t TABLE tag, THE t-TEST explained step by step, DOES BRAND B REALLY LAST LONGER? with two batteries (7 h vs 10 h), the filled-in formula = 3, a t TABLE · df 8 2.306 chip, + INTERVIEW-READY DEFINITION, @curious_datascientist |
| `T_Test_Explained.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Colour code

| Concept | Colour |
| --- | --- |
| Brand A | cyan |
| Brand B, the t curve, t = 3 | violet |
| Variances, standard error, "fail to reject" | green |
| The gap, the tails, the table look-up, reject | orange |

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | "BRAND B'S BATTERY LASTS LONGER"; brand A and brand B cards: five readings each (6 8 7 5 9 h / 9 10 8 11 12 h) pop in, the batteries drain to AVERAGE 7 hours vs 10 hours; REAL, OR JUST LUCK?; **THE t-TEST** with FORMULA · CALCULATION · t TABLE chips. |
| 2 | **Textbook definition** | "Here's the textbook definition." INTERVIEW ANSWER card phrase by phrase (means violet, independent groups cyan, significantly different orange, standard deviations unknown green), then IN PLAIN WORDS. |
| 3 | **When to use it** | TWO SEPARATE GROUPS · σ UNKNOWN · SMALL SAMPLES tick; n = 5 PER BRAND and σ UNKNOWN chips; USE A TWO-SAMPLE t-TEST. |
| 4 | **Steps 1 and 2: one tail or two** | 5-step tracker (HYPOTHESES · ALPHA · FORMULA · t TABLE · DECIDE). H0: µA = µB; two cards: TWO-TAILED (µA ≠ µB, either direction) and ONE-TAILED (µB > µA, B lasts longer?), each with a t(8) curve; ALPHA = 5% shades 2.5% + 2.5% vs ALL 5% ON THE RIGHT; WE'LL WORK OUT BOTH. |
| 5 | **The formula** | t = (x̄B − x̄A) / √(sp² (1/nA + 1/nB)); TOP = THE GAP BETWEEN THE TWO AVERAGES, BOTTOM = THE STANDARD ERROR OF THAT GAP; the pooled-variance formula; POOLED VARIANCE = THE TWO VARIANCES, AVERAGED. |
| 6 | **Averages and variances** | x̄A = 7 · x̄B = 10 · GAP = 3; brand A's worksheet fills row by row (HOURS · − 7 · SQUARED: 1 1 0 4 4, SUM 10, s² = 10 ÷ 4 = 2.5); brand B's fills on "Brand B is the same" (2.5). |
| 7 | **Standard error and t** | The formula fills (10 − 7, 2.5, 1/5 + 1/5); POOLED (4×2.5 + 4×2.5) ÷ 8 = 2.5 · STD ERROR √(2.5 × (0.2 + 0.2)) = √1 = 1; **t = 3 ÷ 1 = 3** slams in. |
| 8 | **Degrees of freedom** | df = nA + nB − 2 = 5 + 5 − 2 = **8**; the normal curve (dashed) vs the t(8) curve, tails shaded; FATTER TAILS, BIGGER CUT-OFF: 1.96 vs 2.306. |
| 9 | **Two-tailed: the t table** | THE t TABLE LISTS CRITICAL VALUES: a table excerpt (df 6–10; ONE-TAIL 0.05 / 0.025 / 0.01 / 0.005, TWO-TAIL 0.10 / 0.05 / 0.02 / 0.01); row df 8 and the two-tailed 0.05 column sweep to **2.306**, CRITICAL VALUE = ±2.306; the zone curve shows the critical region; then 2.896 and 3.355 light up: 2.896 < 3 < 3.355, so 0.01 < p < 0.02; SOFTWARE p = 0.017. |
| 10 | **Two-tailed decision** | t = 3 drops into the right critical region; ✓ t = 3 is in the critical region · ✓ p = 0.017 < alpha 0.05; BOTH METHODS AGREE; TWO-TAILED: REJECT H0. |
| 11 | **One-tailed** | NOW ONE-TAILED · H1: µB > µA; the right-tailed curve (REJECT 5%); t = 3 (SAME); ONE-TAILED 0.05 COLUMN, df 8: 1.860; p = 0.017 ÷ 2 = 0.0085; ✓ 3 is beyond 1.860 · ✓ p = 0.0085 < 0.05; REJECT AGAIN: BRAND B REALLY LASTS LONGER; SAVE FOR YOUR INTERVIEW. |
| 12 | **Your turn, teaser and CTA** | YOUR TURN · TWO-TAILED t = 2 · df 8 · ALPHA 5% over the zone curve (no marker) · REJECT H0, OR NOT? · VOTE IN THE CAPTION POLL; teaser NEXT: WHAT IF THE DATA ARE CATEGORIES? · THE CHI-SQUARE TEST; end card chips t = gap ÷ SE · df = nA + nB − 2 · ±2.306 at df 8 · One-tailed: 1.860. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×.

**S1 · Hook** (0:00.00–0:12.06)
- `0:00.45` Brand B says its phone battery lasts longer. You test 5 phones of each: A averages 7 hours, B averages 10.
- `0:08.20` A real difference, or just luck? Let's settle it with a t-test.

**S2 · Textbook definition** (0:12.06–0:25.31)
- `0:12.46` Here's the textbook definition.
- `0:14.39` A two-sample t-test is a hypothesis test that checks whether the means of two independent groups are significantly different, when the population standard deviations are unknown.

**S3 · When to use it** (0:25.31–0:34.86)
- `0:25.71` Use it to compare the averages of two separate groups, when sigma is unknown and the samples are small.
- `0:32.13` 5 phones each, sigma unknown: that's us.

**S4 · Steps 1 and 2: one tail or two** (0:34.86–0:54.88)
- `0:35.26` Step one: H0 says both brands last the same on average.
- `0:39.24` H1 is two-tailed if they could differ either way, or one-tailed if we only ask: does B last longer?
- `0:45.47` Step two: alpha, 5%. Two-tailed splits it, 2.5% per tail. One-tailed puts all 5% on the right. We'll do both.

**S5 · The formula** (0:54.88–1:07.14)
- `0:55.28` Step three: the formula. t equals the gap between the two averages, over the standard error of that gap.
- `1:01.88` The standard error uses the pooled variance, sp squared, and both sample sizes.

**S6 · Averages and variances** (1:07.14–1:26.73)
- `1:07.54` First, the averages: A is 7 hours, B is 10. So the gap is 3.
- `1:12.19` Next, each variance. For A, square each value's distance from 7: 1, 1, 0, 4, 4. They add up to 10.
- `1:19.90` Divide by n - 1, 4: the variance is 2.5. Brand B is the same: 2.5.

**S7 · Standard error and t** (1:26.73–1:39.14)
- `1:27.13` Pooled variance: 2.5. Standard error: the square root of 2.5, times a fifth plus a fifth. That's root 1, which is 1.
- `1:35.97` So t equals 3 over 1: t equals 3.

**S8 · Degrees of freedom** (1:39.14–1:50.03)
- `1:39.53` The t table needs the degrees of freedom: 5 + 5 - 2 = 8.
- `1:45.10` Small samples are less certain, so the t curve has fatter tails, and bigger cut-offs.

**S9 · Two-tailed: the t table** (1:50.03–2:20.82)
- `1:50.43` Two-tailed first. A t table lists critical values directly.
- `1:54.52` Row 8, column two-tailed 0.05: the critical value is 2.306.
- `2:01.27` Beyond ±2.306 is the critical region, with area alpha.
- `2:07.22` For p: our t of 3 sits between 2.896 and 3.355, so p is between 0.01 and 0.02. Software says 0.017.

**S10 · Two-tailed decision** (2:20.82–2:27.92)
- `2:21.22` Our t of 3 is in the critical region, and p is below alpha. Both methods agree: reject H0.

**S11 · One-tailed** (2:27.92–2:45.85)
- `2:28.32` Now one-tailed: does B last longer? t is still 3.
- `2:31.71` The one-tailed column gives 1.860, and p halves to 0.0085.
- `2:38.49` 3 is beyond 1.860: reject again. Brand B really lasts longer. Save this for your interview.

**S12 · Poll, teaser and CTA** (2:45.85–2:59.49)
- `2:46.20` Your turn: two-tailed, df 8, and t equals 2. Reject H0, or not? Vote in the caption poll!
- `2:53.09` Next: what if the data are categories? The chi-square test.
- `2:56.67` Follow for data science made simple!

total 179.487

## Accuracy notes (every number checked)

- **Data:** A = 6, 8, 7, 5, 9 h (mean 7); B = 9, 10, 8, 11, 12 h (mean 10). Squared deviations: A 1, 1, 0, 4, 4 → 10; B 1, 0, 4, 1, 4 → 10. Sample variances 10/4 = 2.5 each.
- **Pooled variance** sp² = (4·2.5 + 4·2.5)/8 = 2.5. **SE** = √(2.5·(1/5 + 1/5)) = √1 = 1. **t** = (10 − 7)/1 = 3, **df** = 8. With equal variances and equal n, Welch's t-test gives the same t and df here.
- **Critical values (t table, df 8):** two-tailed 5% = 2.306; one-tailed 5% = 1.860; 2.896 (two-tailed 0.02), 3.355 (two-tailed 0.01). Checked by integrating the t(8) density (`components/TDist.tsx`).
- **p-values:** two-tailed P(|T₈| ≥ 3) = 0.0171 ("0.017"); one-tailed 0.0085. The table bracket 2.896 < 3 < 3.355 gives 0.01 < p < 0.02 (two-tailed).
- **Poll question:** t = 2, df 8, two-tailed: 2 < 2.306 → do not reject; p = 0.0805.
- The normal-vs-t comparison draws both densities scaled to the t(8) peak, so the normal curve is slightly taller at the centre and thinner in the tails, as it should be.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `z-test/` (`REF=z-test bash .claude/skills/data-science-explainer/new-video.sh t-test TTest T_Test_Explained`). New: `src/components/TKit.tsx` (the two-sample `TFormula` with value slots, the `VarSheet` worksheet, the `TTable` excerpt with one- and two-tailed headers and highlights, the t(8) `TZone` curve with two-tailed or right-tailed critical regions, the step tracker with a t TABLE step).

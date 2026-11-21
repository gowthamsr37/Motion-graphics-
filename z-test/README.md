# The Z-Test, Step by Step

A full worked z-test for **@curious_datascientist**: the textbook definition, when to use it, the hypotheses, alpha, the formula, the complete calculation, both decision methods with the **z table** (p-value: z → area; critical value: area → z), the **critical region**, the decision, the one- vs two-tailed trap and a poll prompt. 2:59, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Built with the growth rules (end of `.claude/skills/data-science-explainer/SKILL.md`): a puzzle hook and cover ("Is the company cheating you?"), A/B/C/D quiz options with the VOTE IN THE CAPTION POLL hint, a save moment, and purposeful animations (the bottle filling short of its line, numbers dropping into the formula, the z-table row and column sweeping to the cell). The first draft ran 4:01; it was tightened to stay under 3:00 without dropping any step.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Z_Test_Explained.mp4` | the finished Reel |
| `Z_Test_Explained_Cover.png` | 1080×1920 cover: FORMULA · CALCULATION · Z TABLE tag, THE Z-TEST explained step by step, IS THE COMPANY CHEATING YOU? with the bottle, the filled-in formula = −2 and a Z TABLE 0.0228 chip, + INTERVIEW-READY DEFINITION, @curious_datascientist |
| `Z_Test_Explained.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Colour code

| Concept | Colour |
| --- | --- |
| The claim µ = 200 ml, H0, the curve | cyan |
| The sample mean x̄ = 198, z = −2 marker | violet |
| Sigma and the standard error | green |
| The tail, the table look-up, reject | orange |

## Storyboard

Second cut (user feedback on the first): "critical value" and "critical region" were never named and the middle felt squeezed. The in-video quiz (about 25 s) was replaced by a short spoken poll prompt, since the quiz lives in the caption poll, and the time went into the two decision methods and the critical region.

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | A juice bottle fills and stops just under its dashed 200 ml line; 100 bottles pop into a grid; **AVERAGE: 198 ml**; CHEATING, OR JUST CHANCE?; everything clears for **THE Z-TEST** with FORMULA · CALCULATION · Z TABLE chips. |
| 2 | **Textbook definition** | INTERVIEW ANSWER card phrase by phrase, then IN PLAIN WORDS. |
| 3 | **When to use it** | TESTING AN AVERAGE · σ IS KNOWN · OR n = 30+ tick; σ = 10 ml and n = 100 fly up; BOTH BOXES TICKED. |
| 4 | **Steps 1 and 2** | 5-step tracker; H0: µ = 200 ml, H1: µ ≠ 200 ml; ALPHA = 5%; curve with both tails 2.5%. |
| 5 | **The formula** | z = (x̄ − µ) / (σ / √n); top = HOW FAR OFF WE ARE, bottom = STANDARD ERROR; z = HOW MANY STANDARD ERRORS FROM THE CLAIM. |
| 6 | **The calculation** | 198, 200, 10, 100 drop into the formula; TOP −2 · √100 = 10 · SE 1; **z = −2**. |
| 7 | **What z = −2 means** | The standard normal curve, z = −2 in the left tail; FAR ENOUGH TO REJECT H0?; chips METHOD 1: p-VALUE · METHOD 2: CRITICAL VALUE. |
| 8 | **Method 1: the p-value** | METHOD 1 · TABLE: z → AREA. The −2.0 row and 0.00 column sweep to **0.0228**; ONE TAIL 0.0228 = 2.3%; both tails; **p = 2 × 0.0228 = 0.046 < 0.05**. |
| 9 | **Method 2: the critical value and the critical region** | METHOD 2 · TABLE: AREA → z. ALPHA 5% ÷ 2 = 0.0250 PER TAIL; the 0.0250 cell, then ROW −1.9 + COLUMN 0.06 = **−1.96 = THE CRITICAL VALUE**. Then **THE CRITICAL REGION (ALSO CALLED THE REJECTION REGION)**: the curve splits into REJECT 2.5% · FAIL TO REJECT 95% · REJECT 2.5%, brackets under both tails, 2.5% + 2.5% = ALPHA = 5%, MIDDLE 95%: FAIL TO REJECT H0. |
| 10 | **The decision** | OUR z = −2 drops into the left critical region; ✓ METHOD 2: z = −2 is in the critical region · ✓ METHOD 1: p = 0.046 < alpha 0.05; BOTH METHODS AGREE; **REJECT H0: THE MACHINE IS UNDER-FILLING**. |
| 11 | **Interview trap: one tail or two?** | Two zone curves: TWO-TAILED (H1: µ ≠ 200, ±1.96) and ONE-TAILED (H1: µ < 200, the whole 5% in the left tail, −1.645). |
| 12 | **Remember** | The formula; z = HOW FAR OFF ÷ STANDARD ERROR ↓ z IN THE CRITICAL REGION: REJECT ↓ OR p BELOW ALPHA: REJECT; SAVE FOR YOUR INTERVIEW bookmark. |
| 13 | **Your turn, teaser and CTA** | YOUR TURN · TWO-TAILED z = 1.5 · ALPHA 5% over the zone curve (no marker: the answer is in the pinned comment) · REJECT H0, OR NOT? · a big bouncing VOTE IN THE CAPTION POLL. Teaser: THE t-TEST. End card chips: z = gap ÷ SE · Critical value ±1.96 · Critical region = alpha · p < alpha: reject. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "mu" is patched to /mjuː/ (Kokoro read it as "moo").

**S1 · Hook** (0:00.00–0:11.14)
- `0:00.40` A juice bottle says 200 ml. You measure 100 bottles, and the average is only 198.
- `0:07.47` Cheating, or just chance? Let's settle it with a z-test.

**S2 · Textbook definition** (0:11.14–0:25.63)
- `0:11.54` Here's the textbook definition, the one to use in interviews.
- `0:15.27` A z-test is a hypothesis test that checks whether a sample mean is significantly different from a population mean, when the population standard deviation is known.

**S3 · When to use it** (0:25.63–0:36.80)
- `0:26.03` Use it for an average, when sigma, the population's spread, is known, or n is 30 or more.
- `0:31.91` Here, sigma is 10 ml, and n is 100. Both boxes ticked.

**S4 · Steps 1 and 2** (0:36.80–0:46.46)
- `0:37.20` Step one: H0, the average is 200 ml. H1: it isn't.
- `0:42.37` Step two: alpha is 5%, split across both tails.

**S5 · The formula** (0:46.46–1:01.10)
- `0:46.86` Step three: the formula. z equals x-bar minus mu, over sigma over root n.
- `0:52.65` The top is how far our sample mean is from the claimed mean.
- `0:56.34` The bottom is the standard error: how much an average naturally wobbles.

**S6 · The calculation** (1:01.10–1:14.90)
- `1:01.50` x-bar is 198, and mu is 200, so the top is -2.
- `1:06.28` Sigma is 10, and the square root of 100 is 10, so the standard error is 1.
- `1:11.47` -2 over 1: z equals -2.

**S7 · What z = -2 means** (1:14.90–1:22.96)
- `1:15.30` That's 2 standard errors below the claim. Far enough to reject H0?
- `1:19.85` Two ways to decide, both using the z table.

**S8 · Method 1: the p-value** (1:22.96–1:44.46)
- `1:23.36` Method one: the p-value. Here the table goes from z to area: the area to the left of z.
- `1:29.19` Row -2.0, column 0.00: the area is 0.0228.
- `1:36.28` That's 2.3% in one tail. Two-tailed, so we double it: p is about 0.046, below alpha.

**S9 · Method 2: the critical value** (1:44.46–2:13.20)
- `1:44.86` Method two: the critical value. Now the table goes from area to z.
- `1:49.32` Alpha is 5%, so 2.5% per tail. Find 0.0250 in the table: it sits at -1.96, the critical value.
- `2:00.92` Beyond ±1.96 is the critical region, or rejection region. Its total area is alpha, 5%. In the middle 95%, we fail to reject.

**S10 · The decision** (2:13.20–2:23.35)
- `2:13.60` Our z of -2 falls inside the critical region, and p is below alpha.
- `2:18.63` Both methods agree: reject H0. The machine is under-filling.

**S11 · Interview trap: one tail or two?** (2:23.35–2:37.40)
- `2:23.75` Interview trap: one tail or two?
- `2:25.97` If you only test for under-filling, it's one-tailed. The whole 5% critical region moves into the left tail, so the critical value becomes -1.645.

**S12 · Remember** (2:37.40–2:45.84)
- `2:37.80` Remember: if z lands in the critical region, or p is below alpha, reject H0.
- `2:43.61` Save this for your next interview.

**S13 · Poll, teaser and CTA** (2:45.84–2:59.08)
- `2:46.19` Your turn: a two-tailed z of 1.5. Reject H0, or not? Vote in the caption poll!
- `2:52.83` Next: what if we don't know sigma? The t-test.
- `2:55.81` Follow for data science made simple!

total 179.079

## Accuracy notes (every number checked)

- **Setup:** H0: µ = 200 ml vs H1: µ ≠ 200 ml (two-sided), σ = 10 ml known, n = 100, x̄ = 198 ml.
- **Standard error** = σ/√n = 10/10 = 1 ml; **z** = (198 − 200)/1 = −2.
- **Z table** (area to the left): Φ(−2.00) = 0.02275, printed 0.0228. The excerpt values are computed from Φ in `components/ZKit.tsx` (4 d.p.), e.g. Φ(−1.96) = 0.0250, Φ(−2.06) = 0.0197.
- **Two-tailed p** = 2 × 0.02275 = 0.0455, shown as 0.046 (2 × the rounded 0.0228 = 0.0456).
- **Critical value:** 2.5% per tail → z = −1.96 (Φ(−1.96) = 0.0250). |−2| > 1.96 → reject at 5%.
- **One-tailed** (H1: µ < 200): cut-off z = −1.645 (Φ = 0.0500), p = Φ(−2) = 0.0228 (shown on the trap card).
- **Poll question:** z = 1.5 two-tailed: p = 2 × (1 − Φ(1.5)) = 2 × 0.0668 = 0.1336 ≈ 0.13 > 0.05 → do not reject.
- **z vs t:** with σ unknown the statistic uses s and follows a t distribution with n − 1 df; for large n (about 30+) z is a fine approximation.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `which-test/` (`REF=which-test bash .claude/skills/data-science-explainer/new-video.sh z-test ZTest Z_Test_Explained`). New: `src/components/ZKit.tsx` (Φ, the drawn σ and x̄ glyphs, `Bottle`, `Formula` with value slots and highlights, `ZTable` with row / column / cell highlights, `StepTracker`, standard-normal geometry). The t-test, chi-square and ANOVA videos can reuse `Formula`'s pattern and `ZTable`'s look for their tables.

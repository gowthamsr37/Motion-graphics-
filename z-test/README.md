# The Z-Test, Step by Step

A full worked z-test for **@curious_datascientist**: the textbook definition, when to use it, the hypotheses, alpha, the formula, the complete calculation, both decision methods with the **z table** (p-value: z → area; critical value: area → z), the **critical region**, one- vs two-tailed tests explained up front with the decision worked for both, and a poll prompt. 2:59, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

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

Third cut (user feedback): explain one-tailed vs two-tailed up front, then work the decision for both; open the definition with just "Here's the textbook definition." Earlier cut: "critical value" / "critical region" named, the in-video quiz replaced by a short caption-poll prompt.

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | The bottle fills short of its 200 ml line; 100 bottles; **AVERAGE: 198 ml**; CHEATING, OR JUST CHANCE?; **THE Z-TEST** with FORMULA · CALCULATION · Z TABLE chips. |
| 2 | **Textbook definition** | "Here's the textbook definition." INTERVIEW ANSWER card phrase by phrase, then IN PLAIN WORDS. |
| 3 | **When to use it** | TESTING AN AVERAGE · σ IS KNOWN · OR n = 30+; σ = 10 ml and n = 100; BOTH BOXES TICKED. |
| 4 | **Steps 1 and 2: one tail or two** | H0: µ = 200 ml; H1 CAN BE… two cards: TWO-TAILED (H1: µ ≠ 200, EITHER DIRECTION) and ONE-TAILED (H1: µ < 200, ONE DIRECTION ONLY), each with its own curve; ALPHA = 5% shades 2.5% + 2.5% vs ALL 5% ON THE LEFT; WE'LL WORK OUT BOTH. |
| 5 | **The formula** | z = (x̄ − µ) / (σ / √n); top = HOW FAR OFF, bottom = STANDARD ERROR. |
| 6 | **The calculation** | 198, 200, 10, 100 drop in; TOP −2 · √100 = 10 · SE 1; **z = −2**. |
| 7 | **What z = −2 means** | z = −2 in the left tail; FAR ENOUGH TO REJECT H0?; METHOD 1: p-VALUE · METHOD 2: CRITICAL VALUE. |
| 8 | **Two-tailed, method 1: the p-value** | TABLE z → AREA: row −2.0, column 0.00 → **0.0228**; both tails; **p = 2 × 0.0228 = 0.046 < 0.05**. |
| 9 | **Two-tailed, method 2: the critical value and region** | TABLE AREA → z: 0.0250 → row −1.9 + column 0.06 = **−1.96 = THE CRITICAL VALUE**; **THE CRITICAL REGION (ALSO CALLED THE REJECTION REGION)**: REJECT 2.5% · FAIL TO REJECT 95% · REJECT 2.5%, 2.5% + 2.5% = ALPHA = 5%. |
| 10 | **Two-tailed decision** | z = −2 drops into the critical region; ✓ method 2 · ✓ method 1; BOTH METHODS AGREE; TWO-TAILED: REJECT H0. |
| 11 | **One-tailed** | NOW ONE-TAILED · H1: µ < 200; the one-tailed curve (REJECT 5% on the left); z = −2 (SAME); p = LEFT TAIL ONLY = 0.0228 (NO DOUBLING); CRITICAL VALUE = −1.645; ✓ −2 is beyond −1.645 · ✓ p = 0.0228 < 0.05; REJECT AGAIN: THE MACHINE IS UNDER-FILLING; SAVE FOR YOUR INTERVIEW. |
| 12 | **Your turn, teaser and CTA** | YOUR TURN · TWO-TAILED z = 1.5 over the zone curve (no marker) · REJECT H0, OR NOT? · VOTE IN THE CAPTION POLL; teaser THE t-TEST; end card chips z = gap ÷ SE · Critical value ±1.96 · Critical region = alpha · p < alpha: reject. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "mu" is patched to /mjuː/ (Kokoro read it as "moo").

**S1 · Hook** (0:00.00–0:11.14)
- `0:00.40` A juice bottle says 200 ml. You measure 100 bottles, and the average is only 198.
- `0:07.47` Cheating, or just chance? Let's settle it with a z-test.

**S2 · Textbook definition** (0:11.14–0:23.54)
- `0:11.54` Here's the textbook definition.
- `0:13.47` A z-test is a hypothesis test that checks whether a sample mean is significantly different from a population mean, when the population standard deviation is known.

**S3 · When to use it** (0:23.54–0:33.21)
- `0:23.94` Use it for an average, when sigma, the population's spread, is known, or n is 30 or more.
- `0:29.82` Here, sigma is 10 ml, and n is 100.

**S4 · Steps 1 and 2: one tail or two** (0:33.21–0:53.19)
- `0:33.61` Step one: H0 says the average is 200 ml.
- `0:37.47` H1 is two-tailed if it could differ in either direction, or one-tailed if we only ask: is it less?
- `0:43.63` Step two: alpha, 5%. Two-tailed splits it, 2.5% per tail. One-tailed puts all 5% on the left. We'll do both.

**S5 · The formula** (0:53.19–1:07.63)
- `0:53.59` Step three: the formula. z equals x-bar minus mu, over sigma over root n.
- `0:59.38` The top is how far our sample mean is from the claimed mean.
- `1:03.07` The bottom is the standard error: how much an average naturally wobbles.

**S6 · The calculation** (1:07.63–1:21.23)
- `1:08.03` x-bar is 198, and mu is 200, so the top is -2.
- `1:12.81` Sigma is 10, and the square root of 100 is 10, so the standard error is 1.
- `1:18.00` -2 over 1: z equals -2.

**S7 · What z = -2 means** (1:21.22–1:29.43)
- `1:21.62` That's 2 standard errors below the claim. Far enough to reject H0? Two ways to decide, both using the z table.

**S8 · Method 1: the p-value** (1:29.43–1:51.24)
- `1:29.83` Two-tailed first. Method one, the p-value: the table goes from z to area, the area left of z.
- `1:36.17` Row -2.0, column 0.00: the area is 0.0228.
- `1:43.26` That's 2.3% in one tail. Two-tailed, so we double it: p is about 0.046, below alpha.

**S9 · Method 2: the critical value** (1:51.24–2:15.35)
- `1:51.64` Method two, the critical value: the table goes from area to z.
- `1:55.72` 2.5% per tail: find 0.0250. It sits at -1.96, the critical value.
- `2:04.54` Beyond ±1.96 is the critical region, or rejection region. Its area is alpha. In the middle 95%, we fail to reject.

**S10 · Two-tailed decision** (2:15.35–2:23.09)
- `2:15.75` Our z of -2 is in the critical region, and p is below alpha. Both methods agree: reject H0.

**S11 · One-tailed** (2:23.09–2:46.20)
- `2:23.49` Now one-tailed: H1 says less than 200.
- `2:26.71` z is still -2, but p is just the left tail: 0.0228. No doubling.
- `2:33.12` With all 5% on the left, the critical value is -1.645.
- `2:38.46` -2 is beyond it, and p is below alpha. Reject again: the machine is under-filling. Save this for your interview.

**S12 · Poll, teaser and CTA** (2:46.20–2:59.04)
- `2:46.55` Your turn: a two-tailed z of 1.5. Reject H0, or not? Vote in the caption poll!
- `2:53.04` Next: what if we don't know sigma? The t-test.
- `2:56.02` Follow for data science made simple!

total 179.038

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

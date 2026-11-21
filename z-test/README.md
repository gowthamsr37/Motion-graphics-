# The Z-Test, Step by Step

A full worked z-test for **@curious_datascientist**: the textbook definition, when to use it, the hypotheses, alpha, the formula (every symbol explained), the complete calculation, how to read a **z table** (and where 1.96 comes from), the decision, three interview traps and a quiz. 2:58, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

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

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | A juice bottle fills and stops just under its dashed 200 ml line (THE LABEL SAYS 200 ml); 100 small bottles pop into a grid (100 BOTTLES MEASURED); **AVERAGE: 198 ml**; CHEATING, OR JUST CHANCE?; everything clears for **THE Z-TEST** with FORMULA · CALCULATION · Z TABLE chips. |
| 2 | **Textbook definition** | INTERVIEW ANSWER card, phrase by phrase (sample mean violet, significantly different orange, population mean cyan, standard deviation known green), then IN PLAIN WORDS: is the gap too big to be chance? |
| 3 | **When to use it** | A checklist ticks on its words: TESTING AN AVERAGE · σ IS KNOWN · OR SAMPLE SIZE n = 30+; then σ = 10 ml and n = 100 chips fly up and BOTH BOXES TICKED: USE A Z-TEST. |
| 4 | **Steps 1 and 2** | The 5-step tracker (HYPOTHESES · ALPHA · FORMULA · Z TABLE · DECIDE) appears and stays through scene 9. H0: µ = 200 ml, H1: µ ≠ 200 ml; ALPHA = 5%; a standard normal curve draws with both tails shaded 2.5% (TWO-TAILED). |
| 5 | **The formula** | z = (x̄ − µ) / (σ / √n) builds big. The top glows with x̄ SAMPLE MEAN · µ CLAIMED MEAN = HOW FAR OFF WE ARE; the bottom glows with σ POPULATION SD · n SAMPLE SIZE = STANDARD ERROR (THE WOBBLE); tag z = HOW MANY STANDARD ERRORS FROM THE CLAIM. |
| 6 | **The calculation** | 198, 200, 10 and 100 drop into the formula as they're spoken; worked lines TOP 198 − 200 = −2 · ROOT n √100 = 10 · STD ERROR 10 ÷ 10 = 1; then **z = −2 ÷ 1 = −2** slams in with a burst. |
| 7 | **What z = −2 means** | IF H0 IS TRUE: the standard normal curve with the CLAIM: 200 ml line at 0; the z = −2 (198 ml) marker drops into the left tail, the tail shades, HOW RARE IS THIS? |
| 8 | **Reading the z table** | Z TABLE = AREA TO THE LEFT OF z. A table excerpt (rows −2.1 to −1.8, columns 0.00 to 0.07, exact values); the −2.0 row and the 0.00 column sweep in and the 0.0228 cell pops; a mini curve shades that tail (ONE TAIL: 0.0228 = 2.3%), the right tail joins, and **p = 2 × 0.0228 = 0.046**. |
| 9 | **The cut-off and the decision** | 5% ÷ 2 = 0.0250 PER TAIL; the 0.0250 cell lights, then its row (−1.9) and column (0.06): ROW −1.9 + COLUMN 0.06 = **−1.96**, THAT'S WHERE THE FAMOUS 1.96 COMES FROM. Then the curve with REJECT zones beyond ±1.96, the z = −2 marker inside the left zone, two checks (z = −2 is beyond −1.96 · p = 0.046 < 0.05) and **REJECT H0: THE MACHINE IS UNDER-FILLING**. |
| 10 | **Three interview traps** | 1 Z OR t? σ unknown + small sample = t-TEST · 2 ONE TAIL OR TWO? one-tailed: cut-off −1.645, p = 0.0228 · 3 Z-SCORE ≠ Z-TEST: one value vs a sample mean vs a claim. |
| 11 | **Remember** | The formula, then z = HOW FAR OFF ÷ STANDARD ERROR ↓ LOOK UP THE AREA IN THE Z TABLE ↓ BEYOND ±1.96: REJECT H0, and a SAVE FOR YOUR INTERVIEW bookmark that drops and wiggles. |
| 12 | **Quiz, teaser and CTA** | QUICK QUIZ: TWO-TAILED z = 1.5 ALPHA 5%. "At 5%, do we reject **H0?**" Options A YES / B NO / C ALMOST / D CAN'T SAY with the countdown and the VOTE IN THE CAPTION POLL hint. **NO!** wins; the curve shows 1.5 INSIDE the ±1.96 cut-offs and p = 0.13 > 0.05: COULD BE CHANCE. Teaser: NEXT: WHAT IF SIGMA IS UNKNOWN? · THE t-TEST. End card chips: z = gap ÷ SE · Z table: left area · ±1.96 at 5% · Two-tailed: × 2. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "mu" is patched to /mjuː/ (Kokoro read it as "moo").

**S1 · Hook** (0:00.00–0:11.45)
- `0:00.40` A juice bottle says 200 ml. You measure 100 bottles, and the average is only 198.
- `0:07.47` Cheating, or just chance? Let's settle it with a z-test.

**S2 · Textbook definition** (0:11.45–0:26.43)
- `0:11.85` Here's the textbook definition, the one to use in interviews.
- `0:15.57` A z-test is a hypothesis test that checks whether a sample mean is significantly different from a population mean, when the population standard deviation is known.

**S3 · When to use it** (0:26.43–0:38.55)
- `0:26.83` Use it for an average, when sigma, the population's standard deviation, is known, or n is 30 or more.
- `0:33.61` Here, sigma is 10 ml, and n is 100. Both boxes ticked.

**S4 · Steps 1 and 2** (0:38.55–0:48.89)
- `0:38.95` Step one: H0 says the average is 200 ml. H1 says it isn't.
- `0:44.61` Step two: alpha is 5%, split across both tails.

**S5 · The formula** (0:48.89–1:03.73)
- `0:49.29` Step three: the formula. z equals x-bar minus mu, over sigma over root n.
- `0:55.08` The top is how far our sample mean is from the claimed mean.
- `0:58.78` The bottom is the standard error: how much an average naturally wobbles.

**S6 · The calculation** (1:03.74–1:18.82)
- `1:04.14` Plug in our numbers. x-bar is 198, and mu is 200, so the top is -2.
- `1:10.31` Sigma is 10, and the square root of 100 is 10, so the standard error is 1.
- `1:15.50` -2 over 1: z equals -2.

**S7 · What z = -2 means** (1:18.82–1:24.48)
- `1:19.22` That's 2 standard errors below the claim. How rare is that? Ask the z table.

**S8 · Reading the z table** (1:24.48–1:43.96)
- `1:24.88` A z table gives the area to the left of any z.
- `1:28.05` Go to the row for -2.0, and the column for 0.00. The area is 0.0228.
- `1:36.52` That's 2.3% in one tail. Two-tailed, so we double it: p is about 0.046.

**S9 · The cut-off and the decision** (1:43.96–2:03.63)
- `1:44.36` The cut-off: 2.5% per tail. Find 0.0250 in the table. It sits at -1.96.
- `1:53.41` Our z of -2 is beyond -1.96, and p is below 0.05. Reject H0: the machine is under-filling.

**S10 · Three interview traps** (2:03.63–2:20.29)
- `2:04.03` Three interview traps.
- `2:05.42` One: sigma unknown and a small sample? Use a t-test.
- `2:08.87` Two: testing only for under-filling is one-tailed, with a cut-off of -1.645.
- `2:15.24` Three: a z-score describes one value. A z-test tests a sample mean.

**S11 · Remember** (2:20.29–2:29.88)
- `2:20.69` Remember: z is how far off, over the standard error. Beyond ±1.96, reject.
- `2:27.51` Save this for your next interview.

**S12 · Quiz, teaser and CTA** (2:29.88–2:57.74)
- `2:30.24` Quick quiz!
- `2:31.26` A two-tailed z-test gives z equals 1.5.
- `2:34.88` At the 5% level, do we reject H0?
- `2:43.41` No!
- `2:44.21` 1.5 is inside ±1.96. p is 0.13: it could be chance.
- `2:51.49` Next: what if we don't know sigma? The t-test.
- `2:54.47` Follow for data science made simple!

total 177.741

## Accuracy notes (every number checked)

- **Setup:** H0: µ = 200 ml vs H1: µ ≠ 200 ml (two-sided), σ = 10 ml known, n = 100, x̄ = 198 ml.
- **Standard error** = σ/√n = 10/10 = 1 ml; **z** = (198 − 200)/1 = −2.
- **Z table** (area to the left): Φ(−2.00) = 0.02275, printed 0.0228. The excerpt values are computed from Φ in `components/ZKit.tsx` (4 d.p.), e.g. Φ(−1.96) = 0.0250, Φ(−2.06) = 0.0197.
- **Two-tailed p** = 2 × 0.02275 = 0.0455, shown as 0.046 (2 × the rounded 0.0228 = 0.0456).
- **Critical value:** 2.5% per tail → z = −1.96 (Φ(−1.96) = 0.0250). |−2| > 1.96 → reject at 5%.
- **One-tailed** (H1: µ < 200): cut-off z = −1.645 (Φ = 0.0500), p = Φ(−2) = 0.0228 (shown on the trap card).
- **Quiz:** z = 1.5 two-tailed: p = 2 × (1 − Φ(1.5)) = 2 × 0.0668 = 0.1336 ≈ 0.13 > 0.05 → do not reject.
- **z vs t:** with σ unknown the statistic uses s and follows a t distribution with n − 1 df; for large n (about 30+) z is a fine approximation.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `which-test/` (`REF=which-test bash .claude/skills/data-science-explainer/new-video.sh z-test ZTest Z_Test_Explained`). New: `src/components/ZKit.tsx` (Φ, the drawn σ and x̄ glyphs, `Bottle`, `Formula` with value slots and highlights, `ZTable` with row / column / cell highlights, `StepTracker`, standard-normal geometry). The t-test, chi-square and ANOVA videos can reuse `Formula`'s pattern and `ZTable`'s look for their tables.

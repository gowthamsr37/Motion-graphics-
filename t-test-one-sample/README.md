# The One-Sample t-Test, Step by Step

The follow-up to `z-test/` for **@curious_datascientist**: the same juice bottles (claim 200 ml, average 198), but σ unknown and only 9 bottles. The same t = −2 now fails a two-tailed test (critical value ±2.306) while the one-tailed test still rejects (−1.860). Built like `z-test/` and `t-test/`: the textbook definition, when to use it, one- vs two-tailed up front, the formula (s replaces σ), the full calculation of s, SE and t, degrees of freedom, the t table, both decisions, a z-vs-t comparison and a caption-poll prompt. 2:59, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS. Post it before `t-test/` (the two-sample video, part 2).

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `One_Sample_T_Test.mp4` | the finished Reel |
| `One_Sample_T_Test_Cover.png` | 1080×1920 cover: FORMULA · CALCULATION · t TABLE tag, THE ONE-SAMPLE t-TEST explained step by step, SAME −2, DIFFERENT ANSWER? with the bottle and z −2 vs ±1.96 REJECT / t −2 vs ±2.306 FAIL TO REJECT, 9 BOTTLES · SIGMA UNKNOWN · df 8, + INTERVIEW-READY DEFINITION, @curious_datascientist |
| `One_Sample_T_Test.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | The juice bottle under its 200 ml line; σ = ?; only 9 bottles pop in; AVERAGE: 198 ml; WITH z: REJECTED. NOW?; **THE ONE-SAMPLE t-TEST** with FORMULA · CALCULATION · t TABLE chips. |
| 2 | **Textbook definition** | "Here's the textbook definition." INTERVIEW ANSWER card; IN PLAIN WORDS: same question as the z-test, but without knowing sigma. |
| 3 | **When to use it** | ONE AVERAGE VS A CLAIM · σ UNKNOWN · SMALL SAMPLES; n = 9 BOTTLES · σ UNKNOWN; USE A ONE-SAMPLE t-TEST. |
| 4 | **Steps 1 and 2: one tail or two** | H0: µ = 200 ml; TWO-TAILED (µ ≠ 200) and ONE-TAILED (µ < 200, under-filling?) cards with t(8) curves; 2.5% + 2.5% vs ALL 5% ON THE LEFT. |
| 5 | **The formula** | t = (x̄ − µ) / (s / √n); SAMPLE MEAN 198 · CLAIM 200; "z uses σ" struck out · "t uses s"; s = THE SAMPLE STANDARD DEVIATION. |
| 6 | **The sample SD** | The 9-bottle worksheet fills row by row (ml · − 198 · SQUARED: 25 9 1 1 0 1 1 9 25), SUM 72, 72 ÷ 8 = 9, **s = √9 = 3**. |
| 7 | **Standard error and t** | STD ERROR 3 ÷ √9 = 3 ÷ 3 = 1; TOP 198 − 200 = −2; **t = −2 ÷ 1 = −2**; THE SAME NUMBER AS THE z-TEST! |
| 8 | **Degrees of freedom** | df = n − 1 = 9 − 1 = **8**; normal (dashed) vs t(8); FATTER TAILS, BIGGER CUT-OFF: 1.96 vs 2.306. |
| 9 | **Two-tailed: the t table** | Row df 8, two-tailed 0.05 → **2.306**; CRITICAL VALUE = ±2.306; the zone curve; t = −2 inside; 2 < 2.306 so p > 0.05; SOFTWARE p = 0.08. |
| 10 | **Two-tailed decision** | ✗ NOT in the critical region · p = 0.08; **TWO-TAILED: FAIL TO REJECT H0**; z-TEST: −2 beyond −1.96: REJECT · t-TEST: −2 inside ±2.306: FAIL TO REJECT; FATTER TAILS NEED STRONGER EVIDENCE. |
| 11 | **One-tailed** | NOW ONE-TAILED · H1: µ < 200; left-tailed curve; t = −2 (SAME); critical value −1.860; p = 0.08 ÷ 2 = 0.04; ✓ ✓; ONE-TAILED: REJECT · UNDER-FILLING FOUND; SAVE. |
| 12 | **Your turn, teaser and CTA** | YOUR TURN · TWO-TAILED t = −2.5 · df 8 over the zone curve; REJECT H0, OR NOT?; VOTE IN THE CAPTION POLL; teaser THE TWO-SAMPLE t-TEST; end card. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "mu" is patched to /mjuː/.

**S1 · Hook** (0:00.00–0:16.60)
- `0:00.45` Remember the juice bottles? The claim is 200 ml. This time we don't know sigma, and we only measured 9 bottles. The average is again 198.
- `0:10.64` With z, that was enough to reject. Is it this time? Let's find out with a one-sample t-test.

**S2 · Textbook definition** (0:16.60–0:30.29)
- `0:17.00` Here's the textbook definition.
- `0:18.93` A one-sample t-test is a hypothesis test that checks whether a sample mean is significantly different from a claimed population mean, when the population standard deviation is unknown.

**S3 · When to use it** (0:30.29–0:39.12)
- `0:30.69` Use it for one average versus a claim, when sigma is unknown, especially with small samples.
- `0:36.73` 9 bottles, no sigma: that's us.

**S4 · Steps 1 and 2: one tail or two** (0:39.12–0:58.34)
- `0:39.52` Step one: H0 says the average is 200 ml.
- `0:43.38` H1 is two-tailed if it could differ either way, or one-tailed if we only ask: is it less?
- `0:48.94` Step two: alpha, 5%. Two-tailed splits it, 2.5% per tail. One-tailed puts all 5% on the left. We'll do both.

**S5 · The formula** (0:58.34–1:10.09)
- `0:58.74` Step three: the formula. t equals x-bar minus mu, over s over root n.
- `1:04.14` It's the z formula, with one change: s, the sample standard deviation, replaces sigma.

**S6 · The sample standard deviation** (1:10.09–1:27.04)
- `1:10.49` First, s. Square each bottle's distance from 198: 25, 9, 1, 1, 0, 1, 1, 9, 25. They add up to 72.
- `1:20.88` Divide by n - 1, which is 8: that's 9. The square root of 9 is 3. So s is 3.

**S7 · Standard error and t** (1:27.04–1:40.04)
- `1:27.44` Standard error: s over root n, 3 over root 9, which is 3 over 3: 1.
- `1:32.75` So t equals 198 minus 200, over 1: t equals -2. The same number we got with z!

**S8 · Degrees of freedom** (1:40.04–1:49.39)
- `1:40.44` Degrees of freedom: n - 1, which is 8.
- `1:43.60` With so few bottles, the t curve has fatter tails than the normal curve, so the cut-offs are bigger.

**S9 · Two-tailed: the t table** (1:49.39–2:11.83)
- `1:49.79` Two-tailed first. In the t table, row 8, column two-tailed 0.05: the critical value is 2.306.
- `1:59.04` So the critical region is beyond ±2.306.
- `2:03.86` 2 is below 2.306, so p is above 0.05. Software says 0.08.

**S10 · Two-tailed decision** (2:11.83–2:24.09)
- `2:12.23` Our t of -2 is not in the critical region. Two-tailed, we fail to reject H0.
- `2:18.36` With z, -2 was enough. With t, it isn't: fatter tails need stronger evidence.

**S11 · One-tailed** (2:24.09–2:44.56)
- `2:24.49` Now one-tailed: is the average less than 200?
- `2:27.72` The one-tailed column gives 1.860, so the critical value is -1.860. And p halves, to 0.04.
- `2:37.76` -2 is beyond it: reject. The one-tailed test does find under-filling. Save this for your interview.

**S12 · Poll, teaser and CTA** (2:44.56–2:59.40)
- `2:44.91` Your turn: two-tailed, df 8, and t equals -2.5. Reject H0, or not? Vote in the caption poll!
- `2:53.18` Next: comparing two groups. The two-sample t-test.
- `2:56.68` Follow for data science made simple!

total 179.395

## Accuracy notes (every number checked)

- **Data:** 193, 195, 197, 197, 198, 199, 199, 201, 203 ml; mean 198; squared deviations 25, 9, 1, 1, 0, 1, 1, 9, 25 → 72; s² = 72/8 = 9; s = 3.
- **SE** = 3/√9 = 1; **t** = (198 − 200)/1 = −2; **df** = 8.
- **Two-tailed:** critical value 2.306 (t table, df 8); P(|T₈| ≥ 2) = 0.0805 ("0.08") → fail to reject.
- **One-tailed (H1: µ < 200):** critical value −1.860; P(T₈ ≤ −2) = 0.0403 ("0.04") → reject.
- **z comparison:** with σ known (z-test video), z = −2 beyond −1.96 → reject (p = 0.046).
- **Poll:** t = −2.5, df 8, two-tailed: beyond −2.306 → reject; p = 0.0369.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `t-test/` (`REF=t-test bash .claude/skills/data-science-explainer/new-video.sh t-test-one-sample TTestOneSample One_Sample_T_Test`). Kit changes: `ZKit.Formula` takes `lhs` ("z" / "t") and `useS` (s instead of σ); `TKit.TZone` takes `side="left"`; `TKit.VarSheet` takes `unit`, `res` and `rowH`.

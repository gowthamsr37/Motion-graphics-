# Hypothesis Testing Explained Simply (v2)

The remake of the hypothesis testing Reel for **@curious_datascientist**. After the simpler confidence interval and p-value remakes, the user asked for hypothesis testing "again with good examples and definition". 2:42, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

What's new compared with v1 (`hypothesis-testing/`):
- the **textbook definition** first, on an INTERVIEW ANSWER card, with a plain-words version underneath ("is the pattern in the data real, or just chance?");
- one relatable running example, **underfilled chips packets** (claimed 50 g, measured average 48 g), carried through H0/H1, the 4 steps and the decision;
- H0 vs H1 shown as a pair for three everyday cases (coin, website button, teaching method);
- the **courtroom analogy** (innocent until proven guilty; not guilty ≠ innocent);
- the **4 steps** (state H0/H1 → pick 5% → p-value → decide), with **both outcomes**: 48 g → p ≈ 1% → reject; 49.5 g → p ≈ 27% → fail to reject, which is *not* proof;
- a second example (9 heads in 10 → reject), a 3-line recap, and a quiz on writing the null.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: THE p-VALUE chip, which points to `p-value-v2/`.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Hypothesis_Testing_Simple.mp4` | the finished Reel |
| `Hypothesis_Testing_Simple_Cover.png` | 1080×1920 cover: HYPOTHESIS TESTING · explained simply, "CHEATING OR CHANCE?" with a CLAIMED 50 g packet vs a MEASURED 48 g packet, H0 no effect / H1 real effect chips, + INTERVIEW-READY DEFINITION tag, @curious_datascientist |
| `Hypothesis_Testing_Simple.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code

| Concept | Colour |
| --- | --- |
| H0, the null ("nothing special is going on"), fail to reject | cyan |
| H1, the alternative, the tail, reject H0 | orange |
| The data / sample average, the p-value step | violet |
| The 5% significance level, step 2 | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:14 | **Hook** | A chips packet "50 g" (THE CLAIM), then a 5×5 grid of 25 small packets (25 PACKETS WEIGHED) and **AVERAGE: 48 g**. CHEATING, OR JUST CHANCE? → **HYPOTHESIS TESTING** · EXPLAINED SIMPLY. |
| 2 | 0:14–0:35 | **Textbook definition** | THE TEXTBOOK DEFINITION · INTERVIEW ANSWER quote card. Phrases reveal with key words lit: *a statistical method* · *that uses sample data* (violet) · *to decide between two competing claims* (green) · *about a population* · *the null hypothesis* (cyan) · *the alternative hypothesis* (orange). Then IN PLAIN WORDS: Is the pattern in the data **real**, or just **chance**? |
| 3 | 0:35–0:50 | **The two hypotheses** | H0 THE NULL card: Nothing special is going on, packets really average 50 g (packet "50 g"). H1 THE ALTERNATIVE card: packets average LESS than 50 g (packet "< 50"). Tag: ALWAYS START BY ASSUMING H0 IS TRUE. |
| 4 | 0:50–1:01 | **Every test has a pair** | Columns H0 · NULL and H1 · ALTERNATIVE. Rows: A COIN Fair / Biased · WEBSITE BUTTON No change / More clicks · TEACHING METHOD No difference / Higher scores. |
| 5 | 1:01–1:13 | **Like a courtroom** | A gavel and **H0 = INNOCENT UNTIL PROVEN GUILTY**. STRONG EVIDENCE → REJECT H0 (guilty); NOT ENOUGH EVIDENCE → FAIL TO REJECT (not guilty). Then **NOT GUILTY ≠ INNOCENT**. |
| 6 | 1:13–1:21 | **The 4 steps** | Four step cards: 1 STATE H0 AND H1 and 2 PICK A LEVEL: 5% light up on their words; 3 CALCULATE THE p-VALUE and 4 DECIDE wait as dashed placeholders. |
| 7 | 1:21–1:38 | **Steps 3 and 4** | 3 CALCULATE THE p-VALUE. IF H0 IS TRUE (AVERAGE 50 g): the curve of possible averages of 25 packets (47–53 g). The OUR AVERAGE: 48 g marker drops in, the tail at or below 48 g turns orange with a **1%** badge. Then 4 · **1% < 5% : REJECT H0** and THE PACKETS REALLY ARE UNDERFILLED. |
| 8 | 1:38–1:52 | **The other outcome** | WHAT IF THE AVERAGE WAS 49.5 g? Same curve; the tail at or below 49.5 g is cyan with a **27%** badge. **27% > 5% : FAIL TO REJECT H0** and NOT PROOF THEY'RE FULL: JUST NOT ENOUGH EVIDENCE. |
| 9 | 1:52–2:07 | **Example 2: a coin** | 2 EXAMPLE · A COIN, ten coins (9 heads, 1 tail). H0: THE COIN IS FAIR, then the exact chances of 0–10 heads in 10 fair flips; bars 9–10 turn orange with a bracket and a **1%** badge. **1% < 5% : REJECT H0** and THE COIN IS PROBABLY BIASED. |
| 10 | 2:07–2:16 | **Remember** | HYPOTHESIS TESTING pill. ASSUME NOTHING SPECIAL (H0) ↓ COLLECT DATA ↓ REJECT ONLY IF REALLY SURPRISING. |
| 11 | 2:16–2:42 | **Quiz, teaser and CTA** | QUICK QUIZ: a grad cap and CLAIM: NEW METHOD RAISES SCORES. "The null hypothesis is... **WHICH ONE?**" Options SCORES UP / NO CHANGE / SCORES DOWN / CAN'T SAY with the 5-second countdown. **NO CHANGE** wins confetti, and the wrong options are struck ("that's H1", "wrong way", "we can"). Then THE NULL ALWAYS SAYS: NO EFFECT. Teaser: NEXT: HOW SURPRISING IS THE DATA? · THE p-VALUE (the heads bars with the 9–10 tail). End card: NEXT: THE p-VALUE, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips H0: no effect · H1: real effect · 5% line · Reject or not. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:13.96)
- `0:00.45` A chips brand says every packet has 50 grams. You weigh 25 packets, and the average is only 48 grams.
- `0:08.04` Are they cheating, or is it just normal variation? Hypothesis testing decides.

**S2 · Textbook definition** (0:13.96–0:35.20)
- `0:14.41` Here's the textbook definition, the one to use in interviews.
- `0:18.13` Hypothesis testing is a statistical method that uses sample data to decide between two competing claims about a population: the null hypothesis and the alternative hypothesis.
- `0:30.24` In plain words: is the pattern in the data real, or just chance?

**S3 · The two hypotheses** (0:35.20–0:50.32)
- `0:35.65` The null hypothesis, H0, says nothing special is going on: the packets really average 50 grams.
- `0:42.62` The alternative, H1, says something is going on: they average less.
- `0:46.99` We always start by assuming the null is true.

**S4 · Every test has a pair** (0:50.32–1:01.07)
- `0:50.77` Every test has this pair.
- `0:52.47` A coin: fair, or biased. A website button: no change, or more clicks.
- `0:57.18` A new teaching method: no difference, or higher scores.

**S5 · Like a courtroom** (1:01.07–1:12.84)
- `1:01.52` It's like a courtroom: innocent until proven guilty.
- `1:04.92` We reject the null only with strong evidence. Not enough evidence means not guilty, which is not the same as innocent.

**S6 · The 4 steps** (1:12.84–1:21.36)
- `1:13.29` A test has four steps.
- `1:14.97` One: state the two hypotheses. Two: pick a significance level, usually 5%.

**S7 · Steps 3 and 4** (1:21.36–1:37.98)
- `1:21.81` Three: calculate the p-value.
- `1:23.90` If the packets really averaged 50 grams, an average this low would happen only about 1% of the time.
- `1:30.40` Four: decide. 1% is below 5%, so we reject the null. The packets really are underfilled.

**S8 · The other outcome** (1:37.98–1:51.93)
- `1:38.43` Now suppose the average had been 49.5 grams.
- `1:41.90` That happens about 27% of the time by chance, so we fail to reject the null.
- `1:47.28` That doesn't prove the packets are full. There's just not enough evidence.

**S9 · Example 2: a coin** (1:51.93–2:06.64)
- `1:52.38` One more example: a coin lands heads 9 times out of 10.
- `1:56.22` If the coin were fair, 9 or more heads would happen only about 1% of the time.
- `2:01.30` Below 5%, so we reject the null. The coin is probably biased.

**S10 · Remember** (2:06.64–2:15.82)
- `2:07.09` So remember: assume nothing special is going on, collect data,
- `2:11.00` and reject that assumption only when the data would be really surprising.

**S11 · Quiz, teaser and CTA** (2:15.82–2:41.78)
- `2:16.17` Quick quiz!
- `2:17.20` A school claims its new teaching method raises test scores.
- `2:20.74` What is the null hypothesis?
- `2:28.07` No change!
- `2:29.24` The null always says: no effect, no difference. The school must bring enough evidence to reject it.
- `2:35.27` Next: how surprising is the data? The p-value.
- `2:38.51` Follow for data science made simple!

total 161.777

## Accuracy notes (every number checked)

- **Definition (textbook wording, as spoken):** "a statistical method that uses sample data to decide between two competing claims about a population: the null hypothesis and the alternative hypothesis". H0 is the claim of no effect / no difference (the status quo) and H1 is the competing claim; the test assumes H0 and asks whether the sample is surprising enough to reject it.
- **Chips example (one-sample t-test, one-sided, H0: μ = 50 g vs H1: μ < 50 g):** n = 25 packets with sample SD 4 g, so SE = 4/√25 = **0.8 g**. The curve in scenes 7–8 is the t distribution with 24 df scaled by SE and centred on 50 g (`tpdf((v − 50)/0.8, 24)/0.8`).
  - Mean 48 g: t = (48 − 50)/0.8 = −2.5, P(T₂₄ ≤ −2.5) = **0.0098** ("about 1%"). 0.0098 < 0.05 → reject H0.
  - Mean 49.5 g: t = −0.625, P(T₂₄ ≤ −0.625) = **0.269** ("about 27%"). 0.269 > 0.05 → fail to reject H0.
  - The SD of 4 g isn't spoken; it only sets the scale of the curve, so both p-values are consistent with what is shown.
- **Fail to reject ≠ accept:** a non-significant result means not enough evidence against H0, not proof that H0 is true (scene 5 "not guilty ≠ innocent", scene 8).
- **Coin:** heads in 10 fair flips ~ Binomial(10, ½), and the bars are exact (`components/Coins.tsx`). P(≥ 9) = 11/1024 = **0.0107** ("about 1%", one-sided). That is below 0.05 → reject H0. "Probably biased" (not "definitely") because a 1% event can still happen by chance.
- **5% significance level** (α = 0.05) is the usual convention.
- **Quiz:** for the claim "the new method raises scores", H0 is "no change" (no effect, no difference) and H1 is "scores go up" (the claim). The burden of proof is on the claim.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a pop on the packet, ticks as the 25 packets land, a ding on the 48 g average, a glitch before the question, and the whoosh, impact and chime on "Hypothesis testing".
- The definition and H0/H1: calm "flow", with a chime on the badge, blips on the key phrases, and pops on the two hypothesis cards.
- The pairs and the courtroom: marimba "play", with step tones per row, a stamp on the gavel, and pops on the two evidence rows.
- The 4 steps, both outcomes and the coin: groove, with blips per step, glides as the curve draws, dings before each percentage, a stamp on each "reject", and flips as the coins land.
- Recap: build, with a crash on entry and step tones per line.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 4–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `distributions-guide/` (`REF=distributions-guide bash .claude/skills/data-science-explainer/new-video.sh hypothesis-testing-v2 HypothesisTestingV2 Hypothesis_Testing_Simple`). It shares `src/components/Simple.tsx` (`InterviewCard`, `ExampleTag`) with `confidence-intervals-v2/` and `p-value-v2/`, and reuses `Coins.tsx` (exact binomial bars), `Curve.tsx` and `TDist.tsx`.

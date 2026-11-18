# The p-Value Explained Simply (v2)

The remake of the p-value Reel for **@curious_datascientist**. The user found the first version (`p-value/`) hard to follow and asked for a simpler explanation, more examples, and a definition viewers can give in an interview, using up to about 170 s. 2:38, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

What's new compared with v1:
- the **INTERVIEW ANSWER** card first, with a plain-words version underneath;
- the null hypothesis explained as "the boring explanation" with three everyday cases (coin, drug, button);
- **three labelled examples** (9 heads → 0.01, 6 heads → 0.38, a drug trial → 0.02);
- the rule (small p vs big p, the 0.05 line);
- **two interview traps** (p ≠ the chance the null is true; small p ≠ big effect);
- a quiz on a non-significant p (0.30).

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: TYPE 1 & 2 ERRORS chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `P_Value_Simple.mp4` | the finished Reel |
| `P_Value_Simple_Cover.png` | 1080×1920 cover: THE p-VALUE · explained simply, "9 HEADS IN 10: RIGGED OR LUCK?" over the ten coins, a p = 0.01 pill, + INTERVIEW-READY DEFINITION tag, @curious_datascientist |
| `P_Value_Simple.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code

| Concept | Colour |
| --- | --- |
| The p-value | violet |
| The null ("nothing special is going on"), the fair coin | cyan |
| Extreme / surprising results (the tail) | orange |
| The 0.05 line, "significant", the right reading | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | Ten coins flip in (9 heads, 1 tail) with a counter. **RIGGED, OR JUST LUCK?** → **THE p-VALUE** · EXPLAINED SIMPLY. |
| 2 | 0:09–0:26 | **Interview definition** | INTERVIEW ANSWER badge and quote card. Phrases reveal with key words lit: *the probability* (violet) · *at least as extreme as yours* (orange) · *assuming the null hypothesis is true* (cyan). Then IN PLAIN WORDS: If **nothing special** were going on, how **surprising** would my data be? |
| 3 | 0:26–0:37 | **The null hypothesis** | THE **BORING** EXPLANATION, "nothing special is going on". Three cards: The coin is fair (a coin) · The drug does nothing (a pill) · The button changes nothing (a BUY NOW button). |
| 4 | 0:37–0:53 | **Example 1: 9 heads** | ASSUME THE COIN IS **FAIR** · FLIP 10 TIMES, AGAIN AND AGAIN: the exact chances of 0–10 heads. 9 OR MORE HEADS turn orange with a **1%** badge, then **p = 0.01** and **VERY SURPRISING FOR A FAIR COIN**. |
| 5 | 0:53–1:06 | **Example 2: 6 heads** | The 6-heads coin row; bars 6–10 orange with a **38%** badge, then **p = 0.38** and **NOT SURPRISING AT ALL**. |
| 6 | 1:06–1:23 | **The rule** | **SMALL p**: Surprising, EVIDENCE AGAINST THE NULL. **BIG p**: Not surprising, NO EVIDENCE. A p-value scale (0–0.5) with both coins (0.01, 0.38), then **THE 0.05 LINE**, a green zone and **BELOW 0.05 = STATISTICALLY SIGNIFICANT**. |
| 7 | 1:23–1:40 | **Example 3: a new drug** | A pill, DRUG vs PLACEBO blood-pressure-drop bars and a GAP bracket, then **p = 0.02**. Then IF THE DRUG DID NOTHING, A GAP THIS BIG: ONLY 2% OF THE TIME → ✓ **SIGNIFICANT**. |
| 8 | 1:40–1:58 | **Two interview traps** | INTERVIEWERS **LOVE** THESE. TRAP 1: "p = 0.02 = 2% CHANCE NULL IS TRUE" struck out ✗ → WHAT IT REALLY IS ✓ the chance of the **DATA**, if the **NULL** were true. TRAP 2: **SMALL p ≠ BIG EFFECT**: it only says the effect is probably not zero. |
| 9 | 1:58–2:10 | **Remember** | HOW SURPRISING IS MY DATA? ↓ SMALL p = SURPRISING ↓ BELOW 0.05 = SIGNIFICANT. |
| 10 | 2:10–2:38 | **Quiz, teaser and CTA** | QUICK QUIZ: **p = 0.30** · LINE: 0.05. "Statistically significant? **YES OR NO?**" Options YES / NO / ALMOST / CAN'T SAY with the 5-second countdown. **NO!** wins confetti, and the wrong options are struck ("too high", "not close", "we can"). Then **0.30 IS ABOVE 0.05: COULD EASILY BE LUCK**. Teaser: NEXT: WHEN TESTS GET IT WRONG · TYPE 1 & 2 ERRORS (the 2×2 grid). End card: NEXT: TYPE 1 & 2 ERRORS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips If null true · Small = surprising · 0.05 line · Not P(null). |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text ("zero point zero five") and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.26)
- `0:00.45` You flip a coin 10 times, and get 9 heads.
- `0:03.56` Is the coin rigged, or did you just get lucky? The p-value answers exactly that.

**S2 · Interview definition** (0:09.26–0:26.03)
- `0:09.71` Here's the definition you can use in an interview.
- `0:12.54` The p-value is the probability of getting results at least as extreme as yours, assuming the null hypothesis is true.
- `0:19.86` In plain words: if nothing special were going on, how surprising would my data be?

**S3 · The null hypothesis** (0:26.03–0:36.72)
- `0:26.48` The null hypothesis is the boring explanation: nothing special is going on.
- `0:31.57` The coin is fair. The new drug does nothing. The new button changes nothing.

**S4 · Example 1: 9 heads** (0:36.72–0:53.23)
- `0:37.17` Example one. Assume the coin is fair, and flip it 10 times, again and again.
- `0:42.22` 9 or more heads happens only about 1% of the time.
- `0:46.09` So the p-value is 0.01. Very surprising for a fair coin, so we start to doubt it.

**S5 · Example 2: 6 heads** (0:53.23–1:06.43)
- `0:53.68` Example two: you got 6 heads instead.
- `0:56.41` A fair coin gets 6 or more heads 38% of the time. So p is 0.38.
- `1:02.46` Not surprising at all. No reason to doubt the coin.

**S6 · The rule** (1:06.43–1:22.95)
- `1:06.88` So here's the rule.
- `1:08.24` Small p-value: surprising, so evidence against the null. Big p-value: not surprising, no evidence.
- `1:15.17` Most people draw the line at 0.05. Below it, the result is called statistically significant.

**S7 · Example 3: a new drug** (1:22.95–1:39.78)
- `1:23.40` Example three: a new drug.
- `1:25.40` Patients on the drug see their blood pressure drop more than patients on a placebo, with a p-value of 0.02.
- `1:33.03` So if the drug did nothing, a gap this big would appear only 2% of the time. That's significant.

**S8 · Two interview traps** (1:39.78–1:57.97)
- `1:40.23` Two mistakes interviewers love to test.
- `1:42.61` One: a p-value of 0.02 is not a 2% chance that the null is true. It's the chance of the data, if the null were true.
- `1:51.44` Two: a small p-value doesn't mean a big effect. It only says the effect is probably not zero.

**S9 · Remember** (1:57.97–2:09.97)
- `1:58.42` So remember: the p-value tells you how surprising your data is, if nothing special were going on.
- `2:04.53` Small means surprising. Below 0.05 means significant.

**S10 · Quiz, teaser and CTA** (2:09.97–2:37.79)
- `2:10.32` Quick quiz!
- `2:11.35` A test gives a p-value of 0.30.
- `2:14.65` Is the result statistically significant?
- `2:22.39` No!
- `2:23.19` 0.30 is above 0.05. Data like this could easily happen by luck.
- `2:29.89` Next: what happens when a test gets it wrong? Type 1 and Type 2 errors.
- `2:34.52` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definition:** p = P(a result at least as extreme as the observed one | H0 true). It is computed assuming H0, so it is neither the probability that H0 is true nor the probability that the result is "due to chance".
  - This follows the ASA 2016 statement: p-values do not measure the probability that the hypothesis is true, and do not measure the size of an effect. These are the two traps in scene 8.
- **Coin:** heads in 10 fair flips ~ Binomial(10, ½), and the bars are exact (`components/Coins.tsx`).
  - P(≥ 9) = 11/1024 = **0.0107** ("about 1%", p = 0.01, one-sided).
  - P(≥ 6) = 386/1024 = **0.377** ("38%", p = 0.38).
- **The 0.05 line** is a convention (α = 0.05); p < α is "statistically significant".
- **Drug example:** illustrative. The bars show a larger mean drop on the drug than on placebo, with p = 0.02 given in the narration: if the drug had no effect, a difference at least this large would occur 2% of the time. 0.02 < 0.05, so it is significant. No sample sizes or mmHg values are claimed.
- **Quiz:** 0.30 > 0.05, so not significant. The data are quite plausible under H0.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a flip per coin (a click on the tail), a glitch before the question, and the whoosh, impact and chime on "p-value".
- The definition and the null: calm "flow", with a chime on the badge, blips on the key phrases, and step tones on the three null cards.
- The two coin examples: marimba "play", with ticks or flips as the bars and coins land, pops before the 1% and 38% badges, and dings before each p.
- The rule, the drug and the traps: groove, with blips on small and big p, a glide as the 0.05 line rises, dings on "significant", glides as the drug bars grow, a stamp on "That's significant", and a glitch, stamp and ding on the traps.
- Recap: build, with a crash on entry and step tones per line.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `distributions-guide/` (`REF=distributions-guide bash .claude/skills/data-science-explainer/new-video.sh p-value-v2 PValueV2 P_Value_Simple`). It shares `src/components/Simple.tsx` (`InterviewCard`, `ExampleTag`) with `confidence-intervals-v2/` and reuses `Coins.tsx` (exact binomial bars).

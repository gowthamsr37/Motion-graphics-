# The p-Value Explained Simply (v2)

The remake of the p-value Reel for **@curious_datascientist**. The user found the first version (`p-value/`) hard to follow and asked for a simpler explanation, more examples, and a definition viewers can give in an interview, using up to about 170 s. 2:48, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

What's new compared with v1:
- the **textbook definition** first, on an INTERVIEW ANSWER card (no "your" wording, as the user asked), with a plain-words version underneath;
- the null hypothesis explained as "the boring explanation" with three everyday cases (coin, a friend guessing, button);
- **three labelled examples** (9 heads → 0.01, 6 heads → 0.38, a cola taste test → 0.001). The taste test replaced a drug-trial example that the user found hard to follow;
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
| 2 | 0:09–0:29 | **Textbook definition** | THE TEXTBOOK DEFINITION · INTERVIEW ANSWER badge and quote card. Phrases reveal with key words lit: *the probability* (violet) · *of obtaining results* · *at least as extreme as the observed results* (orange) · *assuming that the null hypothesis is true* (cyan). Then IN PLAIN WORDS: If **nothing special** were going on, how **surprising** would this data be? |
| 3 | 0:29–0:39 | **The null hypothesis** | THE **BORING** EXPLANATION, "nothing special is going on". Three cards: The coin is fair (a coin) · The friend is just guessing (two cola cups) · The button changes nothing (a BUY NOW button). |
| 4 | 0:39–0:56 | **Example 1: 9 heads** | ASSUME THE COIN IS **FAIR** · FLIP 10 TIMES, AGAIN AND AGAIN: the exact chances of 0–10 heads. 9 OR MORE HEADS turn orange with a **1%** badge, then **p = 0.01** and **VERY SURPRISING FOR A FAIR COIN**. |
| 5 | 0:56–1:09 | **Example 2: 6 heads** | The 6-heads coin row; bars 6–10 orange with a **38%** badge, then **p = 0.38** and **NOT SURPRISING AT ALL**. |
| 6 | 1:09–1:26 | **The rule** | **SMALL p**: Surprising, EVIDENCE AGAINST THE NULL. **BIG p**: Not surprising, NO EVIDENCE. A p-value scale (0–0.5) with both coins (0.01, 0.38), then **THE 0.05 LINE**, a green zone and **BELOW 0.05 = STATISTICALLY SIGNIFICANT**. |
| 7 | 1:26–1:49 | **Example 3: a taste test** | Two cola cups and "I can tell the two colas apart!". Ten blindfolded cups tick green one by one: **10 OUT OF 10 RIGHT**. THE NULL HYPOTHESIS: **just guessing (50/50)** → A GUESSER GETS 10/10: **ABOUT 1 IN 1,000** → **p = 0.001** → ✓ **FAR BELOW 0.05: SIGNIFICANT**. |
| 8 | 1:49–2:07 | **Two interview traps** | INTERVIEWERS **LOVE** THESE. TRAP 1: "p = 0.01 = 1% CHANCE NULL IS TRUE" struck out ✗ → WHAT IT REALLY IS ✓ the chance of the **DATA**, if the **NULL** were true. TRAP 2: **SMALL p ≠ BIG EFFECT**: it only says the effect is probably not zero. |
| 9 | 2:07–2:20 | **Remember** | HOW SURPRISING IS THE DATA? ↓ SMALL p = SURPRISING ↓ BELOW 0.05 = SIGNIFICANT. |
| 10 | 2:20–2:48 | **Quiz, teaser and CTA** | QUICK QUIZ: **p = 0.30** · LINE: 0.05. "Statistically significant? **YES OR NO?**" Options YES / NO / ALMOST / CAN'T SAY with the 5-second countdown. **NO!** wins confetti, and the wrong options are struck ("too high", "not close", "we can"). Then **0.30 IS ABOVE 0.05: COULD EASILY BE LUCK**. Teaser: NEXT: WHEN TESTS GET IT WRONG · TYPE 1 & 2 ERRORS (the 2×2 grid). End card: NEXT: TYPE 1 & 2 ERRORS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips If null true · Small = surprising · 0.05 line · Not P(null). |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text ("zero point zero five") and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.26)
- `0:00.45` You flip a coin 10 times, and get 9 heads.
- `0:03.56` Is the coin rigged, or did you just get lucky? The p-value answers exactly that.

**S2 · Interview definition** (0:09.26–0:28.60)
- `0:09.71` Here's the textbook definition, the one to use in interviews.
- `0:13.43` The p-value is the probability of obtaining results at least as extreme as the observed results, assuming that the null hypothesis is true.
- `0:22.40` In plain words: if nothing special were going on, how surprising would this data be?

**S3 · The null hypothesis** (0:28.60–0:39.38)
- `0:29.05` The null hypothesis is the boring explanation: nothing special is going on.
- `0:34.13` The coin is fair. The friend is just guessing. The new button changes nothing.

**S4 · Example 1: 9 heads** (0:39.38–0:55.89)
- `0:39.83` Example one. Assume the coin is fair, and flip it 10 times, again and again.
- `0:44.87` 9 or more heads happens only about 1% of the time.
- `0:48.74` So the p-value is 0.01. Very surprising for a fair coin, so we start to doubt it.

**S5 · Example 2: 6 heads** (0:55.89–1:09.08)
- `0:56.34` Example two: you got 6 heads instead.
- `0:59.06` A fair coin gets 6 or more heads 38% of the time. So p is 0.38.
- `1:05.11` Not surprising at all. No reason to doubt the coin.

**S6 · The rule** (1:09.08–1:25.60)
- `1:09.53` So here's the rule.
- `1:10.89` Small p-value: surprising, so evidence against the null. Big p-value: not surprising, no evidence.
- `1:17.82` Most people draw the line at 0.05. Below it, the result is called statistically significant.

**S7 · Example 3: a taste test** (1:25.60–1:48.83)
- `1:26.05` Example three: a taste test.
- `1:28.18` A friend claims they can tell two cola brands apart. Blindfolded, they get 10 out of 10 right.
- `1:34.12` The null hypothesis: they're just guessing. A guesser gets 10 out of 10 only about 1 time in 1,000.
- `1:41.14` So p is about 0.001. Far below 0.05, so it's significant.

**S8 · Two interview traps** (1:48.83–2:07.11)
- `1:49.28` Two mistakes interviewers love to test.
- `1:51.65` One: a p-value of 0.01 is not a 1% chance that the null is true. It's the chance of the data, if the null were true.
- `2:00.58` Two: a small p-value doesn't mean a big effect. It only says the effect is probably not zero.

**S9 · Remember** (2:07.11–2:19.83)
- `2:07.56` So remember: the p-value tells how surprising the observed data would be, if nothing special were going on.
- `2:14.40` Small means surprising. Below 0.05 means significant.

**S10 · Quiz, teaser and CTA** (2:19.83–2:47.65)
- `2:20.18` Quick quiz!
- `2:21.21` A test gives a p-value of 0.30.
- `2:24.51` Is the result statistically significant?
- `2:32.25` No!
- `2:33.06` 0.30 is above 0.05. Data like this could easily happen by luck.
- `2:39.75` Next: what happens when a test gets it wrong? Type 1 and Type 2 errors.
- `2:44.38` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definition (textbook wording, as spoken):** "the probability of obtaining results at least as extreme as the observed results, assuming that the null hypothesis is true", i.e. p = P(a result at least as extreme as the observed one | H0 true). It is computed assuming H0, so it is neither the probability that H0 is true nor the probability that the result is "due to chance".
  - This follows the ASA 2016 statement: p-values do not measure the probability that the hypothesis is true, and do not measure the size of an effect. These are the two traps in scene 8.
- **Coin:** heads in 10 fair flips ~ Binomial(10, ½), and the bars are exact (`components/Coins.tsx`).
  - P(≥ 9) = 11/1024 = **0.0107** ("about 1%", p = 0.01, one-sided).
  - P(≥ 6) = 386/1024 = **0.377** ("38%", p = 0.38).
- **The 0.05 line** is a convention (α = 0.05); p < α is "statistically significant".
- **Taste test:** under H0 (just guessing, 50/50 on each cup), P(10 of 10 correct) = (1/2)^10 = 1/1024 = **0.00098**, so "about 1 in 1,000" and "p ≈ 0.001" (one-sided). That is far below 0.05, so it is significant: evidence the friend can really tell the colas apart. (This is the classic "lady tasting tea" design that Fisher used to introduce significance testing.)
- **Quiz:** 0.30 > 0.05, so not significant. The data are quite plausible under H0.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a flip per coin (a click on the tail), a glitch before the question, and the whoosh, impact and chime on "p-value".
- The definition and the null: calm "flow", with a chime on the badge, blips on the key phrases, and step tones on the three null cards.
- The two coin examples: marimba "play", with ticks or flips as the bars and coins land, pops before the 1% and 38% badges, and dings before each p.
- The rule, the drug and the traps: groove, with blips on small and big p, a glide as the 0.05 line rises, dings on "significant", ticks as the ten cups tick green, a ding before "0.001", a stamp on "significant", and a glitch, stamp and ding on the traps.
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

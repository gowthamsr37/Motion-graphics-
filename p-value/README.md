# The p-Value Explained in 2 Minutes

The twenty-sixth **Data Science Made Simple** Reel for **@curious_datascientist**. It covers the p-value: the chance of results at least as extreme as yours, if nothing special were going on. 2:15, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is the third Reel of the inference batch (confidence intervals → hypothesis testing → **p-value** → Type I vs Type II errors → A/B testing). It reuses the coin from the hypothesis-testing Reel, so the two connect directly. It covers:
- a plain-words definition card;
- p = 0.01 for 9 heads and p = 0.38 for 6 heads (exact binomial tails);
- small p vs big p;
- the 0.05 line as a convention (0.049 vs 0.051);
- the most common misreading (P(data | null) is not P(null | data));
- a tiny p is not a big effect (10 million users per group);
- a recap and a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: TYPE 1 & 2 ERRORS chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `P_Value.mp4` | the finished Reel |
| `P_Value_Cover.png` | 1080×1920 cover: THE p-VALUE · explained in 2 minutes. It shows "p < 0.05, BUT WHAT DOES IT MEAN?" over the fair-coin bars with the 9-or-10-heads tail lit and a "p = 0.01" badge, plus @curious_datascientist |
| `P_Value.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The p-value itself | violet |
| "If nothing were going on" (the fair coin, the null) | cyan |
| Results at least as extreme (the tail), surprising | orange |
| The 0.05 line, "significant", the right reading | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | Three research papers (MEDICINE, PSYCHOLOGY, MARKETING) fan in, and each gets a green **p < 0.05** stamp. Then **EVERY PAPER SAYS p < 0.05**. The papers fly out; the title **THE p-VALUE** bursts in over a **p < 0.05 ?** pill, **WHAT DOES IT ACTUALLY MEAN?** and EXPLAINED SIMPLY. |
| 2 | 0:10–0:24 | **The definition** | IN SIMPLE WORDS: 1 chance of results **AT LEAST AS EXTREME**; 2 if **NOTHING SPECIAL** is going on; 3 small p: **SURPRISING** by luck alone. Then THAT'S THE **p-VALUE**. |
| 3 | 0:24–0:36 | **The coin** | BACK TO THE COIN: the ten coins (**9 HEADS IN 10**). IF THE COIN WERE **FAIR**...: the exact chances of 0–10 heads grow as bars. Bars 9 and 10 turn orange (**AT LEAST AS EXTREME**) under a bracket with a **1%** badge. Then the pill **p = 0.01**. |
| 4 | 0:36–0:51 | **Small vs big** | NOW: **6 HEADS IN 10**. Bars 6–10 turn orange (**6 OR MORE HEADS**) with a **38%** badge, then **p = 0.38**. The chart clears for two verdict cards: **p = 0.01** (9 HEADS, a mini chart with the 9–10 tail) **HARD TO EXPLAIN BY LUCK**, and **p = 0.38** (6 HEADS, the 6–10 tail) **EASILY JUST LUCK**. |
| 5 | 0:51–1:08 | **The 0.05 line** | A p-value scale from 0 to 0.10 with the green **0.05** line: the left side tints green, **SIGNIFICANT** vs NOT SIGNIFICANT. Then **A HABIT, NOT A LAW OF NATURE**. **0.049** (SIGNIFICANT) and **0.051** (NOT SIGNIFICANT) land almost on top of each other. A ring circles them: **ALMOST THE SAME EVIDENCE**. |
| 6 | 1:08–1:22 | **The big mistake** | ⚠ THE **MOST COMMON** MISREADING. THE MYTH card: p = 0.01 means **1% CHANCE THE NULL IS TRUE**. It is struck out with a red cross. Then WHAT IT REALLY IS (green tick): **CHANCE OF THE DATA, IF THE NULL WERE TRUE**. Then **P(DATA \| NULL) ≠ P(NULL \| DATA)**, labelled WHAT p IS / WHAT p IS NOT. |
| 7 | 1:22–1:33 | **Size matters too** | **TINY p ≠ BIG EFFECT**. 10 MILLION USERS IN EACH GROUP: two near-identical conversion bars, A **10.00%** and B **10.05%**. **DIFFERENCE: JUST 0.05 POINTS**, yet **p < 0.001** (TINY). Then **ALWAYS CHECK THE EFFECT SIZE**. |
| 8 | 1:33–1:44 | **Remember** | A THE p-VALUE pill and a recap flow: **HOW SURPRISING IS YOUR DATA?** ↓ **SMALL p = SURPRISING** ↓ **NOT THE CHANCE THE NULL IS TRUE**. |
| 9 | 1:44–2:15 | **Quiz, teaser and CTA** | QUICK QUIZ: **p = 0.03** · LEVEL: 5%. "Statistically significant? **WHICH ONE?**" Options NO / YES / ONLY IF BIG / CAN'T TELL with the 5-second countdown. **YES, SIGNIFICANT** wins confetti, and the wrong options are struck ("0.03 < 0.05", "not the rule", "we can"). Then **BUT NOT A 3% CHANCE THE NULL IS TRUE**. Teaser: NEXT: WHEN TESTS GET IT WRONG · **TYPE 1 & 2 ERRORS** (a 2×2 grid with the two error cells lit). End card: NEXT: TYPE 1 & 2 ERRORS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips If null true · Small = rare · 0.05: a habit · Not P(null). |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text ("zero point zero five") and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.50)
- `0:00.45` Research papers love to say it: p is less than 0.05.
- `0:05.42` But what does a p-value actually mean? Let's make it simple.

**S2 · The definition** (0:09.50–0:24.13)
- `0:09.95` Here's the definition, in simple words.
- `0:12.55` The p-value is the chance of getting results at least as extreme as yours, if nothing special were going on.
- `0:18.96` A small p-value means: this would be really surprising, by luck alone.

**S3 · The coin** (0:24.14–0:36.25)
- `0:24.59` Back to the coin that landed heads 9 times out of 10.
- `0:28.06` If the coin were fair, 9 or 10 heads would happen just 1% of the time.
- `0:32.79` So the p-value is 0.01.

**S4 · Small vs big** (0:36.25–0:50.80)
- `0:36.70` Now compare: 6 heads out of 10.
- `0:39.11` 6 or more heads happens 38% of the time, so the p-value is 0.38.
- `0:45.26` Small p-value: hard to explain by luck. Big p-value: easily luck.

**S5 · The 0.05 line** (0:50.80–1:07.66)
- `0:51.25` By convention, a p-value below 0.05 is called statistically significant.
- `0:57.57` But that line is a habit, not a law of nature. 0.049 and 0.051 are almost the same evidence.

**S6 · The big mistake** (1:07.66–1:21.87)
- `1:08.11` Here's the most common mistake.
- `1:09.97` A p-value of 0.01 does not mean a 1% chance that the null is true.
- `1:15.96` It's the chance of the data if the null were true. Not the chance of the null, given the data.

**S7 · Size matters too** (1:21.87–1:33.21)
- `1:22.32` And a tiny p-value doesn't mean a big effect.
- `1:25.15` With millions of users, even a tiny difference gets a tiny p-value. So always check how big the effect really is.

**S8 · Remember** (1:33.21–1:44.35)
- `1:33.66` So remember: the p-value tells you how surprising your data would be, if nothing were going on.
- `1:39.54` Small means surprising. But it is not the chance that the null is true.

**S9 · Quiz, teaser and CTA** (1:44.36–2:14.84)
- `1:44.70` Quick quiz!
- `1:45.73` A test gives a p-value of 0.03.
- `1:49.09` Is the result statistically significant, at the 5% level?
- `1:58.34` Yes!
- `1:59.21` 0.03 is below 0.05. But it's still not a 3% chance that the null is true.
- `2:06.94` Next: what happens when a test gets it wrong? Type 1 and Type 2 errors.
- `2:11.57` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definition:** the p-value is P(a test statistic at least as extreme as the one observed | H0 true).
  - It is computed assuming the null hypothesis, so it is not the probability that H0 is true, nor the probability that the result is due to chance. This follows the American Statistical Association's 2016 statement on p-values: a p-value does not measure the probability that the hypothesis is true, and it does not measure the size of an effect.
- **Scene 3:** heads in 10 flips of a fair coin ~ Binomial(10, ½). One-sided p for 9 heads = P(≥ 9) = 11/1024 = **0.0107**, shown as **0.01** ("about 1%"). The bars are drawn from the exact probabilities (`components/Coins.tsx`).
- **Scene 4:** p for 6 heads = P(≥ 6) = 386/1024 = **0.377**, shown as **0.38** ("38%").
- **Scene 5:** α = 0.05 is a convention (often traced to R. A. Fisher), not a natural constant. 0.049 and 0.051 differ by 0.002 and represent essentially the same strength of evidence.
- **Scene 6:** P(data | H0) ≠ P(H0 | data). Turning one into the other needs Bayes' theorem and a prior probability for H0.
- **Scene 7:** 10,000,000 users per group, conversion 10.00% vs 10.05%. With a pooled proportion of 0.10025, SE = √(0.10025 × 0.89975 × 2/10⁷) = 0.000134. Then z = 0.0005/0.000134 = 3.72, so the two-sided p = **0.0002** (shown as **p < 0.001**). The absolute difference is 0.05 percentage points (0.5% relative).
- **Quiz:** 0.03 < 0.05, so the result is significant at the 5% level. Even so, p = 0.03 is not "a 3% chance that the null is true".

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, whooshes as the papers fan in, a stamp per "p < 0.05", a glitch before the question, and the whoosh, impact and chime on "p-value".
- Definition: calm "flow", with a blip per line and a ding as the card completes.
- The coin and small vs big: marimba "play", with flips as the coin rows land, a tick run as the bars grow, pops before the 1% and 38% badges, a ding before each p, and blips on the two verdict cards.
- The 0.05 line, the big mistake and size matters: groove, with glides as the scale and the line appear, a glitch before "habit", pops on 0.049 and 0.051, a stamp as the myth is struck, and a ding before "check".
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

Scaffolded from `hypothesis-testing/` (`REF=hypothesis-testing bash .claude/skills/data-science-explainer/new-video.sh p-value PValue P_Value`). It reuses `components/Coins.tsx` and adds `PLess` (the "p < 0.05" lockup) plus the shared colours in `scenes/S1Hook.tsx`, and `CoinRow` in `scenes/S3Coin.tsx`.

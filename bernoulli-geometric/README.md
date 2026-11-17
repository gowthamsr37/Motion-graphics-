# Bernoulli & Geometric Distributions Explained in 2 Minutes

The twenty-first **Data Science Made Simple** Reel for **@curious_datascientist**: one yes/no try (Bernoulli) and the number of tries until the first success (geometric). 2:12, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Part of the "explain it very well" batch. One running example, "Is it a six?", carries both distributions:
- a hook;
- the Bernoulli definition card;
- one roll as two bars;
- why yes/no matters in data science (and the link to the binomial);
- the geometric definition card (and the link to the exponential);
- rolling until a six as a staircase of bars;
- the average wait;
- a recap;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: THE t-DISTRIBUTION chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Bernoulli_Geometric.mp4` | the finished Reel |
| `Bernoulli_Geometric_Cover.png` | 1080×1920 cover: BERNOULLI & GEOMETRIC · explained in 2 minutes, a six, ONE TRY (bars 0 and 1) and TRIES UNTIL THE FIRST SIX (the staircase), @curious_datascientist |
| `Bernoulli_Geometric.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Success (1), the six | green |
| Failure (0) | orange |
| Tries, the geometric bars | cyan |
| The average | violet |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:13 | **Hook** | A dice tumbles and lands on 6: **IS IT A SIX?** with YES and NO buttons → **BERNOULLI**. Four rolls pop in (3, 1, 5, 6; TRY 1–4, the 6 green) → **& GEOMETRIC**. |
| 2 | 0:13–0:27 | **Bernoulli: the definition** | IN SIMPLE WORDS: 1 **ONE TRY**; 2 **TWO OUTCOMES** (✓ ✗); 3 success = **1**, failure = 0; 4 needs **THE CHANCE OF SUCCESS**. THAT'S THE BERNOULLI DISTRIBUTION. |
| 3 | 0:27–0:40 | **One roll** | A six. The green "1 · A SIX" bar rises with **1/6 = 17%**; the orange "0 · NOT A SIX" bar with **5/6 = 83%**. **JUST TWO BARS**. |
| 4 | 0:40–0:58 | **Yes or no, everywhere** | Cards land on their words: CLICKED? SPAM? WILL BUY? (YES = 1 / NO = 0). An ML MODEL → CHANCE OF A YES meter fills to 72%. Ten tries ✓/✗ appear: **COUNT THE YESES → BINOMIAL**. |
| 5 | 0:58–1:10 | **Geometric: the definition** | IN SIMPLE WORDS: Counts the **TRIES** · until the **FIRST SUCCESS**. Two cards: EXPONENTIAL · WAITING TIME (stopwatch) and GEOMETRIC · WAITING TRIES (dice). |
| 6 | 1:10–1:29 | **Rolling until a six** | One run (3, 1, 5, 6): **THIS TIME: 4 TRIES**. Then the geometric bars, roll 1–12: roll 1 rises with **17%**, roll 2 **14%**, roll 3 **12%**, then the rest step down: EACH EXTRA ROLL: A BIT LESS LIKELY. Bar 1 turns green with a crown: **MOST LIKELY: ROLL 1!** |
| 7 | 1:29–1:37 | **The average wait** | **AVERAGE = 1 ÷ CHANCE**; **CHANCE 1 IN 6 → 6 ROLLS**; a violet marker rises at roll 6: AVERAGE: 6 ROLLS. |
| 8 | 1:37–1:47 | **Remember** | A recap flow: **BERNOULLI: ONE TRY, YES OR NO** ↓ **GEOMETRIC: TRIES UNTIL FIRST YES** ↓ **AVERAGE WAIT = 1 ÷ CHANCE**. |
| 9 | 1:47–2:12 | **Quiz, teaser and CTA** | QUICK QUIZ. Twelve calls, every fourth a green ✓: **1 IN EVERY 4 CALLS IS A SALE**. "Calls until the first sale? **ON AVERAGE?**" Options 1 / 4 / 25 / 3 with the 5-second countdown. **4 CALLS**: confetti and strikes ("that's one call", "that's the percent", "count the sale too"); a bracket over the first four calls; **AVERAGE WAIT = 1 ÷ (1/4) = 4**. Teaser: NEXT: SMALL SAMPLES · THE t-DISTRIBUTION. End card: NEXT: THE t-DISTRIBUTION, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips One yes/no try · Success = 1 · Tries till first yes · Mean = 1 ÷ chance. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Bernoulli" is phoneme-patched to *ber-NOO-lee*, and "seventeen" and "fourteen" are patched to stress their second syllable.

**S1 · Hook** (0:00.00–0:12.78)
- `0:00.45` Roll a dice. Is it a six? Just yes or no.
- `0:03.64` That simple question has its own distribution: Bernoulli.
- `0:07.30` And rolling until you finally get a six? That's the geometric distribution.

**S2 · Bernoulli: the definition** (0:12.78–0:27.39)
- `0:13.23` First, Bernoulli, in simple words.
- `0:15.50` A Bernoulli distribution is one try, with two outcomes: success or failure.
- `0:20.64` We write success as one, and failure as zero.
- `0:23.60` And it needs just one number: the chance of success.

**S3 · One roll** (0:27.39–0:39.98)
- `0:27.84` Roll once. A six is a success, with a chance of one in six.
- `0:32.01` Anything else is a failure: five in six.
- `0:34.73` So the shape is just two bars: a tall one for zero, and a short one for one.

**S4 · Yes or no, everywhere** (0:39.98–0:57.86)
- `0:40.42` Yes-or-no outcomes are everywhere in data science.
- `0:43.67` Did the customer click? Is this email spam? Will they buy?
- `0:47.24` Many machine learning models predict exactly this: the chance of a yes.
- `0:51.66` And repeat the try many times, counting the yeses? That's the binomial you've already seen.

**S5 · Geometric: the definition** (0:57.86–1:09.88)
- `0:58.31` Now, the geometric distribution.
- `1:00.71` It counts how many tries it takes to get the first success.
- `1:03.90` Like the exponential, it's about waiting. But instead of measuring time, it counts tries.

**S6 · Rolling until a six** (1:09.88–1:29.38)
- `1:10.33` Keep rolling until you get a six.
- `1:12.42` A six on the very first roll? One in six, about 17%.
- `1:16.77` On the second roll? About 14%. On the third? About 12.
- `1:21.03` Each extra roll is a bit less likely, so the bars step down.
- `1:24.91` Surprise: the single most likely roll is the very first one!

**S7 · The average wait** (1:29.38–1:36.67)
- `1:29.83` But on average, how long do you wait?
- `1:32.20` One over the chance. With a one-in-six chance, that's six rolls.

**S8 · Remember** (1:36.67–1:46.74)
- `1:37.12` So remember: Bernoulli is one try, yes or no.
- `1:40.29` Geometric counts the tries until the first yes. And the average wait is one over the chance.

**S9 · Quiz, teaser and CTA** (1:46.74–2:12.16)
- `1:47.09` Quick quiz!
- `1:48.12` A salesperson closes one call in every four.
- `1:51.13` On average, how many calls until the first sale?
- `1:59.41` 4!
- `2:00.28` The average wait is one over the chance. A one-in-four chance means four calls.
- `2:05.27` Next: what to do with small samples. The t-distribution.
- `2:08.89` Follow for data science made simple!

*(Between "On average, how many calls until the first sale?" and "4!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Bernoulli(p):** one trial with P(X = 1) = p and P(X = 0) = 1 − p; its mean is p.
  - For "is it a six?", p = 1/6 = **16.7%** (shown as 17%) and 1 − p = 5/6 = **83.3%** (83%).
- **Binomial link:** the sum of n independent Bernoulli(p) trials is Binomial(n, p).
- **ML link:** binary classifiers such as logistic regression model P(y = 1 | x), the Bernoulli parameter for each case. The 72% meter is illustrative.
- **Geometric (number of trials until the first success, counting the success):** P(K = k) = (1 − p)^(k−1) p.
  - For p = 1/6: k = 1 → **16.7%**, k = 2 → **13.9%**, k = 3 → **11.6%** (said "about 17, 14, 12"), then 9.6, 8.0, 6.7, 5.6, 4.7, 3.9, 3.2, 2.7, 2.2% for rolls 4–12.
  - The mode is always k = 1. The mean is 1/p = **6**. (The median is 4: P(K ≤ 4) = 51.8%.)
- **Exponential link:** the geometric is the discrete analogue of the exponential: both are memoryless waiting-time distributions.
- **The 3, 1, 5, 6 run** in scenes 1 and 6 is illustrative.
- **Quiz:** p = 1/4 gives a mean of 1/p = **4** calls (counting the successful call).
  - The distractors: 1, 25 (the percentage), 3 (the average number of failures before the first sale, (1 − p)/p, which is the other common convention).

## Audio

Same score engine and kit as the series, re-timed for 9 scenes:
- Hook: intro, dice ticks, a clink on the landing, a pop on YES/NO, the riser and impact on "Bernoulli", clicks on each try, a ding on the six and a chime on "geometric".
- Definitions: calm "flow", with a blip per line.
- One roll and yes/no everywhere: marimba "play", with glides on the bars, blips per card, a glide on the meter and ticks on the ten tries.
- Geometric and the average: groove, with clicks and a ding on the run, pops on 17/14/12%, ticks as the bars step down, a sparkle on the surprise and a glide to the average.
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `pareto-distribution/` (`REF=pareto-distribution bash .claude/skills/data-science-explainer/new-video.sh bernoulli-geometric BernoulliGeometric Bernoulli_Geometric`). Scenes 6 and 7 share `src/scenes/GeoBars.tsx` (the exact geometric bars for p = 1/6).

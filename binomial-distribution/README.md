# The Binomial Distribution Explained in 2 Minutes

The fifteenth **Data Science Made Simple** Reel for **@curious_datascientist**, and the second in the distributions arc (after uniform): 107 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Same simple structure as the uniform Reel:
- a hook question (guess every answer on a 10-question true/false test: what's the chance of 7 right?);
- a plain-words definition card;
- one small example built up step by step (3 coin flips → 1, 3, 3, 1);
- back to the test, with the real numbers;
- what changes the shape (the chance);
- the average;
- a recap that repeats the definition;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: POISSON DISTRIBUTION chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Binomial_Distribution.mp4` | the finished Reel |
| `Binomial_Distribution_Cover.png` | 1080×1920 cover: THE BINOMIAL DISTRIBUTION · explained in 2 minutes, a row of 7 ticks and 3 crosses over the 0–10 "number right" bars with the 7 bar highlighted ("7?"), @curious_datascientist |
| `Binomial_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The bars (the distribution) | violet |
| Success (right, heads, most likely) | green |
| Failure / the rarer counts | orange |
| The average | cyan |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | TRUE OR FALSE · **JUST GUESS**: a 10-question ANSWER SHEET fills with random T/F guesses, then gets marked with ticks and crosses: **7 RIGHT?** WHAT ARE THE ODDS → **THE BINOMIAL DISTRIBUTION** · explained simply. |
| 2 | 0:09–0:24 | **The definition** | IN SIMPLE WORDS: a 4-line card that fills on the spoken words. 1 Counts the **SUCCESSES** (✓✓✓); 2 in a **FIXED NUMBER** of tries (n = 10); 3 each try: **TWO OUTCOMES** (✓ ✗); 4 the **SAME CHANCE** every time (p = 1/2). All four tick green: THAT'S THE BINOMIAL DISTRIBUTION. |
| 3 | 0:24–0:39 | **Three coin flips** | START SMALL · 3 COIN FLIPS: the 8 possible results (HHH … TTT) appear in a grid. On each spoken group they drop into columns by number of heads: 0 heads (1), 1 head (3), 2 heads (3), 3 heads (1). Labels 1/8 · 3/8 · 3/8 · 1/8: **A BINOMIAL SHAPE**. |
| 4 | 0:39–0:52 | **Back to the test** | **10 TRIES** · **50-50 EACH**: exact binomial bars for 0–10 right. The 5 bar glows green (25%): **5 RIGHT: ABOUT 1 IN 4**. The 7 bar turns orange: **12%**. The 10 bar: **0.1%** · **ALL 10: UNDER 1 IN 1,000**. |
| 5 | 0:52–1:02 | **Change the chance** | **RIGHT 1 TIME IN 5**: the bars morph from p = 1/2 to p = 1/5 and slide left. The 2 bar glows green (30%): **THE BARS SHIFT LEFT**. |
| 6 | 1:02–1:10 | **The average** | **AVERAGE = TRIES × CHANCE**. Two panels with the mean marked on each set of bars: **10 × 1/2 = 5** and **10 × 1/5 = 2**. |
| 7 | 1:10–1:23 | **Remember** | BINOMIAL DISTRIBUTION pill and a recap flow: **COUNTS SUCCESSES** ↓ **FIXED TRIES, SAME CHANCE** ↓ **AVERAGE = TRIES × CHANCE**. Then use chips pop in: defective products, ad clicks, penalty shots. |
| 8 | 1:23–1:47 | **Quiz, teaser and CTA** | QUICK QUIZ. 10 PENALTIES (ten balls) · **SCORES 80%**. Options 10 / 8 / 5 / 0.8 with the 5-second countdown. **8 GOALS**: eight balls tick, two miss; strikes ("not every time", "that's 50-50", "that's the chance"); **10 TRIES × 0.8 = 8**. Teaser: NEXT · POISSON (bars). End card: NEXT: POISSON DISTRIBUTION, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Count successes · Fixed tries · Same chance · Mean = n × p. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.18)
- `0:00.45` You guess every answer on a 10-question true or false test.
- `0:04.15` What's the chance you get 7 right?
- `0:06.21` The binomial distribution tells you.

**S2 · The definition** (0:09.18–0:23.85)
- `0:09.63` Here's the definition, in simple words.
- `0:12.23` The binomial distribution counts the successes in a fixed number of tries.
- `0:16.95` Each try has two outcomes, like right or wrong.
- `0:20.13` And the chance of success is the same every time.

**S3 · Three coin flips** (0:23.85–0:38.50)
- `0:24.30` Let's start small. Flip a coin three times, and count the heads.
- `0:28.11` There are eight possible results.
- `0:30.07` Zero heads happens one way. One head, three ways. Two heads, three ways. Three heads, one way.
- `0:36.15` That's a binomial shape.

**S4 · The test** (0:38.50–0:51.58)
- `0:38.95` Back to the test: 10 tries, each a 50-50 guess.
- `0:42.64` 5 right is the most likely, about one time in four.
- `0:46.06` 7 right? About 12%.
- `0:48.28` All 10 right? Less than one in a thousand.

**S5 · Change the chance** (0:51.58–1:02.39)
- `0:52.03` Now change the chance.
- `0:53.47` If each question has five options, a guess is right only one time in five.
- `0:58.26` The bars shift left. 2 right is now the most likely.

**S6 · The average** (1:02.39–1:09.98)
- `1:02.84` The average is simple: tries times chance.
- `1:05.63` 10 times 1/2 is 5. 10 times 1/5 is 2.

**S7 · Remember** (1:09.98–1:23.06)
- `1:10.43` So remember: binomial counts successes in a fixed number of tries, each with the same chance.
- `1:16.29` Its average is tries times chance.
- `1:18.54` It's used for defective products, ad clicks, and penalty shots.

**S8 · Quiz, teaser and CTA** (1:23.06–1:46.63)
- `1:23.41` Quick quiz!
- `1:24.44` A player scores 80% of her penalties. She takes 10.
- `1:28.24` On average, how many will she score?
- `1:35.80` 8!
- `1:36.64` 10 tries times 0.8 is 8.
- `1:39.39` Next, we'll count events in time, with the Poisson distribution.
- `1:43.36` Follow for data science made simple!

*(Between "On average, how many will she score?" and "8!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Definition:** the binomial distribution B(n, p) gives the probability of k successes in n independent tries, each with the same success probability p: P(k) = C(n, k) p^k (1 − p)^(n − k). Its mean is n × p.
- **3 coin flips:** 2³ = 8 equally likely results. Heads 0/1/2/3 happen in 1/3/3/1 ways (1/8, 3/8, 3/8, 1/8).
- **10 guesses at 50-50:**
  - P(5) = 252/1024 = **24.6%** ("about one time in four"; shown as 25%).
  - P(7) = 120/1024 = **11.7%** ("about 12%").
  - P(10) = 1/1024 = **0.098%** ("less than one in a thousand"; shown as 0.1%).
- **Five options (p = 1/5):** P(2) = 45 × 0.2² × 0.8⁸ = **30.2%**, the most likely count; P(1) = 26.8%.
- **Average:** 10 × 1/2 = **5**; 10 × 1/5 = **2**.
- **Uses:** defective items in a batch, clicks out of ad views, and goals out of penalties are standard binomial set-ups (fixed tries, two outcomes, assumed equal and independent chances).
- **Quiz:** 10 penalties at 80% → mean 10 × 0.8 = **8**. The distractors: 10 (she doesn't score every time), 5 (the 50-50 answer), 0.8 (that's the chance, not the count).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, pencil ticks as the sheet fills, marks, and the riser, impact and crash on "binomial".
- Definition: calm "flow", with a blip per line.
- Coin flips and the test: marimba "play", with flip ticks, a step-up SFX as each coin group drops, and pops on the highlighted bars.
- Change the chance and the average: groove, with a glide as the bars slide left.
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words. The coin-group drops and their SFX are cued on the right occurrence of repeated words ("one way" vs "One head", "three ways" vs "Three heads"). The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `uniform-distribution/` (`REF=uniform-distribution bash .claude/skills/data-science-explainer/new-video.sh binomial-distribution BinomialDistribution Binomial_Distribution`). `src/scenes/S4Test.tsx` exports the exact `binom()` helper and the `BinomBars` chart used by the later scenes and the cover.

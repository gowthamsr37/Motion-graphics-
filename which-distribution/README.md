# Which Distribution? Explained in 2 Minutes

The eighteenth **Data Science Made Simple** Reel for **@curious_datascientist**, and the cheat sheet that closes the distributions arc (uniform → binomial → Poisson → exponential, plus normal from earlier and bimodal as a bonus): 100 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

The structure follows the simple style:
- a hook (five distributions: which one should you use?);
- a plain-words definition card (a reminder of what a probability distribution is, and the one question to ask);
- one question per distribution, each with an everyday example, its shape and its name;
- a bonus shape (bimodal);
- a recap cheat sheet;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: CONFIDENCE INTERVALS chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Which_Distribution.mp4` | the finished Reel |
| `Which_Distribution_Cover.png` | 1080×1920 cover: WHICH DISTRIBUTION? · explained in 2 minutes, THE CHEAT SHEET grid of the six shapes (uniform, binomial, Poisson, exponential, normal, bimodal), @curious_datascientist |
| `Which_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

Each distribution keeps one colour through the whole video (cards, shapes, names, recap rows and the quiz options).

| Distribution | Colour |
| --- | --- |
| Uniform | cyan |
| Binomial | violet |
| Poisson | green |
| Exponential | orange |
| Normal | violet → cyan gradient |
| Bimodal | green → orange gradient (two groups) |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | Five shape cards pop in on their spoken names: UNIFORM (six equal bars), BINOMIAL, POISSON, EXPONENTIAL, NORMAL. **SO MANY!** (the cards wobble) → **WHICH DISTRIBUTION?** with a burst → **THE CHEAT SHEET** pill. |
| 2 | 0:09–0:23 | **The definition** | FIRST, A REMINDER · IN SIMPLE WORDS: a 4-line card that fills on the spoken words. 1 Shows **HOW LIKELY**; 2 each **POSSIBLE VALUE** is; 3 each question: **ITS OWN SHAPE**; 4 so ask: **WHAT AM I MEASURING?** All four tick green: ONE QUESTION, ONE SHAPE. |
| 3 | 0:23–0:30 | **Question 1** | ARE ALL OUTCOMES **EQUALLY LIKELY?** · example card: a dice, A FAIR DICE. A dashed "?" box; on "uniform" six equal bars rise and **UNIFORM** lands · SHAPE: FLAT. |
| 4 | 0:30–0:37 | **Question 2** | SUCCESSES IN A **FIXED NUMBER OF TRIES?** · coins H T H, HEADS IN 10 FLIPS. The exact 10-flip binomial bars rise: **BINOMIAL** · COUNTS SUCCESSES. |
| 5 | 0:37–0:43 | **Question 3** | COUNTING EVENTS IN A **STRETCH OF TIME?** · three customers and a clock, CUSTOMERS PER HOUR. Poisson bars (average 4): **POISSON** · COUNTS EVENTS. |
| 6 | 0:43–0:50 | **Question 4** | THE WAITING TIME UNTIL **THE NEXT EVENT?** · a stopwatch, TIME TO THE NEXT CUSTOMER. A falling curve sweeps in: **EXPONENTIAL** · SHORT WAITS: MOST COMMON. |
| 7 | 0:50–0:57 | **Question 5** | A MEASUREMENT AROUND **AN AVERAGE?** · a ruler, PEOPLE'S HEIGHTS. A bell sweeps in: **NORMAL** · THE BELL CURVE. |
| 8 | 0:57–1:06 | **Bonus** | AND IF YOU SEE **TWO HUMPS?** A two-humped curve sweeps in: **BIMODAL** · TWO GROUPS MIXED TOGETHER. The example card A CAFÉ'S BUSY HOURS appears, and the humps are labelled **LUNCH** and **DINNER** on their words. |
| 9 | 1:06–1:18 | **Remember** | THE CHEAT SHEET pill and five rows that land on their phrases and light their names, each with a mini shape: EQUALLY LIKELY → **UNIFORM** · SUCCESSES IN TRIES → **BINOMIAL** · EVENTS IN TIME → **POISSON** · WAITING TIME → **EXPONENTIAL** · AROUND AN AVERAGE → **NORMAL**. |
| 10 | 1:18–1:40 | **Quiz, teaser and CTA** | QUICK QUIZ. A 0–60 min hour bar: five emails drop in and get counted (**EMAILS THIS HOUR: 5**). "Which distribution **FITS?**" Options UNIFORM / POISSON / NORMAL / EXPONENTIAL with the 5-second countdown. **POISSON**: confetti and strikes ("not equally likely", "not a measurement", "that's waiting time"); **COUNTING EVENTS IN A FIXED TIME**. Teaser: NEXT: CONFIDENCE INTERVALS · HOW SURE? (a bell with an interval bar). End card: NEXT: CONFIDENCE INTERVALS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Uniform · Binomial · Poisson · Exponential. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Poisson" is phoneme-patched to *pwah-SOHN*, and "bimodal" to *bye-MOH-dal*.

**S1 · Hook** (0:00.00–0:09.28)
- `0:00.45` Uniform, binomial, Poisson, exponential, normal.
- `0:04.01` So many distributions! Which one should you use?
- `0:06.90` Here's a simple cheat sheet.

**S2 · The definition** (0:09.28–0:22.94)
- `0:09.73` First, a quick reminder, in simple words.
- `0:12.45` A probability distribution shows how likely each possible value is.
- `0:17.02` Different questions need different distributions.
- `0:19.98` So just ask: what am I measuring?

**S3 · Uniform** (0:22.94–0:30.43)
- `0:23.34` Are all outcomes equally likely, like a fair dice?
- `0:26.59` Use the uniform distribution. Its shape is flat.

**S4 · Binomial** (0:30.43–0:37.37)
- `0:30.83` Counting successes in a fixed number of tries, like heads in 10 coin flips?
- `0:35.54` That's binomial.

**S5 · Poisson** (0:37.37–0:43.33)
- `0:37.77` Counting events in a stretch of time, like customers per hour?
- `0:41.48` That's Poisson.

**S6 · Exponential** (0:43.34–0:50.28)
- `0:43.73` Measuring the waiting time until the next event?
- `0:46.63` That's exponential. Short waits are the most common.

**S7 · Normal** (0:50.28–0:57.28)
- `0:50.68` A measurement that clusters around an average, like people's heights?
- `0:54.42` That's normal, the famous bell curve.

**S8 · Bimodal** (0:57.28–1:05.64)
- `0:57.68` And if you see two humps?
- `0:59.30` That's bimodal. Usually two groups are mixed together, like a café's lunch rush and dinner rush.

**S9 · Remember** (1:05.64–1:17.75)
- `1:06.09` So remember: equally likely, uniform. Successes in tries, binomial.
- `1:10.99` Events in time, Poisson. Waiting time, exponential. Measurements around an average, normal.

**S10 · Quiz, teaser and CTA** (1:17.75–1:39.55)
- `1:18.10` Quick quiz!
- `1:19.13` You count how many emails arrive each hour.
- `1:21.62` Which distribution fits?
- `1:28.70` Poisson!
- `1:29.74` You're counting events in a fixed stretch of time.
- `1:32.37` Next: how sure can we be about an average? Confidence intervals.
- `1:36.28` Follow for data science made simple!

*(Between "Which distribution fits?" and "Poisson!": the 5-second countdown, music only.)*

## Accuracy notes

- **Definition:** a probability distribution gives the probability (or density) of each possible value of a random variable.
- **The guide is a rule of thumb for the five distributions covered in the series.** Real data can fit none of them exactly, so check the shape (and the assumptions) before you rely on one.
  - **Uniform:** all outcomes in the range equally likely (a fair dice: 1/6 each). The shape is flat.
  - **Binomial:** the number of successes in a fixed number n of independent tries with the same chance p (heads in 10 flips: B(10, ½); the bars shown are exact).
  - **Poisson:** the number of events in a fixed interval when events happen independently at a steady average rate (customers per hour; the bars shown are Poisson(4)).
  - **Exponential:** the waiting time until the next event in that same kind of process. The density is highest at 0 and falls steadily.
  - **Normal:** many measurements that cluster symmetrically around an average (heights within one group are approximately normal), the bell curve.
- **Bimodal:** a distribution with two peaks. It often means two groups are mixed, such as a café's customers by hour (a lunch rush and a dinner rush) or heights of adults when two groups with different averages are pooled. The curve shown is an illustrative mix of two bells.
- **Quiz:** the number of emails arriving in an hour is a count of events in a fixed time interval, so **Poisson** is the standard model.
  - The distractors: uniform (counts aren't equally likely), normal (it's a count, not a continuous measurement around an average; a Poisson with a large mean does look bell-shaped), exponential (that would be the time between emails).

## Audio

Same score engine and kit as the series, re-timed for 10 scenes:
- Hook: intro, a blip per name, a glitch on "So many", and the riser, impact and crash on "Which".
- Definition: calm "flow", with a blip per line.
- Questions 1–3: marimba "play". Questions 4–5 and the bonus: groove. Every question has the same cue set: a pop on the question, a click on the example, a glide as the shape draws, then a stamp and chime on the name.
- Cheat sheet: build, with a blip per row.
- Quiz: hops as the emails drop, the suspense countdown and finale, and a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off the spoken names. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `exponential-distribution/` (`REF=exponential-distribution bash .claude/skills/data-science-explainer/new-video.sh which-distribution WhichDistribution Which_Distribution`). It adds `src/components/Pick.tsx`:
- `Shape`, one component for all six shapes (bars grow, curves sweep);
- `QuestionScene`, the template behind scenes 3–8: question, example card, a dashed "?" box, then the shape, the name and a tag;
- `Envelope`.

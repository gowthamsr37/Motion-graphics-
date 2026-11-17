# The Poisson Distribution Explained in 2 Minutes

The sixteenth **Data Science Made Simple** Reel for **@curious_datascientist**, and the third in the distributions arc (after uniform and binomial): 103 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Same simple structure as the uniform and binomial Reels:
- a hook question (a chai stall that averages 4 customers an hour: what's the chance of 10?);
- a plain-words definition card;
- one everyday example built up step by step (hour-by-hour counts → a shape);
- what changes the shape (the average);
- where it's used;
- a recap that repeats the definition;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: EXPONENTIAL DISTRIBUTION chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Poisson_Distribution.mp4` | the finished Reel |
| `Poisson_Distribution_Cover.png` | 1080×1920 cover: THE POISSON DISTRIBUTION · explained in 2 minutes, customers-per-hour bars for an average of 4 with 3 and 4 highlighted, a clock, @curious_datascientist |
| `Poisson_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Events / counts (customers, bars) | cyan |
| The average rate | violet |
| Most likely counts | green |
| Rare counts | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | A CHAI STALL (striped awning, three cups) pops in. Four customers walk up: **4 CUSTOMERS AN HOUR (AVERAGE)**. The crowd jumps to ten: **10 IN ONE HOUR?** → **THE POISSON DISTRIBUTION** with a burst · explained simply. |
| 2 | 0:10–0:25 | **The definition** | IN SIMPLE WORDS: a 4-line card that fills on the spoken words. 1 Counts **EVENTS**; 2 in a **FIXED TIME OR SPACE** (clock); 3 at a **STEADY RATE**, at random; 4 needs just **THE AVERAGE** (avg = 4). All four tick green: THAT'S THE POISSON DISTRIBUTION. |
| 3 | 0:25–0:37 | **Hour by hour** | Four hour-long timelines fill with customers at random moments: CUSTOMERS ARRIVE **AT RANDOM**. A count badge lands on each spoken number: 3, 5, 4, 2. Then **60 HOURS OF COUNTS**: 60 simulated hours drop as dots into columns 0–10 and a hump appears. |
| 4 | 0:37–0:49 | **The shape** | AVERAGE = 4 AN HOUR: exact Poisson bars for 0–12 rise. 3 and 4 glow green: **3 AND 4 ARE MOST LIKELY** · **20% EACH**. The 0 bar turns orange: **2%**. The 10 bar turns orange: **0.5%** · **10: ABOUT 1 IN 200**. |
| 5 | 0:49–0:58 | **Change the average** | The same axis: the bars re-shape from an average of 4 to **1 AN HOUR** (tall at 0 and 1), then to **15 AN HOUR** (wider, centred on 15), with a faint dashed bell over it: **ALMOST A BELL**. |
| 6 | 0:58–1:06 | **Where it's used** | COUNTS, EVERYWHERE: four cards pop in on their words, each with mini Poisson bars: HELP DESK CALLS (per hour), WEBSITE VISITS (per minute), TYPOS (per page), GOALS (per match). |
| 7 | 1:06–1:17 | **Remember** | POISSON DISTRIBUTION pill and a recap flow: **COUNTS EVENTS** ↓ **IN A FIXED TIME OR SPACE** ↓ **AT RANDOM, STEADY RATE**. Then **THE AVERAGE → CHANCE OF ANY COUNT**. |
| 8 | 1:17–1:43 | **Quiz, teaser and CTA** | QUICK QUIZ. HOUR 1 shows its 3 calls: **3 CALLS AN HOUR**. "Calls expected **IN 4 HOURS?**" Hours 2–4 appear. Options 3 / 12 / 7 / 4 with the 5-second countdown. **12 CALLS**: confetti and strikes ("that's 1 hour", "don't add", "that's hours"). All four hours fill with 3 calls each: **3 AN HOUR × 4 HOURS = 12**. Teaser: NEXT · EXPONENTIAL (a falling curve). End card: NEXT: EXPONENTIAL DISTRIBUTION, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Counts events · Fixed interval · Steady rate · One number. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Poisson" is phoneme-patched to *pwah-SOHN*, and "fifteen" is patched to stress its second syllable.

**S1 · Hook** (0:00.00–0:09.62)
- `0:00.45` A chai stall gets 4 customers an hour, on average.
- `0:03.91` What's the chance of 10 customers in one hour?
- `0:06.60` The Poisson distribution answers that.

**S2 · The definition** (0:09.62–0:25.41)
- `0:10.07` Here's the definition, in simple words.
- `0:12.67` The Poisson distribution counts how many times something happens in a fixed stretch of time or space.
- `0:18.68` The events happen at random, at a steady average rate.
- `0:21.84` And that one number, the average, is all it needs.

**S3 · Hour by hour** (0:25.41–0:36.85)
- `0:25.86` Watch the stall, hour by hour.
- `0:27.94` Customers arrive at random moments.
- `0:30.27` This hour, three. Next hour, five. Then four, then two.
- `0:33.85` Count many hours, and a shape appears.

**S4 · The shape** (0:36.85–0:49.20)
- `0:37.30` Here's the shape for an average of 4.
- `0:39.55` 3 and 4 are the most likely, about 20% each.
- `0:43.09` Zero customers? About 2%.
- `0:45.67` 10 in an hour? Only about one in two hundred.

**S5 · Change the rate** (0:49.20–0:58.15)
- `0:49.65` Change the average, and the shape changes.
- `0:52.27` 1 an hour: mostly zero or one.
- `0:54.63` 15 an hour: wider, and almost a bell.

**S6 · Where it's used** (0:58.15–1:06.08)
- `0:58.60` It's used everywhere.
- `1:00.03` Calls to a help desk, website visits per minute, typos on a page, or goals in a match.

**S7 · Remember** (1:06.08–1:17.00)
- `1:06.53` So remember: Poisson counts events in a fixed stretch of time or space, happening at random at a steady rate.
- `1:13.10` Give it the average, and it tells you the chance of any count.

**S8 · Quiz, teaser and CTA** (1:17.00–1:42.94)
- `1:17.35` Quick quiz!
- `1:18.38` A help desk gets 3 calls an hour, on average.
- `1:21.47` How many calls do you expect in 4 hours?
- `1:29.49` 12!
- `1:30.40` The average grows with time: 3 an hour, times 4 hours, is 12.
- `1:35.02` Next: how long until the next event? That's the exponential distribution.
- `1:39.67` Follow for data science made simple!

*(Between "How many calls do you expect in 4 hours?" and "12!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Definition:** the Poisson distribution gives the probability of k events in a fixed interval when events happen independently at a constant average rate λ: P(k) = e^(−λ) λ^k / k!. Its mean (and its variance) is λ.
- **Average 4 (scene 4):**
  - P(3) = P(4) = **19.5%** (said "about 20% each").
  - P(0) = e^(−4) = **1.8%** ("about 2%").
  - P(10) = **0.53%** ("about one in two hundred"; exactly 1 in 189).
- **Average 1 (scene 5):** P(0) = P(1) = 36.8% and P(2) = 18.4%: "mostly zero or one".
- **Average 15 (scene 5):** the most likely counts are 14 and 15 (10.2% each), and the SD is √15 ≈ 3.9. The shape is close to a normal curve; the dashed bell is N(15, √15).
- **Scene 3:** the four hour counts (3, 5, 4, 2) and their arrival moments are illustrative. The 60 hours are a seeded Poisson(4) simulation (`poisSamples(4, 60, 2024)`), checked to peak at 3–4.
- **Uses:** call arrivals, web visits per minute, typos per page and goals per match are standard examples of counts that are approximately Poisson.
- **Quiz:** at 3 calls an hour, the count over 4 hours is Poisson(12), so the expected number is 3 × 4 = **12**.
  - The distractors: 3 (one hour), 7 (adding 3 + 4), 4 (the number of hours).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a blip per customer, and the riser, impact and crash on "Poisson".
- Definition: calm "flow", with a blip per line.
- Hour by hour and the shape: marimba "play", with clicks on each count, ticks as the dots drop, and pops on the highlighted bars.
- Change the average and where it's used: groove, with glides as the shape changes and a pop per card.
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words, and never on a key word. In QA, "Count many hours" was heard as "How many hours", so the scene 3 whoosh was moved earlier and the dot ticks start after "many". The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `binomial-distribution/` (`REF=binomial-distribution bash .claude/skills/data-science-explainer/new-video.sh poisson-distribution PoissonDistribution Poisson_Distribution`). It adds `src/components/Pois.tsx`: `pois`, `poisDist`, a seeded `poisSamples` and `CountBars`.

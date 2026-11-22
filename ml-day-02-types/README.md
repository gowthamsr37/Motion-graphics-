# 100 Days of ML · Day 2: The 3 Types of Machine Learning

Episode 2 of **100 Days of Machine Learning** for **@curious_datascientist**. Same style as Day 1 (`../ml-day-01-stats`) and the statistics videos: navy backdrop, Sora / Inter, neon accents, house panels and pills, word-synced captions, FOLLOW end card, 112 BPM score + SFX, Kokoro `af_heart` at 1.05×, −14 LUFS. Only the cover differs: the plum ML cover. Prices in Rs lakh. About 2:57, 1080×1920, 30 fps.

**Series cover (new from Day 2, Day 1's cover redone to match):** `src/components/MLCover.tsx`, shared by every episode. The Instagram profile grid shows only the middle 1080×1440 of a reel cover, at about a third of the phone's width. So the two biggest things inside that crop are a solid **100 DAYS OF ML** banner (dark text on a bright pink-to-peach fill) and a giant **DAY n** (n in yellow), followed by a 100-dot progress strip with today's dot lit. Then come the topic, the art and the handle. For a new episode: `<MLCover day={n} topic={…} hook={…} art={…} />`.

Colour code: supervised = cyan, unsupervised = orange, reinforcement = violet (regression cyan, classification green).

## Deliverables (in `out/`, built by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `ML_Day_02_Types_Of_ML.mp4` | the finished Reel |
| `ML_Day_02_Types_Of_ML_Cover.png` | the series cover: 100 DAYS OF ML banner, DAY 2, the progress dots, "THE 3 TYPES OF ML", "Which one fits your problem?", three type tiles, handle |
| `ML_Day_02_Types_Of_ML.srt` | the subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Title card (frame 0)** | 100 DAYS OF ML pill, DAY 2 / 100, "The 3 Types of Machine Learning"; three type cards (flash cards, clusters, robot dog) land by ~1.5 s and glow as named; checklist (how each one learns · where it's used · how to pick) ticks as it is said. |
| 2 | **Hook: 3 jobs** | Job cards: predict the price of a flat (house), split customers into groups (cart), teach a robot dog to walk (dog), each with a pulsing "?"; "3 completely different ways to learn". |
| 3 | **Supervised** | A solved question paper next to "learns from examples WITH the right answers"; the past flat sales table (area · bedrooms · city · price: 800 → Rs 34L, 1,200 → Rs 46L, 1,500 → Rs 55L, 2,000 → Rs 70L), with a FEATURES box (cyan) and a LABEL = the answer box (green); arrow into MODEL: learns features → price; a row counter climbs to 10,000. |
| 4 | **Two flavours** | REGRESSION panel (answer is a NUMBER: a dot slides along a price scale to Rs 55L) and CLASSIFICATION panel (answer is a CATEGORY: an email drops into the SPAM bin; YES / NO, CAT / DOG); yesterday's poll answered: bank, "fraud / not fraud, labelled = SUPERVISED CLASSIFICATION". |
| 5 | **The catch** | THE CATCH pill, "Labels are expensive"; a person tags an email (NOT SPAM), a scan (TUMOUR) and a card payment (FRAUD); a counter climbs to 50,000 labels, by hand. |
| 6 | **Unsupervised** | "NO answers. No labels."; a scatter of customers (visits per month × spend per visit) appears grey, then turns into three coloured, ringed groups: BIG SPENDERS, LOYAL REGULARS, BARGAIN HUNTERS; "nobody named them: the machine found them" → CLUSTERING. |
| 7 | **More unsupervised uses** | Card payments list, with the odd one (Rs 48,000 · 3:07 AM · abroad) flagged red → ANOMALY DETECTION; BREAD linked to BUTTER, "frequently bought together". |
| 8 | **Reinforcement** | "no answer key · no dataset · it learns by DOING"; AGENT (robot dog) → action → WORLD → reward / penalty loop; the dog steps (+1 step forward), then topples (−10 fell over); a reward-per-try curve climbs as the try counter runs to 5,000; proof cards: the game of Go (beat the world champion) and chatbots like ChatGPT (fine-tuned with human feedback). |
| 9 | **Cheat sheet + save** | Three rows: Have the right answers? SUPERVISED → it predicts · No answers? UNSUPERVISED → it finds patterns · Trial and reward? REINFORCEMENT → it learns actions; SAVE THIS pill. |
| 10 | **Answers** | The three job cards return with tags: SUPERVISED · REGRESSION, UNSUPERVISED · CLUSTERING, REINFORCEMENT · LEARNING. |
| 11 | **Poll, teaser, end card** | YOUR TURN!, hospital doodle, "predict how many DAYS a patient stays"; A Supervised: classification · B Supervised: regression · C Unsupervised · D Reinforcement; VOTE IN THE CAPTION POLL; TOMORROW · DAY 3: THE ML WORKFLOW (DATA → CLEAN → TRAIN → TEST); house FOLLOW end card. |

## Accuracy notes

- Regression vs classification: the poll answer is B (number of days is a number, so regression). Its pinned comment explains the classification variant.
- AlphaGo beat Lee Sedol (18-time world champion) in 2016; ChatGPT was fine-tuned with reinforcement learning from human feedback (RLHF).
- Prices follow the Day 1 model: Rs 10 lakh + Rs 3,000 per sq ft (city is shown as a feature but not used in these round numbers).

## Rebuild

```bash
SP=<scratchpad>; $SP/venv/bin/python scripts/gen-voice.py --model $SP/models/kokoro --whisper $SP/models/whisper-small-en
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

## Voiceover script (timestamps are on the finished video)

**S1 · Title card** (0:00.00–0:11.75)
- `0:00.20` Day 2 of 100 Days of Machine Learning: the 3 types of machine learning.
- `0:04.81` Supervised, unsupervised and reinforcement: how each one learns, where it's used, and how to pick the right one.

**S2 · Hook** (0:11.75–0:23.98)
- `0:12.15` Three jobs. Predict the price of a flat. Split a shop's customers into groups. Teach a robot dog to walk.
- `0:18.86` Each one learns in a completely different way.
- `0:21.53` By the end, you'll match them instantly.

**S3 · Supervised: the idea** (0:23.98–0:48.34)
- `0:24.38` Type one: supervised learning. It learns from examples that come with the right answers, like practising with a solved question paper.
- `0:32.54` Take past flat sales. Each row has the area, the bedrooms and the location. Those are the features.
- `0:38.85` And each row has the price it actually sold for. That's the label: the answer.
- `0:43.55` The model studies thousands of rows, and learns how the features lead to the price.

**S4 · Supervised: two flavours** (0:48.34–1:07.75)
- `0:48.74` Supervised learning comes in two flavours.
- `0:51.41` If the answer is a number, like a price in lakhs, it's called regression.
- `0:55.45` If the answer is a category, like spam or not spam, it's called classification.
- `1:00.45` So yesterday's poll? Fraud or not fraud, learned from labelled transactions. That's supervised classification.

**S5 · The catch** (1:07.75–1:14.81)
- `1:08.14` The catch? Labels are expensive. Someone has to tag every email, every scan, every transaction.

**S6 · Unsupervised: clustering** (1:14.81–1:34.74)
- `1:15.21` Type two: unsupervised learning. No answers at all. The machine finds the structure on its own.
- `1:21.18` Plot a shop's customers by how often they visit, and how much they spend.
- `1:25.44` The machine spots three groups: bargain hunters, loyal regulars, and big spenders.
- `1:30.42` Nobody named those groups. It found them. This is called clustering.

**S7 · Unsupervised: more uses** (1:34.74–1:47.07)
- `1:35.14` Unsupervised learning also flags the odd one out, like a card payment at three a.m.. That's anomaly detection.
- `1:42.48` And it finds what goes together: people who buy bread often buy butter too.

**S8 · Reinforcement** (1:47.07–2:13.61)
- `1:47.47` Type three: reinforcement learning. No answer key, and no fixed dataset. An agent learns by doing.
- `1:54.11` The robot dog takes an action. The world answers with a reward or a penalty. A step forward: plus one. Falling over: minus ten.
- `2:02.48` It tries thousands of times, and slowly learns the moves that earn the most reward.
- `2:07.35` That's how a machine beat the world champion at Go, and it helps fine-tune chatbots like ChatGPT.

**S9 · Cheat sheet** (2:13.61–2:29.25)
- `2:14.01` So here's the cheat sheet.
- `2:15.59` Have the right answers? Supervised: it predicts.
- `2:18.57` No answers? Unsupervised: it finds patterns.
- `2:21.83` Learning by trial and reward? Reinforcement: it learns actions.
- `2:26.24` Save this. You'll use it for all 100 days.

**S10 · Puzzle answers** (2:29.25–2:40.61)
- `2:29.65` Back to our three jobs.
- `2:31.21` The flat price is supervised regression. The customer groups are unsupervised clustering. And the walking robot dog is reinforcement learning.

**S11 · Poll, teaser and CTA** (2:40.61–2:56.48)
- `2:40.96` Your turn: a hospital uses past patient records to predict how many days a new patient will stay. Which type is that? Vote in the caption poll!
- `2:49.99` Tomorrow, Day 3: the machine learning workflow, step by step.
- `2:53.76` Follow for data science made simple!

total 176.479

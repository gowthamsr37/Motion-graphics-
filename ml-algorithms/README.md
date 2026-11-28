# Every ML Algorithm Explained in 3 Minutes (standalone reel)

A standalone Data Science Made Simple reel (not part of 100 Days of ML; user: no next-reel teaser at the end). Hook from frame 0: a title card "EVERY ML ALGORITHM · 12 ALGORITHMS · UNDER 3 MINUTES" listing all 12, plus "Netflix, Gmail, Swiggy, your bank's fraud alert run on 12 algorithms; save this before your next interview". Then the map (supervised / unsupervised / reinforcement), 12 algorithm scenes (each: #n/12, family, name, a small animation that moves on its words, the one-line takeaway, USED IN chips), WHICH ONE TO USE (save moment), the quiz and the end card. Stats house style; navy cover. 2:59 (Instagram's 3-minute limit), −14.2 LUFS. Deliverables in `out/`: `ML_Algorithms_Explained.mp4`, `ML_Algorithms_Explained_Cover.png`, `.srt`; caption in `CAPTION.md`.

## The animations (`src/components/Algos.tsx`)

1 best-fit line draws through points, then residuals · 2 S-curve draws, a point rides to 80% → YES · 3 decision tree branches on its words · 4 five trees pop, vote, FRAUD 4–1 · 5 trees in a chain, error bar shrinks 100 → 14% · 6 KNN circle grows, 3 nearest light up, new point takes the majority colour · 7 email's spam words light up, P(spam) meter fills to 97% · 8 SVM street widens between classes, support vectors ringed on its edges · 9 K-means centres drop and move, points recolour · 10 PCA arrow draws, cloud collapses onto it · 11 neural net with pulses flowing forward · 12 grid world: try 1 falls in the pit (−1), try 2 reaches the goal (+10).

## Accuracy notes

Twelve widely used algorithms; "almost all of it runs on" is a simplification (production systems combine many methods). Numbers in the animations are illustrative. Quiz answer: K-means (clustering with no labels).

## Voiceover script

**S1 · Hook + title (frame 0)** (0:00.00–0:12.41)
- `0:00.15` Netflix, Gmail, Swiggy, your bank's fraud alert. Almost all of it runs on just 12 machine learning algorithms.
- `0:07.41` Here's every one, explained in under 3 minutes. Save this before your next interview.

**S2 · The map** (0:12.41–0:26.99)
- `0:12.61` First, the map.
- `0:13.72` Supervised algorithms learn from examples with answers. They predict a number, or a category. Unsupervised ones find patterns with no answers given. And reinforcement learning learns by trial and reward.

**S3 · 1 Linear regression** (0:26.99–0:35.24)
- `0:27.19` Number 1: linear regression.
- `0:29.08` It draws the straight line that best fits your data. Bigger flat, higher rent. Use it to predict a number.

**S4 · 2 Logistic regression** (0:35.24–0:47.90)
- `0:35.45` Number 2: logistic regression.
- `0:37.61` Despite the name, it answers yes or no questions. It squeezes everything into a probability between 0 and 1. Will this customer buy? 80%, yes.

**S5 · 3 Decision tree** (0:47.90–0:57.26)
- `0:48.10` Number 3: decision tree.
- `0:49.92` A flowchart of yes or no questions. Salary above 50,000? Any existing loans? Approve, or reject.

**S6 · 4 Random forest** (0:57.26–1:07.63)
- `0:57.45` Number 4: random forest.
- `0:59.40` One tree can be wrong. So build hundreds, each on a slightly different slice of the data, and let them vote. Banks use it to catch fraud.

**S7 · 5 Gradient boosting** (1:07.63–1:18.95)
- `1:07.83` Number 5: gradient boosting, like XGBoost.
- `1:11.01` Trees are built one after another, and each new tree fixes the mistakes of the last one. It wins most competitions on table data.

**S8 · 6 K nearest neighbours** (1:18.95–1:27.36)
- `1:19.15` Number 6: K nearest neighbours.
- `1:21.30` To label a new point, look at its closest neighbours, and copy the majority. You are who your neighbours are.

**S9 · 7 Naive Bayes** (1:27.36–1:37.09)
- `1:27.56` Number 7: naive Bayes.
- `1:29.45` It counts how often words appear in spam versus normal mail. Free, winner, urgent? Probably spam. Great for text.

**S10 · 8 Support vector machine** (1:37.09–1:46.40)
- `1:37.29` Number 8: support vector machine.
- `1:39.51` It draws the widest possible street between two classes. The points touching the edge of the street are the support vectors.

**S11 · 9 K-means clustering** (1:46.40–1:58.13)
- `1:46.60` Number 9: K-means clustering.
- `1:48.77` No answers given. It drops K centres, gives each point to the nearest one, and moves the centres until the groups settle. Perfect for customer segments.

**S12 · 10 PCA** (1:58.13–2:08.38)
- `1:58.33` Number 10: PCA, principal component analysis.
- `2:01.83` It squeezes 100 columns into a few that keep most of the information. Faster models, easier plots.

**S13 · 11 Neural networks** (2:08.38–2:20.12)
- `2:08.58` Number 11: neural networks.
- `2:10.70` Layers of tiny calculators, each passing signals forward. Stack enough layers, and you get deep learning: face unlock, translation, ChatGPT.

**S14 · 12 Reinforcement learning** (2:20.12–2:30.58)
- `2:20.32` Number 12: reinforcement learning.
- `2:22.60` An agent tries actions, gets rewards or penalties, and slowly learns the best moves. That's how AI mastered chess and Go.

**S15 · Which one to use** (2:30.58–2:48.55)
- `2:30.78` So which one should you use? Predicting a number? Linear regression, or gradient boosting. Yes or no? Logistic regression, or a random forest. Finding groups? K means. Too many columns? PCA. Images or text? Neural networks.
- `2:46.17` Screenshot this, or save it for later.

**S16 · Quiz + CTA** (2:48.56–2:58.89)
- `2:48.75` Quick quiz! Netflix groups viewers with similar taste, without any labels. Which algorithm fits best? Vote in the caption poll!
- `2:56.47` Follow for data science made simple!

total 178.891

## Rebuild

```bash
cp -al ../ml-day-08-encoding/node_modules .
python scripts/gen-voice.py --model <kokoro> --whisper <whisper-small-en>
node scripts/gen-audio.mjs
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

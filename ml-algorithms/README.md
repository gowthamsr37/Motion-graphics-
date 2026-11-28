# Which ML Algorithm Would You Use? (standalone reel, interview angle)

Rebuilt after user feedback: the first hook (a list of names) would get swiped; the user chose the interview-angle hook in the style of `which-test/` (15k views): name the confusing options, ask the exact question, a stake, a promise, save. Structure: 3 questions (labels? number or category? images/audio/text?), each algorithm arrives as an answer with "use it when…".


A standalone Data Science Made Simple reel (not part of 100 Days of ML; user: no next-reel teaser at the end). Hook from frame 0: a title card "EVERY ML ALGORITHM · 12 ALGORITHMS · UNDER 3 MINUTES" listing all 12, plus "Netflix, Gmail, Swiggy, your bank's fraud alert run on 12 algorithms; save this before your next interview". Then the map (supervised / unsupervised / reinforcement), 12 algorithm scenes (each: #n/12, family, name, a small animation that moves on its words, the one-line takeaway, USED IN chips), WHICH ONE TO USE (save moment), the quiz and the end card. Stats house style; navy cover. 2:54, −14.1 LUFS. Deliverables in `out/`: `ML_Algorithms_Explained.mp4`, `ML_Algorithms_Explained_Cover.png`, `.srt`; caption in `CAPTION.md`.

## The animations (`src/components/Algos.tsx`)

1 best-fit line draws through points, then residuals · 2 S-curve draws, a point rides to 80% → YES · 3 decision tree branches on its words · 4 five trees pop, vote, FRAUD 4–1 · 5 trees in a chain, error bar shrinks 100 → 14% · 6 KNN circle grows, 3 nearest light up, new point takes the majority colour · 7 email's spam words light up, P(spam) meter fills to 97% · 8 SVM street widens between classes, support vectors ringed on its edges · 9 K-means centres drop and move, points recolour · 10 PCA arrow draws, cloud collapses onto it · 11 neural net with pulses flowing forward · 12 grid world: try 1 falls in the pit (−1), try 2 reaches the goal (+10).

## Accuracy notes

Twelve widely used algorithms; "almost all of it runs on" is a simplification (production systems combine many methods). Numbers in the animations are illustrative. Quiz answer: K-means (clustering with no labels).

## Voiceover script

**S1 · Hook (frame 0)** (0:00.00–0:10.54)
- `0:00.15` XGBoost, SVM, KNN, logistic regression. The interviewer asks: which one would you use, and why?
- `0:07.17` Most people guess. After this video, you won't. Save it!

**S2 · Three questions** (0:10.54–0:21.97)
- `0:10.74` Choosing an algorithm comes down to 3 questions.
- `0:13.87` 1: do you have the answers, the labels? 2: are you predicting a number, or a category? 3: is it images, audio or text?

**S3 · Number: linear regression** (0:21.97–0:28.98)
- `0:22.17` Predicting a number? Start with linear regression.
- `0:24.88` It draws the line that best fits your data. Bigger flat, higher rent.

**S4 · Number: gradient boosting** (0:28.98–0:41.76)
- `0:29.18` Need more accuracy on table data? Gradient boosting, like XGBoost.
- `0:33.82` Trees are built one after another, and each new tree fixes the mistakes of the last one. It wins most competitions on table data.

**S5 · Category: logistic regression** (0:41.76–0:53.06)
- `0:41.96` Predicting a category, like yes or no? Start with logistic regression.
- `0:46.30` It squeezes everything into a probability between 0 and 1. Will this customer buy? 80%, yes.

**S6 · Category: decision tree** (0:53.06–1:03.62)
- `0:53.26` Need to explain every decision? A decision tree.
- `0:56.29` A flowchart of yes or no questions. Salary above 50,000? Any existing loans? Approve, or reject.

**S7 · Category: random forest** (1:03.62–1:13.16)
- `1:03.82` Want a stronger, safer choice? Random forest.
- `1:06.79` Build hundreds of trees, each on a different slice of the data, and let them vote. Banks use it to catch fraud.

**S8 · Category: naive Bayes** (1:13.16–1:22.73)
- `1:13.36` Classifying text, like spam? Naive Bayes.
- `1:16.38` It counts how often words appear in spam versus normal mail. Free, winner, urgent? Probably spam.

**S9 · Category: SVM** (1:22.73–1:32.55)
- `1:22.93` Small dataset, two clear classes? A support vector machine.
- `1:26.73` It draws the widest possible street between the classes. The points on the edge are the support vectors.

**S10 · Category: KNN** (1:32.55–1:40.17)
- `1:32.75` The simplest idea of all? K nearest neighbours.
- `1:35.74` To label a new point, look at its closest neighbours, and copy the majority.

**S11 · No labels: K-means** (1:40.17–1:51.96)
- `1:40.37` No labels at all, and you want groups? K means clustering.
- `1:44.02` It drops K centres, gives each point to the nearest one, and moves the centres until the groups settle. Perfect for customer segments.

**S12 · Too many columns: PCA** (1:51.96–2:00.66)
- `1:52.16` Too many columns? PCA.
- `1:54.10` It squeezes 100 columns into a few that keep most of the information. Faster models, easier plots.

**S13 · Images, audio, text: neural networks** (2:00.66–2:12.13)
- `2:00.86` Images, audio or text at scale? Neural networks.
- `2:04.25` Layers of tiny calculators passing signals forward. Stack enough, and you get deep learning: face unlock, ChatGPT.

**S14 · Trial and reward: reinforcement learning** (2:12.13–2:23.32)
- `2:12.33` Learning by trial and reward, like a game? Reinforcement learning.
- `2:16.37` An agent tries moves, gets rewards or penalties, and learns the best strategy. That's how AI mastered chess.

**S15 · What to say in the interview** (2:23.32–2:42.27)
- `2:23.52` So in the interview, say this. A number? Linear regression, then boosting. A category? Logistic regression, then random forest. Text? Naive Bayes. No labels? K means. Too many columns? PCA. Images? Neural networks.
- `2:38.54` Save this reel, and send it to a friend preparing for interviews.

**S16 · Quiz + CTA** (2:42.27–2:53.67)
- `2:42.47` Interview question! Netflix wants to group viewers with similar taste, without any labels. Which algorithm would you use? Vote in the caption poll!
- `2:51.25` Follow for data science made simple!

total 173.666

## Rebuild

```bash
cp -al ../ml-day-08-encoding/node_modules .
python scripts/gen-voice.py --model <kokoro> --whisper <whisper-small-en>
node scripts/gen-audio.mjs
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

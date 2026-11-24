# 100 Days of ML · Day 3: The Machine Learning Workflow

Episode 3 for **@curious_datascientist**, in the statistics house style (navy, Sora / Inter, house captions and end card, 112 BPM score, `af_heart` 1.05×, −14 LUFS). The cover is the shared ocean-blue + yellow series cover (`MLCover day={3}`). About 2:29. Prices in Rs lakh. Deliverables in `out/`: `ML_Day_03_Workflow.mp4`, `ML_Day_03_Workflow_Cover.png`, `.srt`; caption in `CAPTION.md`.

New component: `src/components/Steps.tsx` (the 7-step progress bar shown on every step scene, and a data table).

## Storyboard

1. **Title card** (frame 0): 100 DAYS OF ML · DAY 3, "The Machine Learning WORKFLOW", the 7 numbered steps by ~1.5 s, chips (7 steps · one full example · the beginner mistake), SAVE THIS ONE.
2. **Hook:** "everyone thinks ML = the perfect algorithm"; iceberg with model training ~10% above the water and 90% below (define · collect + clean · explore + split · evaluate + deploy); project card PREDICT FLAT PRICES in Pune.
3. **Step 1, define:** predict price in Rs lakh → a number → REGRESSION; success = off by under Rs 5 lakh on average.
4. **Step 2, collect:** sales table (area · bedrooms · location · age · price; Hinjewadi, Wakad, Baner, Hadapsar, Kharadi), counter to 10,000 flats.
5. **Step 3, clean:** missing price, duplicate row, typo 12,000 flagged, then FIXED (filled, struck out, 1,200); GARBAGE IN → GARBAGE OUT.
6. **Step 4, explore:** three mini charts (area ↑ price, near IT parks pricier, older a little cheaper).
7. **Step 5, split:** 100 squares, 20 slide into a locked TEST box (80% train / 20% test); the exam analogy, TEST ONLY ON UNSEEN DATA.
8. **Step 6, train:** guess → error → adjust loop, average miss falling to Rs 4L, "just like Day 1".
9. **Step 7, evaluate + deploy:** 2,000 hidden flats, Rs 4L vs Rs 5L target, PASSED!; app "Rs 71L estimate", keep watching, RETRAIN.
10. **Remember this:** the 7 steps light up on their names; SAVE THIS, the map for the next 97 days.
11. **Poll + teaser + end card:** 99% on its own training data: A nothing · B it already saw the answers · C too few features · D wrong algorithm (answer B); TOMORROW · DAY 4: CLEANING MESSY DATA; follow card.

## Accuracy notes

"~10% training / 90% everything else" and "cleaning up to 80% of the time" are widely quoted rules of thumb from practitioner surveys, not exact figures. The flats and prices are illustrative.

## Voiceover script

**S1 · Title card** (0:00.00–0:12.68)
- `0:00.20` Day 3 of 100 Days of Machine Learning: the machine learning workflow.
- `0:04.58` The 7 steps every real project follows, one example from start to finish, and the mistake most beginners make. Save this one!

**S2 · Hook** (0:12.68–0:28.59)
- `0:12.98` Everyone thinks machine learning is about choosing the perfect algorithm.
- `0:17.03` In real jobs, training the model is maybe 10% of the work. The other 90%? Everything around it.
- `0:23.84` Let's build one project, step by step: predicting flat prices in Pune.

**S3 · Step 1: define the problem** (0:28.59–0:42.18)
- `0:28.89` Step 1: define the problem.
- `0:30.86` What exactly do we predict? The price of a flat, in lakhs. That's a number, so it's a regression problem.
- `0:36.85` And how will we judge success? Say, our predictions should be within 5 lakh on average.

**S4 · Step 2: collect data** (0:42.18–0:53.34)
- `0:42.48` Step 2: collect data.
- `0:44.24` We gather past sales: area, bedrooms, location, age of the building, and the price each flat actually sold for. Say, 10,000 flats.

**S5 · Step 3: clean the data** (0:53.34–1:11.79)
- `0:53.64` Step 3, the biggest one: clean the data.
- `0:56.11` Real data is messy. Some rows have missing prices. Some flats are listed twice. Someone typed the area as 12,000 instead of 1,200.
- `1:05.60` We fill or remove the gaps, delete duplicates and fix the typos. Garbage in, garbage out.

**S6 · Step 4: explore** (1:11.79–1:22.23)
- `1:12.09` Step 4: explore the data.
- `1:14.00` We plot it and look for patterns. Bigger flats cost more. Flats near the IT parks cost more. Older buildings cost a little less.

**S7 · Step 5: split** (1:22.23–1:36.40)
- `1:22.53` Step 5, the one beginners skip: split the data.
- `1:25.54` We hide 20% of the flats away. The model learns from the other 80% only.
- `1:30.79` Why? It's like an exam. If you've already seen the question paper, a high score proves nothing.

**S8 · Step 6: train** (1:36.40–1:46.71)
- `1:36.70` Step 6: train the model.
- `1:38.46` On the 8,000 training flats, the model guesses, measures its error, and adjusts, again and again, exactly like we saw on Day 1.

**S9 · Step 7: evaluate and deploy** (1:46.71–2:04.03)
- `1:47.01` Step 7: evaluate, then deploy.
- `1:49.40` Now the exam: the 2,000 hidden flats. The model's predictions are off by 4 lakh on average. Our target was 5. Passed!
- `1:57.64` So we put it in an app, and keep watching it. Prices change, so the model is retrained every few months.

**S10 · Remember this** (2:04.03–2:13.96)
- `2:04.33` So remember the 7 steps: define, collect, clean, explore, split, train, evaluate and deploy.
- `2:10.61` Save this. It's the map for the next 97 days.

**S11 · Poll, teaser and CTA** (2:13.96–2:28.53)
- `2:14.31` Your turn: a model scores 99%, but it was tested on the same data it trained on. What's the problem? Vote in the caption poll!
- `2:22.98` Tomorrow, Day 4: how to clean messy data.
- `2:25.81` Follow for data science made simple!

total 148.53

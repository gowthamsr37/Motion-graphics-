# 100 Days of ML · Day 3: Your First ML Project, the Real Way

The user's direction: "practical" means the **real problems data scientists face at each step**, not Python code. Every step is named by its proper term (problem definition, data collection, data cleaning, exploratory data analysis (EDA), train-test split, model training, model evaluation, deployment), shows THE REAL PROBLEM and then WHAT YOU DO. One Bangalore flat-price project runs throughout. The checklist is in the house navy style (the user rejected the white card). Statistics house style; ocean-blue series cover `MLCover day={3}`. About 2:43. Deliverables in `out/`: `ML_Day_03_First_Project.mp4`, `ML_Day_03_First_Project_Cover.png`, `.srt`; caption in `CAPTION.md`.

Components: `src/components/StepScene.tsx` (the step layout: 8-step bar, THE TERM tag, headline, red REAL PROBLEM panel, green WHAT YOU DO panel) and `src/components/Steps.tsx`.

## Storyboard

1. **Title card** (frame 0): DAY 3 / 100, "Your First ML PROJECT · the real way", the 8 terms, "+ THE REAL PROBLEM AT EVERY STEP", SAVE THIS ONE.
2. **Hook:** COURSES (clean table, happy ending) vs REAL PROJECTS (messy table); PREDICT FLAT PRICES in Bangalore, and what actually goes wrong.
3. **Problem definition:** "predict flat prices." that's it → a vague ask: for whom (buyers · sellers · a bank), how accurate? → ask first, agree on within Rs 8 lakh.
4. **Data collection:** never in one place (site A · site B · broker sheet), half have no price, ASKING ≠ SOLD → combine sources, note what each measures.
5. **Data cleaning:** "2 BHK" / "2bhk" / "two bedroom", 1,200 sq ft vs 111 sq m, same flat × 3 brokers → standardise, de-duplicate, flag.
6. **EDA:** price line jumps +30% after the metro opens: real or a data error? → check with market experts.
7. **Train-test split:** 36 monthly bars; a random mix (wrong) vs the latest months as test → test on recent data.
8. **Model training:** a score shooting to 99%; DAYS ON MARKET (known only after the sale) → DATA LEAKAGE; removed → honest 88%.
9. **Model evaluation:** overall Rs 7L fine, but luxury villas Rs 40L and new areas Rs 25L off → check group by group.
10. **Deployment:** an error line creeping up after interest rates change → MODEL DRIFT → monitor + retrain.
11. **The real checklist** (navy panel): 8 rows, term + habit, ticking on their words; SAVE THIS.
12. **Poll + teaser + end card:** what takes most time? A building models · B cleaning data · C slides · D meetings (answer B); TOMORROW · DAY 4: CLEANING DATA, HANDS-ON; follow card.

## Accuracy notes

The project and its numbers are illustrative. "Cleaning takes most of the time" reflects practitioner surveys (often quoted at 45–80%), not an exact figure.

## Voiceover script

**S1 · Title card** (0:00.00–0:10.76)
- `0:00.20` Day 3 of 100 Days of Machine Learning: your first ML project, the real way.
- `0:05.58` 8 steps, and the real problems data scientists face at every one. Save this one!

**S2 · Hook** (0:10.76–0:21.58)
- `0:11.05` Courses give you clean data and a happy ending. Real projects don't.
- `0:15.30` Let's follow one real project, predicting flat prices in Bangalore, and see what actually goes wrong.

**S3 · Problem definition** (0:21.58–0:38.25)
- `0:21.88` Step 1, problem definition. Your manager says: predict flat prices. That's it.
- `0:27.22` The real problem: a vague ask. Prices for whom? Buyers, sellers, or a bank? And how accurate is good enough?
- `0:33.81` So you ask questions first, and agree on success: say, within 8 lakh.

**S4 · Data collection** (0:38.26–0:54.08)
- `0:38.55` Step 2, data collection. The data you need is never in one place.
- `0:42.97` Listings sit on different websites. Half have no price. And most are asking prices, not what flats actually sold for.
- `0:50.44` So you combine sources, and note what each one really measures.

**S5 · Data cleaning** (0:54.08–1:13.30)
- `0:54.38` Step 3, data cleaning. This is where most of your time goes.
- `0:58.15` "2 BHK", "2bhk" and "two bedroom", all meaning the same thing. Area in sq ft and sq m. And the same flat, posted by 3 different brokers.
- `1:08.56` You standardise everything, remove duplicates, and flag anything suspicious.

**S6 · EDA** (1:13.30–1:28.69)
- `1:13.60` Step 4, exploratory data analysis. You plot everything, and find surprises.
- `1:18.76` Prices near one new metro station jumped 30% in a year. Is that real, or a data error?
- `1:24.92` So you check with people who know the market before trusting a pattern.

**S7 · Train-test split** (1:28.69–1:39.96)
- `1:28.99` Step 5, the train-test split. The trap: mixing old and new sales together.
- `1:34.02` Prices keep rising, so you test on the most recent months, exactly how the model will be used.

**S8 · Model training** (1:39.96–1:52.78)
- `1:40.26` Step 6, model training. The model scores amazingly well. Too well.
- `1:44.63` It was using days on market, which you only know after the flat sells. That's called data leakage. Remove it, and you get an honest score.

**S9 · Model evaluation** (1:52.78–2:04.54)
- `1:53.08` Step 7, model evaluation. The average error looks fine.
- `1:57.01` But for luxury villas and brand new areas, it's way off. So you check accuracy group by group, not just the overall number.

**S10 · Deployment** (2:04.54–2:15.93)
- `2:04.84` Step 8, deployment. The model goes live. 6 months later, interest rates change, and predictions slowly go wrong.
- `2:12.11` That's model drift. So you monitor it, and retrain regularly.

**S11 · The real checklist** (2:15.93–2:31.87)
- `2:16.23` So here's the real checklist.
- `2:18.00` Ask before you build. Know your sources. Clean everything. Question every pattern. Test on recent data. Watch for leakage. Check every group. Monitor after launch.
- `2:28.86` Save this. This is what the job really looks like.

**S12 · Poll, teaser and CTA** (2:31.87–2:42.88)
- `2:32.22` Your turn: what takes most of a data scientist's time? Vote in the caption poll!
- `2:37.03` Tomorrow, Day 4: cleaning messy data, hands-on.
- `2:40.16` Follow for data science made simple!

total 162.88

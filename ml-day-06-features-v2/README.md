# 100 Days of ML · Day 6 (remake): Features & Labels

Remake of `ml-day-06-features/` (user: the original flopped; no Bangalore price hook; narrate like the hits, e.g. `hypothesis-testing-v2/`, `treating-outliers/`). Pattern taken from those hits: an everyday puzzle hook, the interview definition + plain words, simple everyday examples, an analogy, one running example (will a student pass?), short conversational lines, an easy quiz. About 2:40. Cover: template v2 (`MLCover2`), "FEATURES & LABELS". Deliverables in `out/`: `ML_Day_06_Features_Labels.mp4`, `ML_Day_06_Features_Labels_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Hook (user picked option #1):** the question paper, the answer key slides out beside it, 100 / 100, then a CHEATING? stamp: ML models can cheat like this and most beginners never notice.
2. **Title + interview definition:** FEATURES + LABELS; definitions; FEATURES = CLUES, LABEL = ANSWER.
3. **Every model has this pair:** Swiggy delivery time · spam filter · will a student pass?
4. **Doctor analogy** + the 5 tests.
5–9. **Tests** (student example): known in time (re-exam fee → data leakage) · related (roll number) · duplicate (hrs/day vs hrs/week) · changes (same school) · fair (caste/religion/gender; pin code proxy).
10. **Built features** (DOB → age, login times → late-night study) + checklist + SAVE THIS.
11. **Quiz** (cancel subscription → B) + teaser DAY 7: MISSING VALUES + follow card.

## Accuracy notes

All student data is illustrative.

## Voiceover script

**S1 · Hook (frame 0)** (0:00.00–0:10.39)
- `0:00.15` Your teacher gives you the question paper and the answer key together. You'd score 100.
- `0:05.38` Machine learning models can cheat exactly like this, and most beginners never notice.

**S2 · Definition + title** (0:10.39–0:31.41)
- `0:10.69` Day 6 of 100 Days of Machine Learning: features and labels.
- `0:14.81` Here's the textbook definition, the one to use in interviews. Features are the input variables a model uses to make a prediction. The label, also called the target, is the output it learns to predict.
- `0:27.39` In plain words: features are the clues, the label is the answer.

**S3 · Every model has this pair** (0:31.41–0:52.52)
- `0:31.71` Every model has this pair.
- `0:33.29` Swiggy delivery time: distance, rain and traffic are features. The minutes taken is the label.
- `0:39.11` A spam filter: links, words like free, and the sender are features. Spam or not is the label.
- `0:45.27` And our example today: will a student pass? Hours studied and attendance are features. Pass or fail is the label.

**S4 · The doctor analogy** (0:52.52–1:05.78)
- `0:52.82` It's like a doctor. Fever, cough and test results are the features. The diagnosis is the label. Better clues, better diagnosis.
- `1:01.14` But not every clue is a good one. Here are 5 tests every feature must pass.

**S5 · Test 1: known in time** (1:05.78–1:20.01)
- `1:06.08` Test 1: would you know it before you predict?
- `1:08.64` Imagine predicting pass or fail using re-exam fee paid. Only students who failed pay it. The model looks brilliant, but it's reading the answer. This is called data leakage.

**S6 · Test 2: related** (1:20.01–1:31.57)
- `1:20.31` Test 2: is it actually related?
- `1:22.45` Roll number has nothing to do with passing. But with enough data, the model finds fake patterns in it. If there's no real reason it matters, leave it out.

**S7 · Test 3: not a duplicate** (1:31.57–1:40.94)
- `1:31.87` Test 3: is it a duplicate?
- `1:33.78` Study hours per day and study hours per week say the same thing twice. The model can't tell which one matters. Keep one.

**S8 · Test 4: it changes** (1:40.94–1:51.52)
- `1:41.24` Test 4: does it change?
- `1:42.89` If every student is from the same school, the school column is identical in every row. A clue that never changes can't explain anything.

**S9 · Test 5: fair** (1:51.52–2:03.26)
- `1:51.82` Test 5: is it fair?
- `1:53.36` Never use caste, religion or gender to decide things like loans or admissions, even if they seem to help. And watch for hidden stand-ins, like a pin code.

**S10 · Built features + summary** (2:03.26–2:21.38)
- `2:03.56` And the best features are often built, not found. Date of birth becomes age. Login times become late night study.
- `2:10.66` So remember: the label is the answer, features are the clues, and every clue must be known in time, related, not a duplicate, changing, and fair.
- `2:19.32` Save this for your next project.

**S11 · Quiz, teaser and CTA** (2:21.38–2:35.65)
- `2:21.73` Quick quiz! An app predicts whether a customer will cancel their subscription. Which one is the label? Vote in the caption poll!
- `2:29.11` Tomorrow, Day 7: missing values, the silent model killer.
- `2:32.93` Follow for data science made simple!

total 155.652

## Rebuild

```bash
cp -al ../ml-day-08-encoding/node_modules .
python scripts/gen-voice.py --model <kokoro> --whisper <whisper-small-en>
node scripts/gen-audio.mjs
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

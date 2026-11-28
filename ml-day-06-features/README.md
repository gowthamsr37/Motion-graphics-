# 100 Days of ML · Day 6: Features, Labels + the 6 Tests

Hook-first: frame 0 shows a "Bangalore flat price model, 99% accuracy" card (series strip visible from frame 0); "completely useless. Can you spot why?" The reveal: STAMP DUTY PAID was an input, calculated from the sale price, so the model was reading the answer. Then the title, the words (label/target vs features, asking vs sold price), and 6 practical feature tests (each `StepScene`: THE TERM, the question, THE REAL PROBLEM, the rule). Then built features + the navy checklist, poll and teaser. Statistics house style; ocean-blue cover `MLCover day={6}` ("99% ACCURATE. USELESS. WHY?"). About 2:31. Deliverables in `out/`: `ML_Day_06_Features.mp4`, `ML_Day_06_Features_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Hook:** model card, accuracy counts to 99%; USELESS stamp; can you spot why?
2. **Reveal + title:** inputs area · bedrooms · locality · STAMP DUTY PAID (flagged); stamp duty = a % of the sale price → IT WAS READING THE ANSWER; doesn't exist before the sale; "Features + Labels · the 6 tests" with the 6 terms.
3. **The words:** flats table, PRICE column = LABEL (target), the rest = FEATURES; check the label: ASKING PRICE vs SOLD PRICE.
4. **Data leakage:** stamp duty · days on market · final discount, known only after the sale.
5. **Relevance:** listing ID, broker's phone number → fake patterns in noise.
6. **Redundancy:** 1,200 sq ft = 111 sq m → keep one version.
7. **Missingness:** parking type 70% blank → drop or keep a flag.
8. **Low variance:** city = Bangalore in every row → remove constant columns.
9. **Fairness + proxies:** religion / caste struck; watch proxies; couldn't defend it in public → don't use it.
10. **Built, not found + checklist:** BUILD YEAR → AGE, ADDRESS → METRO DISTANCE; 6 tests ticking; SAVE THIS.
11. **Poll + teaser + end card:** best feature? A listing ID · B stamp duty paid · C distance to metro · D city name (answer C); TOMORROW · DAY 7: MISSING VALUES; follow card.

## Accuracy notes

Stamp duty in Karnataka is charged as a percentage of the property's value, so it encodes the price. Numbers are illustrative.

## Voiceover script

**S1 · Hook (frame 0)** (0:00.00–0:07.77)
- `0:00.15` This model predicts Bangalore flat prices with 99% accuracy.
- `0:04.98` And it's completely useless. Can you spot why?

**S2 · Reveal + title** (0:07.77–0:26.69)
- `0:08.07` One of its inputs was the stamp duty paid. Stamp duty is calculated from the sale price. So the model was secretly reading the answer.
- `0:16.34` Before the flat is sold, that number doesn't even exist.
- `0:19.58` Day 6 of 100 Days of Machine Learning: features, labels, and the 6 tests every good feature must pass.

**S3 · Features vs label** (0:26.69–0:44.68)
- `0:26.99` First, the words. The label, also called the target, is what you want to predict: the price.
- `0:32.41` Features are the inputs the model uses to predict it: area, bedrooms, locality, age.
- `0:38.11` And check the label too. Asking price or sold price? Predict the wrong one and everything after is wrong.

**S4 · Test 1: available in time** (0:44.68–0:58.99)
- `0:44.98` Test 1: will you know it at prediction time?
- `0:47.50` Stamp duty, days on market, final negotiated discount: all known only after the sale. Using them is data leakage.
- `0:55.41` Rule: if you won't have it when you predict, it can't be a feature.

**S5 · Test 2: actually related** (0:58.99–1:11.64)
- `0:59.29` Test 2: is it actually related to the label?
- `1:01.98` Listing ID number, or the broker's phone number. With enough rows, the model finds fake patterns in pure noise.
- `1:08.53` Rule: there should be a real reason it affects the price.

**S6 · Test 3: not a duplicate** (1:11.65–1:25.02)
- `1:11.95` Test 3: is it a duplicate?
- `1:13.86` Area in square feet and area in square metres are the same information twice. The model gets confused about which one matters.
- `1:21.67` Rule: keep one version of each piece of information.

**S7 · Test 4: filled in enough** (1:25.02–1:36.50)
- `1:25.32` Test 4: is it filled in enough?
- `1:27.25` Parking type is blank for 70% of flats. Filling in that much would be mostly guessing.
- `1:32.79` Rule: drop it, or keep just a has parking info flag.

**S8 · Test 5: actually varies** (1:36.50–1:48.55)
- `1:36.80` Test 5: does it actually vary?
- `1:38.79` City equals Bangalore, in every single row. A column that never changes can't explain anything.
- `1:45.20` Rule: remove constant and almost constant columns.

**S9 · Test 6: fair and legal** (1:48.55–2:01.95)
- `1:48.85` Test 6: is it fair and legal?
- `1:50.93` Never use things like the owner's religion or caste, even if they seem to correlate. And watch for proxies that sneak them back in.
- `1:58.77` Rule: if you couldn't defend it in public, don't use it.

**S10 · The feature checklist** (2:01.95–2:18.82)
- `2:02.25` And remember, the best features are often built, not found. Build year becomes age. An address becomes distance to the nearest metro.
- `2:10.47` So, the 6 tests: available in time, related, not duplicate, filled in, varies, and fair.
- `2:16.24` Save this, and run every feature through it.

**S11 · Poll, teaser and CTA** (2:18.82–2:31.09)
- `2:19.17` Your turn: which of these is the best feature for predicting a flat's price? Vote in the caption poll!
- `2:24.99` Tomorrow, Day 7: handling missing values, in depth.
- `2:28.37` Follow for data science made simple!

total 151.094

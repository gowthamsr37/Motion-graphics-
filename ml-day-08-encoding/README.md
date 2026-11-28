# 100 Days of ML · Day 8: Encoding Categories (the complete guide)

Hook-first: frame 0 shows Bangalore localities coded 1 to 5 (Whitefield 1 … Koramangala 5); the model decides "Koramangala = 5× Whitefield". Reveal: they were name tags, but the model did maths (Whitefield + Whitefield = Hebbal). Title card ENCODING CATEGORIES · 2 kinds · 6 methods · 1 trap with all 6 terms; nominal vs ordinal; the beginner mistake (label encoding: fake distances fool linear models / KNN); 6 methods as `CleanStep` BEFORE → AFTER scenes; the target-encoding leakage trap; navy decision guide + SAVE THIS; poll and teaser. Statistics house style; ocean-blue cover `MLCover day={8}` titled "ENCODING CATEGORIES". About 2:57. Deliverables in `out/`: `ML_Day_08_Encoding.mp4`, `ML_Day_08_Encoding_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Hook:** locality → code table; KORAMANGALA = 5× WHITEFIELD.
2. **Reveal + title:** name tags; Whitefield + Whitefield = Hebbal (1 + 1 = 2); title, pills, 6 jargon chips.
3. **Nominal vs ordinal.**
4. **The beginner mistake:** label encoding on a number line, "distance = 4"; linear / KNN fooled, trees cope better.
5. **Ordinal encoding** (alphabetical 0/1/2 vs your order) · 6 **one-hot** · 7 **drop one / dummy variable trap** (k − 1) · 8 **rare-label grouping** (OTHER) · 9 **target encoding** (avg Rs / sq ft, smoothed) · 10 **unknown categories** (map to OTHER).
11. **The trap:** target averages from TRAIN only, out-of-fold; whole dataset → the model peeks at test answers.
12. **Decision guide** + SAVE THIS.
13. **Poll + teaser + end card:** furnishing → A one-hot · B ordinal · C target · D drop (answer B); TOMORROW · DAY 9 · FEATURE SCALING.

## Accuracy notes

Label-encoded nominal features impose a false order/distance on linear models and distance-based models; tree models split on thresholds and suffer less. Drop-one (k − 1 dummies) avoids perfect multicollinearity with an intercept. Target encoding must be fitted on training folds (out-of-fold) with smoothing. Prices are illustrative.

## Voiceover script

**S1 · Hook (frame 0)** (0:00.00–0:09.96)
- `0:00.15` We turned Bangalore localities into numbers. Whitefield 1, up to Koramangala 5.
- `0:05.97` And our model decided Koramangala is 5 times Whitefield.

**S2 · Reveal + title** (0:09.96–0:26.37)
- `0:10.26` Those numbers were just name tags, but the model did maths on them. To it, Whitefield plus Whitefield equals Hebbal.
- `0:17.41` Day 8 of 100 Days of Machine Learning: encoding categories. 2 kinds of categories, 6 methods, and the trap that leaks your answers.

**S3 · Nominal vs ordinal** (0:26.37–0:41.68)
- `0:26.67` Models only understand numbers, so every text column needs encoding. First, know which kind you have.
- `0:33.16` Nominal: no order, like locality or facing direction. Ordinal: a real order, like unfurnished, semi furnished, fully furnished.

**S4 · The beginner mistake: label encoding** (0:41.68–0:55.31)
- `0:41.98` The beginner move is label encoding: give each category a number.
- `0:45.79` On localities, that invents a fake order. Linear models and KNN treat the gaps as real distances. Tree models cope better, but don't count on it.

**S5 · Method 1: ordinal encoding** (0:55.31–1:06.23)
- `0:55.61` Method 1: ordinal encoding.
- `0:57.69` For ordered categories, set the order yourself. Unfurnished 0, semi 1, fully 2. Never let the computer sort them alphabetically.

**S6 · Method 2: one-hot encoding** (1:06.23–1:17.17)
- `1:06.53` Method 2: one-hot encoding.
- `1:08.64` For localities, make one column per locality. A 1 where it matches, 0s everywhere else. No fake order, no fake distances.

**S7 · Method 3: drop one column** (1:17.17–1:30.33)
- `1:17.47` Method 3: drop one column.
- `1:19.54` If every other column is 0, you already know it's the last one. So for linear regression, keep k minus 1 columns. Skip this, and you fall into the dummy variable trap.

**S8 · Method 4: group the rare ones** (1:30.33–1:43.67)
- `1:30.63` Method 4: group the rare ones.
- `1:32.69` Bangalore has over 200 localities. One-hot gives you 200 mostly empty columns. Keep the common ones, and group localities with only a few listings into OTHER.

**S9 · Method 5: target encoding** (1:43.67–1:57.18)
- `1:43.97` Method 5: target encoding.
- `1:45.98` Replace each locality with its average price per sq ft. One powerful column instead of 200. Smooth it, so a locality with 2 listings doesn't get an extreme value.

**S10 · Method 6: unseen categories** (1:57.18–2:09.13)
- `1:57.48` Method 6: plan for unseen categories.
- `2:00.24` Next month, a listing arrives from a brand new locality your model has never seen. Map unknowns to OTHER, or your code crashes in production.

**S11 · The trap** (2:09.13–2:23.74)
- `2:09.44` Now the trap that leaks your answers.
- `2:11.35` Target encoding uses the price, the very thing you predict. Calculate the averages on training data only, ideally out of fold. Use the whole dataset, and the model peeks at the test answers.

**S12 · The decision guide** (2:23.74–2:41.60)
- `2:24.04` So here's the decision guide.
- `2:25.72` Ordered? Ordinal encoding. Few categories? One-hot, and drop one for linear models. Too many? Group the rare ones, or target encode. Always handle unseen categories. And fit on training data only.
- `2:38.96` Save this. You'll need it in every project.

**S13 · Poll, teaser and CTA** (2:41.60–2:56.81)
- `2:41.95` Your turn: furnishing is unfurnished, semi or fully furnished. Which encoding fits best? Vote in the caption poll!
- `2:49.18` Tomorrow, Day 9: feature scaling, and why square feet shouts over bedrooms.
- `2:54.09` Follow for data science made simple!

total 176.806

## Rebuild

```bash
cp -al ../ml-day-07-missing/node_modules .   # or npm install
python scripts/gen-voice.py --model <kokoro> --whisper <whisper-small-en>
node scripts/gen-audio.mjs
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

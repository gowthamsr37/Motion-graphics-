# 100 Days of Machine Learning: Trailer

The trailer that announces **100 Days of Machine Learning**, the series that follows the statistics series on **@curious_datascientist**. 1:08, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It tells viewers what they will learn: the full 100-day roadmap in ten blocks with day ranges and topics, the four projects they'll build, and who the series is for. It ends on **COMING SOON**, TURN ON NOTIFICATIONS and the series end card (NEXT: DAY 1: WHAT IS ML?).

It uses the locked house style for the video (navy theme, fonts, voice, score, mix, subtitles, follow ending). A trailer has nothing to test, so there is **no quiz**.

**ML-series cover rule (asked for by the user):** covers for the machine-learning videos use a **deep plum background** (`ML.bg #12051F` → `ML.bg2 #240A3D`, with magenta `#D946EF` and orange `#F97316` glows). This keeps them visibly different from the navy statistics covers. The palette and the `MLBackdrop` layer are in `src/components/ML.tsx` and `src/Cover.tsx`.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `ML_Trailer_100_Days.mp4` | the finished trailer |
| `ML_Trailer_100_Days_Cover.png` | 1080×1920 **plum** cover: NEW SERIES tag, a big yellow 100, DAYS OF, MACHINE LEARNING (cyan → pink → orange gradient), six topic tiles that show the series is broader than deep learning (REGRESSION · CLASSIFICATION · DECISION TREES · CLUSTERING · RANDOM FOREST · DEEP LEARNING), ...AND 90+ MORE TOPICS, a COMING SOON pill, @curious_datascientist |
| `ML_Trailer_100_Days.srt` | the on-screen subtitle pages |

The Instagram caption, with the full roadmap in text, is in [`CAPTION.md`](CAPTION.md).

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:05 | **Hook** | YOU HAVE LEARNED: three statistics cards (bell curve, binomial bars, chi-square) tick green, then **STATISTICS DONE**. They lift away as **NOW: MACHINES THAT LEARN** pops and a neural network builds layer by layer, with pulses running through it. |
| 2 | 0:05–0:13 | **Title** | **100** rolls up from 1, then **DAYS OF** and **MACHINE LEARNING** (gradient) with a burst. Three chips on their words: 1 TOPIC A DAY · EXPLAINED SIMPLY · ZERO TO REAL PROJECTS. |
| 3 | 0:13–0:28 | **Roadmap, days 1–44** | THE ROADMAP · DAYS 1–44. Five rows light up as named: **1–10 FOUNDATIONS** · **11–18 DATA PREP** · **19–26 REGRESSION** · **27–40 CLASSIFICATION** · **41–44 MODEL SELECTION**, each with its topics. |
| 4 | 0:28–0:45 | **Roadmap, days 45–100** | DAYS 45–100: **45–52 ENSEMBLES** · **53–62 UNSUPERVISED** · **63–70 REAL-WORLD ML** · **71–90 DEEP LEARNING** · **91–100 PROJECTS** (4 end-to-end builds · interview prep). |
| 5 | 0:45–0:52 | **What you'll build** | REAL PROJECTS: four cards land on their words: **HOUSE PRICES** (regression), **CUSTOMER CHURN** (classification), **SPAM FILTER** (text), **IMAGE CLASSIFIER** (deep learning). |
| 6 | 0:52–0:59 | **Who it's for** | **NO PhD NEEDED** · JUST A FEW MINUTES A DAY (clock), then chips **BEGINNERS** · **STUDENTS** · **INTERVIEW PREP**. |
| 7 | 0:59–1:08 | **Coming soon and CTA** | A **DAY 1** calendar card, **COMING SOON** with a burst, 100 DAYS OF MACHINE LEARNING, and a **TURN ON NOTIFICATIONS** pill whose bell rings. End card: NEXT: DAY 1: WHAT IS ML?, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips 100 days · 1 topic a day · Real projects · Follow. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "XGBoost" is read as *X-G boost*; "CNNs" is patched to keep its plural *s*.

**S1 · Hook** (0:00.00–0:04.90)
- `0:00.45` You've mastered the statistics.
- `0:02.44` Now, let's teach machines to learn.

**S2 · Title** (0:04.90–0:13.27)
- `0:05.20` Introducing: 100 Days of Machine Learning.
- `0:08.24` One topic a day. Explained simply. From zero to real projects.

**S3 · Roadmap, days 1–44** (0:13.27–0:27.94)
- `0:13.67` Here's everything you'll learn.
- `0:15.45` The foundations: how machines learn, overfitting, and gradient descent.
- `0:19.73` How to prepare your data.
- `0:21.25` Regression and classification, from linear regression to decision trees.
- `0:25.64` And how to pick the best model.

**S4 · Roadmap, days 45–100** (0:27.93–0:44.55)
- `0:28.34` Then the power tools: random forests and XGBoost.
- `0:31.71` Clustering and PCA, to find hidden patterns.
- `0:34.95` Real-world skills, like forecasting and recommendations.
- `0:38.63` And deep learning: neural networks, CNNs, transformers, and large language models.

**S5 · What you'll build** (0:44.55–0:52.30)
- `0:44.95` Then we'll build real projects together:
- `0:47.21` house prices, customer churn, a spam filter, and an image classifier.

**S6 · Who it's for** (0:52.31–0:59.40)
- `0:52.71` No PhD needed. Just a few minutes a day.
- `0:55.79` Perfect for beginners, students, and interview prep.

**S7 · Coming soon and CTA** (0:59.40–1:07.98)
- `0:59.80` Day one is coming soon.
- `1:01.43` Turn on notifications, so you don't miss a single day.
- `1:04.66` Follow for data science made simple!

## The roadmap (as agreed with the user)

| Days | Block | Topics |
| --- | --- | --- |
| 1–10 | Foundations | What is ML · supervised / unsupervised / reinforcement · workflow · features and labels · train/validation/test · overfitting · bias–variance · loss · gradient descent · learning rate |
| 11–18 | Data prep | Missing values · encoding · scaling · feature engineering · selection · leakage · imbalance · recap |
| 19–26 | Regression | Simple and multiple linear · assumptions · polynomial · Ridge / Lasso / Elastic Net · metrics · recap |
| 27–40 | Classification | Logistic · confusion matrix · precision / recall / F1 · ROC-AUC · KNN · Naive Bayes · decision trees · entropy and Gini · SVM · kernels · recap |
| 41–44 | Model selection | Cross-validation · hyperparameter tuning · pipelines · choosing a model |
| 45–52 | Ensembles | Bagging vs boosting · random forest · AdaBoost · gradient boosting · XGBoost / LightGBM / CatBoost · stacking · recap |
| 53–62 | Unsupervised | K-means · choosing K · hierarchical · DBSCAN · PCA · t-SNE / UMAP · anomaly detection · association rules · recap |
| 63–70 | Real-world ML | Time series · recommenders · explainability (SHAP) · deployment · drift and monitoring |
| 71–90 | Deep learning | Neurons · activations · backprop · optimizers · regularisation · CNNs · RNNs / LSTMs · embeddings · attention and transformers · transfer learning · LLMs |
| 91–100 | Projects and finale | House prices · churn · spam filter · image classifier · interview questions · ML cheat sheet |

## Audio

Same score engine and kit as the series, re-timed for a trailer:
- intro under the statistics recap (pops, a ding on "statistics", a whoosh and blips as the network builds);
- the drop, impact and chime on "Machine Learning", with ticks as the 100 rolls up;
- a groove under the roadmap (a whip per part, a step tone per row);
- build under the projects (a crash on entry, a pop per card) and the audience chips;
- a riser, impact and crash on "COMING SOON", a lifted chord and a ding under "turn on notifications";
- the standard follow-button finale.

There is no quiz countdown. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `distributions-guide/` (`REF=distributions-guide bash .claude/skills/data-science-explainer/new-video.sh ml-trailer MLTrailer ML_Trailer_100_Days`). It adds `src/components/ML.tsx`: the ML cover palette, `NeuralNet`, `RoadRow`, the envelope / image / user / bell icons and `Chip`. The plum cover background is `MLBackdrop` in `src/Cover.tsx`.

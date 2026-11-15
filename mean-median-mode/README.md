# Mean, Median & Mode Explained in 2 Minutes

The second **Data Science Made Simple** Reel: 104 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It is built in Remotion on the series house style, unchanged from *Types of Data*:
- the same deep-navy studio look and four-accent colour code;
- Sora, Inter and JetBrains Mono;
- the Kokoro `af_heart` narrator at 1.05×;
- the same word-synced subtitles;
- the 112 BPM F-major synthesized score and SFX kit;
- the same mix and master;
- the quiz + "Follow for data science made simple!" ending.

See `.claude/skills/data-science-explainer/SKILL.md`.

One running example carries the whole video: **five friends and their cups of chai (5, 2, 8, 2, 3)**. Every idea is demonstrated with real cups being poured, shared, sorted and counted.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Mean_Median_Mode_Explained.mp4` | the finished Reel |
| `Mean_Median_Mode_Explained_Cover.png` | 1080×1920 cover: MEAN / MEDIAN / MODE · explained in 2 minutes, over a skewed dot plot where the three land apart |
| `Mean_Median_Mode_Explained.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Data / central tendency | white-blue orb |
| **Mean** | cyan |
| **Median** | green |
| **Mode** | violet (the categorical colour from *Types of Data*, fitting since the mode works on categories) |
| **Outlier** | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:12 | **Hook** | Class-test bars rise and an average line drops to **AVG 78**. Whip-pan to five people with salary tags; the middle one lights up as **TYPICAL ₹45K**, and a ₹4L tag in orange foreshadows outliers. Whip-pan to shoe boxes stacked by size, where a crown drops on **SIZE 8**. Headline stack: YOUR CLASS AVERAGE, / A TYPICAL SALARY, / THE POPULAR SIZE… Everything collapses into three identical badges: **ALL THREE FIND THE CENTRE.** The badges turn cyan / green / violet with ≠ between them: **BUT THEY DON'T ALWAYS AGREE!** They merge into the DATA orb. |
| 2 | 0:12–0:20 | **Big picture** | Data dots pile into a dot plot whose centre column glows (**CENTRAL TENDENCY**). The orb branches into **MEAN** (fair share), **MEDIAN** (the middle) and **MODE** (most common). The camera zooms into MEAN. |
| 3 | 0:20–0:35 | **Mean** | Five friends' cup stacks build on the spoken numbers 5, 2, 8, 2, 3. Every cup arcs into a kettle (`5 + 2 + 8 + 2 + 3 = 20`, with a counter). The kettle deals them back round-robin: `20 ÷ 5 = 4`. A fair-share level line appears and every label becomes 4: **MEAN = 4**. |
| 4 | 0:35–0:49 | **Median** | The friends swap places into order 2, 2, 3, 5, 8. Each stack lights up as it's spoken. Arrows close in from both ends, crossing off pairs, and the middle stack gets a green crown: **MEDIAN = 3**. Even count: cards 2 3 5 8, a bracket over 3 and 5, a diamond **4** dropping between them, and `(3 + 5) ÷ 2 = 4`. |
| 5 | 0:49–1:00 | **Mode** | Frequency tags (×2, ×1, ×1, ×1). The two 2-stacks step together and a violet crown drops: **MODE = 2**. Categories: chai-flavour votes (masala 6, ginger 4, elaichi 2), with a crown on **MASALA**, and mean ✗ · median ✗ · mode ✓ for categories. |
| 6 | 1:00–1:13 | **Outlier twist** | Readouts: MEAN 4.0 · MEDIAN 3 · MODE 2. One friend's stack grows from 8 to **38** while the chart zooms out (OUTLIER tag, impact and shake). The mean line rolls up from **4 to 10**. The median stack gets a green ring with **3 ✓ SAME**. Then **SALARIES → MEDIAN**. |
| 7 | 1:13–1:25 | **Complete picture** | Central tendency → three cards, each landing on its spoken word: what it is, how to find it, **BEST FOR** (balanced data / when there are outliers / works for categories), and the chai answer (4, 3, 2). Pulses travel the tree and a shine sweeps the cards. |
| 8 | 1:25–1:44 | **Quiz + CTA** | QUICK QUIZ: cards 7 2 9 4 3 flip in as they're spoken, "What's the MEDIAN?", and four options (9, 5, 4, 7). The 5-second countdown ring runs green → red. The reveal is **MEDIAN = 4** with confetti; the unsorted middle "9" is struck ("unsorted middle") and so is "5" ("that's the mean"). The cards sort into 2 3 4 7 9 and the crown lands on 4: SORT FIRST, THEN PICK THE MIDDLE. The end card has the FOLLOW button tap, "for data science MADE SIMPLE." and Mean · Median · Mode · Outliers chips. |

## Voiceover script (timestamps are on the finished video)

Narration is Kokoro TTS `af_heart` at 1.05× (US English). Pronunciation fixes: "masala" uses phonemes for an Indian-style *muh-SAA-laa*, and "centre" is voiced from "center" (the caption keeps "centre").

**S1 · Hook** (0:00.00–0:11.65)
- `0:00.45` Your class average.
- `0:02.08` A typical salary.
- `0:03.80` The most popular shoe size.
- `0:06.11` All three try to find the centre of your data.
- `0:08.97` But they don't always agree!

**S2 · The big picture** (0:11.65–0:19.92)
- `0:12.10` These are the three measures of central tendency.
- `0:14.86` The mean, the median, and the mode.
- `0:17.12` Let's meet them with one simple example.

**S3 · Mean** (0:19.92–0:34.91)
- `0:20.42` Five friends count their cups of chai this week.
- `0:23.25` Five, two, eight, two, and three.
- `0:25.28` The mean is the fair share.
- `0:26.95` Pour every cup together: that's twenty.
- `0:30.00` Now share them equally, and each friend gets four.
- `0:33.12` The mean is four.

**S4 · Median** (0:34.91–0:48.77)
- `0:35.41` The median is the middle value.
- `0:37.45` Line everyone up, from fewest cups to most.
- `0:40.71` Two, two, three, five, eight.
- `0:42.57` Three sits right in the middle.
- `0:44.57` With an even count, take the halfway point of the middle two.

**S5 · Mode** (0:48.77–1:00.05)
- `0:49.27` The mode is the most common value.
- `0:51.42` Two friends drink two cups, so the mode is two.
- `0:54.47` And it even works for categories, like the favourite chai flavour.
- `0:58.11` Masala wins!

**S6 · The outlier twist** (1:00.05–1:13.39)
- `1:00.50` Now, here's the twist.
- `1:02.02` One friend actually drinks thirty-eight cups.
- `1:05.26` The mean jumps from four to ten!
- `1:07.60` But the median stays at three.
- `1:09.68` That's why salaries are often reported as the median.

**S7 · The complete picture** (1:13.39–1:24.54)
- `1:13.84` Here's the complete picture.
- `1:15.53` Mean: the fair share, for balanced data.
- `1:18.04` Median: the middle, when there are outliers.
- `1:20.69` Mode: the most common, even for categories.

**S8 · Quiz and call to action** (1:24.54–1:44.37)
- `1:24.89` Quick quiz!
- `1:25.92` What's the median of seven, two, nine, four, and three?
- *(5-second countdown, music only)*
- `1:34.51` It's four!
- `1:35.58` Sort them first: two, three, four, seven, nine.
- `1:38.43` Four sits in the middle.
- `1:40.15` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Mean:** 5 + 2 + 8 + 2 + 3 = 20, and 20 ÷ 5 = 4. The pour-and-deal animation moves exactly 20 cups, and every friend ends with 4.
- **Median:** sorted, the values are 2, 2, 3, 5, 8, so the middle (3rd of 5) is 3. For an even count, the median is the mean of the two middle values: 2, 3, 5, 8 gives (3 + 5) ÷ 2 = 4.
- **Mode:** 2 appears twice and every other value once, so the mode is 2. The mode is the only one of the three that applies to unordered categories; chai flavours are nominal.
- **Outlier:** replacing 8 with 38 gives a sum of 5 + 2 + 38 + 2 + 3 = 50, so the mean is 50 ÷ 5 = 10. Sorted, 2, 2, 3, 5, 38 still has median 3 and mode 2. "Salaries are *often* reported as the median" is deliberately hedged: medians are the usual choice for skewed data like income.
- **Hook:** scores 62, 75, 88, 70, 95 average to 390 ÷ 5 = 78. In the salaries ₹25K, ₹32K, ₹45K, ₹60K, ₹4L, the middle is ₹45K. Shoe sizes 6–10 with counts 2, 3, 5, 3, 1 have the most boxes at size 8.
- **Quiz:** 7, 2, 9, 4, 3 sorts to 2, 3, 4, 7, 9, so the median is 4. The distractors are the classic mistakes: 9 is the middle *before sorting*, and 5 is the mean (25 ÷ 5).
- **Cover:** the dot-plot values 1–9 with counts 1, 7, 4, 3, 2, 1, 1, 1, 2 (n = 22) give mode 2, median 3 (the 11th and 12th values are both 3) and mean 88 ÷ 22 = 4. This is the typical right-skewed order, mode < median < mean.

## Audio

Same score engine and kit as the series (`scripts/gen-audio.mjs`), re-timed to this video. The arrangement:
- Hook: intro arps, then a riser into an impact on "find the centre".
- Big picture: groove.
- Mean: pluck groove.
- Median: calm "flow" with a gliding lead as the friends line up.
- Mode: playful marimba.
- Outlier: calm, then a riser into an impact and crash as 8 becomes 38, then the groove.
- Overview: build.
- Quiz: suspense countdown, then the finale.

One kit addition, **`clink.wav`** (a synthesized glass clink), plays for the chai cups. The mix and mastering are unchanged: music ducked under every line with `useDuck(0.5, 0.16)`, then limiter → two-pass loudnorm to −14 LUFS.

## Rebuild

```bash
npm install
# only if the narration changes (Python venv with kokoro-onnx, soundfile, faster-whisper):
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Visual timing is keyed to the spoken words in `src/timeline.json`. Re-voicing re-times the whole film, subtitles included. `reference/` holds the *Types of Data* scenes and script that this project was scaffolded from, for patterns only; they are not compiled.

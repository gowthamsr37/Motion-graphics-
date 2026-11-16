# How to Treat Outliers

The seventh **Data Science Made Simple** Reel for **@curious_datascientist**: 124 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It follows the Outliers Reel, which ended "So should you just delete them? Not so fast!", and covers all seven ways to treat an outlier. It starts from the one question that decides which treatment to use: **is it a mistake, or real but rare?**
- **Mistakes:** 1 fix it · 2 fill it in · 3 remove it (and note why).
- **Real but rare:** 4 cap it (winsorizing) · 5 transform it (log) · 6 use robust tools (median + IQR) · 7 keep it and study it.
- **The golden rule:** when unsure, run the analysis with and without the outlier and report both.

The user allowed a few seconds over the usual 100–120 s so every treatment gets a proper demo, so it runs 124 s across nine scenes. This is the first nine-scene project: `src/timing.ts` adds `s9`.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`):
- the deep-navy studio look and four-accent colour code;
- Sora, Inter and JetBrains Mono;
- the Kokoro `af_heart` narrator at 1.05×;
- word-synced subtitles;
- the 112 BPM F-major synthesized score and SFX kit;
- the same mix and master;
- the quiz + "Follow for data science made simple!" ending, with the page handle on the end card and the cover.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Treating_Outliers.mp4` | the finished Reel |
| `Treating_Outliers_Cover.png` | 1080×1920 cover: HOW TO TREAT OUTLIERS · explained in 2 minutes, ASK WHY FIRST → MISTAKE (fix it, fill it in, remove it) / REAL BUT RARE (cap it, transform it, robust tools, keep & study), @curious_datascientist |
| `Treating_Outliers.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Outliers, "dragged" results | orange |
| Mistakes and their treatments (fix, fill, remove) | violet |
| Real-but-rare and their treatments (cap, transform, robust, keep) | cyan |
| Corrected / kept / steady / right answer, the golden rule | green |
| Removed / impossible | red marks |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:12 | **Hook** | A dot plot with one ringed orange OUTLIER. JUST DELETE IT? A cursor drags it toward a bin, then a red **NOT SO FAST!** stamp slams and the dot springs back. DELETE THE WRONG ONE AND YOU LOSE THE STORY: the dot swells and glows, MAYBE YOUR MOST IMPORTANT POINT. Slam: a giant **7**, WAYS TO TREAT **OUTLIERS**. |
| 2 | 0:12–0:20 | **Ask why first** | STEP 0 · ASK WHY: a magnifier sweeps onto the orange dot ("why is it there?"). It becomes the header fork OUTLIERS → MISTAKES / REAL BUT RARE, with example cards (a typo: age 250, a sensor glitch, a test entry · a billionaire, a fraud payment, a festival spike). Then the seven numbered treatment chips drop in under their branch. |
| 3 | 0:20–0:36 | **Mistakes: fix · fill · remove** | A survey table (Riya 24, Arjun 31, Sana 250, Kabir 29, Meera 33, Dev −5, TEST_USER 999) with the bad cells in orange, and a counter pill **1/7 FIX IT → 2/7 FILL IT IN → 3/7 REMOVE IT**. **Fix:** the original form slides in (AGE: 25) and Sana's 250 turns into a green 25 ✓. **Fill:** MEDIAN OF VALID AGES (24 25 **29** 31 33) = 29 fills Dev's cell, and the row stays (ROW KEPT). **Remove:** TEST_USER is tagged TEST ACCOUNT, struck through and slid into the bin, then a dashed note lands: **LOG: removed TEST_USER (test account)**. |
| 4 | 0:36–0:51 | **Cap it** | The header switches to REAL BUT RARE; four option cards preview the real-outlier treatments. **4/7 CAP IT:** the commute data with picket IQR fences at **10** and **42**. The 60-minute jam slides back to the 42 fence (a cyan cap mark, a dashed ghost where it was): **60 → 42**, **MEAN 28.9 → 27.1 min**, STILL IN THE DATA ✓, A.K.A. WINSORIZING. |
| 5 | 0:51–1:03 | **Transform it** | **5/7 TRANSFORM IT** (usually with a log). A right-skewed salary histogram (orange tail) with the mean, DRAGGED BY THE TAIL, sitting right of the peak. A ladder of equally spaced ticks, ₹10K · ₹1L · ₹10L · ₹1Cr with ×10 arcs between them, shows the log scale. The tail squeezes in, the histogram reshapes into a balanced bell, and the mean slides to the middle: **MEAN = TYPICAL ✓** (great for salaries · house prices). |
| 6 | 1:03–1:17 | **Robust tools** | **6/7 ROBUST TOOLS:** LEAVE THE DATA ALONE → TOOLS THAT BARELY REACT TO EXTREMES. Top row (USE): **MEDIAN + IQR** on a dot plot; bottom row (INSTEAD OF): **MEAN ± SD**. The outlier slides out to 96 in both: the median and IQR box stay put (**STEADY ✓**) while the mean slides and the SD band balloons (**DRAGGED ✗**). |
| 7 | 1:17–1:28 | **Keep it and study it** | **7/7 KEEP & STUDY:** card payments by time of day. Everyday spending hugs the bottom (₹100 to ₹900); one **₹2,00,000 at 3:07 AM** sits far above. A magnifier circles it: **FRAUD?** THE OUTLIER IS THE STORY, then a checklist: FLAG IT ✓ · DIG IN ✓ · REPORT IT SEPARATELY ✓. |
| 8 | 1:28–1:43 | **Complete picture** | A decision tree, OUTLIER? ASK WHY → MISTAKE / REAL BUT RARE, with the seven treatment chips landing on their spoken words. Then the tree dims and the **GOLDEN RULE** card rises: UNSURE? RUN IT BOTH WAYS · WITH THE JAM · MEAN 28.9 · WITHOUT IT · MEAN 25.4 · AND REPORT BOTH. |
| 9 | 1:43–2:04 | **Quiz + CTA** | QUICK QUIZ. SURVEY · HOURS OF SLEEP PER DAY: 7, 8, 6, **30**, 7, 9 (the 30 glows orange). "How should you TREAT IT?" Options: Keep & study / Fix or remove / Cap it / Log transform, with the 5-second countdown. The answer is **FIX OR REMOVE**: confetti, and the other three are struck through ("not real"). The 30 is crossed out (A DAY HAS 24 H): **IMPOSSIBLE = A MISTAKE**. End card: FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and Ask why · Fix / Remove · Cap / Log · Robust chips. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Pronunciation fix: "lakh" is said *laakh* (`fix: ["lˈæk", "lˈɑːk"]`). "Winsorizing" was checked with the phonemizer. The rupee sign isn't in the caption font, so captions say "2 lakh" without it.

**S1 · Hook** (0:00.00–0:12.06)
- `0:00.45` You found an outlier.
- `0:01.91` Just delete it, right?
- `0:03.45` Not so fast!
- `0:04.87` Delete the wrong one, and you lose the most important point in your data.
- `0:09.04` Here are seven ways to treat outliers.

**S2 · Ask why first** (0:12.06–0:19.52)
- `0:12.51` Step zero: ask why it's there.
- `0:14.77` Is it a mistake, or real but rare?
- `0:17.15` The answer picks the treatment.

**S3 · Mistakes: fix, fill, remove** (0:19.52–0:36.45)
- `0:19.96` If it's a mistake, fix it.
- `0:21.63` An age of 250? The form says 25. Correct it!
- `0:25.93` Can't recover the real value? Fill it in, usually with the median, so you keep the rest of the row.
- `0:31.85` If a row doesn't belong, like a test account, remove it, and note why.

**S4 · Cap it** (0:36.45–0:50.48)
- `0:36.90` If it's real, you have four options.
- `0:39.21` First, cap it. Anything past the fence gets pulled back to the fence.
- `0:43.31` The 60-minute jam becomes 42.
- `0:45.85` It still counts, but it can't dominate. This is called winsorizing.

**S5 · Transform it** (0:50.48–1:02.55)
- `0:50.93` Next, transform it, usually with a log.
- `0:53.58` On a log scale, each step is ten times bigger. That squeezes a long tail in.
- `0:58.58` Skewed salaries become balanced, and the mean works again.

**S6 · Robust tools** (1:02.55–1:17.29)
- `1:03.00` Or leave the data alone, and use robust tools: ones that barely react to extreme values.
- `1:08.97` Use the median and IQR instead of the mean and standard deviation.
- `1:13.47` The outlier stays. It just can't drag your results.

**S7 · Keep it and study it** (1:17.29–1:27.85)
- `1:17.74` Or keep it and study it.
- `1:19.34` A 2 lakh payment at 3 AM could be fraud.
- `1:22.29` Here, the outlier is the whole story! Flag it, dig in, and report it separately.

**S8 · The complete picture** (1:27.85–1:42.77)
- `1:28.30` Here's the complete picture.
- `1:29.99` Mistakes: fix, fill, or remove.
- `1:32.29` Real values: cap, transform, go robust, or keep and study.
- `1:36.74` And the golden rule: if you're unsure, run it with and without the outlier, and report both.

**S9 · Quiz and call to action** (1:42.77–2:03.83)
- `1:43.12` Quick quiz!
- `1:44.15` A survey says someone sleeps 30 hours a day.
- `1:46.78` How should you treat it?
- `1:53.56` Fix it or remove it!
- `1:55.13` A day only has 24 hours. It's a mistake, not a rare event.
- `1:59.61` Follow for data science made simple!

*(Between "How should you treat it?" and "Fix it or remove it!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Fix:** Sana's age 250 is a typo; the original form says 25.
- **Fill (median imputation):** the valid ages are 24, 25 (after the fix), 29, 31 and 33, so the median is **29** and Dev's impossible −5 becomes 29.
  - Median rather than mean, because the mean is itself pulled by outliers.
  - The row is kept, so Dev's other answers aren't lost.
- **Remove:** TEST_USER (999) isn't part of the population being studied (a test account), so it's removed, and the removal is logged so the analysis stays reproducible.
- **Cap (winsorizing):** commute times 18, 20, 22, 22, 25, 27, 30, 30, 35, 60.
  - Q1 = 22 and Q3 = 30, so IQR = 8. The fences are 22 − 12 = **10** and 30 + 12 = **42**. Only 60 is past a fence, so it is set to **42**.
  - The mean goes from 289 ÷ 10 = **28.9** to 271 ÷ 10 = **27.1**.
  - Strictly, winsorizing means capping at percentiles (e.g. the 5th/95th); capping at the IQR fences is the same idea with a different limit. The on-screen "a.k.a. winsorizing" refers to the general technique.
- **Transform (log):** on a log₁₀ scale each step is ×10 (₹10K → ₹1L → ₹10L → ₹1Cr are equally spaced), so a long right tail is compressed and right-skewed data such as salaries becomes roughly symmetric.
  - The histograms are illustrative shapes, not a specific dataset.
  - The plotted mean of the skewed shape sits at bar 3.6 vs a peak at bar 2; after the transform it sits at the centre (5.5).
  - Results are then read back on the original scale; a log-scale mean is a geometric mean.
- **Robust tools:** values 14, 20, 26, 32, 38, 44 and 50 (mean 32, SD 12, median 32, Q1 20, Q3 44).
  - Moving the last value to 96 gives mean 38.6 and SD 25.3, while the median (32) and quartiles (20, 44) don't change.
  - Robust models (e.g. tree-based models, robust regression) follow the same idea.
- **Keep and study:** ₹2,00,000 at 3:07 AM against everyday ₹100–₹900 payments is the classic anomaly that fraud detection looks for. Removing it would delete the signal.
- **Golden rule:** commute mean with the jam = 28.9 min; without it = 229 ÷ 9 = **25.4 min**. Reporting both shows how much one point matters (a sensitivity analysis).
- **Quiz:** nobody sleeps 30 hours in a 24-hour day, so the value is impossible: a data-entry mistake, not a rare event. Fix it from the source if you can; otherwise remove it (or treat it as missing and fill it).
  - Keeping, capping or log-transforming would treat an impossible value as real.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, an impact on "Not so fast!", then the riser, impact and crash into "seven ways".
- Ask why: groove, with step and blip tones as the seven chips land.
- Mistakes: playful marimba ("play"), with a flip as the form appears, a ding on the fix, a chime on the fill and a whoosh + stamp as the test row goes in the bin.
- Cap and transform: calm "flow". A falling lead as the jam is pulled back to the fence; a rising lead as the tail squeezes into a bell.
- Robust and keep: groove, with a ding on STEADY, a stamp on DRAGGED, an alert beep on FRAUD? and step tones for the checklist.
- Overview: build, with a crash on the golden rule.
- Quiz: suspense countdown, then the finale.

The mix and master are unchanged: music ducked under every line with `useDuck(0.5, 0.16)`, then limiter → two-pass loudnorm to −14 LUFS.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

This project was scaffolded from `iqr/` (`REF=iqr bash .claude/skills/data-science-explainer/new-video.sh treating-outliers TreatingOutliers Treating_Outliers`). `reference/` holds those scenes for patterns only; they are not compiled. The treatment glyphs, the TREATS list and the "n/7" TreatPill live in `src/components/Kit.tsx`.

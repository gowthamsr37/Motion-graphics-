# Which Test Should I Use? (cheat sheet)

A "save this" cheat sheet for **@curious_datascientist** that tells viewers which hypothesis test to use: z-test, one-sample t-test, two-sample t-test, paired t-test, ANOVA, and the two chi-square tests, plus the non-parametric swaps. 2:30, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It's the first video built with the **growth rules** the user asked for after reading their Instagram dashboard (recorded at the end of `.claude/skills/data-science-explainer/SKILL.md`):
- a puzzle hook and a question cover ("WHICH TEST SHOULD I USE?");
- quiz options with **A/B/C/D letters** and a bouncing **VOTE IN THE CAPTION POLL** hint (`PollHint` in `components/Quiz.tsx`);
- a save moment (SAVE IT bookmark in the hook, SAVE / SEND badges and "screenshot or save for your interview" on the cheat sheet);
- small animated diagrams on every card (`TestViz`);
- a CAPTION.md with the caption, a ready poll and a pinned answer comment.

The end card says NEXT: THE z-TEST; the next four videos work through each test with a full calculation.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Which_Test_Cheat_Sheet.mp4` | the finished Reel |
| `Which_Test_Cheat_Sheet_Cover.png` | 1080×1920 cover: THE CHEAT SHEET tag, WHICH TEST SHOULD I USE?, four test tiles with mini diagrams (z / t-TEST, PAIRED t, ANOVA, CHI-SQUARE), SAVE THIS FOR YOUR INTERVIEW, @curious_datascientist |
| `Which_Test_Cheat_Sheet.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Colour code

| Concept | Colour |
| --- | --- |
| Averages, 1 group (z-test, one-sample t) | cyan |
| Averages, 2 groups (two-sample t, paired t) | violet |
| Averages, 3+ groups (ANOVA) | green |
| Counts / categories (both chi-square tests) | orange |

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | 4 TESTS · 1 QUESTION; z-TEST, t-TEST, CHI-SQUARE and ANOVA tiles pop in on their names and wobble; **WHICH ONE?**; the tiles shake and **WRONG TEST = WRONG ANSWER** is stamped; THE COMPLETE CHEAT SHEET pill; a SAVE IT bookmark drops and wiggles. |
| 2 | **Two questions** | 1 WHAT KIND OF DATA? NUMBERS (stopwatch, "you AVERAGE them", weight · time) vs CATEGORIES (chai glass, "you COUNT them", tea · coffee). 2 HOW MANY GROUPS? 1 · 2 · 3+ dot clusters. |
| 3–9 | **Seven test cards** | Each: a 7-step progress bar, family tag (e.g. AVERAGES · 1 GROUP), 01/07 counter, the name, an animated diagram, USE IT WHEN (two lines), the EXAMPLE pill, H0 and the Python one-liner. Diagrams: z (40 bottles around a CLAIM 200 line, average 198, SIGMA KNOWN), one-sample t (10 phones vs CLAIM 20 h, SIGMA ?), two-sample t (groups A and B with their averages, DIFFERENT?), paired t (BEFORE → AFTER lines for the same people), ANOVA (shops A, B, C with their averages), chi-square independence (TEA/COFFEE × UNDER 30/30 AND UP counts 40/60/60/40 counting up), goodness of fit (60 dice rolls by face vs an EXPECTED 10 line). |
| 10 | **Bonus: not normal?** | INTERVIEW TIP. t-TESTS & ANOVA ASSUME NORMAL DATA (bell icon); SMALL + SKEWED? SWAP: (skewed icon); 2-SAMPLE t → MANN-WHITNEY U, PAIRED t → WILCOXON, ANOVA → KRUSKAL-WALLIS on their words; THEY COMPARE RANKS, NOT AVERAGES. |
| 11 | **The cheat sheet** | AVERAGES (NUMBERS): five rows, COUNTS (CATEGORIES): two rows, revealed on "One… Two… Three… Counts?", each with its mini diagram; a NOT NORMAL? footer; SEND and SAVE badges drop on their words; SCREENSHOT OR SAVE FOR YOUR INTERVIEW. |
| 12 | **Quiz, teaser and CTA** | QUICK QUIZ: SAME STUDENTS · BEFORE vs AFTER COACHING, scores 62 → 71. "Did scores improve? **WHICH TEST?**" Options A 2-SAMPLE / B PAIRED / C ANOVA / D CHI-SQ with the countdown and the VOTE IN THE CAPTION POLL hint. **PAIRED t-TEST** wins; struck reasons "same kids", "only 2 sets", "not counts"; tag SAME PEOPLE, MEASURED TWICE. Teaser: NEXT: WITH A FULL CALCULATION · THE z-TEST. End card with chips 1 group: z / t · 2 groups: t · 3+: ANOVA · Counts: chi-square. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×.

**S1 · Hook** (0:00.00–0:11.54)
- `0:00.45` z-test, t-test, chi-square, ANOVA. Which one should you use?
- `0:04.59` Pick the wrong test, and your answer is wrong. This one video tells you exactly which test to use. Save it!

**S2 · Two questions** (0:11.54–0:24.21)
- `0:11.94` Choosing a test comes down to two questions.
- `0:14.74` One: what kind of data? Numbers you can average, like weight or time? Or categories you count, like tea or coffee?
- `0:21.48` Two: how many groups are you comparing?

**S3 · Z-test** (0:24.21–0:37.91)
- `0:24.51` z-test.
- `0:25.47` Compare one average with a claim, when sigma, the population's spread, is known, or the sample is large.
- `0:32.04` Do these juice bottles really hold 200 ml? We checked 100 of them.

**S4 · One-sample t-test** (0:37.91–0:50.39)
- `0:38.21` One-sample t-test.
- `0:39.80` Same question, but the sample is small and sigma is unknown. That's most of real life.
- `0:45.32` Do these 10 phones really last 20 hours, like the ad says?

**S5 · Two-sample t-test** (0:50.39–0:59.25)
- `0:50.69` Two-sample t-test.
- `0:52.20` Two separate groups. Are their averages different?
- `0:55.14` Battery life of brand A, versus brand B.

**S6 · Paired t-test** (0:59.25–1:07.54)
- `0:59.55` Paired t-test.
- `1:00.75` The same people, measured twice: before and after.
- `1:03.82` Typing speed before a course, and after it.

**S7 · ANOVA** (1:07.54–1:15.32)
- `1:07.84` ANOVA.
- `1:08.67` Three or more groups. Is any of their averages different?
- `1:11.91` Waiting times at three coffee shops.

**S8 · Chi-square test of independence** (1:15.32–1:24.71)
- `1:15.62` Chi-square test of independence.
- `1:17.66` Now the data are categories. Are two of them linked?
- `1:20.69` Does preferring tea or coffee depend on age?

**S9 · Chi-square goodness of fit** (1:24.71–1:34.85)
- `1:25.01` Chi-square goodness of fit.
- `1:26.67` One category. Do the counts match what you expected?
- `1:29.78` Is this dice fair? Roll it 60 times, and count each face.

**S10 · Bonus: not normal?** (1:34.85–1:49.19)
- `1:35.25` Bonus interview tip: t-tests and ANOVA assume the data are roughly normal.
- `1:40.13` Small sample, heavily skewed? Swap them: Mann-Whitney for the two-sample t-test, Wilcoxon for paired, and Kruskal-Wallis for ANOVA.

**S11 · The cheat sheet** (1:49.19–2:05.25)
- `1:49.64` Here's the full cheat sheet.
- `1:51.36` Averages? One group: z or t. Two groups: two-sample or paired t. Three or more: ANOVA. Counts? Chi-square.
- `1:59.36` Save this reel, and send it to a friend preparing for interviews.

**S12 · Quiz, teaser and CTA** (2:05.25–2:29.62)
- `2:05.60` Quick quiz!
- `2:06.63` The same students take a test before and after coaching.
- `2:09.87` Which test checks if their scores improved?
- `2:17.60` Paired t-test!
- `2:18.90` The same students are measured twice, so each one is compared with themselves.
- `2:23.23` Next: the z-test, with a full calculation.
- `2:26.35` Follow for data science made simple!

total 149.625

## Accuracy notes

- **z vs t:** the z-test assumes the population SD (sigma) is known; with a large sample (about 30+) the sample SD is close enough that z is a fine approximation. With a small sample and unknown sigma, the t-test is correct (t-distribution with n − 1 df).
- **Two-sample vs paired:** independent groups use the two-sample t-test (`ttest_ind`, Welch's version with `equal_var=False` when spreads differ); the same subjects measured twice use the paired t-test (`ttest_rel`), which is a one-sample t-test on the differences, H0: average change = 0.
- **ANOVA:** one-way ANOVA tests H0: all group means are equal; a significant F says at least one differs, not which (that needs a post-hoc test such as Tukey's HSD).
- **Chi-square:** the test of independence (`chi2_contingency`) uses a contingency table of counts, H0: the variables are independent; goodness of fit (`chisquare`) compares one variable's counts with expected counts, H0: counts match expected. Both need expected counts of about 5 or more per cell. The dice bars (8, 12, 9, 11, 7, 13) sum to 60, expected 10 per face.
- **Non-parametric swaps:** Mann-Whitney U ↔ two-sample t, Wilcoxon signed-rank ↔ paired t, Kruskal-Wallis ↔ one-way ANOVA. They work on ranks, so they don't need normality; "compare ranks, not averages" is the plain-words version.
- **Python:** `statsmodels.stats.weightstats.ztest(x, value=200)`; the rest are `scipy.stats` functions as shown.
- The z-card dots are 40 seeded values shifted so their average is exactly 198, matching the example.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `distributions-guide/` (`REF=distributions-guide bash .claude/skills/data-science-explainer/new-video.sh which-test WhichTest Which_Test_Cheat_Sheet`). New: `src/components/Tests.tsx` (`TESTS`, `TestViz`, `TestCard`, `SheetRow`) and, in `components/Quiz.tsx`, the A–D option letters and `PollHint`. Future videos scaffold from this project (`REF=which-test`) to inherit them.

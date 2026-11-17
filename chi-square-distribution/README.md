# The Chi-Square Distribution Explained in 2 Minutes

The twenty-third **Data Science Made Simple** Reel for **@curious_datascientist**: is this dice fair, or just lucky? 2:09, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Part of the "explain it very well" batch. One concrete question runs through the whole video:
- 60 rolls, and a six comes up 16 times;
- a plain-words definition card;
- seen vs expected counts;
- the mismatch score built step by step (gap → square → ÷ expected → add = 8.2);
- 150 simulated fair dice showing how big a mismatch luck alone produces (the chi-square shape, df = 6 − 1);
- the verdict against the 95% line;
- where it's used;
- a recap;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: THE DISTRIBUTION CHEAT SHEET chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Chi_Square_Distribution.mp4` | the finished Reel |
| `Chi_Square_Distribution_Cover.png` | 1080×1920 cover: THE CHI-SQUARE DISTRIBUTION · explained in 2 minutes, "IS THIS DICE FAIR?" over the 5-df curve with the fair zone (green) and the 5% tail (orange), @curious_datascientist |
| `Chi_Square_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Observed counts, simulated scores | cyan |
| Expected counts (the dashed line at 10) | violet |
| Gaps, the score, the 5% tail | orange |
| The fair zone, "could be luck" | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:13 | **Hook** | ROLLS: 0 → 60 / 60 counts up while six bars (faces 1–6) grow; a dashed violet line at 10. The 6-bar grows on to **16!** and turns orange: **UNFAIR, OR JUST LUCK?** → **THE CHI-SQUARE DISTRIBUTION** with a burst. |
| 2 | 0:13–0:25 | **The definition** | IN SIMPLE WORDS: 1 the gap: **SEEN vs EXPECTED**; 2 how big it gets **JUST BY LUCK**. THAT'S THE CHI-SQUARE DISTRIBUTION. |
| 3 | 0:25–0:35 | **Seen vs expected** | **EXPECTED: 10 OF EACH** (the dashed line). **SEEN: 8 · 9 · 12 · 11 · 4 · 16**, each bar rising on its spoken number. |
| 4 | 0:35–0:48 | **The mismatch score** | Orange gap lines from each bar to 10. Three rows fill under the faces on "gap", "square" and "divide": GAP −2 −1 +2 +1 −6 +6 · SQUARED 4 1 4 1 36 36 · ÷ 10 0.4 0.1 0.4 0.1 3.6 3.6. Faces 5 and 6 turn orange: **BIG GAPS COUNT MORE**. Then 0.4 + 0.1 + 0.4 + 0.1 + 3.6 + 3.6 → **SCORE = 8.2**. |
| 5 | 0:48–1:07 | **How big is too big?** | EVEN A FAIR DICE IS NEVER PERFECT. **150 FAIR DICE · 60 ROLLS EACH**: their scores drop as dots into bins 0–25, piling up near 3–5 with a few far out; the 5-df chi-square curve traces over them: STARTS AT 0 · **LONG TAIL**; **df = 6 faces − 1 = 5**. |
| 6 | 1:07–1:24 | **The verdict** | The 5-df curve: the region below **11.1** fills green (**FAIR ZONE: 95%**) and the tail beyond it orange (**5% TAIL**). A marker rises at **OUR SCORE 8.2**; the area from 8.2 up lights (FAIR DICE SCORE THIS HIGH: 15%). **COULD EASILY BE LUCK**. |
| 7 | 1:24–1:32 | **Where it's used** | Two cards on their words: SALES ACROSS THE WEEK (seven bars vs an even dashed line, the weekend higher) and WHAT DIFFERENT GROUPS CHOOSE (groups A and B, three products). |
| 8 | 1:32–1:43 | **Remember** | CHI-SQUARE DISTRIBUTION pill and a recap flow: **COMPARES SEEN vs EXPECTED COUNTS** ↓ **SMALL SCORE: COULD BE LUCK** ↓ **DEEP IN THE TAIL: SOMETHING REAL**. |
| 9 | 1:43–2:09 | **Quiz, teaser and CTA** | QUICK QUIZ. The curve with its orange tail past 11.1 and a marker at **SCORE 20**. "Fair, or... **SUSPICIOUS?**" Options FAIR / SUSPICIOUS / CAN'T TELL / PERFECT with the 5-second countdown. **SUSPICIOUS**: confetti and strikes ("20 > 11.1", "we can", "never"); **DEEP IN THE TAIL: ABOUT 1 IN 800 BY LUCK**. Teaser: NEXT: EVERY DISTRIBUTION · THE CHEAT SHEET. End card: NEXT: THE DISTRIBUTION CHEAT SHEET, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Seen vs expected · Gap² ÷ expected · df = categories − 1 · Tail = not luck. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Sixteen" and "fifteen" are phoneme-patched to stress their second syllable.

**S1 · Hook** (0:00.00–0:12.57)
- `0:00.45` Roll a dice 60 times, and each face should come up about 10 times.
- `0:04.69` But six comes up 16 times. Is the dice unfair, or is it just luck?
- `0:09.58` The chi-square distribution answers that.

**S2 · The definition** (0:12.57–0:25.44)
- `0:13.02` Here's the definition, in simple words.
- `0:15.63` Chi-square measures how far the counts we see are from the counts we expect.
- `0:20.02` And the chi-square distribution shows how big that gap can get, just by luck.

**S3 · Expected vs observed** (0:25.44–0:34.68)
- `0:25.89` A fair dice, rolled 60 times, should give 10 of each face.
- `0:29.87` Here's what we got: 8, 9, 12, 11, 4, and 16.

**S4 · The score** (0:34.68–0:47.56)
- `0:35.13` For each face, take the gap from 10, square it, and divide by 10.
- `0:39.30` Squaring makes every gap positive, and makes big gaps count more.
- `0:43.40` Add them all up, and the chi-square score is 8.2.

**S5 · The distribution** (0:47.56–1:07.28)
- `0:48.01` But even a fair dice never matches perfectly. So how big is too big?
- `0:52.45` Repeat the 60 rolls again and again with a fair dice, and the scores form the chi-square distribution.
- `0:58.67` It starts at zero, with a long tail to the right. Its shape depends on the degrees of freedom: six faces minus one, so five.

**S6 · The verdict** (1:07.28–1:23.83)
- `1:07.73` For a fair dice, 95% of scores land below 11.1.
- `1:12.74` Our score, 8.2, is inside that zone. A fair dice scores this high about 15% of the time.
- `1:19.63` So it could easily be luck. No proof the dice is unfair.

**S7 · Where it's used** (1:23.83–1:31.80)
- `1:24.28` Data scientists use it to test counts everywhere: sales across the week, or what different groups of customers choose.

**S8 · Remember** (1:31.80–1:42.79)
- `1:32.25` So remember: chi-square compares the counts we see with the counts we expect.
- `1:36.87` A small score could be luck. A score deep in the tail means something real is going on.

**S9 · Quiz, teaser and CTA** (1:42.79–2:08.87)
- `1:43.14` Quick quiz!
- `1:44.17` Another dice scores 20, with the same five degrees of freedom.
- `1:47.99` Is it fair, or suspicious?
- `1:55.16` Suspicious!
- `1:56.33` 20 is far past 11.1, deep in the tail. That almost never happens by luck.
- `2:02.23` Next: the complete cheat sheet of every distribution.
- `2:05.60` Follow for data science made simple!

*(Between "Is it fair, or suspicious?" and "Suspicious!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Statistic:** Pearson's chi-square goodness-of-fit statistic is Σ (observed − expected)² / expected. Under the null hypothesis (a fair dice) it approximately follows a chi-square distribution with (categories − 1) degrees of freedom; here 6 − 1 = **5**.
  - The approximation is good when every expected count is at least 5; here each is 10.
- **The Reel's dice:**
  - The counts 8, 9, 12, 11, 4, 16 sum to 60.
  - Gaps −2, −1, +2, +1, −6, +6 → squares 4, 1, 4, 1, 36, 36 → ÷ 10 → 0.4, 0.1, 0.4, 0.1, 3.6, 3.6 → total **8.2**.
- **Chi-square with 5 df:**
  - The 95th percentile is **11.07** (said "11.1"); P(X ≥ 11.07) = 5.0%.
  - P(X ≥ 8.2) = **14.6%** ("about 15%"), so the dice is not shown to be unfair at the 5% level.
  - The mean is 5 and the mode 3.
  - The density is computed exactly (`components/Chi.tsx`).
- **Scene 5 simulation:** 150 fair dice × 60 rolls each, seeded (`rng(3)`), checked before use.
  - Mean score 4.95 (theory: 5); 5.3% above 11.07 (theory: 5%); maximum 19.0.
  - The dashed curve is the 5-df density scaled to 150 scores in bins of width 1. Scores from a real dice are discrete (multiples of 0.2); the curve is the large-sample approximation.
- **Quiz:** P(X ≥ 20) with 5 df = **0.125%**, about 1 in 800 ("almost never by luck"). A score of 20 is strong evidence that the dice is not fair.
  - The distractors: FAIR (20 > 11.1), CAN'T TELL (we can), PERFECT (no real dice scores 0 every time).
- **Uses:** goodness of fit (is demand spread evenly across weekdays?) and the test of independence (do two customer groups choose products differently?) both use the chi-square distribution.

## Audio

Same score engine and kit as the series, re-timed for 9 scenes:
- Hook: intro, roll ticks, a pop on "10", a glide as the six grows to 16, and the riser, impact and crash on "chi-square".
- Definition: calm "flow", with a blip per line.
- Seen vs expected and the score: marimba "play", with step tones on each spoken count, ticks on the gaps, blips on "square" and "divide", and a ding on 8.2.
- The distribution, verdict and uses: groove, with ticks as the simulated scores drop, a glide as the curve traces, pops on 95% and our score, and a sparkle on "could easily be luck".
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `t-distribution/` (`REF=t-distribution bash .claude/skills/data-science-explainer/new-video.sh chi-square-distribution ChiSquareDistribution Chi_Square_Distribution`). It adds:
- `src/components/Chi.tsx`: `chiPdf`, the dice data and the seeded simulation;
- `src/scenes/Faces.tsx`: the six-face bar chart with the expected line.

# Z-Test vs t-Test: The Complete Comparison

A save-worthy comparison Reel for **@curious_datascientist** that ties `z-test/`, `t-test-one-sample/`, `t-test/`, the CI and A/B videos together. It opens on the puzzle from the last two videos (same −2: z rejects, t doesn't), then covers the definitions, the one-letter formula difference, fatter tails by df, the 5% cut-off ladder (2.571 → 1.96), why −2 only rejects beyond df 60, which test to use, the "n > 30" myth, z for proportions, confidence intervals, and a full comparison table, ending on a caption-poll prompt. 2:58, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Z_Test_vs_T_Test.mp4` | the finished Reel |
| `Z_Test_vs_T_Test_Cover.png` | 1080×1920 cover: THE COMPLETE COMPARISON tag, Z-TEST vs t-TEST, SAME −2. WHO'S RIGHT? with z: REJECT / t: FAIL TO REJECT, a mini cut-off ladder (df 5 → z) and t BECOMES z, SAVE THIS FOR YOUR INTERVIEW, @curious_datascientist |
| `Z_Test_vs_T_Test.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Colour code

z = cyan, t = violet, cut-offs / traps / tails = orange, the save moment and "fail to reject" = green.

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Hook** | The bottle; verdict cards slide in from both sides: z-TEST −2 vs ±1.96: REJECT · t-TEST −2 vs ±2.306: FAIL TO REJECT; the screen shakes on WHO'S RIGHT?; Z-TEST vs t-TEST; THE COMPLETE COMPARISON bookmark. |
| 2 | **Textbook definitions** | Split cards (z cyan, t violet) with the definitions; σ KNOWN vs σ UNKNOWN; THAT ONE DIFFERENCE CHANGES EVERYTHING. |
| 3 | **One letter of difference** | The z and t formulas stacked; σ glows (THE TRUE POPULATION SPREAD), then s (ESTIMATED FROM THE SAMPLE); + EXTRA UNCERTAINTY, ESPECIALLY FOR SMALL n. |
| 4 | **Fatter tails** | The normal curve (dashed) and a t curve that morphs df 2 → 5 → 30 on the words, tails shaded; MORE DATA = t LOOKS LIKE z; df = n − 1. |
| 5 | **The cut-off ladder** | Rows df 5 / 10 / 30 / 60 / 100 / INFINITE (z) fill on their spoken values, bars shrinking toward the dashed 1.96 line; t BECOMES z. |
| 6 | **Who's right?** | A number line with OUR SCORE: 2 and the cut-offs for df 8, 30, 60, 100 and z; 2 BEATS THE CUT-OFF ONLY WHEN df > 60; 9 BOTTLES (df 8): FAIL TO REJECT · 100 BOTTLES (df 99): REJECT; BOTH WERE RIGHT, FOR WHAT THEY KNEW; t WAS MORE CAREFUL. |
| 7 | **Which one to use** | Flowchart: DO YOU KNOW σ? → YES: z-TEST · NO: t-TEST (AT ANY SAMPLE SIZE); BIG SAMPLE: t AND z GIVE ALMOST THE SAME ANSWER. |
| 8 | **Interview trap** | "USE z WHEN n > 30" stamped ONLY A RULE OF THUMB; THE REAL QUESTION: DO YOU KNOW σ?; IN PRACTICE YOU RARELY DO, SO t IS THE DEFAULT; BIG n: s GETS CLOSE TO σ, SO z WORKS AS AN APPROXIMATION. |
| 9 | **Where z really lives** | PROPORTIONS; A/B TESTS · POLLS · CONVERSION RATES; version A 10% vs version B 12% bars; 10% vs 12% CONVERSION: THAT'S A z-TEST; SE = √(p(1 − p) ÷ n), NO SIGMA NEEDED. |
| 10 | **Confidence intervals too** | z interval x̄ ± 1.96 · σ/√n and the slightly wider t interval x̄ ± t · s/√n; SMALL-SAMPLE t INTERVALS ARE A LITTLE WIDER. |
| 11 | **The full comparison** | A 7-row table (SPREAD USED · DISTRIBUTION · TAILS · 5% CUT-OFF · USE WHEN · CLASSIC USE · PYTHON) cascades in, held about 6 s; SEND and SAVE badges drop on their words. |
| 12 | **Your turn, teaser and CTA** | YOUR TURN · σ UNKNOWN · n = 200 · A z-TEST / B t-TEST · z OR t? · VOTE IN THE CAPTION POLL; teaser NEXT: THREE OR MORE GROUPS · ANOVA; end card chips Sigma known: z · Sigma unknown: t · Big n: t becomes z · Proportions: z. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "A/B" is written "A-B" in the TTS text.

**S1 · Hook** (0:00.00–0:12.23)
- `0:00.45` Same juice bottles, same score of -2. The z-test says reject. The t-test says don't.
- `0:06.56` So who's right? Here's z-test versus t-test, the complete comparison. Save this one!

**S2 · Textbook definitions** (0:12.23–0:26.16)
- `0:12.63` Here are the textbook definitions.
- `0:14.60` A z-test compares a sample mean with a population mean, when the population standard deviation is known.
- `0:21.11` A t-test does the same, when it's unknown and has to be estimated from the sample.

**S3 · One letter of difference** (0:26.16–0:40.24)
- `0:26.55` The formulas differ by one letter.
- `0:28.69` z divides by sigma, the true population spread. t divides by s, the spread estimated from the sample.
- `0:35.86` An estimate adds extra uncertainty, especially when the sample is small.

**S4 · Fatter tails** (0:40.24–0:54.08)
- `0:40.64` That's why the t curve has fatter tails.
- `0:42.94` With 2 degrees of freedom, the tails are very fat. With 5, thinner. By 30, t is almost the normal curve.
- `0:50.00` Degrees of freedom, n - 1, tell you which t curve to use.

**S5 · The cut-off ladder** (0:54.08–1:15.53)
- `0:54.48` Now watch the 5% cut-off shrink as the sample grows.
- `0:58.35` 5 degrees of freedom: 2.571. 10: 2.228. 30: 2.042. 60: exactly 2. 100: 1.984.
- `1:10.23` And with infinite data: 1.96. The z value. t becomes z.

**S6 · Who's right?** (1:15.53–1:34.42)
- `1:15.93` Back to our puzzle. A score of -2 only beats the t cut-off with more than 60 degrees of freedom.
- `1:22.41` 9 bottles: fail to reject. 100 bottles: reject. Both tests were right, for what they knew.
- `1:28.79` The t-test wasn't wrong. It was more careful, because 9 bottles can't pin down the spread.

**S7 · Which one to use** (1:34.42–1:46.05)
- `1:34.82` So which one should you use? Ask one question: do you know sigma?
- `1:38.64` Yes: z-test. No: t-test, at any sample size. And with a big sample, the two give almost the same answer.

**S8 · Interview trap** (1:46.05–2:04.18)
- `1:46.45` Interview trap: use z when n is over 30. That's a rule of thumb, not the definition.
- `1:52.12` The real question is whether you know sigma. In practice, you rarely do, so t is the default.
- `1:57.95` And with a big sample, s gets very close to sigma. That's why z works as an approximation there.

**S9 · Where z really lives** (2:04.18–2:23.14)
- `2:04.58` So where is the z-test really used? Proportions.
- `2:07.76` In an A/B test, or a poll, the spread comes from the proportion itself, so we use z. 10% versus 12% conversion? That's a z-test.
- `2:17.23` Its standard error is the square root of p times 1 - p, over n. No sigma needed.

**S10 · Confidence intervals too** (2:23.14–2:35.85)
- `2:23.54` The same cut-offs build confidence intervals: ±1.96 with z, ±the t value with t.
- `2:31.98` That's why a small-sample t interval is always a little wider.

**S11 · The comparison table** (2:35.85–2:45.86)
- `2:36.25` Here's the full comparison.
- `2:38.01` Screenshot it, save it, and send it to a friend preparing for interviews.

**S12 · Poll, teaser and CTA** (2:45.85–2:57.59)
- `2:46.21` Your turn: sigma is unknown, and n is 200. z or t? Vote in the caption poll!
- `2:51.94` Next: comparing three or more groups. ANOVA.
- `2:54.87` Follow for data science made simple!

total 177.586

## Accuracy notes (every number checked)

- **Two-tailed 5% t critical values:** df 5 = 2.571, df 10 = 2.228, df 30 = 2.042, df 60 = 2.000, df 100 = 1.984, df 99 = 1.984, df 8 = 2.306, df 199 = 1.972; normal 1.960. Each checked by integrating the t density.
- **"−2 only beats the t cut-off with more than 60 df":** the cut-off is exactly 2.000 at df 60 and below 2 for df > 60 (p for |t| = 2: df 30 → 0.055, df 60 → 0.050, df 100 → 0.048).
- **9 bottles:** df 8, |t| = 2 < 2.306 → fail to reject (p = 0.081). **100 bottles:** df 99, 2 > 1.984 → reject (assuming the same mean and SE).
- **Proportion z-test:** SE = √(p(1 − p)/n); the spread follows from p, so no separate σ is needed. Comparing two conversion rates (10% vs 12%) is a two-proportion z-test.
- **Intervals:** z interval x̄ ± 1.96σ/√n; t interval x̄ ± t(n−1)·s/√n, wider for small n because t > 1.96.
- **Poll:** σ unknown → t strictly; with n = 200 the cut-off is 1.972 vs 1.96, so results are nearly identical.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `t-test-one-sample/` (`REF=t-test-one-sample bash .claude/skills/data-science-explainer/new-video.sh z-vs-t ZvsT Z_Test_vs_T_Test`). New: `src/components/ZT.tsx` (colours, the `Split` card pair, a t-density helper).

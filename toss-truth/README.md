# Win the toss, win the match?

A 73.8-second Instagram Reel / YouTube Short: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS. It is a data story for virality: the question is on screen and spoken in the first second, a number lands every few seconds, there is a twist two-thirds of the way in, and it ends on a comment prompt.

Look: a floodlit night match. Ink-black sky, sweeping floodlight beams with dust in the light, one gold coin. Anton display type and Inter captions. Gold is the hero colour, mint marks the real edge, red marks the myth.

## The story

| # | Scene | What's on screen |
| --- | --- | --- |
| 1 | Hook (0–4.8 s) | A gold coin is tossed up from the bottom of the frame and lands heads-up. **WIN THE TOSS / WIN THE MATCH?** slams in. Two cards: *Captains ✓ believe it* · *The data ✗ doesn't*. |
| 2 | The evidence | A counter runs to **8,408** men's matches while a 42×20 dot grid fills (1 dot = 10 matches). Chips: Tests 899 · ODIs 2,617 · T20Is 3,649 · IPL 1,243. |
| 3 | The answer | Slot-machine digits spin, then **50.9%** slams in. A tug bar wobbles and settles at 50.9 v 49.1. "Basically a coin flip." |
| 4 | Every format | Each format gets a row with a 50% line and its own shaded coin-flip zone. **ODIs 50.0%** ("exactly half"), **T20Is 50.5%**, **IPL 51.6%**. A locked Tests row says "hold that thought", then turns red: "breaks the rule". |
| 5 | Where the myth came from | Rewind to the **2021 T20 World Cup**. In Dubai, 13 tiles flip: chasing teams won **12 of 13**. Across the tournament, a 45-dot grid fills: toss winners won **30 of 45**, including the final (Australia won the toss, bowled and won). |
| 6 | What happened next | World Cup bars against a coin-flip zone: 2021 **67%** (the outlier), then **39%, 56%, 43%**. "Back to a coin flip." |
| 7 | The real edge: Tests | "ONE REAL EDGE". Won the toss and batted first: **57.1%** of decided Tests. Won the toss and bowled first: 48.3%. A pitch cracks from day 1 to day 5: "batting last, on this". |
| 8 | IPL: the decision | Rings fill: toss winners who bowled first won **54.7%**, those who batted first **45.3%**. |
| 9 | Verdict + CTA | The coin spins over the question, then a **MYTH BUSTED** stamp lands. "It's not the coin. It's the call." CTA: *What's the worst toss call you've ever seen? Tell me in the comments.* |

Word-synced captions (1–3 words, the spoken word lit) run under every line except the hook's headline and the stamped "No."

## Data

- **Source:** [Cricsheet](https://cricsheet.org) open ball-by-ball data, [Open Data Commons Attribution License](https://cricsheet.org/article/licensing-and-venues-registry/). Men's Tests from Dec 2001, ODIs from Jun 2002, T20Is from Feb 2005, IPL 2008–2026, to Nov 2026.
- The figures were taken from the analysis already gathered in this repo, `toss-myth/analysis/summary.json`. No code or assets from that project are used here.
- **Decided matches only:** ties (including super-over finishes), draws and no-results are excluded.
- **Coin-flip zone** = the 95% range a fair coin gives over the same number of games, 50 ± 1.96·√(0.25/n):
  - ODIs 48.0–52.0 (n = 2,487)
  - T20Is 48.4–51.6 (n = 3,530)
  - IPL 47.2–52.8 (n = 1,218)
  - For a ~45-game World Cup it is about 35–65%. Each tournament's own band runs from 34.1–65.9 (n = 38) to 36.0–64.0 (n = 49).
- **All formats:** 4,051 of 7,965, or 50.9% (95% CI 49.8–52.0).
- **Tests:**
  - Toss winner chose to bat: 283 of 496 decided Tests, 57.1% (CI 52.7–61.3).
  - Toss winner chose to bowl: 113 of 234, 48.3%.
- **IPL:**
  - Toss winner chose to bowl: 443 of 810, 54.7% (CI 51.2–58.1).
  - Toss winner chose to bat: 185 of 408, 45.3%.
- **T20 World Cups** (event "ICC Men's T20 World Cup"):
  - 2021: 30/45. Cricsheet withholds matches involving Afghanistan's men, so the five Afghanistan games were added from official scorecards; see `toss-myth/analysis/WC2021_AFGHANISTAN.md`.
  - 2022: 15/38. 2024: 23/41. 2026: 21/49. These three exclude Afghanistan games.
  - Dubai 2021: the chasing side won 12 of 13.
- The day-5 pitch is the usual explanation for the Test edge, not something the data measures.

## Audio

- **Narration:** Kokoro TTS (`af_heart` voice, speed 1.05). Word timings come from faster-whisper `base.en`, and the on-screen caption words are aligned to them, so numbers land exactly when they are spoken.
- **Cuts on the beat:** scene lengths are rounded up to whole beats of the 100 BPM score, so every cut lands on a beat.
- **Score:** synthesised in `scripts/gen-audio.mjs`. It is a D-minor groove (Dm–B♭–F–C) that follows the story:
  - a heartbeat kick under the hook, then the groove comes in for the evidence
  - drums drop out for a beat before 50.9% so the hit lands in silence
  - a riser into "the next World Cups" and a full drop
  - a breakdown of pads and plucks for "one real edge"
  - silence before "No.", then a resolve and a long last chord
- **SFX kit**, also synthesised: coin flick and landing (inharmonic metal partials), whip, whoosh, impact, stamp, tally ticks, tile flips, pop, ding, buzzer, cracking earth and a reverse swell.
- **Mix:** music is ducked under the narration. The master is two-pass loudnorm to −14 LUFS, −1.5 dBTP.

## Rebuild

```bash
npm install
# narration (only when scripts/voiceover.json changes; needs kokoro-onnx, soundfile, faster-whisper)
python scripts/gen-voice.py --kokoro <dir with kokoro-v1.0.onnx + voices-v1.0.bin> --whisper <faster-whisper base.en dir>
# score, SFX, render, cover, master
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
# check frames while editing
node scripts/stills.mjs out/bundle out/check 60 300 900
npx remotion studio src/index.ts
```

Outputs:
- `out/Toss_Truth_Reel.mp4`: the upload master.
- `out/Toss_Truth_Cover.png`: the grid cover.

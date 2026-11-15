# Beyond The Scoreboard — DLS (Duckworth–Lewis–Stern), Explained

A 108.8-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS. It is an original explainer of cricket's rain rule in the Beyond The Scoreboard scoreboard style, with animated rain, gauges and charts.

## The idea

- **The hook:** "Half the overs, so half the runs, right? Wrong." Team 1 makes 250 and rain cuts the chase to 25 overs. The run-rate answer, 126, is struck out and **≈170** is stamped in its place.
- **The story:** in 1992, an old rain rule left South Africa needing 21 off 1 ball, and two statisticians decided there had to be a fairer way.
- **One equation to remember: OVERS + WICKETS = RESOURCES.** It is built up visually: two "resource tanks", ten wicket lamps, a resource-curve chart, the two-thirds bar, then the par-score cards.

## Scenes

| # | Scene | What's on screen |
| --- | --- | --- |
| 1 | Hook | Rain-hit scoreboard: Team 1 250; Team 2's overs flip 50 → 25; TARGET 126? struck out; ≈170 stamped |
| 2 | 1992 | SOUTH AFRICA NEED 22 OFF 13 BALLS flips, in the rain, to 21 OFF 1 BALL (with the note that the scoreboard showed 22). Frank Duckworth and Tony Lewis; first used in 1997 |
| 3 | Two resources | An OVERS LEFT tank plus WICKETS IN HAND lamps, combining into "runs you can still score" |
| 4 | Wickets matter | 10 overs with 10 wickets in hand against 10 overs with 2 in hand (illustrative resource bars) |
| 5 | Resource % | Curves of resources left against overs left for 0, 2, 5 and 8 wickets down; 50 overs + 10 wickets = 100% |
| 6 | Back to the rain | 25 overs + 10 wickets fills past HALF? to ABOUT TWO-THIRDS; 250 × ⅔ ≈ 167; DLS target ≈170 against run-rate maths 126 |
| 7 | Par score | At the same point, 100/2 is AHEAD OF PAR and 100/6 is BEHIND PAR (more wickets lost means a higher par) |
| 8 | Stern, 2014 | Professor Steven Stern; DUCKWORTH · LEWIS · STERN flips to DLS; used in rain-hit ODIs and T20s |
| 9 | Outro | OVERS + WICKETS = RESOURCES; "save this for the next rain delay"; Beyond The Scoreboard |

## Accuracy

- **1992:** South Africa needed 22 off 13 balls. After a rain break, under the "most productive overs" rule, the revised target was 21 off 1 ball (the scoreboard famously showed 22). Sources: [The National](https://www.thenationalnews.com/sport/cricket/on-this-day-march-22-1992-south-africa-asked-to-score-21-from-one-ball-1.995515), [The Cricketer](https://www.thecricketer.com/Topics/news/world_cup_moments_-_no.44_a_nation_cruelly_denied_by_a_flawed_rule.html), [ESPNcricinfo](https://www.espncricinfo.com/ci/content/story/1219634.html).
- **History:** Duckworth and Lewis's method was first used in international cricket in January 1997 and adopted officially by the ICC in 1999. It was renamed Duckworth–Lewis–Stern in November 2014 after Professor Steven Stern's update. Source: [Wikipedia, DLS method](https://en.wikipedia.org/wiki/Duckworth%E2%80%93Lewis%E2%80%93Stern_method); [ESPN, how DLS works](https://www.espn.co.uk/cricket/story/_/id/19577040).
- **Resources:** the published Standard Edition tables put 25 overs remaining with no wickets lost at **66.5%** (2002) or 68.7% (2001). Source: [ESPNcricinfo D/L 2002 table](https://i.imgci.com/link_to_database/ABOUT_CRICKET/RAIN_RULES/DUCKWORTH_LEWIS_2002.html).
  - That gives 250 × ≈⅔ ≈ 167, a target of roughly 167–172, so "around 170" on screen. The run-rate answer is 250/50 × 25 = 125, so 126 to win.
  - The current Stern edition runs in official software and its table isn't published in the same form, so all example figures are labelled illustrative.
- **The curve chart** uses the method's exponential-decay family, calibrated so that 25 overs/0 down ≈ 66.5% and 10 overs/0 down ≈ 32%, both matching the published table. It is labelled as an illustrative shape.
- **The par-score example** (100/2 ahead, 100/6 behind) is qualitative and labelled illustrative; the real par depends on the target and overs remaining.

## Audio

- **Narration:** Kokoro TTS, `am_michael` voice (the series narrator) at a natural pace. It is a US-English voice; no premium Indian-English engine is available here.
- **Music and effects:** original, synthesized.
  - A suspense open under the rain and a stinger on "around 170".
  - A darker 1992 cue, then an explainer groove.
  - A timpani build into the reveal, a lift for DLS, and a resolve.
  - Rain on a stadium roof, flips, gauge "fills", wicket-lamp clicks, buzzers for wrong answers, stamps and a crowd groan.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>   # only if the script changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

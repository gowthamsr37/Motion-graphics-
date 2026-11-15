# Beyond The Scoreboard — LBW, Explained in 3 Lights

A 93.5-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS. It is an original explainer of the leg-before-wicket law (MCC Law 36), in the Beyond The Scoreboard scoreboard style.

## The idea (why it should travel)

- **The hook (first 2 seconds):** a ball smashes into the pad. It's shown hitting the stumps, the crowd appeals ("HOWZAT?!"), and the verdict is **NOT OUT**. On screen: "Why? The answer is at the end."
- **One device carries the whole rule:** three scoreboard lamps, **PITCH · IMPACT · WICKETS**. Any red light means not out; three green lights and the finger goes up.
- **The loop:** the reel ends with "Now you're the umpire". The hook ball is replayed with a 3-2-1 countdown, and the pitch mark is revealed outside leg stump. That pays off the opening and invites comments, saves and rewatches.

## Scenes

| # | Scene | What's on screen |
| --- | --- | --- |
| 1 | Hook | Broadcast-style pitch view: ball hits the pad, projection to the stumps, HOWZAT?!, NOT OUT stamp |
| 2 | Three questions | L·B·W = leg before wicket; the three lamps; "any red light = not out / all three green = out" |
| 3 | 1 · Pitch | Pitching lanes: outside off and in line (green), outside leg (red). Balls pitch in each lane. "Not out. Ever."; "Full toss? Skip question 1" |
| 4 | 2 · Impact | Impact plane: in line (green), outside leg (red), outside off (amber: "played a shot → not out / no shot → can be out"). The ghost batter moves to each impact |
| 5 | 3 · Wickets | Stumps target: one ball hitting (green), one going over the top and one turning past (red) |
| 6 | Two more rules | Hit the bat first → not LBW; a no-ball → not LBW |
| 7 | Recap | Three lamps turn green on "Pitch. Impact. Wickets."; the umpire's finger, OUT |
| 8 | You're the umpire | The hook ball replayed: impact green, wickets green, 3-2-1 countdown, pitch revealed outside leg, red light, NOT OUT |
| 9 | Outro | "Save this for the next LBW argument"; Beyond The Scoreboard; one click |

## Accuracy (MCC Law 36, Leg before wicket)

- **Pitch:** the ball must pitch in line or on the off side. Pitching outside leg stump is never out. A full toss skips this test.
- **Impact:** the point of impact must be in line, or outside off stump only if the batter made no genuine attempt to play the ball with the bat. Impact outside leg is never out. Impact above the bails is allowed; what matters is the next test.
- **Wickets:** but for the interception, the ball must have gone on to hit the wicket.
- **Not out if:** the ball touched the bat first, or the delivery is a no-ball.
- **Diagram:** right-handed batter, viewed from behind the bowler, so the **off side is on the left** and the **leg side on the right**; both are labelled on screen. Widths are stylised (stumps drawn wider than life) so the in-line zone reads on a phone.
- DRS / umpire's call is deliberately left out to keep the rule simple.

## Audio

- **Narration:** Kokoro TTS, `am_michael` voice (the series narrator) at a natural pace. It is a US-English voice; no premium Indian-English engine is available here.
- **Music:** original and synthesized. A suspense intro and stinger, then a light explainer groove that brightens with each question, a timpani roll under the quiz countdown, and a resolve.
- **Effects:** for each delivery, a release whoosh, a bounce tick and a leather-on-pad thump. Also a crowd "howzat" appeal, lamp clicks, a buzzer for red lights, verdict stamps and countdown ticks. Music ducks under the voice.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>   # only if the script changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

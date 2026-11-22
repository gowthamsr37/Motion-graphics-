# Beyond The Scoreboard — The No.3 File (Devdutt Padikkal, editorial cut)

A 105-second Instagram Reel: 1080×1920, 30 fps, mastered to −14 LUFS. It tells the same story as `../padikkal-no3`, but in a new, template-free style built for this reel: a cricket "case file" on warm paper.

## The look

- **Paper and ink.** A warm paper ground with fibres and grain; deep navy ink; saffron for Padikkal; cricket-ball red for the seam that stitches the film together.
- **The red seam.** It runs as the masthead's progress bar, wipes across every scene cut, draws the road in scene 4 and cracks the mirror in scene 6.
- **The "3".** A giant Anton numeral is drawn in outline at the start (the empty spot), fills saffron when Padikkal walks in, and returns behind the final photo.
- **Type.** Anton for numbers and names, Fraunces italic for the editorial voice, Inter Display for labels.
- **Photos.** The page's photos, cut out with BiRefNet so he stands in front of the graphics. The final shot is the full photo as a taped print with a red FOUND stamp.
- **Sound.** A quiet piano score (A minor, 84 BPM) that builds a pulse and then a kick. It hits on each big number, adds a ticking clock while the dots fill, and resolves to A major on "number three". Voice: Kokoro `am_michael`, the series narrator.

## Story

| # | Scene | On screen |
| --- | --- | --- |
| 1 | The revolving door | An outline "3"; a card reads CHETESHWAR PUJARA · LAST TEST · JUNE 2023, then spins like a door through Gill, Kohli, Rahul, Nair, Sai Sudharsan and Sundar; a tally of 7 batters · 3 years; the 3 fills saffron and Padikkal rises in front of it |
| 2 | Three scores | 167 (Galle) · 117 (Colombo) · 80 (Wellington) slam in |
| 3 | The door, in numbers | Lollipop chart of averages at No.3 since June 2023: Gill 37.4, Sai 31.9, Nair 27.8, Kohli 35.0, Sundar 30.0, Rahul 12.0 (2 innings each, muted), Padikkal 72.2; a dashed line marks Pujara's career 44.4 |
| 4 | The road | The camera tracks along a seam: 65 at Dharamsala (debut, No.4) → 0 at Perth → a dotted 21-month gap → 167 at Galle → 117 in Colombo → 80 in Wellington; footnote: Wadekar 143 (1968) is the only higher score for India at No.3 at the Basin Reserve |
| 5 | Measured in time | One dot per ball faced per dismissal: Pujara 101, the others 61, Padikkal 128; strike rate 43.9 v 56.5 |
| 6 | The mirror | Butterfly chart against Sai Sudharsan. First-class: average 44.6/42.9, hundreds 10/10, runs 4,011/3,004. A red crack, then Tests: average 71.1/31.9, hundreds 2/0, balls per dismissal 124/71, best 167/87 |
| 7 | Case closed | The saffron 3 behind a taped photo print; 7 innings · 498 runs · 71.1 · 2 hundreds; a red FOUND stamp lands on "number three"; brand lockup |

## Data

The numbers are the ones in `../padikkal-no3` (see its README for the full method). In short:

- **Tests:** [Cricsheet](https://cricsheet.org) ball-by-ball JSON (ODC-BY), plus Padikkal's 80 at Wellington and Sai Sudharsan's 81 in the 2026 Afghanistan Test, both added by hand. Cricsheet withholds Afghanistan matches, so Sai's balls per dismissal excludes that 81.
- **Batting position:** No.3 is the third batter to appear in the ball-by-ball order.
- **Period:** "Since Pujara" starts after the WTC final of 7 June 2023.
- **First-class:** ESPNcricinfo figures via the Wikipedia infoboxes (Padikkal, 19 Aug 2026; Sai Sudharsan, 9 Jul 2026). Sources disagree slightly, so the narration rounds them.

## Build

```bash
npm install
python3 scripts/gen-voice.py   # Kokoro TTS + word timings → public/vo, src/timeline.json
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```

`scripts/build.sh` regenerates the score and SFX (`scripts/gen-audio.mjs`), bundles, renders `out/Beyond_The_Scoreboard_Padikkal_The_No3_File.mp4` and its cover, then masters to −14 LUFS.

## Credits

- Photos: supplied by the page, background removed with BiRefNet.
- Fonts: Anton and Fraunces (SIL OFL, via Fontsource), Inter Display (SIL OFL).
- Data: Cricsheet (ODC-BY); first-class figures from ESPNcricinfo via Wikipedia.

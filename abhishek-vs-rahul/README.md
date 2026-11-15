# Beyond The Scoreboard — Abhishek Sharma vs KL Rahul: Same Runs. 473 Balls Apart.

A 124.8-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It is a T20I-only analytics documentary built in Remotion on the Beyond The Scoreboard (Adelaide scoreboard) system. The narration is the brief's script, word for word, at a natural pace, and scene lengths follow the voice.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Beyond_The_Scoreboard_Abhishek_vs_Rahul.mp4` | the finished Reel |
| `Beyond_The_Scoreboard_Abhishek_vs_Rahul_Cover.png` | 1080×1920 cover: SAME RUNS. 473 BALLS APART. / ABHISHEK SHARMA vs KL RAHUL / BEYOND THE SCOREBOARD |
| `Abhishek_vs_Rahul_Narration.mp3` | narration only, on the Reel's timeline |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## The eight required graphs, and where they are

| # | Graph | Scene | Data type |
| --- | --- | --- | --- |
| 1 | Career runs v balls faced: two lines end at the same height, a bracket marks **473 balls** (axes 0–1700 balls, 0–2500 runs) | 1 | career totals |
| 2 | Strike-rate gauges (0–250) and an equal-ball race: runs from the same 100 balls, 196 v 139, **+57 per 100 balls** | 2 | career totals |
| 3 | Balls per four / six: a six every **7.26 v 16.44** balls shown on a 33-ball strip; sixes, fours, balls per six and balls per boundary as paired bars | 3 | career totals |
| 4 | Boundary run share rings: **80.2% v 60.0%** | 3 | career totals |
| 5 | Strike rate by balls faced (1–5, 6–10, 11–20, 21–30, 31+), first 10 balls highlighted: **~180.3 v ~117.8** | 4 | **sample** (labelled) |
| 6 | Powerplay strike rate **191.4 v 128.9** (0–200), plus sample powerplay runs 1470 v 1097 | 5 | **sample**, individual batter (labelled) |
| 7 | Dot-ball estimates (~35% v ~34%; pace 37/38, spin 32/26), shown separately from career boundary-ball rates (32.5% v 17.8%). Wicket risk: balls per dismissal 16.7 v 27.1, average 32.87 v 37.75, 50+ scores 18 v 24 | 6, 7 | **approx. sample** / career (each labelled) |
| 8 | 18-ball powerplay simulation: **34.5 v 23.2 runs, +11.3**; illustrative team total **180 → 191 approx.** | 8 | **hypothetical model** (labelled, assumptions on screen) |

## Accuracy notes

- **T20Is only.** No IPL or domestic figures are used anywhere.
- **Career figures** are as supplied (ICC player records, cut-off 15 Nov 2026). Every derived value was cross-checked:
  - 2268/1155 = 196.36 and 2265/1628 = 139.13
  - balls per four, six and boundary match the supplied values
  - boundary runs: (216×4 + 159×6)/2268 = 80.2% and (191×4 + 99×6)/2265 = 60.0%
  - 2268/32.87 = 69 dismissals, so 1155/69 = 16.7 balls per dismissal; 2265/37.75 = 60 dismissals, so 1628/60 = 27.1
  - 50+ scores: 4+14 = 18 and 2+22 = 24
  - 18 × 1.914 = 34.45 and 18 × 1.289 = 23.20
- **Sample statistics** (first-ten-ball phases, powerplay, dot balls) are marked SAMPLE / APPROX. on screen. They are never mixed with career totals in the same bar: the dot-ball estimates and the career boundary-ball rates are deliberately separate graphics.
- **The 18-ball model** is labelled HYPOTHETICAL SCORING-RATE MODEL, "not a prediction of any match". Its assumptions (same conditions, teammates and other runs; dismissals ignored) are listed on screen, alongside the wicket-risk caveat.
- **Different eras:** Rahul played T20Is in 2016–2022 and Abhishek from 2024. Both player plates show their era.

## Photographs

Both player photos were **supplied by the creator**. Each was cut out of its original background (Abhishek's stadium, Rahul's grey studio) with BiRefNet-lite (MIT licence, run locally). Both cutouts are then placed on **one identical scoreboard-style backdrop**: night-stadium green, an amber floodlight glow and the same light bokeh. `src/components/Cutout.tsx` scales the two players to the same shoulder width and headroom, so every pair of frames matches.

| File | Shows | Used in |
| --- | --- | --- |
| `abhishek-cutout.png` | Abhishek Sharma in India's T20I kit, holding an award | opening comparison, wicket-risk scene, verdict, cover |
| `rahul-cutout.png` | KL Rahul in India's T20 kit (studio portrait) | opening comparison, wicket-risk scene, verdict, cover |

On screen, each photo is credited "SUPPLIED PHOTO · BACKGROUND REPLACED". Publishing rights for both photos rest with the creator. The powerplay scene keeps the two matching scoreboard player plates.

## Audio, and its limits

- **Narration:** Kokoro TTS, `am_michael` voice (the series narrator) at a natural 1.0× pace. It is a US-English voice, not Indian English; no premium Indian-English engine is available here. Names use hand-written phonemes ("a-BHI-shek SHAR-ma", "K L RAH-hul", "T twenty").
- **Music and effects:** all original, synthesized in `scripts/gen-audio.mjs`.
  - Suspense, then a pulse that quickens through the six-hitting and powerplay scenes.
  - The beat drops for the dot-ball twist, and a minor-key shift precedes the wicket-risk reveal.
  - A rising arpeggio ticks through the 18 simulated balls, with a cautionary note on "wicket risk".
  - A reflective D-major close, then one mechanical click.
- **Crowd ambience** and scoreboard flips, rattles and clunks are synced to the plates. Music ducks under every line.

## Rebuild

```bash
npm install
# only if the narration changes (needs kokoro-onnx, soundfile, faster-whisper):
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh   # BROWSER optional
npx remotion studio src/index.ts                              # edit live
```

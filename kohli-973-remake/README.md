# Beyond The Scoreboard — Virat Kohli: 973, The Season That Almost Had Everything (IPL 2016) — remake

A 97.7-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is a ground-up remake of the earlier 973 reel. Photographs, animated charts and the Adelaide scoreboard now share the screen, and every scene has a different layout.

The narration is the brief's script, word for word, at a natural pace. Scene lengths follow the voice.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Beyond_The_Scoreboard_Kohli_973.mp4` | the finished Reel |
| `Beyond_The_Scoreboard_Kohli_973_Cover.png` | 1080×1920 cover, "973 RUNS — VIRAT KOHLI — IPL 2016", inside the 1080×1440 grid crop |
| `Kohli_973_Narration.mp3` | narration only, on the Reel's timeline |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Scenes

| # | Scene | Visuals |
| --- | --- | --- |
| 1 | The hook | Full-bleed Chinnaswamy fireworks photo. 973 spins and lands on "thousand", then "27 SHORT OF 1,000" and "8-RUN FINAL DEFEAT" flip in. The title card arrives over the floodlights on "Virat Kohli's 2016 season" |
| 2 | The impossible season | Kohli in June 2016 beside a 000 → 973 count; innings, average 81.08, 100s and 50s flip on their words. **Orange Cap leaderboard** over the RCB stands: Kohli 973, Warner 848, de Villiers 687 on one 0–1000 scale |
| 3 | Four centuries | **Four century cards** fly in one at a time (century number, date, runs flip on the spoken score, balls, opponent), then settle into a 2×2 montage: FOUR CENTURIES · ONE SEASON |
| 4 | Nine stitches | Red RCB-flag backdrop. 113 counts up and lands with (50); strike rate 226.00; 15-over match. A **hand illustration** draws its nine stitches one by one (labelled as an illustration) |
| 5 | The road to 973 | Full-screen **season graph**: the cumulative total (0–1000) above the **16 innings bars** (0–120) on a shared innings axis. 50+ scores light up ("11 × 50+"), the four hundreds pulse amber, the line rises to 865 after 13 and 919 after 14, then INTO THE PLAYOFFS over the RCB crowd |
| 6 | The duck | QUALIFIER 1 · RCB vs GUJARAT LIONS · KOHLI 0 (2). A red lamp; the season line flattens 919 → 919. RCB QUALIFY FOR FINAL over RCB fans |
| 7 | The final | Genuine 29 May 2016 final photo. KOHLI 54 (35). SRH 208/7 vs RCB 200/7 on a 0–220 scale with the 8-run gap marked. The photo swaps to SRH with the trophy: SRH WON BY 8 RUNS |
| 8 | The legacy | Kohli 2016 photo beside the counter landing on 973, 04 centuries, 07 fifties and Orange Cap 2016, then "no trophy that year". The two closing lines over the fireworks; Beyond The Scoreboard; one click |

## Statistics (as supplied and verified in the brief; kept in `src/data.ts`)

- **Season:** 16 matches, 16 innings, 973 runs, average 81.08, strike rate 152.03, 4 hundreds, 7 fifties, 38 sixes, 83 fours, Orange Cap.
- **Innings:** 75, 79, 33, 80, 100, 14, 52, 108, 20, 7, 109, 75, 113, 54, 0, 54.
  - Cumulative: 75 … 865 (13) · 919 (14) · 919 (15) · 973.
  - There are 11 scores of 50 or more.
- **Centuries:**
  - 100* (63) v Gujarat Lions, 24 Apr
  - 108* (58) v Rising Pune Supergiants, 7 May
  - 109 (55) v Gujarat Lions, 14 May
  - 113 (50) v Kings XI Punjab, 18 May (15-over match, nine stitches). Strike rate 113/50 = 226.00.
- **Orange Cap:** Kohli 973, Warner 848, de Villiers 687.
- **Final:** SRH 208/7, RCB 200/7, Kohli 54 (35); SRH won by 8 runs.

## Photographs, and what was not available

Every photo is genuine, from Wikimedia Commons under a free licence, and is credited on screen with its real place and date.

| File | Shows | Credit / licence |
| --- | --- | --- |
| `final-2016-watson.jpg` | **IPL 2016 final, 29 May 2016**: SRH's Ashish Reddy running, with RCB's Shane Watson in the 2016 kit | Msnlalithprem · CC0 |
| `final-2016-trophy.jpg` | **SRH with the 2016 trophy, 29 May 2016** | Msnlalithprem · CC0 |
| `kohli-june-2016.jpg` | **Virat Kohli, June 2016** (Pro Kabaddi League opening) | Bollywood Hungama · CC BY 3.0 |
| `chin-fireworks-2014.jpg`, `chin-night-2014.jpg`, `chin-stand-2014.jpg`, `rcb-flag-2014.jpg`, `chin-crowd-2014.jpg`, `chin-flags-2014.jpg`, `chin-floodlights-2014.jpg` | RCB at the Chinnaswamy: fireworks, floodlights, stands, flags and fans, **May 2014**, used as atmosphere and captioned with that date | Ramesh NG · CC BY-SA 2.0 |

Source pages are in `public/photos/credits.json`.

**Not used, because no free licence exists:**
- The RCB and Indian Express galleries from the brief are copyrighted, so they are not used (and are not reachable from this environment).
- Commons has no freely licensed photo of Kohli batting in 2016, his hundreds, Kohli with de Villiers, the stitched hand, or Kohli after the final.

These moments are told with original graphics instead: century cards with a raised-bat emblem, a hand-stitches illustration labelled as such, and the charts. No photo is presented as something it is not, and nothing is AI-generated.

**To add licensed 2016 photos later:** drop them in `public/photos/`, add them to `src/photos.ts`, and swap the `id` in the relevant `PhotoFrame` / `FullBleed`.

## Audio, and its limits

- **Narration:** Kokoro TTS, `am_michael` voice (the series narrator) at a natural 1.0× pace. It is a US-English voice, not Indian English; no premium Indian-English engine is available here. Phonemes are tuned for Virat, Gujarat, Pune, Punjab and IPL.
- **Music, crowd and effects:** all original, synthesized in `scripts/gen-audio.mjs`.
  - Suspense in the hook, then a driving pulse for the big numbers.
  - Each century card a step higher in key.
  - A timpani roll into a full brass and crowd peak on 113.
  - The music drops out at the duck; sparse minor piano for the final.
  - A lift to D major on "Some seasons become history", then one mechanical click.
- **Mix:** music and crowd duck under every line; mechanical flips, rattles and clunks are synced to the plates. To audition the mix without the voice: `npx remotion render out/bundle Season973 out/bed.wav --codec wav --props '{"noVo":true}'`.

## Rebuild

```bash
npm install
# only if the narration changes (needs kokoro-onnx, soundfile, faster-whisper):
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh   # BROWSER optional
npx remotion studio src/index.ts                              # edit live
```

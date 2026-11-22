# Beyond The Scoreboard — The Pant File, presented

The same story as `../pant-file` (what happens to a Test when Rishabh Pant walks in), now presented on screen by an illustrated host. 149 seconds, 1080×1920, 30 fps, −14 LUFS.

## What changed from `pant-file`

- **Presenter:** `src/components/Presenter.tsx`. She's an original illustrated woman (early 20s), drawn in SVG in the paper-and-ink style: a navy blazer over a saffron top, a side-swept fringe and drop earrings. She sits in a round frame bottom-left, with the captions beside her.
  - **Lip-sync:** `analysis/mouth.py` reads the narration WAVs and writes `src/mouth.json`. The voice's loudness, measured every frame, sets how far the mouth opens. Kokoro's phonemes, spread across each sentence, set the shape: wide for i/e, round for o/u/w, closed for m/b/p, teeth for f/v.
  - **Life:** she blinks every 3–5 seconds, lifts her eyebrows while a number is spoken, glances up at the chart for about a second when a scene starts, and sways her head gently, more while talking. She smiles when silent, and a red dot shows while she speaks.
- **Voice:** Kokoro `af_heart`, a warm female voice, in place of `am_michael`. The script and pronunciation fixes are unchanged. The faster delivery brings the reel from 161 to 149 seconds, and every visual cue is re-timed to the new word timings.
- **Captions:** they move right (left 318 px) and drop to 50 px, to sit beside the host.

She's an illustration, not a photoreal AI person, so no AI-generated-people label is needed. Everything else, from the data to the photos and sources, is as in `../pant-file`.

## Build

```bash
npm run voice                                  # Kokoro af_heart + whisper word timings
$BTS_TOOLS/venv/bin/python analysis/mouth.py   # lip-sync → src/mouth.json
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

# Beyond The Scoreboard: Does winning the toss actually win matches?

A cinematic 3D data documentary for Instagram Reels.

- **Format:** 1080×1920 (9:16), 30 fps, 140.0 s.
- **Video:** H.264.
- **Audio:** AAC 48 kHz stereo, mastered to about −14 LUFS with a 4×-oversampled true-peak limiter (measured in the delivered MP4: −14.5 LUFS, −0.9 dBTP after AAC encoding).

Everything on screen is built in code:

- a real-time 3D cricket ground, coin, pitch, players and grass, rendered with three.js;
- 2D typography and graphs on an honest scale, from React/Remotion;
- an original synthesised score and sound design;
- male narration from an offline TTS model: the same `am_michael` narrator as the channel's earlier cricket Reels.

## The film

| # | Scene | What you see |
|---|---|---|
| 1 | Hook | An extreme close-up of a gold toss coin spinning in slow motion in front of a floodlit stadium. It freezes in mid-air on the line "barely improves your chances": **IPL 51.6%**, then **DOES THE TOSS REALLY MATTER?** |
| 2 | Four formats | Four pillars rise out of the outfield on one shared scale: 0% at the turf, 0.5 m per percentage point, and a glowing **50% coin-flip line** through all four. **Tests 54.3%** (n = 725), **ODIs 49.6%** (1,946), **T20Is 50.3%** (1,073), **IPL 51.6%** (1,218). The part of a pillar above 50% is gold, and the shortfall below 50% is a faint coral ghost. |
| 3 | You are the captain | First-person view at dusk. The four floodlight towers strike one after another, the camera looks down at the grass for dew, then at the coin on the pitch. **BAT FIRST** and **BOWL FIRST** cards appear, followed by a 3-2-1 countdown with a heartbeat. |
| 4 | The decision | Split screen. A bowler runs in on the top half (**BOWL FIRST 54.7%**, n = 810) and a batter takes guard on the bottom half (**BAT FIRST 45.3%**, n = 408). Both bars run 0–100% with a 50% tick. Then **CORRELATION ≠ CAUSATION**, with a diagram: match conditions → the captain's choice, and match conditions → the result. |
| 5 | Two seasons | The coin turns between **2024 (44%, 31 of 71)** and **2025 (61%, 43 of 70)**. Each season is a waffle chart with identical tile size and an identical 0–100% bar. A clearly labelled simulation re-runs a fair coin over 70 matches to show how much chance alone moves. The scene ends on **WHY SUCH A BIG DIFFERENCE?** No reason is claimed. |
| 6 | Day becomes night | The main spectacle. The camera descends from an aerial view while the afternoon runs through sunset to night: the sun sets, the clouds race, the floodlights strike and the city lights come on. At blade level, dew beads catch the lamps. **ESTIMATED TOSS EFFECT: daytime ~0, day-night +3.3 points.** On-screen notes say these are estimates, and that dew is one possible factor, not a measured cause. |
| 7 | Tests | **+4.9 points**, on the same effect scale as scene 6. A procedural pitch ages from **DAY 1** (fresh) to **DAY 3** (wear and footmarks) to **DAY 5** (cracks). A day-5 ball keeps low and the next one spits, against dots showing the day-1 trajectory. This is labelled as a representative illustration. |
| 8 | The lesson | A seven-shot montage: pitch inspection, the toss, a hot dry ground, sunset, dew, a worn pitch and a huddle. Then **TOSS → CHOICE → MATCH CONDITIONS → OUTCOME**, with a feedback arrow showing that conditions also shape the choice. |
| 9 | Verdict | The four values return, then **THE TOSS DOESN'T GUARANTEE VICTORY. CONDITIONS CHANGE EVERYTHING.** The coin falls, lands heads up, wobbles and clicks. **BEYOND THE SCOREBOARD**. A re-toss lifts the coin back into the exact opening frame, angle and spin rate included, so the Reel loops seamlessly. |

## Data

Every number shown lives in [`src/data.ts`](src/data.ts).

- **Toss-winner win rate (decided matches; draws, ties and no-results excluded):**
  - Figures: Tests 54.3% of 725, ODIs 49.6% of 1,946, T20Is 50.3% of 1,073, IPL 51.6% of 1,218.
  - The international samples are men's matches between ICC Full Members.
  - Sources: [HTFT Predictions](https://htftpredictions.com/does-winning-the-toss-win-cricket-matches.php) and [CricketStudio](https://players.cricketstudio.ai/research/toss-effect).
- **IPL by decision:**
  - Bowl or field first: 54.7%. Bat first: 45.3%.
  - These are observed associations, not causal effects.
- **IPL seasons:**
  - 2024: about 44% of 71 decided matches.
  - 2025: about 61% of 70.
  - The waffle charts show the whole-match counts these imply: 31/71 = 43.7% and 43/70 = 61.4%.
- **Estimated toss effect on win probability, in percentage points** (["Fairly Random", Sood & Willis](https://gsood.com/research/)):
  - International daytime limited-overs ≈ 0. Day-night +3.3. Tests +4.9.
  - This is a different statistic from the win rates. It is labelled that way on screen and never shown on the same axis as them.

**What was verified, and what was not.** The three source pages above could not be fetched from the build environment, which had no network route to those hosts. Their figures are used exactly as supplied in the brief. Where an independent check was possible, the figures were cross-checked against this repository's own Cricsheet analysis (`../toss-myth/analysis/summary.json`, Cricsheet data, ODC-By):

- IPL overall: 628/1,218 = **51.6%**, which matches exactly.
- IPL bowl first: 443/810 = **54.7%**; bat first: 185/408 = **45.3%**. Both match exactly. These are also the n values shown on screen.
- IPL 2024: 43.7% of 71 decided. IPL 2025: 61.4%. Only 70 decided matches gives 61.4%, which agrees with the brief's 70.
- The Test, ODI and T20I rates are **not** mixed with the earlier episode's Cricsheet figures, because the populations differ (that episode used all men's matches; this one uses Full Members only).
- The "Fairly Random" estimates could not be re-checked here.

**Simulation in scene 5.** The ticker shows seasons of 70 fair-coin tosses from a seeded generator, and it is labelled "Simulation" on screen. It illustrates sampling variation and is not a claim about any real season.

## Production

| Layer | How |
|---|---|
| 3D | **three.js**, rendered inside Remotion with software WebGL. See `src/three/*`.<br>• `stadium.ts`: elliptical ground, mown outfield and square, two crowd tiers, roof with lights, four floodlight towers with haze beams, LED boards, sightscreens, big screens and city lights.<br>• `env.ts`: one time-of-day value drives the sun, sky shader (clouds and stars), fog and exposure.<br>• `macro.ts`: struck-relief proof coin, with height maps drawn in code and reflections captured from the live stadium.<br>• `pitch.ts`: shader pitch whose single *wear* value drives colour, footmarks and a crack network.<br>• `grass.ts`: 42,000 instanced blades and water-drop shader beads.<br>• `players.ts`: jointed, posed figures.<br>• `director.ts`: every camera move, light and action as a pure function of film time.<br>• `engine.ts`: HDR + MSAA, lens blur for close-ups, bloom, ACES tone-mapping, grade and grain. |
| 2D | Remotion/React: `src/overlay/*` holds the graphs, labels, diagram and brand. `Subtitles.tsx` burns in karaoke subtitles driven by word timings. Everything stays inside the Reels safe area (y 236–1500, clear of the right-hand button rail). |
| Timing | `scripts/gen-voice.py` writes `src/timeline.json`. A speech recogniser listens to every narrated sentence, which both checks the words and gives per-word timings. `src/beats.ts` turns those into story beats that the 3D director, the overlays and the sound script all share. |
| Narration | **Kokoro-82M** TTS (Apache-2.0), voice `am_michael` (en-us, speed 1.05), the narrator used across the channel's earlier cricket Reels (toss-myth, DLS, LBW, Kohli, U19). Phoneme fixes: ODIs and IPL said as letters (as in toss-myth), a short breath in "to bat, won only", and a one-syllable "dyoo" for *dew* (the US "doo" sounds like "Do might…" at the start of a sentence). It is checked with **NVIDIA Parakeet-TDT 0.6B** (CC-BY-4.0) through sherpa-onnx. 96.5% of script words are recognised in the final mix. The remaining misses are ASR spellings such as "516" written out or "du" for *dew*. An earlier cut used the Indian-English `hm_omega` voice; switch back by changing `voice`/`lang`/`fix` in `scripts/voiceover.json` (see git history). |
| Music & SFX | `scripts/gen-audio.ts`, all original and synthesised. The score is D minor and resolves to D major for the brand: tension, then an energetic groove, suspense and a heartbeat, pizzicato surprise, a cinematic swell with bells for the time-lapse, a mallet pulse for the Test pitch, montage hits, and timpani into the resolve. The effects are a slow-motion coin spin whose glints follow the rendered rotation, a struck-metal freeze, floodlight contactors and ballast hum, bat on ball, pitch thocks, cracking soil, dew drips, countdown ticks, whooshes, a coin landing with wobble and click, and a day/night crowd bed. |
| Mix | `scripts/mix.sh`: music −9.5 dB, ducked about 12 dB under the voice; SFX −4 dB; limiter; two-pass loudnorm; then a true-peak limiter at 4× oversampling (ceiling −2 dB). |
| Fonts | Barlow Condensed, Inter and Instrument Serif (SIL OFL), bundled in `public/fonts`. |

## Rebuild

```bash
npm install
# narration and timeline: only needed if voiceover.json changes
python scripts/gen-voice.py --kokoro <dir with kokoro-v1.0.onnx + voices-v1.0.bin> --asr <sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8 dir>
python3 scripts/gen-srt.py        # subtitles.srt from the timeline
bash scripts/build.sh          # score, mix, chunked 3D render, mux, cover → out/deliver/
npx remotion studio src/index.ts   # live preview (pass input props {"audio": true} to hear the stems)
```

- **Render time:** the 3D renders with software WebGL (SwiftShader) at about 1 s per frame on 4 CPU cores, so the full film takes about 75 minutes. `render-chunks.sh` resumes if it is interrupted.
- **Deliverables:** `out/deliver/` holds the MP4, the cover PNG, `narration.wav`, `subtitles.srt` and `CAPTION.md`.
- **QC of the delivered file:** 4,200 frames at 30 fps (140.0 s), H.264 High 4.2 yuv420p, about 12 Mbps, AAC 256 kb/s with a 17 kHz rolloff (it stops the AAC encoder overshooting on the coin's metallic ring). It decodes without errors. Speech recognition on the delivered audio finds 97.3% of script words in the right time windows; the misses are spellings such as "du" for *dew* or numbers written out. The last frame flows into the first exactly as in the previous cut. Frames sampled across all nine scenes keep text inside the safe area.
- **Stems:** `public/audio/music.wav`, `public/audio/sfx.wav` and `public/vo/narration.wav` (plus one file per scene).

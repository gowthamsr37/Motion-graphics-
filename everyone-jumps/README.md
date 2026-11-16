# What If Everyone on Earth Jumped at the Exact Same Time?

A 61-second animated science YouTube Short. 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Everything is generated in code:

- the Earth, the crowds and the physics diagrams;
- the narration, made with a local text-to-speech model;
- the score and sound effects, synthesized from scratch.

The only outside images are NASA's Blue Marble and Black Marble Earth textures, which are public domain. They ship in the MIT-licensed `three-globe` npm package.

## The story

| # | Time | Beat | What's on screen |
|---|------|------|------------------|
| 1 | 0–4.7 s | **The question** | Push-in on a photoreal Earth. A counter climbs to 8,300,000,000. Fast cuts between Tokyo, Bengaluru, London and New York crowds getting ready. The title card asks "What if 8.3 billion people jumped at once?" |
| 2 | 4.7–13.5 s | **The countdown** | The globe turns past pinned cities, each showing its local time at 12:00 UTC. A 2×2 split screen follows: Tokyo 21:00, Bengaluru 17:30, London 12:00, New York 07:00. A 3-D countdown runs **3 · 2 · 1 · JUMP!**, timed to the narrator's words. Everyone takes off together, with a graphic pulse to mark the beat. |
| 3 | 13.5–19.6 s | **The big question** | Everyone freezes at the top of the jump (0.25 s, 30 cm). Then "Can humanity move the Earth?" Three dashed visuals, each tagged **HYPOTHETICAL**: a wobbling planet, a seismograph spike, and Earth knocked off its orbit. |
| 4 | 19.6–37.7 s | **The reveal** | "Almost nothing happens."<br>**Newton's third law** at Earth's horizon: equal and opposite arrows. The person is tagged *not to scale*.<br>**Mass:** 5.97 × 10²⁴ kg against ≈ 5 × 10¹¹ kg, or 12 trillion times heavier.<br>**Everyone in one spot:** Earth recoils, *exaggerated for visibility*. The real shift is 0.00000000000003 m, thousands of times smaller than an atom.<br>**Spread out:** pushes from all sides partly cancel, leaving a small net push. |
| 5 | 37.7–50.7 s | **The landing** | The landing in slow motion (0.3×), with small ripples at people's feet. Labels: "local noise" and "tiny vibrations nearby". Two panels compare "8.3 billion tiny taps" with "one earthquake". Earth carries on: no planet-wide quake, no tsunami, no change to its orbit. |
| 6 | 50.7–61.2 s | **The ending** | A tiny row of silhouettes ("That's us") on Earth's horizon. The camera pulls back to the whole planet. "8.3 billion people. One jump. Almost zero effect." Then: "What should we test next?" |

## Science check

The assumptions follow the brief: 8.3 billion people, an average mass of 62 kg (for illustration), a 30 cm jump and Earth's mass of 5.97 × 10²⁴ kg.

| Quantity | Working | Value | Where it appears |
|---|---|---|---|
| Mass of everyone | 8.3 × 10⁹ × 62 kg | 5.15 × 10¹¹ kg (≈ 5 × 10¹¹) | S4 data rows |
| Earth ÷ humanity | 5.97 × 10²⁴ ÷ 5.15 × 10¹¹ | 1.16 × 10¹³: "over ten trillion" (spoken), "12 trillion" (on screen) | S4 |
| Take-off speed | √(2 · 9.81 · 0.30) | 2.43 m/s | rig physics |
| Time in the air | 2v/g | 0.495 s, which is "about half a second" (peak at 0.247 s) | rig physics, S3 tag |
| Earth's recoil, all in one spot | (m/M) · 0.30 m | 2.6 × 10⁻¹⁴ m ≈ 0.00000000000003 m | S4 readout |
| Compared with an atom (~10⁻¹⁰ m) | 10⁻¹⁰ ÷ 2.6 × 10⁻¹⁴ | ~4,000× smaller | S4 |
| Landing energy (context, not stated in the video) | 8.3 × 10⁹ × 62 · 9.81 · 0.30 | ≈ 1.5 × 10¹² J in total, ≈ 180 J per person | — |

**How momentum works here:**

- Each person pushes down on the ground and the ground pushes back (Newton's third law), so Earth really does move. It is not "no force".
- The total momentum of Earth plus people stays zero. While everyone is in the air, Earth moves a tiny amount the other way, and it comes back when they land. The shared centre of mass never moves.
- None of this changes Earth's orbit.

**Spread out vs. in one spot:**

- People push "down", which means toward Earth's centre from wherever they stand. Spread around the globe, those pushes point in different directions and largely cancel.
- Because most people live in the Northern Hemisphere and in Asia, some push is left over. The leftover is still trillions of times too small to matter.
- The one-spot case is the worst case, and even that gives 2.6 × 10⁻¹⁴ m.

**Why there is no earthquake:**

- The ≈ 1.5 TJ of landing energy is split into 8.3 billion separate ~180 J taps, spread over the planet.
- Most of that energy is soaked up by people's legs and the ground nearby. Only a tiny part travels into the ground as seismic waves.
- An earthquake is different: it releases energy from one fault, deep underground, all at once. The video shows the two side by side and never treats the jump as one concentrated quake.

**The sun is in the right place:**

- The globe is lit for 12:00 UTC on 16 November: the subsolar point is at about 18.8° S, 3.8° W (declination −18.8°, equation of time +15.3 min).
- So the day/night line, the lit cities and the local times (Tokyo 21:00, Bengaluru 17:30, Lagos 13:00, London 12:00, São Paulo 09:00, New York 07:00) all match that moment.
- Near the end, Earth spins with the sun fixed in space, so the terminator holds still while the continents move under it.

**Visual honesty:**

- The hypotheticals are drawn as dashed ghosts and labelled HYPOTHETICAL.
- The recoil animation is labelled EXAGGERATED FOR VISIBILITY.
- The person in the force diagram is labelled PERSON NOT TO SCALE.
- The pulse at "JUMP!" is a graphic ring over the split screen, not a shockwave.

## How it's built

- **Remotion 4 + React.** Every frame is a pure function of the frame number (`src/`).
- **Earth (`src/components/Earth.tsx`).** A single Three.js shader quad that does ray–sphere intersection per pixel. It combines:
  - Blue Marble day colour and Black Marble city lights. The lights are extracted from the red channel, with a soft bloom from a coarse mip.
  - An ocean mask for the sun glint and a procedural cloud layer.
  - Fresnel atmospheric haze, an outer glow, filmic tone mapping, and seam-free mip sampling at the date line.
  - `project()` uses the same rotation as the shader, so pins, crowds and arrows sit exactly on the surface.
- **Clouds (`scripts/gen-clouds.py`).** 3D fractal noise sampled on the sphere, so there's no seam or pole pinch. There is more cloud in the tropics and storm tracks, and less over the subtropical deserts.
- **People (`src/components/Person.tsx`).** An articulated side-view rig (ankle, knee, hip, torso, shoulder, elbow, plantar flexion) with keyframed poses: ready, crouch, push-off, apex, pre-land, absorb, stand.
  - The flight is real ballistics: v₀ = 2.43 m/s, 0.495 s in the air, heights scaled to the figure.
  - Contact shadows shrink as people leave the ground. Crowds vary in height, build, hair and bags.
- **Cities (`src/components/City.tsx`).**
  - Sky, sun or moon, and lighting match each city's local time.
  - Landmark silhouettes are generic: a broadcast tower, a domed civic hall with palms, a clock tower with an observation wheel, and an art-deco tower. Procedural skylines have lit windows.
- **Narration (`scripts/gen-voice.py`).** Kokoro TTS (82M, ONNX), voice `af_heart`.
  - Word timings come straight from the model. The script exposes Kokoro's internal per-phoneme duration tensor as an extra ONNX output, where 1 unit = 600 samples at 24 kHz.
  - A small dynamic-programming aligner handles words espeak merges, for example "out of".
  - Captions, the countdown numerals and every visual beat key off these exact word times.
- **Captions (`src/components/Captions.tsx`).** Pages of up to 4 words, split at punctuation and balanced so no word is left on its own. Each word lights up on its audio onset.
- **Audio (`scripts/gen-audio.mjs`).** An original score and sound design synthesized in Node, with no samples. It reads the same timeline and repeats the scenes' beat maths, so every hit lands on its frame.
  - Music: a suspense pulse, then a countdown with timpani and a riser into the JUMP hit, then a suspended shimmer on the freeze.
  - Under the questions: tremolo strings. For the reveal: a warm pad and piano arpeggio. At the end: a resolving swell.
  - Effects: crowd murmur, the crowd's "hup!", whooshes, the slow-motion landing (dense low thumps), the quake rumble and UI ticks.
  - Music ducks under the voice. The master goes through a limiter and is loudness-normalized to −14 LUFS.
- **Safe zones.** Headlines start at y ≥ 250 and captions are centred at y = 1300, inside x 140–940. That keeps clear of the Shorts top bar, the bottom description and the right-hand button rail.

## Rebuild

```bash
npm install
# narration (only if the script changes): needs kokoro-onnx, onnx, soundfile
#   model files: kokoro-v1.0.onnx + voices-v1.0.bin from the kokoro-onnx GitHub releases
python scripts/gen-voice.py --model <dir with kokoro-v1.0.onnx and voices-v1.0.bin>
python scripts/gen-clouds.py          # only if you want a different cloud layer (needs numpy + pillow)
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh   # audio → bundle → render → −14 LUFS master
npx remotion studio src/index.ts      # live preview
```

The Earth is WebGL. On machines without a GPU, render with `--gl=swangle`, as `build.sh` does. On a 4-core CPU a full render takes about 28 minutes.

# IPL Orange Cap Winners 2008–2026 — Instagram Reel

A 70-second vertical (1080×1920) Reel of every IPL Orange Cap winner (the season's top run-scorer), built with [Remotion](https://remotion.dev)
using the `remotion-motion-graphics` skill.

- **Look:** the heritage Adelaide Oval scoreboard — black boards, yellow number plates that flip over,
  white names. Type is League Gothic + Oswald (free revivals of the condensed gothic the board is painted in).
- **Logos:** official franchise logos (`public/logos/`, from Wikipedia). Orange cap icon drawn in SVG.
- **Voice:** a natural-sounding voiceover generated locally with [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) (voice `am_michael`).
- **Sound:** synthesized 120 BPM track + SFX; every cut lands on a beat; music ducks under the voice;
  mastered to −14 LUFS.

| Section | What happens |
|---|---|
| Hook (4s) | "19 ORANGE CAPS. ONLY 15 PLAYERS." — a scoreboard batting list of all 15 lights up on "here they are" |
| Seasons (54s) | One cut per season, as long as its line: year plates flip, team logo, the batter, runs ticking up, a fact; the timeline fills with team colors |
| Tally (6s) | Orange Caps by team, SRH and RCB boxed as "most caps" (4 each) |
| Outro (6s) | "WHO WEARS IT IN 2027?" — "comment your pick" |

## Run it

```bash
npm install
npm run audio      # music + SFX -> public/audio (reads src/timeline.json)
npm run render     # -> out/orange-cap-reel.mp4
```

The voiceover (`public/vo/*.wav`) and `src/timeline.json` are committed, so rendering needs no model.
Master the audio for Instagram afterwards:

```bash
ffmpeg -i out/orange-cap-reel.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k out/reel-final.mp4
```

## Changing the voiceover

Edit `scripts/voiceover.json` (per-line `lang: "en-gb"` or hand-written `phonemes` fix names espeak gets wrong),
then regenerate the voice and the timeline — scene lengths follow the new line lengths automatically:

```bash
python -m venv .venv && .venv/bin/pip install kokoro-onnx soundfile faster-whisper
# model: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX  (onnx/model.onnx + voices/<voice>.bin)
# pack voices once:  numpy: np.savez("voices.npz", am_michael=np.fromfile("am_michael.bin", np.float32).reshape(-1, 1, 256))
.venv/bin/python scripts/gen-voice.py --model <dir with model.onnx + voices.npz> [--whisper <faster-whisper model dir>]
npm run audio
```

`--whisper` adds word timings, which the hook and outro use to land text exactly on the spoken words.

## Where things live

- `src/data.ts` — every Orange Cap (player, team as named that season, runs, fact).
- `src/theme.ts` — scoreboard palette, team colors and logo files, easings, springs.
- `src/timing.ts` + `src/timeline.json` — beat-quantized timeline derived from the voiceover.
- `src/scenes/` — Hook, Seasons, Tally, Outro. `src/components/` — layers, motion helpers, number plates, logos, orange cap.

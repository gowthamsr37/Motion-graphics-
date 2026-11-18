# Beyond The Scoreboard — Data Lab #01: Does winning the toss win matches?

A data-science retelling of the toss analysis (same data and figures as `../toss-myth`), told the way an analyst would work it in a notebook. 1080×1920, 30 fps, about 151 s, mastered to −14 LUFS.

## How it differs from the Myth Busters cuts

- **Look:** a dark Jupyter-style notebook. Typed, syntax-highlighted code cells (`In [n]:`), outputs (`Out [n]:`), a step rail (QUESTION → DATA → HYPOTHESIS → NOISE → TEST → PITFALLS → SEGMENTS → VERDICT), Space Grotesk / Inter / JetBrains Mono type and karaoke captions.
- **Narration:** a calm teacher voice (Kokoro `af_bella`) that walks the method instead of telling a cricket story: define H₀, simulate the noise, test, check the pitfalls, segment, conclude.
- **Charts:**
  - **Null distribution:** a histogram of 10,000 simulated fair-coin seasons (n = 2,487), drawn with a fixed seed, with the 48–52% band shaded.
  - **ODI test:** the observed 50.0% drops onto that histogram. p = 0.98.
  - **Forest plot:** win % and 95% CI for ODI, T20I and IPL, each with its own coin-flip zone. Tests sit outside theirs (54.2%, p = 0.02).
  - **Cherry-picking:** T20 World Cup bars (2021: 30/45; then 39%, 56%, 43%) over the 95% noise band for n ≈ 45.
  - **Regression to the mean:** a slope chart of the top-8 and bottom-8 "toss grounds", first half vs second half (64 → 42%, 39 → 47%), with r = −0.09 across 52 grounds.
  - **Segments:** Tests bat first 57.1% vs bowl first 48.3%; IPL bowl first 54.7% vs bat first 45.3%, with CIs.
  - **Verdict:** all formats 50.9%, 95% CI [49.8, 52.0], p = 0.12, so we fail to reject H₀. "Mostly noise."
- **Music:** an original lo-fi score at 86 BPM (Rhodes, pad, soft drums). It moves to a darker voicing for the pitfalls and drops out under "fail to reject". The UI sound kit includes typing, blips, sweeps and a stamp.

## Data

Every number comes from `analysis/summary.json`, copied from `../toss-myth` (Cricsheet, ODC-BY). See that project's README for the method, coverage and the Afghanistan note.

- The sample fixtures in the data-preview table come from `../toss-myth-viral/src/fixtures.json`.
- The code on screen is illustrative pandas/scipy that describes each step. The real pipeline is in `analysis/*.py`.

## Rebuild

```bash
python scripts/gen-voice.py --model <dir with kokoro model.onnx + voices.npz>   # only if the script changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```

`gen-voice.py` needs only `kokoro-onnx` and `soundfile`. Word timings for the captions are estimated from each sentence's phonemes, so no ASR model is needed.

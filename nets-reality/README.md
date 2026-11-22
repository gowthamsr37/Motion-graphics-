# Nets Reality: Expectation vs Reality

A no-voice motivational short for Beyond The Scoreboard (1080×1920, 30 fps, 19 s). It uses the
"Expectation vs Reality" sketch format. In the expectation, one ball goes for six. In the reality,
9,999 balls in the nets pile up first, then the six comes. The film ends on "Everyone wants the six.
Nobody sees the 9,999 balls before it."

- **Sound:** synthesised plucked-guitar loop plus SFX (bat tock, landings, crowd cheer). No narration and no samples.
  The music stops for a moment before the last ball.
- **Look:** hand-drawn "boiling" line wobble (SVG turbulence that reseeds every 4 frames) on warm paper, with grain and vignette.
- **Data sources:** none. "9,999" is a symbolic number for motivation, not a statistic.
- **Fonts:** Inter Display Black, Patrick Hand and Caveat (OFL; licences are in `public/fonts`).

## Build
```bash
npm install
BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell bash scripts/build.sh
```
`scripts/gen-audio.mjs` writes the shot schedule (`src/schedule.json`) that both the visuals and the audio follow.
Output goes to `out/`: the MP4 mastered to −14 LUFS and a cover still (frame 425).

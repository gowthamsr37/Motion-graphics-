# IPL Champions 2008–2026

A 54-second motion-graphics explainer of every Indian Premier League winner, built with
[Remotion](https://remotion.dev) using the `remotion-motion-graphics` skill.

1920×1080 · 30 fps · cut to a synthesized 120 BPM track (one bar = one season).

| Section | Length | What happens |
|---|---|---|
| Intro | 4s | Trophy + sunburst, "IPL CHAMPIONS" title |
| Seasons | 38s | One beat per season: year odometer, winner badge, runner-up, captain, a fact chip; the timeline at the bottom fills with each winner's color |
| Tally | 8s | Titles by franchise, one block per title |
| Outro | 4s | "19 seasons. 8 champions." |

## Run it

```bash
npm install
npm run audio      # synthesizes public/audio/*.wav (music bed + SFX), no downloads
npm run studio     # live preview
npm run render     # -> out/ipl-champions.mp4
```

If Remotion can't download its own browser, pass one explicitly, e.g.
`npx remotion render ... --browser-executable=/path/to/chrome-headless-shell`.

## Where things live

- `src/data.ts` — every final (winner, runner-up, captain, note). Add a season here and
  the timeline, tally and outro update; also bump `SECTION_BARS.seasons` in
  `src/timing.ts` and `BARS.seasons` in `scripts/gen-audio.mjs`.
- `src/theme.ts` — palette, team identity colors, easings, springs.
- `src/scenes/` — Intro, Seasons, Tally, Outro.
- `src/components/` — background/grade/grain/vignette layers, motion helpers, trophy, team badge.

Team badges use franchise names and colors only, no official logos.

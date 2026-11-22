# Motion-graphics repo: notes for Claude

Each folder is one Remotion video project (1080×1920 Instagram Reels). Always read `.claude/skills/remotion-motion-graphics/SKILL.md` before writing Remotion code.

## Series and their locked styles

| Series | Projects | Style source |
| --- | --- | --- |
| **Data Science Made Simple** (educational explainers) for Instagram **@curious_datascientist** | `types-of-data/` (approved reference), `mean-median-mode/`, `measures-of-dispersion/`, `centre-vs-spread/`, `outliers/`, `iqr/`, `treating-outliers/`, `skewness/`, `normal-distribution/`, `z-score/`, `probability-distribution/`, `population-vs-sample/`, `central-limit-theorem/`, `uniform-distribution/`, `binomial-distribution/`, `poisson-distribution/`, `exponential-distribution/`, `pareto-distribution/`, `lognormal-distribution/`, `bernoulli-geometric/`, `t-distribution/`, `chi-square-distribution/`, `which-distribution/` (the cheat sheet, v2), `confidence-intervals/`, `hypothesis-testing/`, `p-value/`, `type-1-type-2-errors/`, `ab-testing/`, `distributions-guide/` (the complete cheat sheet, v3), `confidence-intervals-v2/`, `p-value-v2/` and `hypothesis-testing-v2/` (simpler remakes with interview definitions), `which-test/` (the which-test cheat sheet, first video with the growth rules), `z-test/` (full worked z-test with the z table), `t-test-one-sample/` (one-sample t-test, the z-test follow-up; post first), `t-test/` (full worked two-sample t-test with the t table, part 2), `z-vs-t/` (z-test vs t-test comparison), `clt-uses/` (the CLT in real life: one election-poll example in detail, then "similarly used in" A/B tests, factories, insurance, ML; first video with the frame-0 title card) | `.claude/skills/data-science-explainer/SKILL.md` |
| **100 Days of Machine Learning** (the next @curious_datascientist series, one topic a day) | `ml-trailer/` (the trailer, old plum look), `ml-day-01-chalkboard/` (Day 1, **the approved CHALKBOARD look, the series style**), plus `ml-day-01-what-is-ml/` (notebook) and `ml-day-01-comic/` (comic book), the same Day 1 in the two looks that were tried and not chosen | **The CHALKBOARD look (user's pick, Nov 2026: "looks like classroom teaching"; replaces the navy template for ML):** green slate board with wooden frame and chalk tray, every stroke and letter through the `#chalkfx` grain filter, Kalam Bold titles + Kalam body that write themselves with a chalk stick (light `#chalktext` grain on letters, dark halo for contrast), bright high-luminance chalk palette, highlights as a chalk underline BELOW the word (never a band behind the letters), chalk-outlined notes held by magnets, a chalk-dust burst on the frame-0 title, eraser-wipe transitions, chalk subtitles (spoken word yellow + underlined), lo-fi study-beat score (82 BPM) with chalk scratch / squeak, eraser rub, magnet and chalk-tap SFX. Everything else (voice, pacing, growth rules, caption format, 175–179 s) follows the `data-science-explainer` skill. Kit and rules: `ml-day-01-chalkboard/README.md`. **Legibility rules (user feedback, Nov 2026):** words must always be brighter than any line, fill or highlight near them; never put coloured text on a band or fill of the same hue; no hatching or lines running through labels; text on a light fill must be dark; check every scene at phone size before delivering. Scaffold ML episodes with `REF=ml-day-01-chalkboard` and reuse its style-aware kit (`STYLE = "chalk"` in `src/theme.ts`; `src/components/NB.tsx`, `Doodles.tsx`, `NBCaptions.tsx`, `NBCta.tsx`, `Main.tsx`, `SoundTrack.tsx`, `scripts/gen-audio.mjs`). |
| Beyond The Scoreboard (cricket analytics/documentary) | `abhishek-vs-rahul/`, `kohli-*`, `ind-pak-u19-final/`, … | the latest project's `src/theme.ts` + README |

**Standing instruction from the user (Nov 2026):** keep every setting, theme and voice of *Types of Data Explained in 2 Minutes* consistent in future videos. For any new educational, explainer, statistics, data-science, ML or maths video, follow the `data-science-explainer` skill exactly. That means the same navy theme and 4-accent colour code, Sora / Inter / JetBrains Mono, Kokoro `af_heart` at 1.05×, word-synced subtitle style, 112 BPM F-major synthesized score and SFX kit, mix, −14 LUFS master, 30 fps, quiz + "Follow for data science made simple!" ending, cover and caption format. Scaffold new projects with:

```bash
REF=which-test bash .claude/skills/data-science-explainer/new-video.sh <folder> <CompId> <File_Stem>
```

Put the page handle @curious_datascientist on the end card, the cover and the caption.

**Growth rules (Nov 2026):** a title card from frame 0 that names the topic and everything the reel will cover (on screen within 2–3 s), problem/puzzle hooks and covers, A/B/C/D quiz options with a "VOTE IN THE CAPTION POLL" hint, a save moment, small purposeful animations, and a CAPTION.md with caption + poll + pinned comment and 5–8 hashtags. Details at the end of the `data-science-explainer` skill.

Deviate only when the user explicitly asks for something different.

## Repo conventions

- Commit each project folder including `public/audio` and `public/vo`; renders in `out/` are gitignored and are delivered to the user directly.
- Each project has a README (deliverables, storyboard, timestamped VO script, accuracy notes, rebuild steps) and a `CAPTION.md`.

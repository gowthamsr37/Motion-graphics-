# Motion-graphics repo: notes for Claude

Each folder is one Remotion video project (1080×1920 Instagram Reels). Always read `.claude/skills/remotion-motion-graphics/SKILL.md` before writing Remotion code.

## Series and their locked styles

| Series | Projects | Style source |
| --- | --- | --- |
| **Data Science Made Simple** (educational explainers) for Instagram **@curious_datascientist** | `types-of-data/` (approved reference), `mean-median-mode/`, `measures-of-dispersion/`, `centre-vs-spread/`, `outliers/`, `iqr/` | `.claude/skills/data-science-explainer/SKILL.md` |
| Beyond The Scoreboard (cricket analytics/documentary) | `abhishek-vs-rahul/`, `kohli-*`, `ind-pak-u19-final/`, … | the latest project's `src/theme.ts` + README |

**Standing instruction from the user (Nov 2026):** keep every setting, theme and voice of *Types of Data Explained in 2 Minutes* consistent in future videos. For any new educational, explainer, statistics, data-science, ML or maths video, follow the `data-science-explainer` skill exactly. That means the same navy theme and 4-accent colour code, Sora / Inter / JetBrains Mono, Kokoro `af_heart` at 1.05×, word-synced subtitle style, 112 BPM F-major synthesized score and SFX kit, mix, −14 LUFS master, 30 fps, quiz + "Follow for data science made simple!" ending, cover and caption format. Scaffold new projects with:

```bash
REF=iqr bash .claude/skills/data-science-explainer/new-video.sh <folder> <CompId> <File_Stem>
```

Put the page handle @curious_datascientist on the end card, the cover and the caption.

Deviate only when the user explicitly asks for something different.

## Repo conventions

- Commit each project folder including `public/audio` and `public/vo`; renders in `out/` are gitignored and are delivered to the user directly.
- Each project has a README (deliverables, storyboard, timestamped VO script, accuracy notes, rebuild steps) and a `CAPTION.md`.

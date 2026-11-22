# Beyond The Scoreboard: reel projects

Instagram Reels for the cricket page **Beyond The Scoreboard**: 1080×1920, 30 fps, cricket stories told through data. Each reel is its own Remotion project folder.

## House template: The File

For data analysis reels (player careers, comparisons, records, myth-busters), start from **`templates/the-file`**, the editorial paper-and-ink style approved for the Padikkal No.3 reel (`padikkal-film`):

```bash
bash templates/the-file/new-reel.sh <folder> "<masthead tag>" <Output_File_Name>
```

Read `templates/the-file/README.md` before building. It covers the look, the widgets, the story recipe, sound, photos and the QA checklist.

## Standing preferences

- **Storytelling with data:** hook in the first seconds, and explain every chart in the narration.
- **Pacing:** natural, never squeezed. Extra seconds are fine.
- **Narrator:** Kokoro `am_michael`.
- **Photos:** genuine and relevant only, in the right kit. Use photos the page supplies when it does.
- **Delivery:**
  - decode check, duration, −14 LUFS, a stills check
  - send the MP4, the cover and `CAPTION.md`
  - commit each reel with a README listing data sources

## Tools

- **Render browser:** `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
- **Long renders:** run `scripts/build.sh` in the background with a long timeout.
- **Python tools** (voice, word timings, cut-outs): `templates/the-file/scripts/setup-tools.sh`.

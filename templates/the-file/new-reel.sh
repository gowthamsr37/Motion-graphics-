#!/usr/bin/env bash
# Start a new reel from The File template.
# Usage:   bash templates/the-file/new-reel.sh <folder> "<masthead tag>" <Output_File_Name>
# Example: bash templates/the-file/new-reel.sh jaiswal-openers "The Opener File" Beyond_The_Scoreboard_Jaiswal_The_Opener_File
set -euo pipefail
[ $# -eq 3 ] || { sed -n 2,4p "$0"; exit 1; }
TPL="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$TPL/../.." && pwd)"
SLUG="$1" TAG="$2" NAME="$3"
DIR="$REPO/$SLUG"
[ -e "$DIR" ] && { echo "$DIR already exists"; exit 1; }
mkdir -p "$DIR"
tar -C "$TPL" --exclude=./node_modules --exclude=./out --exclude=./public/audio --exclude=./new-reel.sh --exclude=./README.md -cf - . | tar -C "$DIR" -xf -
cd "$DIR"
SLUG="$SLUG" TAG="$TAG" NAME="$NAME" python3 - <<'PY'
import os, re, pathlib
slug, tag, name = os.environ["SLUG"], os.environ["TAG"], os.environ["NAME"]
def sub(path, old, new, count=0):
    p = pathlib.Path(path); s = p.read_text(); p.write_text(s.replace(old, new) if not count else s.replace(old, new, count))
sub("package.json", '"name": "the-file"', f'"name": "{slug}"')
sub("package.json", '"description": "Beyond The Scoreboard — The File: editorial paper-and-ink template for cricket analysis reels"', f'"description": "Beyond The Scoreboard — {tag}"')
sub("package-lock.json", '"name": "the-file"', f'"name": "{slug}"', 2)
sub("scripts/build.sh", "NAME=${NAME:-Beyond_The_Scoreboard_The_File}", "NAME=${NAME:-" + name + "}")
sub("src/config.ts", 'file: "The File",', f'file: "{tag}",')
pathlib.Path("README.md").write_text(f"# Beyond The Scoreboard — {tag}\n\nBuilt from `templates/the-file` (see its README for the style guide, widgets and workflow).\n\n## Story\n\nTODO: scene table.\n\n## Data and sources\n\nTODO.\n")
PY
if [ -d "$TPL/node_modules" ]; then cp -r "$TPL/node_modules" .; elif [ -d "$REPO/padikkal-film/node_modules" ]; then cp -r "$REPO/padikkal-film/node_modules" .; else npm ci --no-audit --no-fund; fi
cat <<MSG
New reel ready: $DIR
  1. scripts/voiceover.json   write the narration (scene ids s1, s2, …; numbers as words in "text", digits in "caption")
  2. npm run voice            Kokoro voice + word timings → public/vo, src/timeline.json   (first time: bash scripts/setup-tools.sh)
  3. src/scenes/Story.tsx     one component per scene, keyed to wordAt()/sentence(); set STORY.sfx cues
  4. scripts/gen-audio.mjs    edit the two EDIT PER REEL blocks (events + arrangement)
  5. src/Cover.tsx, public/photos (cut-outs: scripts/cutout.py)
  6. node scripts/.stills.mjs <dir> <frames…> after a bundle, look, fix
  7. BROWSER=<chrome-headless-shell> bash scripts/build.sh   → out/$NAME.mp4
MSG

#!/usr/bin/env bash
# Scaffold a new "Data Science Made Simple" Reel from the approved reference (types-of-data/),
# keeping theme, fonts, components, voice/subtitle pipeline, SFX kit, mix and mastering identical.
#
# Usage (from the repo root):
#   bash .claude/skills/data-science-explainer/new-video.sh <folder> <CompId> <File_Stem>
#   e.g. bash .claude/skills/data-science-explainer/new-video.sh mean-median-mode MeanMedianMode Mean_Median_Mode_Explained
#
# Afterwards: write scripts/voiceover.json, run gen-voice.py, write src/scenes/*, adapt Main.tsx / SoundTrack.tsx /
# Cover.tsx and the section/event list in scripts/gen-audio.mjs (instruments, kit and mix stay as they are).
set -euo pipefail
[ $# -eq 3 ] || { sed -n '5,7p' "$0"; exit 1; }
DIR=$1; COMP=$2; STEM=$3
ROOT=$(git rev-parse --show-toplevel)
REF=$ROOT/types-of-data
DST=$ROOT/$DIR
[ -e "$DST" ] && { echo "$DST already exists"; exit 1; }

mkdir -p "$DST"/{src/components,src/scenes,scripts,public/fonts,public/vo,public/audio,reference}
cp "$REF"/{package.json,package-lock.json,tsconfig.json,.gitignore} "$DST"/
cp "$REF"/src/{theme.ts,fonts.ts,timing.ts,index.ts,Root.tsx,Main.tsx,SoundTrack.tsx,Cover.tsx} "$DST"/src/
cp "$REF"/src/components/*.tsx "$DST"/src/components/
cp "$REF"/scripts/{gen-voice.py,gen-audio.mjs,build.sh,export-srt.py,stills.mjs,sheet.py} "$DST"/scripts/
cp "$REF"/public/fonts/*.woff2 "$DST"/public/fonts/
cp -r "$REF"/src/scenes "$DST"/reference/scenes      # the approved scenes, for patterns (not compiled)
cp "$REF"/scripts/voiceover.json "$DST"/reference/voiceover.types-of-data.json

# names
sed -i "s/TypesOfData/$COMP/g" "$DST"/src/Root.tsx "$DST"/src/Main.tsx "$DST"/scripts/build.sh "$DST"/scripts/stills.mjs
sed -i "s/Types_of_Data_Explained/$STEM/g; s/Types_of_Data_Cover/${STEM}_Cover/g" "$DST"/scripts/build.sh "$DST"/scripts/export-srt.py
python3 - "$DST" "$DIR" "$COMP" <<'PY'
import json, sys, pathlib
dst, name, comp = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3]
p = json.loads((dst / "package.json").read_text())
p["name"] = name
p["description"] = f"{name}: Data Science Made Simple Reel"
p["scripts"]["render"] = f"remotion render src/index.ts {comp} out/raw.mp4 --codec h264 --crf 16"
(dst / "package.json").write_text(json.dumps(p, indent=2) + "\n")
lock = json.loads((dst / "package-lock.json").read_text())
lock["name"] = name
if "" in lock.get("packages", {}):
    lock["packages"][""]["name"] = name
(dst / "package-lock.json").write_text(json.dumps(lock, indent=2) + "\n")
# voiceover skeleton: same voice settings; hook + quiz + the series CTA
vo = {
    "voice": "af_heart", "lang": "en-us", "speed": 1.05,
    "scenes": [
        {"id": "s1", "title": "Hook", "lead": 0.45, "hold": 1.35, "segments": [
            {"text": "TODO hook line one.", "caption": "TODO hook line one,", "pause": 0.6},
            {"text": "TODO reveal.", "caption": "TODO reveal.", "pause": 0.3}]},
        {"id": "s8", "title": "Quiz and call to action", "lead": 0.35, "hold": 2.3, "segments": [
            {"text": "Quick quiz!", "caption": "Quick quiz!", "pause": 0.3},
            {"text": "TODO question?", "caption": "TODO question?", "pause": 5.7},
            {"text": "TODO answer!", "caption": "TODO answer!", "pause": 0.4},
            {"text": "TODO one-sentence why.", "caption": "TODO one-sentence why.", "pause": 0.55},
            {"text": "Follow for data science made simple!", "caption": "Follow for data science made simple!", "pause": 0.3}]},
    ],
}
(dst / "scripts" / "voiceover.json").write_text(json.dumps(vo, indent=1, ensure_ascii=False) + "\n")
PY
# Main.tsx / SoundTrack.tsx still reference the reference scenes: flag them for adaptation
for f in Main.tsx SoundTrack.tsx Cover.tsx; do
  sed -i "1i // ADAPT FOR THIS VIDEO: copied from types-of-data (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text." "$DST/src/$f"
done
sed -i "1i // ADAPT: keep instruments, section styles, SFX kit and mastering; rewrite the ev/sections timing for this video's scenes." "$DST/scripts/gen-audio.mjs"
echo "Scaffolded $DST (composition $COMP, files $STEM.*). Next: npm install, then follow .claude/skills/data-science-explainer/SKILL.md §11."

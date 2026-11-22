// Notebook mix: narration on top, the lo-fi score ducked under every line, and paper / pencil / marker SFX placed on the
// visual events (same word cues the scenes use, 2 frames early). A page-turn sound on every scene change.
import React from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { CLAMP } from "./components/Motion";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, sceneTiming, SceneId, voCues } from "./timing";

type Hit = { at: number; file: string; vol: number };
// this look's sound kit: the notebook SFX names map onto this style's sounds
const SFX_MAP: Record<string, string> = { "scribble.wav": "zip.wav", "scribble-short.wav": "pop.wav", "page.wav": "whoosh.wav", "marker.wav": "whip.wav", "sticky.wav": "boing.wav", "tap.wav": "pop.wav", "stamp.wav": "punch.wav" };

const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 4);
  return (f: number) => {
    let d = 0;
    for (const c of cues) {
      const a = c.from - 3;
      const b = c.from + c.duration + 3;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

const useHits = (): Hit[] => {
  const { fps } = useVideoConfig();
  const hits: Hit[] = [];
  const at = (id: SceneId) => {
    const base = sceneRange(fps, id).from;
    return (rel: number, file: string, vol: number) => hits.push({ at: base + rel - 2, file: SFX_MAP[file] ?? file, vol });
  };
  const T = (id: SceneId) => sceneTiming(fps, id);
  // page turns
  SCENE_IDS.slice(1).forEach((id) => at(id)(2, "page.wav", 0.32));

  { // S1 title
    const s = T("s1"), h = at("s1");
    h(2, "scribble.wav", 0.2);
    h(9, "scribble.wav", 0.18);
    h(20, "marker.wav", 0.22);
    h(26, "marker.wav", 0.18);
    h(24, "scribble-short.wav", 0.14);
    [s.cueS(1, "Rules"), s.cueS(1, "learns,"), s.cueS(1, "types."), s.cueS(1, "Save") - 6].forEach((f) => h(f, "tap.wav", 0.3));
    h(s.cueS(1, "Save") - 4, "sticky.wav", 0.35);
  }
  { // S2 hook
    const s = T("s2"), h = at("s2");
    h(s.sent(0).from - 4, "scribble.wav", 0.16);
    for (let i = 0; i < 12; i++) h(s.cueS(0, "dozen") - 6 + i * 2, "tap.wav", 0.1);
    ["face.", "Gmail", "YouTube", "Maps"].forEach((t, i) => {
      h(s.cueS(1, t) - 8, "scribble-short.wav", 0.18);
      h(s.cueS(1, t) - 2, `blip${i + 1}.wav`, 0.1);
    });
    h(s.cueS(1, "Gmail") + 14, "stamp.wav", 0.25);
    h(s.sent(2).from, "scribble.wav", 0.2);
    h(s.cueS(2, "learned."), "scribble-short.wav", 0.18);
  }
  { // S3 old way
    const s = T("s3"), h = at("s3");
    h(s.sent(0).from + 4, "scribble-short.wav", 0.16);
    h(s.cueS(1, "rule:") - 6, "sticky.wav", 0.35);
    [-4, 4, 12].forEach((d) => h(s.sent(2).from + d, "scribble-short.wav", 0.14));
    h(s.cueS(2, "Answers") - 6, "tap.wav", 0.25);
    h(s.cueS(3, "fr3e") - 8, "sticky.wav", 0.28);
    h(s.cueS(3, "fr3e"), "scribble.wav", 0.16);
    h(s.cueS(3, "breaks.") - 4, "scribble-short.wav", 0.24);
    h(s.cueS(3, "breaks.") - 2, "glitch.wav", 0.06);
    for (let i = 0; i < 5; i++) h(s.cueS(3, "millions") - 6 + i * 3, "sticky.wav", 0.16);
  }
  { // S4 ML flips it
    const s = T("s4"), h = at("s4");
    for (let i = 0; i < 3; i++) h(s.cueS(1, "thousands") - 8 + i * 5, "sticky.wav", 0.18);
    [s.cueS(1, "labelled:"), s.cueS(1, "not"), s.cueS(1, "not") + 8].forEach((f) => h(f, "stamp.wav", 0.16));
    h(s.sent(2).from - 6, "scribble-short.wav", 0.16);
    h(s.cueS(2, "itself.") - 2, "sticky.wav", 0.3);
    h(s.sent(3).from - 8, "scribble.wav", 0.14);
    h(s.cueS(3, "out.") - 4, "marker.wav", 0.25);
    h(s.cueS(3, "out.") + 4, "scribble-short.wav", 0.18);
  }
  { // S5 definition
    const s = T("s5"), h = at("s5");
    h(s.sent(0).from + 2, "sticky.wav", 0.3);
    [s.sent(1).from, s.cueS(1, "artificial"), s.cueS(1, "computers"), s.cueS(1, "instead")].forEach((f) => h(f - 2, "scribble.wav", 0.12));
    h(s.cueS(1, "patterns"), "marker.wav", 0.22);
    h(s.cueS(1, "explicitly"), "marker.wav", 0.22);
    h(s.sent(2).from - 4, "sticky.wav", 0.32);
  }
  { // S6 watch it learn
    const s = T("s6"), h = at("s6");
    h(s.cueS(1, "houses:") - 12, "scribble-short.wav", 0.16);
    for (let i = 0; i < 10; i++) h(s.cueS(1, "houses:") + 4 + i * 3, "tap.wav", 0.14);
    h(s.cueS(2, "guess.") - 6, "scribble-short.wav", 0.2);
    h(s.cueS(2, "terrible.") - 4, "scribble-short.wav", 0.18);
    h(s.cueS(3, "error.") - 10, "whoosh.wav", 0.12);
    h(s.cueS(3, "error.") - 2, "glide.wav", 0.1);
    [s.cueS(4, "nudges"), s.cueS(4, "again.", 0), s.cueS(4, "again.", 1)].forEach((f, i) => h(f - 2, `step${i + 1}.wav`, 0.2));
    const AF = s.sent(5).from, TINY = s.cueS(5, "tiny.");
    for (let f = AF; f < TINY; f += 3) h(f, "tick.wav", 0.05);
    h(TINY, "ding.wav", 0.25);
    ["Guess,", "measure", "adjust,", "repeat."].forEach((t) => h(s.cueS(5, t) - 4, "tap.wav", 0.22));
    h(s.cueS(5, "learning.") - 4, "chime.wav", 0.22);
  }
  { // S7 model
    const s = T("s7"), h = at("s7");
    h(s.cueS(0, "model:") - 8, "scribble.wav", 0.16);
    h(s.cueS(1, "never") - 6, "scribble-short.wav", 0.16);
    h(s.cueS(1, "1,500"), "tap.wav", 0.22);
    h(s.cueS(1, "predicts") + 6, "scribble-short.wav", 0.18);
    h(s.cueS(1, "predicts") + 10, "ding.wav", 0.18);
    h(s.cueS(2, "features.") - 2, "marker.wav", 0.22);
    h(s.cueS(2, "label.") - 2, "marker.wav", 0.22);
    h(s.sent(2).from - 4, "scribble.wav", 0.12);
  }
  { // S8 three types
    const s = T("s8"), h = at("s8");
    [s.cueS(1, "Supervised"), s.cueS(2, "Unsupervised"), s.cueS(3, "Reinforcement")].forEach((f, i) => {
      h(f - 6, "scribble-short.wav", 0.18);
      h(f + 8, "marker.wav", 0.2);
      h(f - 2, `step${i + 1}.wav`, 0.16);
    });
  }
  { // S9 circles
    const s = T("s9"), h = at("s9");
    h(s.cueS(0, "Artificial") - 6, "scribble.wav", 0.16);
    h(s.sent(1).from - 4, "scribble.wav", 0.14);
    h(s.cueS(1, "deep") - 4, "scribble-short.wav", 0.16);
    h(s.cueS(1, "ChatGPT,") - 4, "sticky.wav", 0.3);
  }
  { // S10 rule + save
    const s = T("s10"), h = at("s10");
    h(s.cueS(0, "normal") - 6, "sticky.wav", 0.3);
    h(s.cueS(0, "machine", 1) - 6, "sticky.wav", 0.3);
    h(s.cueS(0, "machine", 1) + 16, "marker.wav", 0.22);
    h(s.cueS(1, "Save") - 6, "scribble-short.wav", 0.2);
    h(s.cueS(1, "Save"), "pop.wav", 0.2);
    h(s.cueS(1, "send") - 4, "whoosh.wav", 0.25);
  }
  { // S11 poll, teaser, end card
    const s = T("s11"), h = at("s11");
    h(s.sent(0).from - 6, "stamp.wav", 0.35);
    h(s.cueS(0, "bank") - 8, "scribble-short.wav", 0.16);
    for (let i = 0; i < 4; i++) h(s.cueS(0, "type") + 4 + i * 4, "tap.wav", 0.18);
    h(s.cueS(0, "Vote") - 6, "pop.wav", 0.28);
    h(s.cueS(0, "Vote") + 6, "sparkle.wav", 0.18);
    h(s.sent(1).from - 2, "sticky.wav", 0.35);
    h(s.sent(1).from + 8, "sparkle.wav", 0.18);
    const FOLW = s.cueS(2, "Follow"), SIMPLE = s.cueS(2, "simple!");
    h(s.sent(2).from - 4, "scribble-short.wav", 0.16);
    h(FOLW - 4, "pop.wav", 0.3);
    h(FOLW + 10, "click.wav", 0.3);
    h(FOLW + 14, "button.wav", 0.45);
    h(SIMPLE - 4, "marker.wav", 0.25);
    h(SIMPLE + 4, "sparkle.wav", 0.22);
  }
  return hits;
};

export const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = useDuck(0.55, 0.2);
  const hits = useHits();
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {hits.map((x, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(x.at))} layout="none">
          <Audio src={staticFile(`audio/${x.file}`)} volume={x.vol} />
        </Sequence>
      ))}
    </>
  );
};

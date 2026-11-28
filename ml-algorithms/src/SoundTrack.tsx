// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Notebook mix: narration on top, the lo-fi score ducked under every line, and paper / pencil / marker SFX placed on the
// visual events (same word cues the scenes use, 2 frames early). A page-turn sound on every scene change.
import React from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { CLAMP } from "./components/Motion";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, sceneTiming, SceneId, voCues } from "./timing";

type Hit = { at: number; file: string; vol: number };
// this look's sound kit: the notebook SFX names map onto this style's sounds
const SFX_MAP: Record<string, string> = { "scribble.wav": "whoosh.wav", "scribble-short.wav": "pop.wav", "page.wav": "whip.wav", "marker.wav": "sparkle.wav", "sticky.wav": "pop.wav", "tap.wav": "tick.wav" };

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

  { // S1 hook + title card
    const s = T("s1"), h = at("s1");
    h(2, "impact.wav", 0.28);
    for (let i = 0; i < 12; i++) h(2 + i * 2, "tap.wav", 0.07);
    for (let i = 0; i < 4; i++) h(s.sent(0).from + i * 10, "pop.wav", 0.14);
    h(s.cueS(1, "Save") - 4, "sparkle.wav", 0.2);
  }
  { // S2 map
    const s = T("s2"), h = at("s2");
    ["Supervised", "Unsupervised", "reinforcement"].forEach((w, i) => h(s.cueS(1, w) - 4, `step${i + 1}.wav`, 0.22));
  }
  (["s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14"] as SceneId[]).forEach((id) => {
    const s = T(id), h = at(id);
    h(2, "whoosh.wav", 0.16);
    h(s.sent(0).from - 2, "stamp.wav", 0.2);
    h(s.sent(1).from + 4, "pop.wav", 0.12);
  });
  { // S15 which one
    const s = T("s15"), h = at("s15");
    ["number?", "Yes", "groups?", "columns?", "Images"].forEach((t) => h(s.cueS(0, t) - 2, "tap.wav", 0.22));
    h(s.cueS(1, "Screenshot") - 4, "sparkle.wav", 0.2);
  }
  { // S16 quiz + end card
    const s = T("s16"), h = at("s16");
    h(s.sent(0).from - 6, "stamp.wav", 0.35);
    for (let i = 0; i < 4; i++) h(s.cueS(0, "algorithm") + 4 + i * 4, "tap.wav", 0.18);
    h(s.cueS(0, "Vote") - 6, "pop.wav", 0.28);
    h(s.cueS(0, "Vote") + 6, "sparkle.wav", 0.18);
    const FOLW = s.cueS(1, "Follow"), SIMPLE = s.cueS(1, "simple!");
    h(s.sent(1).from - 4, "scribble-short.wav", 0.16);
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

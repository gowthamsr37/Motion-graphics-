// ADAPT FOR THIS VIDEO: copied from types-of-data (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// ADAPT FOR THIS VIDEO: copied from types-of-data (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Mix (house style): narration on top, the synthesized score ducked under every line, SFX placed on the visual events
// (computed from the same word cues the scenes use, 2 frames early so they feel in sync).
import React from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { CLAMP } from "./components/Motion";
import { theme } from "./theme";
import { sceneRange, sceneTiming, SceneId, voCues } from "./timing";

type Hit = { at: number; file: string; vol: number };

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
    return (rel: number, file: string, vol: number) => hits.push({ at: base + rel - 2, file, vol });
  };

  // S1 — hook
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const H0 = s.sent(0).from, C1 = s.sent(1).from, C2 = s.sent(2).from, D = s.sent(3).from, T = s.sent(4).from, END = s.duration;
    h(2, "whoosh.wav", 0.2);
    h(4, "pop.wav", 0.22);
    h(H0 + 4, "glide.wav", 0.16);
    h(H0 + 14, "pop.wav", 0.3);
    h(H0 + 30, "pop.wav", 0.22);
    h(C1 - 8, "whip.wav", 0.4);
    [0, 2, 4, 6].forEach((i) => h(C1 - 6 + i * 2, "tick.wav", 0.16));
    h(C1 + 12, "pop.wav", 0.3);
    h(C2 - 8, "whip.wav", 0.4);
    [0, 2, 4, 6, 8].forEach((i) => h(C2 - 12 + i * 2, "tick.wav", 0.15));
    h(C2 + 4, "clink.wav", 0.2);
    h(C2 + 12, "pop.wav", 0.3);
    h(D, "pop.wav", 0.35);
    h(D + 4, "click.wav", 0.25);
    [0, 1, 2].forEach((i) => h(D + 4 + i * 4, "pop.wav", 0.2));
    h(T, "whoosh.wav", 0.3);
    h(T + 6, "pop.wav", 0.35);
    h(T + 10, "click.wav", 0.25);
    h(T + 12, "pop.wav", 0.35);
    h(END - 15, "whoosh.wav", 0.35);
    h(END - 3, "sparkle.wav", 0.3);
  }
  // S2 — two questions
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    h(2, "sparkle.wav", 0.3);
    h(s.cueS(1, "centre?") - 2, "pop.wav", 0.4);
    h(s.cueS(1, "centre?"), "chime.wav", 0.2);
    ["mean,", "median", "mode."].forEach((w) => h(s.cueS(1, w) - 2, "click.wav", 0.28));
    h(s.cueS(2, "spread") - 2, "pop.wav", 0.4);
    ["range,", "variance", "standard"].forEach((w) => h(s.cueS(2, w) - 2, "click.wav", 0.28));
    h(s.duration - 20, "whoosh.wav", 0.4);
  }
  // S3 — which centre
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const CITY = s.sent(4).from;
    h(s.cueS(0, "centre"), "click.wav", 0.3);
    [1, 2, 3].forEach((i) => h(s.sent(i).from - 4, "whoosh.wav", 0.18));
    [s.cueS(1, "mode."), s.cueS(2, "mean."), s.cueS(3, "median.")].forEach((f, i) => h(f - 3, `step${i + 1}.wav`, 0.32));
    h(CITY - 2, "whoosh.wav", 0.28);
    [0, 2, 4, 6, 8].forEach((i) => h(CITY + i * 2, "tick.wav", 0.14));
    h(CITY + 6, "glide.wav", 0.2);
    h(s.cueS(4, "30,000,") - 2, "pop.wav", 0.4);
    h(s.cueS(4, "30,000,"), "sparkle.wav", 0.25);
    h(s.cueS(4, "50."), "stamp.wav", 0.3);
  }
  // S4 — when spread matters
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const RIVER = s.sent(2).from, WARN = s.cueS(2, "warns"), APPS = s.sent(3).from, PICK = s.sent(5).from;
    h(s.cueS(0, "spread?"), "click.wav", 0.3);
    h(s.sent(1).from - 2, "pop.wav", 0.3);
    h(RIVER - 10, "whoosh.wav", 0.3);
    h(s.cueS(2, "1"), "tick.wav", 0.3);
    h(s.cueS(2, "8.") - 4, "glide.wav", 0.35);
    h(WARN - 2, "stamp.wav", 0.3);
    h(WARN + 4, "pop.wav", 0.25);
    h(APPS - 4, "whoosh.wav", 0.3);
    [0, 2, 4, 6].forEach((i) => h(APPS + 2 + i * 2, "tick.wav", 0.15));
    h(APPS + 10, "pop.wav", 0.25);
    h(s.cueS(4, "3") - 2, "step1.wav", 0.35);
    h(s.cueS(4, "15.") - 2, "step3.wav", 0.4);
    h(PICK - 2, "ding.wav", 0.35);
    h(PICK, "sparkle.wav", 0.25);
  }
  // S5 — the IQR
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const SORT = s.sent(1).from, EXT = s.sent(2).from;
    h(s.cueS(0, "interquartile") - 2, "pop.wav", 0.4);
    [0, 3, 6, 9].forEach((i) => h(4 + i * 2, "tick.wav", 0.15));
    h(SORT, "shuffle.wav", 0.4);
    h(s.cueS(1, "middle") - 2, "pop.wav", 0.35);
    h(s.cueS(1, "middle"), "chime.wav", 0.2);
    h(s.cueS(1, "IQR.") - 2, "click.wav", 0.3);
    h(EXT + 2, "whoosh.wav", 0.35);
    h(EXT + 22, "ding.wav", 0.3);
  }
  // S6 — pair them up
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const MEANW = s.cueS(1, "Mean"), MEDW = s.cueS(2, "Median"), REACT = s.cueS(1, "react"), RESIST = s.cueS(2, "resist");
    h(s.cueS(0, "pair") - 2, "pop.wav", 0.35);
    [MEANW, MEDW].forEach((f) => {
      h(f - 2, "pop.wav", 0.3);
      h(f + 4, "click.wav", 0.25);
      h(f + 8, "pop.wav", 0.3);
    });
    h(REACT - 6, "glide.wav", 0.3);
    h(REACT + 8, "pop.wav", 0.25);
    h(RESIST - 6, "whoosh.wav", 0.25);
    h(RESIST + 8, "ding.wav", 0.3);
  }
  // S7 — complete picture
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(2, "sparkle.wav", 0.3);
    ["Balanced", "Skewed", "Categories:"].forEach((w, i) => h(s.cueS(i + 1, w) - 2, `blip${i * 2 + 1}.wav`, 0.3));
    ["mean", "median", "mode,"].forEach((w, i) => h(s.cueS(i + 1, w) - 2, "pop.wav", 0.28));
    h(s.cueS(3, "mode,") + 16, "sparkle.wav", 0.32);
    h(s.duration - 12, "whoosh.wav", 0.3);
  }
  // S8 — quiz + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, HOUSE = s.sent(1).from, MANS = s.cueS(1, "mansions."), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from, WHY = s.sent(4).from;
    const FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    [0, 1, 2, 3, 4, 5].forEach((i) => h(HOUSE - 4 + i * 2, "tick.wav", 0.15));
    h(MANS - 4, "impact.wav", 0.25);
    h(MANS - 4, "pop.wav", 0.35);
    h(MANS + 1, "pop.wav", 0.35);
    h(s.cueS(2, "best?") - 3, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    h(ANS + 8, "stamp.wav", 0.22);
    h(ANS + 20, "stamp.wav", 0.22);
    h(WHY + 2, "pop.wav", 0.3);
    h(FOL - 10, "whoosh.wav", 0.35);
    h(FOL - 4, "sparkle.wav", 0.3);
    h(FOLW - 2, "pop.wav", 0.35);
    h(FOLW + 2, "click.wav", 0.25);
    h(FOLW + 16, "button.wav", 0.5);
    h(SIMPLE - 8, "pop.wav", 0.3);
    h(SIMPLE + 4, "sparkle.wav", 0.25);
  }
  return hits;
};

export const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = useDuck(0.5, 0.16);
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

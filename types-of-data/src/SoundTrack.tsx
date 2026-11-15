// Mix: narration on top, the synthesized score ducked under every line, SFX placed on the visual events
// (computed from the same word cues the scenes use, a couple of frames early so they feel in sync).
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
    const H = s.cue("height,"), C0 = s.cue("city,"), R = s.cue("exam"), D = s.sent(3).from, T = s.sent(4).from, END = s.duration;
    h(2, "whoosh.wav", 0.25);
    h(H + 6, "pop.wav", 0.35);
    h(H + 9, "sparkle.wav", 0.18);
    h(C0 - 8, "whip.wav", 0.4);
    h(C0 + 6, "pop.wav", 0.45);
    h(R - 8, "whip.wav", 0.4);
    h(R + 5, "blip1.wav", 0.3);
    h(R + 9, "blip3.wav", 0.3);
    h(R + 14, "blip5.wav", 0.35);
    h(R + 18, "confetti.wav", 0.3);
    [0, 1, 2].forEach((i) => h(D + 3 + i * 4, "pop.wav", 0.25));
    h(T, "glitch.wav", 0.28);
    [0, 1, 2].forEach((i) => h(T + 2 + i * 4, "flip.wav", 0.25));
    h(END - 15, "whoosh.wav", 0.35);
    h(END - 3, "sparkle.wav", 0.3);
  }
  // S2 — big picture
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const SPLIT = s.cue("splits");
    h(SPLIT + 4, "whoosh.wav", 0.35);
    h(SPLIT + 20, "pop.wav", 0.4);
    h(SPLIT + 24, "pop.wav", 0.4);
    ["quantities:", "count", "measure.", "labels:", "names", "groups."].forEach((w) => h(s.cue(w), "click.wav", 0.3));
    h(Math.min(s.sent(3).from + 16, s.duration - 22), "whoosh.wav", 0.4);
  }
  // S3 — discrete
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const TWO = s.cue("two"), CLASS = s.sent(2).from, HALF_X = s.cueS(9, "students!");
    h(TWO + 6, "pop.wav", 0.28);
    h(TWO + 10, "pop.wav", 0.28);
    h(s.cue("discrete."), "click.wav", 0.3);
    h(CLASS - 8, "whoosh.wav", 0.25);
    h(CLASS + 6, "door.wav", 0.35);
    [3, 4, 5, 6, 7].forEach((k, i) => h(s.sent(k).from + 2, `blip${i + 1}.wav`, 0.42));
    h(s.cue("counted,"), "click.wav", 0.3);
    h(s.cueS(9, "3.5") - 2, "glitch.wav", 0.32);
    h(HALF_X, "stamp.wav", 0.55);
    h(HALF_X + 16, "pop.wav", 0.22);
    h(s.duration - 12, "whoosh.wav", 0.25);
  }
  // S4 — continuous
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const H = s.sent(1).from, TEMP = s.sent(2).from, JUMP = s.cue("jumps"), FLOW = s.sent(6).from, ROUND = s.cue("round");
    h(s.cue("continuous."), "click.wav", 0.3);
    h(H - 8, "whoosh.wav", 0.25);
    h(s.cue("165"), "glide.wav", 0.32);
    h(TEMP - 10, "whoosh.wav", 0.25);
    h(TEMP + 2, "glide.wav", 0.28);
    h(s.cue("gaps."), "pop.wav", 0.25);
    h(s.cue("measured.") - 4, "pop.wav", 0.35);
    h(s.cue("any"), "sparkle.wav", 0.25);
    h(ROUND + 4, "pop.wav", 0.35);
    h(JUMP - 6, "whoosh.wav", 0.22);
    [0, 1, 2, 3].forEach((k) => h(JUMP + k * 9 + 1, "hop.wav", 0.35));
    h(FLOW - 4, "glide.wav", 0.4);
    h(FLOW + 56, "ding.wav", 0.22);
    h(s.duration - 12, "whip.wav", 0.45);
  }
  // S5 — nominal
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const CAT = s.cue("categorical"), NO = s.cue("no"), RANK = s.cue("ranking."), SHUF = s.cue("Shuffle");
    h(CAT + 10, "pop.wav", 0.28);
    h(CAT + 14, "pop.wav", 0.28);
    h(s.cue("nominal."), "click.wav", 0.3);
    ["A,", "B,", "AB,", "O."].forEach((w) => h(s.cue(w) - 5, "flip.wav", 0.4));
    ["Bengaluru,", "Mumbai,", "Delhi."].forEach((w) => h(s.cue(w) - 5, "flip.wav", 0.4));
    [0, 1, 2, 3, 4].forEach((i) => h(NO + i * 2, "click.wav", 0.18));
    h(RANK, "stamp.wav", 0.28);
    h(RANK + 4, "pop.wav", 0.3);
    h(SHUF, "shuffle.wav", 0.5);
    h(SHUF + 17, "shuffle.wav", 0.45);
    h(s.cue("nothing"), "ding.wav", 0.28);
    h(s.duration - 13, "whoosh.wav", 0.3);
  }
  // S6 — ordinal
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const ORDER = s.cue("order"), EQUAL = s.cue("equal.");
    h(s.cue("ordinal."), "click.wav", 0.3);
    ["low,", "medium,", "high."].forEach((w, i) => h(s.cue(w) - 4, `step${i + 1}.wav`, 0.4));
    h(ORDER - 4, "whoosh.wav", 0.28);
    [0, 1, 2].forEach((i) => h(ORDER + i * 6, `step${i + 1}.wav`, 0.32));
    h(s.cue("Each") - 2, "hop.wav", 0.35);
    h(s.cue("above") - 2, "hop.wav", 0.35);
    h(s.cue("above") + 10, "sparkle.wav", 0.3);
    h(s.cue("gaps"), "pop.wav", 0.3);
    h(s.cue("gaps") + 5, "pop.wav", 0.3);
    h(s.cue("measured,") - 6, "glitch.wav", 0.16);
    h(EQUAL - 2, "pop.wav", 0.3);
    h(EQUAL + 6, "stamp.wav", 0.3);
    h(s.duration - 14, "whoosh.wav", 0.3);
  }
  // S7 — complete picture
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(2, "sparkle.wav", 0.3);
    h(s.cue("Numerical") - 1, "pop.wav", 0.35);
    h(s.cue("Categorical") - 1, "pop.wav", 0.35);
    ["discrete", "continuous.", "nominal", "ordinal."].forEach((w, i) => h(s.cue(w) - 2, `blip${i + 1}.wav`, 0.3));
    h(s.cue("ordinal.") + 16, "sparkle.wav", 0.32);
    h(s.duration - 12, "whoosh.wav", 0.3);
  }
  // S8 — quiz + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, Q = s.sent(1).from, QEND = s.sent(1).to;
    const CD0 = QEND + Math.round(0.2 * fps);
    const NOMW = s.cue("Nominal!"), IDW = s.cue("identifier,"), QTY = s.cue("quantity."), FOL = s.sent(4).from, FOLW = s.cue("Follow");
    h(QQ - 4, "pop.wav", 0.4);
    h(Q - 6, "whoosh.wav", 0.35);
    h(Q + 6, "hop.wav", 0.22);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(s.cue("categorical.") - 3, "whoosh.wav", 0.3);
    h(NOMW - 3, "tada.wav", 0.5);
    h(NOMW, "confetti.wav", 0.35);
    h(NOMW + 2, "ding.wav", 0.3);
    h(IDW - 3, "pop.wav", 0.3);
    h(IDW + 6, "pop.wav", 0.2);
    h(IDW + 11, "pop.wav", 0.2);
    h(QTY, "stamp.wav", 0.25);
    h(QTY + 5, "stamp.wav", 0.22);
    h(FOL - 10, "whoosh.wav", 0.35);
    h(FOL - 4, "sparkle.wav", 0.3);
    h(FOLW - 2, "pop.wav", 0.35);
    h(FOLW + 16, "button.wav", 0.5);
    h(s.cue("simple!") - 8, "pop.wav", 0.3);
    h(s.cue("simple!") + 4, "sparkle.wav", 0.25);
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

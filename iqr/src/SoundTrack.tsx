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

  // S1 — hook: the commute
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const H0 = s.sent(0).from, MOST = s.sent(1).from, JAMW = s.cueS(2, "jam:"), VARY = s.sent(3).from, R42 = s.cueS(4, "42"), I8 = s.cueS(5, "8."), DEC = s.cueS(6, "decode");
    h(2, "whoosh.wav", 0.18);
    for (let i = 0; i < 10; i++) h(H0 + 2 + i * 3, "pop.wav", 0.13);
    h(MOST + 4, "chime.wav", 0.2);
    h(MOST + 6, "pop.wav", 0.25);
    h(JAMW - 2, "impact.wav", 0.35);
    h(JAMW - 2, "beep-hi.wav", 0.2);
    h(JAMW + 2, "pop.wav", 0.28);
    h(VARY - 4, "whoosh.wav", 0.35);
    [0, 2, 4, 6, 8].forEach((d, i) => h(VARY + 4 + d, `blip${i + 1}.wav`, 0.13));
    h(R42 - 8, "glide.wav", 0.3);
    h(R42 + 6, "stamp.wav", 0.22);
    h(I8 - 4, "pop.wav", 0.4);
    h(I8 - 2, "sparkle.wav", 0.25);
    h(DEC - 6, "whoosh.wav", 0.3);
    h(DEC + 2, "impact.wav", 0.45);
    h(DEC + 3, "glitch.wav", 0.32);
  }
  // S2 — what it is
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const IQW = s.cueS(0, "interquartile"), HALF = s.sent(1).from, MID = s.cueS(1, "middle"), LOW = s.cueS(2, "lowest"), HIGH = s.cueS(2, "highest"), MEAS = s.cueS(2, "measure");
    [0, 6, 12].forEach((d) => h(IQW - 4 + d, "pop.wav", 0.32));
    [0, 6, 12].forEach((d) => h(IQW + 10 + d, "click.wav", 0.2));
    h(HALF - 6, "whoosh.wav", 0.25);
    [0, 1, 2, 3].forEach((q) => h(HALF - 4 + q * 3, "tick.wav", 0.15));
    h(MID - 2, "chime.wav", 0.25);
    h(LOW - 2, "whoosh.wav", 0.22);
    h(LOW + 4, "stamp.wav", 0.22);
    h(HIGH - 2, "whoosh.wav", 0.22);
    h(HIGH + 4, "stamp.wav", 0.22);
    h(MEAS - 4, "glide.wav", 0.28);
    h(MEAS + 6, "pop.wav", 0.32);
  }
  // S3 — quartiles
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const FOUR = s.cueS(0, "four");
    h(2, "pop.wav", 0.3);
    for (let i = 0; i < 12; i++) h(6 + i * 2, `blip${Math.min(5, 1 + Math.floor(i / 2.4))}.wav`, 0.1);
    [0, 3, 6].forEach((d) => h(FOUR - 2 + d, "flip.wav", 0.3));
    [0, 3, 6, 9].forEach((d) => h(FOUR + 4 + d, "tick.wav", 0.14));
    [1, 2, 3].forEach((i) => h(s.sent(i).from - 3, `step${i}.wav`, 0.32));
    h(s.sent(4).from + 2, "glide.wav", 0.25);
    h(s.cueS(4, "minus") - 6, "pop.wav", 0.35);
  }
  // S4 — how to calculate
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const SORTW = s.cueS(0, "sort"), MEDS = s.sent(1).from, C25 = s.cueS(1, "25"), C26 = s.cueS(1, "26."), SPLIT = s.sent(2).from, Q1W = s.cueS(3, "22."), Q3W = s.cueS(4, "30."), SUB = s.sent(5).from;
    const E30 = s.cueS(5, "30"), E22 = s.cueS(5, "22"), E8 = s.cueS(5, "8");
    h(2, "whoosh.wav", 0.2);
    for (let i = 0; i < 10; i++) h(4 + i * 2, "tick.wav", 0.12);
    h(SORTW - 2, "shuffle.wav", 0.4);
    h(MEDS - 4, "click.wav", 0.28);
    h(C25 - 2, "pop.wav", 0.25);
    h(C26 - 6, "glide.wav", 0.22);
    h(C26, "ding.wav", 0.28);
    h(SPLIT - 4, "click.wav", 0.28);
    h(SPLIT + 6, "whoosh.wav", 0.22);
    h(Q1W - 4, "step1.wav", 0.32);
    h(Q3W - 4, "step3.wav", 0.34);
    h(SUB - 4, "click.wav", 0.28);
    h(SUB - 2, "pop.wav", 0.3);
    [E30, E22].forEach((f) => h(f - 3, "pop.wav", 0.28));
    h(E8 - 3, "tada.wav", 0.32);
    h(E8, "sparkle.wav", 0.25);
  }
  // S5 — what it means
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const W22 = s.cueS(0, "22"), WIN = s.cueS(0, "window."), WORSE = s.cueS(1, "worse"), MOVE = s.cueS(1, "move");
    h(2, "whoosh.wav", 0.2);
    for (let i = 0; i < 10; i++) h(4 + i * 2, "tick.wav", 0.11);
    h(W22 - 4, "pop.wav", 0.35);
    h(WIN - 6, "chime.wav", 0.22);
    h(WORSE - 4, "hop.wav", 0.35);
    h(WORSE + 2, "glide.wav", 0.25);
    h(MOVE - 2, "ding.wav", 0.32);
  }
  // S6 — where it's useful
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.cueS(0, "IQR?") - 6, "pop.wav", 0.32);
    [
      { i: 1, w: "skewed" },
      { i: 2, w: "box" },
      { i: 3, w: "outliers:" },
    ].forEach((c, k) => {
      const f = s.cueS(c.i, c.w);
      h(f - 4, "whoosh.wav", 0.22);
      h(f - 2, `step${k + 1}.wav`, 0.28);
      h(f + 20, "pop.wav", 0.16);
    });
  }
  // S7 — the recipe
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(2, "sparkle.wav", 0.25);
    ["Sort.", "Find", "Subtract."].forEach((w, i) => {
      const f = s.cueS(1, w);
      h(f - 4, `blip${i * 2 + 1}.wav`, 0.3);
      h(f + 8, "click.wav", 0.2);
    });
    const PAIR = s.cueS(2, "median.");
    h(PAIR - 6, "impact.wav", 0.3);
    h(PAIR - 4, "sparkle.wav", 0.3);
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S8 — quiz + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, IQRQ = s.cueS(2, "IQR?"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from, WHY = s.sent(4).from;
    const WQ1 = s.cueS(4, "4"), WQ3 = s.cueS(4, "10."), FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    ["2,", "4,", "6,", "8,", "10,", "12."].forEach((w, i) => h(s.cueS(1, w) - 3, `blip${Math.min(5, i + 1)}.wav`, 0.22));
    h(IQRQ - 3, "pop.wav", 0.32);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 1, 2].forEach((i) => h(ANS + 8 + (i + 1) * 4, "stamp.wav", 0.18));
    h(WHY - 2, "whoosh.wav", 0.2);
    h(WQ1 - 3, "pop.wav", 0.3);
    h(WQ3 - 3, "pop.wav", 0.3);
    h(WHY + 2, "pop.wav", 0.3);
    h(FOL - 10, "whoosh.wav", 0.3);
    h(FOL - 4, "sparkle.wav", 0.28);
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

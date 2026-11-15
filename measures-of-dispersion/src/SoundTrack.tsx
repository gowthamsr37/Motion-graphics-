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
    [0, 1, 2, 3].forEach((i) => h(3 + i * 3, `blip${i + 1}.wav`, 0.18));
    [0, 1, 2, 3].forEach((i) => h(7 + i * 3, "tick.wav", 0.15));
    h(H0 + 4, "glide.wav", 0.16);
    h(H0 + 10, "pop.wav", 0.3);
    h(C1 - 8, "whip.wav", 0.4);
    h(C1 + 6, "pop.wav", 0.3);
    h(C1 + 8, "glide.wav", 0.18);
    h(C2 - 8, "whip.wav", 0.4);
    h(C2 - 8, "whoosh.wav", 0.22);
    h(C2 + 12, "pop.wav", 0.3);
    h(D, "pop.wav", 0.35);
    h(D + 4, "click.wav", 0.25);
    h(T, "glitch.wav", 0.28);
    h(T + 5, "whoosh.wav", 0.35);
    h(T + 8, "sparkle.wav", 0.25);
    h(END - 15, "whoosh.wav", 0.35);
    h(END - 3, "sparkle.wav", 0.3);
  }
  // S2 — big picture
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    h(2, "sparkle.wav", 0.3);
    [0, 6, 12, 18].forEach((d) => h(12 + d, "tick.wav", 0.14));
    h(s.cueS(0, "dispersion:") - 2, "pop.wav", 0.3);
    h(s.cueS(0, "dispersion:"), "chime.wav", 0.22);
    h(s.cueS(0, "spread") - 2, "whoosh.wav", 0.32);
    [s.cueS(1, "range,"), s.cueS(1, "variance,"), s.cueS(1, "standard")].forEach((f) => h(f - 2, "pop.wav", 0.4));
    h(Math.min(s.sent(2).from + 18, s.duration - 20), "whoosh.wav", 0.4);
  }
  // S3 — range
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const SC = s.sent(0).from, FREAK = s.cueS(4, "freak"), FOOL = s.cueS(4, "fool");
    h(SC - 4, "pop.wav", 0.22);
    h(SC + 8, "pop.wav", 0.22);
    [0, 1, 2, 3].forEach((i) => h(SC + 2 + i * 3, `blip${i + 1}.wav`, 0.25));
    [0, 1, 2, 3].forEach((i) => h(SC + 16 + i * 3, "tick.wav", 0.22));
    h(s.cueS(2, "range"), "click.wav", 0.3);
    h(s.sent(1).from, "glide.wav", 0.15);
    h(s.sent(1).from + 2, "click.wav", 0.28);
    h(s.cueS(3, "14"), "pop.wav", 0.35);
    h(s.cueS(3, "70"), "pop.wav", 0.38);
    h(s.sent(2).from + 4, "click.wav", 0.25);
    h(FREAK, "stamp.wav", 0.35);
    h(FREAK + 4, "glitch.wav", 0.2);
    h(FOOL + 22, "whoosh.wav", 0.2);
    h(s.duration - 12, "whoosh.wav", 0.25);
  }
  // S4 — variance
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const SQ = s.sent(3).from, AVGS = s.sent(5).from, C25 = s.cueS(5, "25.");
    [0, 1, 2, 3].forEach((i) => h(2 + i * 3, "pop.wav", 0.16));
    h(s.cueS(0, "Variance"), "click.wav", 0.3);
    [s.cueS(2, "7", 0), s.cueS(2, "1", 0), s.cueS(2, "1", 1), s.cueS(2, "7", 1)].forEach((f) => h(f - 4, "tick.wav", 0.3));
    [0, 1, 2, 3].forEach((i) => h(SQ + 6 + i * 3, "pop.wav", 0.3));
    [s.cueS(4, "49", 0), s.cueS(4, "1", 0), s.cueS(4, "1", 1), s.cueS(4, "49", 1)].forEach((f, i) => h(f, `blip${i + 1}.wav`, 0.25));
    h(AVGS + 2, "shuffle.wav", 0.35);
    h(s.cueS(5, "100") + 6, "click.wav", 0.25);
    h(C25 - 2, "ding.wav", 0.35);
    h(C25, "sparkle.wav", 0.25);
    h(s.cueS(6, "squared") - 2, "pop.wav", 0.25);
  }
  // S5 — standard deviation
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const ROOT = s.cueS(0, "root:"), TYP = s.cueS(1, "typical"), X5 = s.sent(3).from;
    h(2, "sparkle.wav", 0.2);
    h(ROOT - 2, "glide.wav", 0.35);
    h(ROOT + 8, "pop.wav", 0.3);
    h(s.cueS(0, "5.") - 2, "pop.wav", 0.4);
    h(TYP - 8, "whoosh.wav", 0.3);
    h(s.cueS(2, "5") - 2, "step1.wav", 0.35);
    h(s.cueS(2, "25.") - 2, "step3.wav", 0.4);
    h(s.cueS(2, "25.") - 2, "whoosh.wav", 0.25);
    h(X5 - 2, "pop.wav", 0.4);
    h(X5, "sparkle.wav", 0.3);
  }
  // S6 — bell curves
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const B2 = s.voEnd + 4;
    h(s.cueS(0, "bell-shaped") - 4, "glide.wav", 0.35);
    h(s.cueS(0, "two-thirds") + 4, "chime.wav", 0.3);
    h(s.cueS(0, "within"), "click.wav", 0.25);
    h(B2, "glide.wav", 0.35);
    h(B2 + 12, "chime.wav", 0.25);
    h(s.duration - 10, "whoosh.wav", 0.25);
  }
  // S7 — complete picture
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(2, "sparkle.wav", 0.3);
    ["Range:", "Variance:", "Standard"].forEach((w, i) => h(s.cueS(i + 1, w) - 2, `blip${i * 2 + 1}.wav`, 0.3));
    ["fragile.", "squared", "typical"].forEach((w, i) => h(s.cueS(i + 1, w) - 2, "click.wav", 0.25));
    h(s.cueS(3, "typical") + 16, "sparkle.wav", 0.32);
    h(s.duration - 12, "whoosh.wav", 0.3);
  }
  // S8 — quiz + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, CLS = s.sent(1).from, QEND = s.sent(3).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(4).from, WHY = s.sent(5).from;
    const FOL = s.sent(6).from, FOLW = s.cueS(6, "Follow"), SIMPLE = s.cueS(6, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(CLS - 4, "flip.wav", 0.3);
    h(CLS + 1, "flip.wav", 0.3);
    h(s.cueS(2, "5.") - 2, "pop.wav", 0.3);
    h(s.cueS(2, "15.") - 2, "pop.wav", 0.3);
    h(s.cueS(3, "consistent?") - 3, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    h(ANS + 12, "stamp.wav", 0.22);
    h(ANS + 16, "stamp.wav", 0.22);
    h(ANS + 6, "glide.wav", 0.2);
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

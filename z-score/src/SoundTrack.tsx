// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
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

  // S1 — hook: Maths 80 vs Science 70
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const W80 = s.cueS(0, "80"), W70 = s.cueS(0, "70"), WHICH = s.sent(1).from, MATHSW = s.cueS(2, "Maths"), ACT = s.cueS(2, "Actually,"), SCI = s.cueS(2, "Science!"), ZW = s.cueS(3, "zscore");
    h(2, "whoosh.wav", 0.16);
    h(W80 - 10, "pop.wav", 0.32);
    h(W70 - 10, "pop.wav", 0.32);
    h(WHICH - 8, "whoosh.wav", 0.2);
    h(MATHSW - 10, "glide.wav", 0.2);
    h(ACT - 10, "glitch.wav", 0.22);
    h(SCI - 8, "stamp.wav", 0.34);
    h(SCI + 12, "ding.wav", 0.24);
    h(ZW - 12, "whoosh.wav", 0.3);
    h(ZW - 6, "impact.wav", 0.42);
    h(ZW + 10, "pop.wav", 0.22);
  }
  // S2 — what it is
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const FAR = s.cueS(0, "far"), MARKS = s.cueS(1, "marks,"), STD = s.cueS(1, "standard");
    h(4, "pop.wav", 0.24);
    h(10, "pop.wav", 0.22);
    h(FAR - 6, "glide.wav", 0.22);
    h(MARKS + 6, "stamp.wav", 0.22);
    h(STD - 4, "hop.wav", 0.28);
    h(STD + 8, "hop.wav", 0.28);
    h(STD + 30, "ding.wav", 0.24);
  }
  // S3 — the formula
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    h(6, "pop.wav", 0.26);
    [s.cueS(1, "value,"), s.cueS(1, "subtract"), s.cueS(2, "divide")].forEach((f, i) => h(f - 10, `step${i + 1}.wav`, 0.26));
    h(s.cueS(2, "standard") - 8, "click.wav", 0.24);
    h(s.duration - 22, "chime.wav", 0.22);
  }
  // S4 — Maths / S5 — Science (the same beats)
  ([["s4", "75,", "10.", "80", "5.", "05"], ["s5", "60,", "5.", "70", "10.", "2"]] as const).forEach(([id, wm, wsd, wsc, wdiff, wres]) => {
    const s = sceneTiming(fps, id);
    const h = at(id);
    h(4, "whoosh.wav", 0.16);
    h(s.cueS(0, wm) - 8, "pop.wav", 0.28);
    h(s.cueS(0, wsd) - 8, "pop.wav", 0.26);
    h(s.cueS(1, wsc) - 8, "pop.wav", 0.3);
    h(s.cueS(1, "minus") - 6, "glide.wav", 0.22);
    h(s.cueS(1, wdiff) - 8, "click.wav", 0.24);
    h(s.cueS(2, "Divided") - 6, "hop.wav", 0.24);
    if (id === "s5") h(s.cueS(2, "Divided") + 6, "hop.wav", 0.24);
    h(s.cueS(2, wres) - 10, "ding.wav", 0.28);
    h(s.cueS(2, wres) + 6, "sparkle.wav", 0.2);
  });
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    h(s.sent(4).from - 12, "whoosh.wav", 0.26);
    h(s.sent(4).from + 4, "pop.wav", 0.24);
    h(s.sent(4).from + 12, "pop.wav", 0.24);
    h(s.cueS(4, "stronger") - 10, "tada.wav", 0.3);
  }
  // S6 — reading a z-score
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.sent(0).from - 6, "pop.wav", 0.26);
    h(s.cueS(1, "Positive") - 8, "glide.wav", 0.24);
    h(s.cueS(1, "Negative") - 8, "glide.wav", 0.24);
    h(s.sent(2).from - 8, "click.wav", 0.24);
    h(s.cueS(3, "bigger") - 8, "blip1.wav", 0.24);
    h(s.cueS(3, "bigger") + 8, "blip3.wav", 0.24);
    h(s.cueS(3, "unusual") - 8, "blip5.wav", 0.26);
  }
  // S7 — where it's used
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(s.cueS(0, "95") - 10, "glide.wav", 0.24);
    h(s.sent(1).from - 10, "whoosh.wav", 0.24);
    h(s.cueS(1, "flag.") - 8, "stamp.wav", 0.24);
    h(s.sent(2).from - 10, "whoosh.wav", 0.26);
    h(s.cueS(2, "age") - 8, "pop.wav", 0.24);
    h(s.cueS(2, "salary") - 8, "pop.wav", 0.24);
    h(s.cueS(2, "zscores,") - 4, "glide.wav", 0.26);
    h(s.cueS(2, "share") - 8, "ding.wav", 0.24);
  }
  // S8 — complete picture
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    h(s.sent(0).from - 2, "sparkle.wav", 0.25);
    [s.cueS(1, "distance"), s.cueS(2, "sign"), s.cueS(3, "compare")].forEach((f, k) => {
      h(f - 10, `blip${k * 2 + 1}.wav`, 0.26);
      h(f + 12, "click.wav", 0.18);
    });
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S9 — quiz + CTA
  {
    const s = sceneTiming(fps, "s9");
    const h = at("s9");
    const QQ = s.sent(0).from, H = s.sent(1).from, W165 = s.cueS(1, "165"), W7 = s.cueS(1, "7."), W151 = s.cueS(2, "151"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const W14 = s.cueS(4, "14"), DIV = s.cueS(4, "divided"), NEGW = s.cueS(4, "negative."), FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(H - 2, "glide.wav", 0.2);
    h(W165 - 8, "pop.wav", 0.26);
    h(W7 - 8, "pop.wav", 0.26);
    h(W151 - 8, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(W14 - 8, "glide.wav", 0.24);
    h(DIV - 6, "hop.wav", 0.24);
    h(DIV + 4, "hop.wav", 0.24);
    h(NEGW - 8, "pop.wav", 0.3);
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

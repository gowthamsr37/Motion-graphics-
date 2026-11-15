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
    const H = s.sent(0).from, C0 = s.sent(1).from, R = s.sent(2).from, D = s.sent(3).from, T = s.sent(4).from, END = s.duration;
    [0, 1, 2, 3, 4].forEach((k) => h(2 + k * 3, `blip${k + 1}.wav`, 0.2));
    h(H + 6, "glide.wav", 0.18);
    h(H + 12, "pop.wav", 0.35);
    h(C0 - 8, "whip.wav", 0.4);
    [0, 1, 2, 3, 4].forEach((k) => h(C0 + 2 + k * 3, "click.wav", 0.2));
    h(C0 + 16, "ding.wav", 0.28);
    h(R - 8, "whip.wav", 0.4);
    [0, 4, 8].forEach((d) => h(R - 10 + d, "flip.wav", 0.2));
    h(R + 18, "pop.wav", 0.35);
    h(R + 24, "sparkle.wav", 0.25);
    [0, 1, 2].forEach((i) => h(D + 4 + i * 4, "pop.wav", 0.25));
    h(T, "glitch.wav", 0.28);
    [0, 1, 2].forEach((i) => h(T + 2 + i * 4, "flip.wav", 0.25));
    [0, 1].forEach((i) => h(T + 14 + i * 4, "click.wav", 0.25));
    h(END - 15, "whoosh.wav", 0.35);
    h(END - 3, "sparkle.wav", 0.3);
  }
  // S2 — big picture
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    h(2, "sparkle.wav", 0.3);
    [0, 4, 8, 12, 16].forEach((n) => h(14 + n * 1.8, "tick.wav", 0.15));
    h(s.cue("central"), "chime.wav", 0.25);
    h(s.cue("central"), "pop.wav", 0.3);
    [s.cueS(1, "mean,"), s.cueS(1, "median,"), s.cueS(1, "mode.")].forEach((f) => h(f - 2, "pop.wav", 0.4));
    h(Math.min(s.sent(2).from + 18, s.duration - 20), "whoosh.wav", 0.4);
  }
  // S3 — mean
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const F0 = s.sent(0).from, POUR = s.sent(3).from, SHARE = s.sent(4).from;
    [0, 1, 2, 3, 4].forEach((k) => h(F0 + k * 3, "pop.wav", 0.18));
    [s.cueS(1, "5,"), s.cueS(1, "2,", 0), s.cueS(1, "8,"), s.cueS(1, "2,", 1), s.cueS(1, "3.")].forEach((f, k) => {
      h(f, `blip${k + 1}.wav`, 0.3);
      h(f + 2, "clink.wav", 0.25);
    });
    h(s.cueS(2, "mean"), "click.wav", 0.3);
    h(s.cueS(2, "fair") - 4, "pop.wav", 0.35);
    h(POUR + 4, "shuffle.wav", 0.4);
    h(POUR + 18, "clink.wav", 0.3);
    h(s.cueS(3, "20."), "pop.wav", 0.35);
    h(SHARE + 4, "shuffle.wav", 0.4);
    h(SHARE + 30, "clink.wav", 0.3);
    h(s.cueS(4, "4."), "chime.wav", 0.3);
    h(s.sent(5).from - 2, "pop.wav", 0.4);
    h(s.sent(5).from, "sparkle.wav", 0.25);
  }
  // S4 — median
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const MID = s.sent(3).from, EVN = s.sent(4).from, HALF = s.cueS(4, "halfway"), TWO = s.cueS(4, "two.");
    h(2, "pop.wav", 0.2);
    h(s.cueS(0, "median"), "click.wav", 0.3);
    h(s.sent(1).from + 8, "shuffle.wav", 0.45);
    [s.cueS(2, "2,", 0), s.cueS(2, "2,", 1), s.cueS(2, "3,"), s.cueS(2, "5,"), s.cueS(2, "8.")].forEach((f, k) => h(f, `blip${k + 1}.wav`, 0.3));
    h(MID, "stamp.wav", 0.25);
    h(MID + 9, "stamp.wav", 0.25);
    h(MID + 16, "ding.wav", 0.35);
    h(MID + 18, "sparkle.wav", 0.25);
    h(EVN - 2, "whoosh.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(EVN + 4 + i * 3, "flip.wav", 0.25));
    h(HALF, "click.wav", 0.3);
    h(TWO - 2, "pop.wav", 0.4);
    h(TWO + 6, "pop.wav", 0.3);
  }
  // S5 — mode
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const COMMON = s.cueS(0, "common"), MODE2 = s.cueS(1, "2."), CAT = s.sent(2).from, CATEG = s.cueS(2, "categories,"), FLAV = s.cueS(2, "flavour."), WIN = s.sent(3).from;
    h(2, "clink.wav", 0.2);
    h(s.cueS(0, "mode"), "click.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(COMMON + i * 3, "click.wav", 0.2));
    h(s.cueS(1, "Two"), "hop.wav", 0.3);
    h(MODE2 - 4, "pop.wav", 0.35);
    h(MODE2, "sparkle.wav", 0.3);
    h(CAT - 2, "whoosh.wav", 0.3);
    [0, 1, 2].forEach((i) => h(CATEG + i * 6, "clink.wav", 0.25));
    [0, 1].forEach((i) => h(FLAV + 4 + i * 4, "stamp.wav", 0.18));
    h(FLAV + 12, "click.wav", 0.25);
    h(WIN - 2, "ding.wav", 0.35);
    h(WIN, "sparkle.wav", 0.3);
  }
  // S6 — the outlier twist
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const C38 = s.cueS(1, "38"), JUMP = s.sent(2).from, STAY = s.sent(3).from, SAL = s.sent(4).from;
    h(0, "whoosh.wav", 0.3);
    [4, 8, 12].forEach((d) => h(d, "click.wav", 0.2));
    h(C38 - 8, "glide.wav", 0.4);
    h(C38 + 20, "impact.wav", 0.5);
    h(C38 + 16, "pop.wav", 0.3);
    h(JUMP + 4, "glide.wav", 0.3);
    h(STAY, "ding.wav", 0.3);
    h(SAL - 2, "pop.wav", 0.35);
    h(s.duration - 12, "whoosh.wav", 0.3);
  }
  // S7 — complete picture
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(2, "sparkle.wav", 0.3);
    ["Mean:", "Median:", "Mode:"].forEach((w, i) => h(s.cueS(i + 1, w) - 2, `blip${i * 2 + 1}.wav`, 0.3));
    ["balanced", "outliers.", "categories."].forEach((w, i) => h(s.cueS(i + 1, w) - 2, "click.wav", 0.25));
    h(s.cueS(3, "categories.") + 16, "sparkle.wav", 0.32);
    h(s.duration - 12, "whoosh.wav", 0.3);
  }
  // S8 — quiz + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, QEND = s.sent(1).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(2).from, SORT = s.sent(3).from, MIDW = s.sent(4).from;
    const FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    ["7,", "2,", "9,", "4,", "3?"].forEach((w) => h(s.cueS(1, w) - 4, "flip.wav", 0.3));
    h(s.cueS(1, "median") - 3, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    h(ANS + 8, "stamp.wav", 0.22);
    h(ANS + 12, "stamp.wav", 0.22);
    h(SORT + 2, "shuffle.wav", 0.4);
    ["2,", "3,", "4,", "7,", "9."].forEach((w, k) => h(s.cueS(3, w), `blip${k + 1}.wav`, 0.3));
    h(MIDW - 2, "ding.wav", 0.3);
    h(MIDW, "sparkle.wav", 0.25);
    h(FOL - 10, "whoosh.wav", 0.35);
    h(FOL - 4, "sparkle.wav", 0.3);
    h(FOLW - 2, "pop.wav", 0.35);
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

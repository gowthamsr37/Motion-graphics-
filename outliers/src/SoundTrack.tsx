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

  // S1 — hook: the café
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const H0 = s.sent(0).from, AVG = s.cueS(1, "40,000"), BIL = s.sent(2).from, WALK = s.cueS(2, "walks"), CR = s.cueS(3, "crore!");
    const CHG = s.cueS(4, "changed"), OUTW = s.cueS(5, "outlier!"), END = s.duration;
    h(2, "whoosh.wav", 0.18);
    h(4, "chime.wav", 0.16);
    for (let i = 0; i < 9; i++) h(H0 + 2 + i * 3, "pop.wav", 0.13);
    for (let i = 0; i < 9; i++) h(AVG - 6 + i * 2, "tick.wav", 0.11);
    h(AVG - 3, "pop.wav", 0.35);
    h(BIL - 2, "door.wav", 0.4);
    for (let f = BIL + 2; f < WALK + 14; f += 6) h(f, "click.wav", 0.12);
    h(WALK + 10, "clink.wav", 0.3);
    h(WALK + 10, "sparkle.wav", 0.22);
    h(CR - 8, "glide.wav", 0.35);
    h(CR + 10, "impact.wav", 0.4);
    [0, 3, 6].forEach((d) => h(CR + 12 + d, "pop.wav", 0.22));
    h(CR + 14, "stamp.wav", 0.45);
    h(CHG - 8, "whoosh.wav", 0.35);
    [0, 2, 4, 6, 8].forEach((d, i) => h(CHG - 4 + d, `blip${i + 1}.wav`, 0.14));
    h(CHG + 4, "glide.wav", 0.22);
    h(OUTW - 3, "impact.wav", 0.5);
    h(OUTW - 1, "glitch.wav", 0.35);
    h(OUTW, "pop.wav", 0.35);
    h(END - 10, "whoosh.wav", 0.25);
  }
  // S2 — what is an outlier
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const VAL = s.cueS(0, "value"), FAR = s.cueS(0, "far"), REST = s.cueS(0, "rest"), KINDS = s.sent(1).from, TWO = s.cueS(1, "two");
    h(4, "pop.wav", 0.4);
    h(6, "sparkle.wav", 0.25);
    h(VAL - 4, "whoosh.wav", 0.18);
    h(FAR - 4, "glide.wav", 0.3);
    h(FAR - 1, "pop.wav", 0.28);
    h(REST - 4, "chime.wav", 0.2);
    h(KINDS - 4, "whoosh.wav", 0.35);
    h(TWO - 2, "pop.wav", 0.35);
    h(TWO + 2, "pop.wav", 0.35);
    h(TWO + 4, "click.wav", 0.22);
    h(TWO + 9, "click.wav", 0.22);
    h(s.duration - 12, "whoosh.wav", 0.25);
  }
  // S3 — two kinds
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const MIS = s.cueS(0, "mistakes,"), TYPO = s.cueS(0, "typo"), T25 = s.cueS(0, "25"), T250 = s.cueS(0, "250."), REAL = s.sent(1).from, REALW = s.cueS(1, "real,");
    const at3 = [s.cueS(1, "billionaire,"), s.cueS(1, "festival"), s.cueS(1, "fraudulent")], WRECKW = s.cueS(2, "wreck");
    h(MIS, "click.wav", 0.3);
    h(TYPO - 8, "whoosh.wav", 0.25);
    for (let i = 0; i < 6; i++) h(TYPO - 2 + i * 3, "tick.wav", 0.12);
    h(T25 - 2, "click.wav", 0.32);
    h(T25 + 3, "click.wav", 0.32);
    h(T250 - 2, "click.wav", 0.35);
    h(T250 - 2, "stamp.wav", 0.32);
    h(T250 + 4, "whoosh.wav", 0.28);
    h(T250 + 18, "pop.wav", 0.35);
    h(T250 + 20, "glitch.wav", 0.22);
    h(T250 + 26, "pop.wav", 0.25);
    h(REAL - 8, "whoosh.wav", 0.3);
    h(REALW, "click.wav", 0.28);
    at3.forEach((f) => h(f - 4, "pop.wav", 0.35));
    h(at3[0] - 2, "clink.wav", 0.25);
    h(at3[1] - 2, "blip5.wav", 0.22);
    h(at3[2] - 2, "beep-hi.wav", 0.2);
    h(at3[2] + 14, "chime.wav", 0.22);
    h(WRECKW - 4, "impact.wav", 0.45);
    h(WRECKW - 2, "glitch.wav", 0.28);
  }
  // S4 — the IQR fence rule
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const IQRW = s.cueS(0, "IQR"), SC = s.sent(1).from, C50 = s.cueS(2, "50"), C62 = s.cueS(2, "62."), IQR12 = s.cueS(2, "12.");
    const STEP = s.sent(3).from, C18 = s.cueS(3, "18,"), C32 = s.cueS(4, "32"), C80 = s.cueS(4, "80."), JUMP = s.sent(5).from, OUTW = s.cueS(5, "Outlier!");
    h(4, "pop.wav", 0.35);
    h(IQRW - 2, "pop.wav", 0.32);
    h(IQRW, "chime.wav", 0.2);
    h(SC - 10, "whoosh.wav", 0.3);
    for (let k = 0; k < 11; k++) h(SC + 4 + k * 3, "tick.wav", 0.15);
    h(C50 - 4, "pop.wav", 0.35);
    h(C50 - 2, "click.wav", 0.22);
    h(C62 - 2, "click.wav", 0.22);
    h(IQR12 - 4, "pop.wav", 0.3);
    h(IQR12 - 2, "chime.wav", 0.22);
    h(STEP - 2, "pop.wav", 0.3);
    h(C18 - 10, "glide.wav", 0.3);
    h(C32 - 4, "step1.wav", 0.35);
    h(C80 - 4, "step2.wav", 0.38);
    h(JUMP - 2, "hop.wav", 0.45);
    h(JUMP + 12, "pop.wav", 0.32);
    h(JUMP + 14, "whoosh.wav", 0.15);
    h(OUTW - 3, "ding.wav", 0.35);
    h(OUTW, "sparkle.wav", 0.25);
  }
  // S5 — summary numbers
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    h(2, "whoosh.wav", 0.22);
    h(6, "pop.wav", 0.32);
    for (let i = 0; i < 9; i++) h(8 + i * 2, "tick.wav", 0.11);
    h(30, "pop.wav", 0.25);
    h(34, "clink.wav", 0.25);
    const rows = [
      { at: s.sent(1).from, hit: s.cueS(1, "crore!"), bad: true },
      { at: s.sent(2).from, hit: s.cueS(2, "41,000."), bad: false },
      { at: s.sent(3).from, hit: s.cueS(3, "crore!"), bad: true },
    ];
    rows.forEach((r) => {
      h(r.at - 4, "whoosh.wav", 0.22);
      if (r.bad) {
        h(r.hit - 14, "glide.wav", 0.32);
        h(r.hit + 2, "impact.wav", 0.35);
        h(r.hit + 4, "stamp.wav", 0.28);
      } else {
        [0, 4, 8].forEach((d) => h(r.hit - 12 + d, "tick.wav", 0.16));
        h(r.hit + 4, "ding.wav", 0.32);
      }
    });
  }
  // S6 — trends
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const SEC = s.cueS(0, "Second,"), PTSW = s.sent(1).from, RISE = s.cueS(1, "rising"), EIGHT = s.cueS(2, "8"), MISS = s.cueS(2, "missed"), FLAT = s.cueS(3, "flat,"), HELPS = s.cueS(3, "helps!");
    h(4, "whoosh.wav", 0.2);
    h(SEC - 2, "pop.wav", 0.32);
    for (let i = 0; i < 7; i++) h(PTSW + 2 + i * 3, i < 5 ? `blip${i + 1}.wav` : "blip5.wav", 0.16);
    h(RISE - 8, "glide.wav", 0.3);
    h(RISE + 6, "pop.wav", 0.3);
    h(EIGHT - 4, "whoosh.wav", 0.3);
    h(EIGHT + 10, "impact.wav", 0.4);
    h(MISS - 4, "pop.wav", 0.28);
    h(FLAT - 14, "glide.wav", 0.35);
    h(FLAT + 10, "stamp.wav", 0.28);
    h(HELPS - 6, "pop.wav", 0.3);
  }
  // S7 — complete picture
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(2, "sparkle.wav", 0.3);
    ["drag", "inflate", "tilt", "squash"].forEach((w, i) => {
      const f = s.cueS(i + 1, w);
      h(f - 2, ["blip1.wav", "blip2.wav", "blip4.wav", "blip5.wav"][i], 0.3);
      h(f + 8, "pop.wav", 0.18);
    });
    const DEL = s.sent(5).from, DELW = s.cueS(5, "delete"), NOT = s.cueS(5, "Not");
    h(DEL - 4, "whoosh.wav", 0.28);
    h(DELW - 6, "pop.wav", 0.35);
    h(NOT - 3, "stamp.wav", 0.5);
    h(s.duration - 12, "whoosh.wav", 0.3);
  }
  // S8 — quiz + teaser + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, C20 = s.cueS(1, "20"), C30 = s.cueS(1, "30."), OUTQ = s.cueS(2, "outlier?"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const F5 = s.cueS(4, "5"), F45 = s.cueS(4, "45."), ONLY = s.cueS(4, "Only"), NEXT = s.sent(5).from, TREAT = s.cueS(5, "treat");
    const FOL = s.sent(6).from, FOLW = s.cueS(6, "Follow"), SIMPLE = s.cueS(6, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(C20 - 4, "pop.wav", 0.3);
    h(C20 - 2, "click.wav", 0.22);
    h(C30 - 2, "click.wav", 0.22);
    h(OUTQ - 3, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 1, 2].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(F5 - 6, "step1.wav", 0.3);
    h(F45 - 6, "step2.wav", 0.32);
    [0, 1, 2, 3].forEach((i) => h(ONLY - 10 + i * 3, "tick.wav", 0.16));
    h(ONLY + 2, "pop.wav", 0.3);
    h(NEXT - 6, "whoosh.wav", 0.35);
    h(NEXT - 2, "sparkle.wav", 0.28);
    h(TREAT, "pop.wav", 0.3);
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

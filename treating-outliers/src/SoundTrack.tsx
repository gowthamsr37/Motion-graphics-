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

  // S1 — hook: just delete it?
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const FOUND = s.sent(0).from, DEL = s.sent(1).from, NOT = s.sent(2).from, WRONG = s.sent(3).from, IMP = s.cueS(3, "important"), SEVEN = s.sent(4).from;
    h(2, "whoosh.wav", 0.18);
    for (let i = 0; i < 12; i++) h(FOUND - 8 + i * 2, "tick.wav", 0.1);
    h(FOUND + 18, "pop.wav", 0.35);
    h(FOUND + 22, "click.wav", 0.22);
    h(DEL - 2, "pop.wav", 0.3);
    h(DEL + 4, "glide.wav", 0.25);
    h(NOT, "stamp.wav", 0.5);
    h(NOT + 2, "hop.wav", 0.3);
    h(WRONG - 2, "whoosh.wav", 0.25);
    h(IMP - 4, "sparkle.wav", 0.3);
    h(IMP, "chime.wav", 0.22);
    h(SEVEN - 4, "impact.wav", 0.45);
    h(SEVEN - 2, "pop.wav", 0.4);
    h(SEVEN + 4, "click.wav", 0.25);
    h(SEVEN + 8, "pop.wav", 0.35);
  }
  // S2 — ask why
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const KIND = s.sent(1).from, MIS = s.cueS(1, "mistake,"), PICK = s.sent(2).from;
    h(2, "pop.wav", 0.3);
    h(6, "pop.wav", 0.35);
    h(8, "glide.wav", 0.2);
    h(KIND - 8, "whoosh.wav", 0.3);
    h(MIS - 2, "pop.wav", 0.32);
    h(MIS + 2, "pop.wav", 0.32);
    for (let i = 0; i < 7; i++) h(PICK - 6 + i * 4, i < 3 ? `step${i + 1}.wav` : `blip${i - 2}.wav`, 0.22);
    h(s.duration - 10, "whoosh.wav", 0.22);
  }
  // S3 — mistakes: fix, fill, remove
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const FIXS = s.sent(0).from, FORM = s.cueS(1, "form"), CORR = s.cueS(1, "Correct"), FILLS = s.sent(2).from, MED = s.cueS(2, "median,"), ROW = s.cueS(2, "row.");
    const REMS = s.sent(3).from, TEST = s.cueS(3, "test"), REM = s.cueS(3, "remove"), NOTE = s.cueS(3, "note");
    for (let i = 0; i < 7; i++) h(4 + i * 3, "tick.wav", 0.12);
    h(FIXS - 2, "pop.wav", 0.32);
    h(FORM - 4, "flip.wav", 0.32);
    h(CORR - 2, "ding.wav", 0.32);
    h(FILLS - 2, "pop.wav", 0.32);
    h(MED - 6, "pop.wav", 0.28);
    h(MED + 2, "chime.wav", 0.22);
    h(ROW - 4, "click.wav", 0.22);
    h(REMS - 2, "pop.wav", 0.32);
    h(TEST - 2, "beep-hi.wav", 0.18);
    h(REM - 6, "pop.wav", 0.25);
    h(REM, "whoosh.wav", 0.3);
    h(REM + 14, "stamp.wav", 0.25);
    h(NOTE - 4, "click.wav", 0.28);
  }
  // S4 — cap it
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const FOUR = s.cueS(0, "four"), CAPS = s.sent(1).from, FENCE = s.cueS(1, "fence"), PULL = s.cueS(1, "pulled"), JAM = s.sent(2).from, C42 = s.cueS(2, "42."), COUNTS = s.cueS(3, "counts,"), WINS = s.cueS(3, "winsorizing.");
    [0, 4, 8, 12].forEach((d, i) => h(FOUR - 4 + d, `blip${i + 1}.wav`, 0.26));
    h(CAPS - 2, "pop.wav", 0.32);
    for (let i = 0; i < 10; i++) h(CAPS + i * 2, "tick.wav", 0.1);
    h(FENCE - 4, "step1.wav", 0.3);
    h(FENCE, "step2.wav", 0.3);
    h(PULL - 2, "glide.wav", 0.32);
    h(PULL + 16, "clink.wav", 0.28);
    h(JAM - 2, "pop.wav", 0.3);
    h(C42 + 2, "pop.wav", 0.28);
    h(COUNTS - 4, "ding.wav", 0.28);
    h(WINS - 6, "sparkle.wav", 0.25);
  }
  // S5 — transform it
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const TR = s.sent(0).from, STEP = s.cueS(1, "step"), SQ = s.cueS(1, "squeezes"), BAL = s.cueS(2, "balanced,"), MEAN = s.cueS(2, "mean");
    h(TR - 2, "pop.wav", 0.32);
    for (let i = 0; i < 12; i++) h(TR + 2 + i * 2, "tick.wav", 0.1);
    [0, 4, 8, 12].forEach((d, i) => h(STEP - 6 + d, `step${Math.min(3, i + 1)}.wav`, 0.24));
    h(SQ - 4, "glide.wav", 0.35);
    h(BAL + 2, "chime.wav", 0.25);
    h(MEAN - 6, "whoosh.wav", 0.2);
    h(MEAN + 6, "ding.wav", 0.3);
  }
  // S6 — robust tools
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const ROB = s.sent(0).from, BAR = s.cueS(0, "barely"), MEDW = s.cueS(1, "median"), MEANW = s.cueS(1, "mean"), STAYS = s.cueS(2, "stays."), DRAG = s.cueS(2, "drag");
    h(ROB - 2, "pop.wav", 0.32);
    h(BAR - 4, "pop.wav", 0.25);
    h(MEDW - 4, "whoosh.wav", 0.22);
    h(MEANW - 4, "whoosh.wav", 0.22);
    h(STAYS - 6, "glide.wav", 0.3);
    h(STAYS + 10, "ding.wav", 0.28);
    h(DRAG - 4, "stamp.wav", 0.28);
  }
  // S7 — keep it and study it
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    const KEEP = s.sent(0).from, PAY = s.sent(1).from, FRAUD = s.cueS(1, "fraud."), STORY = s.cueS(2, "story!");
    h(KEEP - 2, "pop.wav", 0.32);
    for (let i = 0; i < 18; i += 2) h(KEEP + 6 + i, "tick.wav", 0.1);
    h(PAY - 4, "impact.wav", 0.3);
    h(PAY - 2, "pop.wav", 0.32);
    h(FRAUD - 8, "glide.wav", 0.22);
    h(FRAUD - 4, "beep-hi.wav", 0.3);
    h(STORY - 6, "sparkle.wav", 0.25);
    ["Flag", "dig", "report"].forEach((w, i) => h(s.cueS(2, w) - 4, `step${i + 1}.wav`, 0.28));
  }
  // S8 — complete picture + golden rule
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    h(s.sent(0).from - 2, "sparkle.wav", 0.25);
    h(s.cueS(1, "Mistakes:") - 2, "pop.wav", 0.3);
    h(s.cueS(2, "Real") - 2, "pop.wav", 0.3);
    ["fix,", "fill,", "remove.", "cap,", "transform,", "robust,", "keep"].forEach((w, i) => h(s.cueS(i < 3 ? 1 : 2, w) - 3, `blip${(i % 5) + 1}.wav`, 0.24));
    h(s.sent(3).from - 2, "chime.wav", 0.3);
    h(s.cueS(3, "with"), "pop.wav", 0.25);
    h(s.cueS(3, "with") + 8, "pop.wav", 0.25);
    h(s.cueS(3, "both.") - 4, "ding.wav", 0.3);
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S9 — quiz + CTA
  {
    const s = sceneTiming(fps, "s9");
    const h = at("s9");
    const QQ = s.sent(0).from, SURVEY = s.sent(1).from, W30 = s.cueS(1, "30"), TREATW = s.cueS(2, "treat"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from, WHY = s.sent(4).from, W24 = s.cueS(4, "24");
    const FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    for (let i = 0; i < 6; i++) h(SURVEY - 2 + i * 3, "tick.wav", 0.14);
    h(W30 - 3, "beep-hi.wav", 0.25);
    h(TREATW - 3, "pop.wav", 0.32);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(W24 - 2, "stamp.wav", 0.28);
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

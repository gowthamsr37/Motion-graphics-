// SCENE 10 — BACK TO THE 3 JOBS: the hook cards return and each gets its answer tag as it is said: flat price →
// SUPERVISED · REGRESSION (cyan), customer groups → UNSUPERVISED · CLUSTERING (orange), robot dog → REINFORCEMENT
// (violet), each with a tick.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { JobCard } from "./S2Hook";
import { T1, T2, T3, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Tag: React.FC<{ at: number; c: string; a: string; b?: string }> = ({ at, c, a, b }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 8], [0, 1]);
  return (
    <div style={{ width: 262, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 6px", borderRadius: 18, background: alpha(c, 0.18), border: `3px solid ${c}`, opacity: p, transform: `scale(${1.4 - 0.4 * p}) rotate(-3deg)`, boxShadow: `0 0 24px ${alpha(c, 0.5)}` }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: a.length > 12 ? 23 : 27, color: C.text, whiteSpace: "nowrap" }}>{a}</div>
      {b ? <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 25, color: c, whiteSpace: "nowrap" }}>{b}</div> : null}
    </div>
  );
};

export const S10Answers: React.FC = () => {
  const s = useScene("s10");
  const A = [s.cueS(1, "supervised"), s.cueS(1, "unsupervised"), s.cueS(1, "reinforcement")];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={64} color={C.yellow} glow>THE 3 JOBS: ANSWERS</Txt>
      </Pop>
      <JobCard i={0} at={2} tag={<Tag at={A[0]} c={T1} a="SUPERVISED" b="REGRESSION" />} />
      <JobCard i={1} at={6} tag={<Tag at={A[1]} c={T2} a="UNSUPERVISED" b="CLUSTERING" />} />
      <JobCard i={2} at={10} tag={<Tag at={A[2]} c={T3} a="REINFORCEMENT" b="LEARNING" />} />
    </AbsoluteFill>
  );
};

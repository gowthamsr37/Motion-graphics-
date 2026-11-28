// The practical-guide step layout: step bar (8) + THE TERM tag + the situation headline; a red "THE REAL PROBLEM" panel
// with the step's own visual; then a green "WHAT YOU DO" panel with the fix bullets (each on its cue).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pop, Txt } from "./D2";
import { ease } from "./Motion";
import { JargonTag, StepBar } from "./Steps";
import { alpha, theme } from "../theme";

const C = theme.colors;

export const StepScene: React.FC<{
  i: number;
  termAt: number;
  head: React.ReactNode;
  headAt: number;
  probAt: number;
  probH?: number;
  problem: React.ReactNode;
  fixAt: number;
  fixes: { t: string; at: number }[];
}> = ({ i, termAt, head, headAt, probAt, probH = 440, problem, fixAt, fixes }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StepBar cur={i} at={0} />
      <JargonTag i={i} at={termAt} />
      <Pop x={540} y={445} at={headAt}>
        <Txt size={46} style={{ textAlign: "center" }}>{head}</Txt>
      </Pop>
      <Pop x={540} y={530 + probH / 2} at={probAt}>
        <Panel w={980} h={probH} color={C.red} style={{ justifyContent: "flex-start", paddingTop: 22, gap: 16 }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.red }}>THE REAL PROBLEM</div>
          {problem}
        </Panel>
      </Pop>
      <Pop x={540} y={560 + probH + 120} at={fixAt}>
        <Panel w={980} h={220} color={C.green} style={{ alignItems: "flex-start", padding: "0 40px", gap: 10 }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.green }}>WHAT YOU DO</div>
          {fixes.map((f) => (
            <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 14, opacity: ease(frame, [f.at - 4, f.at + 4], [0, 1]) }}>
              <svg width={30} height={30} viewBox="0 0 30 30"><path d="M5 16 L12 23 L26 7" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <Txt size={36}>{f.t}</Txt>
            </div>
          ))}
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

// small helpers for problem visuals
export const Chip: React.FC<{ c: string; children: React.ReactNode; at: number; strike?: boolean }> = ({ c, children, at, strike }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 6], [0, 1]);
  return (
    <div style={{ position: "relative", opacity: p, transform: `scale(${0.7 + 0.3 * p})`, padding: "10px 20px", borderRadius: 14, background: alpha(c, 0.15), border: `3px solid ${c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
      {children}
      {strike ? <div style={{ position: "absolute", left: -4, right: -4, top: "50%", height: 5, background: C.red, transform: "rotate(-6deg)" }} /> : null}
    </div>
  );
};
export const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 14 }) => <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap, padding: "0 30px" }}>{children}</div>;

// Day 4 step layout: 8-step bar + THE TERM tag + headline; a BEFORE (red) → AFTER (green) pair of mini tables; then
// THE APPROACH panel with bullets that appear on their words.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pop, Txt } from "./D2";
import { ease } from "./Motion";
import { JargonTag, StepBar } from "./Steps";
import { alpha, theme } from "../theme";

const C = theme.colors;

export type Cell = string | { v: string; bad?: boolean; good?: boolean; gone?: boolean };
export const Mini: React.FC<{ cols?: string[]; rows: Cell[][]; w: number; tone: "bad" | "good" }> = ({ cols, rows, w, tone }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", gap: 6 }}>
    {cols ? (
      <div style={{ display: "flex", gap: 6 }}>
        {cols.map((c) => (
          <div key={c} style={{ flex: 1, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.06em", color: C.dim }}>{c}</div>
        ))}
      </div>
    ) : null}
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 6 }}>
        {r.map((cell, j) => {
          const c = typeof cell === "string" ? { v: cell } : cell;
          const bg = c.bad ? alpha(C.red, 0.28) : c.good ? alpha(C.green, 0.25) : "rgba(255,255,255,0.06)";
          return (
            <div key={j} style={{ position: "relative", flex: 1, padding: "8px 2px", textAlign: "center", borderRadius: 8, background: bg, border: `2px solid ${c.bad ? alpha(C.red, 0.8) : c.good ? alpha(C.green, 0.7) : "transparent"}`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 25, color: C.text, whiteSpace: "nowrap", opacity: c.gone ? 0.35 : 1, textDecoration: c.gone ? "line-through" : undefined }}>{c.v}</div>
          );
        })}
      </div>
    ))}
  </div>
);

export const CleanStep: React.FC<{
  i: number;
  termAt: number;
  head: React.ReactNode;
  headAt: number;
  beforeAt: number;
  before: React.ReactNode;
  afterAt: number;
  after: React.ReactNode;
  pairH?: number;
  steps: { t: React.ReactNode; at: number }[];
}> = ({ i, termAt, head, headAt, beforeAt, before, afterAt, after, pairH = 400, steps }) => {
  const frame = useCurrentFrame();
  const arrow = ease(frame, [afterAt - 6, afterAt + 4], [0, 1]);
  const top = 520;
  return (
    <AbsoluteFill>
      <StepBar cur={i} at={0} />
      <JargonTag i={i} at={termAt} />
      <Pop x={540} y={445} at={headAt}>
        <Txt size={46} style={{ textAlign: "center" }}>{head}</Txt>
      </Pop>
      <Pop x={280} y={top + pairH / 2} at={beforeAt}>
        <Panel w={510} h={pairH} color={C.red} style={{ justifyContent: "flex-start", paddingTop: 18, gap: 12 }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.text }}><span style={{ color: C.red }}>●</span> BEFORE</div>
          {before}
        </Panel>
      </Pop>
      <div style={{ position: "absolute", left: 540, top: top + pairH / 2, transform: `translate(-50%, -50%) scale(${arrow})`, width: 64, height: 64, borderRadius: 32, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, boxShadow: `0 0 18px ${C.yellow}` }}>
        <svg width={34} height={34} viewBox="0 0 34 34"><path d="M6 17 H26 M18 9 L26 17 L18 25" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <Pop x={800} y={top + pairH / 2} at={afterAt}>
        <Panel w={510} h={pairH} color={C.green} style={{ justifyContent: "flex-start", paddingTop: 18, gap: 12 }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.text }}><span style={{ color: C.green }}>●</span> AFTER</div>
          {after}
        </Panel>
      </Pop>
      <Pop x={540} y={top + pairH + 170} at={steps[0]?.at - 6}>
        <Panel w={1010} h={280} color={C.cyan} style={{ alignItems: "flex-start", padding: "0 34px", gap: 10 }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.text }}><span style={{ color: C.cyan }}>●</span> THE APPROACH</div>
          {steps.map((st, k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ease(frame, [st.at - 4, st.at + 4], [0, 1]) }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: C.cyan, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.ink }}>{k + 1}</div>
              <Txt size={33} style={{ whiteSpace: "nowrap" }}>{st.t}</Txt>
            </div>
          ))}
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

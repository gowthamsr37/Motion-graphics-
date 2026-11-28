// The 7-step workflow tracker (top of every step scene): seven numbered pills, done ones green, the current one big and
// glowing, the rest dim; plus a small data-table renderer for the flat sales.
import React from "react";
import { useCurrentFrame } from "remotion";
import { ease } from "./Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const STEPS = ["ORDINAL", "ONE-HOT", "DROP ONE", "GROUP RARE", "TARGET", "UNSEEN"];
// the proper names (the jargon) for each step
export const JARGON = ["ORDINAL ENCODING", "ONE-HOT ENCODING", "DUMMY VARIABLE TRAP", "RARE-LABEL GROUPING", "TARGET ENCODING", "UNKNOWN CATEGORIES"];
export const STEP_C = [C.red, C.orange, C.cyan, C.green, C.violet, C.yellow];

export const StepBar: React.FC<{ cur: number; at?: number; y?: number }> = ({ cur, at = 0, y = 210 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 10], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: y, display: "flex", justifyContent: "center", gap: 4, opacity: p }}>
      {STEPS.map((t, i) => {
        const on = i === cur;
        const done = i < cur;
        const c = on ? STEP_C[i] : done ? C.green : alpha(C.text, 0.25);
        return (
          <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: on ? 190 : 130 }}>
            <div style={{ width: on ? 64 : 44, height: on ? 64 : 44, borderRadius: "50%", background: on ? c : done ? alpha(C.green, 0.25) : "rgba(255,255,255,0.05)", border: `3px solid ${c}`, boxShadow: on ? `0 0 22px ${c}` : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: on ? 32 : 22, color: on ? C.ink : C.text }}>
              {done ? <svg width={22} height={22} viewBox="0 0 22 22"><path d="M3 12 L9 18 L19 5" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: on ? 20 : 13, letterSpacing: "0.06em", color: on ? C.text : alpha(C.text, done ? 0.7 : 0.4), whiteSpace: "nowrap" }}>{t}</div>
          </div>
        );
      })}
    </div>
  );
};

export type Cell = { v: string; c?: string; bad?: boolean; strike?: boolean };
export const Table: React.FC<{ cols: string[]; rows: Cell[][]; w?: number; at?: number[]; fs?: number }> = ({ cols, rows, w = 960, at = [], fs = 32 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, borderRadius: 20, overflow: "hidden", border: `3px solid ${alpha(C.text, 0.25)}`, background: "rgba(14,24,64,0.92)" }}>
      <div style={{ display: "flex", background: alpha(C.text, 0.08) }}>
        {cols.map((c) => (
          <div key={c} style={{ flex: 1, padding: "14px 0", textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.1em", color: C.dim }}>{c}</div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: "flex", borderTop: `2px solid ${alpha(C.text, 0.08)}`, opacity: at[ri] !== undefined ? ease(frame, [at[ri], at[ri] + 6], [0, 1]) : 1 }}>
          {r.map((cell, ci) => (
            <div key={ci} style={{ flex: 1, padding: "14px 0", textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: fs, color: cell.c ?? C.text, background: cell.bad ? alpha(C.red, 0.18) : undefined, textDecoration: cell.strike ? "line-through" : undefined, opacity: cell.strike ? 0.45 : 1 }}>{cell.v}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

// the jargon tag under the step bar: "THE TERM: DATA CLEANING"
export const JargonTag: React.FC<{ i: number; at: number; y?: number }> = ({ i, at, y = 330 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 8], [0, 1]);
  const c = STEP_C[i];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 22px", borderRadius: 999, background: alpha(c, 0.14), border: `3px solid ${c}`, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>THE TERM</span>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text }}>{JARGON[i]}</span>
      </div>
    </div>
  );
};

// Explainer kit (from the simple CLT remake): a numbered DEFINITION CARD that fills line by line on the spoken words,
// and a RECAP FLOW of 3 cards joined by down-arrows. Every row: dashed slot from frame ~6, filled on its cue.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Arrow } from "./Icons";
import { ease, Mark, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

export type DefRow = { pre: string; key: string; post?: string; c: string; at: number; icon?: React.ReactNode };

// rows sit at y0, y0 + gap, …; all rows tick green at doneAt; the icon (optional) is drawn centred at x 890 on its row
export const DefCard: React.FC<{ rows: DefRow[]; y0: number; gap?: number; doneAt: number; size?: number }> = ({ rows, y0, gap = 150, doneAt, size = 36 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  return (
    <>
      {rows.map((r, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(r.at - 6, theme.spring.bouncy);
        const next = i + 1 < rows.length ? rows[i + 1].at - 4 : doneAt;
        const active = frame >= r.at - 4 && frame < next;
        const done = frame >= doneAt;
        const y = y0 + i * gap;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 90, top: y - 62, width: 900, height: 124, boxSizing: "border-box", borderRadius: 26, background: p > 0.01 ? `linear-gradient(90deg, ${alpha(r.c, 0.18)}, rgba(14,24,64,0.9) 60%)` : "transparent", border: p > 0.01 ? `3px solid ${active ? r.c : alpha(r.c, 0.5)}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, boxShadow: active ? `0 0 28px ${alpha(r.c, 0.35)}` : "none", opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * -40}px) scale(${active ? 1.02 : 1})` }} />
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 120, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, flexShrink: 0, background: done ? C.green : r.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.ink }}>
                  {done ? <Mark kind="check" at={doneAt + i * 3} size={34} color={C.ink} width={8} /> : i + 1}
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>
                  {r.pre}
                  <span style={{ fontWeight: 800, color: r.c, textShadow: active ? glowText(r.c, 0.6) : undefined }}>{r.key}</span>
                  {r.post ?? ""}
                </div>
              </div>
            ) : null}
            {p > 0.01 && r.icon ? <div style={{ position: "absolute", left: 890, top: y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) }}>{r.icon}</div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

export type FlowItem = { t: string; c: string; at: number; icon?: React.ReactNode };

export const RecapFlow: React.FC<{ items: FlowItem[]; y0: number; gap?: number; size?: number }> = ({ items, y0, gap = 170, size = 42 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  return (
    <>
      {items.map((f, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(f.at - 6, theme.spring.bouncy);
        const y = y0 + i * gap;
        return (
          <React.Fragment key={f.t}>
            <div style={{ position: "absolute", left: 140, top: y - 58, width: 800, height: 116, boxSizing: "border-box", borderRadius: 26, background: p > 0.01 ? `linear-gradient(90deg, ${alpha(f.c, 0.2)}, rgba(14,24,64,0.9) 60%)` : "transparent", border: p > 0.01 ? `3px solid ${f.c}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `scale(${p > 0.01 ? interpolate(Math.min(1, p), [0, 1], [0.85, 1]) : 1})` }} />
            {p > 0.01 ? <div style={{ position: "absolute", left: 180, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{f.t}</div> : null}
            {p > 0.01 && f.icon ? <div style={{ position: "absolute", left: 850, top: y, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2) }}>{f.icon}</div> : null}
            {i < items.length - 1 && p > 0.3 ? (
              <div style={{ position: "absolute", left: 540, top: y + gap / 2, transform: "translate(-50%, -50%) rotate(90deg)", opacity: spr(items[i + 1].at - 10, theme.spring.pop) }}>
                <Arrow size={32} color={C.dim} />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

// a small flat rectangle / bars / curve icon for cards
export const FlatIcon: React.FC<{ color: string; w?: number; h?: number }> = ({ color, w = 120, h = 60 }) => (
  <svg width={w} height={h + 4} viewBox={`0 0 ${w} ${h + 4}`} style={{ display: "block", overflow: "visible" }}>
    <rect x={6} y={h * 0.25} width={w - 12} height={h * 0.75} rx={4} fill={alpha(color, 0.35)} stroke={color} strokeWidth={4} />
    <line x1={0} y1={h + 1} x2={w} y2={h + 1} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} />
  </svg>
);

export const BarsIcon: React.FC<{ color: string; vals: number[]; w?: number; h?: number; hi?: number[]; hiColor?: string }> = ({ color, vals, w = 120, h = 60, hi = [], hiColor }) => {
  const max = Math.max(...vals);
  const bw = w / vals.length;
  return (
    <svg width={w} height={h + 4} viewBox={`0 0 ${w} ${h + 4}`} style={{ display: "block", overflow: "visible" }}>
      {vals.map((v, i) => (
        <rect key={i} x={i * bw + bw * 0.14} y={h - (v / max) * h} width={bw * 0.72} height={(v / max) * h} rx={3} fill={alpha(hi.includes(i) ? hiColor ?? color : color, 0.55)} stroke={hi.includes(i) ? hiColor ?? color : color} strokeWidth={2.5} />
      ))}
      <line x1={0} y1={h + 1} x2={w} y2={h + 1} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} />
    </svg>
  );
};

export const CurveIcon: React.FC<{ color: string; f: (u: number) => number; w?: number; h?: number }> = ({ color, f, w = 120, h = 60 }) => {
  const pts = Array.from({ length: 41 }, (_, i) => [(i / 40) * w, h - Math.min(1, Math.max(0, f(i / 40))) * h] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h + 4} viewBox={`0 0 ${w} ${h + 4}`} style={{ display: "block", overflow: "visible" }}>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={alpha(color, 0.3)} />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <line x1={0} y1={h + 1} x2={w} y2={h + 1} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} />
    </svg>
  );
};

// a mini "next topic" teaser block: small caps label, big title, and an icon
export const Teaser: React.FC<{ at: number; titleAt: number; label: string; title: string; color: string; icon: React.ReactNode }> = ({ at, titleAt, label, title, color, icon }) => {
  const spr = useSpr();
  const a = spr(at - 4, theme.spring.smooth);
  const b = spr(titleAt - 2, theme.spring.bouncy);
  const c = spr(titleAt + 8, theme.spring.pop);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: Math.min(1, a * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.26em", color: C.dim }}>{label}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(b, [0, 1], [0.6, 1])})`, opacity: Math.min(1, b * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, lineHeight: 1.05, color, textShadow: glowText(color, 0.6), whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ position: "absolute", left: 540, top: 900, transform: `translate(-50%, -50%) scale(${c})` }}>{icon}</div>
    </>
  );
};

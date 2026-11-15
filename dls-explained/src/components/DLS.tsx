// Graphics for the DLS explainer. Resource curves are an illustrative shape; real values come from the official DLS tables.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering } from "./Panel";

const C = theme.colors;
export const GREEN = "#38B47A";
export const RED = "#D9483B";
export const AMBER = "#F2A93B";
export const RAIN = "#8FB7D9";

/* ---------- rain over the whole frame ---------- */
export const Rain: React.FC<{ on: number; heavy?: number }> = ({ on, heavy = 1 }) => {
  const frame = useCurrentFrame();
  if (on <= 0.01) return null;
  const drops = Array.from({ length: Math.round(110 * heavy) }, (_, i) => {
    const r1 = ((i * 9301 + 49297) % 233280) / 233280;
    const r2 = ((i * 4253 + 1361) % 9973) / 9973;
    const speed = 38 + r2 * 26;
    const x = (r1 * 1300 - 110 + frame * 6) % 1300 - 110;
    const y = ((r2 * 2200 + frame * speed) % 2200) - 200;
    return { x, y, len: 40 + r1 * 50, o: 0.25 + 0.45 * r2 };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: on }}>
      <svg width={1080} height={1920}>
        {drops.map((d, i) => (
          <line key={i} x1={d.x} y1={d.y} x2={d.x - d.len * 0.18} y2={d.y + d.len} stroke={RAIN} strokeWidth={2} strokeOpacity={d.o} strokeLinecap="round" />
        ))}
      </svg>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(60,90,120,0.22), rgba(10,20,30,0.18))" }} />
    </AbsoluteFill>
  );
};

/* ---------- verdict / emphasis stamp ---------- */
export const Stamp: React.FC<{ text: string; at: number; color?: string; size?: number; rotate?: number }> = ({ text, at, color = C.cream, size = 120, rotate = -6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 220, mass: 0.7 } });
  if (frame < at) return null;
  return (
    <div style={{ display: "inline-block", padding: `${size * 0.1}px ${size * 0.22}px ${size * 0.06}px`, border: `${Math.max(5, size * 0.05)}px solid ${color}`, borderRadius: size * 0.1, background: "rgba(10,15,12,0.9)", boxShadow: `0 0 40px ${color}66`, transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${rotate}deg)`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
      <Lettering size={size} color={color}>
        {text}
      </Lettering>
    </div>
  );
};

/* ---------- a resource "tank": vertical gauge ---------- */
export const Tank: React.FC<{ label: string; fill: number; color: string; w: number; h: number; children?: React.ReactNode }> = ({ label, fill, color, w, h, children }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ position: "relative", width: w, height: h, borderRadius: 18, background: C.plate, boxShadow: `inset 0 0 0 3px ${C.panelEdge}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}aa)`, boxShadow: `0 0 24px ${color}66` }} />
      {[0.25, 0.5, 0.75].map((t) => (
        <div key={t} style={{ position: "absolute", left: 0, right: 0, bottom: `${t * 100}%`, height: 2, background: "rgba(0,0,0,0.35)" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
    <Lettering size={40}>{label}</Lettering>
  </div>
);

/* ---------- wickets in hand as ten lamps ---------- */
export const WicketRow: React.FC<{ inHand: number; size?: number; at?: number }> = ({ inHand, size = 34, at = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: size * 0.25 }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const lit = interpolate(frame, [at + i * 2, at + i * 2 + 4], [0, 1], CLAMP);
        const ok = i < inHand;
        return <Lamp key={i} color={ok ? GREEN : RED} glow={ok ? `${GREEN}88` : `${RED}66`} on={lit * (ok ? 1 : 0.55)} size={size} />;
      })}
    </div>
  );
};

/* ---------- resource curves: % of innings resources left v overs left, for wickets lost ---------- */
// Illustrative exponential-decay shape (the published method uses this family of curves); 25 overs / 0 down ≈ two-thirds.
const CAP = { 0: 1.0, 2: 0.85, 5: 0.49, 8: 0.12 } as Record<number, number>;
const RATE = { 0: 0.0274, 2: 0.034, 5: 0.06, 8: 0.16 } as Record<number, number>;
export const resource = (oversLeft: number, lost: number) => {
  const b = RATE[lost], cap = CAP[lost];
  return (cap * (1 - Math.exp(-b * oversLeft))) / (1 - Math.exp(-b * 50));
};

export const Curves: React.FC<{ w: number; h: number; at: number[]; markAt?: number; mark2At?: number }> = ({ w, h, at, markAt = 1e9, mark2At = 1e9 }) => {
  const frame = useCurrentFrame();
  const L = 90, R = 140, T = 30, B = 70; // room on the right for the curve labels
  const pw = w - L - R, ph = h - T - B;
  const X = (o: number) => L + (pw * o) / 50;
  const Y = (r: number) => T + ph * (1 - r);
  const lost = [0, 2, 5, 8];
  const cols = [GREEN, "#9BCB6B", AMBER, RED];
  const m1 = interpolate(frame, [markAt, markAt + 10], [0, 1], CLAMP);
  const m2 = interpolate(frame, [mark2At, mark2At + 10], [0, 1], CLAMP);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={L} x2={L + pw} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? C.creamDim : C.panelEdge} strokeWidth={v === 0 ? 2.5 : 1.2} />
          <text x={L - 12} y={Y(v) + 9} textAnchor="end" fontFamily={theme.fonts.display} fontSize={26} fill={C.creamDim}>
            {v * 100}%
          </text>
        </g>
      ))}
      {[0, 10, 20, 30, 40, 50].map((o) => (
        <text key={o} x={X(o)} y={T + ph + 34} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={26} fill={C.creamDim}>
          {o}
        </text>
      ))}
      <text x={L + pw / 2} y={h + 4} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.2em" fill={C.cream}>
        OVERS LEFT
      </text>
      <text x={L} y={T - 10} fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.2em" fill={C.cream}>
        RESOURCES LEFT
      </text>
      {lost.map((wl, k) => {
        const p = interpolate(frame, [at[k], at[k] + 30], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
        if (p <= 0) return null;
        const pts = Array.from({ length: 51 }, (_, i) => i * p).map((o) => `${X(o).toFixed(1)},${Y(resource(o, wl)).toFixed(1)}`);
        const endO = 50 * p;
        return (
          <g key={wl}>
            <polyline points={pts.join(" ")} fill="none" stroke={cols[k]} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${cols[k]}88)` }} />
            {p >= 1 && (
              <text x={X(endO) + 10} y={Y(resource(50, wl)) + 8} fontFamily={theme.fonts.display} fontSize={26} fill={cols[k]}>
                {wl === 0 ? "0 DOWN" : `${wl} DOWN`}
              </text>
            )}
          </g>
        );
      })}
      <g opacity={m1}>
        <circle cx={X(50)} cy={Y(1)} r={12} fill={GREEN} />
        <text x={X(50) - 18} y={Y(1) - 18} textAnchor="end" fontFamily={theme.fonts.display} fontSize={34} fill={C.cream}>
          50 OVERS · 10 WICKETS = 100%
        </text>
      </g>
      <g opacity={m2}>
        <line x1={X(25)} x2={X(25)} y1={Y(resource(25, 0))} y2={Y(0)} stroke={C.cream} strokeWidth={2} strokeDasharray="6 7" />
        <line x1={L} x2={X(25)} y1={Y(resource(25, 0))} y2={Y(resource(25, 0))} stroke={C.cream} strokeWidth={2} strokeDasharray="6 7" />
        <circle cx={X(25)} cy={Y(resource(25, 0))} r={12} fill={AMBER} />
        <text x={X(25) + 18} y={Y(resource(25, 0)) + 46} fontFamily={theme.fonts.display} fontSize={32} fill={AMBER}>
          25 OVERS, 0 DOWN ≈ ⅔
        </text>
      </g>
    </svg>
  );
};

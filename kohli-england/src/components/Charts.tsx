// Accurate, animated charts painted in the scoreboard style. Every bar/line is drawn to a true linear scale.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering } from "./Panel";

const C = theme.colors;

// Graph 1 — the ten 2014 innings, paired by ground. Scale 0–50 so the never-reached fifty is visible.
export const InningsBars: React.FC<{
  scores: number[];
  grounds: string[];
  revealAt: number[]; // frame each ground's pair grows
  fiftyAt: number; // frame the "fifty" line lights up
  w: number;
  h: number;
}> = ({ scores, grounds, revealAt, fiftyAt, w, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const MAX = 50;
  const left = 70;
  const right = 24;
  const top = 34;
  const bottom = 92;
  const plotW = w - left - right;
  const plotH = h - top - bottom;
  const slot = plotW / grounds.length;
  const barW = slot * 0.3;
  const yOf = (v: number) => top + plotH * (1 - v / MAX);
  const fifty = interpolate(frame, [fiftyAt, fiftyAt + 12], [0, 1], CLAMP);
  const highest = Math.max(...scores);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* gridlines + axis numbers */}
      {[0, 10, 20, 30, 40].map((v) => (
        <React.Fragment key={v}>
          <div style={{ position: "absolute", left, width: plotW, top: yOf(v), height: v === 0 ? 3 : 1, background: v === 0 ? C.creamDim : C.panelEdge }} />
          <div style={{ position: "absolute", left: 0, width: left - 14, top: yOf(v) - 13, textAlign: "right" }}>
            <Lettering size={26} color={C.creamDim}>
              {v}
            </Lettering>
          </div>
        </React.Fragment>
      ))}
      {/* the fifty line he never reached */}
      <div
        style={{
          position: "absolute",
          left,
          width: plotW,
          top: yOf(50),
          height: 0,
          borderTop: `3px dashed ${C.amber}`,
          opacity: 0.25 + 0.75 * fifty,
          boxShadow: `0 0 ${14 * fifty}px ${C.amberGlow}`,
        }}
      />
      <div style={{ position: "absolute", left: 0, width: left - 14, top: yOf(50) - 13, textAlign: "right" }}>
        <Lettering size={26} color={C.amber}>
          50
        </Lettering>
      </div>
      <div style={{ position: "absolute", right: right + 6, top: yOf(50) + 8, opacity: fifty }}>
        <Lettering size={22} font="body" color={C.amber} spacing="0.2em">
          FIFTY · NEVER REACHED
        </Lettering>
      </div>
      {grounds.map((g, gi) => {
        const cx = left + slot * gi + slot / 2;
        const p = (i: number) => spring({ frame: frame - revealAt[gi] - i * 6, fps, config: theme.spring.smooth });
        return (
          <React.Fragment key={g}>
            {[0, 1].map((k) => {
              const v = scores[gi * 2 + k];
              const prog = p(k);
              const duck = v === 0;
              const top_ = v === highest;
              const col = duck ? C.red : top_ ? C.amber : C.cream;
              const bh = (plotH * v) / MAX;
              const x = cx + (k === 0 ? -barW - 5 : 5);
              return (
                <React.Fragment key={k}>
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      width: barW,
                      top: yOf(0) - bh * Math.min(1, prog),
                      height: bh * Math.min(1, prog),
                      borderRadius: "4px 4px 0 0",
                      background: top_ ? `linear-gradient(180deg, ${C.amber}, #9a6420)` : `linear-gradient(180deg, ${C.cream}, ${C.creamDim})`,
                      boxShadow: top_ ? `0 0 22px ${C.amberGlow}` : undefined,
                    }}
                  />
                  {/* value plate on top of each bar (a duck gets a red lamp on the baseline) */}
                  <div
                    style={{
                      position: "absolute",
                      left: x - 20,
                      width: barW + 40,
                      top: yOf(0) - bh * Math.min(1, prog) - (duck ? 70 : 44),
                      textAlign: "center",
                      opacity: interpolate(prog, [0.3, 0.8], [0, 1], CLAMP),
                    }}
                  >
                    {duck && (
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <Lamp color={C.red} glow={C.redGlow} on={1} size={20} />
                      </div>
                    )}
                    <Lettering size={40} color={col} style={duck || top_ ? { textShadow: `0 0 14px ${duck ? C.redGlow : C.amberGlow}` } : undefined}>
                      {v}
                    </Lettering>
                  </div>
                </React.Fragment>
              );
            })}
            <div style={{ position: "absolute", left: cx - slot / 2, width: slot, top: yOf(0) + 14, textAlign: "center", opacity: interpolate(p(0), [0, 0.5], [0.35, 1], CLAMP) }}>
              <Lettering size={19} font="body" weight={600} spacing="0.06em" color={C.cream}>
                {g.split(" ").map((part, i) => (
                  <div key={i}>{part}</div>
                ))}
              </Lettering>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Graphs 2 & 3 — one comparison row: 2014 bar vs 2018 bar on a shared linear scale.
export const CompareRow: React.FC<{
  label: string;
  a: number;
  b: number;
  fmt?: (v: number) => string;
  max: number;
  at: number;
  w: number;
}> = ({ label, a, b, fmt = (v) => String(Math.round(v)), max, at, w }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pa = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const pb = spring({ frame: frame - at - 8, fps, config: { damping: 18, stiffness: 60, mass: 1.1 } });
  const labelW = 210;
  const valW = 120;
  const barMax = w - labelW - valW - 20;
  const row = (year: string, v: number, p: number, col: string, glow?: string) => (
    <div style={{ display: "flex", alignItems: "center", height: 44 }}>
      <div style={{ width: labelW, paddingRight: 16, textAlign: "right" }}>
        <Lettering size={26} font="body" weight={600} color={col === C.amber ? C.amber : C.creamDim} spacing="0.14em">
          {year}
        </Lettering>
      </div>
      <div style={{ width: barMax, height: 30, position: "relative", background: C.plate, borderRadius: 4, boxShadow: `inset 0 0 0 1px ${C.panelEdge}` }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: (barMax * v * Math.min(1, p)) / max,
            borderRadius: 4,
            background: col,
            boxShadow: glow ? `0 0 18px ${glow}` : undefined,
          }}
        />
      </div>
      <div style={{ width: valW, textAlign: "right" }}>
        <Lettering size={44} color={col}>
          {fmt(v * Math.min(1, p))}
        </Lettering>
      </div>
    </div>
  );
  return (
    <div style={{ opacity: interpolate(pa, [0, 0.3], [0, 1], CLAMP), transform: `translateX(${interpolate(pa, [0, 1], [-30, 0])}px)` }}>
      <Lettering size={24} font="body" weight={600} color={C.cream} spacing="0.24em">
        {label}
      </Lettering>
      <div style={{ height: 8 }} />
      {row("2014", a, pa, "#8E8A7C")}
      {row("2018", b, pb, C.amber, C.amberGlow)}
    </div>
  );
};

// Graph 5 — cumulative runs, innings by innings, both tours on one true 0–600 scale.
export const CumulativeChart: React.FC<{ a: number[]; b: number[]; at: number; w: number; h: number; drawLen?: number }> = ({ a, b, at, w, h, drawLen = 75 }) => {
  const frame = useCurrentFrame();
  const MAX = 600;
  const L = 74;
  const R = 110;
  const T = 26;
  const B = 56;
  const pw = w - L - R;
  const ph = h - T - B;
  const X = (i: number) => L + (pw * i) / (a.length - 1);
  const Y = (v: number) => T + ph * (1 - v / MAX);
  const prog = interpolate(frame, [at, at + drawLen], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const path = (xs: number[]) => xs.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const len = (xs: number[]) => xs.slice(1).reduce((s, v, i) => s + Math.hypot(X(i + 1) - X(i), Y(v) - Y(xs[i])), 0);
  const endA = interpolate(prog, [0.85, 1], [0, 1], CLAMP);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[0, 200, 400, 600].map((v) => (
        <g key={v}>
          <line x1={L} x2={L + pw} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? C.creamDim : C.panelEdge} strokeWidth={v === 0 ? 3 : 1.5} />
          <text x={L - 14} y={Y(v) + 9} textAnchor="end" fontFamily={theme.fonts.display} fontSize={28} fill={C.creamDim}>
            {v}
          </text>
        </g>
      ))}
      {a.map((_, i) => (
        <text key={i} x={X(i)} y={T + ph + 38} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={26} fill={C.creamDim}>
          {i + 1}
        </text>
      ))}
      <text x={L + pw / 2} y={h + 6} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.22em" fill={C.creamDim}>
        INNINGS
      </text>
      {[
        { xs: a, col: "#9C8F86", glow: "transparent", w: 6, label: `2014 · ${a[a.length - 1]}` },
        { xs: b, col: C.amber, glow: C.amberGlow, w: 8, label: `2018 · ${b[b.length - 1]}` },
      ].map((s, k) => {
        const l = len(s.xs);
        return (
          <g key={k}>
            <path d={path(s.xs)} fill="none" stroke={s.col} strokeWidth={s.w} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={l} strokeDashoffset={l * (1 - prog)} style={{ filter: k ? `drop-shadow(0 0 8px ${s.glow})` : undefined }} />
            <g opacity={endA}>
              <circle cx={X(s.xs.length - 1)} cy={Y(s.xs[s.xs.length - 1])} r={9} fill={s.col} />
              <text x={X(s.xs.length - 1) + 16} y={Y(s.xs[s.xs.length - 1]) + 10} fontFamily={theme.fonts.display} fontSize={34} fill={s.col}>
                {s.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

// Off-stump corridor — an illustration of the idea, NOT ball-tracking data.
// Top-down view from behind the striker (right-hander): bowler up the pitch, off side to the right, slips behind.
export const Corridor: React.FC<{ at: number; edgeAt: number; w: number; h: number }> = ({ at, edgeAt, w, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const cx = w * 0.42;
  const stumpsY = h * 0.8;
  const pitchW = 150;
  const corridorX = cx + 26;
  const corridorW = 70;
  const ball = interpolate(frame, [edgeAt - 24, edgeAt, edgeAt + 22], [0, 0.72, 1], CLAMP);
  // ball path: from the bowler, pitches in the corridor, moves away towards the slips
  const P0 = { x: cx - 10, y: h * 0.06 };
  const P1 = { x: corridorX + corridorW * 0.45, y: h * 0.56 };
  const P2 = { x: corridorX + corridorW * 0.62, y: stumpsY - 6 };
  const P3 = { x: w * 0.86, y: h * 0.95 };
  const pt = (t: number) => {
    if (t < 0.72) {
      const u = t / 0.72;
      return u < 0.75 ? { x: P0.x + (P1.x - P0.x) * (u / 0.75), y: P0.y + (P1.y - P0.y) * (u / 0.75) } : { x: P1.x + (P2.x - P1.x) * ((u - 0.75) / 0.25), y: P1.y + (P2.y - P1.y) * ((u - 0.75) / 0.25) };
    }
    const u = (t - 0.72) / 0.28;
    return { x: P2.x + (P3.x - P2.x) * u, y: P2.y + (P3.y - P2.y) * u };
  };
  const trail = Array.from({ length: 24 }, (_, i) => pt(Math.max(0, ball - i * 0.012)));
  const edge = interpolate(frame, [edgeAt, edgeAt + 4, edgeAt + 26], [0, 1, 0], CLAMP);
  const cur = pt(ball);
  return (
    <svg width={w} height={h} style={{ opacity: Math.min(1, on) }}>
      <rect x={cx - pitchW / 2} y={0} width={pitchW} height={h} fill="#3a3a2a" opacity={0.35} />
      <line x1={cx - pitchW / 2 - 20} x2={cx + pitchW / 2 + 20} y1={stumpsY - 34} y2={stumpsY - 34} stroke={C.cream} strokeWidth={3} opacity={0.5} />
      {/* the corridor outside off stump */}
      <rect x={corridorX} y={h * 0.1} width={corridorW} height={stumpsY - h * 0.1} fill={C.amber} opacity={0.16 + 0.1 * Math.sin(frame / 8)} />
      <line x1={corridorX} x2={corridorX} y1={h * 0.1} y2={stumpsY} stroke={C.amber} strokeWidth={2} strokeDasharray="8 8" />
      <line x1={corridorX + corridorW} x2={corridorX + corridorW} y1={h * 0.1} y2={stumpsY} stroke={C.amber} strokeWidth={2} strokeDasharray="8 8" />
      {/* stumps (off stump on the right for a right-hander, seen from behind) */}
      {[-14, 0, 14].map((dx) => (
        <rect key={dx} x={cx + dx - 3} y={stumpsY - 4} width={6} height={18} rx={2} fill={C.cream} />
      ))}
      <text x={cx + 20} y={stumpsY + 42} fontFamily={theme.fonts.body} fontWeight={600} fontSize={16} letterSpacing="0.16em" fill={C.creamDim}>
        OFF STUMP
      </text>
      {/* slips */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={w * 0.7 + i * 46} cy={h * 0.92 - i * 10} r={10} fill="none" stroke={C.creamDim} strokeWidth={2} />
      ))}
      <text x={w * 0.7} y={h * 0.985} fontFamily={theme.fonts.body} fontWeight={600} fontSize={16} letterSpacing="0.16em" fill={C.creamDim}>
        SLIPS
      </text>
      {/* ball */}
      {ball > 0 &&
        trail.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={9 - i * 0.3} fill={C.red} opacity={(1 - i / trail.length) * 0.5} />)}
      {ball > 0 && <circle cx={cur.x} cy={cur.y} r={10} fill={C.red} stroke={C.cream} strokeWidth={2} />}
      <circle cx={P2.x} cy={P2.y} r={30 * edge + 6} fill="none" stroke={C.amber} strokeWidth={4} opacity={edge} />
      <text x={P2.x + 34} y={P2.y - 18} fontFamily={theme.fonts.display} fontSize={40} fill={C.amber} opacity={edge}>
        EDGE
      </text>
      <text x={8} y={22} fontFamily={theme.fonts.body} fontWeight={600} fontSize={16} letterSpacing="0.16em" fill={C.creamDim}>
        ← LEG SIDE
      </text>
      <text x={w - 8} y={22} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={16} letterSpacing="0.16em" fill={C.creamDim}>
        OFF SIDE →
      </text>
    </svg>
  );
};

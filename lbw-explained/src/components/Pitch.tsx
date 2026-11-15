// The LBW pitch view: broadcast-style, from behind the bowler, in true perspective.
// Right-handed batter: from behind the bowler, OFF SIDE is screen-left and LEG SIDE is screen-right.
// Widths are stylised (stumps drawn wider than life) so the "in line" zone is readable on a phone.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

const C = theme.colors;
export const GREEN = "#38B47A";
export const RED = "#D9483B";
export const AMBER = "#F2A93B";

// world: x lateral (− off, + leg), z metres from the batter's stumps towards the bowler, y height
const CAM_Z = 12, CAM_H = 2.8, F = 3300; // a zoomed, slightly raised broadcast angle
export const W = 960, H = 820;
const Y0 = -300;
export const STUMP_HALF = 0.2; // stylised half-width of the stumps
export const STUMP_H = 0.71;
const PITCH_HALF = 1.35;
const NEAR_Z = 10.5; // never draw ground behind the camera
const IMPACT_Z = 1.25;

export const proj = (x: number, z: number, y = 0) => {
  const d = CAM_Z - z;
  return { x: W / 2 + (F * x) / d, y: Y0 + (F * (CAM_H - y)) / d, s: F / d };
};

const poly = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
const groundQuad = (x0: number, x1: number, z0: number, z1: number) => poly([proj(x0, z0), proj(x1, z0), proj(x1, z1), proj(x0, z1)]);
const wallQuad = (x0: number, x1: number, z: number, y0: number, y1: number) => poly([proj(x0, z, y0), proj(x1, z, y0), proj(x1, z, y1), proj(x0, z, y1)]);

export type Delivery = {
  pitch: { x: number; z: number } | null; // null = full toss
  impact: { x: number; y: number };
  stumps: { x: number; y: number }; // where the projected path crosses the stumps plane
  at: number; // frame the ball is released
  dur?: number; // frames to the pad
  projectDelay?: number; // frames after impact before the projection draws
  showPitchMark?: boolean;
  markAt?: number; // frame the pitch mark appears (default: when the ball pitches)
  pitchVerdict?: "ok" | "bad";
  impactVerdict?: "ok" | "bad" | "maybe";
  wicketVerdict?: "ok" | "bad";
  ghost?: boolean; // faded replay
};

const BallPath: React.FC<{ d: Delivery }> = ({ d }) => {
  const frame = useCurrentFrame();
  const dur = d.dur ?? 22;
  const t = interpolate(frame, [d.at, d.at + dur], [0, 1], CLAMP);
  if (frame < d.at) return null;
  const rel = { x: (d.pitch?.x ?? d.impact.x) * 0.6, z: 9.8, y: 1.4 };
  const P = d.pitch;
  const I = { x: d.impact.x, z: IMPACT_Z, y: d.impact.y };
  // 3D path sampled: release → pitch (falling), pitch → pad (rising); full toss: release → pad
  const at3 = (u: number) => {
    if (!P) {
      return { x: rel.x + (I.x - rel.x) * u, z: rel.z + (I.z - rel.z) * u, y: rel.y + (I.y - rel.y) * u - 0.4 * Math.sin(Math.PI * u) * 0 };
    }
    const k = 0.62;
    if (u < k) {
      const v = u / k;
      return { x: rel.x + (P.x - rel.x) * v, z: rel.z + (P.z - rel.z) * v, y: rel.y * (1 - v) * (1 - v * 0.15) };
    }
    const v = (u - k) / (1 - k);
    return { x: P.x + (I.x - P.x) * v, z: P.z + (I.z - P.z) * v, y: I.y * Math.sin((Math.PI / 2) * v) };
  };
  const N = 40;
  const pts = Array.from({ length: N + 1 }, (_, i) => at3((i / N) * t)).map((p) => proj(p.x, p.z, p.y));
  const head = pts[pts.length - 1];
  const headS = proj(at3(t).x, at3(t).z, at3(t).y).s;
  const impacted = t >= 1;
  const pitchT = P ? 0.62 : 2;
  const pitched = t >= pitchT;
  const pm = P ? proj(P.x, P.z) : null;
  const vcol = (v?: string) => (v === "ok" ? GREEN : v === "bad" ? RED : v === "maybe" ? AMBER : C.cream);
  // projection after impact
  const pd = d.projectDelay ?? 6;
  const pt = interpolate(frame, [d.at + dur + pd, d.at + dur + pd + 16], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const S0 = proj(I.x, I.z, I.y);
  const S1 = proj(d.stumps.x, 0, d.stumps.y);
  const SE = { x: S0.x + (S1.x - S0.x) * pt, y: S0.y + (S1.y - S0.y) * pt };
  const thud = interpolate(frame, [d.at + dur, d.at + dur + 3, d.at + dur + 14], [0, 1, 0], CLAMP);
  const op = d.ghost ? 0.45 : 1;
  return (
    <g opacity={op}>
      {pm && pitched && d.showPitchMark !== false && frame >= (d.markAt ?? -1e9) && (
        <g>
          <ellipse cx={pm.x} cy={pm.y} rx={pm.s * 0.11} ry={pm.s * 0.035} fill={vcol(d.pitchVerdict)} opacity={0.85} />
          <ellipse cx={pm.x} cy={pm.y} rx={pm.s * 0.2} ry={pm.s * 0.06} fill="none" stroke={vcol(d.pitchVerdict)} strokeWidth={3} opacity={0.7} />
        </g>
      )}
      <polyline points={poly(pts)} fill="none" stroke={C.cream} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
      {pt > 0 && <line x1={S0.x} y1={S0.y} x2={SE.x} y2={SE.y} stroke={vcol(d.wicketVerdict)} strokeWidth={5} strokeDasharray="10 9" strokeLinecap="round" />}
      {pt >= 1 && <circle cx={S1.x} cy={S1.y} r={proj(0, 0).s * 0.05} fill={vcol(d.wicketVerdict)} stroke={C.board} strokeWidth={2} />}
      {impacted && (
        <g>
          <circle cx={S0.x} cy={S0.y} r={S0.s * 0.07 + 30 * thud} fill="none" stroke={vcol(d.impactVerdict)} strokeWidth={4} opacity={0.4 + 0.6 * thud} />
          <circle cx={S0.x} cy={S0.y} r={S0.s * 0.05} fill={vcol(d.impactVerdict)} />
        </g>
      )}
      {!impacted && <circle cx={head.x} cy={head.y} r={Math.max(7, headS * 0.06)} fill={RED} stroke={C.cream} strokeWidth={2} />}
    </g>
  );
};

// a simple batter silhouette (pads, thighs, body) standing at the crease — not to scale
const Batter: React.FC<{ x: number; on?: number }> = ({ x, on = 1 }) => {
  on = on * 0.6;
  const foot = proj(x, IMPACT_Z, 0), knee = proj(x, IMPACT_Z, 0.5), hip = proj(x, IMPACT_Z, 0.95), head = proj(x, IMPACT_Z, 1.7);
  const s = foot.s;
  return (
    <g opacity={on}>
      <ellipse cx={foot.x} cy={foot.y + 4} rx={s * 0.42} ry={s * 0.06} fill="#000" opacity={0.35} />
      {/* back leg and pad */}
      <rect x={foot.x + s * 0.02} y={knee.y} width={s * 0.15} height={foot.y - knee.y} rx={s * 0.05} fill="#d9d2bd" opacity={0.75} />
      <rect x={foot.x - s * 0.17} y={knee.y - s * 0.02} width={s * 0.15} height={foot.y - knee.y + s * 0.02} rx={s * 0.05} fill="#efe8d4" />
      {[0.15, 0.3, 0.45].map((k) => (
        <line key={k} x1={foot.x - s * 0.17} x2={foot.x - s * 0.02} y1={knee.y + (foot.y - knee.y) * k} y2={knee.y + (foot.y - knee.y) * k} stroke="#b9b29e" strokeWidth={2} />
      ))}
      <path d={`M${foot.x - s * 0.17},${knee.y} L${foot.x - s * 0.12},${hip.y} L${foot.x + s * 0.14},${hip.y} L${foot.x + s * 0.17},${knee.y} Z`} fill="#e8e2cf" opacity={0.85} />
      <path d={`M${foot.x - s * 0.15},${hip.y} L${foot.x - s * 0.18},${head.y + s * 0.2} L${foot.x + s * 0.16},${head.y + s * 0.2} L${foot.x + s * 0.14},${hip.y} Z`} fill="#e8e2cf" opacity={0.6} />
      <circle cx={foot.x} cy={head.y + s * 0.08} r={s * 0.12} fill="#1f3b6e" opacity={0.85} />
      <rect x={foot.x - s * 0.1} y={head.y + s * 0.08} width={s * 0.2} height={s * 0.06} fill="#c9c9c9" opacity={0.7} />
    </g>
  );
};

export const PitchView: React.FC<{
  deliveries?: Delivery[];
  lanes?: number; // 0..1 ground lanes (pitching zones)
  wall?: number; // 0..1 impact-plane zones
  stumpZone?: number; // 0..1 highlight the stumps target
  offMaybe?: number; // 0..1 show the outside-off "only if no shot" band in amber
  batterX?: number;
  batterOn?: number;
  labels?: number;
}> = ({ deliveries = [], lanes = 0, wall = 0, stumpZone = 0, offMaybe = 0, batterX = 0.02, batterOn = 1, labels = 1 }) => {
  const frame = useCurrentFrame();
  const sb = proj(0, 0, 0), st = proj(0, 0, STUMP_H);
  const sx = (x: number) => proj(x, 0, 0).x;
  return (
    <svg width={W} height={H} style={{ overflow: "hidden" }}>
      <defs>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f3a27" />
          <stop offset="100%" stopColor="#2e5737" />
        </linearGradient>
        <linearGradient id="strip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f7c55" />
          <stop offset="100%" stopColor="#b59e6c" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#grass)" />
      {/* mowing stripes */}
      {Array.from({ length: 9 }).map((_, i) => (
        <polygon key={i} points={groundQuad(-12 + i * 2.7, -12 + i * 2.7 + 1.35, -6, NEAR_Z)} fill="#000" opacity={0.06} />
      ))}
      {/* the pitch strip */}
      <polygon points={groundQuad(-PITCH_HALF, PITCH_HALF, -0.6, NEAR_Z)} fill="url(#strip)" />
      {/* creases */}
      <polyline points={poly([proj(-PITCH_HALF, 1.22), proj(PITCH_HALF, 1.22)])} stroke={C.cream} strokeWidth={3} opacity={0.8} />
      <polyline points={poly([proj(-PITCH_HALF, 0), proj(PITCH_HALF, 0)])} stroke={C.cream} strokeWidth={2} opacity={0.5} />
      {/* pitching lanes */}
      {lanes > 0 && (
        <g opacity={lanes}>
          <polygon points={groundQuad(-PITCH_HALF, -STUMP_HALF, 1.4, NEAR_Z)} fill={GREEN} opacity={0.28} />
          <polygon points={groundQuad(-STUMP_HALF, STUMP_HALF, 1.4, NEAR_Z)} fill={GREEN} opacity={0.5} />
          <polygon points={groundQuad(STUMP_HALF, PITCH_HALF, 1.4, NEAR_Z)} fill={RED} opacity={0.42} />
          <polyline points={poly([proj(-STUMP_HALF, 0), proj(-STUMP_HALF, NEAR_Z)])} stroke={C.cream} strokeWidth={2} strokeDasharray="8 8" />
          <polyline points={poly([proj(STUMP_HALF, 0), proj(STUMP_HALF, NEAR_Z)])} stroke={C.cream} strokeWidth={2} strokeDasharray="8 8" />
        </g>
      )}
      {/* stumps */}
      {stumpZone > 0 && <rect x={sx(-STUMP_HALF) - 6} y={st.y - 6} width={sx(STUMP_HALF) - sx(-STUMP_HALF) + 12} height={sb.y - st.y + 6} fill={GREEN} opacity={0.35 * stumpZone} stroke={GREEN} strokeWidth={3} />}
      {[-1, 0, 1].map((k) => {
        const x = sx(k * STUMP_HALF * 0.82);
        return <rect key={k} x={x - 5} y={st.y} width={10} height={sb.y - st.y} rx={3} fill="#f1e9d2" />;
      })}
      <rect x={sx(-STUMP_HALF * 0.82) - 6} y={st.y - 6} width={sx(STUMP_HALF * 0.82) - sx(-STUMP_HALF * 0.82) + 12} height={6} rx={3} fill="#e6dcc1" />
      {/* impact plane: in line / outside off / outside leg */}
      {wall > 0 && (
        <g opacity={wall}>
          <polygon points={wallQuad(-1.1, -STUMP_HALF, IMPACT_Z + 0.05, 0, 1.15)} fill={offMaybe > 0 ? AMBER : RED} opacity={0.22 + 0.06 * offMaybe} />
          <polygon points={wallQuad(-STUMP_HALF, STUMP_HALF, IMPACT_Z + 0.05, 0, 1.15)} fill={GREEN} opacity={0.38} />
          <polygon points={wallQuad(STUMP_HALF, 1.1, IMPACT_Z + 0.05, 0, 1.15)} fill={RED} opacity={0.28} />
          <polyline points={poly([proj(-STUMP_HALF, IMPACT_Z + 0.05, 0), proj(-STUMP_HALF, IMPACT_Z + 0.05, 1.15)])} stroke={C.cream} strokeWidth={2} strokeDasharray="8 8" />
          <polyline points={poly([proj(STUMP_HALF, IMPACT_Z + 0.05, 0), proj(STUMP_HALF, IMPACT_Z + 0.05, 1.15)])} stroke={C.cream} strokeWidth={2} strokeDasharray="8 8" />
        </g>
      )}
      <Batter x={batterX} on={batterOn} />
      {deliveries.map((d, i) => (
        <BallPath key={i} d={d} />
      ))}
      {/* side labels */}
      <g opacity={labels}>
        <text x={26} y={H - 28} fontFamily={theme.fonts.body} fontWeight={600} fontSize={22} letterSpacing="0.16em" fill={C.cream}>
          ← OFF SIDE
        </text>
        <text x={W - 26} y={H - 28} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={22} letterSpacing="0.16em" fill={C.cream}>
          LEG SIDE →
        </text>
        <text x={W / 2} y={H - 28} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={500} fontSize={15} letterSpacing="0.14em" fill={C.creamDim}>
          RIGHT-HANDER · VIEW FROM BEHIND THE BOWLER
        </text>
      </g>
      {lanes > 0 && (
        <g opacity={lanes} fontFamily={theme.fonts.display} fontSize={34} textAnchor="middle">
          <text x={proj(-0.78, 1.9).x} y={proj(0, 1.9).y} fill={C.cream}>OUTSIDE OFF</text>
          <text x={proj(0, 1.9).x} y={proj(0, 1.9).y} fill={C.cream} fontSize={28}>IN LINE</text>
          <text x={proj(0.78, 1.9).x} y={proj(0, 1.9).y} fill={C.cream}>OUTSIDE LEG</text>
        </g>
      )}
      {frame < 0 && null}
    </svg>
  );
};

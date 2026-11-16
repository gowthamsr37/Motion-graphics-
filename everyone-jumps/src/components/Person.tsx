// Articulated human silhouette with a physically timed vertical jump.
// Jump model: 30 cm rise of the centre of mass → take-off speed √(2gh) = 2.43 m/s,
// time in the air 2v/g = 0.495 s, peak at 0.247 s. Heights scale with the figure (1.70 m = H px).
import React from "react";

export const G = 9.81;
export const JUMP_H = 0.3; // m
export const V0 = Math.sqrt(2 * G * JUMP_H); // 2.43 m/s
export const AIR = (2 * V0) / G; // 0.495 s
export const PEAK = AIR / 2;
const BODY_M = 1.7; // reference height in metres

type Pose = { shin: number; thigh: number; torso: number; arm: number; elbow: number; pf: number };

const STAND: Pose = { shin: 2, thigh: 0, torso: 3, arm: 5, elbow: 10, pf: 0 };
const READY: Pose = { shin: 9, thigh: -12, torso: 11, arm: -8, elbow: 22, pf: 0 };
const CROUCH: Pose = { shin: 33, thigh: -62, torso: 42, arm: -62, elbow: 14, pf: 0 };
const PUSH: Pose = { shin: 10, thigh: 6, torso: 9, arm: 158, elbow: 8, pf: 52 };
const APEX: Pose = { shin: -16, thigh: 14, torso: 6, arm: 150, elbow: 16, pf: 32 };
const PRELAND: Pose = { shin: 6, thigh: 8, torso: 8, arm: 85, elbow: 22, pf: 18 };
const ABSORB: Pose = { shin: 30, thigh: -50, torso: 33, arm: 38, elbow: 34, pf: 0 };

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const easeIn = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * x);
const easeOut = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 3);
const mix = (a: Pose, b: Pose, k: number): Pose => ({
  shin: a.shin + (b.shin - a.shin) * k,
  thigh: a.thigh + (b.thigh - a.thigh) * k,
  torso: a.torso + (b.torso - a.torso) * k,
  arm: a.arm + (b.arm - a.arm) * k,
  elbow: a.elbow + (b.elbow - a.elbow) * k,
  pf: a.pf + (b.pf - a.pf) * k,
});

// t: seconds relative to take-off. idle: seconds of anticipation bounce before the crouch.
export const poseAt = (t: number, ready = true): { pose: Pose; air: number } => {
  const base = ready ? READY : STAND;
  if (t < -0.95) return { pose: base, air: -1 };
  if (t < -0.28) return { pose: mix(base, CROUCH, smooth((t + 0.95) / 0.67)), air: -1 };
  if (t < 0) {
    const k = easeIn((t + 0.28) / 0.28);
    const p = mix(CROUCH, PUSH, k);
    p.pf = PUSH.pf * easeIn((t + 0.12) / 0.12);
    return { pose: p, air: -1 };
  }
  if (t < AIR) {
    const p = t < PEAK ? mix(PUSH, APEX, easeOut(t / PEAK)) : mix(APEX, PRELAND, smooth((t - PEAK) / (AIR - PEAK)));
    return { pose: p, air: t / AIR };
  }
  if (t < AIR + 0.22) return { pose: mix(PRELAND, ABSORB, easeOut((t - AIR) / 0.22)), air: -1 };
  if (t < AIR + 0.95) return { pose: mix(ABSORB, STAND, smooth((t - AIR - 0.22) / 0.73)), air: -1 };
  return { pose: STAND, air: -1 };
};

// Height of the centre of mass above its take-off position, metres.
export const liftAt = (t: number) => (t <= 0 || t >= AIR ? 0 : V0 * t - 0.5 * G * t * t);

type V2 = [number, number];
const D = Math.PI / 180;

// Joint offsets relative to the toe of the planted foot (y down), for a figure facing +x.
const solve = (p: Pose, H: number) => {
  const F = 0.15 * H, ankleH = 0.045 * H;
  const shinL = 0.245 * H, thighL = 0.245 * H, torsoL = 0.29 * H;
  const pf = p.pf * D;
  // toe → ankle / heel, rotated about the toe by plantar flexion (heel lifts, toe stays put)
  const R = (vx: number, vy: number): V2 => [vx * Math.cos(pf) - vy * Math.sin(pf), vx * Math.sin(pf) + vy * Math.cos(pf)];
  const ankle = R(-0.72 * F, -ankleH);
  const heel = R(-0.95 * F, -0.012 * H);
  const knee: V2 = [ankle[0] + shinL * Math.sin(p.shin * D), ankle[1] - shinL * Math.cos(p.shin * D)];
  const hip: V2 = [knee[0] + thighL * Math.sin(p.thigh * D), knee[1] - thighL * Math.cos(p.thigh * D)];
  const sh: V2 = [hip[0] + torsoL * Math.sin(p.torso * D), hip[1] - torsoL * Math.cos(p.torso * D)];
  return { toe: [0, 0] as V2, heel, ankle, knee, hip, sh };
};

export type Look = {
  hair?: "short" | "pony" | "bun" | "long" | "cap";
  build?: number; // width multiplier
  bag?: boolean;
};

export const Person: React.FC<{
  x: number; // toe x at rest
  ground: number; // ground y
  H: number; // standing height px
  t: number; // seconds relative to take-off
  dir?: 1 | -1;
  color?: string;
  look?: Look;
  ready?: boolean;
  shadow?: boolean;
}> = ({ x, ground, H, t, dir = 1, color = "#03060E", look = {}, ready = true, shadow = true }) => {
  const { pose, air } = poseAt(t, ready);
  const build = look.build ?? 1;
  const j = solve(pose, H);
  let off: V2 = [0, 0];
  if (air >= 0) {
    // Flying: move the hip from its take-off spot to its landing spot, plus the ballistic rise.
    const a = solve(PUSH, H).hip, b = solve(PRELAND, H).hip;
    const hipX = a[0] + (b[0] - a[0]) * air, hipY = a[1] + (b[1] - a[1]) * air - (liftAt(t) / BODY_M) * H;
    off = [hipX - j.hip[0], hipY - j.hip[1]];
  }
  const P = (v: V2): V2 => [x + dir * (v[0] + off[0]), ground + v[1] + off[1]];
  const toe = P(j.toe), heel = P(j.heel), ankle = P(j.ankle), knee = P(j.knee), hip = P(j.hip), sh = P(j.sh);
  const tA = pose.torso * D;
  const neck: V2 = [sh[0] + dir * 0.03 * H * Math.sin(tA + 0.25), sh[1] - 0.03 * H * Math.cos(tA)];
  const head: V2 = [neck[0] + dir * 0.06 * H * Math.sin(tA * 0.6 + 0.12), neck[1] - 0.062 * H];
  const arm = (k: number): [V2, V2] => {
    const a1 = (pose.arm + k) * D, a2 = (pose.arm + k + pose.elbow) * D;
    const e: V2 = [sh[0] + dir * 0.165 * H * Math.sin(a1), sh[1] + 0.165 * H * Math.cos(a1)];
    const w: V2 = [e[0] + dir * 0.165 * H * Math.sin(a2), e[1] + 0.165 * H * Math.cos(a2)];
    return [e, w];
  };
  // far leg slightly offset for a natural stance
  const farOff = 0.035 * H;
  const fT = (v: V2): V2 => [v[0] - dir * farOff, v[1]];
  const [e1, w1] = arm(-9);
  const [e2, w2] = arm(7);
  const line = (a: V2, b: V2, w: number, key: string, op = 1) => (
    <line key={key} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={op} />
  );
  const thighW = 0.092 * H * build, shinW = 0.066 * H * build, footW = 0.045 * H;
  const hair = look.hair ?? "short";
  const hr = 0.062 * H;
  const lift = air >= 0 ? liftAt(t) / JUMP_H : 0; // 0..1 of the 30 cm rise
  return (
    <g>
      {shadow ? (
        <ellipse cx={x - dir * 0.05 * H} cy={ground + 0.004 * H} rx={0.2 * H * (1 - 0.25 * lift)} ry={0.022 * H * (1 - 0.25 * lift)} fill="#000" opacity={0.32 * (1 - 0.55 * lift)} />
      ) : null}
      {/* far limbs */}
      {line(fT(hip), fT(knee), thighW, "ft")}
      {line(fT(knee), fT(ankle), shinW, "fs")}
      {line(fT(heel), fT(toe), footW, "ff")}
      {line(sh, e2, 0.052 * H * build, "fa1")}
      {line(e2, w2, 0.043 * H * build, "fa2")}
      {/* torso */}
      {line(hip, sh, 0.15 * H * build, "torso")}
      {look.bag ? line([sh[0] - dir * 0.07 * H, sh[1] + 0.03 * H], [hip[0] - dir * 0.08 * H, hip[1] - 0.09 * H], 0.1 * H, "bag") : null}
      {line(sh, neck, 0.05 * H, "neck")}
      <circle cx={head[0]} cy={head[1]} r={hr} fill={color} />
      {hair === "pony" ? <ellipse cx={head[0] - dir * hr * 1.05} cy={head[1] + hr * 0.25} rx={hr * 0.42} ry={hr * 0.85} fill={color} transform={`rotate(${dir * 18} ${head[0] - dir * hr} ${head[1]})`} /> : null}
      {hair === "bun" ? <circle cx={head[0] - dir * hr * 0.55} cy={head[1] - hr * 0.85} r={hr * 0.48} fill={color} /> : null}
      {hair === "long" ? <path d={`M ${head[0] - dir * hr * 0.2} ${head[1] - hr} Q ${head[0] - dir * hr * 1.5} ${head[1] - hr * 0.4} ${head[0] - dir * hr * 1.2} ${head[1] + hr * 2.0} L ${head[0] - dir * hr * 0.2} ${head[1] + hr * 1.4} Z`} fill={color} /> : null}
      {hair === "cap" ? <path d={`M ${head[0] - hr} ${head[1] - hr * 0.2} Q ${head[0]} ${head[1] - hr * 1.5} ${head[0] + hr} ${head[1] - hr * 0.2} L ${head[0] + dir * hr * 1.75} ${head[1] - hr * 0.15} Z`} fill={color} /> : null}
      {/* near limbs */}
      {line(hip, knee, thighW, "nt")}
      {line(knee, ankle, shinW, "ns")}
      {line(heel, toe, footW, "nf")}
      {line(sh, e1, 0.054 * H * build, "na1")}
      {line(e1, w1, 0.045 * H * build, "na2")}
    </g>
  );
};

// Deterministic crowd layout helper.
export const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export type CrowdMember = { x: number; H: number; dir: 1 | -1; look: Look; row: number };

export const makeCrowd = (seed: number, width: number, rows: { n: number; H: number }[]): CrowdMember[] => {
  const r = seeded(seed);
  const hairs: Look["hair"][] = ["short", "pony", "short", "bun", "long", "cap", "short"];
  const out: CrowdMember[] = [];
  rows.forEach((row, ri) => {
    const step = width / row.n;
    for (let i = 0; i < row.n; i++) {
      const kid = r() < 0.12;
      out.push({
        x: step * (i + 0.5) + (r() - 0.5) * step * 0.55,
        H: row.H * (kid ? 0.68 : 0.88 + r() * 0.22),
        dir: r() < 0.5 ? 1 : -1,
        look: { hair: hairs[Math.floor(r() * hairs.length)], build: 0.88 + r() * 0.3, bag: r() < 0.15 },
        row: ri,
      });
    }
  });
  return out;
};

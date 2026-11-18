// The director: for any film time t it sets the world (time of day, floodlights, players, props), moves the camera
// and draws the frame. Every value is a pure function of t, so frames can be rendered in any order.
import * as THREE from "three";
import { B, FACE, FREEZE, OMEGA0, RETOSS } from "../beats";
import { FORMATS } from "../data";
import { E, S, sceneAt, sentence, TOTAL, W } from "../timing";
import { Engine, Grade, WorldState } from "./engine";
import { K, PILLAR_W, PILLAR_X, PILLAR_Z } from "./pillars";
import { Ball } from "./pitch";
import { P } from "./players";
import { applyPose, clamp01, easeInOut, easeOut, lerp, mixPose, noise1, Path, pose, Pose, seg, smooth, smoother, v3 } from "./util";

const ON = [1, 1, 1, 1];
const OFF = [0, 0, 0, 0];
const UP = new THREE.Vector3(0, 1, 0);
const AX = new THREE.Vector3(1, 0, 0);
const AZ = new THREE.Vector3(0, 0, 1);

const world = (t: number, tod: number, lamps: number[], o: Partial<WorldState> = {}): WorldState => ({ tod, lamps, time: t, cloudTime: 3 + t * 0.1, focus: v3(0, 0, 0), shadowR: 170, ...o });

// Hold-and-move camera: eases between keyed poses, resting on each one.
const keyed = (t: number, keys: [number, Pose][]): Pose => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i];
    const [t1, b] = keys[i + 1];
    if (t <= t1) return mixPose(a, b, smoother(seg(t, t0, t1)));
  }
  return keys[keys.length - 1][1];
};
// Flowing camera: a spline through the keys, no stops.
const glide = (t: number, times: number[], path: Path, warp: (u: number) => number = (u) => u): Pose => {
  const n = times.length - 1;
  let i = 0;
  while (i < n - 1 && t > times[i + 1]) i++;
  const f = clamp01((t - times[i]) / (times[i + 1] - times[i]));
  return path.at(warp((i + f) / n));
};
// A little hand-held life.
const handheld = (q: Pose, t: number, amt: number): Pose => ({ ...q, l: q.l.clone().add(v3(noise1(t * 0.7) * amt, noise1(t * 0.9 + 40) * amt * 0.7, 0)), roll: (q.roll ?? 0) + noise1(t * 0.5 + 80) * amt * 0.012 });

// Metal-halide lamps strike dim and flickering, then run up to full power.
const strike = (u: number) => {
  if (u <= 0) return 0;
  const ramp = 0.2 + 0.8 * smooth(clamp01(u / 2.2));
  const flick = 1 - 0.6 * Math.exp(-u * 4.5) * (0.5 + 0.5 * Math.sin(u * 47));
  return ramp * flick;
};

const pulse = (t: number, at: number, len: number) => Math.max(0, 1 - Math.abs(t - at) / len);

// ---------- projection for the 2D layer ----------
const _pc = new THREE.PerspectiveCamera(40, 9 / 16, 0.3, 6000);
export const project = (q: Pose, v: THREE.Vector3) => {
  _pc.fov = q.fov;
  _pc.updateProjectionMatrix();
  applyPose(_pc, q);
  const p = v.clone().project(_pc);
  const depth = v.clone().sub(q.p).dot(q.l.clone().sub(q.p).normalize());
  const ppm = 1920 / (2 * Math.max(0.01, depth) * Math.tan((q.fov * Math.PI) / 360)); // screen px per metre at that depth
  return { x: (p.x * 0.5 + 0.5) * 1080, y: (1 - (p.y * 0.5 + 0.5)) * 1920, front: p.z < 1 && depth > 0, dist: v.distanceTo(q.p), ppm };
};

// =====================================================================================================
// The coin (scenes 1, 5, 9) — close-up stage, coin units.
// =====================================================================================================
const COIN_ANCHOR = v3(0.4, 0, 2.5);
const YAW_BG = (-135 * Math.PI) / 180; // background looks towards a floodlight tower
const HOVER = 125; // height of the frozen coin above the pitch, coin units (≈1.7 m)

type CoinShot = { y: number; flip: number; yaw: number; roll: number; az: number; el: number; dist: number; lookDown: number; blur: number; wob?: [number, number]; camFollow?: number };

const coinPose = (c: CoinShot, camY?: number): Pose => {
  const cy = camY ?? c.y;
  const p = v3(Math.sin(c.az) * Math.cos(c.el), Math.sin(c.el), Math.cos(c.az) * Math.cos(c.el)).multiplyScalar(c.dist).add(v3(0, cy, 0));
  return { p, l: v3(0, cy - c.lookDown * c.dist, 0), fov: 30, roll: -0.03 };
};
const setCoin = (e: Engine, c: CoinShot) => {
  const g = e.macro.coin.group;
  g.position.set(0, c.y, 0);
  const q = new THREE.Quaternion().setFromAxisAngle(UP, c.yaw);
  q.multiply(new THREE.Quaternion().setFromAxisAngle(AX, c.flip));
  q.multiply(new THREE.Quaternion().setFromAxisAngle(AZ, c.roll));
  if (c.wob) q.premultiply(new THREE.Quaternion().setFromAxisAngle(v3(Math.cos(c.wob[1]), 0, Math.sin(c.wob[1])), c.wob[0]));
  g.quaternion.copy(q);
};

// Scene 1, local time.
const s1Coin = (t: number): CoinShot => {
  const go = Math.max(0, t - B.s1.go);
  const hold = Math.max(0, t - FREEZE);
  const flip = t < FREEZE ? FACE - (OMEGA0 / (2 * FREEZE)) * (FREEZE - t) ** 2 : FACE + 0.045 * Math.sin(hold * 0.8) + 9 * go * go;
  const k = smooth(seg(t, 0, FREEZE + 0.5));
  return {
    y: HOVER - 7 + 7 * easeOut(seg(t, 0, FREEZE)) + 70 * go * go * go,
    flip,
    yaw: -0.28 + 0.2 * k + 0.05 * Math.sin(hold * 0.45),
    roll: 0.12 - 0.06 * k,
    az: -0.34 + 0.5 * k + 0.1 * smooth(seg(t, FREEZE, B.s1.go)),
    el: -0.38,
    dist: lerp(4.3, 8.9, k) - 0.5 * smooth(seg(t, FREEZE, B.s1.go)),
    lookDown: 0.1125 * k,
    blur: lerp(0.03, 0.0025, smooth(seg(t, B.s1.go + 0.25, B.s1.end - 0.25))),
  };
};

const S1 = (e: Engine, t: number) => {
  const c = s1Coin(t);
  setCoin(e, c);
  // once time restarts the camera lets the coin fly out of frame and racks focus to the ground
  const camY = t < B.s1.go ? c.y : s1Coin(B.s1.go).y + 6 * smooth(seg(t, B.s1.go, B.s1.end));
  e.drawMacro(world(t, 1, ON), { cam: coinPose(c, camY), blur: c.blur, anchor: COIN_ANCHOR, envKey: "night", bgYaw: YAW_BG, ground: true, motes: 1 });
};

// Scene 9.
const S9 = (e: Engine, t: number) => {
  const b = B.s9;
  const hover = (tt: number): CoinShot => {
    const u = tt - S("s9");
    return { y: HOVER + Math.sin(u * 0.7) * 0.5, flip: FACE + u * 2.6, yaw: -0.08 + 0.1 * Math.sin(u * 0.3), roll: 0.06, az: 0.26 - u * 0.03, el: -0.38, dist: 8.9, lookDown: 0.1125, blur: 0.03 };
  };
  const rest: CoinShot = { y: 0.075, flip: 0, yaw: 0.55, roll: 0, az: 0.4, el: 0.62, dist: 10.6, lookDown: -0.07, blur: 0.02 };
  let c: CoinShot;
  if (t < b.fall) c = hover(t);
  else if (t < b.land) {
    const h = hover(b.fall);
    const u = seg(t, b.fall, b.land);
    const turns = Math.ceil((h.flip + 5 * Math.PI) / (2 * Math.PI)) * 2 * Math.PI - h.flip; // land heads-up
    const m = smoother(u);
    c = { y: lerp(h.y, rest.y, u * u), flip: h.flip + turns * (0.25 * u + 0.75 * u * u), yaw: lerp(h.yaw, rest.yaw, m), roll: lerp(h.roll, 0, m), az: lerp(h.az, rest.az, m), el: lerp(h.el, rest.el, m), dist: lerp(h.dist, rest.dist, m), lookDown: lerp(h.lookDown, rest.lookDown, m), blur: lerp(h.blur, rest.blur, m) };
  } else if (t < b.retoss) {
    const s = t - b.land;
    const tilt = 0.36 * Math.exp(-s * 3.4);
    const hop = 1.5 * Math.abs(Math.sin((Math.PI * s) / 0.26)) * Math.exp(-s * 8);
    c = { ...rest, y: rest.y + hop + Math.sin(tilt) * 0.55, wob: [tilt, s * 26 + 1.2], dist: rest.dist - 0.5 * smooth(seg(s, 0, 5)), az: rest.az - 0.05 * smooth(seg(s, 0, 5)) };
  } else {
    // the re-toss: arrives exactly at the first frame of the film
    const settled: CoinShot = { ...rest, dist: rest.dist - 0.5, az: rest.az - 0.05 };
    const first = s1Coin(0);
    const u = seg(t, b.retoss, TOTAL);
    const tau = TOTAL - t;
    const m = smoother(u);
    c = {
      y: lerp(settled.y, first.y, easeOut(u)),
      flip: first.flip - OMEGA0 * tau + (OMEGA0 / (2 * RETOSS)) * tau * tau,
      yaw: lerp(settled.yaw, first.yaw, m),
      roll: lerp(0, first.roll, m),
      az: lerp(settled.az, first.az, m),
      el: lerp(settled.el, first.el, m),
      dist: lerp(settled.dist, first.dist, m),
      lookDown: lerp(settled.lookDown, first.lookDown, m),
      blur: lerp(settled.blur, first.blur, m),
    };
  }
  setCoin(e, c);
  e.drawMacro(world(t, 1, ON), { cam: coinPose(c), blur: c.blur, anchor: COIN_ANCHOR, envKey: "night", bgYaw: YAW_BG, ground: true, motes: 1, shadowR: 7 });
};

// Scene 5: the coin turns between two seasons, high in the frame, above the graphs.
const S5 = (e: Engine, t: number) => {
  const b = B.s5;
  const u = t - S("s5");
  const enter = easeOut(seg(u, 0, 1.3));
  // faces left for 2024, flips over to face right for 2025, then square to the lens for "same coin"
  const side = -0.55 + 1.1 * smoother(seg(t, b.y25 - 0.2, b.y25 + 0.7)) - 0.55 * smoother(seg(t, b.same - 0.1, b.same + 0.5));
  const turn = Math.PI * 2 * (smoother(seg(t, b.y25 - 0.2, b.y25 + 0.8)) + 2 * smoother(seg(t, b.same - 0.15, b.same + 0.75)));
  const c: CoinShot = { y: HOVER, flip: FACE - 0.12 + (1 - enter) * 9, yaw: side + turn + 0.06 * Math.sin(u * 0.8), roll: 0.03 * Math.sin(u * 0.6), az: 0.0, el: -0.2, dist: 31, lookDown: 0.118 + (1 - enter) * 0.2, blur: 0.034 };
  setCoin(e, c);
  e.drawMacro(world(t, 1, ON), { cam: coinPose(c), blur: c.blur, anchor: v3(0.4, 0, 2.5), envKey: "night", bgYaw: YAW_BG + 0.5 + u * 0.012, bgGain: 0.5, motes: 0.8 });
};

// =====================================================================================================
// Scene 2 — the four pillars
// =====================================================================================================
const topOf = (i: number) => v3(PILLAR_X[i], FORMATS[i].pct * K, PILLAR_Z);
export const s2Grow = (t: number) => B.s2.rise.map(([a, b]) => easeOut(seg(t, a, b)));
const s2Keys: [number, Pose][] = (() => {
  const r = B.s2.rise;
  // medium shot on pillar i: its top in the upper third, the neighbours and the 50% line in frame
  const at = (i: number, drift = 0) => {
    const x = PILLAR_X[i] - Math.sign(PILLAR_X[i] || 1) * 1.2 + drift;
    return pose(x + 1.6, 21.5, -4.5, x, 24.2, 24, 42);
  };
  return [
    [S("s2"), pose(3.5, 1.3, -10, 5, 7.5, 24, 52)],
    [r[0][0] + 0.15, pose(5.5, 6, -9, 7.5, 12, 24, 48)],
    [r[0][1] + 0.15, at(0)],
    [r[1][0] - 0.1, at(0, -0.6)],
    [r[1][1] + 0.15, at(1)],
    [r[2][0] - 0.1, at(1, -0.6)],
    [r[2][1] + 0.15, at(2)],
    [r[3][0] - 0.05, at(2, -0.6)],
    [r[3][1] + 0.15, at(3)],
    [B.s2.wide + 1.1, pose(0, 16, -36, 0, 15.2, 24, 46)],
    [E("s2"), pose(0, 15.5, -40, 0, 14.9, 24, 46)],
  ];
})();
export const s2Cam = (t: number): Pose => keyed(t, s2Keys);
export const s2Anchors = (t: number) => {
  const cam = s2Cam(t);
  const g = s2Grow(t);
  return FORMATS.map((f, i) => {
    const v = f.pct * g[i];
    const lift = smooth(seg(v, 44, 49.6)) * Math.max(0, 50 * K + 0.75 - (v * K + 0.35)); // keep the label clear of the 50% line
    return { ...project(cam, v3(PILLAR_X[i], Math.max(v, 0.5) * K + 0.35 + lift, PILLAR_Z - PILLAR_W / 2)), grow: g[i], value: v };
  });
};
export const s2RefAnchor = (t: number) => {
  const cam = s2Cam(t);
  return { left: project(cam, v3(PILLAR_X[0] + PILLAR_W / 2 + 2.2, 50 * K, PILLAR_Z - PILLAR_W / 2)), right: project(cam, v3(PILLAR_X[3] - PILLAR_W / 2 - 2.2, 50 * K, PILLAR_Z - PILLAR_W / 2)), ref: smooth(seg(t, B.s2.ref[0], B.s2.ref[1])) };
};

const S2 = (e: Engine, t: number) => {
  e.pillars.group.visible = true;
  e.pillars.set(s2Grow(t), smooth(seg(t, B.s2.ref[0], B.s2.ref[1])), 0.25);
  e.pitch.set(0.12);
  e.drawWorld(world(t, 0.37, OFF, { focus: v3(0, 0, 22), shadowR: 62, cloudAmt: 0.3 }), s2Cam(t));
};

// =====================================================================================================
// Scene 3 — you are the captain
// =====================================================================================================
const s3Lamps = (t: number) => [0, 1, 2, 3].map((i) => strike(t - B.s3.lights - [0, 0.42, 0.84, 1.26][i]));
const S3 = (e: Engine, t: number) => {
  const b = B.s3;
  const s = S("s3");
  const c = e.cast;
  // the other captain and the match referee, out in the middle
  c.show(c.home[0], -0.75, -0.35, 0.18, P.handsOnHips(t, 1));
  c.show(c.referee, 1.75, -1.35, -0.75, P.stand(t, 2));
  // both sides warming up
  const jog = (i: number, x0: number, z: number, dir: number, off: number) => {
    const x = x0 + dir * (((t - s) * 3.1 + off) % 46);
    c.show(c.home[i], x, z, dir > 0 ? Math.PI / 2 : -Math.PI / 2, P.run((t - s) * 1.45 + off));
  };
  jog(1, -24, -30, 1, 3);
  jog(2, -27, -31.5, 1, 0.4);
  jog(3, 26, -41, -1, 9);
  c.show(c.away[0], -11, -19, 0.9, P.catching(t));
  c.show(c.away[1], -6.5, -14.5, -2.2, P.catching(t + 1.3));
  c.show(c.away[2], 12, -13, -0.6, P.stretch(t));
  c.show(c.awayBat, 9.5, -6, -0.4, P.drive(((t - s) * 0.42) % 1));
  c.show(c.umpire, 5.2, -9.5, 0.5, P.walk((t - s) * 0.7));
  e.tossCoin.visible = true;
  e.tossCoin.position.set(0.12, 0.004, 0.85);
  e.tossCoin.rotation.set(0, 0.4, 0);
  const eye = (z: number) => [0.55, 1.72 + Math.sin((t - s) * 1.9) * 0.012, z] as const;
  const cam = keyed(t, [
    [s, pose(...eye(4.6), 0.1, 1.45, -20, 50)],
    [s + 2.2, pose(...eye(3.3), 0.0, 1.5, -24, 50)],
    [b.lights + 0.9, pose(...eye(3.2), -38, 30, -44, 52)], // up at the tower as it strikes
    [b.dew - 0.15, pose(...eye(3.2), -30, 26, -46, 52)],
    [b.dew + 0.75, pose(...eye(3.1), -1.9, 0.0, 0.2, 50)], // down at the grass
    [b.won - 0.1, pose(...eye(3.1), -1.7, 0.0, 0.0, 50)],
    [b.won + 0.7, pose(...eye(3.05), 0.12, 0.0, 0.85, 15)], // the coin on the pitch
    [b.choose - 0.1, pose(...eye(3.05), 0.12, 0.0, 0.85, 13)],
    [b.choose + 0.9, pose(...eye(3.0), 0.05, 1.35, -22, 52)], // back up: the pitch ahead
    [b.end, pose(...eye(2.5), 0.0, 1.3, -22, 49)],
  ]);
  const tod = lerp(0.5, 0.8, smooth(seg(t, s, b.end)));
  e.pitch.set(0.1);
  e.drawWorld(world(t, tod, s3Lamps(t), { focus: v3(0, 0, -3), shadowR: 15, towerShadows: true, dew: 0.3 }), handheld(cam, t, 0.05), { near: 0.1 });
};

// =====================================================================================================
// Scene 4 — two scenarios, split screen
// =====================================================================================================
const BOWL_CYCLE = 4.6;
const bowlStart = B.s4.bowlBar + 0.1 - 0.78 * BOWL_CYCLE;
// Bowler's run: returns z, pose and the ball position for cycle phase c.
const bowling = (c: number, tt: number) => {
  const zRun = lerp(24, 11.3, seg(c, 0, 0.66));
  let z = zRun;
  let j = P.run(tt * 2.5);
  if (c >= 0.66) {
    const d = seg(c, 0.66, 0.84);
    z = 11.3 - d * 2.3 - seg(c, 0.84, 1) * 1.6;
    j = P.deliver(d - seg(c, 0.84, 1) * 0.25);
  }
  // ball: released at c = 0.78, pitches at z = -3.6, reaches the bat
  let ball: THREE.Vector3 | null = null;
  const fl = (c - 0.78) * BOWL_CYCLE; // seconds since release (slow motion)
  if (fl >= 0 && fl < 1.25) {
    const rel = v3(-0.32, 2.12, 9.2);
    const bounce = v3(0.12, Ball.R, -3.6);
    const end = v3(0.28, 0.95, -8.55);
    const u1 = clamp01(fl / 0.82);
    if (fl < 0.82) ball = v3(lerp(rel.x, bounce.x, u1), lerp(rel.y, bounce.y, u1) + 0.55 * Math.sin(Math.PI * u1) * (1 - u1 * 0.5), lerp(rel.z, bounce.z, u1));
    else {
      const u2 = clamp01((fl - 0.82) / 0.43);
      ball = v3(lerp(bounce.x, end.x, u2), lerp(bounce.y, end.y, u2) + 0.16 * Math.sin(Math.PI * u2), lerp(bounce.z, end.z, u2));
    }
  }
  return { z, j, ball, fl };
};

const S4 = (e: Engine, t: number) => {
  const c = e.cast;
  const w = world(t, 1, ON, { focus: v3(0, 0, 0), shadowR: 17, towerShadows: true, dew: 0.5 });
  e.pitch.set(0.1);
  // --- top half: BOWL FIRST — the bowler steams in, camera tracking alongside
  {
    const cyc = (((t - bowlStart) / BOWL_CYCLE) % 1 + 1) % 1;
    const bw = bowling(cyc, t);
    c.hideAll();
    c.show(c.away[0], -0.45, bw.z, Math.PI, bw.j);
    const hit = seg(bw.fl, 0.95, 1.5);
    c.show(c.homeBat, 0.42, -8.95, Math.PI / 2 + 0.25, bw.fl > 0.7 ? P.drive(seg(bw.fl, 0.75, 1.75)) : P.batStance(t));
    c.show(c.home[4], -1.5, 9.6, Math.PI, P.stand(t, 4));
    c.show(c.umpire, 1.15, 12.4, Math.PI, P.stand(t, 3));
    c.show(c.away[3], 0.15, -13.2, 0, P.crouch(t));
    c.show(c.away[1], 2.6, -14.6, -0.15, P.stand(t, 5));
    c.show(c.away[2], -9, -2, 1.2, P.stand(t, 6));
    e.ball.kind("white");
    e.ball.group.visible = Boolean(bw.ball);
    if (bw.ball) e.ball.group.position.copy(bw.ball);
    e.ball.group.rotation.set(t * 30, 0, 0.4);
    e.stadium.stumps.visible = true;
    void hit;
    const cz = bw.z;
    const cam = pose(-5.4, 1.25 + noise1(t * 1.3) * 0.03, cz + 4.2, 0.2, 1.3, cz - 4.5, 34);
    e.drawWorld({ ...w, focus: v3(0, 0, cz - 3) }, cam, { near: 0.1, view: [0, 0.5, 1, 0.5] });
  }
  // --- bottom half: BAT FIRST — the batter takes guard, camera circling slowly
  {
    c.hideAll();
    const sh = seg(t, B.s4.shot, B.s4.shot + 1.25);
    const back = seg(t, B.s4.shot + 2.3, B.s4.shot + 3.1);
    c.show(c.awayBat, 0.42, -8.95, Math.PI / 2 + 0.25, sh > 0 && back < 1 ? P.drive(sh * (1 - back)) : P.batStance(t));
    c.show(c.home[5], -0.4, 15.5, Math.PI, P.walk(t * 0.8, 0.3));
    c.show(c.umpire, 1.15, 12.4, Math.PI, P.stand(t, 3));
    c.show(c.home[6], 0.15, -13.2, 0, P.crouch(t));
    c.show(c.home[7], 2.6, -14.6, -0.15, P.stand(t, 5));
    c.show(c.away[1], -1.5, 9.6, Math.PI, P.stand(t, 4));
    e.ball.group.visible = false;
    const a = lerp(0.95, 0.1, smooth(seg(t, S("s4"), E("s4"))));
    const cam = pose(0.42 + Math.sin(a) * 4.6, 0.95 + 0.4 * smooth(seg(t, S("s4"), E("s4"))), -8.95 + Math.cos(a) * 4.6, 0.42, 1.05, -8.95, 36);
    e.drawWorld({ ...w, focus: v3(0, 0, -8) }, cam, { near: 0.1, view: [0, 0, 1, 0.5] });
  }
};

// =====================================================================================================
// Scene 6 — afternoon becomes a day-night match
// =====================================================================================================
const s6Path = new Path([pose(0, 46, 96, 0, 8, -40, 46), pose(0, 36, 70, 0, 9, -52, 46), pose(0, 25, 44, 0, 11, -66, 47), pose(0.6, 13, 22, 0, 12, -72, 48), pose(1.6, 4.2, 9.5, 0.6, 7, -74, 46), pose(2.0, 0.9, 5.2, 1.6, 0.9, -40, 40)]);
const DEW_ANCHOR = v3(2.0, 0.0, 4.4);
const S6 = (e: Engine, t: number) => {
  const b = B.s6;
  const s = S("s6");
  const lapse = smoother(seg(t, b.lapse[0], b.lapse[1]));
  const tod = 0.03 + 0.97 * lapse;
  const lamps = [0, 1, 2, 3].map((i) => strike(t - b.lights - i * 0.3));
  const cloudTime = 4 + (t - s) * 0.12 + lapse * 16; // clouds race while time accelerates
  const w = world(t, tod, lamps, { cloudTime, cloudAmt: 0.44, focus: v3(0, 0, 0), shadowR: 170, dew: smooth(seg(t, b.lights, b.reveal)) });
  e.pitch.set(0.1);
  const low = b.down + 0.75; // from here the lens is at grass level and the close-up stage takes over
  if (t < low) {
    const cam = glide(t, [s, b.dayLabel, b.lapse[0] + 1.6, b.lights + 0.6, b.down - 0.2, low], s6Path);
    e.drawWorld(w, cam, { near: 0.2 });
  } else {
    const u = smoother(seg(t, low, b.reveal + 0.35));
    const start = s6Path.at(1);
    const p0 = start.p.clone().sub(DEW_ANCHOR);
    const dir0 = start.l.clone().sub(start.p).normalize();
    const p1 = v3(0, 0.082, 0.34);
    const dir1 = v3(0.04, 0.07, -1).normalize();
    const p = p0.clone().lerp(p1, u);
    p.z -= (t - b.reveal) > 0 ? (t - b.reveal) * 0.012 : 0; // keep creeping forward
    const dir = dir0.clone().lerp(dir1, u).normalize();
    e.macro.grass.setDew(smooth(seg(t, low + 0.2, b.reveal + 0.9)));
    e.drawMacro(w, { cam: { p, l: p.clone().add(dir), fov: lerp(40, 30, u) }, blur: lerp(0.0, 0.03, u), anchor: DEW_ANCHOR, envKey: "night", set: "grass", scale: 1, grassGrow: smooth(seg(u, 0.0, 0.45)), bgGain: 1 });
  }
};

// =====================================================================================================
// Scene 7 — five days of a Test pitch
// =====================================================================================================
export const s7Wear = (t: number) => 0.02 + 0.5 * smooth(seg(t, B.s7.day3, B.s7.day3 + 1.3)) + 0.48 * smooth(seg(t, B.s7.day5, B.s7.day5 + 1.3));
// A ball pitching on a length: u = flight progress; `kick` changes how it comes off the surface.
const delivery = (u: number, kick: { rise: number; turn: number; skid: number }) => {
  const from = v3(0.18, 2.0, -9.2);
  const pitchAt = v3(0.1, Ball.R, 2.2);
  const k = 0.62;
  if (u < k) {
    const a = u / k;
    return v3(lerp(from.x, pitchAt.x, a), lerp(from.y, pitchAt.y, a) + 0.5 * Math.sin(Math.PI * a) * (1 - a * 0.6), lerp(from.z, pitchAt.z, a));
  }
  const a = (u - k) / (1 - k);
  const end = v3(pitchAt.x + kick.turn, 0.72 * kick.rise, 9.6 + kick.skid);
  return v3(lerp(pitchAt.x, end.x, a), Ball.R + (end.y - Ball.R) * (1 - (1 - a) ** 2) + 0.05 * Math.sin(Math.PI * a), lerp(pitchAt.z, end.z, a));
};
const TRUE_BOUNCE = { rise: 1, turn: 0.0, skid: 0 };
const S7 = (e: Engine, t: number) => {
  const b = B.s7;
  const s = S("s7");
  const wear = s7Wear(t);
  e.pitch.set(wear);
  const c = e.cast;
  // a slip and a keeper in whites, far end out of focus of attention
  c.show(c.whites[0], 0.2, 13.4, Math.PI, P.crouch(t));
  c.show(c.whites[1], 2.4, 14.8, Math.PI + 0.2, P.stand(t, 2));
  e.ball.kind("red");
  // deliveries: one on day one (true), two on day five (one shoots, one spits)
  const d1 = seg(t, s + 0.9, s + 3.6);
  const d5a = seg(t, b.bounce - 0.15, b.bounce + 1.15);
  const d5b = seg(t, b.bounce + 1.05, b.bounce + 2.35);
  let ball: THREE.Vector3 | null = null;
  if (d1 > 0 && d1 < 1) ball = delivery(d1, TRUE_BOUNCE);
  else if (d5a > 0 && d5a < 1) ball = delivery(d5a, { rise: 0.22, turn: -0.12, skid: 0.6 });
  else if (d5b > 0 && d5b < 1) ball = delivery(d5b, { rise: 1.75, turn: 0.75, skid: -0.6 });
  e.ball.group.visible = Boolean(ball);
  if (ball) e.ball.group.position.copy(ball);
  e.ball.group.rotation.set(-t * 22, 0.4, 0.2);
  // on day five, dots trace where a day-one ball would have gone
  const showTrail = t > b.bounce - 0.3;
  e.trail.visible = showTrail;
  if (showTrail) {
    const m = new THREE.Matrix4();
    for (let i = 0; i < e.trail.count; i++) {
      const p = delivery(0.5 + (i / (e.trail.count - 1)) * 0.5, TRUE_BOUNCE);
      m.makeTranslation(p.x, p.y, p.z);
      e.trail.setMatrixAt(i, m);
    }
    e.trail.instanceMatrix.needsUpdate = true;
    (e.trail.material as THREE.MeshBasicMaterial).opacity = 0.75 * smooth(seg(t, b.bounce - 0.3, b.bounce + 0.2));
  }
  const cam = keyed(t, [
    [s, pose(1.25, 0.42, 9.9, 0.0, 0.5, 1.5, 34)],
    [b.reveal + 0.4, pose(1.05, 0.5, 9.2, 0.0, 0.45, 1.5, 34)],
    [b.over + 0.2, pose(0.9, 0.55, 8.9, 0.0, 0.35, 2.5, 34)],
    [b.day3 + 0.5, pose(-1.25, 0.34, 6.7, 0.35, 0.0, 4.4, 38)], // down at the surface as it wears
    [b.day5 + 1.0, pose(1.15, 0.26, 5.6, -0.35, 0.0, 3.2, 38)], // across the cracks
    [b.bounce + 0.35, pose(1.3, 0.4, 9.6, 0.0, 0.42, 2.0, 34)], // back behind the stumps for the bounce
    [E("s7"), pose(1.15, 0.44, 9.2, 0.0, 0.5, 2.0, 34)],
  ]);
  // each "day" the sun sits a little lower: a quick shadow swing marks the days passing
  const tod = 0.04 + 0.06 * smooth(seg(t, b.day3 - 0.2, b.day3 + 1.0)) + 0.07 * smooth(seg(t, b.day5 - 0.2, b.day5 + 1.0));
  e.drawWorld(world(t, tod, OFF, { focus: v3(0, 0, 5), shadowR: 13, cloudAmt: 0.36, dry: 0.25 * wear }), handheld(cam, t, 0.012), { near: 0.05 });
};

// =====================================================================================================
// Scene 8 — montage of conditions, then the diagram over a slow night aerial
// =====================================================================================================
export const montageCuts = (() => {
  const [a, b] = B.s8.montage;
  return Array.from({ length: 8 }, (_, i) => a + ((b - a) * i) / 7);
})();
const S8 = (e: Engine, t: number) => {
  const c = e.cast;
  const cuts = montageCuts;
  let shot = 7;
  for (let i = 0; i < 7; i++)
    if (t < cuts[i + 1]) {
      shot = i;
      break;
    }
  const u = shot < 7 ? seg(t, cuts[shot], cuts[shot + 1]) : 0;
  e.pitch.set(0.1);
  if (shot === 0) {
    // pitch inspection
    c.show(c.whites[0], 0.95, 6.3, -1.9, P.crouch(t));
    c.show(c.umpire, -1.3, 7.4, 2.2, P.armsCrossed(t, 1));
    e.pitch.set(0.3);
    e.drawWorld(world(t, 0.08, OFF, { focus: v3(0, 0, 6), shadowR: 12 }), pose(2.9 - u * 0.3, 0.75, 9.6 - u * 0.4, 0.6, 0.55, 6.3, 34), { near: 0.1 });
  } else if (shot === 1) {
    // captains at the toss
    c.show(c.home[0], -0.7, 0.2, 0.9, P.tossFlick(u));
    c.show(c.away[0], 0.75, 0.35, -0.9, P.handsOnHips(t, 2));
    c.show(c.referee, 0.05, -0.95, 0, P.stand(t, 1));
    e.tossCoin.visible = true;
    e.tossCoin.position.set(-0.25, 1.35 + Math.sin(u * Math.PI) * 1.05 + u * 0.3, 0.55);
    e.tossCoin.rotation.set(u * 40, 0, 0.3);
    e.drawWorld(world(t, 0.62, [0.8, 0.8, 0.8, 0.8], { focus: v3(0, 0, 0), shadowR: 10, towerShadows: true }), pose(0.4 + u * 0.25, 1.25, 4.3, 0.0, 1.5 + u * 0.15, 0, 36), { near: 0.1 });
  } else if (shot === 2) {
    // hot, dry afternoon
    e.drawWorld(world(t, 0.0, OFF, { dry: 1, cloudAmt: 0.12, shadowR: 170 }), pose(-28 + u * 2, 1.4, 34, 14, 15, -50, 46));
  } else if (shot === 3) {
    // sunset
    e.drawWorld(world(t, 0.53, OFF, { cloudAmt: 0.5, cloudTime: 9 }), pose(20 - u * 2, 30, 60, -40, 22, -70, 50));
  } else if (shot === 4) {
    // dew
    e.macro.grass.setDew(1);
    e.drawMacro(world(t, 1, ON, { dew: 1 }), { cam: pose(0.02, 0.085, 0.36 - u * 0.03, 0.05, 0.075, -1, 30), blur: 0.03, anchor: DEW_ANCHOR, envKey: "night", set: "grass", scale: 1 });
  } else if (shot === 5) {
    // cracked pitch
    e.pitch.set(1);
    e.drawWorld(world(t, 0.2, OFF, { focus: v3(0, 0, 4.5), shadowR: 10, dry: 0.3 }), pose(0.95 - u * 0.25, 0.24, 6.0, -0.3, 0.0, 3.6, 38), { near: 0.05 });
  } else if (shot === 6) {
    // players talking it through
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      c.show(c.home[i], 6 + Math.sin(a) * 1.05, -4 + Math.cos(a) * 1.05, a + Math.PI, i === 0 ? P.point(t) : P.huddle(t, i));
    }
    const a = 0.5 + u * 0.22;
    e.drawWorld(world(t, 1, ON, { focus: v3(6, 0, -4), shadowR: 9, towerShadows: true, dew: 0.6 }), pose(6 + Math.sin(a) * 5.2, 1.15, -4 + Math.cos(a) * 5.2, 6, 1.3, -4, 36), { near: 0.1 });
  } else {
    // the ground from above, slowly turning, behind the diagram
    const a = 0.35 + (t - cuts[7]) * 0.035;
    e.drawWorld(world(t, 1, ON, { dew: 0.8 }), pose(Math.sin(a) * 118, 82, Math.cos(a) * 128, 0, -6, 0, 50));
  }
};

// =====================================================================================================
// Grade and cuts
// =====================================================================================================
const gradeAt = (t: number, id: string): Grade => {
  const g: Grade = {};
  // cuts: a white flash into the data (s2), into the twist (s6) and into daylight (s7); dips to black elsewhere
  g.flash = 0.9 * pulse(t, S("s2"), 0.2) + 0.75 * pulse(t, S("s6"), 0.16) + 0.5 * pulse(t, S("s7"), 0.14) + 0.35 * pulse(t, S("s4"), 0.1);
  g.fade = pulse(t, S("s3"), 0.17) + pulse(t, S("s5"), 0.17) + pulse(t, S("s8"), 0.12) + pulse(t, S("s9"), 0.24);
  if (id === "s8") for (const c of montageCuts.slice(1)) g.flash += 0.4 * pulse(t, c, 0.07);
  if (id === "s1" || id === "s9") Object.assign(g, { bloom: 1.15, contrast: 1.1, sat: 1.08, vignette: 0.5 });
  if (id === "s2") Object.assign(g, { sat: 1.12, contrast: 1.08, shadowTint: [0.95, 0.98, 1.05], highTint: [1.05, 1.0, 0.93] });
  if (id === "s3") Object.assign(g, { contrast: 1.08, vignette: 0.5 });
  if (id === "s4") Object.assign(g, { exposure: 1.05, contrast: 1.1, vignette: 0.3 });
  if (id === "s5") Object.assign(g, { exposure: 0.9, vignette: 0.55, sat: 0.95 });
  if (id === "s7") Object.assign(g, { sat: 1.0, contrast: 1.1, shadowTint: [1.0, 0.98, 0.96], highTint: [1.04, 1.0, 0.94] });
  if (id === "s8") {
    const shot = montageCuts.findIndex((c, i) => t >= c && t < (montageCuts[i + 1] ?? 1e9));
    if (shot === 2) Object.assign(g, { exposure: 1.25, sat: 0.82, contrast: 1.12, highTint: [1.08, 1.0, 0.88], shadowTint: [1.04, 1.0, 0.94] });
    if (shot === 7) Object.assign(g, { exposure: 0.7, vignette: 0.6 });
  }
  // the hook's hit: a brief flare when the stat lands
  if (id === "s1") g.flash = (g.flash ?? 0) + 0.28 * pulse(t, B.s1.stat + 0.03, 0.09);
  if (id === "s9") g.flash = (g.flash ?? 0) + 0.2 * pulse(t, B.s9.land + 0.02, 0.07);
  return g;
};

export const direct = (e: Engine, t: number) => {
  const id = sceneAt(t);
  // clean slate
  e.cast.hideAll();
  e.pillars.group.visible = false;
  e.ball.group.visible = false;
  e.tossCoin.visible = false;
  e.trail.visible = false;
  e.begin();
  if (id === "s1") S1(e, t);
  else if (id === "s2") S2(e, t);
  else if (id === "s3") S3(e, t);
  else if (id === "s4") S4(e, t);
  else if (id === "s5") S5(e, t);
  else if (id === "s6") S6(e, t);
  else if (id === "s7") S7(e, t);
  else if (id === "s8") S8(e, t);
  else S9(e, t);
  e.finish(gradeAt(t, id), t);
};

void sentence;
void W;
void easeInOut;

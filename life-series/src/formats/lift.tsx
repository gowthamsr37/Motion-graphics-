// Gym: Expectation (day 1, presses 140 kg, instantly huge) vs Reality (empty bar, thousands of reps,
// plates added month by month, a couple of failed lifts, the body slowly grows, then the PR).
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "../lib/theme";
import { Arrow, ease, EndCard, fmt, Hand, Panel, Sfx, StageExit, Title } from "../lib/ui";
import { FormatModule, Post } from "../types";

const GROUND = 455, CX = 370;
const LOW = 250, HIGH = 118; // bar at shoulders / locked out overhead
const L1 = 70, L2 = 68;

// ---------- schedule ----------
const EXP = { press: 50, top: 66, pop: 72 };
const P2 = 118, M0 = 150;
type Rep = { t: number; dur: number; fail: boolean };
const REPS: Rep[] = (() => {
  const out: Rep[] = [];
  let t = M0, g = 18;
  for (let k = 0; k < 34; k++) {
    const fail = k === 9 || k === 21;
    const dur = Math.round(fail ? Math.max(g, 24) : g);
    out.push({ t, dur, fail });
    t += dur + (fail ? 10 : 0);
    g = Math.max(5, g * 0.92);
  }
  return out;
})();
const M1 = REPS[REPS.length - 1].t + REPS[REPS.length - 1].dur;
const FIN = { start: M1 + 24, top: M1 + 24 + 46 };
const END_AT = FIN.top + 50;

// ---------- weights ----------
const PLATE_H: Record<number, number> = { 25: 150, 20: 138, 15: 118, 10: 98, 5: 72, 2.5: 56 };
const platesFor = (kg: number) => {
  let side = (kg - 20) / 2;
  const out: number[] = [];
  for (const p of [25, 20, 15, 10, 5, 2.5]) while (side >= p - 1e-6) { out.push(p); side -= p; }
  return out;
};

// ---------- drawing ----------
const ik = (s: { x: number; y: number }, h: { x: number; y: number }, side: 1 | -1) => {
  const dx = h.x - s.x, dy = h.y - s.y;
  const d = Math.min(L1 + L2 - 1, Math.max(8, Math.hypot(dx, dy)));
  const a = Math.atan2(dy, dx);
  const bend = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const e = a + side * bend;
  return { x: s.x + Math.cos(e) * L1, y: s.y + Math.sin(e) * L1 };
};

const Limb: React.FC<{ pts: { x: number; y: number }[]; w: number }> = ({ pts, w }) => {
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <>
      <path d={d} stroke={T.ink} strokeWidth={w + 7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={T.skin} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  );
};

const Barbell: React.FC<{ y: number; kg: number; accent: string; tilt?: number }> = ({ y, kg, accent, tilt = 0 }) => {
  const plates = platesFor(kg);
  return (
    <g transform={`rotate(${tilt} ${CX} ${y})`}>
      <path d={`M${CX - 235},${y} L${CX + 235},${y}`} stroke={T.ink} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${CX - 235},${y} L${CX + 235},${y}`} stroke="#b9b9b9" strokeWidth={3} strokeLinecap="round" />
      {[-1, 1].map((sd) => {
        let x = CX + sd * 140;
        return (
          <g key={sd}>
            <rect x={sd > 0 ? x - 8 : x} y={y - 12} width={8} height={24} rx={2} fill={T.ink} />
            {plates.map((p, i) => {
              const w = p >= 15 ? 18 : 14, h = PLATE_H[p];
              const px = sd > 0 ? x + 2 : x - 2 - w;
              x += sd * (w + 3);
              return <rect key={i} x={px} y={y - h / 2} width={w} height={h} rx={4} fill={p === 25 ? accent : "#3a3a3a"} stroke={T.ink} strokeWidth={3} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

// front-facing lifter; m = muscle 0..1, barY = bar height, strain = 0..1
const Lifter: React.FC<{ m: number; barY: number; kg: number; accent: string; strain?: number; f: number; shake?: number }> = ({ m, barY, kg, accent, strain = 0, f, shake = 0 }) => {
  const sw = 26 + 30 * m, ww = 18 + 8 * m;
  const sy = 246;
  const jit = strain * Math.sin(f * 3.1) * 1.6 + shake;
  const bar = barY + jit;
  const S = { L: { x: CX - sw, y: sy }, R: { x: CX + sw, y: sy } };
  const H = { L: { x: CX - 70 - 10 * m, y: bar }, R: { x: CX + 70 + 10 * m, y: bar } };
  const E = { L: ik(S.L, H.L, -1), R: ik(S.R, H.R, 1) };
  const up = 8 + 20 * m, fore = 7 + 12 * m;
  const ink = { stroke: T.ink, strokeWidth: 4.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <g transform={`translate(${CX} ${GROUND}) scale(0.86) translate(${-CX} ${-GROUND})`}>
      <ellipse cx={CX} cy={GROUND + 2} rx={70} ry={6} fill={T.ink} opacity={0.12} />
      {/* legs */}
      <Limb pts={[{ x: CX - 16, y: 345 }, { x: CX - 30, y: 400 }, { x: CX - 36, y: GROUND - 6 }]} w={10 + 6 * m} />
      <Limb pts={[{ x: CX + 16, y: 345 }, { x: CX + 30, y: 400 }, { x: CX + 36, y: GROUND - 6 }]} w={10 + 6 * m} />
      <path d={`M${CX - 50},${GROUND - 3} L${CX - 26},${GROUND - 3} M${CX + 26},${GROUND - 3} L${CX + 50},${GROUND - 3}`} {...ink} strokeWidth={8} />
      {/* shorts */}
      <path d={`M${CX - ww - 4},322 L${CX + ww + 4},322 L${CX + ww + 10},366 L${CX + 4},366 L${CX},350 L${CX - 4},366 L${CX - ww - 10},366 Z`} fill="#2d2d36" stroke={T.ink} strokeWidth={4} strokeLinejoin="round" />
      {/* torso: tank top, V-shape grows with m */}
      <path d={`M${CX - sw},${sy - 4} Q${CX},${sy - 16} ${CX + sw},${sy - 4} L${CX + ww},326 L${CX - ww},326 Z`} fill={accent} stroke={T.ink} strokeWidth={4} strokeLinejoin="round" />
      {m > 0.35 && <path d={`M${CX - sw * 0.55},${sy + 26} Q${CX - 6},${sy + 40} ${CX},${sy + 28} Q${CX + 6},${sy + 40} ${CX + sw * 0.55},${sy + 26}`} {...ink} strokeWidth={3} opacity={Math.min(1, (m - 0.35) * 3)} />}
      {/* neck + head */}
      <Limb pts={[{ x: CX, y: sy - 8 }, { x: CX, y: 222 }]} w={10 + 6 * m} />
      <circle cx={CX} cy={198} r={26} fill={T.skin} stroke={T.ink} strokeWidth={4} />
      <path d={`M${CX - 26},194 Q${CX - 24},168 ${CX},168 Q${CX + 24},168 ${CX + 26},194 Q${CX + 10},180 ${CX - 6},184 Q${CX - 18},186 ${CX - 26},194 Z`} fill={T.ink} />
      {strain > 0.3 ? (
        <>
          <path d={`M${CX - 14},198 l8,3 M${CX + 14},198 l-8,3`} {...ink} strokeWidth={3} />
          <rect x={CX - 10} y={208} width={20} height={8} rx={2} fill="#fff" stroke={T.ink} strokeWidth={2.5} />
        </>
      ) : (
        <>
          <circle cx={CX - 9} cy={198} r={3} fill={T.ink} />
          <circle cx={CX + 9} cy={198} r={3} fill={T.ink} />
          <path d={`M${CX - 8},210 Q${CX},216 ${CX + 8},210`} {...ink} strokeWidth={2.8} />
        </>
      )}
      {/* arms + bar (bar drawn first so hands sit on top) */}
      <Barbell y={bar} kg={kg} accent={accent} />
      <path d={`M${S.L.x},${S.L.y} L${E.L.x},${E.L.y}`} stroke={T.ink} strokeWidth={up + 7} strokeLinecap="round" />
      <path d={`M${E.L.x},${E.L.y} L${H.L.x},${H.L.y}`} stroke={T.ink} strokeWidth={fore + 7} strokeLinecap="round" />
      <path d={`M${S.L.x},${S.L.y} L${E.L.x},${E.L.y}`} stroke={T.skin} strokeWidth={up} strokeLinecap="round" />
      <path d={`M${E.L.x},${E.L.y} L${H.L.x},${H.L.y}`} stroke={T.skin} strokeWidth={fore} strokeLinecap="round" />
      <path d={`M${S.R.x},${S.R.y} L${E.R.x},${E.R.y}`} stroke={T.ink} strokeWidth={up + 7} strokeLinecap="round" />
      <path d={`M${E.R.x},${E.R.y} L${H.R.x},${H.R.y}`} stroke={T.ink} strokeWidth={fore + 7} strokeLinecap="round" />
      <path d={`M${S.R.x},${S.R.y} L${E.R.x},${E.R.y}`} stroke={T.skin} strokeWidth={up} strokeLinecap="round" />
      <path d={`M${E.R.x},${E.R.y} L${H.R.x},${H.R.y}`} stroke={T.skin} strokeWidth={fore} strokeLinecap="round" />
      <circle cx={H.L.x} cy={H.L.y} r={8 + 2 * m} fill={T.skin} stroke={T.ink} strokeWidth={3} />
      <circle cx={H.R.x} cy={H.R.y} r={8 + 2 * m} fill={T.skin} stroke={T.ink} strokeWidth={3} />
    </g>
  );
};

const Sweat: React.FC<{ t: number }> = ({ t }) => {
  if (t < 0 || t > 14) return null;
  const k = t / 14;
  return (
    <g opacity={1 - k}>
      {[-1, 1].map((s) => (
        <path key={s} transform={`translate(${CX + s * (34 + 30 * k)},${182 - 10 * k + 40 * k * k})`} d="M0,-9 Q6,0 0,6 Q-6,0 0,-9 Z" fill="#9fd3f0" stroke={T.ink} strokeWidth={2} />
      ))}
    </g>
  );
};

const Pop: React.FC<{ t: number; text: string; accent: string; x: number; y: number; size?: number }> = ({ t, text, accent, x, y, size = 64 }) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: T.spring.pop });
  return (
    <g transform={`translate(${x},${y}) rotate(${-7 + 2 * Math.sin(t / 7)}) scale(${0.4 + 0.6 * s})`} opacity={Math.min(1, t / 4)}>
      <text textAnchor="middle" fontFamily={T.fonts.script} fontSize={size} fill={accent} stroke={T.ink} strokeWidth={1.4} paintOrder="stroke">{text}</text>
    </g>
  );
};

// bar height for a rep at frame f
const repBar = (r: Rep, f: number) => {
  const u = (f - r.t) / r.dur;
  if (u < 0 || u > 1) return LOW;
  if (!r.fail) return LOW - (LOW - HIGH) * Math.sin(Math.PI * u);
  return u < 0.6 ? LOW - (LOW - HIGH) * 0.45 * Math.sin((Math.PI / 2) * (u / 0.6)) : LOW - (LOW - HIGH) * 0.45 * (1 - ((u - 0.6) / 0.4) ** 2);
};

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = p.lift!;
  // expectation
  const expBar = f < EXP.press ? LOW : f < EXP.top ? ease(f, EXP.press, EXP.top, LOW, HIGH, T.ease.inOut) : HIGH + Math.sin(f / 9) * 2;
  const expM = spring({ frame: f - EXP.pop, fps, config: T.spring.pop });
  // reality
  const prog = ease(f, M0, M1, 0, 1, (t) => t);
  const cur = REPS.filter((r) => r.t <= f).pop();
  const kgNow = f >= FIN.start ? d.maxKg : 20 + Math.floor((prog * (d.maxKg - 30)) / 10) * 10;
  const m = f >= FIN.start ? 1 : prog * 0.85;
  const done = REPS.filter((r) => r.t + r.dur <= f && !r.fail).length;
  const reps = f >= M1 ? d.reps : Math.round(d.reps * (done / REPS.filter((r) => !r.fail).length) ** 1.5);
  const month = f >= M1 ? d.months : 1 + Math.floor(prog * (d.months - 1));
  let bar = LOW, strain = 0, shake = 0;
  if (f >= FIN.start) {
    bar = f < FIN.top ? LOW - (LOW - HIGH) * ease(f, FIN.start, FIN.top, 0, 1, T.ease.inOut) : HIGH + Math.sin(f / 9) * 2;
    strain = f < FIN.top ? 1 : ease(f, FIN.top, FIN.top + 20, 1, 0);
  } else if (cur && f < cur.t + cur.dur) {
    bar = repBar(cur, f);
    strain = cur.fail ? 1 : 0.2 + 0.5 * prog;
  }
  const failNow = REPS.find((r) => r.fail && f >= r.t + r.dur * 0.85 && f < r.t + r.dur + 10);
  if (failNow) shake = Math.sin(f * 2.7) * 3;
  const plateAdds: number[] = [];
  for (let fr = M0 + 1; fr <= M1; fr++) {
    const kg = (x: number) => 20 + Math.floor((ease(x, M0, M1, 0, 1, (t) => t) * (d.maxKg - 30)) / 10) * 10;
    if (kg(fr) !== kg(fr - 1)) plateAdds.push(fr);
  }
  const labelX = 655;
  return (
    <>
      <StageExit at={END_AT}>
        <Title text={p.title} />
        <div style={{ position: "absolute", top: 430, left: 60 }}>
          <Panel f={f} start={14} label="Expectation" ground={GROUND} id="e">
            <g opacity={ease(f, 26, 36, 0, 1)}>
              <Lifter m={expM} barY={expBar} kg={d.maxKg} accent={accent} f={f} />
            </g>
            <Hand x={labelX} y={150} size={46} show={ease(f, 30, 42, 0, 1)}>Day 1</Hand>
            <Hand x={labelX} y={206} size={42} color={T.inkSoft} show={ease(f, 34, 46, 0, 1)}>{d.maxKg} kg, 1 rep</Hand>
            <Pop t={f - EXP.pop} text="Easy!" accent={accent} x={labelX + 110} y={330} />
          </Panel>
        </div>
        <div style={{ position: "absolute", top: 990, left: 60 }}>
          <Panel f={f} start={P2} label="Reality" ground={GROUND} id="r">
            <g opacity={ease(f, P2 + 10, P2 + 20, 0, 1)}>
              <Lifter m={m} barY={bar} kg={kgNow} accent={accent} strain={strain} f={f} shake={shake} />
            </g>
            {REPS.map((r, i) => (!r.fail && i % 3 === 1 ? <Sweat key={i} t={f - r.t - r.dur * 0.4} /> : null))}
            {failNow && <Hand x={CX + 60} y={150} size={40} color={T.inkSoft} show={1} rot={-8}>ugh.</Hand>}
            <g opacity={ease(f, M0 - 10, M0, 0, 1)}>
              <text x={labelX} y={150} fontFamily={T.fonts.title} fontSize={50} fill={T.ink}>Month {month}</text>
              <text x={labelX} y={210} fontFamily={T.fonts.hand} fontSize={46} fill={accent} stroke={T.ink} strokeWidth={0.6}>{fmt(reps)}</text>
              <text x={labelX} y={255} fontFamily={T.fonts.hand} fontSize={40} fill={T.ink}>reps</text>
              <text x={labelX} y={320} fontFamily={T.fonts.hand} fontSize={40} fill={T.inkSoft}>bar: {kgNow} kg</text>
            </g>
            <Pop t={f - FIN.top} text="New PR!" accent={accent} x={labelX + 120} y={410} size={60} />
          </Panel>
        </div>
      </StageExit>
      <EndCard at={END_AT} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={14} name="scribble" vol={0.25} />
      <Sfx at={EXP.top} name="clank" vol={0.35} />
      <Sfx at={EXP.pop} name="pop" vol={0.6} />
      <Sfx at={EXP.pop} name="success" vol={0.5} />
      <Sfx at={P2} name="scribble" vol={0.25} />
      {REPS.map((r, i) => <Sfx key={i} at={r.t + r.dur} name={r.fail ? "thud" : "tock"} vol={r.fail ? 0.6 : 0.22} />)}
      {REPS.filter((r) => r.fail).map((r, i) => <Sfx key={`f${i}`} at={r.t + r.dur} name="sad" vol={0.45} />)}
      {plateAdds.map((fr, i) => <Sfx key={`c${i}`} at={fr} name="clank" vol={0.4} />)}
      <Sfx at={FIN.start - 6} name="clank" vol={0.55} />
      <Sfx at={FIN.start} name="riser" vol={0.45} />
      <Sfx at={FIN.top} name="boom" vol={0.6} />
      <Sfx at={FIN.top} name="success" vol={0.75} />
      <Sfx at={FIN.top} name="cheer" vol={0.6} />
      <Sfx at={END_AT - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const lift: FormatModule = { duration: () => END_AT + 120, cover: () => FIN.top + 25, Comp };

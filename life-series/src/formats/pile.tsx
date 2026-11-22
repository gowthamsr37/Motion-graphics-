// Expectation vs Reality: 1 throw hits the target vs a mountain of misses before the hit.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "../lib/theme";
import { Arrow, ease, EndCard, fmt, Hand, Panel, Person, Pt, Sfx, StageExit, Title } from "../lib/ui";
import { FormatModule, Post } from "../types";

const GROUND = 455, R = 13, PS = 1.25;
const SHOULDER = { x: 150, y: GROUND - 150 * PS };
const TARGET = { x: 850, y: 215 };
type Shot = { wind: number; rel: number; land: number };

const sched = () => {
  const exp: Shot = { wind: 40, rel: 50, land: 84 };
  const shots: Shot[] = [];
  let t = 150, g = 15;
  for (let k = 0; k < 45; k++) { shots.push({ wind: t - 8, rel: t, land: t + 15 }); t += Math.round(g); g = Math.max(2, g * 0.9); }
  const last = shots[shots.length - 1].rel;
  const fin: Shot = { wind: last + 24, rel: last + 34, land: last + 34 + 34 };
  return { exp, shots, fin, panel2: 118, endAt: fin.land + 45 };
};
const S = sched();

const PILE: Pt[] = (() => {
  const out: Pt[] = [];
  for (let row = 0; row < 9; row++) {
    const n = 9 - row;
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(a - (n - 1) / 2) - Math.abs(b - (n - 1) / 2));
    for (const i of order) out.push({ x: 500 + (i - (n - 1) / 2) * 2 * R, y: GROUND - R - row * R * 1.74 });
  }
  return out;
})();

const armAngle = (f: number, shots: Shot[]) => {
  let s: Shot | undefined;
  for (const x of shots) if (x.wind <= f) s = x;
  if (!s) return 80 + 4 * Math.sin(f / 10);
  const u = f - s.rel;
  if (u < 0) return ease(f, s.wind, s.rel - 3, 80, 165, T.ease.inOut) + ease(f, s.rel - 3, s.rel, 0, -205, T.ease.in);
  return ease(u, 2, 16, -40, 80, T.ease.inOut);
};
const hand = (deg: number): Pt => { const a = (deg * Math.PI) / 180; return { x: SHOULDER.x + Math.cos(a) * 62 * PS, y: SHOULDER.y + Math.sin(a) * 62 * PS }; };
const REL = hand(-40);
const arc = (u: number, to: Pt, apex: number): Pt => {
  const c = 2 * apex - (REL.y + to.y) / 2;
  return { x: REL.x + (to.x - REL.x) * u, y: (1 - u) ** 2 * REL.y + 2 * (1 - u) * u * c + u * u * to.y };
};
const arcPath = (to: Pt, apex: number, upTo: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40 * upTo; i++) { const p = arc(i / 40, to, apex); pts.push(`${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`); }
  return pts.join(" ");
};

const Paper: React.FC<{ p: Pt; spin: number }> = ({ p, spin }) => (
  <g transform={`translate(${p.x},${p.y}) rotate(${spin})`}>
    <path d={`M${-R},-2 L${-R + 4},${-R + 3} L-2,${-R} L${R - 3},${-R + 4} L${R},1 L${R - 4},${R - 2} L0,${R} L${-R + 3},${R - 3} Z`} fill="#fff" stroke={T.ink} strokeWidth={2.6} strokeLinejoin="round" />
    <path d="M-6,-4 L2,1 L-1,7 M3,-7 L6,0" stroke={T.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
  </g>
);
const Target: React.FC<{ accent: string }> = ({ accent }) => (
  <g>
    <path d={`M${TARGET.x},${TARGET.y + 60} L${TARGET.x},${GROUND}`} stroke={T.ink} strokeWidth={5} strokeLinecap="round" />
    <path d={`M${TARGET.x - 30},${GROUND} L${TARGET.x + 30},${GROUND}`} stroke={T.ink} strokeWidth={5} strokeLinecap="round" />
    {[60, 42, 24, 9].map((r, i) => <circle key={r} cx={TARGET.x} cy={TARGET.y} r={r} fill={i % 2 ? "#fff" : accent} stroke={T.ink} strokeWidth={3.5} />)}
  </g>
);
const Win: React.FC<{ t: number; word: string; accent: string }> = ({ t, word, accent }) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: T.spring.pop });
  return (
    <g transform={`translate(${TARGET.x - 40},${TARGET.y - 95}) rotate(${-7 + 2 * Math.sin(t / 7)}) scale(${0.4 + 0.6 * s})`} opacity={Math.min(1, t / 4)}>
      <text textAnchor="middle" fontFamily={T.fonts.script} fontSize={64} fill={accent} stroke={T.ink} strokeWidth={1.4} paintOrder="stroke">{word}</text>
    </g>
  );
};
const Burst: React.FC<{ t: number }> = ({ t }) => {
  if (t <= 0 || t > 26) return null;
  const k = ease(t, 0, 10, 0, 1), o = ease(t, 14, 26, 1, 0);
  return (
    <g stroke={T.ink} strokeWidth={3.5} strokeLinecap="round" opacity={o}>
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; const r0 = 66 + 14 * k, r1 = 80 + 34 * k; return <line key={i} x1={TARGET.x + Math.cos(a) * r0} y1={TARGET.y + Math.sin(a) * r0} x2={TARGET.x + Math.cos(a) * r1} y2={TARGET.y + Math.sin(a) * r1} />; })}
    </g>
  );
};

const Flight: React.FC<{ f: number; s: Shot; to: Pt; apex: number; keepTrail?: boolean; stick?: boolean }> = ({ f, s, to, apex, keepTrail, stick }) => {
  if (f < s.rel) return null;
  const u = Math.min(1, (f - s.rel) / (s.land - s.rel));
  const fade = keepTrail ? 1 : f >= s.land ? ease(f, s.land, s.land + 6, 0.8, 0) : 0.8;
  return (
    <>
      {fade > 0 && <path d={arcPath(to, apex, u)} fill="none" stroke={T.ink} strokeWidth={keepTrail ? 3 : 2.4} strokeDasharray={keepTrail ? "14 12" : "10 10"} strokeLinecap="round" opacity={fade} />}
      {(f < s.land || stick) && <Paper p={arc(u, to, apex)} spin={f < s.land ? f * 20 : 30} />}
    </>
  );
};

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const d = p.pile!;
  const landed = S.shots.filter((s) => f >= s.land).length;
  const count = landed === S.shots.length ? d.count : Math.round(d.count * Math.pow(landed / S.shots.length, 1.6));
  const all = [...S.shots, S.fin];
  return (
    <>
      <StageExit at={S.endAt}>
        <Title text={p.title} />
        <div style={{ position: "absolute", top: 430, left: 60 }}>
          <Panel f={f} start={14} label="Expectation" ground={GROUND} id="e">
            <Target accent={accent} />
            <Person x={150} y={GROUND} s={PS} shirt={accent} armFront={armAngle(f, [S.exp])} armBack={115} bob={Math.sin(f / 11) * 1.2} />
            {f < S.exp.rel && <Paper p={hand(armAngle(f, [S.exp]))} spin={0} />}
            <Flight f={f} s={S.exp} to={TARGET} apex={40} keepTrail stick />
            <Hand x={330} y={150} show={ease(f, S.exp.rel + 2, S.exp.rel + 12, 0, 1)} rot={-6}>1 try</Hand>
            <Arrow from={{ x: 360, y: 162 }} to={{ x: 352, y: 214 }} draw={ease(f, S.exp.rel + 6, S.exp.rel + 16, 0, 1)} />
            <Burst t={f - S.exp.land} />
            <Win t={f - S.exp.land} word={d.winWord} accent={accent} />
          </Panel>
        </div>
        <div style={{ position: "absolute", top: 990, left: 60 }}>
          <Panel f={f} start={S.panel2} label="Reality" ground={GROUND} id="r">
            <Target accent={accent} />
            <Person x={150} y={GROUND} s={PS} shirt={accent} armFront={armAngle(f, all)} armBack={115} bob={Math.sin(f / 11) * 1.2} />
            {S.shots.map((s, i) => (f >= s.land ? <Paper key={i} p={PILE[i]} spin={i * 47} /> : null))}
            {S.shots.map((s, i) => (f >= s.rel && f < s.land + 6 ? <Flight key={i} f={f} s={s} to={PILE[i]} apex={Math.min(PILE[i].y - 30, 170 + ((i * 37) % 70))} /> : null))}
            <g opacity={ease(f, S.shots[0].land, S.shots[0].land + 12, 0, 1)}>
              <text x={470} y={150} fontFamily={T.fonts.hand} fontSize={50} fill={accent} textAnchor="end" stroke={T.ink} strokeWidth={0.8}>{fmt(count)}</text>
              <text x={482} y={150} fontFamily={T.fonts.hand} fontSize={42} fill={T.ink}>{d.unit}</text>
            </g>
            <Arrow from={{ x: 600, y: 170 }} to={{ x: 535, y: 232 }} bend={-0.2} draw={ease(f, S.shots[0].land + 6, S.shots[0].land + 18, 0, 1)} />
            <Flight f={f} s={S.fin} to={TARGET} apex={20} keepTrail stick />
            <Burst t={f - S.fin.land} />
            <Win t={f - S.fin.land} word={d.winWord} accent={accent} />
          </Panel>
        </div>
      </StageExit>
      <EndCard at={S.endAt} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={14} name="scribble" vol={0.25} />
      <Sfx at={S.exp.rel} name="whoosh" vol={0.25} />
      <Sfx at={S.exp.land} name="success" vol={0.6} />
      <Sfx at={S.panel2} name="scribble" vol={0.25} />
      {S.shots.map((s, i) => <Sfx key={i} at={s.land} name="paper" vol={0.35} />)}
      <Sfx at={S.fin.rel - 30} name="riser" vol={0.4} />
      <Sfx at={S.fin.land} name="success" vol={0.75} />
      <Sfx at={S.fin.land} name="cheer" vol={0.6} />
      <Sfx at={S.endAt - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const pile: FormatModule = { duration: () => S.endAt + 120, cover: () => S.fin.land + 20, Comp };

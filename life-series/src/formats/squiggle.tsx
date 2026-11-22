// "What people think success looks like" (a straight arrow) vs "what it really looks like" (a tangled scribble with setbacks).
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme as T } from "../lib/theme";
import { ease, EndCard, Hand, Panel, Pt, Sfx, StageExit, Title } from "../lib/ui";
import { FormatModule, Post, rng } from "../types";

const P2 = 118, DRAW0 = 136, PER = 34;
const drawEnd = (n: number) => DRAW0 + n * PER + 40;
const endAt = (p: Post) => drawEnd(p.squiggle!.setbacks.length) + 50;

const START: Pt = { x: 90, y: 360 }, GOAL: Pt = { x: 850, y: 380 };
function scribble(key: string): Pt[] {
  const r = rng(key);
  const loops = 6 + Math.floor(r() * 3), ph = r() * 6, wav = 1 + r() * 1.2, amp = 110 + r() * 30;
  const pts: Pt[] = [];
  for (let i = 0; i <= 700; i++) {
    const t = i / 700, env = Math.sin(Math.PI * t) ** 0.6;
    const rad = (45 + 40 * Math.abs(Math.sin(3.1 * Math.PI * t + ph))) * env;
    const a = Math.PI * 2 * loops * t + ph;
    pts.push({
      x: START.x + (GOAL.x - START.x) * t + Math.cos(a) * rad - rad * 0.2,
      y: START.y + Math.sin(Math.PI * 2 * wav * t + ph) * amp * env + Math.sin(a) * rad,
    });
  }
  // fit vertically into the band between the two label rows (no flat clipped edges)
  const lo = Math.min(...pts.map((p) => p.y)), hi = Math.max(...pts.map((p) => p.y));
  const k = Math.min(1, 320 / (hi - lo)), mid = (lo + hi) / 2;
  return pts.map((p) => ({ x: Math.max(30, Math.min(930, p.x)), y: 360 + (p.y - mid) * k }));
}
const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

const Flag: React.FC<{ p: Pt; accent: string; s?: number }> = ({ p, accent, s = 1 }) => (
  <g transform={`translate(${p.x},${p.y}) scale(${s})`}>
    <path d="M0,0 L0,-70" stroke={T.ink} strokeWidth={4.5} strokeLinecap="round" />
    <path d="M0,-70 L44,-58 L0,-44 Z" fill={accent} stroke={T.ink} strokeWidth={3.5} strokeLinejoin="round" />
    <circle r={7} fill={T.ink} />
  </g>
);

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const d = p.squiggle!;
  const n = d.setbacks.length;
  const pts = React.useMemo(() => scribble(p.id), [p.id]);
  const prog = ease(f, DRAW0, drawEnd(n) - 10, 0, 1, (t) => t);
  const head = pts[Math.min(pts.length - 1, Math.floor(prog * (pts.length - 1)))];
  const straight = ease(f, 40, 72, 0, 1, T.ease.inOut);
  const E = endAt(p);
  const labelAt = (k: number) => 0.07 + (0.78 * (k + 0.5)) / n;
  return (
    <>
      <StageExit at={E}>
        <Title text={p.title} />
        <div style={{ position: "absolute", top: 430, left: 60 }}>
          <Panel f={f} start={14} label="What people think it looks like" h={420} id="a">
            <circle cx={110} cy={270} r={9} fill={T.ink} />
            <Hand x={110} y={330} size={40} anchor="middle" show={ease(f, 26, 38, 0, 1)}>Start</Hand>
            <path d={`M110,270 L${110 + (740 * straight)},270`} stroke={T.ink} strokeWidth={5} strokeLinecap="round" />
            {straight > 0.98 && <path d="M836,256 L852,270 L836,284" stroke={T.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            <g opacity={ease(f, 70, 80, 0, 1)}><Flag p={{ x: 880, y: 300 }} accent={accent} s={0.9} /></g>
            <Hand x={800} y={170} size={44} anchor="middle" color={accent} show={ease(f, 72, 84, 0, 1)}>{d.goal}</Hand>
          </Panel>
        </div>
        <div style={{ position: "absolute", top: 900, left: 60 }}>
          <Panel f={f} start={P2} label="What it really looks like" h={620} id="b">
            <circle cx={pts[0].x} cy={pts[0].y} r={9} fill={T.ink} />
            <path d={toPath(pts)} fill="none" stroke={T.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} />
            {prog > 0 && prog < 1 && <circle cx={head.x} cy={head.y} r={7} fill={accent} stroke={T.ink} strokeWidth={2} />}
            {d.setbacks.map((s, k) => {
              const at = labelAt(k);
              const up = k % 2 === 0;
              const x = 160 + (k * 620) / Math.max(1, n - 1);
              const y = up ? 165 : 590;
              const show = ease(prog, at - 0.01, at + 0.05, 0, 1);
              return (
                <text key={k} x={x} y={y + (1 - show) * 12} opacity={show} fontFamily={T.fonts.hand} fontSize={40} fill={T.ink} textAnchor="middle" stroke={T.card} strokeWidth={10} paintOrder="stroke" strokeLinejoin="round" transform={`rotate(${up ? -4 : 3} ${x} ${y})`}>{s}</text>
              );
            })}
            <g opacity={ease(f, drawEnd(n) - 10, drawEnd(n), 0, 1)}><Flag p={pts[pts.length - 1]} accent={accent} /></g>
            <Hand x={850} y={pts[pts.length - 1].y - 100} size={50} anchor="middle" color={accent} halo show={ease(f, drawEnd(n) - 6, drawEnd(n) + 6, 0, 1)}>{d.goal}</Hand>
          </Panel>
        </div>
      </StageExit>
      <EndCard at={E} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={14} name="scribble" vol={0.25} />
      <Sfx at={40} name="whoosh" vol={0.3} />
      <Sfx at={72} name="ding" vol={0.5} />
      <Sfx at={P2} name="scribble" vol={0.25} />
      {Array.from({ length: Math.ceil((drawEnd(n) - DRAW0) / 33) }, (_, i) => <Sfx key={`s${i}`} at={DRAW0 + i * 33} name="scribble" vol={0.18} />)}
      {d.setbacks.map((_, k) => <Sfx key={k} at={DRAW0 + labelAt(k) * (drawEnd(n) - 10 - DRAW0)} name="pop" vol={0.45} />)}
      <Sfx at={drawEnd(n) - 8} name="success" vol={0.7} />
      <Sfx at={E - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const squiggle: FormatModule = { duration: (p) => endAt(p) + 120, cover: (p) => endAt(p) - 15, Comp };

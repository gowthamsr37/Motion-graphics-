// The bamboo: years of nothing above ground while roots grow below, then it shoots up.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "../lib/theme";
import { ease, EndCard, Sfx, StageExit, Title, Wobble } from "../lib/ui";
import { FormatModule, Post, rng } from "../types";

const GL = 520, SEED = { x: 640, y: 540 };
const Y = (k: number) => 40 + 62 * k; // years 1-4
const GROW = 300, END = 400;
type Seg = { x1: number; y1: number; x2: number; y2: number; t0: number; w: number };

function roots(key: string): Seg[] {
  const r = rng(key + "roots");
  const out: Seg[] = [];
  const grow = (x: number, y: number, ang: number, len: number, depth: number, t0: number) => {
    if (depth > 5 || len < 18) return;
    const x2 = Math.max(330, Math.min(930, x + Math.cos(ang) * len));
    const y2 = Math.max(GL + 30, Math.min(1110, y + Math.sin(ang) * len));
    out.push({ x1: x, y1: y, x2, y2, t0, w: Math.max(2, 7 - depth) });
    const kids = depth < 2 ? 3 : 2;
    for (let i = 0; i < kids; i++) grow(x2, y2, ang + (r() - 0.5) * 1.3, len * (0.68 + r() * 0.2), depth + 1, t0 + 0.13 + r() * 0.06);
  };
  for (const a of [Math.PI / 2, Math.PI / 2 - 0.7, Math.PI / 2 + 0.7]) grow(SEED.x, SEED.y, a, 120, 0, 0.02);
  return out;
}

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = p.bamboo!;
  const segs = React.useMemo(() => roots(p.id), [p.id]);
  const rootT = ease(f, Y(0), GROW, 0, 1, (t) => t); // root growth across the four years
  const year = f < Y(0) ? -1 : f < GROW ? Math.min(3, Math.floor((f - Y(0)) / 62)) : 4;
  const yStart = year < 4 ? Y(Math.max(0, year)) : GROW;
  const cap = spring({ frame: f - yStart, fps, config: T.spring.pop });
  const height = ease(f, GROW, GROW + 26, 0, 1, T.ease.out);
  const stalkTop = GL - height * 470;
  const shake = f >= GROW && f < GROW + 30 ? Math.sin(f * 2.3) * 4 * (1 - (f - GROW) / 30) : 0;
  const nodes = 7;
  return (
    <>
      <StageExit at={END}>
        <Title text={p.title} />
        <svg viewBox="0 0 960 1150" width={960} height={1150} style={{ position: "absolute", top: 420, left: 60, overflow: "visible", transform: `translateX(${shake}px)` }}>
          <defs><Wobble id="wb" /></defs>
          <g filter="url(#wb)">
            <rect x={0} y={GL} width={960} height={630} fill={T.soil} opacity={ease(f, 14, 30, 0, 1)} />
            {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 940 + 10} cy={GL + 40 + ((i * 137) % 560)} r={3} fill={T.ink} opacity={0.15 * ease(f, 14, 30, 0, 1)} />)}
            <path d={`M0,${GL} L960,${GL}`} stroke={T.ink} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 14, 32, 0, 1, T.ease.inOut)} />
            {segs.map((s, i) => {
              const k = Math.max(0, Math.min(1, (rootT - s.t0) / 0.14));
              return k <= 0 ? null : <path key={i} d={`M${s.x1},${s.y1} L${s.x1 + (s.x2 - s.x1) * k},${s.y1 + (s.y2 - s.y1) * k}`} stroke={T.ink} strokeWidth={s.w} strokeLinecap="round" opacity={0.85} />;
            })}
            <ellipse cx={SEED.x} cy={SEED.y} rx={16} ry={11} fill="#b07a3c" stroke={T.ink} strokeWidth={3.5} opacity={ease(f, 26, 34, 0, 1)} />
            {/* tiny sprout in year 4 */}
            {f >= Y(3) && f < GROW && <path d={`M${SEED.x},${GL} q4,-14 0,-${ease(f, Y(3), Y(3) + 20, 0, 22)}`} stroke="#4f9a3a" strokeWidth={5} fill="none" strokeLinecap="round" />}
            {height > 0 && (
              <g>
                <rect x={SEED.x - 16} y={stalkTop} width={32} height={GL - stalkTop} rx={10} fill="#7cbf4e" stroke={T.ink} strokeWidth={4} />
                {Array.from({ length: nodes }, (_, i) => { const y = GL - ((i + 1) * (GL - stalkTop)) / (nodes + 1); return <path key={i} d={`M${SEED.x - 18},${y} L${SEED.x + 18},${y}`} stroke={T.ink} strokeWidth={4} strokeLinecap="round" />; })}
                {[0.25, 0.45, 0.62, 0.8, 0.95].map((h, i) => {
                  const s = spring({ frame: f - GROW - 18 - i * 3, fps, config: T.spring.pop });
                  const y = GL - h * (GL - stalkTop), dir = i % 2 ? 1 : -1;
                  return <path key={i} d={`M${SEED.x},${y} q${dir * 40},-30 ${dir * 95},-10 q${-dir * 45},16 ${-dir * 95},10 Z`} fill="#8fd05e" stroke={T.ink} strokeWidth={3.5} strokeLinejoin="round" transform={`translate(${SEED.x} ${y}) scale(${s}) translate(${-SEED.x} ${-y})`} />;
                })}
              </g>
            )}
            {year >= 0 && (
              <g opacity={Math.min(1, cap * 1.4)} transform={`translate(300 ${year < 4 ? 180 : 150}) scale(${0.85 + 0.15 * cap})`}>
                <text textAnchor="middle" fontFamily={T.fonts.script} fontSize={year < 4 ? 92 : 104} fill={accent} stroke={T.ink} strokeWidth={1.2} paintOrder="stroke">Year {year + 1}</text>
                {(year < 4 ? d.years[year] : d.win).split("\n").map((ln, i) => (
                  <text key={i} y={76 + i * 56} textAnchor="middle" fontFamily={T.fonts.hand} fontSize={year < 4 ? 50 : 56} fill={T.ink}>{ln}</text>
                ))}
              </g>
            )}
          </g>
        </svg>
      </StageExit>
      <EndCard at={END} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={14} name="scribble" vol={0.25} />
      {[0, 1, 2, 3].map((k) => <Sfx key={k} at={Y(k)} name="pop" vol={0.5} />)}
      <Sfx at={GROW - 45} name="riser" vol={0.45} />
      <Sfx at={GROW} name="boom" vol={0.7} />
      <Sfx at={GROW + 4} name="success" vol={0.65} />
      <Sfx at={END - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const bamboo: FormatModule = { duration: () => END + 120, cover: () => END - 15, Comp };

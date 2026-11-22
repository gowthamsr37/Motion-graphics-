// The domino effect: one small habit knocks over a bigger one, and the last one is a new life.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "../lib/theme";
import { ease, EndCard, Sfx, StageExit, Title, Wobble } from "../lib/ui";
import { FormatModule, Post } from "../types";

const GY = 1000, START = 64, STEP = 42;
const dims = (n: number) => {
  const out: { x: number; h: number; w: number }[] = [];
  let x = 70;
  for (let i = 0; i < n; i++) { const h = 72 * 1.52 ** i; out.push({ x, h, w: h * 0.27 }); x += h * 0.74; }
  const right = out[n - 1].x + out[n - 1].w;
  const k = Math.min(1, 900 / right);
  return out.map((d) => ({ x: 30 + d.x * k, h: d.h * k, w: d.w * k }));
};
const fallStart = (i: number) => START + i * STEP;
const fallDur = (i: number) => 8 + i * 2;
const endAt = (p: Post) => fallStart(p.domino!.steps.length - 1) + fallDur(p.domino!.steps.length - 1) + 70;

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = p.domino!.steps;
  const n = steps.length;
  const D = dims(n);
  const E = endAt(p);
  const cur = Math.max(-1, Math.min(n - 1, Math.floor((f - START) / STEP)));
  const cap = spring({ frame: f - fallStart(Math.max(0, cur)), fps, config: T.spring.pop });
  const lastBoom = fallStart(n - 1) + fallDur(n - 1);
  const shake = f >= lastBoom && f < lastBoom + 20 ? Math.sin(f * 2.1) * 6 * (1 - (f - lastBoom) / 20) : 0;
  return (
    <>
      <StageExit at={E}>
        <Title text={p.title} />
        <svg viewBox="0 0 960 1100" width={960} height={1100} style={{ position: "absolute", top: 420, left: 60, overflow: "visible", transform: `translateY(${shake}px)` }}>
          <defs><Wobble id="wd" /></defs>
          <g filter="url(#wd)">
            <path d={`M10,${GY} L950,${GY}`} stroke={T.ink} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 12, 30, 0, 1, T.ease.inOut)} />
            {D.map((d, i) => {
              const nx = i < n - 1 ? D[i + 1].x : 0;
              const rest = i < n - 1 ? (Math.asin(Math.min(1, (nx - d.x - d.w) / d.h)) * 180) / Math.PI : 7; // the big one takes the hit and stands
              const ang = ease(f, fallStart(i), fallStart(i) + fallDur(i), 0, rest, T.ease.in);
              const appear = spring({ frame: f - 16 - i * 4, fps, config: T.spring.pop });
              const isLast = i === n - 1;
              return (
                <g key={i} transform={`rotate(${ang} ${d.x + d.w} ${GY})`}>
                  <g transform={`translate(${d.x + d.w / 2} ${GY}) scale(${appear}) translate(${-(d.x + d.w / 2)} ${-GY})`}>
                    <rect x={d.x} y={GY - d.h} width={d.w} height={d.h} rx={Math.max(4, d.w * 0.12)} fill={isLast ? accent : f >= fallStart(i) ? T.card : "#fff"} stroke={T.ink} strokeWidth={4} />
                    <circle cx={d.x + d.w / 2} cy={GY - d.h * 0.72} r={Math.max(3, d.w * 0.09)} fill={isLast ? "#fff" : T.ink} />
                    <path d={`M${d.x + d.w * 0.15},${GY - d.h * 0.5} L${d.x + d.w * 0.85},${GY - d.h * 0.5}`} stroke={T.ink} strokeWidth={3} />
                    <circle cx={d.x + d.w / 2} cy={GY - d.h * 0.28} r={Math.max(3, d.w * 0.09)} fill={isLast ? "#fff" : T.ink} />
                  </g>
                </g>
              );
            })}
            {/* the flick */}
            <path d={`M${D[0].x - 20},${GY - D[0].h * 0.8} l-30,-6`} stroke={T.ink} strokeWidth={4} strokeLinecap="round" opacity={ease(f, START - 12, START - 4, 0, 1) * ease(f, START, START + 6, 1, 0)} />
            {cur >= 0 && (
              <g opacity={Math.min(1, cap * 1.4)} transform={`translate(480 ${cur === n - 1 ? 200 : 180}) scale(${0.85 + 0.15 * cap})`}>
                <text y={-70} textAnchor="middle" fontFamily={T.fonts.hand} fontSize={40} fill={T.inkSoft}>{cur === n - 1 ? "which leads to" : cur === 0 ? "it starts with" : "which leads to"}</text>
                <text textAnchor="middle" fontFamily={cur === n - 1 ? T.fonts.script : T.fonts.hand} fontSize={cur === n - 1 ? 96 : 66} fill={cur === n - 1 ? accent : T.ink} stroke={T.ink} strokeWidth={cur === n - 1 ? 1.2 : 0} paintOrder="stroke">{steps[cur]}</text>
              </g>
            )}
          </g>
        </svg>
      </StageExit>
      <EndCard at={E} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      {steps.map((_, i) => <Sfx key={i} at={fallStart(i) + fallDur(i)} name={i === n - 1 ? "boom" : "tock"} vol={0.35 + i * 0.06} />)}
      {steps.map((_, i) => <Sfx key={`p${i}`} at={fallStart(i)} name="pop" vol={0.3} />)}
      <Sfx at={lastBoom - 45} name="riser" vol={0.4} />
      <Sfx at={lastBoom} name="success" vol={0.7} />
      <Sfx at={E - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const domino: FormatModule = { duration: (p) => endAt(p) + 120, cover: (p) => endAt(p) - 20, Comp };

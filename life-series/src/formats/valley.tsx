// Expectation (a straight line) vs reality (flat for ages, then the curve takes off). Most people quit in the valley.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme as T } from "../lib/theme";
import { Arrow, ease, EndCard, Hand, Person, Sfx, StageExit, Title, Wobble } from "../lib/ui";
import { FormatModule, Post } from "../types";

const X0 = 100, X1 = 880, Y0 = 760, H = 600;
const R0 = 90, R1 = 330, QUIT = 0.55, END = 400;
const real = (u: number) => 1.25 * u ** 3.2;
const pt = (u: number, v: number) => ({ x: X0 + (X1 - X0) * u, y: Y0 - H * v });
const realPath = (upTo: number) => {
  const s: string[] = [];
  for (let i = 0; i <= 100 * upTo; i++) { const u = i / 100; const q = pt(u, real(u)); s.push(`${i ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)}`); }
  return s.join(" ");
};
const CROSS = 0.903;
const valleyArea = (() => {
  const s: string[] = [`M${X0},${Y0}`];
  for (let i = 0; i <= 100; i++) { const u = (i / 100) * CROSS; const q = pt(u, real(u)); s.push(`L${q.x.toFixed(1)},${q.y.toFixed(1)}`); }
  s.push(`L${X0},${Y0} Z`);
  return s.join(" ");
})();

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const d = p.valley!;
  const prog = ease(f, R0, R1, 0, 1, (t) => t);
  const axes = ease(f, 24, 44, 0, 1, T.ease.inOut);
  const exp = ease(f, 48, 80, 0, 1, T.ease.inOut);
  const quitF = R0 + QUIT * (R1 - R0);
  const head = pt(prog, real(prog));
  const fig = pt(Math.min(prog, 1), real(Math.min(prog, 1)));
  const walking = prog > 0 && prog < 1;
  return (
    <>
      <StageExit at={END}>
        <Title text={p.title} />
        <svg viewBox="0 0 960 900" width={960} height={900} style={{ position: "absolute", top: 520, left: 60, overflow: "visible" }}>
          <defs><Wobble id="wv" scale={2.6} /></defs>
          <g filter="url(#wv)">
            <path d={valleyArea} fill={accent} opacity={ease(f, quitF + 30, quitF + 50, 0, 0.14)} />
            <path d={`M${X0},${Y0 - H - 40} L${X0},${Y0} L${X1 + 20},${Y0}`} fill="none" stroke={T.ink} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axes} />
            <Hand x={X1} y={Y0 + 50} size={40} anchor="end" show={axes}>time</Hand>
            <Hand x={X0 - 20} y={Y0 - H - 50} size={40} show={axes}>results</Hand>
            <path d={`M${X0},${Y0} L${X0 + (X1 - X0) * exp},${Y0 - H * exp}`} stroke={T.inkSoft} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
            <Hand x={600} y={Y0 - 420} size={40} color={T.inkSoft} rot={-37.6} halo show={ease(f, 72, 84, 0, 1)}>what you expect</Hand>
            {prog > 0 && <path d={realPath(prog)} fill="none" stroke={T.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
            {walking && <circle cx={head.x} cy={head.y} r={9} fill={accent} stroke={T.ink} strokeWidth={3} />}
            <Hand x={X0 + 250} y={Y0 + 50} size={40} anchor="middle" show={ease(f, R0 + 40, R0 + 52, 0, 1)}>what actually happens</Hand>
            {/* the quitter */}
            <g opacity={ease(f, quitF, quitF + 8, 0, 1) * ease(f, quitF + 60, quitF + 75, 1, 0.35)}>
              <Person x={pt(QUIT, 0).x - ease(f, quitF + 20, quitF + 70, 0, 60)} y={pt(QUIT, real(QUIT)).y - 4} s={0.42} shirt={T.inkSoft} armFront={95} armBack={85} sad walk={Math.sin(f / 3) * 0.4 * (f > quitF + 20 && f < quitF + 70 ? 1 : 0)} />
            </g>
            <Hand x={pt(QUIT, 0).x + 60} y={Y0 - 290} size={44} anchor="middle" halo show={ease(f, quitF + 4, quitF + 16, 0, 1)}>Most people quit here</Hand>
            <Hand x={pt(QUIT, 0).x + 60} y={Y0 - 245} size={38} anchor="middle" color={T.inkSoft} halo show={ease(f, quitF + 12, quitF + 24, 0, 1)}>({d.quit})</Hand>
            <Arrow from={{ x: pt(QUIT, 0).x + 40, y: Y0 - 225 }} to={{ x: pt(QUIT, 0).x + 4, y: Y0 - 120 }} bend={-0.2} draw={ease(f, quitF + 14, quitF + 26, 0, 1)} />
            <Hand x={pt(0.27, 0).x} y={Y0 - 105} size={36} anchor="middle" color={accent} show={ease(f, quitF + 40, quitF + 52, 0, 1)}>the valley of</Hand>
            <Hand x={pt(0.27, 0).x} y={Y0 - 68} size={36} anchor="middle" color={accent} show={ease(f, quitF + 44, quitF + 56, 0, 1)}>disappointment</Hand>
            {/* the payoff */}
            <Hand x={X1 - 60} y={Y0 - H - 70} size={60} anchor="end" color={accent} weight="script" show={ease(f, R1 - 4, R1 + 10, 0, 1)}>{d.win}</Hand>
            {prog >= 1 && <circle cx={fig.x} cy={fig.y} r={11} fill={accent} stroke={T.ink} strokeWidth={3} />}
          </g>
        </svg>
      </StageExit>
      <EndCard at={END} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={24} name="scribble" vol={0.25} />
      <Sfx at={48} name="whoosh" vol={0.25} />
      <Sfx at={R0} name="scribble" vol={0.2} />
      <Sfx at={quitF} name="sad" vol={0.5} />
      <Sfx at={R1 - 50} name="riser" vol={0.4} />
      <Sfx at={R1} name="success" vol={0.7} />
      <Sfx at={R1} name="cheer" vol={0.35} />
      <Sfx at={END - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const valley: FormatModule = { duration: () => END + 120, cover: () => END - 20, Comp };

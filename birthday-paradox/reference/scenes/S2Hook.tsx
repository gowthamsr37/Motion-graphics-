// SCENE 2 — HOOK: a WINNER card (+Rs 4,50,000 tonight · Goa) pops with a chip shower; then the CASINO card with a profit
// line that only climbs, month after month ("never loses: not this month, not this year"); then RIGGED? gets struck
// out and JUST MATHS lands.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip } from "../components/Casino";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const PROFIT = [2, 5, 4, 8, 11, 10, 14, 17, 16, 20, 23, 27];

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const W = s.cueS(0, "someone");
  const NEVER = s.cueS(1, "never");
  const RIG = s.cueS(2, "rigged?");
  const NO = s.cueS(2, "No.");
  const MATH = s.cueS(2, "maths.");
  const line = ease(frame, [NEVER - 4, NEVER + 50], [0, 1]);
  const pts = PROFIT.map((v, i) => [80 + i * 62, 230 - v * 7.5] as [number, number]);
  const shown = pts.slice(0, Math.max(2, Math.ceil(line * pts.length)));
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={40} color={C.dim} font="body">every night in Goa…</Txt>
      </Pop>
      <Pop x={540} y={440} at={W - 6}>
        <Panel w={820} h={250} color={C.yellow}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.18em" }}>A PLAYER, TONIGHT</Txt>
          <Txt size={86} color={C.yellow} glow>+ Rs 4,50,000</Txt>
        </Panel>
      </Pop>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = ease(frame, [W + i * 3, W + 30 + i * 3], [0, 1]);
        return t > 0 && t < 1 ? (
          <div key={i} style={{ position: "absolute", left: 200 + i * 140, top: 300 + t * 280, opacity: 1 - t, transform: `rotate(${t * 200 * (i % 2 ? 1 : -1)}deg)` }}>
            <Chip size={70} color={[C.red, C.green, C.cyan][i % 3]} label="" />
          </div>
        ) : null;
      })}
      <Pop x={540} y={850} at={s.sent(1).from - 4}>
        <Panel w={820} h={400} color={C.green} style={{ justifyContent: "flex-start", paddingTop: 26 }}>
          <Txt size={44}>
            THE CASINO: <span style={{ color: C.green }}>never loses</span>
          </Txt>
          <svg width={820} height={260} viewBox="0 0 820 260">
            <line x1={70} y1={240} x2={790} y2={240} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
            <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.green} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.green})` }} />
            {["JAN", "APR", "JUL", "OCT", "DEC"].map((m, i) => (
              <text key={m} x={80 + [0, 3, 6, 9, 11][i] * 62} y={258} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={700} fontSize={20} fill={C.dim}>{m}</text>
            ))}
          </svg>
        </Panel>
      </Pop>
      <Pop x={330} y={1180} at={RIG - 4}>
        <div style={{ position: "relative" }}>
          <Txt size={60} color={C.red}>RIGGED?</Txt>
          <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 7, background: C.text, transform: `scaleX(${ease(frame, [NO - 2, NO + 6], [0, 1])}) rotate(-6deg)`, transformOrigin: "left center", borderRadius: 4 }} />
        </div>
      </Pop>
      <Pop x={750} y={1180} at={MATH - 6}>
        <Pill color={C.cyan} size={46} solid>JUST MATHS</Pill>
      </Pop>
    </AbsoluteFill>
  );
};

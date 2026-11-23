// SCENE 6 — THE LAW. "THE LAW OF LARGE NUMBERS" title; plain-English panel (more trials → the average gets closer to
// the expected value) with a converging mini-line; INTERVIEW ANSWER panel: x̄ₙ → μ as n → ∞, "the sample mean converges
// to the population mean as the sample size grows".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { GRAD } from "./S1Title";

const C = theme.colors;

export const S6Law: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const P1 = s.sent(1).from;
  const CL = s.cueS(1, "closer");
  const P2 = s.sent(2).from;
  const conv = ease(frame, [P1, CL + 30], [0, 1]);
  const pts = Array.from({ length: 60 }, (_, i) => {
    const u = i / 59;
    const amp = 70 * Math.exp(-u * 4);
    return [40 + u * 700, 110 + Math.sin(i * 1.3) * amp] as [number, number];
  }).slice(0, Math.max(2, Math.round(conv * 60)));
  return (
    <AbsoluteFill>
      <Pop x={540} y={300} at={s.sent(0).from - 4}>
        <Txt size={46} color={C.dim} font="body" style={{ letterSpacing: "0.1em" }}>THAT&apos;S THE</Txt>
      </Pop>
      <Pop x={540} y={390} at={s.sent(0).from}>
        <Txt size={68} style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none", filter: `drop-shadow(0 0 20px ${alpha(C.violet, 0.5)})` }}>LAW OF LARGE NUMBERS</Txt>
      </Pop>
      <Pop x={540} y={690} at={P1 - 4}>
        <Panel w={960} h={400} color={C.cyan}>
          <Txt size={44}>
            more <span style={{ color: C.cyan }}>trials</span> → the <span style={{ color: C.yellow }}>average</span>
          </Txt>
          <Txt size={44}>
            gets closer to the <span style={{ color: C.green }}>expected value</span>
          </Txt>
          <svg width={780} height={220} viewBox="0 0 780 220">
            <line x1={40} y1={110} x2={740} y2={110} stroke={C.green} strokeWidth={4} strokeDasharray="12 10" />
            <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.yellow} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${C.yellow})` }} />
            <text x={740} y={90} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={700} fontSize={24} fill={C.green}>expected value</text>
          </svg>
        </Panel>
      </Pop>
      <Pop x={540} y={1060} at={P2 - 4}>
        <Pill color={C.yellow} size={28}>INTERVIEW ANSWER</Pill>
      </Pop>
      <Pop x={540} y={1210} at={P2 + 4}>
        <Panel w={960} h={220} color={C.yellow}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", borderTop: "5px solid currentColor", lineHeight: 0.8, paddingTop: 6 }}>x</span>
            <sub style={{ fontSize: 30 }}>n</sub> → μ &nbsp;as&nbsp; n → ∞
          </div>
          <Txt size={32} font="body" style={{ opacity: ease(frame, [s.cueS(2, "converges"), s.cueS(2, "converges") + 8], [0, 1]) }}>
            the sample mean converges to the population mean
          </Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 1 — HOOK. A chips packet "50 g" (the claim), 25 packets weighed → AVERAGE: 48 g → CHEATING, OR JUST CHANCE? →
// HYPOTHESIS TESTING · EXPLAINED SIMPLY.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const NULLC = C.cyan; // H0: nothing special going on
export const ALT = C.orange; // H1: something is going on
export const DATA = C.violet; // the sample data
export const LINE = C.green; // the 5% line, the decision

export const FLIPS: ("H" | "T")[] = ["H", "H", "H", "T", "H", "H", "H", "H", "H", "H"];

export const Packet: React.FC<{ w: number; label?: string; color?: string }> = ({ w, label, color = C.yellow }) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 100 125" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 ${w > 80 ? 16 : 6}px ${alpha(color, 0.5)})` }}>
    <path d="M10 10 Q50 2 90 10 L84 62 L90 115 Q50 123 10 115 L16 62 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={w > 80 ? 4 : 6} strokeLinejoin="round" />
    <path d="M10 10 L14 18 L18 10 L22 18 L26 10 L30 18 L34 10 L38 18 L42 10 L46 18 L50 10 L54 18 L58 10 L62 18 L66 10 L70 18 L74 10 L78 18 L82 10 L86 18 L90 10" fill="none" stroke={color} strokeWidth={2.5} />
    {label ? (
      <text x={50} y={72} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={26} fill="#F3F7FF">
        {label}
      </text>
    ) : null}
  </svg>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const CLAIM = s.sent(0).from;
  const WEIGH = s.cueS(0, "25");
  const AVG = s.cueS(0, "48");
  const Q = s.sent(1).from;
  const HT = s.cueS(1, "Hypothesis");
  const DEC = s.cueS(1, "decides.");
  const big = spr(CLAIM - 4, theme.spring.bouncy);
  const avg = spr(AVG - 4, theme.spring.pop);
  const title = spr(HT - 3, theme.spring.pop);
  const qOut = exitP(frame, HT - 6, 8);
  return (
    <AbsoluteFill>
      {big > 0.001 ? (
        <div style={{ position: "absolute", left: 290, top: 700, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, big), [0, 1], [0.5, 1])})`, opacity: Math.min(1, big * 2), textAlign: "center" }}>
          <Packet w={220} label="50 g" />
          <div style={{ marginTop: 14, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.yellow }}>THE CLAIM</div>
        </div>
      ) : null}
      {Array.from({ length: 25 }, (_, i) => {
        const p = spr(WEIGH - 6 + i * 1.5, theme.spring.pop);
        if (p <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 590 + (i % 5) * 76, top: 560 + Math.floor(i / 5) * 76, transform: `scale(${Math.min(1.1, p)})` }}>
            <Packet w={52} color={DATA} />
          </div>
        );
      })}
      <Pop at={WEIGH + 30} x={780} y={960} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: DATA, whiteSpace: "nowrap" }}>25 PACKETS WEIGHED</div>
      </Pop>
      {avg > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1100, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, avg), [0, 1], [1.5, 1])})`, opacity: Math.min(1, avg * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 66, color: C.text, whiteSpace: "nowrap" }}>
          AVERAGE: <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>48 g</span>
        </div>
      ) : null}
      {qOut < 1 ? (
        <Pop at={Q - 2} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
          <div style={{ opacity: 1 - qOut, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>CHEATING</span>, OR JUST <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>CHANCE</span>
            <span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
      ) : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 100, background: `linear-gradient(90deg, ${NULLC}, ${ALT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(ALT, 0.45)})`, whiteSpace: "nowrap" }}>HYPOTHESIS</div>
          <div style={{ fontSize: 100, color: C.text }}>TESTING</div>
        </div>
      ) : null}
      <Burst at={HT} x={540} y={410} color={ALT} count={22} radius={340} seed={7} />
      <Pop at={DEC - 4} x={540} y={1230} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

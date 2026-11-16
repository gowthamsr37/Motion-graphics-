// SCENE 1 — HOOK. A city's nine salaries (₹18K … ₹56K and one ₹2L): the average is ₹50K, yet 7 of 9 earn less.
// "How can most people be below average?" → "THE ANSWER IS SKEW".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Rupee } from "../components/Icons";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
export const PAY = [18, 22, 25, 28, 30, 33, 38, 56, 200]; // ₹ thousand: mean 50, median 30, 7 of 9 below the mean
const SHIRTS = ["#60A5FA", "#F472B6", "#A3E635", "#E879F9", "#FDE68A", "#5EEAD4", "#93C5FD", "#FCA5A5", O];
const BX = (i: number) => 160 + i * 95;
const BASE = 1110;
const BH = (v: number) => Math.min(v, 120) * 3.3;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const AVG = s.cueS(0, "average");
  const LESS = s.sent(1).from;
  const HOW = s.sent(2).from;
  const SKEW = s.cueS(3, "skew.");
  const END = s.duration;

  const meanLine = ease(frame, [AVG - 4, AVG + 12], [0, 1], theme.ease.inOut);
  const chartOut = exitP(frame, SKEW - 8, 12);
  const slam = spr(SKEW - 2, theme.spring.pop);
  const slamOut = exitP(frame, END - 8, 8);
  const below = PAY.filter((v) => v < 50).length;
  const counted = Math.min(below, Math.max(0, Math.floor((frame - LESS - 4) / 4) + 1));

  return (
    <AbsoluteFill>
      <Pop at={4} out={SKEW - 10} x={540} y={300} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>ONE CITY · NINE SALARIES</div>
      </Pop>
      <Pop at={HOW - 2} out={SKEW - 10} x={540} y={400} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, lineHeight: 1.08, color: C.text, whiteSpace: "nowrap" }}>
          MOST PEOPLE
          <br />
          <span style={{ color: O, textShadow: glowText(O, 0.5) }}>BELOW AVERAGE?</span>
        </div>
      </Pop>

      {chartOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - chartOut, transform: `scale(${1 - chartOut * 0.08})`, transformOrigin: "540px 1000px" }}>
          <div style={{ position: "absolute", left: 110, top: BASE + 2, width: 860, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
          {PAY.map((v, i) => {
            const p = spr(8 + i * 3, theme.spring.smooth);
            if (p <= 0.001) return null;
            const h = BH(v) * p;
            const rich = i === 8;
            const isBelow = v < 50 && i < counted;
            const col = rich ? O : isBelow ? C.cyan : "#E4EEFF";
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: BX(i) - 30, top: BASE - h, width: 60, height: h, borderRadius: "10px 10px 2px 2px", background: `linear-gradient(180deg, ${alpha(col, 0.9)}, ${alpha(col, 0.25)})`, boxShadow: isBelow ? `0 0 16px ${alpha(C.cyan, 0.5)}` : rich ? `0 0 16px ${alpha(O, 0.5)}` : "none" }} />
                {rich ? <div style={{ position: "absolute", left: BX(i) - 38, top: BASE - h + 80, width: 76, height: 14, background: C.bg, transform: "skewY(-12deg)", opacity: p }} /> : null}
                <div style={{ position: "absolute", left: BX(i), top: BASE + 28, transform: "translate(-50%, -50%)", opacity: p, display: "flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: rich ? 24 : 20, color: rich ? O : isBelow ? C.cyan : C.dim }}>
                  <Rupee size={rich ? 22 : 18} color={rich ? O : isBelow ? C.cyan : C.dim} />
                  {rich ? "2L" : `${v}K`}
                </div>
                <div style={{ position: "absolute", left: BX(i) - 26, top: BASE + 52, opacity: p }}>
                  <Avatar size={52} shirt={SHIRTS[i]} skin={C.skin[i % 4]} hair={C.hair[(i + 1) % 4]} mood={isBelow ? -0.6 : 0.6} />
                </div>
              </React.Fragment>
            );
          })}
          {meanLine > 0.01 ? <div style={{ position: "absolute", left: 110, top: BASE - BH(50) - 3, width: 860 * meanLine, borderTop: `6px dashed ${O}`, filter: `drop-shadow(0 0 6px ${alpha(O, 0.7)})` }} /> : null}
          <Pop at={AVG + 8} x={250} y={BASE - BH(50) - 40} from="down" dist={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 14, background: alpha(O, 0.16), border: `2px solid ${O}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
              AVERAGE <Rupee size={26} color={C.text} />
              50K
            </div>
          </Pop>
          {counted > 0 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${(frame - LESS - 4) % 4 === 0 && counted < below ? 1.06 : 1})`, display: "flex", alignItems: "baseline", gap: 10, padding: "10px 24px", borderRadius: 20, background: alpha(C.cyan, 0.16), border: `3px solid ${C.cyan}`, boxShadow: `0 0 24px ${alpha(C.cyan, 0.35)}`, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: C.cyan, textShadow: glowText(C.cyan, 0.6) }}>{counted}</span>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text }}>OF 9 EARN LESS</span>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* THE ANSWER IS SKEW */}
      {slam > 0.001 && slamOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", transform: "translateY(-50%)", opacity: Math.min(1, slam * 2) * (1 - slamOut), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 56, color: C.text, letterSpacing: "0.02em" }}>THE ANSWER IS</div>
          <div style={{ marginTop: 16, fontSize: 250, letterSpacing: "-0.02em", transform: `scale(${interpolate(slam, [0, 1], [1.7, 1])}) skewX(${interpolate(slam, [0, 1], [0, -14])}deg)`, background: `linear-gradient(90deg, #FFFFFF 10%, ${O})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(O, 0.55)})` }}>SKEW</div>
        </div>
      ) : null}
      <Burst at={SKEW} x={540} y={820} color={O} count={22} radius={320} seed={7} />
    </AbsoluteFill>
  );
};

// SCENE 7 — STANDARD ERROR AND t. The formula fills in (gap 3, sp² 2.5, 1/5 + 1/5); worked lines POOLED: (4×2.5 +
// 4×2.5) ÷ 8 = 2.5 · SE: √(2.5 × 0.4) = √1 = 1; then t = 3 ÷ 1 = 3 slams in.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { SE, StepTracker, TAIL, TFormula } from "../components/TKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Line: React.FC<{ y: number; at: number; label: string; c: string; children: React.ReactNode }> = ({ y, at, label, c, children }) => (
  <Pop at={at} x={540} y={y} from="left" dist={40} cfg={theme.spring.bouncy}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 28px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(c, 0.7)}`, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: c, width: 120 }}>{label}</span>
      <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, display: "flex", alignItems: "center", gap: 10 }}>{children}</span>
    </div>
  </Pop>
);

export const S7SE: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const POOL = s.cueS(0, "Pooled");
  const ERR = s.cueS(0, "Standard");
  const ONE = s.cueS(0, "1.");
  const T = s.sent(1).from;
  const tp = spr(s.cueS(1, "t", 1) - 2, theme.spring.pop);
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={2} x={540} y={520} from="scale" scaleFrom={0.8}>
        <TFormula size={66} gap="10 − 7" sp={frame >= POOL ? "2.5" : undefined} inner={frame >= ERR + 20 ? "1/5 + 1/5" : undefined} hiBot={ease(frame, [POOL, POOL + 10], [0, 1]) * (1 - ease(frame, [T - 6, T + 4], [0, 1]))} hiTop={ease(frame, [T - 6, T + 4], [0, 1])} />
      </Pop>
      <Line y={780} at={POOL - 4} label="POOLED" c={SE}>
        (4×2.5 + 4×2.5) ÷ 8 = <span style={{ color: SE }}>2.5</span>
      </Line>
      <Line y={900} at={ERR - 4} label="STD ERROR" c={SE}>
        <Radical color={C.text} size={36}>
          2.5 × (0.2 + 0.2)
        </Radical>
      </Line>
      <Line y={1020} at={ONE - 8} label="" c={SE}>
        =
        <Radical color={C.text} size={36}>
          1
        </Radical>
        = <span style={{ color: SE }}>1</span>
      </Line>
      {tp > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1180, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, tp), [0, 1], [2, 1])})`, opacity: Math.min(1, tp * 2), display: "flex", alignItems: "center", gap: 22, padding: "16px 44px", borderRadius: 30, background: alpha(TAIL, 0.2), border: `4px solid ${TAIL}`, boxShadow: `0 0 40px ${alpha(TAIL, 0.5)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.display, fontStyle: "italic" }}>t</span> = 3 ÷ 1 = <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.7) }}>3</span>
        </div>
      ) : null}
      <Burst at={s.cueS(1, "t", 1)} x={540} y={1180} color={TAIL} count={20} radius={300} seed={9} />
    </AbsoluteFill>
  );
};

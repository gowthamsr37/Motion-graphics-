// SCENE 6 — THE CALCULATION. The formula fills in as each number is spoken (198, 200, 10, 100); worked lines appear:
// TOP: 198 − 200 = −2 · √100 = 10 · SE: 10 ÷ 10 = 1 · then z = −2 slams in.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { CLAIM, Formula, MEAN, SE, StepTracker, TAIL } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Slot: React.FC<{ at: number; v: string }> = ({ at, v }) => {
  const frame = useCurrentFrame();
  const k = ease(frame, [at - 6, at + 4], [0, 1]);
  return <span style={{ display: "inline-block", transform: `translateY(${(1 - k) * -60}px) scale(${interpolate(k, [0, 1], [1.6, 1])})`, opacity: k > 0.05 ? 1 : 0 }}>{v}</span>;
};

const Line: React.FC<{ y: number; at: number; label: string; c: string; children: React.ReactNode }> = ({ y, at, label, c, children }) => (
  <Pop at={at} x={540} y={y} from="left" dist={40} cfg={theme.spring.bouncy}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "14px 30px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(c, 0.7)}`, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: c, width: 150 }}>{label}</span>
      <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, display: "flex", alignItems: "center", gap: 12 }}>{children}</span>
    </div>
  </Pop>
);

export const S6Calc: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const XB = s.cueS(0, "198,");
  const MU = s.cueS(0, "200,");
  const TOP = s.cueS(0, "-2.");
  const SIG = s.cueS(1, "10,");
  const N = s.cueS(1, "100");
  const SEW = s.cueS(1, "1.");
  const Z = s.cueS(2, "z");
  const zp = spr(Z - 2, theme.spring.pop);
  const vals = frame >= XB - 6;
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={2} x={540} y={520} from="scale" scaleFrom={0.8}>
        <Formula
          size={78}
          xb={vals ? <Slot at={XB} v="198" /> : undefined}
          mu={frame >= MU - 6 ? <Slot at={MU} v="200" /> : undefined}
          sig={frame >= SIG - 6 ? <Slot at={SIG} v="10" /> : undefined}
          n={frame >= N - 6 ? <Slot at={N} v="100" /> : undefined}
          hiTop={ease(frame, [XB, XB + 8], [0, 1]) * (1 - ease(frame, [SIG - 8, SIG], [0, 1]))}
          hiBot={ease(frame, [SIG - 8, SIG], [0, 1]) * (1 - ease(frame, [Z - 10, Z], [0, 1]))}
        />
      </Pop>
      <Line y={790} at={TOP - 4} label="TOP" c={MEAN}>
        <span style={{ color: MEAN }}>198</span> − <span style={{ color: CLAIM }}>200</span> = <span style={{ color: MEAN }}>−2</span>
      </Line>
      <Line y={905} at={s.cueS(1, "square") - 4} label="ROOT n" c={C.dim}>
        <Radical color={C.text} size={40}>
          100
        </Radical>
        = 10
      </Line>
      <Line y={1020} at={SEW - 6} label="STD ERROR" c={SE}>
        <span style={{ color: SE }}>10</span> ÷ 10 = <span style={{ color: SE }}>1</span>
      </Line>
      {zp > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1185, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, zp), [0, 1], [2, 1])})`, opacity: Math.min(1, zp * 2), display: "flex", alignItems: "center", gap: 22, padding: "16px 44px", borderRadius: 30, background: alpha(TAIL, 0.2), border: `4px solid ${TAIL}`, boxShadow: `0 0 40px ${alpha(TAIL, 0.5)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.display, fontStyle: "italic" }}>z</span> = −2 ÷ 1 = <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.7) }}>−2</span>
        </div>
      ) : null}
      <Burst at={Z} x={540} y={1185} color={TAIL} count={20} radius={300} seed={9} />
    </AbsoluteFill>
  );
};

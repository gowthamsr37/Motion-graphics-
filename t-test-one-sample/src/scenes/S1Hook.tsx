// SCENE 1 — HOOK. The juice bottle again, under its 200 ml line; σ = ? (unknown); only 9 bottles pop in; AVERAGE: 198 ml;
// WITH z: REJECTED. NOW? → THE ONE-SAMPLE t-TEST with FORMULA · CALCULATION · t TABLE chips.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Bottle, CLAIM, MEAN, SE, Sigma, TAIL } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Mini: React.FC<{ level: number }> = ({ level }) => (
  <svg width={26} height={44} viewBox="0 0 26 44" style={{ display: "block" }}>
    <rect x={4} y={10 + 30 * (1 - level)} width={18} height={30 * level + 2} rx={3} fill={alpha(TAIL, 0.85)} />
    <path d="M9 2 H17 V8 L22 12 V40 Q22 42 20 42 H6 Q4 42 4 40 V12 L9 8 Z" fill="none" stroke="rgba(230,240,255,0.8)" strokeWidth={2} />
  </svg>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const S0 = s.sent(0).from;
  const HUN = s.cueS(0, "9");
  const SIG = s.cueS(0, "sigma,");
  const AVG = s.cueS(0, "198.");
  const Q = s.sent(1).from;
  const ZT = s.cueS(1, "t-test.");
  const fill = ease(frame, [S0 + 4, S0 + 60], [0, 0.86], theme.ease.inOut);
  const out = ease(frame, [ZT - 10, ZT], [0, 1]);
  const title = spr(ZT - 4, theme.spring.pop);
  const chips = [
    { t: "FORMULA", at: ZT + 16, c: MEAN },
    { t: "CALCULATION", at: ZT + 24, c: SE },
    { t: "t TABLE", at: ZT + 32, c: TAIL },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * 40}px)` }}>
        <div style={{ position: "absolute", left: 140, top: 430 }}>
          <Bottle w={210} level={fill} mark={0.9} label="200 ml" />
        </div>
        <Pop at={SIG - 4} x={710} y={470} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 26px", borderRadius: 999, background: alpha(SE, 0.18), border: `3px solid ${SE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
            <Sigma size={44} color={SE} /> = <span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
        <Pop at={S0 + 30} x={265} y={1000} from="up" dist={10}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>THE LABEL SAYS 200 ml</div>
        </Pop>
        <div style={{ position: "absolute", left: 500, top: 560, width: 420, display: "grid", gridTemplateColumns: "repeat(9, 1fr)", rowGap: 6, transform: "scale(1.6)", transformOrigin: "left top" }}>
          {Array.from({ length: 9 }, (_, i) => {
            const p = spr(HUN - 4 + i * 3, theme.spring.pop);
            return (
              <div key={i} style={{ opacity: Math.min(1, p * 2), transform: `scale(${Math.min(1.1, p)})` }}>
                <Mini level={0.7 + ((i * 37) % 23) / 100} />
              </div>
            );
          })}
        </div>
        <Pop at={HUN + 20} x={710} y={1010} from="up" dist={10}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>ONLY 9 BOTTLES</div>
        </Pop>
        <Pop at={AVG - 4} x={540} y={1120} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
            AVERAGE: <span style={{ fontFamily: theme.fonts.mono, color: MEAN, textShadow: glowText(MEAN, 0.6) }}>198 ml</span>
          </div>
        </Pop>
        <Pop at={Q - 2} x={540} y={1250} from="up" dist={14} cfg={theme.spring.bouncy}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
            WITH z: <span style={{ color: TAIL }}>REJECTED</span>. NOW<span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
      </AbsoluteFill>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, title), [0, 1], [1.6, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
          <div style={{ fontSize: 70, color: C.text }}>THE ONE-SAMPLE</div>
          <div style={{ fontSize: 190, background: `linear-gradient(90deg, ${CLAIM}, ${MEAN})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(MEAN, 0.5)})` }}>
            <span style={{ fontStyle: "italic" }}>t</span>-TEST
          </div>
        </div>
      ) : null}
      <Burst at={ZT} x={540} y={680} color={MEAN} count={24} radius={380} seed={7} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", gap: 18 }}>
        {chips.map((c) => {
          const k = spr(c.at - 4, theme.spring.pop);
          return (
            <div key={c.t} style={{ opacity: Math.min(1, k * 2), transform: `scale(${interpolate(Math.min(1, k), [0, 1], [0.5, 1])})`, padding: "12px 26px", borderRadius: 999, background: alpha(c.c, 0.2), border: `3px solid ${c.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{c.t}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

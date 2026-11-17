// SCENE 7 — BONUS: two humps → BIMODAL: usually two groups mixed together (the humps tinted GROUP A / GROUP B).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { CURVES, Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BONUS, TEST } from "./S1Hook";

const C = theme.colors;
const W = 760;
const H = 320;
const X = 160;
const Y = 700;

export const S7Bonus: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const HUMPS = s.cueS(0, "humps?");
  const BI = s.cueS(0, "bimodal,");
  const GROUPS = s.cueS(0, "groups");
  const draw = ease(frame, [HUMPS - 10, HUMPS + 16], [0, 1], theme.ease.inOut);
  const nm = spr(BI - 3, theme.spring.pop);
  const label = (u: number, t: string, c: string, at: number) => {
    const p = spr(at, theme.spring.pop);
    if (p <= 0.01) return null;
    const y = Y + H - Math.min(1, CURVES.bimodal!(u)) * H * 0.96;
    return <div style={{ position: "absolute", left: X + u * W, top: y - 40, transform: `translate(-50%, -50%) scale(${p})`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: c, textShadow: glowText(c, 0.5), whiteSpace: "nowrap" }}>{t}</div>;
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="BONUS" color={BONUS} at={2} />
      <Pop at={6} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          SEE <span style={{ color: BONUS, textShadow: glowText(BONUS, 0.5) }}>TWO HUMPS</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: X, top: Y }}>
        <Shape kind="bimodal" w={W} h={H} color={BONUS} color2={TEST} p={draw} />
      </div>
      {label(0.27, "GROUP A", BONUS, GROUPS - 2)}
      {label(0.75, "GROUP B", TEST, GROUPS + 4)}
      {nm > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(nm, [0, 1], [1.6, 1])})`, opacity: Math.min(1, nm * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92 }}>
          <span style={{ background: `linear-gradient(90deg, ${BONUS}, ${TEST})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 22px ${alpha(BONUS, 0.5)})` }}>BIMODAL</span>
        </div>
      ) : null}
      <Burst at={BI} x={540} y={1170} color={BONUS} count={18} radius={300} seed={5} />
      <Pop at={GROUPS + 8} x={540} y={1270} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>TWO GROUPS MIXED TOGETHER</div>
      </Pop>
    </AbsoluteFill>
  );
};

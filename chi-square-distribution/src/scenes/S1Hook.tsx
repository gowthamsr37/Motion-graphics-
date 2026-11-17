// SCENE 1 — HOOK. 60 rolls: each face should come up about 10 times (dashed line). The counts grow; face 6 comes up 16
// times (orange) → UNFAIR, OR JUST LUCK? → THE CHI-SQUARE DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OBS } from "../components/Chi";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { Faces, FX } from "./Faces";

const C = theme.colors;
export const OBSC = C.cyan; // observed counts
export const EXP = C.violet; // expected counts
export const GAP = C.orange; // gaps / the tail
export const FAIR = C.green; // the fair zone

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const TEN = s.cueS(0, "10");
  const SIX = s.cueS(1, "16");
  const LUCK = s.sent(1).from;
  const CHI = s.cueS(2, "chi-square");
  const roll = ease(frame, [10, TEN + 10], [0, 1], theme.ease.inOut);
  const vals = OBS.map((v, i) => (i === 5 ? interpolate(roll, [0, 1], [0, 10]) + 6 * ease(frame, [SIX - 8, SIX + 8], [0, 1]) : v * roll));
  const title = spr(CHI - 3, theme.spring.pop);
  const hi: Record<number, string> = frame >= SIX - 6 ? { 5: GAP } : {};

  return (
    <AbsoluteFill>
      <Pop at={4} out={LUCK + 10} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label={`ROLLS: ${Math.round(roll * 60)} / 60`} color={OBSC} size={34} glow={0.4} />
      </Pop>
      <Faces g={{ base: 1130, h: 420, max: 18 }} vals={vals} growAt={[8, 8, 8, 8, 8, 8]} lineAt={TEN - 6} hi={hi} labels={roll > 0.95} />
      <Pop at={SIX + 2} x={FX(5) - 30} y={560} from="scale" scaleFrom={0.4} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: GAP, textShadow: glowText(GAP, 0.5) }}>16!</div>
      </Pop>
      <Pop at={LUCK + 14} out={CHI - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>UNFAIR</span>, OR JUST <span style={{ color: FAIR, textShadow: glowText(FAIR, 0.5) }}>LUCK</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE CHI-SQUARE</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${OBSC}, ${GAP})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(GAP, 0.45)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={CHI} x={540} y={420} color={GAP} count={22} radius={340} seed={7} />
    </AbsoluteFill>
  );
};

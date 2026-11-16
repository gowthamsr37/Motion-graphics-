// SCENE 2 — ITS NAME. The big bell from the hook: THE NORMAL DISTRIBUTION · a.k.a. THE BELL CURVE ·
// the most famous shape in statistics.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Crown } from "../components/Icons";
import { Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const BIG: BellGeo = { x0: 140, x1: 940, vmin: -3.6, vmax: 3.6, base: 1160, peakH: 380, sigmaRef: 1 };

export const S2Name: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const NORMAL = s.cueS(0, "normal");
  const BELLW = s.cueS(0, "bell");
  const FAMOUS = s.cueS(1, "famous");
  const t = spr(NORMAL - 4, theme.spring.bouncy);

  return (
    <AbsoluteFill>
      <Bell g={BIG} mu={0} sigma={1} p={1} color={C.cyan} fill={0.18} />
      <div style={{ position: "absolute", left: BIG.x0 - 10, top: BIG.base - 2, width: BIG.x1 - BIG.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      <Pop at={4} x={540} y={300} from="up" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.26em", color: C.dim, whiteSpace: "nowrap" }}>IT&apos;S CALLED</div>
      </Pop>
      {t > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(t, [0, 1], [0.6, 1])})`, opacity: Math.min(1, t * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE NORMAL</div>
          <div style={{ fontSize: 100, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(C.violet, 0.45)})` }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Pop at={BELLW - 4} x={540} y={640} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          a.k.a. <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.5) }}>the bell curve</span>
        </div>
      </Pop>
      <Pop at={FAMOUS - 6} x={540} y={1270} from="up" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={C.yellow} size={28} icon={<Crown size={34} color={C.yellow} />}>
          THE MOST FAMOUS SHAPE IN STATISTICS
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

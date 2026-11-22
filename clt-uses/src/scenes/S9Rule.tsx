// SCENE 9 — THE RULE + SAVE MOMENT. Three steps: SINGLE VALUES: MESSY (skewed icon) → AVERAGES: A BELL (bell icon) → THE
// BELL: HOW SURE TO BE (52% ± 3%); then the SAVE THIS · SEND TO A FRIEND bookmark.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CurveIcon } from "../components/Explain";
import { Bookmark } from "../components/Guide";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { skew } from "../components/Uses";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Step: React.FC<{ at: number; y: number; c: string; icon: React.ReactNode; k: string; v: string }> = ({ at, y, c, icon, k, v }) => (
  <Pop at={at} x={540} y={y} from="left" dist={60} cfg={theme.spring.bouncy}>
    <div style={{ width: 820, height: 150, boxSizing: "border-box", borderRadius: 28, padding: "0 36px", background: `linear-gradient(90deg, ${alpha(c, 0.22)}, rgba(14,24,64,0.94))`, border: `3px solid ${c}`, display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ width: 140, display: "flex", justifyContent: "center" }}>{icon}</div>
      <div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: c }}>{k}</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>{v}</div>
      </div>
    </div>
  </Pop>
);

export const S9Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const A = s.cueS(0, "single");
  const B = s.cueS(0, "averages");
  const D = s.cueS(0, "tells");
  const SAVE = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="SAME IDEA EVERY TIME" color={C.yellow} at={2} />
      <Step at={A - 6} y={480} c={C.orange} icon={<CurveIcon color={C.orange} f={(x) => skew(x * 4) * 4} w={130} h={66} />} k="SINGLE VALUES" v="CAN BE MESSY" />
      <div style={{ position: "absolute", left: 528, top: 572, transform: "rotate(90deg)", opacity: frame > B - 8 ? 1 : 0 }}>
        <Arrow size={36} color={C.dim} />
      </div>
      <Step at={B - 6} y={690} c={C.cyan} icon={<CurveIcon color={C.cyan} f={(x) => Math.exp(-((x - 0.5) ** 2) / 0.03)} w={130} h={66} />} k="AVERAGES" v="FORM A BELL" />
      <div style={{ position: "absolute", left: 528, top: 782, transform: "rotate(90deg)", opacity: frame > D - 8 ? 1 : 0 }}>
        <Arrow size={36} color={C.dim} />
      </div>
      <Step at={D - 6} y={900} c={C.green} icon={<div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 64, color: C.green, whiteSpace: "nowrap" }}>±</div>} k="THE BELL TELLS YOU" v="HOW SURE TO BE" />
      <Pop at={SAVE - 4} x={540} y={1130} from="up" dist={60} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 36px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 4 ? Math.sin((frame - SAVE) / 4) * 4 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={40} color={C.green} />
          SAVE THIS · SEND IT TO A FRIEND
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

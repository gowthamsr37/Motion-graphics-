// SCENE 11 — REMEMBER. The formula, then z = HOW FAR OFF ÷ STANDARD ERROR · LOOK UP THE Z TABLE · BEYOND ±1.96: REJECT,
// and a SAVE THIS bookmark that drops and wiggles.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RecapFlow } from "../components/Explain";
import { Bookmark } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { CLAIM, Formula, SE, TAIL } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S11Remember: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const SAVE = s.cueS(1, "Save");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="THE Z-TEST" color={CLAIM} at={2} pillAt={s.sent(0).from} />
      <Pop at={4} x={540} y={510} from="scale" scaleFrom={0.8}>
        <Formula size={60} />
      </Pop>
      <RecapFlow
        y0={700}
        gap={150}
        size={34}
        items={[
          { t: "z = HOW FAR OFF ÷ STANDARD ERROR", c: SE, at: s.cueS(0, "how") },
          { t: "LOOK UP THE AREA IN THE Z TABLE", c: CLAIM, at: s.cueS(0, "standard") + 10 },
          { t: "BEYOND ±1.96: REJECT H0", c: TAIL, at: s.cueS(0, "Beyond") },
        ]}
      />
      <Pop at={SAVE - 4} x={540} y={1200} from="up" dist={70} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 34px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, boxShadow: `0 0 30px ${alpha(C.green, 0.45)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 4 ? Math.sin((frame - SAVE) / 4) * 4 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={44} color={C.green} />
          SAVE <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>FOR YOUR INTERVIEW</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

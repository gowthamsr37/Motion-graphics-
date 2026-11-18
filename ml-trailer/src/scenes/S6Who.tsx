// SCENE 6 — WHO IT'S FOR. NO PhD NEEDED · JUST A FEW MINUTES A DAY (a clock) · chips BEGINNERS · STUDENTS ·
// INTERVIEW PREP.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ClockGlyph } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Chip } from "../components/ML";
import { Pop, useSpr } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S6Who: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s6");
  return (
    <AbsoluteFill>
      <SceneTitle label="WHO IT'S FOR" color={C.green} at={2} />
      <Pop at={s.cueS(0, "PhD") - 6} x={540} y={520} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, color: C.text, whiteSpace: "nowrap" }}>
          NO <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>PhD</span> NEEDED
        </div>
      </Pop>
      <Pop at={s.cueS(0, "few") - 6} x={540} y={680} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <ClockGlyph size={60} color={C.cyan} />
          JUST A FEW MINUTES A DAY
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Chip t="BEGINNERS" c={C.cyan} p={spr(s.cueS(1, "beginners,") - 4, theme.spring.pop)} size={42} />
        <Chip t="STUDENTS" c={C.violet} p={spr(s.cueS(1, "students,") - 4, theme.spring.pop)} size={42} />
        <Chip t="INTERVIEW PREP" c={C.orange} p={spr(s.cueS(1, "interview") - 4, theme.spring.pop)} size={42} />
      </div>
    </AbsoluteFill>
  );
};

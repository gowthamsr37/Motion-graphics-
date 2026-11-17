// SCENE 7 — THE AVERAGE WAIT: one over the chance. A violet marker rises at roll 6: with a 1-in-6 chance the average
// wait is 6 rolls.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Marker } from "../components/Curve";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { G_BASE, GeoBars, GX } from "./GeoBars";
import { AVG, YES } from "./S1Hook";

const C = theme.colors;

export const S7Average: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s7");
  const OVER = s.sent(1).from;
  const SIX = s.cueS(1, "six");
  return (
    <AbsoluteFill>
      <SceneTitle label="THE AVERAGE WAIT" color={AVG} at={2} />
      <GeoBars growAt={Array.from({ length: 12 }, (_, i) => -30 + i)} hi={{ 1: YES }} />
      <Pop at={OVER - 2} x={540} y={460} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          AVERAGE = <span style={{ color: AVG, textShadow: glowText(AVG, 0.5) }}>1 ÷ CHANCE</span>
        </div>
      </Pop>
      <Pop at={SIX - 8} x={540} y={560} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          CHANCE <span style={{ color: YES }}>1 IN 6</span>{" "}<span style={{ display: "inline-block", verticalAlign: "middle" }}><Arrow size={40} color={C.dim} /></span>{" "}<span style={{ color: AVG }}>6 ROLLS</span>
        </div>
      </Pop>
      <Marker x={GX(6)} base={G_BASE} top={720} p={spr(SIX - 4, theme.spring.bouncy)} color={AVG} label="AVERAGE: 6 ROLLS" size={32} />
    </AbsoluteFill>
  );
};

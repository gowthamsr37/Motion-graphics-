// SCENE 4 — DEGREES OF FREEDOM: the one number that sets the shape. Usually the sample size minus one: 5 values → 4.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { SAMPLE, TC } from "./S1Hook";

const C = theme.colors;

export const S4Freedom: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s4");
  const DF = s.cueS(0, "degrees");
  const SIZE = s.cueS(1, "sample");
  const FIVE = s.cueS(1, "five");
  const FOUR = s.cueS(1, "four");
  return (
    <AbsoluteFill>
      <SceneTitle label="ONE NUMBER SETS THE SHAPE" color={TC} at={2} />
      <Pop at={DF - 4} x={540} y={480} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Pill label="DEGREES OF FREEDOM (df)" color={TC} size={40} glow={0.6} />
      </Pop>
      <Pop at={SIZE - 4} x={540} y={660} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 72, color: C.text, whiteSpace: "nowrap" }}>
          df = <span style={{ color: SAMPLE }}>n</span> − 1
        </div>
      </Pop>
      <Pop at={SIZE + 6} x={540} y={740} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>n = THE SAMPLE SIZE</div>
      </Pop>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = spr(FIVE - 6 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", left: 300 + i * 120, top: 900, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.3, 1])})`, width: 70, height: 70, borderRadius: 35, background: alpha(SAMPLE, 0.3), border: `4px solid ${SAMPLE}`, boxShadow: `0 0 18px ${alpha(SAMPLE, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>{i + 1}</div>;
      })}
      <Pop at={FOUR - 6} x={540} y={1070} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          5 − 1 = <span style={{ color: TC, textShadow: glowText(TC, 0.6) }}>4</span>
        </div>
      </Pop>
      <Pop at={FOUR + 8} x={540} y={1160} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: TC, whiteSpace: "nowrap" }}>4 DEGREES OF FREEDOM</div>
      </Pop>
    </AbsoluteFill>
  );
};

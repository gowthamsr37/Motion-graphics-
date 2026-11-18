// SCENE 2 — HOW TO CHOOSE. WHAT AM I MEASURING? Three family cards: COUNTS (how many?) · MEASUREMENTS (how long, how
// much?) · TESTING TOOLS (is it real?), each listing its members.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COUNTS, MEAS, TEST } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { type Kind, Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Fam: React.FC<{ y: number; at: number; t: string; q: string; members: string; c: string; kind: Kind }> = ({ y, at, t, q, members, c, kind }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 196, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${c}` }}>
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: c, textShadow: glowText(c, 0.45) }}>{t}</div>
      <div style={{ position: "absolute", left: 40, top: 92, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: C.text }}>{q}</div>
      <div style={{ position: "absolute", left: 40, top: 142, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, letterSpacing: "0.1em", color: C.dim, whiteSpace: "nowrap" }}>{members}</div>
      <div style={{ position: "absolute", right: 40, top: 46, transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})` }}>
        <Shape kind={kind} w={170} h={80} color={c} p={Math.min(1, p)} />
      </div>
    </div>
  );
};

export const S2Choose: React.FC = () => {
  const s = useScene("s2");
  return (
    <AbsoluteFill>
      <SceneTitle label="HOW TO CHOOSE" color={MEAS} at={2} />
      <Pop at={s.cueS(0, "what") - 4} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.text, whiteSpace: "nowrap" }}>
          WHAT AM I <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>MEASURING?</span>
        </div>
      </Pop>
      <Fam y={640} at={s.cueS(1, "Counting")} t="COUNTS" q="How many?" members="BERNOULLI · BINOMIAL · GEOMETRIC · POISSON · UNIFORM" c={COUNTS} kind="poisson" />
      <Fam y={866} at={s.cueS(1, "Measuring")} t="MEASUREMENTS" q="How long? How much?" members="NORMAL · EXPONENTIAL · LOG-NORMAL · PARETO" c={MEAS} kind="lognormal" />
      <Fam y={1092} at={s.cueS(2, "testing")} t="TESTING TOOLS" q="Is the result real?" members="t-DISTRIBUTION · CHI-SQUARE" c={TEST} kind="chisq" />
    </AbsoluteFill>
  );
};

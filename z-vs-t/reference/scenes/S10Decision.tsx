// SCENE 10 — THE TWO-TAILED DECISION. t = −2 sits in the FAIL TO REJECT zone; ✗ NOT in the critical region · ✗ p = 0.08
// > 0.05 → FAIL TO REJECT H0. Then the z vs t comparison: z-TEST −2 beyond −1.96 → REJECT · t-TEST −2 inside ±2.306 → FAIL
// TO REJECT, and FATTER TAILS NEED STRONGER EVIDENCE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx, Marker } from "../components/Curve";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { BB, SE, StepTracker, TAIL, tGeo, TZone } from "../components/TKit";
import { CLAIM } from "../components/ZKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = tGeo(760, 280);

export const S10Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s10");
  const NOT = s.cueS(0, "not");
  const FAIL = s.cueS(0, "fail");
  const CMP = s.sent(1).from;
  const draw = ease(frame, [0, 18], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim }}>TWO-TAILED DECISION</div>
      <TZone g={G} p={draw} zones={draw} />
      <Marker x={gx(G, -2)} base={G.base} top={G.base - 240} p={spr(NOT - 10, theme.spring.bouncy)} color={BB} label="OUR t = −2" size={28} />
      <Pop at={NOT - 4} x={540} y={900} from="left" dist={30} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 26px", borderRadius: 20, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(C.red, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          <Mark kind="cross" at={NOT + 4} size={34} color={C.red} />
          NOT in the critical region · p = 0.08
        </div>
      </Pop>
      <Pop at={FAIL - 4} x={540} y={995} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Tag color={SE} size={34}>
          TWO-TAILED: FAIL TO REJECT H0
        </Tag>
      </Pop>
      {[
        { y: 1110, at: CMP, c: CLAIM, t: <>z-TEST: −2 beyond −1.96: <span style={{ color: TAIL }}>REJECT</span></> },
        { y: 1190, at: s.cueS(1, "t,"), c: BB, t: <>t-TEST: −2 inside ±2.306: <span style={{ color: SE }}>FAIL TO REJECT</span></> },
      ].map((r, i) => (
        <Pop key={i} at={r.at - 4} x={540} y={r.y} from="left" dist={30} cfg={theme.spring.bouncy}>
          <div style={{ padding: "10px 26px", borderRadius: 18, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(r.c, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{r.t}</div>
        </Pop>
      ))}
      <Pop at={s.cueS(1, "fatter") - 4} x={540} y={1290} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: TAIL, whiteSpace: "nowrap" }}>FATTER TAILS NEED STRONGER EVIDENCE</div>
      </Pop>
    </AbsoluteFill>
  );
};

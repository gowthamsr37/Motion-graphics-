// SCENE 10 — THE TWO-TAILED DECISION. The t(8) zone curve; t = 3 drops into the right critical region; ✓ t = 3 is in
// the critical region · ✓ p = 0.017 < alpha 0.05; BOTH METHODS AGREE; TWO-TAILED: REJECT H0.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx, Marker } from "../components/Curve";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { BB, SE, StepTracker, TAIL, tGeo, TZone } from "../components/TKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = tGeo(820, 300);

export const S10Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s10");
  const IN = s.cueS(0, "critical");
  const P = s.cueS(0, "p");
  const REJ = s.cueS(0, "reject");
  const draw = ease(frame, [0, 18], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim }}>TWO-TAILED DECISION</div>
      <TZone g={G} p={draw} zones={draw} />
      <Marker x={gx(G, 3)} base={G.base} top={G.base - 260} p={spr(IN - 10, theme.spring.bouncy)} color={BB} label="OUR t = 3" size={30} />
      {[
        { y: 980, at: IN, t: <>t = 3 is <span style={{ color: TAIL }}>in the critical region</span></> },
        { y: 1080, at: P, t: <>p = 0.017 &lt; <span style={{ color: TAIL }}>alpha 0.05</span></> },
      ].map((r, i) => (
        <Pop key={i} at={r.at - 4} x={540} y={r.y} from="left" dist={30} cfg={theme.spring.bouncy}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 28px", borderRadius: 20, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(SE, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
            <Mark kind="check" at={r.at + 4} size={40} color={SE} />
            {r.t}
          </div>
        </Pop>
      ))}
      <Pop at={s.cueS(0, "Both") - 2} x={540} y={1180} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>BOTH METHODS AGREE</div>
      </Pop>
      <Pop at={REJ - 4} x={540} y={1265} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Tag color={TAIL} size={34}>
          TWO-TAILED: REJECT H0
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

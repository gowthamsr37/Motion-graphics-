// SCENE 7 — STANDARD ERROR AND t. The formula fills in (198, 200, s = 3, n = 9); SE: 3 ÷ √9 = 3 ÷ 3 = 1; t = −2 ÷ 1 =
// −2 slams in; SAME NUMBER AS THE z-TEST!
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { CLAIM, Formula, MEAN, SE, StepTracker, TAIL } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Calc: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const SEW = s.cueS(0, "1.");
  const T2 = s.cueS(1, "-2.");
  const SAME = s.cueS(1, "same");
  const tp = spr(T2 - 2, theme.spring.pop);
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={2} x={540} y={520} from="scale" scaleFrom={0.8}>
        <Formula size={78} lhs="t" useS xb={frame >= s.sent(1).from ? "198" : undefined} mu={frame >= s.sent(1).from + 10 ? "200" : undefined} sig="3" n="9" hiBot={ease(frame, [4, 14], [0, 1]) * (1 - ease(frame, [s.sent(1).from - 6, s.sent(1).from + 4], [0, 1]))} hiTop={ease(frame, [s.sent(1).from - 6, s.sent(1).from + 4], [0, 1])} />
      </Pop>
      <Pop at={s.cueS(0, "3") - 4} x={540} y={800} from="left" dist={40} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(SE, 0.7)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.14em", color: SE }}>STD ERROR</span>
          3 ÷
          <Radical color={C.text} size={40}>
            9
          </Radical>
          = 3 ÷ 3 = <span style={{ color: SE }}>{frame >= SEW - 6 ? "1" : ""}</span>
        </div>
      </Pop>
      <Pop at={s.sent(1).from} x={540} y={920} from="left" dist={40} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(MEAN, 0.7)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.14em", color: MEAN }}>TOP</span>
          <span style={{ color: MEAN }}>198</span> − <span style={{ color: CLAIM }}>200</span> = <span style={{ color: MEAN }}>−2</span>
        </div>
      </Pop>
      {tp > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1090, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, tp), [0, 1], [2, 1])})`, opacity: Math.min(1, tp * 2), display: "flex", alignItems: "center", gap: 22, padding: "16px 44px", borderRadius: 30, background: alpha(TAIL, 0.2), border: `4px solid ${TAIL}`, boxShadow: `0 0 40px ${alpha(TAIL, 0.5)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.display, fontStyle: "italic" }}>t</span> = −2 ÷ 1 = <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.7) }}>−2</span>
        </div>
      ) : null}
      <Burst at={T2} x={540} y={1090} color={TAIL} count={20} radius={300} seed={9} />
      <Pop at={SAME - 4} x={540} y={1230} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={CLAIM} size={30}>
          THE SAME NUMBER AS THE z-TEST!
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 6 — STEP 4, EDA. A price line near a new metro station jumping +30% in a year; "real, or a data error?" →
// do: check with people who know the market before trusting a pattern.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const PTS = [8, 9, 9.5, 10, 10.2, 10.5, 11, 13.5, 14.2, 14.6, 14.9, 15.2];

export const S6EDA: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const P = s.sent(1).from;
  const draw = ease(frame, [P, P + 40], [0, 1]);
  const pts = PTS.map((v, i) => [40 + i * 62, 210 - (v - 7) * 22] as [number, number]).slice(0, Math.max(2, Math.ceil(draw * PTS.length)));
  return (
    <AbsoluteFill>
      <StepScene
        i={3}
        termAt={s.cueS(0, "exploratory")}
        headAt={s.cueS(0, "plot")}
        head={<>you plot everything, and find <span style={{ color: C.green }}>surprises</span></>}
        probAt={P - 4}
        problem={
          <>
            <svg width={780} height={240} viewBox="0 0 780 240">
              <line x1={30} y1={220} x2={760} y2={220} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
              <line x1={40 + 6.5 * 62} y1={20} x2={40 + 6.5 * 62} y2={220} stroke={C.yellow} strokeWidth={3} strokeDasharray="8 8" opacity={draw > 0.6 ? 1 : 0} />
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.green} strokeWidth={6} strokeLinejoin="round" />
              <text x={40 + 6.5 * 62 + 10} y={40} fontFamily={theme.fonts.body} fontWeight={800} fontSize={24} fill={C.yellow} opacity={draw > 0.6 ? 1 : 0}>metro opens</text>
            </svg>
            <Txt size={44}>prices jumped <span style={{ color: C.green }}>+30%</span> in a year</Txt>
            <Txt size={38} style={{ opacity: ease(frame, [s.cueS(1, "real,") - 4, s.cueS(1, "real,") + 4], [0, 1]) }}>real… or a <span style={{ color: C.red }}>data error</span>?</Txt>
          </>
        }
        fixAt={s.sent(2).from - 4}
        fixes={[
          { t: "check with people who know the market", at: s.cueS(2, "check") },
          { t: "then trust the pattern", at: s.cueS(2, "trusting") },
        ]}
      />
    </AbsoluteFill>
  );
};

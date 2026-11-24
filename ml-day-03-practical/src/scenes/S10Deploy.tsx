// SCENE 10 — STEP 8, DEPLOYMENT. LIVE badge; a prediction-error line flat for months then creeping up after "interest
// rates change" (drift); MODEL DRIFT → do: monitor it · retrain regularly.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Pill, Txt } from "../components/D2";
import { StepScene } from "../components/StepScene";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S10Deploy: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s10");
  const RATES = s.cueS(0, "interest");
  const DRIFT = s.cueS(1, "drift.");
  const d = ease(frame, [s.cueS(0, "live."), RATES + 50], [0, 1]);
  const pts = Array.from({ length: 13 }, (_, i) => [40 + i * 60, 180 - (i > 6 ? (i - 6) * 20 : 0) - Math.sin(i) * 4] as [number, number]).slice(0, Math.max(2, Math.ceil(d * 13)));
  return (
    <AbsoluteFill>
      <StepScene
        i={7}
        termAt={s.cueS(0, "deployment.")}
        headAt={s.cueS(0, "live.") - 4}
        head={<>the model goes <span style={{ color: C.green }}>live</span></>}
        probAt={RATES - 6}
        problem={
          <>
            <svg width={800} height={220} viewBox="0 0 800 220">
              <line x1={30} y1={200} x2={790} y2={200} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
              <line x1={30} y1={180} x2={790} y2={180} stroke={alpha(C.green, 0.6)} strokeWidth={2} strokeDasharray="8 8" />
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" />
              <text x={40 + 6 * 60} y={60} fontFamily={theme.fonts.body} fontWeight={800} fontSize={24} fill={C.yellow} opacity={d > 0.5 ? 1 : 0}>interest rates change</text>
              <text x={36} y={30} fontFamily={theme.fonts.body} fontWeight={700} fontSize={22} fill={C.dim}>error over 12 months</text>
            </svg>
            <Txt size={40}>predictions <span style={{ color: C.red }}>slowly go wrong</span></Txt>
            <div style={{ opacity: ease(frame, [DRIFT - 6, DRIFT + 2], [0, 1]) }}>
              <Pill color={C.red} size={40} solid>MODEL DRIFT</Pill>
            </div>
          </>
        }
        fixAt={s.cueS(1, "monitor") - 4}
        fixes={[
          { t: "monitor it", at: s.cueS(1, "monitor") },
          { t: "retrain regularly", at: s.cueS(1, "retrain") },
        ]}
      />
    </AbsoluteFill>
  );
};

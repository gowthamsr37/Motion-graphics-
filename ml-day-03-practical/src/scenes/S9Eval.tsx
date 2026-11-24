// SCENE 9 — STEP 7, MODEL EVALUATION. Overall error bar looks fine (Rs 7L ✓), but split by group: 2 BHK Rs 5L ✓ · 3 BHK
// Rs 7L ✓ · LUXURY VILLAS Rs 40L ✗ · NEW AREAS Rs 25L ✗ → do: check accuracy group by group.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = [
  { n: "OVERALL", v: 7, ok: true },
  { n: "2 BHK", v: 5, ok: true },
  { n: "3 BHK", v: 7, ok: true },
  { n: "LUXURY VILLAS", v: 40, ok: false },
  { n: "NEW AREAS", v: 25, ok: false },
];

export const S9Eval: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const BUT = s.sent(1).from;
  return (
    <AbsoluteFill>
      <StepScene
        i={6}
        termAt={s.cueS(0, "model")}
        headAt={s.cueS(0, "average") - 4}
        head={<>the average error looks <span style={{ color: C.green }}>fine</span></>}
        probAt={BUT - 4}
        problem={
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 860 }}>
            {G.map((g, i) => {
              const at = i === 0 ? BUT - 2 : i < 3 ? BUT + 4 + i * 4 : i === 3 ? s.cueS(1, "luxury") : s.cueS(1, "new");
              const p = ease(frame, [at, at + 10], [0, 1]);
              return (
                <div key={g.n} style={{ display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, p * 2) }}>
                  <div style={{ width: 250, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{g.n}</div>
                  <div style={{ width: 11 * g.v * p, height: 40, borderRadius: 8, background: g.ok ? C.green : C.red, boxShadow: `0 0 12px ${alpha(g.ok ? C.green : C.red, 0.5)}` }} />
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: g.ok ? C.green : C.red }}>Rs {g.v}L</div>
                </div>
              );
            })}
          </div>
        }
        fixAt={s.cueS(1, "So") - 4}
        fixes={[
          { t: "check accuracy group by group", at: s.cueS(1, "group") },
          { t: "not just the overall number", at: s.cueS(1, "overall") },
        ]}
      />
    </AbsoluteFill>
  );
};

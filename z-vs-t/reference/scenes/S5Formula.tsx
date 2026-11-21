// SCENE 5 — STEP 3, THE FORMULA. t = (x̄ − µ) / (s / √n) builds; the bottom glows; ONE CHANGE FROM z: s (SAMPLE SD)
// REPLACES σ, shown as the z formula with σ struck out next to the t formula.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { CLAIM, Formula, MEAN, SE, Sigma, StepTracker, TAIL, XBar } from "../components/ZKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const F = s.cueS(0, "t");
  const CH = s.sent(1).from;
  const SW = s.cueS(1, "s");
  const hiBot = ease(frame, [SW - 6, SW + 6], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={F - 4} x={540} y={560} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <Formula size={96} lhs="t" useS hiBot={hiBot} />
      </Pop>
      <Pop at={F + 20} x={540} y={790} from="up" dist={12}>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { sym: <XBar color={MEAN} />, t: "SAMPLE MEAN 198", c: MEAN },
            { sym: "µ", t: "CLAIM 200", c: CLAIM },
          ].map((k, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: alpha(k.c, 0.16), border: `2px solid ${k.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 40, color: k.c, display: "flex" }}>{k.sym}</span>
              {k.t}
            </div>
          ))}
        </div>
      </Pop>
      <Pop at={CH - 4} x={540} y={960} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "16px 34px", borderRadius: 24, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(SE, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, opacity: 0.6 }}>
            z uses <Sigma size={44} color={C.dim} />
            {frame >= SW ? <span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 6, marginTop: -3, borderRadius: 3, background: C.red }} /> : null}
          </span>
          <span style={{ color: C.dim }}>·</span>
          <span>
            t uses <span style={{ color: SE, fontStyle: "italic" }}>s</span>
          </span>
        </div>
      </Pop>
      <Pop at={SW + 6} x={540} y={1090} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={TAIL} size={30}>
          s = THE SAMPLE STANDARD DEVIATION
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

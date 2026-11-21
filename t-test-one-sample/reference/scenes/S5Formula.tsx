// SCENE 5 — STEP 3, THE FORMULA. t = (x̄B − x̄A) / √(sp² (1/nA + 1/nB)); the top glows = THE GAP BETWEEN THE AVERAGES,
// the bottom glows = STANDARD ERROR OF THE GAP, with the pooled-variance formula underneath.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { BB, SE, StepTracker, TAIL, TFormula } from "../components/TKit";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => <sub style={{ fontSize: "0.5em", verticalAlign: "-0.25em" }}>{children}</sub>;

export const S5Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const F = s.cueS(0, "t");
  const GAP = s.cueS(0, "gap");
  const ERR = s.cueS(0, "standard");
  const POOL = s.cueS(1, "pooled");
  const hiTop = ease(frame, [GAP - 6, GAP + 6], [0, 1]) * (1 - ease(frame, [ERR - 6, ERR + 4], [0, 0.7]));
  const hiBot = ease(frame, [ERR - 6, ERR + 6], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={F - 4} x={540} y={560} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <TFormula size={80} hiTop={hiTop} hiBot={hiBot} />
      </Pop>
      <Pop at={GAP} x={540} y={790} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: BB, whiteSpace: "nowrap" }}>TOP = THE GAP BETWEEN THE TWO AVERAGES</div>
      </Pop>
      <Pop at={ERR} x={540} y={860} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: SE, whiteSpace: "nowrap" }}>BOTTOM = THE STANDARD ERROR OF THAT GAP</div>
      </Pop>
      <Pop at={POOL - 4} x={540} y={1010} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "16px 30px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${SE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: SE }}>
            s<Sub>p</Sub>
            <sup style={{ fontSize: "0.5em" }}>2</sup>
          </span>
          =
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 30 }}>
            <span>
              (n<Sub>A</Sub>−1)s<Sub>A</Sub>
              <sup style={{ fontSize: "0.5em" }}>2</sup> + (n<Sub>B</Sub>−1)s<Sub>B</Sub>
              <sup style={{ fontSize: "0.5em" }}>2</sup>
            </span>
            <span style={{ width: "100%", height: 3, background: C.text, margin: "6px 0" }} />
            <span>
              n<Sub>A</Sub> + n<Sub>B</Sub> − 2
            </span>
          </div>
        </div>
      </Pop>
      <Pop at={s.cueS(1, "sizes.") - 2} x={540} y={1190} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={TAIL} size={30}>
          POOLED VARIANCE = THE TWO VARIANCES, AVERAGED
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

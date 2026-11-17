// SCENE 3 — ONE ROLL. A six = success (1) with chance 1/6 (17%); anything else = failure (0), 5/6 (83%).
// The Bernoulli shape: just two bars.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Badge } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NO, YES } from "./S1Hook";

const C = theme.colors;
const BASE = 1180;
const H = 520;
const BARS = [
  { x: 380, p: 5 / 6, c: NO, k: "0", lab: "NOT A SIX", frac: "5/6", pct: "83%" },
  { x: 700, p: 1 / 6, c: YES, k: "1", lab: "A SIX", frac: "1/6", pct: "17%" },
];

export const S3OneRoll: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const SUCC = s.cueS(0, "success,");
  const FAIL = s.cueS(1, "failure:");
  const TWO = s.sent(2).from;
  const at = [FAIL - 4, SUCC - 4];
  return (
    <AbsoluteFill>
      <SceneTitle label="ONE ROLL" color={YES} at={2} />
      <Pop at={4} x={540} y={470} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Die value={6} size={120} color={YES} glow={0.8} />
      </Pop>
      {BARS.map((b, i) => {
        const g = ease(frame, [at[i], at[i] + 18], [0, 1], theme.ease.out);
        const h = b.p * H * g;
        return (
          <React.Fragment key={b.k}>
            <div style={{ position: "absolute", left: b.x - 90, top: BASE - h, width: 180, height: Math.max(0, h), borderRadius: "16px 16px 4px 4px", background: alpha(b.c, 0.55), border: g > 0 ? `4px solid ${b.c}` : "none", boxSizing: "border-box", boxShadow: `0 0 26px ${alpha(b.c, 0.4)}` }} />
            {g > 0.2 ? (
              <>
                <div style={{ position: "absolute", left: b.x, top: BASE + 44, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: b.c, textShadow: glowText(b.c, 0.4) }}>{b.k}</div>
                <div style={{ position: "absolute", left: b.x, top: BASE + 96, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>{b.lab}</div>
              </>
            ) : null}
            <Badge x={b.x} y={BASE - h - 50} p={spr(at[i] + 12, theme.spring.pop)} color={b.c} size={34}>
              {b.frac} = {b.pct}
            </Badge>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 230, top: BASE + 1, width: 620, height: 4, background: alpha(C.text, 0.4), opacity: ease(frame, [4, 14], [0, 1]) }} />
      <Pop at={TWO - 2} x={540} y={600} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          JUST <span style={{ color: YES, textShadow: glowText(YES, 0.5) }}>TWO BARS</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

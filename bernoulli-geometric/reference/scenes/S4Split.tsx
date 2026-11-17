// SCENE 4 — THE 80/20 SPLIT. Each group's share of all sales rises as a bar (exact 80/20 Pareto shares):
// group 1 = 73%; groups 1–2 = 80%; the bottom half (groups 6–10) = 9%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Badge, Bracket } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, useSpr } from "../components/Motion";
import { DECILES } from "../data";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { BOX_TOP, COLX, GroupRow } from "./Groups";
import { FEW, MANY } from "./S1Hook";

const C = theme.colors;
const BASE = BOX_TOP - 14;
const H = 500;
const MAXS = 75;
export const ROUNDED = [73, 7, 5, 3, 3, 2, 2, 2, 2, 1]; // whole-percent labels (sum 100)

export const S4Split: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const P73 = s.cueS(0, "73%");
  const SECOND = s.sent(1).from;
  const P80 = s.cueS(1, "80%.");
  const HALF = s.sent(2).from;
  const P9 = s.cueS(2, "9%.");
  const grow = ease(frame, [6, 34], [0, 1], theme.ease.out);
  const hi: Record<number, string> = {};
  if (frame >= P73 - 6) hi[0] = FEW;
  if (frame >= SECOND + 4) hi[1] = FEW;
  if (frame >= HALF + 2) [5, 6, 7, 8, 9].forEach((k) => (hi[k] = MANY));
  const top = (k: number) => BASE - (DECILES[k] / MAXS) * H * grow;

  return (
    <AbsoluteFill>
      <SceneTitle label="SHARE OF ALL SALES" color={FEW} at={2} />
      <GroupRow appearAt={-40} boxAt={-40} hi={hi} />
      {DECILES.map((d, k) => {
        const c = hi[k] ?? alpha(C.text, 0.55);
        const t = top(k);
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: COLX(k) - 30, top: t, width: 60, height: Math.max(3, BASE - t), borderRadius: "10px 10px 3px 3px", background: hi[k] ? alpha(hi[k], 0.6) : alpha(C.text, 0.18), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: hi[k] ? `0 0 20px ${alpha(hi[k], 0.5)}` : "none" }} />
            {k > 0 && grow > 0.6 ? <div style={{ position: "absolute", left: COLX(k), top: t - 22, transform: "translate(-50%, -50%)", opacity: ease(grow, [0.6, 1], [0, 1]), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 21, color: hi[k] ?? C.dim }}>{ROUNDED[k]}%</div> : null}
          </React.Fragment>
        );
      })}
      <Badge x={COLX(0) + 96} y={top(0) + 40} p={spr(P73 - 4, theme.spring.pop)} color={FEW} size={40}>73%</Badge>
      <Bracket x0={COLX(0) - 34} x1={COLX(1) + 34} y={top(0) - 44} p={spr(P80 - 6, theme.spring.bouncy)} color={FEW} />
      {(() => {
        const p = spr(P80 - 2, theme.spring.pop);
        return p > 0.01 ? <div style={{ position: "absolute", left: COLX(1) + 60, top: top(0) - 40, transform: `translateY(-50%) scale(${0.6 + 0.4 * Math.min(1, p)})`, transformOrigin: "left center", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>TOP 20% = <span style={{ color: FEW }}>80%</span> OF SALES</div> : null;
      })()}
      <Bracket x0={COLX(5) - 34} x1={COLX(9) + 34} y={980} p={spr(P9 - 6, theme.spring.bouncy)} color={MANY} size={32} label={<span>BOTTOM HALF = <span style={{ color: MANY }}>9%</span></span>} />
    </AbsoluteFill>
  );
};

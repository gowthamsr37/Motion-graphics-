// SCENE 4 — THE TAIL RULE. One big histogram with live mode / median / mean markers (computed from the bins).
// Right skew: mode 3 < median 4 < mean 4.94 (the tail pulls the mean). It flips to left skew: mean 8.06 < median 9 < mode 10.
// Then symmetric: all three meet at 6.5.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bars, binX, type Geo, histStats, LEFT, Marker, RIGHT, SYM } from "../components/Hist";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { SHAPE } from "./S3Shapes";

const C = theme.colors;
const MEAN = kindColor.mean;
const MED = kindColor.median;
const MODE = kindColor.mode;
const G: Geo = { x0: 156, bw: 56, gap: 8, base: 1160, maxH: 360, maxC: 13 };
const TOP = 720;
const SR = histStats(RIGHT);
const SL = histStats(LEFT);
const SS = histStats(SYM);

export const S4Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const MEANW = s.cueS(0, "mean");
  const MEDW = s.cueS(1, "median,");
  const MODEW = s.cueS(1, "mode,");
  const FLIP = s.cueS(2, "flips.");
  const SYMW = s.cueS(3, "symmetric,");

  const toL = ease(frame, [FLIP - 6, FLIP + 16], [0, 1], theme.ease.inOut);
  const toS = ease(frame, [SYMW - 6, SYMW + 16], [0, 1], theme.ease.inOut);
  const counts = RIGHT.map((c, i) => interpolate(toS, [0, 1], [interpolate(toL, [0, 1], [c, LEFT[i]]), SYM[i]]));
  const pos = (k: "mean" | "median" | "mode") => interpolate(toS, [0, 1], [interpolate(toL, [0, 1], [SR[k], SL[k]]), SS[k]]);
  const grow = RIGHT.map((_, i) => spr(4 + i * 2, theme.spring.smooth));
  const phase = toS > 0.5 ? 2 : toL > 0.5 ? 1 : 0;
  const order = ["MODE < MEDIAN < MEAN", "MEAN < MEDIAN < MODE", "MEAN = MEDIAN = MODE"][phase];
  const ordCol = [SHAPE.right, SHAPE.left, SHAPE.sym][phase];
  const orderIn = spr(MODEW + 6, theme.spring.bouncy);
  const pull = ease(frame, [MEANW, MEANW + 16], [0, 1]) * (1 - toS);

  return (
    <AbsoluteFill>
      <SceneTitle label="THE TAIL RULE" pill="THE TAIL PULLS THE MEAN" color={MEAN} at={2} pillAt={MEANW - 6} />
      {orderIn > 0.01 ? (
        <div key={phase} style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%, -50%) scale(${interpolate(orderIn, [0, 1], [0.5, 1]) * (1 + Math.max(0, 1 - Math.abs(frame - (phase === 1 ? FLIP + 16 : phase === 2 ? SYMW + 16 : 0)) / 8) * 0.08)})`, opacity: Math.min(1, orderIn * 2), padding: "10px 26px", borderRadius: 20, background: alpha("#060B2A", 0.88), border: `3px solid ${ordCol}`, boxShadow: `0 0 24px ${alpha(ordCol, 0.35)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          {order}
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 130, top: G.base + 2, width: 820 * ease(frame, [2, 16], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      <Bars g={G} counts={counts} p={grow} color={C.cyan} tailColor={phase === 2 ? undefined : phase === 0 ? SHAPE.right : SHAPE.left} tail={phase === 0 ? 6 : undefined} tailLeft={phase === 1 ? 5 : undefined} dim={0.75} />
      <div style={{ position: "absolute", left: 540, top: G.base + 40, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: [SHAPE.right, SHAPE.left, C.dim][phase], whiteSpace: "nowrap" }}>
        {["RIGHT-SKEWED", "LEFT-SKEWED", "SYMMETRIC"][phase]}
      </div>

      <Marker x={binX(G, pos("mode"))} top={TOP + 80} base={G.base} label="MODE" color={MODE} p={spr(MODEW - 4, theme.spring.pop)} labelY={TOP + 56} />
      <Marker x={binX(G, pos("median"))} top={TOP + 40} base={G.base} label="MEDIAN" color={MED} p={spr(MEDW - 4, theme.spring.pop)} labelY={TOP + 10} />
      <Marker x={binX(G, pos("mean"))} top={TOP} base={G.base} label="MEAN" color={MEAN} p={spr(MEANW - 4, theme.spring.pop)} labelY={TOP - 36} />
      {pull > 0.01 ? (
        <Pop at={MEANW + 4} out={FLIP - 6} x={binX(G, pos("mean")) + 200} y={TOP - 36} from="left" dist={16}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: MEAN, textShadow: glowText(MEAN, 0.4), whiteSpace: "nowrap" }}>pulled by the tail</div>
        </Pop>
      ) : null}
    </AbsoluteFill>
  );
};

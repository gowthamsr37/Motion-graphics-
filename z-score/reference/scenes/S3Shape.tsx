// SCENE 3 — THE SHAPE. Symmetric (a mirror line folds one half onto the other), one peak in the middle,
// mean = median = mode at the centre, and the tails thinning out on both sides.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, curveY, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { BIG } from "./S2Name";

const C = theme.colors;

export const S3Shape: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const SYM = s.cueS(0, "symmetric,");
  const PEAK = s.cueS(0, "peak");
  const MEANW = s.cueS(1, "mean,");
  const TAILS = s.cueS(2, "tails");

  const mirror = ease(frame, [SYM - 4, SYM + 10], [0, 1], theme.ease.inOut);
  const fold = ease(frame, [SYM + 6, SYM + 26], [0, 1], theme.ease.inOut) * (1 - ease(frame, [SYM + 30, SYM + 46], [0, 1], theme.ease.inOut));
  const tails = ease(frame, [TAILS - 4, TAILS + 12], [0, 1]);
  const cx = vx(BIG, 0);
  const top = curveY(BIG, 0, 1, 0);
  const marks = [
    { l: "MEAN", c: kindColor.mean, at: MEANW - 4, y: top - 156 },
    { l: "MEDIAN", c: kindColor.median, at: s.cueS(1, "median") - 4, y: top - 104 },
    { l: "MODE", c: kindColor.mode, at: s.cueS(1, "mode") - 4, y: top - 52 },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE SHAPE" color={C.cyan} at={2} />
      <Bell g={BIG} mu={0} sigma={1} color={C.cyan} fill={0.16} bands={tails > 0.01 ? [
        { a: -3.6, b: -1.8, color: C.orange, opacity: 0.55 * tails },
        { a: 1.8, b: 3.6, color: C.orange, opacity: 0.55 * tails },
      ] : []} />
      {/* the left half folds over the mirror line onto the right half */}
      {fold > 0.01 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${cx}px 0px`, transform: `scaleX(${interpolate(fold, [0, 1], [1, -1])})`, opacity: 0.55, clipPath: `inset(0 ${1080 - cx}px 0 0)` }}>
          <Bell g={BIG} mu={0} sigma={1} color={C.text} fill={0.2} width={4} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: BIG.x0 - 10, top: BIG.base - 2, width: BIG.x1 - BIG.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {mirror > 0.01 ? <div style={{ position: "absolute", left: cx - 2, top: BIG.base - 470 * mirror, height: 470 * mirror, borderLeft: `4px dashed ${alpha(C.text, 0.7)}` }} /> : null}
      <Pop at={SYM - 2} x={540} y={470} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.5) }}>SYMMETRIC</span> · ONE PEAK
        </div>
      </Pop>
      {/* the peak */}
      <Pop at={PEAK - 2} out={MEANW - 6} x={cx} y={top - 44} from="down" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>PEAK</div>
      </Pop>
      {marks.map((m) => {
        const p = spr(m.at, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={m.l} style={{ position: "absolute", left: cx, top: m.y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "5px 18px", borderRadius: 14, background: alpha("#060B2A", 0.9), border: `2px solid ${m.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: m.c, whiteSpace: "nowrap" }}>{m.l}</div>
        );
      })}
      <Pop at={s.cueS(1, "centre.") - 2} x={cx + 240} y={top - 104} from="left" dist={14}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>all equal</div>
      </Pop>
      {[-1, 1].map((sd) => (
        <Pop key={sd} at={TAILS + 4} x={vx(BIG, sd * 2.7)} y={BIG.base - 80} from="down" dist={14} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.orange, textShadow: glowText(C.orange, 0.4), whiteSpace: "nowrap" }}>TAIL</div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

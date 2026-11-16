// SCENE 4 — PARAMETER vs STATISTIC. Average height: the population's TRUE MEAN (= ?, a PARAMETER, usually hidden) and the
// sample's mean (165.8 cm, a STATISTIC), with an arrow: BEST GUESS.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { discPoints, meanOf, normals } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { POP, SAMP, TRUTH } from "./S1Hook";

const C = theme.colors;
const PTS = discPoints(180, 190);
const SPTS = discPoints(20, 70);
export const SAMPLE_MEAN = meanOf(normals(40000, 50, 165, 7)); // 165.8

export const S4Param: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const TRUE = s.cueS(0, "true");
  const PARAM = s.cueS(0, "parameter.");
  const SMEAN = s.cueS(1, "sample");
  const STAT = s.cueS(1, "statistic,");
  const GUESS = s.cueS(1, "guess");
  const popIn = spr(4, theme.spring.smooth);
  const sIn = spr(SMEAN - 8, theme.spring.bouncy);
  const arrow = ease(frame, [GUESS - 6, GUESS + 8], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <Pop at={4} x={540} y={410} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>AVERAGE HEIGHT</div>
      </Pop>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={290} cy={800} r={215 * popIn} fill={alpha(POP, 0.1)} stroke={POP} strokeWidth={4} />
        {PTS.map((p, i) => (
          <circle key={i} cx={290 + p.x} cy={800 + p.y} r={6 * ease(frame, [4 + (i % 16), 12 + (i % 16)], [0, 1])} fill={alpha("#B9A8FF", 0.7)} />
        ))}
        <circle cx={820} cy={800} r={95 * sIn} fill={alpha(SAMP, 0.12)} stroke={SAMP} strokeWidth={4} />
        {SPTS.map((p, i) => (
          <circle key={i} cx={820 + p.x} cy={800 + p.y} r={7 * sIn} fill={SAMP} />
        ))}
      </svg>
      <Pop at={6} x={290} y={540} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: POP, whiteSpace: "nowrap" }}>POPULATION</div>
      </Pop>
      <Pop at={SMEAN - 6} x={820} y={650} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: SAMP, whiteSpace: "nowrap" }}>SAMPLE</div>
      </Pop>
      {/* the true mean: hidden */}
      <Pop at={TRUE - 4} x={290} y={800} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ padding: "10px 24px", borderRadius: 20, background: "#0A1440", border: `3px solid ${TRUTH}`, boxShadow: `0 0 24px ${alpha(TRUTH, 0.4)}`, textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: TRUTH }}>TRUE MEAN</div>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>?</div>
        </div>
      </Pop>
      <Pop at={PARAM - 4} x={290} y={1080} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", whiteSpace: "nowrap" }}>
          <Pill label="PARAMETER" color={TRUTH} size={34} glow={0.5} />
          <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>THE TRUTH, USUALLY HIDDEN</div>
        </div>
      </Pop>
      {/* the sample mean: what we can compute */}
      <Pop at={SMEAN + 4} x={820} y={940} from="up" dist={14} cfg={theme.spring.pop}>
        <div style={{ padding: "8px 20px", borderRadius: 18, background: "#0A1440", border: `3px solid ${SAMP}`, textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: SAMP }}>SAMPLE MEAN</div>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text }}>
            {SAMPLE_MEAN.toFixed(1)} <span style={{ fontSize: 24, color: C.dim }}>cm</span>
          </div>
        </div>
      </Pop>
      <Pop at={STAT - 4} x={820} y={1080} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", whiteSpace: "nowrap" }}>
          <Pill label="STATISTIC" color={SAMP} size={34} glow={0.5} />
          <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>COMPUTED FROM THE SAMPLE</div>
        </div>
      </Pop>
      {arrow > 0.01 ? (
        <div style={{ position: "absolute", left: 540, top: 800, transform: `translate(-50%, -50%) scale(${interpolate(arrow, [0, 1], [0.5, 1])})`, opacity: Math.min(1, arrow * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ transform: "scaleX(-1)" }}>
            <Arrow size={70} color={C.text} />
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>BEST GUESS</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

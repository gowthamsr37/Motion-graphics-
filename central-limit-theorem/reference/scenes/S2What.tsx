// SCENE 2 — POPULATION vs SAMPLE. A big violet circle of dots = the POPULATION (everyone you want to know about).
// Some dots fly into a small cyan circle = the SAMPLE (who you actually measure). Then: pot = population, spoon = sample.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { discPoints, pick, PotGlyph, SpoonGlyph } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { POP, SAMP } from "./S1Hook";

const C = theme.colors;
const N = 260;
const PTS = discPoints(N, 210);
const PICKS = pick(N, 26, 7);
const SPTS = discPoints(PICKS.length, 72);

export const S2What: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const POPW = s.cueS(0, "population");
  const SAMPW = s.cueS(1, "sample");
  const MEAS = s.cueS(1, "measure.");
  const SOUP = s.sent(2).from;
  const fly = ease(frame, [SAMPW - 2, SAMPW + 22], [0, 1], theme.ease.inOut);
  const shrink = ease(frame, [SOUP - 6, SOUP + 14], [0, 1], theme.ease.inOut);
  // circle centres: population top, sample below; on the soup line both shrink to the left column
  const pc = { x: interpolate(shrink, [0, 1], [540, 280]), y: interpolate(shrink, [0, 1], [720, 700]), s: interpolate(shrink, [0, 1], [1, 0.55]) };
  const sc = { x: interpolate(shrink, [0, 1], [540, 280]), y: interpolate(shrink, [0, 1], [1110, 1060]), s: interpolate(shrink, [0, 1], [1, 0.8]) };
  const picked = new Set(PICKS);
  const popIn = spr(POPW - 6, theme.spring.smooth);

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={pc.x} cy={pc.y} r={240 * pc.s * popIn} fill={alpha(POP, 0.1)} stroke={POP} strokeWidth={4} style={{ filter: `drop-shadow(0 0 12px ${alpha(POP, 0.5)})` }} />
        {fly > 0.01 ? <circle cx={sc.x} cy={sc.y} r={100 * sc.s * Math.min(1, fly * 1.4)} fill={alpha(SAMP, 0.12)} stroke={SAMP} strokeWidth={4} style={{ filter: `drop-shadow(0 0 12px ${alpha(SAMP, 0.6)})` }} /> : null}
        {PTS.map((p, i) => {
          const q = ease(frame, [POPW - 4 + (i % 20), POPW + 4 + (i % 20)], [0, 1]);
          if (q <= 0.001) return null;
          const k = PICKS.indexOf(i);
          if (picked.has(i)) {
            const x = interpolate(fly, [0, 1], [pc.x + p.x * pc.s, sc.x + SPTS[k].x * sc.s]);
            const y = interpolate(fly, [0, 1], [pc.y + p.y * pc.s, sc.y + SPTS[k].y * sc.s]);
            return <circle key={i} cx={x} cy={y} r={7 * q * (1 + fly * 0.2)} fill={fly > 0.05 ? SAMP : alpha("#B9A8FF", 0.85)} style={fly > 0.05 ? { filter: `drop-shadow(0 0 5px ${SAMP})` } : undefined} />;
          }
          return <circle key={i} cx={pc.x + p.x * pc.s} cy={pc.y + p.y * pc.s} r={7 * q * pc.s} fill={alpha("#B9A8FF", fly > 0.05 ? 0.45 : 0.85)} />;
        })}
      </svg>
      <Pop at={POPW - 2} out={SOUP - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", whiteSpace: "nowrap" }}>
          <Pill label="POPULATION" color={POP} size={40} glow={0.6} />
          <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.text }}>EVERYONE YOU WANT TO KNOW ABOUT</div>
        </div>
      </Pop>
      <Pop at={SAMPW - 2} out={SOUP - 6} x={760} y={1110} from="left" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "left", whiteSpace: "nowrap" }}>
          <Pill label="SAMPLE" color={SAMP} size={36} glow={0.6} />
        </div>
      </Pop>
      <Pop at={MEAS - 6} out={SOUP - 6} x={540} y={1270} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: SAMP, whiteSpace: "nowrap" }}>WHO YOU ACTUALLY MEASURE</div>
      </Pop>
      {/* the soup: pot = population, spoon = sample */}
      <Pop at={SOUP + 2} x={760} y={700} from="right" dist={30} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center" }}>
          <PotGlyph size={230} color={POP} steam={frame / 6} />
          <div style={{ marginTop: 6, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: POP, whiteSpace: "nowrap" }}>POT = POPULATION</div>
        </div>
      </Pop>
      <Pop at={SOUP + 12} x={760} y={1060} from="right" dist={30} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center" }}>
          <SpoonGlyph size={170} color={SAMP} />
          <div style={{ marginTop: 6, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: SAMP, whiteSpace: "nowrap" }}>SPOON = SAMPLE</div>
        </div>
      </Pop>
      <Pop at={SOUP + 2} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          ONE SPOONFUL <span style={{ color: C.dim }}>judges</span> <span style={{ color: POP, textShadow: glowText(POP, 0.4) }}>THE POT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

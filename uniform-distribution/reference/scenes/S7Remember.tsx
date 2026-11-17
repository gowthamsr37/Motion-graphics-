// SCENE 7 — REMEMBER. The definition once more as a flow: MANY SAMPLES → ONE AVERAGE EACH → A BELL CURVE, whatever the
// original shape. Then why it matters: a survey of a few thousand people can describe a whole country.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { discPoints, pick } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, MiniShape, RAW, SAMP } from "./S1Hook";

const C = theme.colors;
const FLOW_Y = [560, 730, 900];
const CROWD = discPoints(120, 95);
const PICKED = new Set(pick(120, 12, 3));

export const S7Remember: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const at = [s.cueS(1, "Many"), s.cueS(1, "one"), s.cueS(1, "bell")];
  const WHATEVER = s.cueS(1, "whatever");
  const SURVEY = s.sent(2).from;
  const THOUSAND = s.cueS(2, "thousand");
  const COUNTRY = s.cueS(2, "country.");
  const flows = [
    { t: "MANY SAMPLES", c: SAMP },
    { t: "ONE AVERAGE EACH", c: SAMP },
    { t: "A BELL CURVE", c: AVG },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="THE CENTRAL LIMIT THEOREM" color={AVG} at={2} pillAt={s.sent(0).from} />
      {flows.map((f, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(at[i] - 6, theme.spring.bouncy);
        const y = FLOW_Y[i];
        const g: BellGeo = { x0: 790, x1: 930, vmin: -3, vmax: 3, base: y + 34, peakH: 70, sigmaRef: 1 };
        return (
          <React.Fragment key={f.t}>
            <div style={{ position: "absolute", left: 160, top: y - 58, width: 760, height: 116, boxSizing: "border-box", borderRadius: 26, background: p > 0.01 ? `linear-gradient(90deg, ${alpha(f.c, 0.2)}, rgba(14,24,64,0.9) 60%)` : "transparent", border: p > 0.01 ? `3px solid ${f.c}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `scale(${p > 0.01 ? interpolate(p, [0, 1], [0.85, 1]) : 1})` }} />
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 200, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: i === 2 ? AVG : C.text, textShadow: i === 2 ? glowText(AVG, 0.6) : undefined, whiteSpace: "nowrap" }}>{f.t}</div>
            ) : null}
            {p > 0.01 && i === 0
              ? [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 760 + k * 52, top: y - 22, width: 44, height: 44, borderRadius: 22, border: `3px solid ${SAMP}`, background: alpha(SAMP, 0.2), opacity: Math.min(1, p * 2) }} />)
              : null}
            {p > 0.01 && i === 1 ? <div style={{ position: "absolute", left: 815, top: y, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: AVG, opacity: Math.min(1, p * 2), whiteSpace: "nowrap" }}>46 · 36 · 40</div> : null}
            {p > 0.01 && i === 2 ? <Bell g={g} mu={0} sigma={1} p={ease(frame, [at[2], at[2] + 16], [0, 1], theme.ease.inOut)} color={AVG} fill={0.3} width={4} /> : null}
            {i < 2 && p > 0.3 ? (
              <div style={{ position: "absolute", left: 540, top: y + 85, transform: "translate(-50%, -50%) rotate(90deg)", opacity: spr(at[i + 1] - 10, theme.spring.pop) }}>
                <Arrow size={34} color={C.dim} />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* whatever the original shape */}
      {frame >= WHATEVER - 6 ? (
        <>
          {[0, 1, 2].map((k) => (
            <MiniShape key={k} kind={k} x={250 + k * 135} y={1020} w={110} h={60} color={RAW} p={ease(frame, [WHATEVER - 4 + k * 4, WHATEVER + 8 + k * 4], [0, 1])} />
          ))}
          <div style={{ position: "absolute", left: 790, top: 1022, transform: "translate(-50%, -50%)", opacity: ease(frame, [WHATEVER + 6, WHATEVER + 14], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: RAW, whiteSpace: "nowrap" }}>ANY ORIGINAL SHAPE</div>
        </>
      ) : null}
      {/* a few thousand can describe a country */}
      {frame >= SURVEY - 6 ? (
        <>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
            {CROWD.map((p, i) => (
              <circle key={i} cx={260 + p.x} cy={1230 + p.y} r={PICKED.has(i) && frame >= THOUSAND - 4 ? 6 : 4.5} fill={PICKED.has(i) && frame >= THOUSAND - 4 ? SAMP : alpha("#B9A8FF", 0.6)} opacity={ease(frame, [SURVEY - 4 + (i % 12), SURVEY + 4 + (i % 12)], [0, 1])} />
            ))}
          </svg>
          <Pop at={THOUSAND - 2} x={540} y={1230} from="left" dist={14}>
            <Arrow size={56} color={C.text} />
          </Pop>
          <Pop at={COUNTRY - 6} x={790} y={1230} from="left" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: C.text, whiteSpace: "nowrap", lineHeight: 1.15 }}>
              <div style={{ fontSize: 30 }}>A FEW THOUSAND</div>
              <div style={{ fontSize: 30, color: AVG, textShadow: glowText(AVG, 0.5) }}>DESCRIBE A COUNTRY</div>
            </div>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

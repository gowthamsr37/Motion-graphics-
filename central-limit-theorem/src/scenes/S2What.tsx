// SCENE 2 — WHAT IT SAYS. Three steps: many samples → the mean of each → plot the means → a normal bell.
// Then: ANY SHAPE IN (flat, skewed, two humps) → BELL OUT.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Arrow } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, RAW, SKEW } from "./S1Hook";

const C = theme.colors;
const STEP_Y = [560, 760, 960];
const MEAN_VALS = ["3.4", "3.7", "3.2"];

const MiniShape: React.FC<{ kind: number; x: number; y: number; color: string; p: number }> = ({ kind, x, y, color, p }) => {
  const W = 150;
  const H = 90;
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const v = kind === 0 ? (u > 0.06 && u < 0.94 ? 0.7 : 0) : kind === 1 ? Math.min(1, u * 9) * Math.exp(-u * 4.5) * 1.6 : 0.9 * (Math.exp(-((u - 0.27) ** 2) / 0.01) + Math.exp(-((u - 0.73) ** 2) / 0.01));
    pts.push(`${i ? "L" : "M"}${(u * W).toFixed(1)} ${(H - Math.min(1, v) * H * p).toFixed(1)}`);
  }
  const d = pts.join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: x - W / 2, top: y - H / 2, overflow: "visible" }}>
      <path d={`${d} L${W} ${H} L0 ${H} Z`} fill={alpha(color, 0.3)} />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <line x1={-4} y1={H + 1} x2={W + 4} y2={H + 1} stroke={alpha("#F3F7FF", 0.4)} strokeWidth={3} />
    </svg>
  );
};

export const S2What: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const SAMPW = s.cueS(0, "samples,");
  const MEANW = s.cueS(0, "mean");
  const PLOT = s.sent(1).from;
  const NORMAL = s.cueS(1, "normal");
  const EVEN = s.sent(2).from;
  const at = [SAMPW, MEANW, PLOT];
  const steps = ["MANY SAMPLES", "THE MEAN OF EACH", "PLOT THE MEANS"];
  const g: BellGeo = { x0: 700, x1: 940, vmin: -3, vmax: 3, base: STEP_Y[2] + 55, peakH: 110, sigmaRef: 1 };

  return (
    <AbsoluteFill>
      <Pop at={4} x={540} y={410} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>WHAT IT SAYS</div>
      </Pop>
      {steps.map((t, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(at[i] - 6, theme.spring.bouncy);
        const y = STEP_Y[i];
        return (
          <React.Fragment key={t}>
            <div style={{ position: "absolute", left: 90, top: y - 80, width: 900, height: 160, boxSizing: "border-box", borderRadius: 28, background: p > 0.01 ? `linear-gradient(90deg, ${alpha(i === 2 ? MEANS : RAW, 0.16)}, rgba(14,24,64,0.9) 55%)` : "transparent", border: p > 0.01 ? `3px solid ${alpha(i === 2 ? MEANS : RAW, 0.7)}` : `3px dashed ${alpha("#F3F7FF", 0.22)}`, opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `translateX(${(1 - p) * -40}px)` }} />
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 130, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: i === 2 ? MEANS : RAW, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.ink }}>{i + 1}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* step visuals */}
      {[0, 1, 2].map((k) => {
        const p = spr(SAMPW + k * 5, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={k} style={{ position: "absolute", left: 720 + k * 90, top: STEP_Y[0], transform: `translate(-50%, -50%) scale(${p})`, width: 72, height: 72, borderRadius: 36, border: `3px solid ${RAW}`, background: alpha(RAW, 0.15), display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: 4, padding: 10, boxSizing: "border-box" }}>
            {Array.from({ length: 6 }, (_, j) => (
              <div key={j} style={{ width: 9, height: 9, borderRadius: 5, background: RAW }} />
            ))}
          </div>
        );
      })}
      {MEAN_VALS.map((v, k) => (
        <Pop key={v} at={MEANW + 2 + k * 5} x={720 + k * 90} y={STEP_Y[1]} from="up" dist={10} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: MEANS, whiteSpace: "nowrap" }}>{v}</div>
        </Pop>
      ))}
      {spr(PLOT - 6, theme.spring.bouncy) > 0.3 ? (
        <>
          <div style={{ position: "absolute", left: g.x0 - 6, top: g.base - 2, width: g.x1 - g.x0 + 12, height: 3, background: alpha(C.text, 0.35) }} />
          <Bell g={g} mu={0} sigma={1} p={ease(frame, [PLOT, PLOT + 20], [0, 1], theme.ease.inOut)} color={MEANS} fill={0.3} width={4} />
        </>
      ) : null}
      <Pop at={NORMAL - 2} x={540} y={1090} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          = a <span style={{ color: MEANS, textShadow: glowText(MEANS, 0.5) }}>NORMAL</span> distribution
        </div>
      </Pop>
      {/* any shape in → bell out */}
      {frame >= EVEN - 6
        ? [0, 1, 2].map((k) => <MiniShape key={k} kind={k} x={170 + k * 175} y={1240} color={[RAW, SKEW, C.violet][k]} p={ease(frame, [EVEN - 4 + k * 5, EVEN + 10 + k * 5], [0, 1])} />)
        : null}
      {frame >= EVEN + 10 ? (
        <div style={{ position: "absolute", left: 700, top: 1240, transform: `translate(-50%, -50%) scale(${interpolate(spr(EVEN + 10, theme.spring.pop), [0, 1], [0.5, 1])})` }}>
          <Arrow size={56} color={C.text} />
        </div>
      ) : null}
      {frame >= EVEN + 14 ? <Bell g={{ x0: 760, x1: 940, vmin: -3, vmax: 3, base: 1285, peakH: 90, sigmaRef: 1 }} mu={0} sigma={1} p={ease(frame, [EVEN + 14, EVEN + 30], [0, 1], theme.ease.inOut)} color={MEANS} fill={0.3} width={4} /> : null}
      <Pop at={EVEN + 4} x={540} y={1150} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>ANY SHAPE IN · A BELL OUT</div>
      </Pop>
    </AbsoluteFill>
  );
};

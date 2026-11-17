// SCENE 1 — HOOK. A bell curve, and the places it turns up (heights, exam scores, measurement errors, poll results).
// Even when the data isn't a bell (skewed, flat, two humps)? → THE CENTRAL LIMIT THEOREM.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const RAW = C.orange; // the original (skewed) data
export const SAMP = C.cyan; // samples
export const AVG = C.green; // averages / the CLT bell
export const PREC = C.violet; // precision / narrower

export const MiniShape: React.FC<{ kind: number; x: number; y: number; w?: number; h?: number; color: string; p?: number }> = ({ kind, x, y, w = 150, h = 90, color, p = 1 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const v = kind === 0 ? Math.min(1, u * 9) * Math.exp(-u * 4.5) * 1.6 : kind === 1 ? (u > 0.06 && u < 0.94 ? 0.7 : 0) : kind === 2 ? 0.9 * (Math.exp(-((u - 0.27) ** 2) / 0.01) + Math.exp(-((u - 0.73) ** 2) / 0.01)) : Math.exp(-((u - 0.5) ** 2) / 0.02);
    pts.push(`${i ? "L" : "M"}${(u * w).toFixed(1)} ${(h - Math.min(1, v) * h * p).toFixed(1)}`);
  }
  const d = pts.join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible" }}>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={alpha(color, 0.3)} />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <line x1={-4} y1={h + 1} x2={w + 4} y2={h + 1} stroke={alpha("#F3F7FF", 0.4)} strokeWidth={3} />
    </svg>
  );
};

const PLACES = [
  { t: "HEIGHTS", x: 290, y: 1060 },
  { t: "EXAM SCORES", x: 790, y: 1060 },
  { t: "MEASUREMENT ERRORS", x: 290, y: 1230 },
  { t: "POLL RESULTS", x: 790, y: 1230 },
];
const G: BellGeo = { x0: 200, x1: 880, vmin: -3.4, vmax: 3.4, base: 900, peakH: 300, sigmaRef: 1 };

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const EVEN = s.sent(1).from;
  const ANS = s.sent(2).from;
  const CLT = s.cueS(2, "Central");
  const placesOut = exitP(frame, EVEN - 6, 10);
  const oddOut = exitP(frame, ANS + 20, 10);
  const title = spr(CLT - 3, theme.spring.pop);

  return (
    <AbsoluteFill>
      <Pop at={4} out={EVEN - 6} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          WHY IS THE <span style={{ color: AVG, textShadow: glowText(AVG, 0.5) }}>BELL CURVE</span>
          <br />
          EVERYWHERE<span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      <Pop at={EVEN - 2} out={CLT - 6} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          EVEN WHEN THE DATA
          <br />
          <span style={{ color: RAW, textShadow: glowText(RAW, 0.5) }}>ISN&apos;T A BELL</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      <Bell g={G} mu={0} sigma={1} p={ease(frame, [6, 30], [0, 1], theme.ease.inOut)} color={AVG} fill={0.2} width={6} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base - 2, width: G.x1 - G.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.4), opacity: ease(frame, [6, 16], [0, 1]) }} />
      {placesOut < 1
        ? PLACES.map((pl, i) => {
            const p = spr(18 + i * 10, theme.spring.bouncy);
            if (p <= 0.001) return null;
            return (
              <div key={pl.t} style={{ position: "absolute", left: pl.x, top: pl.y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1]) * (1 - placesOut * 0.2)})`, opacity: Math.min(1, p * 2) * (1 - placesOut), width: 440, height: 140, boxSizing: "border-box", borderRadius: 24, background: `linear-gradient(90deg, ${alpha(AVG, 0.16)}, rgba(14,24,64,0.9))`, border: `2px solid ${alpha(AVG, 0.6)}`, display: "flex", alignItems: "center", gap: 18, padding: "0 22px" }}>
                <svg width={90} height={60} viewBox="0 0 90 60" style={{ flexShrink: 0 }}>
                  <path d={`M0 58 ${Array.from({ length: 31 }, (_, k) => `L${k * 3} ${58 - 52 * Math.exp(-(((k - 15) / 5) ** 2) / 2)}`).join(" ")}`} fill="none" stroke={AVG} strokeWidth={4} />
                </svg>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: pl.t.length > 14 ? 24 : 30, color: C.text, whiteSpace: "nowrap" }}>{pl.t}</div>
              </div>
            );
          })
        : null}
      {/* data that isn't a bell */}
      {frame >= EVEN - 4 && oddOut < 1
        ? [0, 1, 2].map((k) => {
            const p = spr(EVEN + 4 + k * 8, theme.spring.bouncy);
            return (
              <div key={k} style={{ opacity: Math.min(1, p * 2) * (1 - oddOut), transform: `translateY(${(1 - p) * 30}px)` }}>
                <MiniShape kind={k} x={220 + k * 320} y={1140} w={220} h={130} color={RAW} p={p} />
                <div style={{ position: "absolute", left: 220 + k * 320 + 90, top: 1040, width: 44, height: 44, borderRadius: 22, background: C.yellow, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, transform: `scale(${p})` }}>?</div>
              </div>
            );
          })
        : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 80, color: C.text }}>THE CENTRAL</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${AVG}, ${SAMP})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(AVG, 0.5)})`, whiteSpace: "nowrap" }}>LIMIT THEOREM</div>
        </div>
      ) : null}
      <Burst at={CLT} x={540} y={440} color={AVG} count={22} radius={340} seed={7} />
      <Pop at={CLT + 14} x={540} y={1120} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

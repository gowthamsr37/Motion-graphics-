// SCENE 1 — HOOK. 1908 · GUINNESS BREWERY: only a few batches (4 barrels) → the normal curve made him TOO CONFIDENT
// → THE t-DISTRIBUTION (a bell with fatter tails traces over the normal).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FnCurve, type Geo } from "../components/Curve";
import { Burst, ease, Mark, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { npdf, tpdf } from "../components/TDist";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const TC = C.violet; // the t-curve
export const NC = C.cyan; // the normal curve
export const TAIL = C.orange; // the tails
export const SAMPLE = C.green; // sample values

export const Barrel: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 1.2} viewBox="0 0 100 120" style={{ display: "block", overflow: "visible" }}>
    <path d="M18 8 Q8 60 18 112 L82 112 Q92 60 82 8 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M12 36 H88 M10 84 H90" stroke={color} strokeWidth={5} />
  </svg>
);

const G: Geo = { x0: 170, x1: 910, vmin: -4, vmax: 4, base: 1220, h: 300 };

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FEW = s.cueS(0, "few");
  const NORMAL = s.sent(1).from;
  const CONF = s.cueS(1, "confident.");
  const T = s.cueS(2, "t-distribution.");
  const title = spr(T - 3, theme.spring.pop);
  const nDraw = ease(frame, [NORMAL, NORMAL + 24], [0, 1], theme.ease.inOut);
  const tDraw = ease(frame, [T - 6, T + 20], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <Pop at={4} out={T - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label="1908 · GUINNESS BREWERY" color={C.orange} size={34} glow={0.4} />
      </Pop>
      {[0, 1, 2, 3].map((i) => {
        const p = spr(10 + i * 5, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 300 + i * 160, top: 700, transform: `translate(-50%, -50%) scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Barrel w={90} color={SAMPLE} />
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, color: C.dim }}>BATCH {i + 1}</div>
          </div>
        );
      })}
      <Pop at={FEW + 12} x={540} y={850} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          ONLY A <span style={{ color: SAMPLE, textShadow: glowText(SAMPLE, 0.5) }}>FEW SAMPLES</span>
        </div>
      </Pop>
      <FnCurve g={G} f={npdf} fmax={0.4} p={nDraw} color={NC} fill={0.12} dashed={tDraw > 0.2} opacity={1 - 0.4 * tDraw} />
      <FnCurve g={G} f={(x) => tpdf(x, 2)} fmax={0.4} p={tDraw} color={TC} fill={0.16} width={7} />
      <Pop at={CONF - 4} out={T - 4} x={540} y={960} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 26px 10px 16px", borderRadius: 999, background: "rgba(10,20,64,0.9)", border: `3px solid ${alpha(C.red, 0.8)}` }}>
          <Mark kind="cross" at={CONF} size={32} color={C.red} width={8} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>NORMAL CURVE: TOO CONFIDENT</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${NC}, ${TC})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(TC, 0.5)})`, whiteSpace: "nowrap" }}>t-DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={T} x={540} y={420} color={TC} count={22} radius={340} seed={7} />
    </AbsoluteFill>
  );
};

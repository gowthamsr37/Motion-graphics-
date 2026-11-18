// SCENE 1 — HOOK. Ten flips land one by one: 9 heads, 1 tail → RIGGED, OR JUST LUCK? → HYPOTHESIS TESTING.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, Pop, useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const NULLC = C.cyan; // the null hypothesis ("nothing's going on")
export const ALT = C.orange; // the alternative ("something is going on")
export const DATA = C.violet; // the evidence / data
export const LINE = C.green; // the decision line (5%)

export const FLIPS: ("H" | "T")[] = ["H", "H", "H", "T", "H", "H", "H", "H", "H", "H"];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const LUCK = s.sent(1).from;
  const HT = s.cueS(2, "Hypothesis");
  const title = spr(HT - 3, theme.spring.pop);
  const heads = FLIPS.filter((f, i) => f === "H" && frame >= 8 + i * 7).length;
  return (
    <AbsoluteFill>
      {FLIPS.map((f, i) => {
        const p = spr(8 + i * 7, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const spin = Math.cos(Math.min(1, p) * Math.PI * 4);
        return (
          <div key={i} style={{ position: "absolute", left: 200 + (i % 5) * 170, top: 690 + Math.floor(i / 5) * 190, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])})` }}>
            <Coin side={f} size={130} squash={Math.max(0.15, Math.abs(spin))} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, opacity: Math.min(1, spr(14, theme.spring.smooth)) }}>
        <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>{heads}</span> HEADS <span style={{ color: C.dim, fontSize: 40 }}>OUT OF 10</span>
      </div>
      <Pop at={LUCK - 2} out={HT - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>RIGGED</span>, OR JUST <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>LUCK</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${NULLC}, ${ALT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(ALT, 0.45)})`, whiteSpace: "nowrap" }}>HYPOTHESIS</div>
          <div style={{ fontSize: 96, color: C.text }}>TESTING</div>
        </div>
      ) : null}
      <Burst at={HT} x={540} y={420} color={ALT} count={22} radius={340} seed={7} />
      <Pop at={HT + 10} x={540} y={1150} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

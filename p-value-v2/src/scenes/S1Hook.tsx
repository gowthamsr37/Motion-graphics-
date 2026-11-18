// SCENE 1 — HOOK. Ten flips land one by one: 9 heads, 1 tail → RIGGED, OR JUST LUCK? → THE p-VALUE · EXPLAINED SIMPLY.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, exitP, Pop, useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const NULLC = C.cyan; // the null: nothing special going on
export const PV = C.violet; // the p-value
export const EXT = C.orange; // extreme / surprising results
export const LINE = C.green; // the 0.05 line, significant

export const FLIPS: ("H" | "T")[] = ["H", "H", "H", "T", "H", "H", "H", "H", "H", "H"];
export const SIXROW: ("H" | "T")[] = ["H", "T", "H", "H", "T", "H", "T", "H", "H", "T"];

export const PLess: React.FC<{ v: string; size: number; color?: string; op?: string }> = ({ v, size, color = PV, op = "=" }) => (
  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>
    <span style={{ fontStyle: "italic", color, textShadow: glowText(color, 0.5) }}>p</span> {op} <span style={{ fontFamily: theme.fonts.mono }}>{v}</span>
  </span>
);

export const PPill: React.FC<{ v: string; size?: number; color?: string; op?: string }> = ({ v, size = 64, color = PV, op = "=" }) => (
  <div style={{ padding: "14px 40px", borderRadius: 999, background: alpha(color, 0.2), border: `4px solid ${color}`, boxShadow: `0 0 30px ${alpha(color, 0.4)}` }}>
    <PLess v={v} size={size} color={color} op={op} />
  </div>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const LUCK = s.sent(1).from;
  const PVW = s.cueS(1, "p-value");
  const EXACT = s.cueS(1, "exactly");
  const title = spr(PVW - 3, theme.spring.pop);
  const heads = FLIPS.filter((f, i) => f === "H" && frame >= 8 + i * 7).length;
  const qOut = exitP(frame, PVW - 6, 8);
  return (
    <AbsoluteFill>
      {FLIPS.map((f, i) => {
        const p = spr(8 + i * 7, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const spin = Math.cos(Math.min(1, p) * Math.PI * 4);
        return (
          <div key={i} style={{ position: "absolute", left: 200 + (i % 5) * 170, top: 720 + Math.floor(i / 5) * 190, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])})` }}>
            <Coin side={f} size={130} squash={Math.max(0.15, Math.abs(spin))} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, opacity: Math.min(1, spr(14, theme.spring.smooth)) }}>
        <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>{heads}</span> HEADS <span style={{ color: C.dim, fontSize: 40 }}>OUT OF 10</span>
      </div>
      {qOut < 1 ? (
        <Pop at={LUCK - 2} x={540} y={430} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
          <div style={{ opacity: 1 - qOut, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>RIGGED</span>, OR JUST <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>LUCK</span>
            <span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
      ) : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE</div>
          <div style={{ fontSize: 132, background: `linear-gradient(90deg, ${PV}, ${EXT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(PV, 0.5)})`, whiteSpace: "nowrap" }}>
            <span style={{ fontStyle: "italic" }}>p</span>-VALUE
          </div>
        </div>
      ) : null}
      <Burst at={PVW} x={540} y={430} color={PV} count={22} radius={340} seed={5} />
      <Pop at={EXACT} x={540} y={1180} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

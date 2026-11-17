// SCENE 1 — HOOK. A chai stall gets 4 customers an hour on average. What's the chance of 10 in one hour?
// → THE POISSON DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ChaiCup, Person } from "../components/Icons";
import { Burst, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const EVT = C.cyan; // events / counts
export const RATE = C.violet; // the average rate
export const HI = C.green; // highlighted / most likely
export const RARE = C.orange; // rare counts

const SHIRTS = [C.cyan, C.violet, C.green, C.orange];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FOUR = s.cueS(0, "4");
  const TEN = s.cueS(1, "10");
  const POI = s.cueS(2, "Poisson");
  const stall = spr(4, theme.spring.bouncy);
  const title = spr(POI - 3, theme.spring.pop);
  const crowd = frame >= TEN - 6 ? 10 : 4;

  return (
    <AbsoluteFill>
      {/* the stall */}
      <div style={{ position: "absolute", left: 540, top: 760, transform: `translate(-50%, -50%) scale(${stall})`, width: 520, height: 300, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(C.orange, 0.2)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(C.orange, 0.7)}` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -54, height: 70, borderRadius: "30px 30px 0 0", background: `repeating-linear-gradient(90deg, ${alpha(C.orange, 0.8)} 0 52px, ${alpha("#F3F7FF", 0.85)} 52px 104px)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>CHAI STALL</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 20 }}>
          <ChaiCup w={90} />
          <ChaiCup w={90} />
          <ChaiCup w={90} />
        </div>
      </div>
      {/* customers */}
      {Array.from({ length: crowd }, (_, i) => {
        const at = i < 4 ? FOUR - 10 + i * 6 : TEN - 6 + (i - 4) * 3;
        const p = spr(at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const x = 150 + (i % 10) * 87;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 1110, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center" }}>
            <Person height={120} shirt={SHIRTS[i % 4]} swing={Math.sin(frame / 4 + i) * 6 * (1 - p)} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 100, top: 1112, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.35), opacity: spr(FOUR - 10, theme.spring.smooth) }} />
      <Pop at={FOUR - 2} out={TEN - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label="4 CUSTOMERS AN HOUR (AVERAGE)" color={RATE} size={32} glow={0.5} />
      </Pop>
      <Pop at={TEN - 2} out={POI - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: RARE, textShadow: glowText(RARE, 0.5) }}>10</span> IN ONE HOUR<span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE POISSON</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${EVT}, ${RATE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(RATE, 0.5)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={POI} x={540} y={420} color={EVT} count={22} radius={340} seed={7} />
      <Pop at={POI + 10} x={540} y={1210} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

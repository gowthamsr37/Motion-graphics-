// SCENE 1 — HOOK. Ten customers; two glow orange (20%). A sales bar fills: 80% orange, 20% cyan → 20% → 80%
// → THE PARETO DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bracket } from "../components/Curve";
import { Arrow, Crown, Person } from "../components/Icons";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const MANY = C.cyan; // the many small values
export const FEW = C.orange; // the few huge values
export const AVG = C.violet; // the average (mean)
export const MID = C.green; // the typical value (median)

const PX = (i: number) => 175 + i * 81;
const BAR = { x: 120, y: 1190, w: 840, h: 64 };

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const SMALL = s.cueS(0, "small");
  const P20 = s.cueS(1, "20%");
  const P80 = s.cueS(1, "80%");
  const PAR = s.cueS(2, "Pareto");
  const fill80 = ease(frame, [P80 - 6, P80 + 18], [0, 1], theme.ease.inOut);
  const title = spr(PAR - 3, theme.spring.pop);

  return (
    <AbsoluteFill>
      <Pop at={4} out={P20 - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label="A SHOP'S CUSTOMERS" color={MANY} size={32} glow={0.4} />
      </Pop>
      {Array.from({ length: 10 }, (_, i) => {
        const p = spr(6 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const big = i < 2 && frame >= SMALL - 4;
        const g = spr(SMALL - 4 + i * 4, theme.spring.pop);
        return (
          <div key={i} style={{ position: "absolute", left: PX(i), top: 1040, transform: `translate(-50%, -100%) scale(${p * (big ? 1 + 0.12 * Math.min(1, g) : 1)})`, transformOrigin: "bottom center", filter: big ? `drop-shadow(0 0 18px ${alpha(FEW, 0.8)})` : undefined }}>
            {big ? (
              <div style={{ position: "absolute", left: "50%", top: -34, transform: `translateX(-50%) scale(${Math.min(1, g)})` }}>
                <Crown size={44} color={FEW} />
              </div>
            ) : null}
            <Person height={150} shirt={big ? FEW : [C.cyan, C.violet, C.green][i % 3]} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 100, top: 1042, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.35), opacity: spr(8, theme.spring.smooth) }} />
      <Bracket x0={PX(0) - 36} x1={PX(1) + 36} y={800} p={spr(P20 - 4, theme.spring.bouncy)} color={FEW} label={<span style={{ fontSize: 28 }}>20% OF CUSTOMERS</span>} />
      {/* the sales bar */}
      {frame >= P20 ? (
        <>
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: 18, background: alpha(MANY, 0.25), border: `3px solid ${alpha(MANY, 0.7)}`, boxSizing: "border-box", opacity: ease(frame, [P20, P20 + 8], [0, 1]) }} />
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w * 0.8 * fill80, height: BAR.h, borderRadius: 18, background: `linear-gradient(90deg, ${FEW}, ${alpha(FEW, 0.75)})`, boxShadow: `0 0 24px ${alpha(FEW, 0.5)}` }} />
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y - 30, opacity: ease(frame, [P20, P20 + 8], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>ALL THE SALES</div>
          {fill80 > 0.5 ? <div style={{ position: "absolute", left: BAR.x + BAR.w * 0.4, top: BAR.y + BAR.h / 2, transform: "translate(-50%, -50%)", opacity: ease(fill80, [0.5, 1], [0, 1]), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>80%</div> : null}
          {fill80 > 0.8 ? <div style={{ position: "absolute", left: BAR.x + BAR.w * 0.9, top: BAR.y + BAR.h / 2, transform: "translate(-50%, -50%)", opacity: ease(fill80, [0.8, 1], [0, 1]), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text }}>20%</div> : null}
        </>
      ) : null}
      <Pop at={P20 - 2} out={PAR - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: FEW, textShadow: glowText(FEW, 0.5) }}>20%</span>
          <Arrow size={74} color={C.text} />
          <span style={{ color: FEW, textShadow: glowText(FEW, 0.5), opacity: interpolate(fill80, [0, 0.3], [0.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>80%</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE PARETO</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${FEW}, ${AVG})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(FEW, 0.45)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={PAR} x={540} y={420} color={FEW} count={22} radius={340} seed={7} />
      <Pop at={PAR + 10} x={540} y={1330} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

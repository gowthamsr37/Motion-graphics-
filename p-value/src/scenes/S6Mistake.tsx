// SCENE 6 — THE BIG MISTAKE. ✗ "p = 0.01 → a 1% chance the null is true" (struck out). ✓ the chance of the DATA,
// IF THE NULL WERE TRUE. Then the formula pair: P(DATA | NULL) ≠ P(NULL | DATA).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NotEqual } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, NULLC, PLess, PV } from "./S1Hook";

const C = theme.colors;

const Warn: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 16px ${alpha(EXT, 0.6)})` }}>
    <path d="M50 6 L95 84 H5 Z" fill={alpha(EXT, 0.25)} stroke={EXT} strokeWidth={6} strokeLinejoin="round" />
    <rect x={46} y={32} width={8} height={30} rx={4} fill={C.text} />
    <circle cx={50} cy={72} r={5} fill={C.text} />
  </svg>
);

const Card: React.FC<{ y: number; p: number; color: string; head: string; children: React.ReactNode; dim?: number }> = ({ y, p, color, head, children, dim = 0 }) =>
  p > 0.001 ? (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 210, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2) * (1 - dim * 0.45), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(color, 0.18)}, rgba(14,24,64,0.92) 65%)`, border: `3px solid ${color}` }}>
      <div style={{ position: "absolute", left: 36, top: 26, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color }}>{head}</div>
      <div style={{ position: "absolute", left: 36, right: 36, top: 66 }}>{children}</div>
    </div>
  ) : null;

export const S6Mistake: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const WRONG = s.sent(1).from;
  const CHANCE = s.cueS(1, "chance");
  const TRUE1 = s.cueS(1, "true.");
  const RIGHT = s.sent(2).from;
  const NOT = s.cueS(2, "Not");
  const strike = ease(frame, [TRUE1 + 2, TRUE1 + 12], [0, 1]);
  const f = spr(NOT - 6, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE BIG MISTAKE" color={EXT} at={2} />
      <Pop at={6} x={540} y={450} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <Warn size={64} />
          <span>
            THE <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>MOST COMMON</span> MISREADING
          </span>
        </div>
      </Pop>
      <Card y={670} p={spr(WRONG - 4, theme.spring.bouncy)} color={C.red} head="THE MYTH" dim={ease(frame, [RIGHT, RIGHT + 10], [0, 1])}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <PLess v="0.01" size={44} op="=" color={PV} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.dim }}>means</span>
        </div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 6, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, opacity: Math.min(1, spr(CHANCE - 8, theme.spring.pop) * 2), whiteSpace: "nowrap" }}>
          1% CHANCE THE NULL IS TRUE
          <span style={{ position: "absolute", left: -6, top: "52%", width: `${strike * 104}%`, height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${C.red}` }} />
        </div>
        <div style={{ position: "absolute", right: 0, top: -50 }}>
          <Mark kind="cross" at={TRUE1 + 4} size={56} color={C.red} width={10} />
        </div>
      </Card>
      <Card y={925} p={spr(RIGHT - 4, theme.spring.bouncy)} color={LINE} head="WHAT IT REALLY IS">
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, lineHeight: 1.2, whiteSpace: "nowrap" }}>
          CHANCE OF THE <span style={{ color: PV, textShadow: glowText(PV, 0.5) }}>DATA</span>,
          <br />
          IF THE <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>NULL</span> WERE TRUE
        </div>
        <div style={{ position: "absolute", right: 0, top: -50 }}>
          <Mark kind="check" at={RIGHT + 8} size={56} color={LINE} width={10} />
        </div>
      </Card>
      {f > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1190, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, f), [0, 1], [0.6, 1])})`, opacity: Math.min(1, f * 2), display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text }}>
          <span style={{ padding: "8px 18px", borderRadius: 16, border: `3px solid ${LINE}`, background: alpha(LINE, 0.14) }}>
            P(<span style={{ color: PV }}>DATA</span> | <span style={{ color: NULLC }}>NULL</span>)
          </span>
          <NotEqual size={44} color={C.red} />
          <span style={{ padding: "8px 18px", borderRadius: 16, border: `3px solid ${alpha(C.red, 0.8)}`, background: alpha(C.red, 0.12) }}>
            P(<span style={{ color: NULLC }}>NULL</span> | <span style={{ color: PV }}>DATA</span>)
          </span>
        </div>
      ) : null}
      <Pop at={NOT + 14} x={540} y={1290} from="up" dist={10}>
        <div style={{ display: "flex", gap: 300, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", whiteSpace: "nowrap" }}>
          <span style={{ color: LINE }}>WHAT p IS</span>
          <span style={{ color: C.red }}>WHAT p IS NOT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

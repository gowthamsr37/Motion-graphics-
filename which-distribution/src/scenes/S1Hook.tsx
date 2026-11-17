// SCENE 1 — HOOK. Twelve distribution cards pop into a grid (the ones named pop on their words, the rest on "many")
// → WHICH DISTRIBUTION? → THE COMPLETE CHEAT SHEET.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { type Kind, Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const COUNTS = C.cyan;
export const MEAS = C.violet;
export const TEST = C.orange;
export const BONUS = C.green;

export type Card = { kind: Kind; name: string; c: string };
export const ALL: Card[] = [
  { kind: "uniform", name: "UNIFORM", c: COUNTS },
  { kind: "bernoulli", name: "BERNOULLI", c: COUNTS },
  { kind: "binomial", name: "BINOMIAL", c: COUNTS },
  { kind: "geometric", name: "GEOMETRIC", c: COUNTS },
  { kind: "poisson", name: "POISSON", c: COUNTS },
  { kind: "normal", name: "NORMAL", c: MEAS },
  { kind: "exp", name: "EXPONENTIAL", c: MEAS },
  { kind: "lognormal", name: "LOG-NORMAL", c: MEAS },
  { kind: "pareto", name: "PARETO", c: MEAS },
  { kind: "t", name: "t", c: TEST },
  { kind: "chisq", name: "CHI-SQUARE", c: TEST },
  { kind: "bimodal", name: "BIMODAL", c: BONUS },
];
const SAID: Record<string, string> = { UNIFORM: "Uniform,", BINOMIAL: "binomial,", POISSON: "Poisson,", NORMAL: "normal,", PARETO: "Pareto,", "CHI-SQUARE": "chi-square..." };

export const MiniCard: React.FC<{ c: Card; x: number; y: number; p: number; w?: number; h?: number; wob?: number }> = ({ c, x, y, p, w = 280, h = 140, wob = 0 }) =>
  p > 0.001 ? (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])}) rotate(${wob}deg)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 22, background: `linear-gradient(180deg, ${alpha(c.c, 0.16)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(c.c, 0.8)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Shape kind={c.kind} w={w * 0.55} h={h * 0.36} color={c.c} p={Math.min(1, p)} />
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: c.name.length > 9 ? 22 : 26, color: C.text }}>{c.name === "t" ? "t-DIST" : c.name}</div>
    </div>
  ) : null;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const MANY = s.cueS(0, "many");
  const WHICH = s.cueS(1, "Which");
  const CHEAT = s.cueS(1, "cheat");
  const title = spr(WHICH - 3, theme.spring.pop);
  return (
    <AbsoluteFill>
      {ALL.map((c, i) => {
        const tok = SAID[c.name];
        const at = tok ? s.cueS(0, tok) - 5 : MANY - 4 + i * 2;
        const wob = frame >= MANY && frame < WHICH ? Math.sin(frame / 3 + i * 1.7) * 3 : 0;
        return <MiniCard key={c.name} c={c} x={230 + (i % 3) * 310} y={620 + Math.floor(i / 3) * 165} p={spr(at, theme.spring.bouncy)} wob={wob} />;
      })}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 72, color: C.text }}>WHICH</div>
          <div style={{ fontSize: 92, whiteSpace: "nowrap" }}>
            <span style={{ background: `linear-gradient(90deg, ${COUNTS}, ${MEAS}, ${TEST})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(MEAS, 0.5)})` }}>DISTRIBUTION</span>
            <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>?</span>
          </div>
        </div>
      ) : null}
      <Burst at={WHICH} x={540} y={400} color={MEAS} count={22} radius={340} seed={7} />
      <Pop at={CHEAT - 4} x={540} y={1300} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label="THE COMPLETE CHEAT SHEET" color={BONUS} size={36} glow={0.5} />
      </Pop>
    </AbsoluteFill>
  );
};

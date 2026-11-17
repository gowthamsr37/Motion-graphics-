// SCENE 1 — HOOK. Five shape cards pop in on their names (uniform, binomial, Poisson, exponential, normal):
// so many! → WHICH DISTRIBUTION? → a simple cheat sheet.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { type Kind, Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
// one colour per distribution, used across the whole video
export const UNI = C.cyan;
export const BIN = C.violet;
export const POI = C.green;
export const EXP = C.orange;
export const NOR = C.violet;
export const NOR2 = C.cyan;
export const BIM = C.green;
export const BIM2 = C.orange;

export const CARDS: { kind: Kind; name: string; c: string; c2?: string; tok: string; x: number; y: number }[] = [
  { kind: "uniform", name: "UNIFORM", c: UNI, tok: "Uniform,", x: 220, y: 660 },
  { kind: "binomial", name: "BINOMIAL", c: BIN, tok: "binomial,", x: 540, y: 660 },
  { kind: "poisson", name: "POISSON", c: POI, tok: "Poisson,", x: 860, y: 660 },
  { kind: "exp", name: "EXPONENTIAL", c: EXP, tok: "exponential,", x: 380, y: 900 },
  { kind: "normal", name: "NORMAL", c: NOR, c2: NOR2, tok: "normal.", x: 700, y: 900 },
];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const MANY = s.sent(1).from;
  const WHICH = s.cueS(1, "Which");
  const CHEAT = s.cueS(2, "cheat");
  const title = spr(WHICH - 3, theme.spring.pop);

  return (
    <AbsoluteFill>
      {CARDS.map((k, i) => {
        const p = spr(s.cueS(0, k.tok) - 5, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const wob = frame >= MANY && frame < WHICH ? Math.sin(frame / 3 + i * 1.7) * 3 : 0;
        return (
          <div key={k.name} style={{ position: "absolute", left: k.x, top: k.y, width: 290, height: 210, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])}) rotate(${wob}deg)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(180deg, ${alpha(k.c, 0.16)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(k.c, 0.8)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Shape kind={k.kind} w={200} h={90} color={k.c} color2={k.c2} p={Math.min(1, p)} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: k.name.length > 9 ? 26 : 30, color: C.text, letterSpacing: "0.02em" }}>{k.name}</div>
          </div>
        );
      })}
      <Pop at={MANY - 2} out={WHICH - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
          SO MANY<span style={{ color: C.yellow }}>!</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>WHICH</div>
          <div style={{ fontSize: 96, whiteSpace: "nowrap" }}>
            <span style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(C.violet, 0.5)})` }}>DISTRIBUTION</span>
            <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>?</span>
          </div>
        </div>
      ) : null}
      <Burst at={WHICH} x={540} y={420} color={C.cyan} count={22} radius={340} seed={7} />
      <Pop at={CHEAT - 4} x={540} y={1130} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label="THE CHEAT SHEET" color={C.green} size={36} glow={0.5} />
      </Pop>
    </AbsoluteFill>
  );
};

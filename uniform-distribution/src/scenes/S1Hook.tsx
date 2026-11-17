// SCENE 1 — HOOK. A fair dice · a lucky draw · a random number on your phone. What do they have in common?
// Each gets six equal bars: every outcome equally likely → THE UNIFORM DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const DISC = C.cyan; // discrete
export const CONT = C.green; // continuous
export const AREA = C.violet; // chance = area
export const HOT = C.orange; // the quiz / highlighted slice

export const RaffleGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <rect x={14} y={30} width={72} height={60} rx={12} fill={alpha(C.violet, 0.3)} stroke={C.violet} strokeWidth={5} />
    <path d="M30 30 Q50 8 70 30" fill="none" stroke={C.violet} strokeWidth={5} />
    {[
      [34, 56, "3"],
      [56, 50, "7"],
      [44, 74, "1"],
      [68, 72, "5"],
    ].map(([x, y, t], i) => (
      <g key={i}>
        <circle cx={x as number} cy={y as number} r={10} fill="#F3F7FF" />
        <text x={x as number} y={(y as number) + 1} textAnchor="middle" dominantBaseline="central" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={12} fill={C.ink}>
          {t}
        </text>
      </g>
    ))}
  </svg>
);

export const PhoneGlyph: React.FC<{ size: number; text: string }> = ({ size, text }) => (
  <div style={{ width: size * 0.62, height: size, borderRadius: size * 0.1, border: `4px solid ${C.green}`, background: alpha(C.green, 0.15), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size * 0.22, color: C.text, boxSizing: "border-box" }}>{text}</div>
);

const CARDS = [
  { x: 220, label: "FAIR DICE", c: DISC },
  { x: 540, label: "LUCKY DRAW", c: C.violet },
  { x: 860, label: "RANDOM NUMBER", c: CONT },
];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const at = [s.cueS(0, "dice."), s.cueS(0, "draw."), s.cueS(0, "phone.")];
  const COMMON = s.sent(1).from;
  const EVERY = s.sent(2).from;
  const UNI = s.cueS(2, "uniform");
  const title = spr(UNI - 3, theme.spring.pop);
  const roll = frame < at[0] + 24 ? 1 + (Math.floor(frame / 3) * 5) % 6 : 4;
  const rnd = (Math.abs(Math.sin(Math.floor(frame / 4) * 12.9898)) * 10).toFixed(1);

  return (
    <AbsoluteFill>
      <Pop at={COMMON - 4} out={UNI - 6} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          WHAT DO THEY HAVE
          <br />
          IN COMMON<span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {CARDS.map((k, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={k.label} style={{ position: "absolute", left: k.x, top: 820, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), width: 290, height: 420, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(k.c, 0.2)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${alpha(k.c, 0.8)}` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", height: 130, alignItems: "center" }}>
              {i === 0 ? <Die value={roll} size={110} color={DISC} glow={0.5} /> : i === 1 ? <RaffleGlyph size={120} /> : <PhoneGlyph size={130} text={rnd} />}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: k.c, whiteSpace: "nowrap" }}>{k.label}</div>
            {/* equal bars: every outcome equally likely */}
            <div style={{ position: "absolute", left: 30, bottom: 40, width: 230, height: 140, display: "flex", alignItems: "flex-end", gap: 6, borderBottom: `3px solid ${alpha("#F3F7FF", 0.4)}` }}>
              {Array.from({ length: 6 }, (_, j) => (
                <div key={j} style={{ flex: 1, height: 110 * ease(frame, [EVERY + 4 + j * 2, EVERY + 18 + j * 2], [0, 1], theme.ease.out), borderRadius: "6px 6px 2px 2px", background: alpha(k.c, 0.55), border: `2px solid ${k.c}`, boxSizing: "border-box" }} />
              ))}
            </div>
          </div>
        );
      })}
      <Pop at={EVERY + 6} out={UNI - 6} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          EVERY OUTCOME <span style={{ color: CONT, textShadow: glowText(CONT, 0.5) }}>EQUALLY LIKELY</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE UNIFORM</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${DISC}, ${CONT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(CONT, 0.5)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={UNI} x={540} y={440} color={CONT} count={22} radius={340} seed={7} />
      <Pop at={UNI + 10} x={540} y={1110} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 1 — HOOK. Two report cards: MATHS 80 and SCIENCE 70. Which is better? Maths looks better… actually Science!
// Then the cards shrink with "z = ?" chips under them and Z-SCORE slams in.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Crown } from "../components/Icons";
import { Stamp } from "../components/Kit";
import { Burst, ease, Pop, shake, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const SUBJ = { maths: C.cyan, science: C.violet };

export const MathsGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 8px ${alpha(color, 0.6)})` }}>
    <rect x={6} y={6} width={88} height={88} rx={20} fill={alpha(color, 0.14)} stroke={color} strokeWidth={5} />
    <path d="M30 22 V44 M19 33 H41" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M59 33 H81" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M21 59 L39 77 M39 59 L21 77" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M59 68 H81" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <circle cx={70} cy={58} r={4.5} fill={color} />
    <circle cx={70} cy={78} r={4.5} fill={color} />
  </svg>
);

export const ScienceGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 8px ${alpha(color, 0.6)})` }}>
    <path d="M38 10 H62 M42 10 V38 L18 82 Q14 92 26 92 H74 Q86 92 82 82 L58 38 V10" fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    <path d="M27 70 Q50 62 73 70 L80 84 Q82 88 76 88 H24 Q18 88 20 84 Z" fill={alpha(color, 0.5)} />
    <circle cx={44} cy={78} r={4} fill="#F3F7FF" opacity={0.8} />
    <circle cx={57} cy={73} r={3} fill="#F3F7FF" opacity={0.7} />
  </svg>
);

// a subject report card; scale/dim/glow are driven by the scene
export const ScoreCard: React.FC<{ label: string; score: string; color: string; icon: React.ReactNode; glow?: number; w?: number; h?: number; scoreSize?: number }> = ({ label, score, color, icon, glow = 0, w = 380, h = 420, scoreSize = 150 }) => (
  <div style={{ width: w, height: h, boxSizing: "border-box", borderRadius: 34, background: `linear-gradient(180deg, ${alpha(color, 0.2)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${alpha(color, 0.5 + glow * 0.5)}`, boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${alpha(color, 0.45 * glow)}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
    {icon}
    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.22em", color, whiteSpace: "nowrap" }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontFamily: theme.fonts.mono, fontWeight: 800, color: C.text, lineHeight: 1 }}>
      <span style={{ fontSize: scoreSize, letterSpacing: "-0.04em", textShadow: glowText(color, 0.4) }}>{score}</span>
      <span style={{ fontSize: scoreSize * 0.24, color: C.dim }}>/100</span>
    </div>
  </div>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const W80 = s.cueS(0, "80");
  const W70 = s.cueS(0, "70");
  const WHICH = s.sent(1).from;
  const MATHSW = s.cueS(2, "Maths");
  const ACT = s.cueS(2, "Actually,");
  const SCI = s.cueS(2, "Science!");
  const NEED = s.sent(3).from;
  const ZW = s.cueS(3, "zscore");

  const look = ease(frame, [MATHSW - 4, MATHSW + 8], [0, 1]) * (1 - ease(frame, [ACT - 4, ACT + 6], [0, 1]));
  const flip = ease(frame, [ACT - 2, ACT + 10], [0, 1]);
  const shrink = ease(frame, [NEED - 4, NEED + 16], [0, 1], theme.ease.inOut);
  const sh = shake(frame, SCI, 10, 8);
  const zIn = spr(ZW - 3, theme.spring.pop);
  const cardY = interpolate(shrink, [0, 1], [800, 1080]);
  const cardS = interpolate(shrink, [0, 1], [1, 0.62]);
  const cards = [
    { k: "maths", x: interpolate(shrink, [0, 1], [300, 360]), at: W80, label: "MATHS", score: "80", c: SUBJ.maths, icon: <MathsGlyph size={110} color={SUBJ.maths} />, s: 1 + look * 0.08 - flip * 0.06, dim: 1 - flip * 0.45, glow: look },
    { k: "science", x: interpolate(shrink, [0, 1], [780, 720]), at: W70, label: "SCIENCE", score: "70", c: SUBJ.science, icon: <ScienceGlyph size={110} color={SUBJ.science} />, s: 1 + flip * 0.08, dim: 1, glow: flip },
  ];

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Pop at={WHICH - 4} out={NEED - 6} x={540} y={420} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, color: C.text, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
          WHICH IS BETTER<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
        </div>
      </Pop>
      {cards.map((c) => {
        const p = spr(c.at - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={c.k} style={{ position: "absolute", left: c.x, top: cardY, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1]) * c.s * cardS})`, opacity: Math.min(1, p * 2) * c.dim }}>
            <ScoreCard label={c.label} score={c.score} color={c.c} icon={c.icon} glow={c.glow} />
          </div>
        );
      })}
      <Pop at={MATHSW - 2} out={ACT - 2} x={300} y={548} from="down" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: SUBJ.maths, whiteSpace: "nowrap" }}>LOOKS BETTER…</div>
      </Pop>
      {/* the twist: Science */}
      <Pop at={ACT - 2} out={NEED - 4} x={780} y={548} from="down" dist={16} cfg={theme.spring.pop}>
        <Crown size={80} color={C.yellow} />
      </Pop>
      {frame < NEED ? <Stamp at={SCI - 4} x={780} y={1050} color={C.green} rot={-7} size={40}>ACTUALLY BETTER!</Stamp> : null}
      <Burst at={SCI - 2} x={780} y={800} color={SUBJ.science} count={18} radius={300} seed={4} />

      {/* the tool: z-score */}
      {zIn > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(zIn, [0, 1], [1.7, 1])})`, opacity: Math.min(1, zIn * 2) }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.26em", color: C.dim, marginBottom: 10 }}>YOU NEED A</div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.03em", lineHeight: 1, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(C.green, 0.5)})`, whiteSpace: "nowrap" }}>Z-SCORE</div>
        </div>
      ) : null}
      <Burst at={ZW} x={540} y={600} color={C.green} count={22} radius={340} seed={7} />
      {[360, 720].map((x, i) => (
        <Pop key={x} at={ZW + 6 + i * 4} x={x} y={1260} from="up" dist={14} cfg={theme.spring.bouncy}>
          <div style={{ padding: "6px 22px", borderRadius: 999, background: "#0A1440", border: `3px solid ${C.green}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
            z = <span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

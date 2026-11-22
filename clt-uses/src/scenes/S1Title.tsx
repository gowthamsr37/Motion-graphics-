// SCENE 1 — TITLE CARD, ON SCREEN FROM FRAME 0 (the first 2–3 seconds decide the skip): THE CENTRAL LIMIT THEOREM ·
// 5 REAL-WORLD USES, and the five use tiles (polls, A/B tests, factories, insurance, ML) pop in by ~1 s; each tile then
// lights on its spoken name; SAVE THIS bookmark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FnCurve } from "../components/Curve";
import { Bookmark } from "../components/Guide";
import { Pop, useSpr } from "../components/Motion";
import { USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = { x0: 140, x1: 940, vmin: -3.4, vmax: 3.4, base: 760, h: 300 };

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const lights = [s.cueS(1, "Election"), s.cueS(1, "A/B"), s.cueS(1, "factories,"), s.cueS(1, "insurance,"), s.cueS(1, "machine")];
  const SAVE = s.cueS(1, "Save");
  const t = spr(0, theme.spring.pop);
  const pos = [
    [210, 950], [540, 950], [870, 950], [375, 1150], [705, 1150],
  ];
  return (
    <AbsoluteFill>
      <FnCurve g={G} f={(v) => Math.exp(-v * v / 2)} fmax={1} p={interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" })} color={C.violet} fill={0.08} width={4} opacity={0.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, t), [0, 1], [1.3, 1])})`, opacity: Math.min(1, t * 2), fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.02 }}>
        <div style={{ fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>THE CENTRAL LIMIT THEOREM</div>
        <div style={{ marginTop: 14, fontSize: 88, whiteSpace: "nowrap", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(C.violet, 0.5)})` }}>5 REAL-WORLD USES</div>
      </div>
      {USES.map((u, i) => {
        const p = spr(6 + i * 4, theme.spring.bouncy);
        const on = frame >= lights[i] - 4;
        const pulse = on ? spr(lights[i] - 4, theme.spring.pop) : 0;
        const [x, y] = pos[i];
        return p > 0.001 ? (
          <div key={u.n} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1]) * (1 + 0.08 * Math.max(0, 1 - Math.abs(pulse - 1) * 3) * (on ? 1 : 0))})`, opacity: Math.min(1, p * 2), width: 300, height: 170, boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(180deg, ${alpha(u.c, on ? 0.3 : 0.14)}, rgba(14,24,64,0.92))`, border: `3px solid ${on ? u.c : alpha(u.c, 0.6)}`, boxShadow: on ? `0 0 26px ${alpha(u.c, 0.5)}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <u.Icon size={72} color={u.c} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: u.title.length > 12 ? 26 : 30, color: C.text, textShadow: on ? glowText(u.c, 0.4) : undefined, whiteSpace: "nowrap" }}>{u.title}</div>
          </div>
        ) : null;
      })}
      <Pop at={SAVE - 4} x={540} y={1320} from="up" dist={60} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 4 ? Math.sin((frame - SAVE) / 4) * 4 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

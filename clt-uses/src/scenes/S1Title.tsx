// SCENE 1 — TITLE CARD, ON SCREEN FROM FRAME 0: HOW CAN 1,000 PEOPLE PREDICT AN ELECTION? · THE CENTRAL LIMIT THEOREM IN
// REAL LIFE; a big ELECTION POLLS tile (THE DETAILED EXAMPLE) and four small tiles (+ A/B TESTS · FACTORIES · INSURANCE ·
// ML) visible by ~1.5 s; SAVE THIS bookmark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Pop, useSpr } from "../components/Motion";
import { USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const SAVE = s.cueS(1, "Save");
  const MORE = s.cueS(1, "4");
  const t = spr(0, theme.spring.pop);
  const big = spr(8, theme.spring.bouncy);
  const P = USES[0];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, t), [0, 1], [1.25, 1])})`, opacity: Math.min(1, t * 2), fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
        <div style={{ fontSize: 66, color: C.text, whiteSpace: "nowrap" }}>
          HOW CAN <span style={{ color: P.c, textShadow: glowText(P.c, 0.6) }}>1,000 PEOPLE</span>
        </div>
        <div style={{ fontSize: 66, color: C.text, whiteSpace: "nowrap" }}>
          PREDICT AN ELECTION<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 34, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap" }}>THE CENTRAL LIMIT THEOREM IN REAL LIFE</div>
      </div>
      {big > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, big), [0, 1], [0.5, 1])})`, opacity: Math.min(1, big * 2), width: 620, height: 220, boxSizing: "border-box", borderRadius: 32, background: `linear-gradient(180deg, ${alpha(P.c, 0.3)}, rgba(14,24,64,0.94))`, border: `4px solid ${P.c}`, boxShadow: `0 0 34px ${alpha(P.c, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <P.Icon size={130} color={P.c} />
          <div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: P.c }}>THE DETAILED EXAMPLE</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.text }}>ELECTION POLLS</div>
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", opacity: Math.min(1, spr(14, theme.spring.smooth) * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim }}>+ 4 MORE PLACES IT&apos;S USED</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", justifyContent: "center", gap: 18 }}>
        {USES.slice(1).map((u, i) => {
          const p = spr(16 + i * 4, theme.spring.bouncy);
          const on = frame >= MORE - 4;
          return (
            <div key={u.n} style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1]) * (on ? 1 + 0.06 * Math.sin((frame - MORE) / 3 + i) * Math.max(0, 1 - (frame - MORE) / 30) : 1)})`, width: 200, height: 150, boxSizing: "border-box", borderRadius: 22, background: `linear-gradient(180deg, ${alpha(u.c, 0.18)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(u.c, 0.8)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <u.Icon size={64} color={u.c} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>{u.short}</div>
            </div>
          );
        })}
      </div>
      <Pop at={SAVE - 4} x={540} y={1300} from="up" dist={60} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 4 ? Math.sin((frame - SAVE) / 4) * 4 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 1 — HOOK. z-TEST · t-TEST · CHI-SQUARE · ANOVA tiles pop in on their names and wobble; WHICH ONE?; at
// "wrong" the tiles shake and WRONG TEST = WRONG ANSWER is stamped; THE COMPLETE CHEAT SHEET pill; a SAVE IT bookmark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Stamp } from "../components/Kit";
import { Burst, Pop, shake, useSpr } from "../components/Motion";
import { CAT, G1, G2, G3 } from "../components/Tests";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const WRONG = s.cueS(1, "wrong");
  const EXACT = s.cueS(1, "exactly");
  const SAVE = s.cueS(1, "Save");
  const WHICH = s.cueS(0, "Which");
  const tiles = [
    { t: "z-TEST", c: G1, at: s.cueS(0, "z-test,"), x: 320, y: 560 },
    { t: "t-TEST", c: G2, at: s.cueS(0, "t-test,"), x: 760, y: 560 },
    { t: "CHI-SQUARE", c: CAT, at: s.cueS(0, "chi-square,"), x: 320, y: 740 },
    { t: "ANOVA", c: G3, at: s.cueS(0, "ANOVA."), x: 760, y: 740 },
  ];
  const sh = shake(frame, WRONG - 2, 14, 12);
  const q = spr(WHICH - 4, theme.spring.pop);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", opacity: Math.min(1, spr(2, theme.spring.smooth) * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>4 TESTS · 1 QUESTION</div>
      {tiles.map((t, i) => {
        const p = spr(t.at - 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const wob = Math.sin(frame / 9 + i * 1.7) * 2.5;
        return (
          <div key={t.t} style={{ position: "absolute", left: t.x + sh.x, top: t.y + sh.y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])}) rotate(${wob}deg)`, opacity: Math.min(1, p * 2), width: 400, height: 140, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(t.c, 0.25)}, rgba(14,24,64,0.92))`, border: `3px solid ${t.c}`, boxShadow: `0 0 26px ${alpha(t.c, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: t.t.length > 7 ? 50 : 60, color: C.text, textShadow: glowText(t.c, 0.4) }}>
            {t.t}
          </div>
        );
      })}
      {q > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, q), [0, 1], [1.5, 1])})`, opacity: Math.min(1, q * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.02em", color: C.text, whiteSpace: "nowrap" }}>
          WHICH ONE<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
        </div>
      ) : null}
      <Burst at={WHICH} x={540} y={930} color={C.yellow} count={18} radius={300} seed={5} />
      {frame >= WRONG - 2 ? (
        <Stamp at={WRONG - 2} x={540} y={1070} color={C.red} size={40}>
          WRONG TEST = WRONG ANSWER
        </Stamp>
      ) : null}
      <Pop at={EXACT - 4} x={540} y={1185} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 26px", borderRadius: 999, background: alpha(G1, 0.16), border: `2px solid ${G1}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>THE COMPLETE CHEAT SHEET</div>
      </Pop>
      <Pop at={SAVE - 4} x={540} y={1305} from="up" dist={60} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 34px", borderRadius: 999, background: alpha(G3, 0.2), border: `3px solid ${G3}`, boxShadow: `0 0 30px ${alpha(G3, 0.45)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 6 ? Math.sin((frame - SAVE) / 4) * 3 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={44} color={G3} />
          SAVE <span style={{ color: G3, textShadow: glowText(G3, 0.5) }}>IT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

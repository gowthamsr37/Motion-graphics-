// SCENE 7 — COMING SOON + CTA. A DAY 1 calendar card, COMING SOON, a ringing bell on "notifications", then the series
// end card (NEXT: DAY 1: WHAT IS ML?).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { BellIcon } from "../components/ML";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Coming: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const DAY = s.sent(0).from;
  const SOON = s.cueS(0, "soon.");
  const NOTIF = s.cueS(1, "notifications,");
  const FOL = s.sent(2).from;
  const FOLW = s.cueS(2, "Follow");
  const DATAW = s.cueS(2, "data");
  const SIMPLE = s.cueS(2, "simple!");
  const out = exitP(frame, FOL - 10, 10);
  const cal = spr(DAY - 6, theme.spring.bouncy);
  const soon = spr(SOON - 4, theme.spring.pop);
  const ring = ease(frame, [NOTIF - 4, NOTIF + 26], [0, 1]);
  return (
    <AbsoluteFill>
      {out < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - out }}>
          {cal > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 560, width: 300, height: 320, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cal), [0, 1], [0.5, 1])}) rotate(${(1 - Math.min(1, cal)) * -8}deg)`, opacity: Math.min(1, cal * 2), borderRadius: 32, overflow: "hidden", background: "rgba(14,24,64,0.95)", border: `3px solid ${alpha(C.text, 0.4)}`, boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 40px ${alpha(C.violet, 0.35)}` }}>
              <div style={{ height: 86, background: `linear-gradient(90deg, ${C.violet}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.24em", color: C.ink }}>DAY</div>
              <div style={{ height: 234, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 170, color: C.text, textShadow: glowText(C.yellow, 0.4) }}>1</div>
            </div>
          ) : null}
          {soon > 0.001 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, soon), [0, 1], [1.5, 1])})`, opacity: Math.min(1, soon * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 108, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap", color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>
              COMING SOON
            </div>
          ) : null}
          <Burst at={SOON} x={540} y={880} color={C.yellow} count={24} radius={380} seed={8} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", opacity: Math.min(1, soon * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim }}>100 DAYS OF MACHINE LEARNING</div>
          <Pop at={NOTIF - 6} x={540} y={1180} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 30px", borderRadius: 999, background: alpha(C.cyan, 0.16), border: `3px solid ${C.cyan}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              <BellIcon size={52} color={C.cyan} ring={ring} />
              TURN ON NOTIFICATIONS
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="DAY 1: WHAT IS ML?"
          chips={[
            { l: "100 days", c: C.cyan },
            { l: "1 topic a day", c: C.violet },
            { l: "Real projects", c: C.orange },
            { l: "Follow", c: C.green },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

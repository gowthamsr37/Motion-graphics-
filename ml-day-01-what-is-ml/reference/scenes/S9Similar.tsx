// SCENE 9 — SIMILARLY, IT'S USED IN… The election-poll tile shrinks to the top (SAME IDEA); four tiles land one per sentence,
// each with icon, title and its average: A/B TESTS (average spend per user), FACTORIES (average of 5 bottles every hour),
// INSURANCE (average claim of thousands), MACHINE LEARNING (accuracy = average of right/wrong).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useSpr } from "../components/Motion";
import { USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const LINES = ["Average spend per user, version A vs B", "Average weight of 5 bottles, every hour", "Average claim of thousands of customers", "Accuracy = average of right / wrong"];
const POS = [[300, 740], [780, 740], [300, 1100], [780, 1100]];

export const S9Similar: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const P = USES[0];
  const head = spr(2, theme.spring.pop);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540, top: 330, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, head), [0, 1], [0.6, 1])})`, opacity: Math.min(1, head * 2), display: "flex", alignItems: "center", gap: 18, whiteSpace: "nowrap" }}>
        <P.Icon size={70} color={P.c} />
        <div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.dim }}>SAME IDEA AS ELECTION POLLS</div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text }}>
            SIMILARLY, IT&apos;S <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>USED IN</span>
          </div>
        </div>
      </div>
      {USES.slice(1).map((u, i) => {
        const at = s.sent(i + 1).from - 6;
        const p = spr(at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const live = frame >= at && frame < s.sent(i + 1).to + 6;
        return (
          <div key={u.n} style={{ position: "absolute", left: POS[i][0], top: POS[i][1], transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1]) * (live ? 1.04 : 1)})`, opacity: Math.min(1, p * 2), width: 440, height: 320, boxSizing: "border-box", borderRadius: 30, padding: "0 26px", background: `linear-gradient(180deg, ${alpha(u.c, live ? 0.3 : 0.16)}, rgba(14,24,64,0.94))`, border: `${live ? 4 : 3}px solid ${live ? u.c : alpha(u.c, 0.6)}`, boxShadow: live ? `0 0 30px ${alpha(u.c, 0.5)}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center" }}>
            <u.Icon size={92} color={u.c} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: u.title.length > 12 ? 36 : 42, color: C.text, whiteSpace: "nowrap" }}>{u.title}</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 25, lineHeight: 1.25, color: u.c }}>{LINES[i]}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

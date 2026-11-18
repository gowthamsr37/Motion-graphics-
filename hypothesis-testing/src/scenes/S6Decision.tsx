// SCENE 6 — THE DECISION. A "how surprising" scale from 0% to 50% with the 5% line (green, chosen beforehand).
// 9 heads → 1% (left of the line): REJECT THE NULL, probably rigged. 6 heads → 38%: FAIL TO REJECT (not proof of fair).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, LINE, NULLC } from "./S1Hook";

const C = theme.colors;
const X0 = 150;
const X1 = 930;
const PMAX = 50;
const px = (pct: number) => X0 + (pct / PMAX) * (X1 - X0);
const Y = 860;

export const S6Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const FIVE = s.cueS(0, "5%.");
  const ONE = s.sent(1).from;
  const REJ = s.cueS(1, "reject");
  const SIX = s.sent(2).from;
  const P38 = s.cueS(2, "38%");
  const FAIL = s.cueS(2, "fail");
  const axis = ease(frame, [6, 20], [0, 1]);
  const line = spr(FIVE - 4, theme.spring.bouncy);
  const dot = (pct: number, at: number, color: string, label: string, up: boolean) => {
    const p = spr(at, theme.spring.pop);
    if (p <= 0.01) return null;
    return (
      <>
        <div style={{ position: "absolute", left: px(pct) - 18, top: Y - 18, width: 36, height: 36, borderRadius: 18, background: color, boxShadow: `0 0 18px ${color}`, transform: `scale(${p})` }} />
        <div style={{ position: "absolute", left: Math.max(px(pct), 230), top: up ? Y - 64 : Y + 64, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color, textShadow: glowText(color, 0.4), whiteSpace: "nowrap" }}>{label}</div>
      </>
    );
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DECISION" color={LINE} at={2} />
      {/* the scale */}
      <div style={{ position: "absolute", left: X0, top: Y - 5, width: (X1 - X0) * axis, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${alpha(ALT, 0.8)}, ${alpha(NULLC, 0.5)} 20%, ${alpha(NULLC, 0.3)})` }} />
      {[0, 10, 20, 30, 40, 50].map((v) => (
        <div key={v} style={{ position: "absolute", left: px(v), top: Y + 120, transform: "translate(-50%, -50%)", opacity: axis, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>{v}%</div>
      ))}
      <div style={{ position: "absolute", left: X0, top: Y + 160, opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: ALT }}>VERY SURPRISING</div>
      <div style={{ position: "absolute", right: 1080 - X1, top: Y + 160, opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: NULLC }}>EASILY LUCK</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: Y - 160, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>HOW OFTEN WOULD A FAIR COIN DO THIS?</div>
      {/* the 5% line */}
      {line > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: px(5) - 3, top: Y - 110 * Math.min(1, line), width: 6, height: 220 * Math.min(1, line), borderRadius: 3, background: LINE, boxShadow: `0 0 14px ${LINE}` }} />
          <div style={{ position: "absolute", left: px(5) + 14, top: Y - 100, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: LINE, opacity: Math.min(1, line * 2), whiteSpace: "nowrap" }}>THE 5% LINE</div>
        </>
      ) : null}
      {dot(1.07, ONE + 2, ALT, "9 HEADS: 1%", false)}
      {dot(37.7, P38 - 4, NULLC, "6 HEADS: 38%", true)}
      <Pop at={REJ - 4} out={SIX - 4} x={540} y={470} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: alpha(ALT, 0.2), border: `3px solid ${ALT}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          BELOW 5%: <span style={{ color: ALT }}>REJECT THE NULL</span>
        </div>
      </Pop>
      <Pop at={REJ + 14} out={SIX - 4} x={540} y={560} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>THE COIN IS PROBABLY RIGGED</div>
      </Pop>
      <Pop at={FAIL - 4} x={540} y={470} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: alpha(NULLC, 0.2), border: `3px solid ${NULLC}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          ABOVE 5%: <span style={{ color: NULLC }}>FAIL TO REJECT</span>
        </div>
      </Pop>
      <Pop at={FAIL + 14} x={540} y={560} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>NOT PROOF THE COIN IS FAIR</div>
      </Pop>
    </AbsoluteFill>
  );
};

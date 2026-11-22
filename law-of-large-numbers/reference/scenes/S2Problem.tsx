// SCENE 2 — THE PROBLEM. A crowd of dim dots (MILLIONS OF VOTERS); 1,000 random ones light up cyan (THE SAMPLE); then the
// raw data as two bars, YES / NO: NOT A BELL CURVE (a struck-out bell icon).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CurveIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, rng } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { USES } from "../components/Uses";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const r = rng(9);
const CROWD = Array.from({ length: 480 }, () => ({ x: 110 + r() * 860, y: 420 + r() * 330, pick: r() < 0.12 }));

export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const PICK = s.cueS(0, "1,000");
  const BARS = s.cueS(1, "bars.");
  const pick = ease(frame, [PICK - 6, PICK + 14], [0, 1]);
  const bars = ease(frame, [BARS - 10, BARS + 10], [0, 1]);
  const Q = s.sent(2).from;
  const clear = exitP(frame, Q - 8, 12);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
      <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
      <SceneTitle label="THE PROBLEM" color={U.c} at={2} />
      {CROWD.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x, top: d.y, width: 12, height: 12, borderRadius: 6, background: d.pick && pick > 0.5 ? U.c : alpha(C.text, 0.25), transform: `scale(${d.pick ? 1 + pick * 0.5 : 1})`, boxShadow: d.pick && pick > 0.5 ? `0 0 8px ${U.c}` : "none", opacity: ease(frame, [2 + (i % 20), 12 + (i % 20)], [0, 1]) }} />
      ))}
      <Pop at={s.cueS(0, "Millions") - 4} x={300} y={790} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>MILLIONS OF VOTERS</div>
      </Pop>
      <Pop at={PICK} x={780} y={790} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: U.c }}>ASK 1,000 AT RANDOM</div>
      </Pop>
      {/* raw data: two bars */}
      <div style={{ position: "absolute", left: 300, top: 1150 - 220 * bars * 0.52, width: 160, height: 220 * bars * 0.52, borderRadius: "14px 14px 0 0", background: alpha(U.c, 0.75), border: `2px solid ${U.c}` }} />
      <div style={{ position: "absolute", left: 520, top: 1150 - 220 * bars * 0.48, width: 160, height: 220 * bars * 0.48, borderRadius: "14px 14px 0 0", background: alpha(C.text, 0.35), border: `2px solid ${alpha(C.text, 0.6)}` }} />
      <div style={{ position: "absolute", left: 300, top: 1160, width: 160, textAlign: "center", opacity: bars, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: U.c }}>YES</div>
      <div style={{ position: "absolute", left: 520, top: 1160, width: 160, textAlign: "center", opacity: bars, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.dim }}>NO</div>
      <Pop at={s.cueS(1, "yes") - 6} x={540} y={870} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>EACH PERSON: YES OR NO</div>
      </Pop>
      <Pop at={s.cueS(1, "bell") - 6} x={830} y={1060} from="scale" scaleFrom={0.6}>
        <div style={{ position: "relative" }}>
          <CurveIcon color={C.dim} f={(x) => Math.exp(-((x - 0.5) ** 2) / 0.03)} w={150} h={80} />
          <div style={{ position: "absolute", left: -10, right: -10, top: 36, height: 7, borderRadius: 4, background: C.red, transform: "rotate(-14deg)" }} />
        </div>
      </Pop>
      <Pop at={s.cueS(1, "bell") + 4} x={540} y={1260} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={C.red} size={28}>
          THE RAW DATA IS NOT A BELL CURVE
        </Tag>
      </Pop>
      </AbsoluteFill>
      ) : null}
      {/* the big question */}
      <Pop at={Q} x={540} y={640} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 76, color: U.c }}>1,000 ANSWERS</div>
          <div style={{ fontSize: 40, color: C.dim, margin: "12px 0" }}>CAN TELL US ABOUT</div>
          <div style={{ fontSize: 76, color: C.text }}>MILLIONS<span style={{ color: C.yellow }}>?</span></div>
        </div>
      </Pop>
      <Pop at={s.cueS(2, "step") - 4} x={540} y={1000} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", gap: 14 }}>
          {[1, 2, 3, 4, 5].map((k) => (
            <div key={k} style={{ width: 70, height: 70, borderRadius: 35, background: alpha(C.yellow, 0.15), border: `3px solid ${C.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, transform: `translateY(${-10 * Math.max(0, Math.sin((frame - s.cueS(2, "step")) / 5 - k))}px)` }}>{k}</div>
          ))}
        </div>
      </Pop>
      <Pop at={s.cueS(2, "step") + 6} x={540} y={1100} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.yellow }}>STEP BY STEP</div>
      </Pop>
    </AbsoluteFill>
  );
};

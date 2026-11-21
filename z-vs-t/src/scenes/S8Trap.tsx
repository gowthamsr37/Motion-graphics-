// SCENE 8 — INTERVIEW TRAP. "USE z WHEN n > 30" big, stamped RULE OF THUMB; the real question DO YOU KNOW σ?; IN PRACTICE
// YOU RARELY DO → t IS THE DEFAULT; then BIG n: s ≈ σ → z WORKS AS AN APPROXIMATION.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle, Stamp } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Sigma } from "../components/ZKit";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Trap: React.FC = () => {
  const s = useScene("s8");
  const THUMB = s.cueS(0, "thumb,");
  return (
    <AbsoluteFill>
      <SceneTitle label="INTERVIEW TRAP" color={C.red} at={2} />
      <Pop at={s.sent(0).from + 4} x={540} y={500} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ padding: "20px 40px", borderRadius: 28, background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(C.text, 0.3)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          &ldquo;USE <span style={{ color: ZC }}>z</span> WHEN n &gt; 30&rdquo;
        </div>
      </Pop>
      <Stamp at={THUMB - 6} x={540} y={620} color={C.red} size={38}>
        ONLY A RULE OF THUMB
      </Stamp>
      <Pop at={s.sent(1).from - 2} x={540} y={780} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          THE REAL QUESTION: DO YOU KNOW <Sigma size={54} color={C.yellow} />
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      <Pop at={s.cueS(1, "default.") - 8} x={540} y={890} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={TC} size={30}>
          IN PRACTICE YOU RARELY DO, SO t IS THE DEFAULT
        </Tag>
      </Pop>
      <Pop at={s.sent(2).from - 2} x={540} y={1040} from="up" dist={12}>
        <div style={{ padding: "14px 30px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(TL, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12 }}>
          BIG n: <span style={{ color: TC, fontStyle: "italic" }}>s</span> GETS CLOSE TO <Sigma size={42} color={ZC} />
        </div>
      </Pop>
      <Pop at={s.cueS(2, "approximation") - 6} x={540} y={1140} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: ZC, whiteSpace: "nowrap" }}>SO z WORKS AS AN APPROXIMATION</div>
      </Pop>
    </AbsoluteFill>
  );
};

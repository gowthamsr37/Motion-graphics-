// SCENE 6 — WHO'S RIGHT? A number line 1.9–2.4 with the |t| = 2 line (violet); cut-offs drop in: df 8 2.306, df 30 2.042
// (above 2 → FAIL), df 60 2.000, df 100 1.984, z 1.96 (at or below 2 → REJECT from df > 60); then 9 BOTTLES (df 8): FAIL TO
// REJECT · 100 BOTTLES (df 99): REJECT · BOTH TESTS WERE RIGHT FOR WHAT THEY KNEW.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { SEc, TC, TL, ZC } from "../components/ZT";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const X0 = 130, X1 = 950, V0 = 1.92, V1 = 2.36, Y = 900;
const px = (v: number) => X0 + ((v - V0) / (V1 - V0)) * (X1 - X0);

export const S6Puzzle: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const S0 = s.sent(0).from;
  const SIXTY = s.cueS(0, "60");
  const cuts = [
    { v: 2.306, l: "df 8", c: SEc },
    { v: 2.042, l: "df 30", c: SEc },
    { v: 2.0, l: "df 60", c: C.yellow },
    { v: 1.984, l: "df 100", c: TL },
    { v: 1.96, l: "z", c: TL },
  ];
  const line = ease(frame, [S0, S0 + 20], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="WHO'S RIGHT?" color={C.yellow} at={2} />
      <div style={{ position: "absolute", left: X0, top: Y, width: (X1 - X0) * line, height: 6, borderRadius: 3, background: alpha(C.text, 0.4) }} />
      {[1.95, 2.0, 2.1, 2.2, 2.3].map((v) => (
        <div key={v} style={{ position: "absolute", left: px(v), top: Y + 24, transform: "translateX(-50%)", opacity: line, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim }}>{v === 1.95 ? "1.95" : v.toFixed(1)}</div>
      ))}
      <div style={{ position: "absolute", left: px(2) - 4, top: Y - 470, width: 8, height: 500 * line, borderRadius: 4, background: TC, boxShadow: `0 0 18px ${TC}` }} />
      <div style={{ position: "absolute", left: px(2), top: Y - 520, transform: "translateX(-50%)", opacity: line, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: TC, whiteSpace: "nowrap", textShadow: glowText(TC, 0.5) }}>OUR SCORE: 2</div>
      {cuts.map((k, i) => {
        const p = spr(S0 + 20 + i * 12, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const yy = Y - 90 - [0, 64, 128, 192, 256][i];
        return (
          <div key={k.l} style={{ position: "absolute", left: px(k.v), top: yy, transform: `translateX(-50%) scale(${Math.min(1.1, p)})`, transformOrigin: "center top", opacity: Math.min(1, p * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ padding: "4px 12px", borderRadius: 10, background: "rgba(10,18,52,0.97)", border: `2px solid ${k.c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>
              {k.l} · {k.v === 2 ? "2.000" : k.v}
            </div>
            <div style={{ width: 3, height: Y - yy - 36, background: k.c }} />
          </div>
        );
      })}
      <Pop at={SIXTY - 4} x={540} y={1000} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          2 BEATS THE CUT-OFF ONLY WHEN df &gt; <span style={{ color: C.yellow }}>60</span>
        </div>
      </Pop>
      {[
        { y: 1090, at: s.cueS(1, "9"), t: <>9 BOTTLES (df 8): <span style={{ color: SEc }}>FAIL TO REJECT</span></>, c: SEc },
        { y: 1170, at: s.cueS(1, "100"), t: <>100 BOTTLES (df 99): <span style={{ color: TL }}>REJECT</span></>, c: TL },
      ].map((r, i) => (
        <Pop key={i} at={r.at - 4} x={540} y={r.y} from="left" dist={30} cfg={theme.spring.bouncy}>
          <div style={{ padding: "10px 28px", borderRadius: 18, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(r.c, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>{r.t}</div>
        </Pop>
      ))}
      <Pop at={s.cueS(1, "Both") - 4} x={540} y={1265} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Tag color={ZC} size={30}>
          BOTH WERE RIGHT, FOR WHAT THEY KNEW
        </Tag>
      </Pop>
      <Pop at={s.sent(2).from - 2} x={540} y={1335} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>t WAS MORE CAREFUL: 9 BOTTLES CAN&apos;T PIN DOWN THE SPREAD</div>
      </Pop>
    </AbsoluteFill>
  );
};

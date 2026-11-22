// SCENE 7 — UNSUPERVISED, MORE USES. Panel 1, ANOMALY DETECTION: a list of card payments (amount · time · place); the
// odd one (Rs 48,000 · 3:07 AM · abroad) gets a red ring and an ODD ONE OUT tag as it is said. Panel 2, WHAT GOES
// TOGETHER: BREAD + BUTTER chips joined by a link, "bought together" (how "frequently bought together" works).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Card, Cart } from "../components/Doodles";
import { Icon, Panel, Pill, Pop, T2, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const PAYS = [
  ["Rs 450", "1:12 PM", "Pune"],
  ["Rs 1,200", "7:40 PM", "Pune"],
  ["Rs 48,000", "3:07 AM", "abroad"],
  ["Rs 260", "9:15 AM", "Pune"],
];

export const S7Uses: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const ODD = s.cueS(0, "odd");
  const CARD = s.cueS(0, "card");
  const AN = s.cueS(0, "anomaly");
  const TOG = s.sent(1).from;
  const BREAD = s.cueS(1, "bread");
  const BUT = s.cueS(1, "butter");
  const flag = ease(frame, [s.cueS(0, "three") - 2, s.cueS(0, "three") + 8], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Txt size={34} color={T2} font="body" style={{ letterSpacing: "0.2em" }}>UNSUPERVISED ALSO…</Txt>
      </Pop>
      <Pop x={540} y={590} at={ODD - 6}>
        <Panel w={960} h={560} color={T2} style={{ justifyContent: "flex-start", paddingTop: 30, gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Icon size={80}>
              <Card x={40} y={40} s={80} at={CARD - 4} />
            </Icon>
            <Txt size={40}>flags the odd one out</Txt>
          </div>
          {PAYS.map((p, i) => {
            const odd = i === 2;
            return (
              <div key={i} style={{ width: 820, height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", boxSizing: "border-box", borderRadius: 16, background: odd ? alpha(C.red, 0.14 * flag) : "rgba(255,255,255,0.04)", border: `3px solid ${odd ? alpha(C.red, flag) : "rgba(150,180,255,0.18)"}`, boxShadow: odd ? `0 0 ${24 * flag}px ${alpha(C.red, 0.6)}` : undefined, opacity: ease(frame, [CARD + i * 4, CARD + i * 4 + 6], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 34, color: C.text }}>
                <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, width: 230 }}>{p[0]}</span>
                <span style={{ width: 200 }}>{p[1]}</span>
                <span style={{ width: 160, textAlign: "right" }}>{p[2]}</span>
              </div>
            );
          })}
          <div style={{ opacity: ease(frame, [AN - 4, AN + 4], [0, 1]), marginTop: 6 }}>
            <Pill color={T2} size={34} solid>ANOMALY DETECTION</Pill>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1145} at={TOG - 6}>
        <Panel w={960} h={330} color={C.green} style={{ gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Icon size={70}>
              <Cart x={35} y={35} s={70} at={TOG - 4} />
            </Icon>
            <Txt size={40}>finds what goes together</Txt>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ opacity: ease(frame, [BREAD - 2, BREAD + 4], [0, 1]) }}>
              <Pill color={C.orange} size={40}>BREAD</Pill>
            </div>
            <div style={{ width: 160 * ease(frame, [BUT - 6, BUT + 6], [0, 1]), height: 6, background: C.green, boxShadow: `0 0 12px ${C.green}`, margin: "0 10px" }} />
            <div style={{ opacity: ease(frame, [BUT - 2, BUT + 4], [0, 1]) }}>
              <Pill color={C.yellow} size={40}>BUTTER</Pill>
            </div>
          </div>
          <Txt size={30} font="body" color={C.dim} style={{ opacity: ease(frame, [BUT + 8, BUT + 14], [0, 1]) }}>&quot;frequently bought together&quot;</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

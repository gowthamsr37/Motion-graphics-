// SCENE 5 — THE CATCH: labels are expensive. THE CATCH pill; "Labels cost time + money"; a person tagging a stream of
// items (email, scan, card payment) — each item gets a tag as it is named; a counter of hand-made labels races up.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Card, Envelope, Person } from "../components/Doodles";
import { Icon, Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Scan: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <rect x={18} y={8} width={64} height={84} rx={8} fill="rgba(243,247,255,0.12)" stroke={C.text} strokeWidth={4} />
    <path d="M50 22 C38 30 36 44 40 56 C44 70 56 70 60 56 C64 44 62 30 50 22 Z" fill="none" stroke={C.cyan} strokeWidth={4} />
    <path d="M50 30 V70" stroke={C.cyan} strokeWidth={3} />
  </svg>
);

export const S5Catch: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const EXP = s.cueS(0, "expensive.");
  const items = [
    { at: s.cueS(0, "email,"), t: "NOT SPAM", c: C.green, el: <Icon size={110}><Envelope x={55} y={55} s={110} at={-50} /></Icon> },
    { at: s.cueS(0, "scan,"), t: "TUMOUR", c: C.red, el: <Scan s={110} /> },
    { at: s.cueS(0, "transaction."), t: "FRAUD", c: C.orange, el: <Icon size={110}><Card x={55} y={55} s={110} at={-50} /></Icon> },
  ];
  const T = s.cueS(0, "tag");
  const n = Math.round(ease(frame, [T, s.duration - 6], [0, 50000]));
  return (
    <AbsoluteFill>
      <Pop x={540} y={290} at={2}>
        <Pill color={C.red} size={44}>THE CATCH</Pill>
      </Pop>
      <Pop x={540} y={430} at={EXP - 6}>
        <Txt size={70}>
          Labels are <span style={{ color: C.red }}>expensive</span>
        </Txt>
      </Pop>
      <Pop x={170} y={800} at={T - 6}>
        <Icon size={200}>
          <Person x={100} y={100} s={190} at={T - 6} />
        </Icon>
      </Pop>
      {items.map((it, i) => (
        <Pop key={it.t} x={640} y={610 + i * 200} at={it.at - 6}>
          <Panel w={600} h={170} color={it.c} style={{ flexDirection: "row", gap: 30, justifyContent: "flex-start", padding: "0 30px" }}>
            {it.el}
            <div style={{ transform: `scale(${ease(frame, [it.at + 6, it.at + 12], [1.6, 1])}) rotate(-4deg)`, opacity: ease(frame, [it.at + 6, it.at + 10], [0, 1]), padding: "8px 22px", borderRadius: 12, background: it.c, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.ink, boxShadow: `0 0 20px ${alpha(it.c, 0.6)}` }}>{it.t}</div>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={1260} at={T}>
        <Txt size={46} font="mono" color={C.yellow}>
          {n.toLocaleString("en-IN")} <span style={{ color: C.text, fontFamily: theme.fonts.body, fontSize: 36 }}>labels, by hand</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};

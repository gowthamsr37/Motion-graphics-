// SCENE 9 — REAL LIFE. NOT JUST A PARTY TRICK; the BIRTHDAY ATTACK panel: two different files → the same short
// fingerprint (hash) → a lock breaking, "that's why passwords and banks use very long codes"; then CLASS OF 60 → 99.4%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const File: React.FC<{ label: string; c: string }> = ({ label, c }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <svg width={90} height={110} viewBox="0 0 90 110">
      <path d="M8 6 H58 L82 30 V104 H8 Z" fill={alpha(c, 0.2)} stroke={c} strokeWidth={4} />
      <path d="M58 6 V30 H82" fill="none" stroke={c} strokeWidth={4} />
      {[46, 62, 78].map((y) => (
        <line key={y} x1={20} y1={y} x2={70} y2={y} stroke={c} strokeWidth={4} opacity={0.7} />
      ))}
    </svg>
    <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.text }}>{label}</span>
  </div>
);

export const S9Real: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const HACK = s.cueS(1, "Hackers");
  const FP = s.cueS(1, "fingerprint");
  const LONG = s.cueS(1, "passwords");
  const C60 = s.sent(2).from;
  const P = s.cueS(2, "99.4%");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={56}>
          not just a <span style={{ color: HOT }}>party trick</span>
        </Txt>
      </Pop>
      <Pop x={540} y={620} at={HACK - 6}>
        <Panel w={960} h={560} color={C.red} style={{ justifyContent: "flex-start", paddingTop: 30 }}>
          <Pill color={C.red} size={34} solid>THE BIRTHDAY ATTACK</Pill>
          <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 20 }}>
            <File label="file A" c={C.cyan} />
            <File label="file B" c={C.violet} />
            <Txt size={50} color={C.dim}>→</Txt>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: ease(frame, [FP - 4, FP + 6], [0, 1]) }}>
              {["a3f9", "a3f9"].map((h, i) => (
                <div key={i} style={{ padding: "8px 22px", borderRadius: 12, background: alpha(C.red, 0.18), border: `3px solid ${C.red}`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 40, color: C.text }}>{h}</div>
              ))}
              <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.red, textAlign: "center" }}>same fingerprint!</span>
            </div>
          </div>
          <div style={{ marginTop: 26, opacity: ease(frame, [LONG - 4, LONG + 6], [0, 1]), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Txt size={32} font="body">so passwords and banks use very long codes:</Txt>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: C.green }}>9f2c…e71b04d8a6 (64 characters)</div>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1130} at={C60 - 4}>
        <Panel w={960} h={200} color={HOT} style={{ flexDirection: "row", gap: 30 }}>
          <Txt size={46}>a class of 60 students</Txt>
          <Txt size={80} color={HOT} glow style={{ opacity: ease(frame, [P - 6, P + 2], [0, 1]) }}>99.4%</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

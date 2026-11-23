// SCENE 4 — ONE NIGHT vs MILLIONS OF SPINS. Left: YOU · ONE NIGHT, five spins land W W W W W, "home rich!" (pure luck);
// right: THE CASINO · MILLIONS OF SPINS, a spin counter racing past 1 crore over a field of tiny dots; then
// "over millions of spins, luck stops mattering".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S4Many: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const FIVE = s.cueS(0, "five");
  const RICH = s.cueS(0, "rich.");
  const CAS = s.sent(1).from;
  const MIL = s.cueS(1, "millions", 0);
  const LUCK = s.cueS(1, "luck");
  const spins = Math.round(ease(frame, [MIL, s.duration - 10], [0, 12000000], (t) => t * t));
  return (
    <AbsoluteFill>
      <Pop x={290} y={640} at={s.sent(0).from - 4}>
        <Panel w={470} h={680} color={C.yellow} style={{ justifyContent: "flex-start", paddingTop: 34 }}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.16em" }}>YOU</Txt>
          <Txt size={50}>ONE NIGHT</Txt>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const at = FIVE - 4 + i * 5;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ease(frame, [at, at + 5], [0, 1]), transform: `translateX(${(1 - ease(frame, [at, at + 6], [0, 1])) * -30}px)` }}>
                  <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.dim, width: 110 }}>spin {i + 1}</span>
                  <span style={{ padding: "4px 18px", borderRadius: 10, background: C.green, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.ink }}>WIN</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24, opacity: ease(frame, [RICH - 2, RICH + 6], [0, 1]) }}>
            <Txt size={40} color={C.yellow} glow>pure luck</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={790} y={640} at={CAS - 4}>
        <Panel w={470} h={680} color={C.green} style={{ justifyContent: "flex-start", paddingTop: 34 }}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.16em" }}>THE CASINO</Txt>
          <Txt size={50}>MILLIONS</Txt>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 14px)", gap: 7, marginTop: 24 }}>
            {Array.from({ length: 16 * 14 }, (_, i) => {
              const on = ease(frame, [MIL + (i % 37) * 0.6 + Math.floor(i / 16) * 2, MIL + 4 + (i % 37) * 0.6 + Math.floor(i / 16) * 2], [0, 1]);
              return <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: (i * 7) % 37 < 18 ? alpha("#EF4444", on) : (i * 7) % 37 === 0 ? alpha(C.green, on) : alpha(C.text, 0.7 * on) }} />;
            })}
          </div>
          <div style={{ marginTop: 22 }}>
            <Txt size={38} font="mono" color={C.green}>{spins.toLocaleString("en-IN")}</Txt>
          </div>
          <Txt size={26} color={C.dim} font="body">spins a year</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1090} at={LUCK - 6}>
        <Txt size={42} font="body">over millions of spins,</Txt>
      </Pop>
      <Pop x={540} y={1160} at={LUCK - 2}>
        <Txt size={60} color={C.red} glow>luck stops mattering</Txt>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 9 — THE GAMBLER'S FALLACY. Five red results in a row; "BLACK IS DUE?" — struck out; the wheel with NO MEMORY
// stamp and "every spin: still 48.6%"; then the old 5 reds shown as a tiny red speck in a sea of new spins
// (they are drowned out, not corrected); GAMBLER'S FALLACY pill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RED, Wheel } from "../components/Casino";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S9Fallacy: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const TRAP = s.cueS(0, "trap.");
  const FIVE = s.cueS(0, "five");
  const DUE = s.cueS(0, "due.");
  const ISNT = s.sent(1).from;
  const MEM = s.cueS(1, "memory.");
  const STILL = s.cueS(1, "still");
  const DROWN = s.sent(2).from;
  const NEW = s.cueS(2, "new");
  const FAL = s.cueS(2, "fallacy.");
  const part1 = 1 - ease(frame, [DROWN - 8, DROWN + 2], [0, 1]);
  const sea = ease(frame, [NEW - 20, NEW + 30], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={TRAP - 6}>
        <Pill color={C.red} size={40}>THE TRAP</Pill>
      </Pop>
      {part1 > 0 ? (
        <AbsoluteFill style={{ opacity: part1 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 18 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: "#FFFFFF", opacity: ease(frame, [FIVE + i * 4, FIVE + i * 4 + 5], [0, 1]), transform: `scale(${ease(frame, [FIVE + i * 4, FIVE + i * 4 + 6], [0.5, 1])})`, boxShadow: `0 0 20px ${alpha(RED, 0.5)}` }}>RED</div>
            ))}
          </div>
          <Pop x={540} y={580} at={DUE - 8}>
            <div style={{ position: "relative" }}>
              <Txt size={78}>
                BLACK IS <span style={{ color: C.yellow }}>DUE?</span>
              </Txt>
              <div style={{ position: "absolute", left: -14, right: -14, top: "52%", height: 9, borderRadius: 5, background: C.red, transform: `scaleX(${ease(frame, [ISNT - 2, ISNT + 8], [0, 1])}) rotate(-4deg)`, transformOrigin: "left center" }} />
            </div>
          </Pop>
          <Pop x={360} y={920} at={ISNT + 4}>
            <Wheel r={170} rot={frame * 3} />
          </Pop>
          <Pop x={800} y={860} at={MEM - 6}>
            <div style={{ transform: "rotate(-8deg)" }}>
              <Pill color={C.yellow} size={44} solid>NO MEMORY</Pill>
            </div>
          </Pop>
          <Pop x={800} y={990} at={STILL - 4}>
            <Txt size={40} font="body">
              every spin: <span style={{ color: RED }}>48.6%</span>
            </Txt>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= DROWN - 8 ? (
        <AbsoluteFill style={{ opacity: ease(frame, [DROWN - 4, DROWN + 6], [0, 1]) }}>
          <Pop x={540} y={380} at={DROWN}>
            <Txt size={44}>
              not corrected: <span style={{ color: C.cyan }}>drowned out</span>
            </Txt>
          </Pop>
          <div style={{ position: "absolute", left: 140, top: 470, width: 800, height: 640, display: "grid", gridTemplateColumns: "repeat(40, 1fr)", gap: 4 }}>
            {Array.from({ length: 40 * 32 }, (_, i) => {
              const old = i < 5;
              const show = old ? 1 : ease(sea, [i / 1280 - 0.05, i / 1280], [0, 1]);
              const col = old ? RED : (i * 13) % 37 === 0 ? alpha(C.green, 0.5) : (i * 13) % 37 < 19 ? alpha(C.text, 0.22) : alpha(C.text, 0.4);
              return <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: col, opacity: show, boxShadow: old ? `0 0 14px ${RED}, 0 0 4px #fff` : undefined, transform: old ? "scale(1.5)" : undefined }} />;
            })}
          </div>
          <div style={{ position: "absolute", left: 140, top: 1120, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.dim }}>
            <span style={{ color: RED }}>●</span> the 5 old reds &nbsp;·&nbsp; <span style={{ color: alpha(C.text, 0.6) }}>●</span> millions of new spins
          </div>
          <Pop x={540} y={1260} at={FAL - 6}>
            <Pill color={C.red} size={48} solid>THE GAMBLER&apos;S FALLACY</Pill>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

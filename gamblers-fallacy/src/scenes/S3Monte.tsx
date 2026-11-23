// SCENE 3 — MONTE CARLO, 1913: a sepia "MONTE CARLO · 1913" card and the wheel; black results pile up in a grid
// (counter); at 10 the crowd's speech bubble "RED IS DUE!" with chips flying onto red; the streak runs to 26;
// "GAMBLERS LOST MILLIONS · THE CASINO WON".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip, RED, Wheel } from "../components/Casino";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { Ball } from "./Bits";

const C = theme.colors;

export const S3Monte: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const B0 = s.cueS(0, "black.");
  const TEN = s.sent(1).from;
  const DUE = s.cueS(1, "due.");
  const P26 = s.cueS(2, "26");
  const LOST = s.cueS(2, "lost");
  const n = Math.min(26, Math.floor(ease(frame, [B0, P26 + 6], [1, 26.99], (t) => t)));
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <div style={{ padding: "12px 34px", borderRadius: 14, background: "#E9D8B4", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: "#3B2A12", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>MONTE CARLO · 1913</div>
      </Pop>
      <Pop x={260} y={500} at={s.sent(0).from}>
        <Wheel r={150} rot={frame * 2} ball={frame * -6} />
      </Pop>
      <div style={{ position: "absolute", left: 460, top: 370, width: 560, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {Array.from({ length: 26 }, (_, i) => (
          <Ball key={i} c="B" size={56} p={i < n ? 1 : 0} />
        ))}
      </div>
      <Pop x={740} y={740} at={B0}>
        <Txt size={64} font="mono">
          {n} <span style={{ fontFamily: theme.fonts.body, fontSize: 36, color: C.dim }}>blacks in a row</span>
        </Txt>
      </Pop>
      <Pop x={540} y={900} at={DUE - 6}>
        <div style={{ position: "relative", padding: "20px 40px", borderRadius: 30, background: "#FFFFFF", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: RED }}>
          &quot;RED IS DUE!&quot;
        </div>
      </Pop>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = ease(frame, [TEN + 20 + i * 8, TEN + 40 + i * 8], [0, 1]);
        return t > 0 ? (
          <div key={i} style={{ position: "absolute", left: 160 + i * 130, top: 1060 - t * 40, opacity: t }}>
            <Chip size={80} color={RED} label="BET" />
          </div>
        ) : null;
      })}
      <Pop x={540} y={1230} at={LOST - 4}>
        <Pill color={C.red} size={40} solid>GAMBLERS LOST MILLIONS</Pill>
      </Pop>
      <Pop x={540} y={1330} at={s.cueS(2, "casino") - 2}>
        <Txt size={42} color={C.green} glow>the casino won</Txt>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 6 — THE SAMPLE STANDARD DEVIATION. The 9-bottle worksheet fills row by row on the spoken squares (25 9 1 1 0
// 1 1 9 25), SUM 72, then 72 ÷ 8 = 9 and √9 = 3: s = 3.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Radical } from "../components/Clt";
import { Pop } from "../components/Motion";
import { StepTracker, VarSheet } from "../components/TKit";
import { MEAN, SE } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const X = [193, 195, 197, 197, 198, 199, 199, 201, 203];

export const S6S: React.FC = () => {
  const s = useScene("s6");
  const rows = [s.cueS(0, "25", 0), s.cueS(0, "9", 0), s.cueS(0, "1", 0), s.cueS(0, "1", 1), s.cueS(0, "0"), s.cueS(0, "1", 2), s.cueS(0, "1", 3), s.cueS(0, "9", 1), s.cueS(0, "25", 1)];
  const VAR = s.cueS(1, "9.");
  const S3 = s.cueS(1, "3", 1);
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={s.sent(0).from - 2} x={540} y={400} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>
          FIRST, <span style={{ color: SE }}>s</span>: THE SAMPLE STANDARD DEVIATION
        </div>
      </Pop>
      <VarSheet x={540} y={440} vals={X} mean={198} c={MEAN} label="9 BOTTLES (ml)" rowAt={rows} sumAt={s.cueS(0, "72.")} divAt={VAR} unit="ml" rowH={42} res={<>72 ÷ 8 = <span style={{ color: SE }}>9</span></>} />
      <Pop at={S3 - 6} x={540} y={1260} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 36px", borderRadius: 999, background: alpha(SE, 0.2), border: `3px solid ${SE}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.display, fontStyle: "italic", color: SE }}>s</span> =
          <Radical color={C.text} size={44}>
            9
          </Radical>
          = <span style={{ color: SE, textShadow: glowText(SE, 0.6) }}>3</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

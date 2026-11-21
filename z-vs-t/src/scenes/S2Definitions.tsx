// SCENE 2 — THE TEXTBOOK DEFINITIONS, side by side: z-TEST (σ KNOWN) and t-TEST (σ UNKNOWN, ESTIMATED FROM THE SAMPLE).
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Sigma } from "../components/ZKit";
import { Split, TC, TL, ZC } from "../components/ZT";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const body = (txt: React.ReactNode) => <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, lineHeight: 1.35, color: C.text, textAlign: "center" }}>{txt}</div>;

export const S2Definitions: React.FC = () => {
  const s = useScene("s2");
  return (
    <AbsoluteFill>
      <SceneTitle label="THE TEXTBOOK DEFINITIONS" color={C.yellow} at={2} />
      <Split
        y={420}
        h={560}
        at={s.sent(1).from}
        atR={s.sent(2).from}
        left={body(<>Compares a sample mean with a population mean, when the population standard deviation is <span style={{ color: ZC, fontWeight: 800 }}>KNOWN</span>.</>)}
        right={body(<>Does the same, when it is <span style={{ color: TC, fontWeight: 800 }}>UNKNOWN</span> and has to be <span style={{ color: TL, fontWeight: 800 }}>estimated from the sample</span>.</>)}
      />
      <Pop at={s.cueS(1, "known.") - 4} x={305} y={1060} from="up" dist={12} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text }}>
          <Sigma size={56} color={ZC} /> <span style={{ color: ZC, textShadow: glowText(ZC, 0.5) }}>KNOWN</span>
        </div>
      </Pop>
      <Pop at={s.cueS(2, "unknown") - 4} x={775} y={1060} from="up" dist={12} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text }}>
          <Sigma size={56} color={TC} /> <span style={{ color: TC, textShadow: glowText(TC, 0.5) }}>UNKNOWN</span>
        </div>
      </Pop>
      <Pop at={s.sent(2).to} x={540} y={1190} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>THAT ONE DIFFERENCE CHANGES EVERYTHING</div>
      </Pop>
    </AbsoluteFill>
  );
};

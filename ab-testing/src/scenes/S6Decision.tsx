// SCENE 6 — THE DECISION. p = 0.03 < 0.05 → REJECT THE NULL. ORANGE WINS: 8% → 9.2% is a 15% lift in purchases
// (9.2 / 8 = 1.15) → SHIP IT!
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BC, Phone, PLess } from "../components/AB";
import { Crown } from "../components/Icons";
import { SceneTitle, Stamp } from "../components/Kit";
import { Burst, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S6Decision: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s6");
  const REJ = s.cueS(0, "reject");
  const WINS = s.sent(1).from;
  const LIFT = s.cueS(1, "15%");
  const SHIP = s.cueS(1, "Ship");
  const ph = spr(WINS - 4, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DECISION" color={C.green} at={2} />
      <Pop at={4} x={540} y={420} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <PLess v="0.03" size={60} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text }}>&lt;</span>
          <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 60, color: C.green, textShadow: glowText(C.green, 0.5) }}>0.05</span>
        </div>
      </Pop>
      <Pop at={REJ - 4} x={540} y={540} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 28px", borderRadius: 999, background: alpha(C.green, 0.18), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.green }}>REJECT</span> THE NULL
        </div>
      </Pop>
      {ph > 0.001 ? (
        <div style={{ position: "absolute", left: 360, top: 1010, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, ph), [0, 1], [0.5, 1])})`, opacity: Math.min(1, ph * 2) }}>
          <div style={{ position: "absolute", left: 135 - 45, top: -108 }}>
            <Crown size={90} color={C.yellow} />
          </div>
          <Phone color={BC} w={270} glow={1} />
        </div>
      ) : null}
      <Burst at={WINS + 2} x={360} y={880} color={BC} count={18} radius={260} seed={6} />
      <Pop at={WINS + 2} x={770} y={820} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: C.text, textAlign: "center", whiteSpace: "nowrap" }}>
          <span style={{ color: BC, textShadow: glowText(BC, 0.5) }}>ORANGE</span>
          <br />
          WINS
        </div>
      </Pop>
      <Pop at={LIFT - 4} x={770} y={1000} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 72, color: C.text, textShadow: glowText(BC, 0.5) }}>+15%</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>PURCHASES (8% TO 9.2%)</div>
        </div>
      </Pop>
      <Stamp at={SHIP - 2} x={770} y={1190} color={C.green} rot={-8} size={56}>
        SHIP IT!
      </Stamp>
    </AbsoluteFill>
  );
};

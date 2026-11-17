// SCENE 6 — WHERE IT SHOWS UP + A DATA SCIENCE TIP. Four chips (incomes, house prices, time to finish a task, stock
// prices), then the tip card: skewed data → take the log → a bell; many models work better on a bell.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CurveIcon } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { bell, skew } from "./S2Definition";
import { GROW, LOG, RAW, ZERO } from "./S1Hook";

const C = theme.colors;
const CHIPS = [
  { t: "INCOMES", tok: "incomes,", c: ZERO, x: 300, y: 520 },
  { t: "HOUSE PRICES", tok: "house", c: RAW, x: 780, y: 520 },
  { t: "TIME TO FINISH A TASK", tok: "time", c: LOG, x: 300, y: 640 },
  { t: "STOCK PRICES", tok: "stock", c: GROW, x: 780, y: 640 },
];

export const S6Uses: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s6");
  const TIP = s.sent(1).from;
  const TAKE = s.cueS(1, "take");
  const MODELS = s.cueS(1, "models");
  const card = spr(TIP - 4, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneTitle label="WHERE IT SHOWS UP" color={LOG} at={2} />
      {CHIPS.map((c) => {
        const p = spr(s.cueS(0, c.tok) - 8, theme.spring.bouncy);
        if (p <= 0.01) return null;
        return (
          <div key={c.t} style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, background: alpha(c.c, 0.15), border: `3px solid ${c.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: c.t.length > 14 ? 24 : 30, color: C.text, whiteSpace: "nowrap" }}>
            <CurveIcon color={c.c} f={skew} w={54} h={28} />
            {c.t}
          </div>
        );
      })}
      {card > 0.001 ? (
        <div style={{ position: "absolute", left: 90, top: 760, width: 900, height: 440, transform: `scale(${interpolate(Math.min(1, card), [0, 1], [0.85, 1])})`, opacity: Math.min(1, card * 2), boxSizing: "border-box", borderRadius: 32, background: `linear-gradient(180deg, ${alpha(GROW, 0.16)}, rgba(14,24,64,0.94))`, border: `3px solid ${GROW}`, boxShadow: `0 0 30px ${alpha(GROW, 0.3)}` }} />
      ) : null}
      <Pop at={TIP - 2} x={540} y={810} from="up" dist={10} cfg={theme.spring.bouncy}>
        <Pill label="DATA SCIENCE TIP" color={GROW} size={30} glow={0.5} />
      </Pop>
      <Pop at={TIP + 6} x={260} y={960} from="scale" scaleFrom={0.5}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <CurveIcon color={RAW} f={skew} w={200} h={110} />
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: RAW }}>SKEWED DATA</div>
        </div>
      </Pop>
      <Pop at={TAKE - 4} x={540} y={950} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: GROW, textShadow: glowText(GROW, 0.5), whiteSpace: "nowrap" }}>TAKE THE LOG</div>
          <Arrow size={70} color={GROW} />
        </div>
      </Pop>
      <Pop at={TAKE + 8} x={820} y={960} from="scale" scaleFrom={0.5}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <CurveIcon color={LOG} f={bell} w={200} h={110} />
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: LOG }}>A BELL</div>
        </div>
      </Pop>
      <Pop at={MODELS - 4} x={540} y={1130} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
          MANY MODELS WORK <span style={{ color: GROW }}>BETTER</span> ON A BELL
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

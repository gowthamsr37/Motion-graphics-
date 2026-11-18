// SCENE 6 — THE TRADE-OFF. Both curves with the threshold. Stricter test: the threshold slides right (1.645 → 2.326):
// false alarms 5% → 1%, misses 20% → 43%. More data: both curves narrow (the standard error halves with 4× the data;
// threshold 1.163 keeps alpha at 1%) → misses fall to 0.4%. Live ALPHA / BETA chips.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx } from "../components/Curve";
import { alphaAt, betaAt, ErrCurves, OKC, pct, T1C, T2C } from "../components/Errors";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { Chip, CurveLabel, CUT, G } from "./S5Alpha";

const C = theme.colors;
const STRICT = 2.326;
const NARROW_CUT = 1.163;

export const S6Tradeoff: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const STR = s.cueS(1, "stricter,");
  const FEWER = s.cueS(1, "fewer");
  const MORE = s.cueS(1, "more");
  const BOTH = s.cueS(2, "both?");
  const DATA = s.cueS(2, "Collect");
  const slide = ease(frame, [STR - 4, STR + 26], [0, 1], theme.ease.inOut);
  const narrow = ease(frame, [DATA - 4, DATA + 30], [0, 1], theme.ease.inOut);
  const sd = 1 - 0.5 * narrow;
  const c = CUT + (STRICT - CUT) * slide + (NARROW_CUT - STRICT) * narrow;
  const a = alphaAt(c, sd);
  const b = betaAt(c, sd);
  const headOut = exitP(frame, DATA - 8, 10);
  const arrow = (at: number, up: boolean, color: string, x: number) => {
    const p = spr(at - 2, theme.spring.pop);
    const gone = exitP(frame, DATA - 4, 8);
    return p > 0.01 && gone < 1 ? (
      <div style={{ position: "absolute", left: x, top: 1070, transform: `translate(-50%, -50%) rotate(${up ? -90 : 90}deg) scale(${Math.min(1, p)})`, opacity: 1 - gone }}>
        <Arrow size={44} color={color} />
      </div>
    ) : null;
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="THE TRADE-OFF" color={T2C} at={2} />
      {headOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", opacity: (1 - headOut) * Math.min(1, spr(6, theme.spring.smooth) * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          {slide > 0.01 ? (
            <>
              STRICTER TEST: <span style={{ color: T1C, textShadow: glowText(T1C, 0.5) }}>THRESHOLD</span> MOVES
            </>
          ) : (
            <>
              ONE GOES DOWN, THE <span style={{ color: T2C, textShadow: glowText(T2C, 0.5) }}>OTHER</span> GOES UP
            </>
          )}
        </div>
      ) : null}
      <ErrCurves g={G} c={c} sd={sd} lineP={1} alphaP={1} betaP={1} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base + 1, width: G.x1 - G.x0 + 20, height: 4, background: alpha(C.text, 0.4) }} />
      <CurveLabel x={gx(G, c)} y={G.base - 360 - 26} p={1 - narrow} color={C.text}>
        THRESHOLD
      </CurveLabel>
      <Chip x={300} y={1070} p={1} color={T1C} name="ALPHA" value={pct(a)} sub="FALSE ALARMS" />
      <Chip x={780} y={1070} p={1} color={T2C} name="BETA" value={pct(b)} sub="MISSES" />
      {arrow(FEWER, false, T1C, 470)}
      {arrow(MORE, true, T2C, 950)}
      <Pop at={BOTH - 2} x={540} y={1220} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={OKC} size={30}>
          MORE DATA: FEWER OF BOTH
        </Tag>
      </Pop>
      <Pop at={DATA + 14} x={540} y={1300} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>4× THE DATA: NARROWER CURVES, LESS OVERLAP</div>
      </Pop>
    </AbsoluteFill>
  );
};

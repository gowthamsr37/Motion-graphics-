// SCENE 7 — PLUS OR MINUS 3%. Bell over the poll axis; the ±2 SE band (95%) fills; 2 × 1.6% ≈ 3%; bracket 49% … 55%; the
// headline 52% ± 3%; MARGIN OF ERROR = 95% CONFIDENCE INTERVAL.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, Geo, gx, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { bell, USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const G: Geo = { x0: 140, x1: 940, vmin: 46.5, vmax: 57.5, base: 1000, h: 330 };

export const S7Margin: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const P95 = s.cueS(0, "95%");
  const TWO = s.cueS(0, "2", 1);
  const SAY = s.cueS(1, "say");
  const RANGE = s.cueS(1, "between");
  const MOE = s.cueS(2, "margin");
  const CI = s.cueS(2, "confidence");
  const band = ease(frame, [P95 - 6, P95 + 20], [0, 1]);
  const br = ease(frame, [RANGE - 6, RANGE + 12], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE MARGIN OF ERROR" color={U.c} at={2} />
      <FnCurve g={G} f={bell(52, 1.58)} fmax={1} color={U.c} fill={0.08} width={5} bands={[{ a: 48.84, b: 55.16, color: C.green, opacity: 0.4, p: band }]} />
      <ValueAxis g={G} ticks={[47, 49, 52, 55, 57].map((v) => ({ v, label: `${v}%`, color: v === 52 ? U.c : v === 49 || v === 55 ? C.green : undefined, big: v !== 47 && v !== 57 }))} />
      <Pop at={P95 - 2} x={540} y={800} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>95%</div>
      </Pop>
      <Pop at={TWO - 4} x={540} y={430} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          2 SE = 2 × 1.6% <span style={{ color: C.green }}>= ABOUT 3%</span>
        </div>
      </Pop>
      {br > 0 ? (
        <>
          <div style={{ position: "absolute", left: gx(G, 49), top: 1080, width: (gx(G, 55) - gx(G, 49)) * br, height: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 12px ${C.green}` }} />
          <div style={{ position: "absolute", left: gx(G, 49) - 3, top: 1064, width: 6, height: 38, background: C.green, borderRadius: 3 }} />
          <div style={{ position: "absolute", left: gx(G, 55) - 3, top: 1064, width: 6, height: 38, background: C.green, borderRadius: 3, opacity: br }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1116, textAlign: "center", opacity: br, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.green, whiteSpace: "nowrap" }}>TRUE SUPPORT: PROBABLY 49% TO 55%</div>
        </>
      ) : null}
      <Pop at={SAY - 2} x={540} y={1225} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 40px", borderRadius: 26, background: alpha(U.c, 0.16), border: `3px solid ${U.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 72, color: C.text, whiteSpace: "nowrap", textShadow: glowText(U.c, 0.5) }}>
          52% <span style={{ color: C.green }}>± 3%</span>
        </div>
      </Pop>
      <Pop at={MOE - 4} x={540} y={540} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap" }}>
          ± 3% = <span style={{ color: C.green }}>MARGIN OF ERROR</span>
        </div>
      </Pop>
      <Pop at={CI - 6} x={540} y={590} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap" }}>
          49 TO 55 = <span style={{ color: C.yellow }}>95% CONFIDENCE INTERVAL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 5 — ALPHA AND BETA. The null curve (cyan) and the threshold: the orange tail beyond it is ALPHA = 5% (false
// alarms). 1 test in 20 rings when nothing's going on. Then a real effect (violet curve): the part left of the threshold
// is BETA ≈ 20% (misses) and the green part right of it is the POWER ≈ 80% (1 − beta).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Geo } from "../components/Curve";
import { gx } from "../components/Curve";
import { alphaAt, betaAt, ErrCurves, EFFECT, NULLC, OKC, pct, SmokeAlarm, T1C, T2C } from "../components/Errors";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const G: Geo = { x0: 110, x1: 970, vmin: -3.2, vmax: 5.7, base: 980, h: 560 };
export const CUT = 1.645;

export const Chip: React.FC<{ x: number; y: number; p: number; color: string; name: string; value: string; sub: string }> = ({ x, y, p, color, name, value, sub }) =>
  p > 0.001 ? (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), padding: "10px 22px", borderRadius: 20, background: alpha(color, 0.16), border: `3px solid ${color}`, textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text }}>
        {name} <span style={{ fontFamily: theme.fonts.mono, color }}>{value}</span>
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color }}>{sub}</div>
    </div>
  ) : null;

export const CurveLabel: React.FC<{ x: number; y: number; p: number; color: string; children: React.ReactNode }> = ({ x, y, p, color, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: Math.min(1, p), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color, whiteSpace: "nowrap" }}>{children}</div>
);

export const S5Alpha: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const TYPE1 = s.cueS(0, "Type");
  const ALPHA = s.cueS(0, "alpha,");
  const TWENTY = s.cueS(1, "20");
  const S2 = s.sent(2).from;
  const BETA = s.cueS(2, "beta,");
  const POWER = s.cueS(2, "power.");
  const nullP = ease(frame, [4, 28], [0, 1], theme.ease.inOut);
  const altP = ease(frame, [S2 - 4, S2 + 22], [0, 1], theme.ease.inOut);
  const rowOut = exitP(frame, S2 - 6, 10);
  return (
    <AbsoluteFill>
      <SceneTitle label="ALPHA AND BETA" color={T1C} at={2} />
      <ErrCurves g={G} c={CUT} sd={1} nullP={nullP} altP={altP} lineP={spr(TYPE1 - 8, theme.spring.smooth)} alphaP={ease(frame, [ALPHA - 6, ALPHA + 10], [0, 1])} betaP={ease(frame, [BETA - 6, BETA + 12], [0, 1])} powerP={ease(frame, [POWER - 8, POWER + 10], [0, 1])} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base + 1, width: (G.x1 - G.x0 + 20) * nullP, height: 4, background: alpha(C.text, 0.4) }} />
      <CurveLabel x={gx(G, 0)} y={660} p={nullP} color={NULLC}>
        NULL TRUE
      </CurveLabel>
      <CurveLabel x={gx(G, EFFECT + 0.55)} y={668} p={altP} color={T2C}>
        REAL EFFECT
      </CurveLabel>
      <CurveLabel x={gx(G, CUT)} y={G.base - 360 - 26} p={spr(TYPE1 - 2, theme.spring.smooth)} color={C.text}>
        THRESHOLD
      </CurveLabel>
      <Chip x={540} y={1070} p={spr(ALPHA - 2, theme.spring.pop)} color={T1C} name="ALPHA" value={pct(alphaAt(CUT, 1))} sub="FALSE ALARMS" />
      {rowOut < 1 ? (
        <div style={{ opacity: 1 - rowOut }}>
          {Array.from({ length: 20 }, (_, i) => {
            const p = spr(TWENTY - 24 + i * 1.5, theme.spring.pop);
            if (p <= 0.01) return null;
            const isAlarm = i === 13;
            const ring = isAlarm && frame >= TWENTY + 8 ? ((frame - TWENTY - 8) / 16) % 1 : 0;
            return (
              <div key={i} style={{ position: "absolute", left: 130 + (i % 10) * 91, top: 1190 + Math.floor(i / 10) * 74, transform: `translate(-50%, -50%) scale(${Math.min(1.15, p)})` }}>
                <SmokeAlarm size={54} ring={ring} color={isAlarm && ring > 0 ? T1C : C.dim} />
              </div>
            );
          })}
          <Pop at={TWENTY + 10} x={540} y={1340} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: T1C, whiteSpace: "nowrap" }}>NOTHING GOING ON: 1 IN 20 STILL RINGS</div>
          </Pop>
        </div>
      ) : null}
      <Chip x={300} y={1210} p={spr(BETA - 2, theme.spring.pop)} color={T2C} name="BETA" value={pct(betaAt(CUT, 1))} sub="MISSES" />
      <Chip x={780} y={1210} p={spr(POWER - 2, theme.spring.pop)} color={OKC} name="POWER" value={pct(1 - betaAt(CUT, 1))} sub="1 − BETA: CATCHES" />
    </AbsoluteFill>
  );
};

// SCENE 8 — THE COMPLETE PICTURE. Every outcome and its chance · discrete: bar heights are probabilities ·
// continuous: areas under the curve are probabilities · either way the total is 1.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { MiniBars } from "../components/Prob";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, DISC, PROB } from "./S1Hook";
import { WEATHER } from "./S2What";

const C = theme.colors;
const CARD_Y = [560, 810, 1060];
const TRI = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((v) => v / 6);

export const S8Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const at = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const TOTAL = s.sent(4).from;
  const active = frame >= TOTAL - 4 ? 3 : frame >= at[2] - 4 ? 2 : frame >= at[1] - 4 ? 1 : frame >= at[0] - 4 ? 0 : -1;
  const cards = [
    { c: PROB, t1: "OUTCOMES + CHANCES", t2: "every outcome, how likely" },
    { c: DISC, t1: "DISCRETE", t2: "bar height = probability" },
    { c: CONT, t1: "CONTINUOUS", t2: "area under curve = probability" },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE COMPLETE PICTURE" color={PROB} at={2} pill="PROBABILITY DISTRIBUTION" pillAt={s.sent(0).from} />
      {cards.map((k, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = CARD_Y[i];
        const on = active === i;
        const sw = spr(at[i] + 6, theme.spring.smooth);
        const g: BellGeo = { x0: 130, x1: 400, vmin: -3.2, vmax: 3.2, base: y + 70, peakH: 130, sigmaRef: 1 };
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) * (on || active === 3 ? 1 : 0.72), transform: `translateX(${(1 - p) * -60}px)` }}>
            <div style={{ position: "absolute", left: 90, top: y - 105, width: 900, height: 210, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(k.c, 0.18)}, rgba(14,24,64,0.9) 50%)`, border: `3px solid ${on ? k.c : alpha(k.c, 0.5)}`, boxShadow: on ? `0 0 34px ${alpha(k.c, 0.35)}` : "none" }} />
            {i === 0 ? (
              <div style={{ position: "absolute", left: 130, top: y, transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6 }}>
                {WEATHER.map((w, j) => (
                  <div key={w.l} style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(sw, [j * 0.25, j * 0.25 + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                    {w.icon(40)}
                    <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, color: C.text, width: 100 }}>{w.l}</span>
                    <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: w.c }}>{w.p.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            ) : i === 1 ? (
              <div style={{ position: "absolute", left: 130, top: y - 70 }}>
                <MiniBars w={270} h={140} vals={TRI} color={DISC} hi={[5]} hiColor={PROB} p={sw} />
              </div>
            ) : (
              <>
                <div style={{ position: "absolute", left: g.x0 - 6, top: g.base - 2, width: g.x1 - g.x0 + 12, height: 3, background: alpha(C.text, 0.35) }} />
                <Bell g={g} mu={0} sigma={1} color={CONT} fill={0.15} width={4} bands={[{ a: -1 * sw, b: 1 * sw, color: PROB, opacity: 0.6 }]} />
              </>
            )}
            <div style={{ position: "absolute", left: 450, top: y, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: k.c, whiteSpace: "nowrap", lineHeight: 1.1 }}>{k.t1}</div>
              <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.dim, whiteSpace: "nowrap" }}>{k.t2}</div>
            </div>
          </div>
        );
      })}
      <Pop at={TOTAL - 4} x={540} y={1280} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Pill label="EITHER WAY, TOTAL = 1" color={PROB} size={40} glow={0.9} />
      </Pop>
    </AbsoluteFill>
  );
};

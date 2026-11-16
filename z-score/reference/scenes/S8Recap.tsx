// SCENE 8 — THE COMPLETE PICTURE. Three recap cards: symmetric with the mean in the centre · the SD sets the width ·
// 68-95-99.7 tells you where the values fall.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { ruleBands, SD_COL } from "./S5Rule";

const C = theme.colors;
const CARD_Y = [580, 850, 1120];
const geo = (y: number): BellGeo => ({ x0: 130, x1: 410, vmin: -3.4, vmax: 3.4, base: y + 78, peakH: 140, sigmaRef: 1 });

export const S8Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const at = [s.cueS(1, "symmetric"), s.cueS(2, "standard"), s.cueS(3, "68")];
  const active = frame >= at[2] - 4 ? 2 : frame >= at[1] - 4 ? 1 : frame >= at[0] - 4 ? 0 : -1;
  const cards = [
    { c: kindColor.mean, t1: "SYMMETRIC", t2: "mean right in the centre" },
    { c: kindColor.sd, t1: "SD SETS THE WIDTH", t2: "small = narrow · big = wide" },
    { c: C.green, t1: "68 · 95 · 99.7", t2: "within 1 · 2 · 3 SD" },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE COMPLETE PICTURE" color={C.cyan} at={2} pill="NORMAL DISTRIBUTION" pillAt={s.sent(0).from} />
      {cards.map((k, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = CARD_Y[i];
        const g = geo(y);
        const on = active === i;
        const sw = spr(at[i] + 6, theme.spring.smooth);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) * (on ? 1 : 0.72), transform: `translateX(${(1 - p) * -60}px)` }}>
            <div style={{ position: "absolute", left: 90, top: y - 115, width: 900, height: 230, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(k.c, 0.18)}, rgba(14,24,64,0.9) 50%)`, border: `3px solid ${on ? k.c : alpha(k.c, 0.5)}`, boxShadow: on ? `0 0 34px ${alpha(k.c, 0.35)}` : "none" }} />
            <div style={{ position: "absolute", left: g.x0 - 6, top: g.base - 2, width: g.x1 - g.x0 + 12, height: 3, background: alpha(C.text, 0.35) }} />
            {i === 0 ? (
              <>
                <Bell g={g} mu={0} sigma={1} color={k.c} fill={0.2} width={5} />
                <div style={{ position: "absolute", left: vx(g, 0) - 2, top: curveY(g, 0, 1, 0) - 14, height: g.base - curveY(g, 0, 1, 0) + 14, borderLeft: `4px dashed ${C.text}` }} />
              </>
            ) : i === 1 ? (
              <>
                <Bell g={g} mu={0} sigma={interpolate(sw, [0, 1], [1, 0.62])} color={k.c} fill={0.2} width={5} />
                <Bell g={g} mu={0} sigma={interpolate(sw, [0, 1], [1, 1.5])} color={k.c} fill={0} width={4} dashed />
              </>
            ) : (
              <Bell g={g} mu={0} sigma={1} color={C.text} fill={0.06} width={4} bands={ruleBands([sw, sw, sw])} />
            )}
            <div style={{ position: "absolute", left: 460, top: y, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: i === 2 ? 50 : 42, color: i === 2 ? C.text : k.c, whiteSpace: "nowrap", lineHeight: 1.1 }}>
                {i === 2 ? (
                  <>
                    <span style={{ color: SD_COL[0] }}>68</span> · <span style={{ color: SD_COL[1] }}>95</span> · <span style={{ color: SD_COL[2] }}>99.7</span>
                  </>
                ) : (
                  k.t1
                )}
              </div>
              <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.dim, whiteSpace: "nowrap" }}>{k.t2}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// SCENE 6 — WHERE IT'S USED: calls to a help desk · website visits per minute · typos on a page · goals in a match.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BarsIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { poisDist } from "../components/Pois";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { EVT, HI, RARE, RATE } from "./S1Hook";

const C = theme.colors;

export const S6Uses: React.FC = () => {
  useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const cards = [
    { t: "HELP DESK CALLS", sub: "per hour", c: EVT, at: s.cueS(1, "Calls"), lam: 3, x: 300, y: 700 },
    { t: "WEBSITE VISITS", sub: "per minute", c: RATE, at: s.cueS(1, "website"), lam: 6, x: 780, y: 700 },
    { t: "TYPOS", sub: "per page", c: RARE, at: s.cueS(1, "typos"), lam: 1.5, x: 300, y: 1020 },
    { t: "GOALS", sub: "per match", c: HI, at: s.cueS(1, "goals"), lam: 2.5, x: 780, y: 1020 },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="WHERE IT'S USED" color={EVT} at={2} />
      <Pop at={s.sent(0).from} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>COUNTS, EVERYWHERE</div>
      </Pop>
      {cards.map((k, i) => {
        const ghost = interpolate(spr(6 + i * 4, theme.spring.smooth), [0, 1], [0, 1]);
        const p = spr(k.at - 6, theme.spring.bouncy);
        return (
          <div key={k.t} style={{ position: "absolute", left: k.x, top: k.y, transform: `translate(-50%, -50%) scale(${p > 0.01 ? interpolate(p, [0, 1], [0.6, 1]) : 1})`, opacity: Math.max(ghost * 0.5, Math.min(1, p * 2)), width: 420, height: 280, boxSizing: "border-box", borderRadius: 28, background: p > 0.01 ? `linear-gradient(180deg, ${alpha(k.c, 0.18)}, rgba(14,24,64,0.9))` : "transparent", border: p > 0.01 ? `3px solid ${k.c}` : `3px dashed ${alpha("#F3F7FF", 0.22)}` }}>
            {p > 0.01 ? (
              <>
                <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{k.t}</div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: k.c }}>{k.sub.toUpperCase()}</div>
                <div style={{ position: "absolute", left: 60, top: 120 }}>
                  <BarsIcon color={k.c} vals={poisDist(k.lam, 9)} w={300} h={120} />
                </div>
              </>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

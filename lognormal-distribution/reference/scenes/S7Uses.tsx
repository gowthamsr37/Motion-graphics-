// SCENE 7 — WHERE IT SHOWS UP: wealth · city sizes · video views · software bugs. Each card has the same
// "a few hold most" bars, first bar orange.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { DECILES } from "../data";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { FEW, MANY } from "./S1Hook";

const C = theme.colors;
const CARDS = [
  { t: "WEALTH", sub: "a few people hold most", tok: "wealth.", x: 300, y: 640 },
  { t: "CITY SIZES", sub: "a few cities are giant", tok: "cities", x: 780, y: 640 },
  { t: "VIDEO VIEWS", sub: "a few videos get most views", tok: "videos", x: 300, y: 990 },
  { t: "SOFTWARE BUGS", sub: "a few bugs cause most crashes", tok: "bugs", x: 780, y: 990 },
];

export const S7Uses: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="WHERE IT SHOWS UP" color={FEW} at={2} />
      {CARDS.map((c) => {
        const p = spr(s.cueS(0, c.tok) - 8, theme.spring.bouncy);
        const ghost = spr(6, theme.spring.smooth);
        return (
          <div key={c.t} style={{ position: "absolute", left: c.x, top: c.y, width: 440, height: 300, transform: `translate(-50%, -50%) scale(${p > 0.01 ? interpolate(Math.min(1, p), [0, 1], [0.8, 1]) : 1})`, boxSizing: "border-box", borderRadius: 28, background: p > 0.01 ? `linear-gradient(180deg, ${alpha(FEW, 0.14)}, rgba(14,24,64,0.92))` : "transparent", border: p > 0.01 ? `3px solid ${alpha(FEW, 0.75)}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, opacity: Math.max(ghost * 0.5, Math.min(1, p * 2)), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            {p > 0.01 ? (
              <>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text }}>{c.t}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                  {DECILES.map((d, k) => (
                    <div key={k} style={{ width: 24, height: Math.max(4, (d / 75) * 120 * Math.min(1, p)), borderRadius: "6px 6px 2px 2px", background: k === 0 ? FEW : alpha(MANY, 0.7) }} />
                  ))}
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 21, color: C.dim }}>{c.sub}</div>
              </>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

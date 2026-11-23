// SCENE 7 — THE 1,000-GAME TEST (mulberry32 seed 9): a 40×25 grid of games fills in; orange = switching would win,
// cyan = sticking would win; counters STICK 333 vs SWITCH 667 with bars.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GAMES, HOT } from "../components/Doors";
import { Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Test: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const GO = s.cueS(0, "played");
  const END = s.cueS(1, "667.");
  const shown = Math.round(ease(frame, [GO, END], [0, 1000], (t) => t));
  const sw = GAMES.slice(0, shown).filter(Boolean).length;
  const st = shown - sw;
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={50}>1,000 games on a computer</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 100, top: 330, width: 880, display: "grid", gridTemplateColumns: "repeat(40, 1fr)", gap: 4 }}>
        {GAMES.map((w, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 4, background: i < shown ? (w ? HOT : C.cyan) : "rgba(255,255,255,0.04)", opacity: i < shown ? (w ? 1 : 0.8) : 1 }} />
        ))}
      </div>
      {[
        { l: "ALWAYS STICK", v: st, c: C.cyan, y: 990 },
        { l: "ALWAYS SWITCH", v: sw, c: HOT, y: 1130 },
      ].map((r) => (
        <div key={r.l} style={{ position: "absolute", left: 90, top: r.y, width: 900, opacity: ease(frame, [GO, GO + 8], [0, 1]) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text }}>
            <span>{r.l}</span>
            <span style={{ color: r.c, fontFamily: theme.fonts.mono }}>{r.v} cars</span>
          </div>
          <div style={{ marginTop: 10, height: 36, borderRadius: 18, background: alpha(C.text, 0.1) }}>
            <div style={{ width: `${(r.v / 1000) * 100}%`, height: "100%", borderRadius: 18, background: r.c, boxShadow: `0 0 14px ${r.c}` }} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

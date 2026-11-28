// SCENE 3 — THE WORDS: a flats table; the PRICE column glows green "LABEL / TARGET (what you predict)", the other
// columns glow cyan "FEATURES (the inputs)"; then the label check: ASKING PRICE vs SOLD PRICE → pick the right one.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const COLS = ["AREA", "BHK", "LOCALITY", "AGE", "PRICE"];
const ROWS = [["1,200", "2", "HSR", "6 yr", "98 L"], ["850", "1", "Whitefield", "3 yr", "62 L"], ["1,600", "3", "Koramangala", "9 yr", "1.4 Cr"]];

export const S3Words: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const LAB = s.cueS(0, "label,");
  const FEAT = s.sent(1).from;
  const CHK = s.sent(2).from;
  const l = ease(frame, [LAB - 4, LAB + 6], [0, 1]);
  const f = ease(frame, [FEAT - 4, FEAT + 6], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={54}>first, the <span style={{ color: C.yellow }}>words</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 360, display: "flex", gap: 10 }}>
        {COLS.map((c, i) => {
          const isL = i === 4;
          const glow = isL ? l : f;
          const col = isL ? C.green : C.cyan;
          return (
            <div key={c} style={{ flex: isL ? 1.2 : i === 2 ? 1.6 : 1, borderRadius: 18, padding: "12px 0", background: alpha(col, 0.05 + 0.15 * glow), border: `3px solid ${alpha(col, 0.2 + 0.8 * glow)}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.dim, letterSpacing: "0.08em" }}>{c}</div>
              {ROWS.map((r, k) => <div key={k} style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{r[i]}</div>)}
            </div>
          );
        })}
      </div>
      <Pop x={400} y={720} at={FEAT}>
        <Txt size={44} color={C.cyan} glow>FEATURES <span style={{ fontSize: 30, color: C.text }}>= the inputs</span></Txt>
      </Pop>
      <Pop x={880} y={720} at={LAB}>
        <div style={{ textAlign: "center" }}>
          <Txt size={44} color={C.green} glow>LABEL</Txt>
          <Txt size={26} font="body">(target) = what you predict</Txt>
        </div>
      </Pop>
      <Pop x={540} y={1020} at={CHK - 4}>
        <Panel w={960} h={300} color={C.yellow}>
          <Txt size={34} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>CHECK THE LABEL TOO</Txt>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Pill color={C.red} size={40}>ASKING PRICE</Pill>
            <Txt size={40} color={C.dim}>or</Txt>
            <Pill color={C.green} size={40} solid>SOLD PRICE</Pill>
          </div>
          <Txt size={34} font="body" style={{ opacity: ease(frame, [s.cueS(2, "wrong") - 4, s.cueS(2, "wrong") + 4], [0, 1]) }}>wrong label = everything after is wrong</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

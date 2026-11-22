// SCENE 3 — TYPE 1: SUPERVISED. Header; a solved question paper (Q1 … answer ✓) beside "learns from examples WITH the
// right answers"; then past flat sales as a table (area · bedrooms · city | price): the three feature columns get a
// cyan FEATURES bracket, the price column a green LABEL = THE ANSWER bracket, each on its word; finally arrows from
// the rows into a MODEL box: "features → price", with a row counter ticking to 10,000.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow, Header, Layer } from "../components/NB";
import { Pop, Txt, T1, Panel } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const COLS = [
  { x: 210, h: "AREA", u: "sq ft" },
  { x: 410, h: "BEDROOMS", u: "" },
  { x: 610, h: "CITY", u: "" },
  { x: 865, h: "PRICE", u: "" },
];
const ROWS = [
  ["800", "1", "Pune", "Rs 34L"],
  ["1,200", "2", "Thane", "Rs 46L"],
  ["1,500", "3", "Noida", "Rs 55L"],
  ["2,000", "3", "Pune", "Rs 70L"],
];
const TY = 720; // header row
const RH = 78;

export const S3Supervised: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const PAPER = s.cueS(0, "solved");
  const ANS = s.cueS(0, "answers,");
  const T0 = s.sent(1).from;
  const FEAT = s.cueS(1, "features.");
  const LAB = s.cueS(2, "label:");
  const MOD = s.sent(3).from;
  const THOU = s.cueS(3, "thousands");
  const count = Math.round(ease(frame, [THOU, THOU + 40], [4, 10000]));
  return (
    <AbsoluteFill>
      <Header text="type 1 · supervised learning" at={s.sent(0).from - 4} color={T1} y={230} />
      {/* the idea: a solved paper */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Pop x={230} y={450} at={PAPER - 8}>
          <div style={{ width: 300, height: 210, borderRadius: 14, background: "#F3F7FF", boxShadow: `0 0 26px ${alpha(T1, 0.4)}`, padding: "18px 22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, transform: "rotate(-4deg)" }}>
            {["Q1  2 + 3 = 5", "Q2  7 × 2 = 14", "Q3  9 − 4 = 5"].map((q, i) => (
              <div key={q} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 25, color: C.ink, whiteSpace: "nowrap", opacity: ease(frame, [PAPER + i * 5, PAPER + i * 5 + 6], [0, 1]) }}>
                {q}
                <svg width={30} height={26} viewBox="0 0 30 26"><path d="M3 14 L11 22 L27 4" fill="none" stroke="#059669" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            ))}
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, color: "#0E7490", letterSpacing: "0.12em" }}>SOLVED PAPER</div>
          </div>
        </Pop>
        <Pop x={420} y={405} at={s.sent(0).from + 6} anchor="left">
          <Txt size={46}>learns from examples</Txt>
        </Pop>
        <Pop x={420} y={470} at={ANS - 4} anchor="left">
          <Txt size={46}>
            WITH the <span style={{ color: C.green }}>right answers</span>
          </Txt>
        </Pop>
      </div>
      {/* the table */}
      <Pop x={540} y={600} at={T0 - 4}>
        <Txt size={38} color={C.dim} font="body">past flat sales</Txt>
      </Pop>
      {/* column tints (behind the text, faint) */}
      <div style={{ position: "absolute", left: 100, top: TY - 45, width: 650, height: RH * 5 + 10, borderRadius: 20, background: alpha(T1, 0.1), border: `3px solid ${alpha(T1, 0.85)}`, opacity: ease(frame, [FEAT - 4, FEAT + 6], [0, 1]) }} />
      <div style={{ position: "absolute", left: 770, top: TY - 45, width: 200, height: RH * 5 + 10, borderRadius: 20, background: alpha(C.green, 0.1), border: `3px solid ${alpha(C.green, 0.9)}`, opacity: ease(frame, [LAB - 4, LAB + 6], [0, 1]) }} />
      {COLS.map((c, i) => (
        <Pop key={c.h} x={c.x} y={TY} at={T0 + 2 + i * 3}>
          <Txt size={26} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>{c.h}</Txt>
        </Pop>
      ))}
      {ROWS.map((r, ri) =>
        r.map((v, ci) => (
          <Pop key={`${ri}${ci}`} x={COLS[ci].x} y={TY + (ri + 1) * RH} at={T0 + 10 + ri * 5 + (ci === 3 ? s.sent(2).from - T0 - 6 : 0)}>
            <Txt size={ci === 3 ? 42 : 40} color={ci === 3 ? C.green : C.text} font={ci === 2 ? "body" : "display"}>{v}</Txt>
          </Pop>
        )),
      )}
      <Pop x={425} y={TY + RH * 5 + 20} at={FEAT - 2}>
        <Txt size={40} color={T1} glow>FEATURES <span style={{ fontSize: 28, color: C.text }}>(the inputs)</span></Txt>
      </Pop>
      <Pop x={870} y={TY + RH * 5 + 20} at={LAB - 2}>
        <Txt size={40} color={C.green} glow>LABEL</Txt>
      </Pop>
      <Pop x={870} y={TY + RH * 5 + 66} at={LAB + 8}>
        <Txt size={28} font="body">= the answer</Txt>
      </Pop>
      {/* the model */}
      <Layer>
        <Arrow x1={540} y1={TY + RH * 5 + 100} x2={540} y2={1250} at={MOD} bend={0} o={{ color: C.violet, width: 5 }} />
      </Layer>
      <Pop x={540} y={1300} at={MOD + 8}>
        <Panel w={760} h={110} color={C.violet} style={{ flexDirection: "row", gap: 26 }}>
          <Txt size={44} color={C.violet} glow>MODEL</Txt>
          <Txt size={40}>
            learns <span style={{ color: T1 }}>features</span> → <span style={{ color: C.green }}>price</span>
          </Txt>
        </Panel>
      </Pop>
      <Pop x={290} y={1215} at={THOU}>
        <Txt size={30} color={C.dim} font="mono">{count.toLocaleString("en-IN")} rows</Txt>
      </Pop>
    </AbsoluteFill>
  );
};

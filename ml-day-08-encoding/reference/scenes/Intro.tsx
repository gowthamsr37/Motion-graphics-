// SCENES 1–4: HOOK (frame 0) · REVEAL + TITLE · MEASURE · THE 3 TYPES.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Mini } from "../components/CleanStep";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { JARGON, STEP_C } from "../components/Steps";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const SeriesStrip: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", gap: 14 }}>
    <Pill color={C.violet} size={26}>100 DAYS OF ML</Pill>
    <Pill color={C.yellow} size={26}>DAY 7 · MISSING VALUES</Pill>
  </div>
);

// SCENE 1 — HOOK: luxury listings with blank areas → filled with the city average (1,150) → the model's price for a luxury
// flat drops: predicted Rs 2.1 Cr vs actual Rs 2.5 Cr, "−Rs 40 L" on every luxury flat.
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const FILL = s.cueS(0, "average.");
  const filled = frame >= FILL + 4;
  const UNDER = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={320} at={0}>
        <Txt size={50}><span style={{ color: C.red }}>30%</span> of luxury flats: <span style={{ color: C.red }}>no area</span></Txt>
      </Pop>
      <Pop x={540} y={560} at={4}>
        <Panel w={940} h={330} color={filled ? C.yellow : C.red}>
          <Mini w={860} tone="bad" cols={["TYPE", "LOCALITY", "AREA (SQ FT)", "PRICE"]} rows={[
            ["villa", "Sadashivnagar", filled ? { v: "1,150 avg", bad: true } : { v: "—", bad: true }, "4.8 Cr"],
            ["4 BHK", "Koramangala", "3,200", "3.1 Cr"],
            ["penthouse", "Indiranagar", filled ? { v: "1,150 avg", bad: true } : { v: "—", bad: true }, "5.2 Cr"],
            ["2 BHK", "HSR", "1,150", "98 L"],
          ]} />
        </Panel>
      </Pop>
      <Pop x={540} y={790} at={FILL - 2}>
        <Txt size={40} font="body">blanks filled with the <span style={{ color: C.yellow }}>city average</span></Txt>
      </Pop>
      <Pop x={540} y={1010} at={UNDER - 2}>
        <Panel w={940} h={250} color={C.red} style={{ flexDirection: "row", gap: 40 }}>
          <div style={{ textAlign: "center" }}>
            <Txt size={30} color={C.dim} font="body">every luxury flat</Txt>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 110, color: C.red, textShadow: glowText(C.red, 0.7), opacity: ease(frame, [s.cueS(1, "40") - 4, s.cueS(1, "40") + 4], [0, 1]) }}>−Rs 40 L</div>
            <Txt size={30} font="body">underpriced</Txt>
          </div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 2 — REVEAL + TITLE: "the blanks weren't random — luxury sellers hide the size" (a hidden-tag icon); "filling with
// the average shrank the flats that mattered most"; then the title MISSING VALUES · 3 types · 6 fixes · 1 rule.
export const S2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const T = s.sent(1).from;
  const top = 1 - ease(frame, [T - 8, T], [0, 1]);
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={400} at={0}>
          <Txt size={64}>the blanks were <span style={{ color: C.red }}>NOT random</span></Txt>
        </Pop>
        <Pop x={540} y={640} at={s.cueS(0, "Luxury") - 4}>
          <Panel w={900} h={300} color={C.violet}>
            <Txt size={44}>luxury sellers <span style={{ color: C.violet }}>hide the size</span></Txt>
            <Txt size={36} font="body" color={C.dim}>(a big area = a big price tag)</Txt>
          </Panel>
        </Pop>
        <Pop x={540} y={930} at={s.cueS(0, "shrank") - 4}>
          <Txt size={42} font="body">average fill <span style={{ color: C.red }}>shrank the flats that mattered most</span></Txt>
        </Pop>
      </div>
      {frame >= T - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={420} at={T}>
            <Txt size={110} style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none" }}>MISSING VALUES</Txt>
          </Pop>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 16 }}>
            {[{ t: "3 TYPES", w: "3", c: C.cyan }, { t: "6 FIXES", w: "6", c: C.green }, { t: "1 RULE", w: "rule", c: C.red }].map((k) => (
              <Pop key={k.t} x={0} y={0} at={s.cueS(1, k.w) - 2} anchor="left" style={{ position: "relative", transform: "none" }}>
                <Pill color={k.c} size={40}>{k.t}</Pill>
              </Pop>
            ))}
          </div>
          <div style={{ position: "absolute", left: 50, right: 50, top: 700, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {JARGON.map((t, i) => {
              const p = ease(frame, [s.cueS(1, "6") + i * 3, s.cueS(1, "6") + 6 + i * 3], [0, 1]);
              return (
                <div key={t} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 16, background: alpha(STEP_C[i], 0.14), border: `3px solid ${STEP_C[i]}` }}>
                  <span style={{ width: 40, height: 40, borderRadius: 20, background: STEP_C[i], color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24 }}>{i + 1}</span>
                  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{t}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// SCENE 3 — MEASURE: % missing per column (bars: parking 70% · area 18% · floor 12% · age 12% · price 0.4%) and a
// missingness map where floor + age gaps line up in the same rows ("missing together: new projects").
const COLS = [{ n: "parking", v: 70 }, { n: "area", v: 18 }, { n: "floor", v: 12 }, { n: "age", v: 12 }, { n: "price", v: 0.4 }];
export const S3Measure: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const P = s.sent(1).from;
  const TOG = s.cueS(1, "together.");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={58}>step 0: <span style={{ color: C.cyan }}>measure</span></Txt>
      </Pop>
      <Pop x={540} y={540} at={P - 4}>
        <Panel w={960} h={400} color={C.cyan} style={{ gap: 14 }}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>% MISSING PER COLUMN</Txt>
          {COLS.map((c, i) => (
            <div key={c.n} style={{ display: "flex", alignItems: "center", gap: 16, width: 860 }}>
              <div style={{ width: 150, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: C.text }}>{c.n}</div>
              <div style={{ width: 8 * c.v * ease(frame, [P + i * 4, P + 14 + i * 4], [0, 1]), minWidth: 4, height: 34, borderRadius: 6, background: c.v > 50 ? C.red : c.v > 5 ? C.orange : C.green }} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text }}>{c.v}%</div>
            </div>
          ))}
        </Panel>
      </Pop>
      <Pop x={540} y={1000} at={TOG - 10}>
        <Panel w={960} h={300} color={C.violet} style={{ flexDirection: "row", gap: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 60px)", gap: 6 }}>
            {Array.from({ length: 32 }, (_, i) => {
              const row = Math.floor(i / 4), col = i % 4;
              const miss = (col === 1 || col === 2) && (row === 2 || row === 5 || row === 6);
              return <div key={i} style={{ height: 22, borderRadius: 4, background: miss ? C.red : alpha(C.text, 0.15) }} />;
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Txt size={36}>floor + age gaps</Txt>
            <Txt size={36}>line up: <span style={{ color: C.violet }}>missing together</span></Txt>
            <Txt size={30} font="body" color={C.dim}>→ the new projects</Txt>
          </div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 4 — THE 3 TYPES: three panels on their sentences: MCAR (random glitch, harmless, green) · MAR (depends on another
// column: new projects → no age, yellow) · MNAR (depends on the value itself: luxury hides size, DANGEROUS, red).
export const S4Types: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const T = [
    { a: "MCAR", n: "missing completely at random", e: "a website glitch wiped some rows", v: "harmless", c: C.green, at: s.sent(1).from },
    { a: "MAR", n: "missing at random", e: "depends on another column: new projects → no age", v: "manageable", c: C.yellow, at: s.sent(2).from },
    { a: "MNAR", n: "missing NOT at random", e: "depends on the value itself: luxury hides size", v: "dangerous", c: C.red, at: s.sent(3).from },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={54}>ask <span style={{ color: C.yellow }}>why</span> it&apos;s missing: 3 types</Txt>
      </Pop>
      {T.map((t, i) => (
        <Pop key={t.a} x={540} y={470 + i * 300} at={t.at - 6}>
          <Panel w={980} h={260} color={t.c} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 30, padding: "0 36px" }}>
            <div style={{ width: 200, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 62, color: t.c, textShadow: glowText(t.c, 0.4) }}>{t.a}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Txt size={34}>{t.n}</Txt>
              <Txt size={28} font="body" color={C.dim} style={{ whiteSpace: "normal", width: 660 }}>{t.e}</Txt>
              <div style={{ opacity: ease(frame, [t.at + 40, t.at + 50], [0, 1]) }}><Pill color={t.c} size={26} solid={i === 2}>{t.v.toUpperCase()}</Pill></div>
            </div>
          </Panel>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

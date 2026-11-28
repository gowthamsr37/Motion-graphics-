// SCENES 1–4: HOOK (frame 0) · REVEAL + TITLE · NOMINAL vs ORDINAL · THE BEGINNER MISTAKE (label encoding).
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
    <Pill color={C.yellow} size={26}>DAY 8 · ENCODING CATEGORIES</Pill>
  </div>
);

const LOC = ["Whitefield", "Hebbal", "HSR Layout", "Indiranagar", "Koramangala"];

// SCENE 1 — HOOK: localities turned into codes 1..5 → "KORAMANGALA = 5 × WHITEFIELD?!"
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const M = s.sent(1).from;
  const FIVE = s.cueS(1, "5");
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={330} at={0}>
        <Txt size={50}>localities → <span style={{ color: C.cyan }}>numbers</span></Txt>
      </Pop>
      <Pop x={540} y={640} at={3}>
        <Panel w={760} h={470} color={C.cyan} style={{ gap: 8 }}>
          {LOC.map((l, i) => {
            const p = ease(frame, [6 + i * 6, 12 + i * 6], [0, 1]);
            const hot = frame >= M && (i === 0 || i === 4);
            return (
              <div key={l} style={{ width: 640, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px", borderRadius: 14, background: hot ? alpha(C.red, 0.2) : "rgba(255,255,255,0.05)", border: `2px solid ${hot ? C.red : "transparent"}`, opacity: p }}>
                <Txt size={42}>{l}</Txt>
                <Txt size={50} font="mono" color={C.yellow}>{i + 1}</Txt>
              </div>
            );
          })}
        </Panel>
      </Pop>
      <Pop x={540} y={1090} at={M - 2}>
        <Panel w={960} h={260} color={C.red}>
          <Txt size={34} font="body" color={C.dim}>our model decided</Txt>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap", opacity: ease(frame, [FIVE - 4, FIVE + 4], [0, 1]) }}>
            Koramangala = <span style={{ color: C.red, textShadow: glowText(C.red, 0.7) }}>5×</span> Whitefield
          </div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 2 — REVEAL + TITLE: "just name tags, but the model did maths": Whitefield + Whitefield = Hebbal (1 + 1 = 2);
// then the title ENCODING CATEGORIES · 2 KINDS / 6 METHODS / 1 TRAP and the 6 jargon chips.
export const S2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const T = s.sent(1).from;
  const top = 1 - ease(frame, [T - 8, T], [0, 1]);
  const EQ = s.cueS(0, "Whitefield");
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={400} at={0}>
          <Txt size={60}>they were just <span style={{ color: C.yellow }}>name tags</span></Txt>
        </Pop>
        <Pop x={540} y={540} at={s.cueS(0, "maths") - 4}>
          <Txt size={44} font="body">…but the model did <span style={{ color: C.red }}>maths</span> on them</Txt>
        </Pop>
        <Pop x={540} y={820} at={EQ - 4}>
          <Panel w={980} h={320} color={C.red}>
            <Txt size={56}>Whitefield + Whitefield = <span style={{ color: C.red }}>Hebbal</span></Txt>
            <Txt size={60} font="mono" color={C.yellow}>1 + 1 = 2</Txt>
            <Txt size={30} font="body" color={C.dim}>(nonsense, but the model believes it)</Txt>
          </Panel>
        </Pop>
      </div>
      {frame >= T - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={400} at={T}>
            <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 108, lineHeight: 1.02, letterSpacing: "-0.02em", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap" }}>
              ENCODING<br />CATEGORIES
            </div>
          </Pop>
          <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", gap: 16 }}>
            {[{ t: "2 KINDS", w: "2", c: C.cyan }, { t: "6 METHODS", w: "6", c: C.green }, { t: "1 TRAP", w: "trap", c: C.red }].map((k) => (
              <Pop key={k.t} x={0} y={0} at={s.cueS(1, k.w) - 2} anchor="left" style={{ position: "relative", transform: "none" }}>
                <Pill color={k.c} size={40}>{k.t}</Pill>
              </Pop>
            ))}
          </div>
          <div style={{ position: "absolute", left: 50, right: 50, top: 730, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
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

// SCENE 3 — NOMINAL vs ORDINAL: "models only read numbers"; NOMINAL (no order: locality, facing) and ORDINAL
// (a real order: unfurnished < semi < fully).
export const S3Kinds: React.FC = () => {
  const s = useScene("s3");
  const N = s.cueS(1, "Nominal:");
  const O = s.cueS(1, "Ordinal:");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={52}>models only read <span style={{ color: C.cyan }}>numbers</span></Txt>
      </Pop>
      <Pop x={540} y={340} at={s.cueS(0, "kind") - 4}>
        <Txt size={38} font="body" color={C.dim}>so first: which kind of category?</Txt>
      </Pop>
      <Pop x={540} y={600} at={N - 6}>
        <Panel w={980} h={360} color={C.cyan} style={{ gap: 16 }}>
          <Txt size={64} color={C.cyan} glow>NOMINAL</Txt>
          <Txt size={36} font="body">no order</Txt>
          <div style={{ display: "flex", gap: 12 }}>
            {["Whitefield", "HSR", "Hebbal", "East-facing"].map((t) => (
              <Pill key={t} color={C.cyan} size={28}>{t}</Pill>
            ))}
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1010} at={O - 6}>
        <Panel w={980} h={360} color={C.orange} style={{ gap: 16 }}>
          <Txt size={64} color={C.orange} glow>ORDINAL</Txt>
          <Txt size={36} font="body">a real order</Txt>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {["unfurnished", "semi", "fully"].map((t, i) => (
              <React.Fragment key={t}>
                {i ? <Txt size={40} color={C.orange}>&lt;</Txt> : null}
                <Pill color={C.orange} size={30}>{t}</Pill>
              </React.Fragment>
            ))}
          </div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 4 — THE BEGINNER MISTAKE: label encoding puts localities on a number line; the gaps look like distances;
// LINEAR / KNN fooled, TREES cope better.
export const S4Label: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const LINE = s.cueS(1, "fake");
  const L = s.cueS(1, "Linear");
  const TR = s.cueS(1, "Tree");
  const x0 = 170, x1 = 870;
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Pill color={C.red} size={40} solid>THE BEGINNER MISTAKE</Pill>
      </Pop>
      <Pop x={540} y={360} at={s.cueS(0, "label") - 4}>
        <Txt size={50}><span style={{ color: C.red }}>label encoding</span>: 1 number each</Txt>
      </Pop>
      <Pop x={540} y={640} at={LINE - 6}>
        <Panel w={1000} h={360} color={C.red}>
          <svg width={960} height={260} viewBox="0 0 960 260" style={{ overflow: "visible" }}>
            <line x1={x0 - 40} y1={150} x2={x1 - 40} y2={150} stroke={alpha(C.text, 0.6)} strokeWidth={4} />
            {LOC.map((l, i) => {
              const x = x0 - 40 + (i * (x1 - x0)) / 4;
              const p = ease(frame, [LINE + i * 4, LINE + 6 + i * 4], [0, 1]);
              return (
                <g key={l} opacity={p}>
                  <circle cx={x} cy={150} r={16} fill={C.yellow} />
                  <text x={x} y={110} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={700} fontSize={36} fill={C.yellow}>{i + 1}</text>
                  <text x={x} y={210} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={800} fontSize={24} fill={C.text}>{l.split(" ")[0]}</text>
                </g>
              );
            })}
            <g opacity={ease(frame, [LINE + 30, LINE + 40], [0, 1])}>
              <path d={`M${x0 - 40} 60 Q ${x0 + 380} -10 ${x1 - 40} 60`} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 8" />
              <rect x={x0 + 250} y={-28} width={260} height={46} rx={23} fill={C.bg} stroke={C.red} strokeWidth={3} />
              <text x={x0 + 380} y={4} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={26} fill={C.text}>"distance" = 4 ?!</text>
            </g>
          </svg>
        </Panel>
      </Pop>
      <Pop x={540} y={970} at={L - 4}>
        <Panel w={980} h={170} color={C.red} style={{ flexDirection: "row", gap: 24 }}>
          <Txt size={40}>Linear models · KNN</Txt>
          <Pill color={C.red} size={30} solid>FOOLED</Pill>
        </Panel>
      </Pop>
      <Pop x={540} y={1170} at={TR - 4}>
        <Panel w={980} h={170} color={C.yellow} style={{ flexDirection: "row", gap: 24 }}>
          <Txt size={40}>Tree models</Txt>
          <Pill color={C.yellow} size={30}>COPE BETTER · DON'T COUNT ON IT</Pill>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

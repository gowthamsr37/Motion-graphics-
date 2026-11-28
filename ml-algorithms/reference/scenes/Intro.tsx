// SCENES 1–4: HOOK (wolf vs husky: it was looking at the snow) · DEFINITION + TITLE · EVERY MODEL HAS THIS PAIR ·
// THE DOCTOR ANALOGY + the 5 tests.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { STEPS, STEP_C } from "../components/Steps";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const SeriesStrip: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", gap: 14 }}>
    <Pill color={C.violet} size={26}>100 DAYS OF ML</Pill>
    <Pill color={C.yellow} size={26}>DAY 6 · FEATURES + LABELS</Pill>
  </div>
);

const Paper: React.FC<{ title: string; c: string; key_?: boolean }> = ({ title, c, key_ }) => (
  <div style={{ width: 400, height: 500, borderRadius: 20, background: "#F8FAFC", border: `5px solid ${c}`, boxShadow: `0 0 30px ${alpha(c, 0.5)}`, padding: "26px 30px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }}>
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: "#0A1A3A", textAlign: "center" }}>{title}</div>
    {[1, 2, 3, 4, 5].map((n) => (
      <div key={n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: "#0A1A3A" }}>Q{n}</div>
        {key_ ? <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: "#15803D" }}>✓ {"BDACB"[n - 1]}</div> : <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#CBD5E1" }} />}
      </div>
    ))}
  </div>
);

// SCENE 1 — HOOK: the question paper; the answer key slides out beside it; 100/100; "ML models can cheat like this": CHEATING?
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const KEY = s.cueS(0, "key");
  const slide = ease(frame, [KEY - 4, KEY + 10], [0, 1]);
  const HUN = s.cueS(0, "100.");
  const CH = s.cueS(1, "cheat");
  const stamp = ease(frame, [CH - 3, CH + 4], [0, 1]);
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={320} at={0}>
        <Txt size={50}>the paper <span style={{ color: C.yellow }}>+</span> the answer key?</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 540 - 200 - 250 * slide, top: 400 }}>
        <Paper title="QUESTION PAPER" c={C.cyan} />
      </div>
      <div style={{ position: "absolute", left: 540 - 200 + 250 * slide, top: 400, opacity: slide }}>
        <Paper title="ANSWER KEY" c={C.green} key_ />
      </div>
      <Pop x={540} y={1010} at={HUN - 4} out={CH - 8}>
        <Txt size={110} color={C.green} glow>100 / 100</Txt>
      </Pop>
      {frame >= CH - 3 ? (
        <div style={{ position: "absolute", left: 540, top: 1000, transform: `translate(-50%, -50%) rotate(-8deg) scale(${2 - stamp})`, opacity: stamp, padding: "14px 40px", border: `8px solid ${C.red}`, borderRadius: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 96, color: C.red, background: "rgba(10,14,40,0.85)", textShadow: glowText(C.red, 0.5) }}>CHEATING?</div>
      ) : null}
      <Pop x={540} y={1170} at={s.cueS(1, "beginners") - 4}>
        <Pill color={C.red} size={34}>ML models do this too · most beginners miss it</Pill>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 2 — DEFINITION + TITLE: FEATURES + LABELS; the interview definition; clues → answer.
export const S2Def: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const D = s.sent(1).from;
  const P = s.sent(2).from;
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={390} at={s.sent(0).from}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 112, lineHeight: 1.02, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap" }}>FEATURES<br />+ LABELS</div>
      </Pop>
      <Pop x={540} y={600} at={D - 4}>
        <Pill color={C.yellow} size={28}>THE INTERVIEW DEFINITION</Pill>
      </Pop>
      <Pop x={540} y={740} at={s.cueS(1, "Features") - 4}>
        <Panel w={980} h={190} color={C.cyan} style={{ alignItems: "flex-start", padding: "0 36px", gap: 6 }}>
          <Txt size={44} color={C.cyan}>FEATURES</Txt>
          <Txt size={34} font="body">the input variables a model uses to make a prediction</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={950} at={s.cueS(1, "label,") - 4}>
        <Panel w={980} h={190} color={C.yellow} style={{ alignItems: "flex-start", padding: "0 36px", gap: 6 }}>
          <Txt size={44} color={C.yellow}>LABEL <span style={{ color: C.dim, fontSize: 32 }}>(also: TARGET)</span></Txt>
          <Txt size={34} font="body">the output the model learns to predict</Txt>
        </Panel>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", gap: 24, opacity: ease(frame, [P - 4, P + 6], [0, 1]) }}>
        <Pill color={C.cyan} size={40} solid>FEATURES = CLUES</Pill>
        <Pill color={C.yellow} size={40} solid>LABEL = ANSWER</Pill>
      </div>
    </AbsoluteFill>
  );
};

const Pair: React.FC<{ title: string; feats: string[]; label: string; at: number; y: number }> = ({ title, feats, label, at, y }) => (
  <Pop x={540} y={y} at={at - 4}>
    <Panel w={1000} h={250} color={C.violet} style={{ gap: 16 }}>
      <Txt size={36}>{title}</Txt>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {feats.map((f) => <Pill key={f} color={C.cyan} size={28}>{f}</Pill>)}
        <Txt size={46} color={C.text}>→</Txt>
        <Pill color={C.yellow} size={30} solid>{label}</Pill>
      </div>
    </Panel>
  </Pop>
);

// SCENE 3 — EVERY MODEL HAS THIS PAIR: Swiggy delivery · spam filter · will a student pass? (the running example)
export const S3Pairs: React.FC = () => {
  const s = useScene("s3");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={54}>every model has this <span style={{ color: C.yellow }}>pair</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 18 }}>
        <Pill color={C.cyan} size={26}>FEATURES</Pill>
        <Pill color={C.yellow} size={26} solid>LABEL</Pill>
      </div>
      <Pair title="Swiggy delivery time" feats={["distance", "rain", "traffic"]} label="minutes" at={s.sent(1).from} y={540} />
      <Pair title="Spam filter" feats={["links", "\"free\"", "sender"]} label="spam / not" at={s.sent(2).from} y={820} />
      <Pair title="Will a student pass?" feats={["hours studied", "attendance"]} label="pass / fail" at={s.sent(3).from} y={1100} />
    </AbsoluteFill>
  );
};

// SCENE 4 — THE DOCTOR: symptoms (features) → diagnosis (label); then the 5 tests every feature must pass.
export const S4Doctor: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const T = s.sent(1).from;
  const top = 1 - ease(frame, [T - 8, T], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={260} at={0}>
          <Txt size={58}>it&apos;s like a <span style={{ color: C.green }}>doctor</span></Txt>
        </Pop>
        <Pop x={540} y={560} at={s.cueS(0, "Fever,") - 4}>
          <Panel w={980} h={330} color={C.cyan} style={{ gap: 18 }}>
            <Txt size={30} font="body" color={C.dim} style={{ letterSpacing: "0.14em" }}>SYMPTOMS = FEATURES</Txt>
            <div style={{ display: "flex", gap: 14 }}>
              {["fever", "cough", "test results"].map((t) => <Pill key={t} color={C.cyan} size={36}>{t}</Pill>)}
            </div>
          </Panel>
        </Pop>
        <Pop x={540} y={790} at={s.cueS(0, "diagnosis") - 6}>
          <Txt size={60} color={C.yellow}>↓</Txt>
        </Pop>
        <Pop x={540} y={950} at={s.cueS(0, "diagnosis") - 2}>
          <Panel w={700} h={200} color={C.yellow}>
            <Txt size={30} font="body" color={C.dim} style={{ letterSpacing: "0.14em" }}>DIAGNOSIS = LABEL</Txt>
            <Txt size={54} color={C.yellow} glow>flu</Txt>
          </Panel>
        </Pop>
        <Pop x={540} y={1150} at={s.cueS(0, "Better") - 2}>
          <Txt size={42}>better clues → <span style={{ color: C.green }}>better diagnosis</span></Txt>
        </Pop>
      </div>
      {frame >= T - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={330} at={T}>
            <Txt size={58}>not every clue is a <span style={{ color: C.red }}>good</span> one</Txt>
          </Pop>
          <Pop x={540} y={470} at={s.cueS(1, "5") - 2}>
            <Txt size={72} color={C.yellow} glow>5 TESTS</Txt>
          </Pop>
          {STEPS.map((t, i) => (
            <Pop key={t} x={540} y={620 + i * 120} at={s.cueS(1, "5") + 6 + i * 4}>
              <div style={{ width: 640, height: 96, boxSizing: "border-box", borderRadius: 20, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", background: "rgba(14,24,64,0.9)", border: `3px solid ${STEP_C[i]}` }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: STEP_C[i], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.ink }}>{i + 1}</div>
                <Txt size={42} style={{ textShadow: glowText(C.text, 0.1) }}>{t}</Txt>
              </div>
            </Pop>
          ))}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

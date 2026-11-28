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

// a simple canine head (wolf / husky), front view
const Canine: React.FC<{ fur: string; face: string; s: number }> = ({ fur, face, s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M18 8 L34 34 L66 34 L82 8 L88 52 Q84 80 50 94 Q16 80 12 52 Z" fill={fur} />
    <path d="M30 50 Q50 40 70 50 Q70 74 50 88 Q30 74 30 50 Z" fill={face} />
    <circle cx={37} cy={48} r={4.5} fill="#0B1020" />
    <circle cx={63} cy={48} r={4.5} fill="#0B1020" />
    <ellipse cx={50} cy={72} rx={7} ry={5} fill="#0B1020" />
  </svg>
);

const Photo: React.FC<{ snow: boolean; label: string; at: number; heat: number }> = ({ snow, label, at, heat }) => {
  const frame = useCurrentFrame();
  const tag = ease(frame, [at, at + 8], [0, 1]);
  return (
    <div style={{ position: "relative", width: 420, height: 470, borderRadius: 24, overflow: "hidden", border: `4px solid ${alpha(C.text, 0.5)}`, background: snow ? "linear-gradient(180deg, #8FB3D9 0%, #C9DCEF 55%, #F1F6FC 56%, #FFFFFF 100%)" : "linear-gradient(180deg, #7DB3E8 0%, #A9D2F5 55%, #3F8F3A 56%, #2E6E2A 100%)" }}>
      {snow ? Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 53) % 400, top: (i * 37) % 250, width: 8, height: 8, borderRadius: 4, background: "#FFFFFF" }} />) : null}
      <div style={{ position: "absolute", left: 85, top: 120, opacity: 1 - heat * 0.75, filter: heat > 0 ? `grayscale(${heat})` : undefined }}>
        <Canine s={250} fur={snow ? "#6B7280" : "#374151"} face={snow ? "#D1D5DB" : "#F3F4F6"} />
      </div>
      {/* the explanation heatmap: the snow lights up, the animal doesn't */}
      {snow ? <div style={{ position: "absolute", left: 0, right: 0, top: 255, bottom: 0, opacity: heat, background: "radial-gradient(ellipse 80% 90% at 50% 70%, rgba(250,204,21,0.95), rgba(239,68,68,0.75) 55%, rgba(239,68,68,0) 100%)" }} /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 18, display: "flex", justifyContent: "center", opacity: tag }}>
        <div style={{ padding: "8px 20px", borderRadius: 999, background: C.green, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.ink }}>{label} ✓</div>
      </div>
    </div>
  );
};

// SCENE 1 — HOOK
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const SNOW = s.cueS(1, "snow.");
  const heat = ease(frame, [SNOW - 6, SNOW + 8], [0, 1]);
  const W = s.sent(2).from;
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={320} at={0}>
        <Txt size={52}>AI: <span style={{ color: C.cyan }}>wolf</span> or <span style={{ color: C.orange }}>husky</span>?</Txt>
      </Pop>
      <Pop x={300} y={640} at={2}>
        <Photo snow label="WOLF" at={s.cueS(0, "right.") - 6} heat={heat} />
      </Pop>
      <Pop x={780} y={640} at={6}>
        <Photo snow={false} label="HUSKY" at={s.cueS(0, "right.")} heat={0} />
      </Pop>
      <Pop x={540} y={950} at={s.cueS(0, "almost") - 2} out={SNOW - 10}>
        <Txt size={46}>almost always <span style={{ color: C.green }}>right</span></Txt>
      </Pop>
      <Pop x={540} y={980} at={SNOW - 4}>
        <Panel w={960} h={200} color={C.red}>
          <Txt size={34} font="body" color={C.dim}>it wasn't looking at the animal</Txt>
          <Txt size={64} color={C.yellow} glow>IT SAW THE SNOW</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1170} at={W + 30}>
        <Pill color={C.red} size={34}>the wrong clue → the wrong model</Pill>
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

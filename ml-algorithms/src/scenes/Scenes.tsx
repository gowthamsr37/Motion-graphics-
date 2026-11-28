// All scenes: S1 hook + title card (frame 0) · S2 the map · S3–S14 the 12 algorithms · S15 which one to use (save) ·
// S16 quiz + end card (no next-reel teaser: standalone reel).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AlgoScene, REI, SUP, UNS } from "../components/Algos";
import { Bookmark } from "../components/Guide";
import { Cta } from "../components/Cta";
import { PollHint } from "../components/Quiz";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const NAMES = ["Linear Regression", "Logistic Regression", "Decision Tree", "Random Forest", "Gradient Boosting", "KNN", "Naive Bayes", "SVM", "K-Means", "PCA", "Neural Networks", "Reinforcement"];
const FAMC = [SUP, SUP, SUP, SUP, SUP, SUP, SUP, SUP, UNS, UNS, C.green, REI];

// SCENE 1 — HOOK + TITLE CARD (frame 0): EVERY ML ALGORITHM · in under 3 min · the 12 chips; apps that run on them.
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const APPS = ["Netflix", "Gmail", "Swiggy", "Bank fraud alert"];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={0}>
        <Pill color={C.yellow} size={28}>12 ALGORITHMS · UNDER 3 MINUTES</Pill>
      </Pop>
      <Pop x={540} y={400} at={0}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          <div style={{ color: C.text }}>EVERY ML</div>
          <div style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ALGORITHM</div>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 50, right: 50, top: 560, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {NAMES.map((n, i) => {
          const p = ease(frame, [2 + i * 2, 8 + i * 2], [0, 1]);
          return (
            <div key={n} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 14, background: alpha(FAMC[i], 0.14), border: `3px solid ${FAMC[i]}` }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: FAMC[i], color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 20 }}>{i + 1}</span>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", gap: 12 }}>
        {APPS.map((a, i) => (
          <div key={a} style={{ opacity: ease(frame, [s.sent(0).from + i * 10, s.sent(0).from + i * 10 + 6], [0, 1]) }}>
            <Pill color={C.green} size={28}>{a}</Pill>
          </div>
        ))}
      </div>
      <Pop x={540} y={1130} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={34}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS BEFORE YOUR INTERVIEW
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 2 — THE MAP: MACHINE LEARNING → SUPERVISED (number / category) · UNSUPERVISED (patterns) · REINFORCEMENT (trial + reward)
export const S2: React.FC = () => {
  const s = useScene("s2");
  const K = [
    { t: "SUPERVISED", sub: ["learns from answers", "→ a number or a category"], c: SUP, w: "Supervised" },
    { t: "UNSUPERVISED", sub: ["no answers given", "→ finds patterns"], c: UNS, w: "Unsupervised" },
    { t: "REINFORCEMENT", sub: ["trial and reward", "→ learns the best moves"], c: REI, w: "reinforcement" },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={60}>first, <span style={{ color: C.yellow }}>the map</span></Txt>
      </Pop>
      {K.map((k, i) => (
        <Pop key={k.t} x={540} y={480 + i * 260} at={s.cueS(1, k.w) - 4}>
          <Panel w={960} h={220} color={k.c} style={{ gap: 8 }}>
            <Txt size={56} color={k.c} style={{ textShadow: glowText(k.c, 0.4) }}>{k.t}</Txt>
            <Txt size={34} font="body">{k.sub[0]} <span style={{ color: k.c }}>{k.sub[1]}</span></Txt>
          </Panel>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

const y = (c: string) => <span style={{ color: C.yellow }}>{c}</span>;
export const A1: React.FC = () => <AlgoScene id="s3" n={1} name="Linear Regression" fam="SUPERVISED · NUMBERS" c={SUP} kind="lin" cues={["line", "rent."]} takeW="predict" take={<>the best-fit line → {y("predicts a number")}</>} uses={["rent", "sales forecast"]} />;
export const A2: React.FC = () => <AlgoScene id="s4" n={2} name="Logistic Regression" fam="SUPERVISED · YES / NO" c={SUP} kind="log" cues={["squeezes", "80%,"]} takeW="probability" take={<>a probability (0 to 1) → {y("yes or no")}</>} uses={["will they buy?", "churn"]} />;
export const A3: React.FC = () => <AlgoScene id="s5" n={3} name="Decision Tree" fam="SUPERVISED" c={SUP} kind="tree" cues={["Salary", "loans?", "Approve,"]} takeW="Approve," take={<>a flowchart of {y("yes / no questions")}</>} uses={["loan approval", "diagnosis"]} />;
export const A4: React.FC = () => <AlgoScene id="s6" n={4} name="Random Forest" fam="SUPERVISED" c={SUP} kind="forest" cues={["hundreds,", "vote."]} takeW="Banks" take={<>hundreds of trees {y("vote")}</>} uses={["fraud detection", "credit risk"]} />;
export const A5: React.FC = () => <AlgoScene id="s7" n={5} name="Gradient Boosting" fam="SUPERVISED · XGBOOST" c={SUP} kind="boost" cues={["after", "fixes"]} takeW="competitions" take={<>the {y("champion")} on table data</>} uses={["Kaggle", "ad clicks"]} />;
export const A6: React.FC = () => <AlgoScene id="s8" n={6} name="K Nearest Neighbours" fam="SUPERVISED" c={SUP} kind="knn" cues={["closest", "majority."]} takeW="You" take={<>you are who your {y("neighbours")} are</>} uses={["recommendations", "similar items"]} />;
export const A7: React.FC = () => <AlgoScene id="s9" n={7} name="Naive Bayes" fam="SUPERVISED · TEXT" c={SUP} kind="bayes" cues={["Free,", "winner,", "urgent?"]} takeW="Great" take={<>word probabilities → {y("spam or not")}</>} uses={["spam filter", "sentiment"]} />;
export const A8: React.FC = () => <AlgoScene id="s10" n={8} name="Support Vector Machine" fam="SUPERVISED" c={SUP} kind="svm" cues={["widest", "support"]} takeW="edge" take={<>the {y("widest street")} between two classes</>} uses={["text classification", "face detection"]} />;
export const A9: React.FC = () => <AlgoScene id="s11" n={9} name="K-Means Clustering" fam="UNSUPERVISED · GROUPS" c={UNS} kind="kmeans" cues={["drops", "moves"]} takeW="Perfect" take={<>no labels → {y("natural groups")}</>} uses={["customer segments", "playlists"]} />;
export const A10: React.FC = () => <AlgoScene id="s12" n={10} name="PCA" fam="UNSUPERVISED · COMPRESS" c={UNS} kind="pca" cues={["squeezes", "plots."]} takeW="Faster" take={<>fewer columns, {y("most of the information")}</>} uses={["compression", "visualisation"]} />;
export const A11: React.FC = () => <AlgoScene id="s13" n={11} name="Neural Networks" fam="DEEP LEARNING" c={C.green} kind="nn" cues={["calculators,", "deep"]} takeW="deep" take={<>layers of neurons → {y("deep learning")}</>} uses={["face unlock", "translation", "ChatGPT"]} />;
export const A12: React.FC = () => <AlgoScene id="s14" n={12} name="Reinforcement Learning" fam="REINFORCEMENT" c={REI} kind="rl" cues={["tries", "slowly"]} takeW="mastered" take={<>try, get {y("rewarded")}, repeat</>} uses={["chess + Go", "robots"]} />;

// SCENE 15 — WHICH ONE TO USE (save moment)
const ROWS = [
  { q: "predict a number?", a: "Linear Regression · Boosting", w: "number?", c: SUP },
  { q: "yes or no?", a: "Logistic Regression · Random Forest", w: "Yes", c: SUP },
  { q: "find groups?", a: "K-Means", w: "groups?", c: UNS },
  { q: "too many columns?", a: "PCA", w: "columns?", c: UNS },
  { q: "images or text?", a: "Neural Networks", w: "Images", c: C.green },
];
export const S15: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s15");
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={58} color={C.yellow} glow>WHICH ONE TO USE?</Txt>
      </Pop>
      <Pop x={540} y={660} at={s.sent(0).from + 10}>
        <Panel w={1000} h={600} color={C.cyan} style={{ gap: 6 }}>
          {ROWS.map((r, i) => {
            const p = ease(frame, [s.cueS(0, r.w) - 2, s.cueS(0, r.w) + 6], [0, 1]);
            return (
              <div key={r.q} style={{ width: 920, display: "flex", alignItems: "center", gap: 18, padding: "16px 0", borderTop: i ? `2px solid ${alpha(C.text, 0.08)}` : undefined, opacity: 0.3 + 0.7 * p }}>
                <div style={{ width: 330, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{r.q}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, padding: "8px 18px", borderRadius: 14, background: alpha(r.c, 0.18), border: `3px solid ${r.c}`, whiteSpace: "nowrap" }}>{r.a}</div>
              </div>
            );
          })}
        </Panel>
      </Pop>
      <Pop x={540} y={1060} at={s.cueS(1, "Screenshot") - 4}>
        <Pill color={C.green} size={36}>
          <Bookmark size={36} color={C.green} />
          SCREENSHOT · SAVE THIS
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 16 — QUIZ + END CARD: Netflix groups viewers with similar taste, no labels: which algorithm? (answer B, K-Means)
const OPTS = [{ l: "Linear Regression", c: C.cyan }, { l: "K-Means Clustering", c: C.orange }, { l: "Logistic Regression", c: C.green }, { l: "Decision Tree", c: C.violet }];
export const S16: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s16");
  const P0 = s.sent(0).from;
  const W = s.cueS(0, "algorithm");
  const VOTE = s.cueS(0, "Vote");
  const FOL = s.sent(1).from;
  const clear = ease(frame, [FOL - 10, FOL], [0, 1]);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `translateY(${-30 * clear}px)` }}>
          <Pop x={540} y={260} at={P0 - 6}>
            <Pill color={C.yellow} size={50}>QUICK QUIZ!</Pill>
          </Pop>
          <Pop x={540} y={430} at={P0 + 4}>
            <Txt size={40}>Netflix groups viewers with <span style={{ color: C.orange }}>similar taste</span></Txt>
          </Pop>
          <Pop x={540} y={500} at={s.cueS(0, "labels.") - 4}>
            <Txt size={40} font="body">without any labels</Txt>
          </Pop>
          <Pop x={540} y={660} at={W - 8}>
            <Txt size={60} color={C.yellow} glow>Which algorithm?</Txt>
          </Pop>
          {OPTS.map((o, i) => (
            <Pop key={o.l} x={540} y={790 + i * 110} at={W + 4 + i * 4}>
              <div style={{ width: 860, height: 92, boxSizing: "border-box", borderRadius: 20, display: "flex", alignItems: "center", gap: 24, padding: "0 24px", background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(o.c, 0.8)}` }}>
                <div style={{ width: 58, height: 58, borderRadius: 29, background: o.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>{"ABCD"[i]}</div>
                <Txt size={42}>{o.l}</Txt>
              </div>
            </Pop>
          ))}
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1260px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={FOL - 4} y={1260} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta FOL={FOL} FOLW={s.cueS(1, "Follow")} DATAW={s.cueS(1, "data")} SIMPLE={s.cueS(1, "simple!")}
          chips={[{ l: "Supervised", c: SUP }, { l: "Unsupervised", c: UNS }, { l: "Deep learning", c: C.green }, { l: "Reinforcement", c: REI }]} />
      ) : null}
    </AbsoluteFill>
  );
};

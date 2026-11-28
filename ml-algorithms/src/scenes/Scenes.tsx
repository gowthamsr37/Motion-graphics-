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

// SCENE 1 — HOOK (frame 0): INTERVIEW QUESTION card; XGBoost, SVM, KNN, logistic regression slam in on their words;
// "which one would you use, and why?"; GUESSING? stamp; SAVE IT.
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const W = [{ t: "XGBoost", w: "XGBoost,", c: SUP }, { t: "SVM", w: "SVM,", c: C.violet }, { t: "KNN", w: "KNN,", c: C.orange }, { t: "Logistic Regression", w: "logistic", c: C.green }];
  const G = s.cueS(1, "guess.");
  const stamp = ease(frame, [G - 3, G + 4], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={0}>
        <Pill color={C.red} size={34} solid>INTERVIEW QUESTION</Pill>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 340, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
        {W.map((k, i) => {
          const at = i === 0 ? 0 : s.cueS(0, k.w) - 3;
          const p = ease(frame, [at, at + 6], [0, 1]);
          return (
            <div key={k.t} style={{ opacity: p, transform: `scale(${1.6 - 0.6 * p})`, padding: "14px 30px", borderRadius: 20, background: alpha(k.c, 0.18), border: `4px solid ${k.c}`, boxShadow: `0 0 26px ${alpha(k.c, 0.5)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>{k.t}</div>
          );
        })}
      </div>
      <Pop x={540} y={760} at={s.cueS(0, "which") - 4}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: C.text, whiteSpace: "nowrap" }}>
          which one would<br />you use, <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>and why?</span>
        </div>
      </Pop>
      {frame >= G - 3 ? (
        <div style={{ position: "absolute", left: 540, top: 1000, transform: `translate(-50%, -50%) rotate(-7deg) scale(${2 - stamp})`, opacity: stamp, padding: "12px 40px", border: `8px solid ${C.red}`, borderRadius: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 90, color: C.red, background: "rgba(10,14,40,0.85)", textShadow: glowText(C.red, 0.5) }}>GUESSING?</div>
      ) : null}
      <Pop x={540} y={1170} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={36}>
          <Bookmark size={36} color={C.green} />
          SAVE IT · stop guessing
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 2 — THE 3 QUESTIONS
export const S2: React.FC = () => {
  const s = useScene("s2");
  const Q = [
    { n: "1", t: "do you have the answers (labels)?", w: "1:", c: UNS },
    { n: "2", t: "a number, or a category?", w: "2:", c: SUP },
    { n: "3", t: "images, audio or text?", w: "3:", c: C.green },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={58}>it comes down to <span style={{ color: C.yellow }}>3 questions</span></Txt>
      </Pop>
      {Q.map((q, i) => (
        <Pop key={q.n} x={540} y={480 + i * 230} at={s.cueS(1, q.w) - 4}>
          <Panel w={980} h={190} color={q.c} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 30, padding: "0 36px" }}>
            <div style={{ width: 90, height: 90, borderRadius: 45, background: q.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.ink }}>{q.n}</div>
            <Txt size={44}>{q.t}</Txt>
          </Panel>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

const y = (c: string) => <span style={{ color: C.yellow }}>{c}</span>;
export const A1: React.FC = () => <AlgoScene id="s3" n={1} name="Linear Regression" fam="A NUMBER?" c={SUP} kind="lin" cues={["line", "rent."]} takeW="Bigger" take={<>use it when: {y("predicting a number")}</>} uses={["rent", "sales forecast"]} />;
export const A2: React.FC = () => <AlgoScene id="s4" n={2} name="Gradient Boosting" fam="A NUMBER? · MORE ACCURACY" c={SUP} kind="boost" cues={["after", "fixes"]} takeW="competitions" take={<>use it when: {y("accuracy matters most")}</>} uses={["Kaggle", "ad clicks"]} />;
export const A3: React.FC = () => <AlgoScene id="s5" n={3} name="Logistic Regression" fam="A CATEGORY?" c={SUP} kind="log" cues={["squeezes", "80%,"]} takeW="probability" take={<>use it when: {y("yes or no")}</>} uses={["will they buy?", "churn"]} />;
export const A4: React.FC = () => <AlgoScene id="s6" n={4} name="Decision Tree" fam="A CATEGORY? · EXPLAINABLE" c={SUP} kind="tree" cues={["Salary", "loans?", "Approve,"]} takeW="Approve," take={<>use it when: {y("you must explain why")}</>} uses={["loan approval", "diagnosis"]} />;
export const A5: React.FC = () => <AlgoScene id="s7" n={5} name="Random Forest" fam="A CATEGORY? · SAFE BET" c={SUP} kind="forest" cues={["hundreds", "vote."]} takeW="Banks" take={<>use it when: {y("you want a strong default")}</>} uses={["fraud detection", "credit risk"]} />;
export const A6: React.FC = () => <AlgoScene id="s8" n={6} name="Naive Bayes" fam="A CATEGORY? · TEXT" c={SUP} kind="bayes" cues={["Free,", "winner,", "urgent?"]} takeW="Probably" take={<>use it when: {y("classifying text")}</>} uses={["spam filter", "sentiment"]} />;
export const A7: React.FC = () => <AlgoScene id="s9" n={7} name="Support Vector Machine" fam="A CATEGORY? · SMALL DATA" c={SUP} kind="svm" cues={["widest", "support"]} takeW="edge" take={<>use it when: {y("small data, clear classes")}</>} uses={["text classification", "face detection"]} />;
export const A8: React.FC = () => <AlgoScene id="s10" n={8} name="K Nearest Neighbours" fam="A CATEGORY? · SIMPLEST" c={SUP} kind="knn" cues={["closest", "majority."]} takeW="copy" take={<>use it when: {y("similar = same label")}</>} uses={["recommendations", "similar items"]} />;
export const A9: React.FC = () => <AlgoScene id="s11" n={9} name="K-Means Clustering" fam="NO LABELS? · GROUPS" c={UNS} kind="kmeans" cues={["drops", "moves"]} takeW="Perfect" take={<>use it when: {y("no labels, find groups")}</>} uses={["customer segments", "playlists"]} />;
export const A10: React.FC = () => <AlgoScene id="s12" n={10} name="PCA" fam="TOO MANY COLUMNS?" c={UNS} kind="pca" cues={["squeezes", "plots."]} takeW="Faster" take={<>use it when: {y("too many columns")}</>} uses={["compression", "visualisation"]} />;
export const A11: React.FC = () => <AlgoScene id="s13" n={11} name="Neural Networks" fam="IMAGES · AUDIO · TEXT?" c={C.green} kind="nn" cues={["calculators", "deep"]} takeW="deep" take={<>use it when: {y("images, audio, text at scale")}</>} uses={["face unlock", "ChatGPT"]} />;
export const A12: React.FC = () => <AlgoScene id="s14" n={12} name="Reinforcement Learning" fam="TRIAL + REWARD?" c={REI} kind="rl" cues={["tries", "learns"]} takeW="mastered" take={<>use it when: {y("learning by trial and reward")}</>} uses={["chess", "robots"]} />;

// SCENE 15 — WHICH ONE TO USE (save moment)
const ROWS = [
  { q: "a number?", a: "Linear Regression → Boosting", w: "number?", c: SUP },
  { q: "a category?", a: "Logistic Regression → Random Forest", w: "category?", c: SUP },
  { q: "text?", a: "Naive Bayes", w: "Text?", c: SUP },
  { q: "no labels?", a: "K-Means", w: "labels?", c: UNS },
  { q: "too many columns?", a: "PCA", w: "columns?", c: UNS },
  { q: "images?", a: "Neural Networks", w: "Images?", c: C.green },
];
export const S15: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s15");
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={58} color={C.yellow} glow>SAY THIS IN THE INTERVIEW</Txt>
      </Pop>
      <Pop x={540} y={690} at={s.sent(0).from + 10}>
        <Panel w={1000} h={680} color={C.cyan} style={{ gap: 4 }}>
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
      <Pop x={540} y={1110} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={36}>
          <Bookmark size={36} color={C.green} />
          SAVE + SEND TO A FRIEND
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
            <Pill color={C.yellow} size={44}>INTERVIEW QUESTION!</Pill>
          </Pop>
          <Pop x={540} y={430} at={P0 + 4}>
            <Txt size={36}>Netflix wants to group viewers with <span style={{ color: C.orange }}>similar taste</span></Txt>
          </Pop>
          <Pop x={540} y={500} at={s.cueS(0, "labels.") - 4}>
            <Txt size={40} font="body">without any labels</Txt>
          </Pop>
          <Pop x={540} y={660} at={W - 8}>
            <Txt size={50} color={C.yellow} glow>Which algorithm would you use?</Txt>
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

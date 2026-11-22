// SCENE 11 — YOUR TURN + TEASER + END CARD. YOUR TURN pill; hospital doodle + the puzzle (past patient records →
// predict how many DAYS a new patient will stay); "Which type is it?" with A/B/C/D house option boxes and the bouncing
// VOTE IN THE CAPTION POLL hint; then the TOMORROW · DAY 3 teaser (the ML workflow) and the house end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Computer, Hospital } from "../components/Doodles";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Icon, Pill, Pop, T1, T2, T3, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS = [
  { l: "Supervised: classification", c: T1 },
  { l: "Supervised: regression", c: T1 },
  { l: "Unsupervised", c: T2 },
  { l: "Reinforcement", c: T3 },
];

export const S11Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P0 = s.sent(0).from;
  const HOS = s.cueS(0, "hospital");
  const DAYS = s.cueS(0, "days");
  const TYPE = s.cueS(0, "type");
  const VOTE = s.cueS(0, "Vote");
  const TEASE = s.sent(1).from;
  const FOL = s.sent(2).from;
  const clear = ease(frame, [TEASE - 10, TEASE], [0, 1]);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `translateY(${-30 * clear}px)` }}>
          <Pop x={540} y={260} at={P0 - 6}>
            <Pill color={C.yellow} size={50}>YOUR TURN!</Pill>
          </Pop>
          <Pop x={200} y={470} at={HOS - 8}>
            <Icon size={200}>
              <Hospital x={100} y={100} s={190} at={HOS - 8} />
            </Icon>
          </Pop>
          <Pop x={340} y={420} at={HOS - 2} anchor="left">
            <Txt size={40} font="body">A hospital uses past</Txt>
          </Pop>
          <Pop x={340} y={475} at={HOS + 6} anchor="left">
            <Txt size={40} font="body">patient records to predict</Txt>
          </Pop>
          <Pop x={340} y={535} at={DAYS - 8} anchor="left">
            <Txt size={44}>
              how many <span style={{ color: C.yellow }}>DAYS</span> a patient stays
            </Txt>
          </Pop>
          <Pop x={540} y={700} at={TYPE - 8}>
            <Txt size={72} color={C.yellow} glow>Which type is it?</Txt>
          </Pop>
          {OPTS.map((o, i) => (
            <Pop key={o.l} x={540} y={830 + i * 110} at={TYPE + 4 + i * 4}>
              <div style={{ width: 860, height: 92, boxSizing: "border-box", borderRadius: 20, display: "flex", alignItems: "center", gap: 24, padding: "0 24px", background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(o.c, 0.8)}` }}>
                <div style={{ width: 58, height: 58, borderRadius: 29, background: o.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>{"ABCD"[i]}</div>
                <Txt size={42}>{o.l}</Txt>
              </div>
            </Pop>
          ))}
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1300px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={TEASE - 4} y={1300} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= TEASE - 6 && frame < FOL ? (
        <AbsoluteFill style={{ opacity: 1 - ease(frame, [FOL - 10, FOL], [0, 1]) }}>
          <Teaser
            at={TEASE}
            titleAt={s.cueS(1, "Day")}
            label="TOMORROW · DAY 3"
            title="THE ML WORKFLOW"
            color={C.cyan}
            icon={
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {["DATA", "CLEAN", "TRAIN", "TEST"].map((t, i) => (
                  <React.Fragment key={t}>
                    {i ? <Txt size={40} color={C.dim}>→</Txt> : null}
                    <Pill color={[C.cyan, C.green, C.violet, C.orange][i]} size={30}>{t}</Pill>
                  </React.Fragment>
                ))}
              </div>
            }
          />
          <Pop x={540} y={1100} at={TEASE + 10}>
            <Icon size={180}>
              <Computer x={90} y={90} s={170} at={TEASE + 10} />
            </Icon>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={s.cueS(2, "Follow")}
          DATAW={s.cueS(2, "data")}
          SIMPLE={s.cueS(2, "simple!")}
          next="DAY 3: THE ML WORKFLOW"
          chips={[
            { l: "3 types", c: T1 },
            { l: "Regression", c: C.green },
            { l: "Clustering", c: T2 },
            { l: "Rewards", c: T3 },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

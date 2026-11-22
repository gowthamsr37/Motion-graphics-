// SCENE 11 — YOUR TURN + TEASER + END CARD. YOUR TURN stamp; a bank doodle and the puzzle (a bank learns to catch fraud
// from past transactions, each labelled fraud / not fraud); WHICH TYPE? with A/B/C/D options in hand-drawn boxes and the
// bouncing VOTE IN THE CAPTION POLL hint; then the notebook end card (TOMORROW: DAY 2 sticky, robot, FOLLOW tap, handle).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bank } from "../components/Doodles";
import { Arrow, Layer, Sketch, Stamp, WriteAt } from "../components/NB";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Clusters, Flashcards, Gamepad } from "../components/Doodles";
import { ease } from "../components/Motion";
import { hand, nb } from "../theme";
import { useScene } from "../timing";

const OPTS = ["Supervised", "Unsupervised", "Reinforcement", "Not ML"];

export const S11Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P0 = s.sent(0).from;
  const BANK = s.cueS(0, "bank");
  const LAB = s.cueS(0, "labelled");
  const TYPE = s.cueS(0, "type");
  const VOTE = s.cueS(0, "Vote");
  const TEASE = s.sent(1).from;
  const FOL = s.sent(2).from;
  const clear = ease(frame, [TEASE - 10, TEASE], [0, 1]);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `translateY(${-30 * clear}px)` }}>
          <Stamp x={540} y={270} at={P0 - 6} rot={-6} size={64}>
            YOUR TURN!
          </Stamp>
          <Layer>
            <Bank x={240} y={490} s={190} at={BANK - 8} />
          </Layer>
          <WriteAt x={380} y={430} align="left" at={BANK - 2} size={48} font="body" cps={50} pencil={false}>
            A bank learns to catch fraud
          </WriteAt>
          <WriteAt x={380} y={495} align="left" at={BANK + 18} size={48} font="body" cps={50} pencil={false}>
            from past transactions,
          </WriteAt>
          <WriteAt x={380} y={560} align="left" at={LAB - 4} size={48} font="body" cps={50} pencil={false}>
            each labelled fraud / not fraud.
          </WriteAt>
          <WriteAt x={540} y={720} at={TYPE - 8} size={92} color={nb.red} cps={26}>
            Which type is it?
          </WriteAt>
          <Layer>
            {OPTS.map((_, i) => (
              <Sketch key={i} s={{ k: "rect", x: (i % 2 ? 560 : 150) + 0, y: 820 + Math.floor(i / 2) * 140, w: 370, h: 110 }} at={TYPE + 4 + i * 4} dur={8} o={{ color: nb.ink, width: 4, fill: nb.card, fillStyle: "solid", seed: 700 + i }} />
            ))}
            {OPTS.map((_, i) => (
              <Sketch key={`c${i}`} s={{ k: "circle", x: (i % 2 ? 560 : 150) + 55, y: 875 + Math.floor(i / 2) * 140, d: 60 }} at={TYPE + 8 + i * 4} dur={6} o={{ color: [nb.blue, nb.orange, nb.purple, nb.pencil][i], width: 4, seed: 710 + i }} />
            ))}
          </Layer>
          {OPTS.map((o, i) => (
            <React.Fragment key={o}>
              <div style={{ position: "absolute", left: (i % 2 ? 560 : 150) + 55, top: 877 + Math.floor(i / 2) * 140, transform: "translate(-50%, -50%)", fontFamily: hand.title, fontWeight: 700, fontSize: 48, color: [nb.blue, nb.orange, nb.purple, nb.pencil][i], opacity: ease(frame, [TYPE + 10 + i * 4, TYPE + 14 + i * 4], [0, 1]) }}>{"ABCD"[i]}</div>
              <WriteAt x={(i % 2 ? 560 : 150) + 100} y={877 + Math.floor(i / 2) * 140} align="left" at={TYPE + 10 + i * 4} size={46} font="body" cps={60} pencil={false}>
                {o}
              </WriteAt>
            </React.Fragment>
          ))}
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1190px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={TEASE - 4} y={1190} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= TEASE - 6 && frame < FOL ? (
        <AbsoluteFill style={{ opacity: 1 - ease(frame, [FOL - 10, FOL], [0, 1]) }}>
          <Teaser
            at={TEASE}
            titleAt={s.cueS(1, "Day")}
            label="TOMORROW · DAY 2"
            title="THE 3 TYPES OF ML"
            color={nb.blue}
            icon={
              <svg width={560} height={170} viewBox="0 0 560 170" style={{ overflow: "visible" }}>
                <Flashcards x={100} y={85} s={150} at={TEASE + 4} />
                <Clusters x={280} y={85} s={160} at={TEASE + 10} />
                <Gamepad x={460} y={92} s={150} at={TEASE + 16} />
              </svg>
            }
          />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={s.cueS(2, "Follow")}
          DATAW={s.cueS(2, "data")}
          SIMPLE={s.cueS(2, "simple!")}
          next="DAY 2: THE 3 TYPES OF ML"
          chips={[
            { l: "Rules vs learning", c: nb.blue },
            { l: "Guess, error, adjust", c: nb.orange },
            { l: "3 types", c: nb.green },
            { l: "AI · ML · DL", c: nb.purple },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

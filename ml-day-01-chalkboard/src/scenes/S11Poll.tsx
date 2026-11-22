// SCENE 11 — YOUR TURN + TEASER + END CARD. YOUR TURN stamp; a bank doodle and the puzzle (a bank learns to catch fraud
// from past transactions, each labelled fraud / not fraud); WHICH TYPE? with A/B/C/D options in hand-drawn boxes and the
// bouncing VOTE IN THE CAPTION POLL hint; then the notebook end card (TOMORROW: DAY 2 sticky, robot, FOLLOW tap, handle).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bank } from "../components/Doodles";
import { Arrow, Layer, Sketch, Stamp, WriteAt } from "../components/NB";
import { NBCta } from "../components/NBCta";
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
          <div style={{ position: "absolute", left: 540, top: 1190, transform: `translate(-50%, -50%) translateY(${frame > VOTE ? Math.abs(Math.sin((frame - VOTE) / 6)) * -10 : 0}px)`, opacity: ease(frame, [VOTE - 6, VOTE + 2], [0, 1]), padding: "8px 26px", border: `4px solid ${nb.red}`, borderRadius: 14, background: nb.voteBg, fontFamily: hand.body, fontSize: 46, color: nb.ink, whiteSpace: "nowrap", boxShadow: "0 10px 18px -10px rgba(60,40,10,0.5)" }}>
            VOTE IN THE CAPTION POLL
          </div>
          <Layer>
            <Arrow x1={540} y1={1235} x2={540} y2={1330} bend={0.2} at={VOTE + 6} dur={8} o={{ color: nb.red, width: 5 }} />
          </Layer>
        </AbsoluteFill>
      ) : null}
      <NBCta TEASE={TEASE} FOL={s.sent(2).from} FOLW={s.cueS(2, "Follow")} SIMPLE={s.cueS(2, "simple!")} tomorrow="Day 2: the 3 types of ML" />
    </AbsoluteFill>
  );
};

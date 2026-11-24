// SCENE 11 — YOUR TURN + TEASER + END CARD. 99% on its own training data: what's wrong? A nothing · B it already saw
// the answers · C too few features · D wrong algorithm (answer B); teaser DAY 4: CLEANING MESSY DATA; house end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Computer } from "../components/Doodles";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Icon, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS = [
  { l: "Nothing, 99% is great", c: C.cyan },
  { l: "It already saw the answers", c: C.orange },
  { l: "Too few features", c: C.green },
  { l: "Wrong algorithm", c: C.violet },
];

export const S11Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P0 = s.sent(0).from;
  const HOS = s.cueS(0, "same");
    const TYPE = s.cueS(0, "problem?");
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
          <Pop x={540} y={430} at={P0 + 4}>
            <Txt size={46}>a model scores <span style={{ color: C.green }}>99%</span>…</Txt>
          </Pop>
          <Pop x={540} y={520} at={HOS - 4}>
            <Txt size={40} font="body">…tested on the <span style={{ color: C.red }}>same data</span> it trained on</Txt>
          </Pop>
          <Pop x={540} y={700} at={TYPE - 8}>
            <Txt size={68} color={C.yellow} glow>What&apos;s the problem?</Txt>
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
            label="TOMORROW · DAY 4"
            title="CLEANING MESSY DATA"
            color={C.orange}
            icon={
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {["MISSING", "DUPLICATES", "TYPOS", "OUTLIERS"].map((t, i) => (
                  <Pill key={t} color={[C.red, C.orange, C.yellow, C.violet][i]} size={26}>{t}</Pill>
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
          next="DAY 4: CLEANING MESSY DATA"
          chips={[
            { l: "Define", c: C.cyan },
            { l: "Clean", c: C.orange },
            { l: "Split 80/20", c: C.yellow },
            { l: "Train + test", c: C.green },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

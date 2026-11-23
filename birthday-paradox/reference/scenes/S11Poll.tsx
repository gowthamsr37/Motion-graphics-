// SCENE 11 — YOUR TURN + TEASER + END CARD. Coin + "Fair coin: when are you MOST likely to get MORE than 60% heads?";
// A 10 flips · B 100 flips · C 1,000 flips · D same chance; VOTE IN THE CAPTION POLL; teaser NEXT: PAIRED t-TEST
// (before vs after); house end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Coin } from "../components/Casino";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS = [
  { l: "10 flips", c: C.cyan },
  { l: "100 flips", c: C.orange },
  { l: "1,000 flips", c: C.green },
  { l: "Same chance", c: C.violet },
];

export const S11Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P0 = s.sent(0).from;
  const MOST = s.cueS(0, "most");
  const OPT = s.cueS(0, "10");
  const VOTE = s.cueS(0, "Vote");
  const TEASE = s.sent(1).from;
  const FOL = s.sent(2).from;
  const clear = ease(frame, [TEASE - 10, TEASE], [0, 1]);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `translateY(${-30 * clear}px)` }}>
          <Pop x={540} y={260} at={P0 - 6}>
            <Pill color={C.yellow} size={50} solid>YOUR TURN!</Pill>
          </Pop>
          <Pop x={180} y={480} at={P0}>
            <Coin size={150} flip={frame / 10} />
          </Pop>
          <Pop x={300} y={430} at={P0 + 4} anchor="left">
            <Txt size={42} font="body">With a fair coin, when are</Txt>
          </Pop>
          <Pop x={300} y={500} at={MOST - 6} anchor="left">
            <Txt size={46}>
              you <span style={{ color: C.yellow }}>MOST</span> likely to get
            </Txt>
          </Pop>
          <Pop x={300} y={570} at={MOST + 4} anchor="left">
            <Txt size={46}>
              <span style={{ color: C.yellow }}>more than 60%</span> heads?
            </Txt>
          </Pop>
          {OPTS.map((o, i) => (
            <Pop key={o.l} x={(i % 2 ? 790 : 290)} y={760 + Math.floor(i / 2) * 150} at={OPT - 4 + i * 5}>
              <div style={{ width: 460, height: 120, boxSizing: "border-box", borderRadius: 24, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(o.c, 0.85)}`, boxShadow: `0 0 20px ${alpha(o.c, 0.25)}` }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: o.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.ink }}>{"ABCD"[i]}</div>
                <Txt size={46}>{o.l}</Txt>
              </div>
            </Pop>
          ))}
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1150px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={TEASE - 4} y={1150} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= TEASE - 6 && frame < FOL ? (
        <AbsoluteFill style={{ opacity: 1 - ease(frame, [FOL - 10, FOL], [0, 1]) }}>
          <Teaser
            at={TEASE}
            titleAt={s.cueS(1, "paired")}
            label="NEXT · BEFORE vs AFTER"
            title="THE PAIRED t-TEST"
            color={C.orange}
            icon={
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <Pill color={C.cyan} size={36}>BEFORE</Pill>
                <Txt size={50} color={C.dim}>→</Txt>
                <Pill color={C.orange} size={36}>AFTER</Pill>
              </div>
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
          next="THE PAIRED t-TEST"
          chips={[
            { l: "House edge", c: C.green },
            { l: "Coin flips", c: C.yellow },
            { l: "Insurance", c: C.cyan },
            { l: "Gambler's fallacy", c: C.red },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

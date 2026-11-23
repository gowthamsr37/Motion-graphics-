// SCENE 11 — YOUR TURN + TEASER + END CARD. Class of 30: chance two share a birthday? A 8% · B 30% · C 50% · D 70%
// (answer D, 70.6%); VOTE IN THE CAPTION POLL; teaser NEXT PARADOX: THE MONTY HALL PROBLEM (3 doors); house end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Guy, HOT } from "../components/BKit";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS = [
  { l: "8%", c: C.cyan },
  { l: "30%", c: C.orange },
  { l: "50%", c: C.green },
  { l: "70%", c: C.violet },
];

export const S11Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P0 = s.sent(0).from;
  const CH = s.cueS(0, "chance");
  const VOTE = s.cueS(0, "Vote");
  const TEASE = s.sent(1).from;
  const FOL = s.sent(2).from;
  const clear = ease(frame, [TEASE - 10, TEASE], [0, 1]);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `translateY(${-30 * clear}px)` }}>
          <Pop x={540} y={250} at={P0 - 6}>
            <Pill color={C.yellow} size={50} solid>YOUR TURN!</Pill>
          </Pop>
          <div style={{ position: "absolute", left: 150, right: 150, top: 340, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} style={{ opacity: ease(frame, [P0 + i, P0 + i + 4], [0, 1]) }}>
                <Guy size={44} color={alpha(C.text, 0.6)} />
              </div>
            ))}
          </div>
          <Pop x={540} y={600} at={P0 + 6}>
            <Txt size={50}>a class of <span style={{ color: HOT }}>30 students</span></Txt>
          </Pop>
          <Pop x={540} y={680} at={CH - 4}>
            <Txt size={40} font="body">chance two share a birthday?</Txt>
          </Pop>
          {OPTS.map((o, i) => (
            <Pop key={o.l} x={i % 2 ? 790 : 290} y={830 + Math.floor(i / 2) * 150} at={CH + 6 + i * 5}>
              <div style={{ width: 440, height: 120, boxSizing: "border-box", borderRadius: 24, display: "flex", alignItems: "center", gap: 26, padding: "0 30px", background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(o.c, 0.85)}` }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: o.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.ink }}>{"ABCD"[i]}</div>
                <Txt size={60}>{o.l}</Txt>
              </div>
            </Pop>
          ))}
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1200px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={TEASE - 4} y={1200} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= TEASE - 6 && frame < FOL ? (
        <AbsoluteFill style={{ opacity: 1 - ease(frame, [FOL - 10, FOL], [0, 1]) }}>
          <Teaser
            at={TEASE}
            titleAt={s.cueS(1, "Monty")}
            label="NEXT PARADOX · #2"
            title="MONTY HALL"
            color={HOT}
            icon={
              <div style={{ display: "flex", gap: 30 }}>
                {[1, 2, 3].map((d) => (
                  <div key={d} style={{ width: 130, height: 190, borderRadius: "16px 16px 4px 4px", background: alpha(HOT, 0.18), border: `4px solid ${HOT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text }}>{d}</div>
                ))}
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
          next="PARADOX #2: MONTY HALL"
          chips={[
            { l: "23 people", c: HOT },
            { l: "253 pairs", c: C.cyan },
            { l: "50.7%", c: C.green },
            { l: "Birthday attack", c: C.red },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

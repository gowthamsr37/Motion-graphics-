// SCENE 11 — YOUR TURN + TEASER + END CARD. Red 10 times in a row: chance the next spin is black? A over 50% ·
// B 48.6% · C under 10% · D 100% (answer B); VOTE IN THE CAPTION POLL; teaser NEXT PARADOX: THE MONTY HALL PROBLEM (3 doors); house end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Ball } from "./Bits";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS = [
  { l: "Over 50%", c: C.cyan },
  { l: "48.6%", c: C.orange },
  { l: "Under 10%", c: C.green },
  { l: "100%", c: C.violet },
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
          <div style={{ position: "absolute", left: 150, right: 150, top: 360, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <Ball key={i} c="R" size={64} p={ease(frame, [P0 + i * 2, P0 + i * 2 + 4], [0, 1])} />
            ))}
          </div>
          <Pop x={540} y={600} at={P0 + 6}>
            <Txt size={50}>red <span style={{ color: HOT }}>10 times</span> in a row</Txt>
          </Pop>
          <Pop x={540} y={680} at={CH - 4}>
            <Txt size={40} font="body">chance the next spin is black?</Txt>
          </Pop>
          {OPTS.map((o, i) => (
            <Pop key={o.l} x={i % 2 ? 790 : 290} y={830 + Math.floor(i / 2) * 150} at={CH + 6 + i * 5}>
              <div style={{ width: 440, height: 120, boxSizing: "border-box", borderRadius: 24, display: "flex", alignItems: "center", gap: 26, padding: "0 30px", background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(o.c, 0.85)}` }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: o.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.ink }}>{"ABCD"[i]}</div>
                <Txt size={44}>{o.l}</Txt>
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
            label="NEXT PARADOX · #3"
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
          next="PARADOX #3: MONTY HALL"
          chips={[
            { l: "No memory", c: HOT },
            { l: "Monte Carlo 1913", c: C.red },
            { l: "50-50 still", c: C.green },
            { l: "Hot hand", c: C.cyan },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

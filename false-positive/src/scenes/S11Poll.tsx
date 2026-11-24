// SCENE 11 — YOUR TURN + TEASER + END CARD. disease in 1 in 10: is a positive more or less trustworthy? A more · B less ·
// C same · D can't tell (answer A, ≈92%); teaser NEXT PARADOX #5: SIMPSON'S; house end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { SICK } from "../components/People";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { PollHint } from "../components/Quiz";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS = [
  { l: "More trustworthy", c: C.cyan },
  { l: "Less trustworthy", c: C.orange },
  { l: "Exactly the same", c: C.green },
  { l: "Can't tell", c: C.violet },
];

export const S11Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P0 = s.sent(0).from;
  const CH = s.cueS(0, "trustworthy?");
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
              <div key={i} style={{ width: 54, height: 54, borderRadius: 27, background: i === 0 ? SICK : alpha(C.text, 0.3), opacity: ease(frame, [P0 + i * 2, P0 + i * 2 + 4], [0, 1]), boxShadow: i === 0 ? `0 0 12px ${SICK}` : undefined }} />
            ))}
          </div>
          <Pop x={540} y={600} at={P0 + 6}>
            <Txt size={50}>disease in <span style={{ color: HOT }}>1 in 10</span> people</Txt>
          </Pop>
          <Pop x={540} y={680} at={CH - 4}>
            <Txt size={40} font="body">is a positive test now…</Txt>
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
            titleAt={s.cueS(1, "Simpson's")}
            label="NEXT PARADOX · #5"
            title="SIMPSON'S PARADOX"
            color={HOT}
            icon={
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Pill color={C.green} size={36}>WINS EVERY GROUP</Pill>
                <Pill color={C.red} size={36}>LOSES OVERALL?</Pill>
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
          next="PARADOX #5: SIMPSON'S"
          chips={[
            { l: "Base rate", c: HOT },
            { l: "10 vs 100", c: C.cyan },
            { l: "About 9%", c: C.green },
            { l: "Retest", c: C.violet },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

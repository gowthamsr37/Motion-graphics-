// SCENE 1 — HOOK. A 10-question true/false answer sheet fills with random guesses, gets marked (7 right?) →
// THE BINOMIAL DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const BARS = C.violet; // the binomial bars
export const SUCC = C.green; // success / right
export const FAIL = C.orange; // failure / wrong
export const AVGC = C.cyan; // the average (series mean colour)
// the guesses and whether each was right (7 of 10)
const GUESS = ["T", "F", "F", "T", "T", "F", "T", "F", "T", "T"];
const RIGHT = [true, true, false, true, true, true, false, true, false, true];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const GUESSW = s.cueS(0, "guess");
  const SEVEN = s.cueS(1, "7");
  const BIN = s.cueS(2, "binomial");
  const sheet = spr(4, theme.spring.smooth);
  const title = spr(BIN - 3, theme.spring.pop);

  return (
    <AbsoluteFill>
      <Pop at={6} out={BIN - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          TRUE OR FALSE · <span style={{ color: FAIL }}>JUST GUESS</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%, -50%) scale(${interpolate(sheet, [0, 1], [0.8, 1])})`, opacity: Math.min(1, sheet * 2), width: 760, height: 560, boxSizing: "border-box", borderRadius: 30, background: "linear-gradient(180deg, rgba(26,40,98,0.92), rgba(14,24,64,0.92))", border: `2px solid ${C.edge}` }}>
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.dim }}>ANSWER SHEET</div>
        {GUESS.map((g, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 40 + col * 360;
          const y = 80 + row * 90;
          const filled = frame >= GUESSW - 6 + i * 4;
          const marked = frame >= SEVEN - 14 + i * 2;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 320, height: 70, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 70, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.dim }}>Q{i + 1}</div>
              {["T", "F"].map((o) => {
                const on = filled && g === o;
                return <div key={o} style={{ width: 54, height: 54, borderRadius: 27, border: `3px solid ${on ? C.text : alpha("#F3F7FF", 0.3)}`, background: on ? alpha("#F3F7FF", 0.85) : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: on ? C.ink : C.dim }}>{o}</div>;
              })}
              <div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>{marked ? <Mark kind={RIGHT[i] ? "check" : "cross"} at={SEVEN - 14 + i * 2} size={44} color={RIGHT[i] ? SUCC : FAIL} width={9} /> : null}</div>
            </div>
          );
        })}
      </div>
      <Pop at={SEVEN - 2} out={BIN - 6} x={540} y={1180} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SUCC, textShadow: glowText(SUCC, 0.5) }}>7</span> RIGHT<span style={{ color: C.yellow }}>?</span> <span style={{ fontSize: 40, color: C.dim }}>WHAT ARE THE ODDS</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE BINOMIAL</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${BARS}, ${SUCC})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(BARS, 0.5)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={BIN} x={540} y={440} color={BARS} count={22} radius={340} seed={7} />
      <Pop at={BIN + 10} x={540} y={1180} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

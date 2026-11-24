// SCENE 11 — THE REAL CHECKLIST (save moment), in the house navy style (no white card): a navy panel "THE REAL ML
// CHECKLIST" with 8 rows, each = the step's term + the habit, ticking on its spoken habit; SAVE THIS pill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { STEPS, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ITEMS = [
  { t: "Ask before you build", w: "Ask" },
  { t: "Know your sources", w: "Know" },
  { t: "Clean everything", w: "Clean" },
  { t: "Question every pattern", w: "Question" },
  { t: "Test on recent data", w: "Test" },
  { t: "Watch for leakage", w: "Watch" },
  { t: "Check every group", w: "Check" },
  { t: "Monitor after launch", w: "Monitor" },
];

export const S11List: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  return (
    <AbsoluteFill>
      <Pop x={540} y={230} at={s.sent(0).from - 4}>
        <Txt size={58} color={C.yellow} glow>THE REAL CHECKLIST</Txt>
      </Pop>
      <Pop x={540} y={680} at={s.sent(0).from}>
        <Panel w={980} h={760} color={C.cyan} style={{ gap: 4 }}>
          {ITEMS.map((it, i) => {
            const at = s.cueS(1, it.w);
            const p = ease(frame, [at - 2, at + 6], [0, 1]);
            return (
              <div key={it.t} style={{ width: 880, display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderTop: i ? `2px solid ${alpha(C.text, 0.08)}` : undefined, opacity: 0.35 + 0.65 * p }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, border: `4px solid ${STEP_C[i]}`, background: p > 0.5 ? STEP_C[i] : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {p > 0.5 ? <svg width={30} height={30} viewBox="0 0 30 30"><path d="M5 16 L12 23 L26 7" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                </div>
                <div style={{ width: 170, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: STEP_C[i] }}>{STEPS[i]}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>{it.t}</div>
              </div>
            );
          })}
        </Panel>
      </Pop>
      <Pop x={540} y={1170} at={s.cueS(2, "Save") - 4}>
        <Pill color={C.green} size={36}>
          <Bookmark size={36} color={C.green} />
          SAVE THIS · this is the real job
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};

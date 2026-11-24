// SCENE 10 — THE CHECKLIST (screenshot / save moment): a clipboard card "MY FIRST ML PROJECT" with 7 boxes that tick on
// their spoken names (one-sentence goal · load the data · 4 cleaning checks · 3 plots · split 80/20 · simple model ·
// beat the baseline); SCREENSHOT THIS badge; SAVE + send.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Pill, Pop } from "../components/D2";
import { ease } from "../components/Motion";
import { JARGON, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ITEMS = [
  { t: "One-sentence goal", w: "goal." },
  { t: "Load the data", w: "Load" },
  { t: "4 cleaning checks", w: "cleaning" },
  { t: "3 plots", w: "plots." },
  { t: "Split 80 / 20", w: "Split." },
  { t: "Simple model first", w: "Simple" },
  { t: "Beat the baseline", w: "Beat" },
];

export const S10List: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <Pop x={790} y={250} at={s.cueS(0, "Screenshot") - 4}>
        <div style={{ transform: "rotate(6deg)" }}>
          <Pill color={C.yellow} size={30} solid>SCREENSHOT THIS</Pill>
        </div>
      </Pop>
      <Pop x={540} y={740} at={s.sent(0).from - 4}>
        <div style={{ width: 900, padding: "36px 46px", boxSizing: "border-box", borderRadius: 28, background: "#F8FAFC", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.ink, marginBottom: 20 }}>MY FIRST ML PROJECT</div>
          {ITEMS.map((it, i) => {
            const at = s.cueS(1, it.w);
            const p = ease(frame, [at - 2, at + 6], [0, 1]);
            return (
              <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "8px 0", borderTop: i ? `2px solid ${alpha(C.ink, 0.08)}` : undefined }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, border: `4px solid ${STEP_C[i]}`, background: p > 0.5 ? STEP_C[i] : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p > 0.5 ? <svg width={30} height={30} viewBox="0 0 30 30"><path d="M5 16 L12 23 L26 7" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.ink, lineHeight: 1.1 }}>{i + 1}. {it.t}</span>
                  <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.08em", color: "#475569" }}>{JARGON[i]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Pop>
      <Pop x={540} y={1330} at={s.cueS(2, "Save") - 4}>
        <Pill color={C.green} size={38}>
          <Bookmark size={38} color={C.green} />
          SAVE + SEND TO THAT FRIEND
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};

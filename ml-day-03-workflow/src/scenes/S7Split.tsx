// SCENE 7 — STEP 5: SPLIT (the one beginners skip). Step bar (5). 100 house squares; 20 slide away into a locked TEST
// box (20% hidden), 80 stay as TRAINING; then the exam analogy: a question paper with "SEEN BEFORE? the score proves
// nothing".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Split: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const HIDE = s.cueS(1, "hide");
  const EXAM = s.sent(2).from;
  const mv = ease(frame, [HIDE, HIDE + 24], [0, 1]);
  const ex = ease(frame, [EXAM - 8, EXAM], [0, 1]);
  return (
    <AbsoluteFill>
      <StepBar cur={4} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={70}>split the <span style={{ color: C.yellow }}>data</span></Txt>
      </Pop>
      <Pop x={540} y={500} at={s.cueS(0, "beginners") - 2}>
        <Txt size={32} font="body" color={C.red}>the step beginners skip</Txt>
      </Pop>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ex * 0.85 }}>
        {Array.from({ length: 100 }, (_, i) => {
          const test = i % 5 === 4;
          const col = i % 10, row = Math.floor(i / 10);
          const x0 = 110 + col * 54, y0 = 580 + row * 54;
          const ti = Math.floor(i / 5);
          const x1 = 760 + (ti % 4) * 54, y1 = 640 + Math.floor(ti / 4) * 54;
          const x = test ? x0 + (x1 - x0) * mv : x0, y = test ? y0 + (y1 - y0) * mv : y0;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 44, height: 44, borderRadius: 8, background: test && mv > 0.5 ? C.yellow : C.cyan, opacity: ease(frame, [s.sent(1).from - 10 + i * 0.2, s.sent(1).from - 4 + i * 0.2], [0, 1]) }} />;
        })}
        <div style={{ position: "absolute", left: 740, top: 610, width: 240, height: 320, borderRadius: 20, border: `4px dashed ${C.yellow}`, opacity: mv }} />
        <div style={{ position: "absolute", left: 110, top: 1140, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.cyan, opacity: ease(frame, [s.cueS(1, "80%") - 4, s.cueS(1, "80%") + 4], [0, 1]) }}>80% TRAIN</div>
        <div style={{ position: "absolute", left: 750, top: 960, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.yellow, opacity: mv }}>20% TEST</div>
        <div style={{ position: "absolute", left: 790, top: 1020, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.dim, opacity: mv }}>hidden, locked</div>
      </div>
      {frame >= EXAM - 8 ? (
        <Pop x={540} y={860} at={EXAM}>
          <Panel w={900} h={420} color={C.red} style={{ opacity: ex }}>
            <Txt size={36} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>IT&apos;S LIKE AN EXAM</Txt>
            <Txt size={50}>already seen the paper?</Txt>
            <Txt size={50} color={C.red} glow>the score proves nothing</Txt>
            <Pill color={C.yellow} size={30}>TEST ONLY ON UNSEEN DATA</Pill>
          </Panel>
        </Pop>
      ) : null}
    </AbsoluteFill>
  );
};

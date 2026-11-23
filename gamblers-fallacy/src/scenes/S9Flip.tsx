// SCENE 9 — THE FLIP SIDE. "HEADS IS HOT, IT'LL CONTINUE" = the hot-hand fallacy, also wrong for a fair coin (both
// mistakes struck out around the true 50%); then the caveat: only for truly random, independent events — a batter in
// form or a rigged machine is a different story.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Strike: React.FC<{ at: number; children: React.ReactNode; c: string }> = ({ at, children, c }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", padding: "14px 30px", borderRadius: 20, border: `3px solid ${c}`, background: "rgba(14,24,64,0.9)" }}>
      {children}
      <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 7, borderRadius: 4, background: C.red, transform: `scaleX(${ease(frame, [at, at + 8], [0, 1])}) rotate(-5deg)`, transformOrigin: "left center" }} />
    </div>
  );
};

const BatLine: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <Txt size={34} font="body" color={C.dim} style={{ opacity: ease(frame, [at, at + 8], [0, 1]) }}>
      a batter in form · a rigged machine → <span style={{ color: C.yellow }}>different story</span>
    </Txt>
  );
};

export const S9Flip: React.FC = () => {
  const s = useScene("s9");
  const WRONG = s.cueS(0, "wrong");
  const CARE = s.sent(1).from;
  const BAT = s.cueS(1, "batter");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={50}>the <span style={{ color: HOT }}>opposite</span> mistake</Txt>
      </Pop>
      <Pop x={540} y={400} at={s.sent(0).from + 6}>
        <Strike at={WRONG} c={C.violet}>
          <Txt size={42}>&quot;tails is due&quot;</Txt>
        </Strike>
      </Pop>
      <Pop x={540} y={530} at={s.cueS(0, "hot,") - 6}>
        <Strike at={WRONG + 4} c={C.cyan}>
          <Txt size={42}>&quot;heads is hot, it&apos;ll continue&quot;</Txt>
        </Strike>
      </Pop>
      <Pop x={540} y={670} at={WRONG + 8}>
        <Pill color={C.green} size={44} solid>FAIR COIN: ALWAYS 50%</Pill>
      </Pop>
      <Pop x={540} y={1000} at={CARE - 4}>
        <Panel w={960} h={380} color={C.yellow}>
          <Txt size={30} color={C.yellow} style={{ letterSpacing: "0.14em" }}>CAREFUL</Txt>
          <Txt size={40}>only for truly random,</Txt>
          <Txt size={40}>independent events</Txt>
          <BatLine at={BAT - 4} />
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

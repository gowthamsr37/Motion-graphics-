// SCENE 10 — REMEMBER THIS (save moment). Two cards: SMALL SAMPLES CAN LIE (a jumpy line, red) vs LARGE SAMPLES TELL THE
// TRUTH (a line settling on its target, green); then the SAVE THIS bookmark pill and "send it to the friend who says
// 'this time I'll definitely win'".
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bookmark } from "../components/Guide";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const jumpy = Array.from({ length: 9 }, (_, i) => `${20 + i * 40},${70 + Math.sin(i * 2.1) * 50}`).join(" ");
const calm = Array.from({ length: 40 }, (_, i) => `${20 + i * 8.2},${70 + Math.sin(i * 1.4) * 50 * Math.exp(-i / 9)}`).join(" ");

export const S10Rule: React.FC = () => {
  const s = useScene("s10");
  const SMALL = s.cueS(0, "small");
  const LARGE = s.cueS(0, "Large");
  const SAVE = s.cueS(1, "Save");
  const SEND = s.cueS(1, "send");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={62} color={C.yellow} glow>REMEMBER THIS</Txt>
      </Pop>
      <Pop x={290} y={650} at={SMALL - 6}>
        <Panel w={470} h={520} color={C.red}>
          <Txt size={30} color={C.dim} font="body">small samples</Txt>
          <Txt size={62} color={C.red} glow>CAN LIE</Txt>
          <svg width={360} height={140} viewBox="0 0 360 140">
            <line x1={10} y1={70} x2={350} y2={70} stroke={C.green} strokeWidth={3} strokeDasharray="10 8" />
            <polyline points={jumpy} fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" />
          </svg>
          <Txt size={30} font="body">n = 10</Txt>
        </Panel>
      </Pop>
      <Pop x={790} y={650} at={LARGE - 6}>
        <Panel w={470} h={520} color={C.green}>
          <Txt size={30} color={C.dim} font="body">large samples</Txt>
          <Txt size={50} color={C.green} glow>TELL THE TRUTH</Txt>
          <svg width={360} height={140} viewBox="0 0 360 140">
            <line x1={10} y1={70} x2={350} y2={70} stroke={C.green} strokeWidth={3} strokeDasharray="10 8" />
            <polyline points={calm} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinejoin="round" />
          </svg>
          <Txt size={30} font="body">n = 10,000</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1060} at={SAVE - 4}>
        <Pill color={C.green} size={42}>
          <Bookmark size={42} color={C.green} />
          SAVE THIS
        </Pill>
      </Pop>
      <Pop x={540} y={1180} at={SEND - 2}>
        <Txt size={36} font="body">
          send it to the friend who says <span style={{ color: C.yellow }}>&quot;this time I&apos;ll win&quot;</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};

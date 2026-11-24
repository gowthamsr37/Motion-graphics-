// SCENE 8 — RETEST: the 110 positives (10 red + 100 orange) go through TEST #2; the orange ones fall away (only ~1 stays
// positive), leaving 10 red + 1 orange → AFTER 2 POSITIVES: ~90%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { FALSE, SICK } from "../components/People";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Retest: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const CLEAR = s.cueS(0, "clears");
  const NINETY = s.cueS(1, "90%.");
  const drop = ease(frame, [CLEAR - 6, CLEAR + 24], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={58}>that&apos;s why doctors <span style={{ color: C.violet }}>retest</span></Txt>
      </Pop>
      <Pop x={540} y={360} at={s.cueS(0, "second") - 4}>
        <Pill color={C.violet} size={36}>TEST #2 ON THE 110 POSITIVES</Pill>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 440, width: 800, display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 10 }}>
        {Array.from({ length: 110 }, (_, i) => {
          const sick = i < 10;
          const stays = sick || i === 57;
          const gone = stays ? 0 : drop;
          return <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: sick ? SICK : FALSE, opacity: 1 - gone * 0.85, transform: `translateY(${gone * 30}px) scale(${1 - gone * 0.5})`, boxShadow: stays && drop > 0.5 ? `0 0 14px ${sick ? SICK : FALSE}` : undefined }} />;
        })}
      </div>
      <Pop x={540} y={1150} at={CLEAR + 20}>
        <Txt size={44}>left: <span style={{ color: SICK }}>10 sick</span> + <span style={{ color: FALSE }}>~1 false alarm</span></Txt>
      </Pop>
      <Pop x={540} y={1290} at={NINETY - 8}>
        <Panel w={900} h={160} color={HOT} style={{ flexDirection: "row", gap: 24 }}>
          <Txt size={40}>after 2 positives:</Txt>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 90, color: HOT, textShadow: glowText(HOT, 0.7) }}>~90%</div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

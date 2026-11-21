// SCENE 11 — INTERVIEW TRAP: ONE TAIL OR TWO? Two zone curves stacked: TWO-TAILED (2.5% each side, ±1.96) and
// ONE-TAILED, H1: LESS THAN 200 (all 5% in the left tail, −1.645), the second sliding in when it's spoken.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { CLAIM, TAIL, zGeo } from "../components/ZKit";
import { theme } from "../theme";
import { useScene } from "../timing";
import { ZoneCurve } from "./S9Critical";

const C = theme.colors;
const G1 = zGeo(740, 210, 170, 910);
const G2 = zGeo(1180, 210, 170, 910);

const Label: React.FC<{ y: number; at: number; t: React.ReactNode }> = ({ y, at, t }) => (
  <Pop at={at} x={540} y={y} from="up" dist={10}>
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
  </Pop>
);

export const S11Traps: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const ONE = s.cueS(1, "one-tailed.");
  const MOVE = s.cueS(1, "moves");
  const two = ease(frame, [4, 26], [0, 1], theme.ease.inOut);
  const one = ease(frame, [ONE - 6, ONE + 20], [0, 1], theme.ease.inOut);
  const oneZ = ease(frame, [MOVE - 6, MOVE + 14], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="INTERVIEW TRAP" pill="ONE TAIL OR TWO?" color={TAIL} at={2} pillAt={s.sent(0).from} />
      <Label y={450} at={4} t={<>TWO-TAILED · <span style={{ color: CLAIM }}>H1: µ ≠ 200</span></>} />
      <ZoneCurve g={G1} p={two} zones={two} />
      <Label y={890} at={ONE - 4} t={<>ONE-TAILED · <span style={{ color: TAIL }}>H1: µ &lt; 200</span> (UNDER-FILLING)</>} />
      {frame >= ONE - 6 ? <ZoneCurve g={G2} p={one} zones={oneZ} oneTail /> : null}
    </AbsoluteFill>
  );
};

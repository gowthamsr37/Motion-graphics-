// SCENE 5 — CHANGE THE RATE. The same axis (0–28): average 4, then 1 (mostly 0 or 1), then 15 (wider, almost a bell —
// a faint normal curve overlays it). Each shape is scaled to its own peak so the shape reads.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { CountBars, poisDist } from "../components/Pois";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EVT, HI, RATE } from "./S1Hook";

const C = theme.colors;
const K = 28;
const X0 = 120;
const X1 = 960;
const BASE = 1150;
const H = 520;
const norm = (d: number[]) => {
  const m = Math.max(...d);
  return d.map((v) => v / m);
};
const D4 = norm(poisDist(4, K));
const D1 = norm(poisDist(1, K));
const D15 = norm(poisDist(15, K));

export const S5Rate: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const ONE = s.sent(1).from;
  const FIFTEEN = s.sent(2).from;
  const BELL = s.cueS(2, "bell.");
  const a = ease(frame, [ONE - 4, ONE + 14], [0, 1], theme.ease.inOut);
  const b = ease(frame, [FIFTEEN - 4, FIFTEEN + 16], [0, 1], theme.ease.inOut);
  const vals = D4.map((v, k) => interpolate(b, [0, 1], [interpolate(a, [0, 1], [v, D1[k]]), D15[k]]));
  const lam = b > 0.5 ? 15 : a > 0.5 ? 1 : 4;
  const bw = (X1 - X0) / (K + 1);
  const g: BellGeo = { x0: X0 + bw / 2, x1: X1 - bw / 2, vmin: 0, vmax: K, base: BASE, peakH: H, sigmaRef: Math.sqrt(15) };
  const bell = ease(frame, [BELL - 4, BELL + 14], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <SceneTitle label="CHANGE THE AVERAGE" color={RATE} at={2} />
      <div style={{ position: "absolute", left: 540, top: 430, transform: "translate(-50%, -50%)" }}>
        <Pill label={`AVERAGE = ${lam} AN HOUR`} color={lam === 4 ? RATE : lam === 1 ? EVT : HI} size={34} glow={0.5} />
      </div>
      <CountBars vals={vals} x0={X0} x1={X1} base={BASE} h={H} scaleMax={1} color={lam === 15 ? HI : EVT} labelEvery={4} />
      {bell > 0.01 ? <Bell g={g} mu={15} sigma={Math.sqrt(15)} p={bell} color={C.text} fill={0} width={4} dashed /> : null}
      <Pop at={ONE + 6} out={FIFTEEN - 4} x={600} y={560} from="left" dist={16}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          MOSTLY <span style={{ color: EVT, textShadow: glowText(EVT, 0.5) }}>0 OR 1</span>
        </div>
      </Pop>
      <Pop at={BELL - 2} x={540} y={560} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          WIDER, AND <span style={{ color: HI, textShadow: glowText(HI, 0.5) }}>ALMOST A BELL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

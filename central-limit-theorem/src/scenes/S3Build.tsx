// SCENE 3 — WATCH IT BUILD. The exact distribution of the AVERAGE of n dice, all on the same 1–6 axis:
// 1 dice flat · 2 dice a triangle peaking at 3.5 · 5 dice rounder · 30 dice a clean, narrow bell centred on 3.5.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AreaChart, BarChart, diceSumDist } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, RAW } from "./S1Hook";

const C = theme.colors;
const PANELS = [
  { n: 1, cx: 300, cy: 650, label: "1 DICE", note: "FLAT" },
  { n: 2, cx: 780, cy: 650, label: "2 DICE", note: "PEAK AT 3.5" },
  { n: 5, cx: 300, cy: 1040, label: "5 DICE", note: "ROUNDER" },
  { n: 30, cx: 780, cy: 1040, label: "30 DICE", note: "A CLEAN BELL" },
];

export const S3Build: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const at = [s.sent(0).from, s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const notes = [s.cueS(0, "flat."), s.cueS(1, "35."), s.cueS(2, "Rounder."), s.cueS(3, "bell,")];

  return (
    <AbsoluteFill>
      <SceneTitle label="WATCH IT BUILD" pill="AVERAGE OF n DICE" color={MEANS} at={2} />
      {PANELS.map((pn, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(at[i] - 6, theme.spring.bouncy);
        const grow = ease(frame, [at[i] + 2, at[i] + 22], [0, 1], theme.ease.out);
        const col = pn.n === 30 ? MEANS : RAW;
        const x0 = pn.cx - 175;
        const x1 = pn.cx + 175;
        const base = pn.cy + 95;
        const d = diceSumDist(pn.n);
        const N = d.length;
        const half = (x1 - x0) / (N - 1) / 2;
        return (
          <React.Fragment key={pn.n}>
            <div style={{ position: "absolute", left: pn.cx - 220, top: pn.cy - 175, width: 440, height: 350, boxSizing: "border-box", borderRadius: 30, background: p > 0.01 ? `linear-gradient(180deg, ${alpha(col, 0.14)}, rgba(14,24,64,0.9))` : "transparent", border: p > 0.01 ? `3px solid ${alpha(col, 0.7)}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `scale(${p > 0.01 ? interpolate(p, [0, 1], [0.8, 1]) : 1})` }} />
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) }}>
                <div style={{ position: "absolute", left: pn.cx - 190, top: pn.cy - 150, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: col, whiteSpace: "nowrap" }}>{pn.label}</div>
                <div style={{ position: "absolute", left: x0 - 10, top: base + 1, width: x1 - x0 + 20, height: 3, background: alpha(C.text, 0.4) }} />
                <div style={{ position: "absolute", left: (x0 + x1) / 2 - 1.5, top: base - 200, height: 200, borderLeft: `3px dashed ${alpha("#F3F7FF", 0.45)}` }} />
                {pn.n < 30 ? <BarChart x0={x0 - half} x1={x1 + half} base={base} h={180} vals={d} color={col} p={grow} gap={pn.n === 5 ? 0.1 : 0.18} /> : <AreaChart x0={x0} x1={x1} base={base} h={180} xs={d.map((_, k) => k / (N - 1))} vals={d} color={col} p={grow} />}
                {["1", "3.5", "6"].map((l, k) => (
                  <div key={l} style={{ position: "absolute", left: x0 + k * 175, top: base + 26, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: k === 1 ? C.text : C.dim }}>{l}</div>
                ))}
              </div>
            ) : null}
            <Pop at={notes[i] - 4} x={pn.cx + 120} y={pn.cy - 136} from="down" dist={10} cfg={theme.spring.pop}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap", textShadow: glowText(col, 0.5) }}>{pn.note}</div>
            </Pop>
          </React.Fragment>
        );
      })}
      <Pop at={notes[3] + 10} x={540} y={1310} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          MORE DICE = <span style={{ color: MEANS, textShadow: glowText(MEANS, 0.5) }}>MORE BELL-SHAPED</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

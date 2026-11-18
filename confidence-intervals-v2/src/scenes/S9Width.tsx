// SCENE 9 — WHAT CHANGES THE WIDTH. MORE DATA: NARROWER (n = 100: ±2 · n = 400: ±1). MORE CONFIDENCE: WIDER
// (90%: ±1.6 · 95%: ±2 · 99%: ±2.6), all around 32 minutes.
import React from "react";
import { AbsoluteFill } from "remotion";
import { type Line, lx } from "../components/CI";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EST, MISS, RANGE, TRUE } from "./S1Hook";
import { Range } from "./S5Poll";

const C = theme.colors;
const G: Line = { x0: 330, x1: 930, vmin: 28, vmax: 36 };

const RowI: React.FC<{ y: number; at: number; label: string; m: number; c: string; note: string }> = ({ y, at, label, m, c, note }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 100, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: c, whiteSpace: "nowrap" }}>{label}</div>
      <Range g={G} y={y} m={32} lo={32 - m} hi={32 + m} p={p} color={c} thick={12} />
      <div style={{ position: "absolute", left: lx(G, 32) - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: C.text, opacity: Math.min(1, p * 2) }} />
      <div style={{ position: "absolute", left: lx(G, 32), top: y - 40, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.text }}>{note}</div>
    </>
  );
};

const Head: React.FC<{ y: number; at: number; children: React.ReactNode }> = ({ y, at, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.pop);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 12}px)`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>{children}</div>;
};

export const S9Width: React.FC = () => {
  const s = useScene("s9");
  const D = s.sent(1).from;
  const W = s.sent(2).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT CHANGES THE WIDTH" color={RANGE} at={2} />
      <Head y={400} at={D}>
        MORE DATA: <span style={{ color: TRUE, textShadow: glowText(TRUE, 0.5) }}>NARROWER</span>
      </Head>
      <RowI y={560} at={D + 4} label="n = 100" m={1.96} c={RANGE} note="± 2" />
      <RowI y={680} at={s.cueS(1, "four")} label="n = 400" m={0.98} c={TRUE} note="± 1" />
      <div style={{ position: "absolute", left: 90, top: 770, width: 900, height: 2, background: alpha(C.text, 0.12) }} />
      <Head y={820} at={W}>
        MORE CONFIDENCE: <span style={{ color: MISS, textShadow: glowText(MISS, 0.5) }}>WIDER</span>
      </Head>
      <RowI y={980} at={W + 4} label="90%" m={1.645} c={EST} note="± 1.6" />
      <RowI y={1100} at={W + 10} label="95%" m={1.96} c={RANGE} note="± 2" />
      <RowI y={1220} at={s.cueS(2, "99%")} label="99%" m={2.576} c={MISS} note="± 2.6" />
    </AbsoluteFill>
  );
};

// SCENE 5 — EXAMPLE 1: THE POLL. 52% ± 3% = 49% TO 55% on a number line; the true support (green "?") is likely inside.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type Line, lx } from "../components/CI";
import { ease, Pop, useSpr } from "../components/Motion";
import { ExampleTag } from "../components/Simple";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EST, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 150, x1: 930, vmin: 44, vmax: 60 };
const Y = 860;

export const PctAxis: React.FC<{ g: Line; y: number; ticks: number[]; p: number; label: string; unit?: string }> = ({ g, y, ticks, p, label, unit = "%" }) => (
  <>
    <div style={{ position: "absolute", left: g.x0 - 10, top: y, width: (g.x1 - g.x0 + 20) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
    {ticks.map((t) => (
      <React.Fragment key={t}>
        <div style={{ position: "absolute", left: lx(g, t) - 1.5, top: y - 8, width: 3, height: 20, background: alpha(C.text, 0.4), opacity: p }} />
        <div style={{ position: "absolute", left: lx(g, t), top: y + 34, transform: "translate(-50%, -50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim }}>{t}{unit}</div>
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: y + 70, textAlign: "center", opacity: p, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>{label}</div>
  </>
);

export const Range: React.FC<{ g: Line; y: number; m: number; lo: number; hi: number; p: number; color?: string; thick?: number }> = ({ g, y, m, lo, hi, p, color = RANGE, thick = 14 }) => {
  if (p <= 0.001) return null;
  const k = Math.min(1, p);
  const a = m + (lo - m) * k;
  const b = m + (hi - m) * k;
  return (
    <>
      <div style={{ position: "absolute", left: lx(g, a), top: y - thick / 2, width: lx(g, b) - lx(g, a), height: thick, borderRadius: thick / 2, background: color, boxShadow: `0 0 16px ${alpha(color, 0.6)}` }} />
      <div style={{ position: "absolute", left: lx(g, a) - 3, top: y - thick * 1.5, width: 6, height: thick * 3, borderRadius: 3, background: color }} />
      <div style={{ position: "absolute", left: lx(g, b) - 3, top: y - thick * 1.5, width: 6, height: thick * 3, borderRadius: 3, background: color }} />
    </>
  );
};

export const S5Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const EQ = s.sent(1).from;
  const RNG = s.cueS(1, "range");
  const TRU = s.sent(2).from;
  const axis = ease(frame, [EQ - 10, EQ + 6], [0, 1]);
  const dot = spr(EQ - 4, theme.spring.pop);
  const grow = spr(RNG - 4, theme.spring.bouncy);
  const truth = spr(TRU, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <ExampleTag n={1} at={s.sent(0).from} color={EST} label="THE POLL" y={290} />
      <Pop at={EQ - 2} x={540} y={470} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: EST }}>52%</span> <span style={{ color: RANGE }}>± 3%</span>
        </div>
      </Pop>
      <Pop at={RNG} x={540} y={570} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          = <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>49% TO 55%</span>
        </div>
      </Pop>
      <PctAxis g={G} y={Y} ticks={[44, 46, 49, 52, 55, 58, 60]} p={axis} label="SUPPORT FOR THE METRO LINE" />
      <Range g={G} y={Y - 70} m={52} lo={49} hi={55} p={grow} />
      {grow > 0.5 ? (
        <>
          <div style={{ position: "absolute", left: lx(G, 49), top: Y - 140, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: RANGE }}>49%</div>
          <div style={{ position: "absolute", left: lx(G, 55), top: Y - 140, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: RANGE }}>55%</div>
        </>
      ) : null}
      {dot > 0.01 ? <div style={{ position: "absolute", left: lx(G, 52) - 16, top: Y - 86, width: 32, height: 32, borderRadius: 16, background: EST, border: `3px solid ${C.text}`, boxShadow: `0 0 16px ${EST}`, transform: `scale(${dot})` }} /> : null}
      {truth > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: lx(G, 49), top: Y - 250, width: lx(G, 55) - lx(G, 49), height: 70, boxSizing: "border-box", borderRadius: 18, border: `3px dashed ${TRUE}`, background: alpha(TRUE, 0.1), opacity: Math.min(1, truth * 2), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: TRUE }}>?</div>
          <Pop at={TRU + 6} x={540} y={1060} from="up" dist={12} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              THE <span style={{ color: TRUE, textShadow: glowText(TRUE, 0.5) }}>TRUE SUPPORT</span> IS LIKELY IN HERE
            </div>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

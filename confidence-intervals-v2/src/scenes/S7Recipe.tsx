// SCENE 7 — THE RECIPE. Three formula rows: 1 ESTIMATE ± MARGIN OF ERROR · 2 MARGIN = 2 × STANDARD ERROR (1.96 to be
// exact) · 3 STANDARD ERROR = SPREAD ÷ √n. Then an OUR EXAMPLE panel that labels every number:
// SPREAD = 10 MIN · n = 100 ORDERS → STANDARD ERROR = 10 ÷ √100 = 10 ÷ 10 = 1 MIN → MARGIN = 2 × 1 = 2 MIN →
// 32 ± 2 = 30 TO 34 MIN.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EST, RANGE } from "./S1Hook";

const C = theme.colors;
const SPREADC = C.green;
const NC = C.orange;

const Row: React.FC<{ y: number; at: number; n: number; c: string; hot?: boolean; children: React.ReactNode }> = ({ y, at, n, c, hot, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 120, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(90deg, ${alpha(c, hot ? 0.3 : 0.16)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${hot ? c : alpha(c, 0.7)}`, boxShadow: hot ? `0 0 26px ${alpha(c, 0.4)}` : "none", display: "flex", alignItems: "center", gap: 24, paddingLeft: 28 }}>
      <div style={{ width: 50, height: 50, borderRadius: 25, flexShrink: 0, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.ink }}>{n}</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 10 }}>{children}</div>
    </div>
  );
};

const Line: React.FC<{ y: number; at: number; children: React.ReactNode }> = ({ y, at, children }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, transform: `translateY(-50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.8, 1])})`, opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>{children}</div>
  );
};

const Chip: React.FC<{ at: number; c: string; label: string; value: string }> = ({ at, c, label, value }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  return (
    <div style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, padding: "10px 22px", borderRadius: 18, background: alpha(c, 0.18), border: `3px solid ${c}`, textAlign: "center" }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: c }}>{label}</div>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text }}>{value}</div>
    </div>
  );
};

export const S7Recipe: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const EX = s.sent(3).from;
  const SPREAD = s.cueS(3, "spread");
  const N = s.cueS(3, "100.");
  const SE = s.sent(4).from;
  const MG = s.sent(5).from;
  const RES = s.sent(5).to - 4;
  const panel = spr(EX - 6, theme.spring.smooth);
  const res = spr(RES, theme.spring.pop);
  const seHot = frame >= SE - 4 && frame < MG - 4;
  const mgHot = frame >= MG - 4;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE RECIPE" pill="ALWAYS THE SAME" color={RANGE} at={2} pillAt={s.sent(0).from} />
      <Row y={492} at={s.cueS(0, "estimate,")} n={1} c={EST}>
        <span style={{ color: EST }}>ESTIMATE</span> ± <span style={{ color: RANGE }}>MARGIN OF ERROR</span>
      </Row>
      <Row y={628} at={s.sent(1).from} n={2} c={RANGE} hot={mgHot}>
        MARGIN = <span style={{ fontFamily: theme.fonts.mono, color: RANGE }}>2</span> × STANDARD ERROR
      </Row>
      <div style={{ position: "absolute", left: 0, right: 0, top: 698, textAlign: "center", opacity: Math.min(1, spr(s.sent(1).from + 12, theme.spring.smooth)), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>FOR 95%: 1.96 TO BE EXACT</div>
      <Row y={774} at={s.sent(2).from} n={3} c={C.green} hot={seHot}>
        STANDARD ERROR = <span style={{ color: SPREADC }}>SPREAD</span> ÷ <Radical color={NC} size={38}>
          <span style={{ color: NC }}>n</span>
        </Radical>
      </Row>
      {/* worked example */}
      {panel > 0.001 ? (
        <div style={{ position: "absolute", left: 90, top: 870, width: 900, height: 490, boxSizing: "border-box", borderRadius: 30, background: "linear-gradient(180deg, rgba(30,44,104,0.92), rgba(14,24,64,0.92))", border: `2px solid ${alpha(C.yellow, 0.55)}`, opacity: Math.min(1, panel * 1.5), transform: `translateY(${(1 - Math.min(1, panel)) * 24}px)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: C.yellow }}>OUR EXAMPLE: DELIVERY TIMES</div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 928, display: "flex", justifyContent: "center", gap: 24 }}>
        <Chip at={SPREAD} c={SPREADC} label="SPREAD (SD)" value="10 MIN" />
        <Chip at={N} c={NC} label="SAMPLE SIZE n" value="100" />
      </div>
      <Line y={1106} at={SE}>
        <span style={{ fontSize: 26, color: C.dim, letterSpacing: "0.06em" }}>STD ERROR =</span>
        <span style={{ fontFamily: theme.fonts.mono, color: SPREADC }}>10</span>
        <span>÷</span>
        <Radical color={NC} size={36}>
          <span style={{ fontFamily: theme.fonts.mono, color: NC }}>100</span>
        </Radical>
        <span>=</span>
        <span style={{ fontFamily: theme.fonts.mono }}>10 ÷ 10</span>
        <span>=</span>
        <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>1 MIN</span>
      </Line>
      <Line y={1194} at={MG}>
        <span style={{ fontSize: 26, color: C.dim, letterSpacing: "0.06em" }}>MARGIN =</span>
        <span style={{ fontFamily: theme.fonts.mono }}>2 × 1</span>
        <span>=</span>
        <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>2 MIN</span>
      </Line>
      {res > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1290, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, res), [0, 1], [0.6, 1])})`, opacity: Math.min(1, res * 2), padding: "10px 30px", borderRadius: 999, background: alpha(RANGE, 0.22), border: `3px solid ${RANGE}`, boxShadow: `0 0 26px ${alpha(RANGE, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          32 ± 2 = <span style={{ color: RANGE }}>30 TO 34 MIN</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

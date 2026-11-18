// SCENE 8 — TWO INTERVIEW TRAPS. 1: "p = 0.01 = 1% CHANCE THE NULL IS TRUE" struck out → it's the chance of the DATA,
// IF THE NULL WERE TRUE. 2: SMALL p ≠ BIG EFFECT → it only says the effect is probably not zero.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NotEqual } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, NULLC, PLess, PV } from "./S1Hook";

const C = theme.colors;

const Trap: React.FC<{ y: number; h: number; at: number; n: number; children: React.ReactNode }> = ({ y, h, at, n, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: h, transform: `translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: "linear-gradient(180deg, rgba(26,40,98,0.92), rgba(14,24,64,0.92))", border: `2px solid ${alpha(C.red, 0.6)}` }}>
      <div style={{ position: "absolute", left: 30, top: 26, display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.red }}>
        <span style={{ width: 40, height: 40, borderRadius: 20, background: C.red, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontSize: 24, color: C.ink, letterSpacing: 0 }}>{n}</span>
        TRAP {n}
      </div>
      {children}
    </div>
  );
};

export const S8Traps: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const T1 = s.sent(1).from;
  const NOT1 = s.cueS(1, "not");
  const DATA = s.cueS(1, "data,");
  const T2 = s.sent(2).from;
  const ZERO = s.cueS(2, "zero.");
  const strike = ease(frame, [NOT1 + 4, NOT1 + 16], [0, 1]);
  const spr = useSpr();
  const truth = spr(DATA - 6, theme.spring.pop);
  const z = spr(ZERO - 8, theme.spring.pop);
  return (
    <AbsoluteFill>
      <SceneTitle label="2 INTERVIEW TRAPS" color={C.red} at={2} />
      <Pop at={s.sent(0).from + 2} x={540} y={400} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          INTERVIEWERS <span style={{ color: C.red }}>LOVE</span> THESE
        </div>
      </Pop>
      <Trap y={470} h={400} at={T1} n={1}>
        <div style={{ position: "absolute", left: 30, top: 90, display: "flex", alignItems: "center", gap: 16 }}>
          <PLess v="0.01" size={44} />
          <span style={{ position: "relative", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
            = 1% CHANCE NULL IS TRUE
            <span style={{ position: "absolute", left: -6, top: "52%", width: `${strike * 104}%`, height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${C.red}` }} />
          </span>
          <Mark kind="cross" at={NOT1 + 10} size={44} color={C.red} width={9} />
        </div>
        {truth > 0.01 ? (
          <div style={{ position: "absolute", left: 30, right: 30, top: 190, opacity: Math.min(1, truth * 2), padding: "20px 24px", borderRadius: 20, background: alpha(LINE, 0.14), border: `2px solid ${LINE}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: LINE }}>
              <Mark kind="check" at={DATA} size={30} color={LINE} width={7} />
              WHAT IT REALLY IS
            </div>
            <div style={{ marginTop: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, lineHeight: 1.2, color: C.text }}>
              the chance of the <span style={{ color: PV, textShadow: glowText(PV, 0.4) }}>DATA</span>, if the <span style={{ color: NULLC }}>NULL</span> were true
            </div>
          </div>
        ) : null}
      </Trap>
      <Trap y={910} h={340} at={T2} n={2}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          <span>
            SMALL <span style={{ fontStyle: "italic", color: PV }}>p</span>
          </span>
          <NotEqual size={50} color={C.red} />
          <span>
            BIG <span style={{ color: EXT }}>EFFECT</span>
          </span>
        </div>
        {z > 0.01 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", opacity: Math.min(1, z * 2), fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: C.text }}>
            it only says the effect is <span style={{ color: LINE }}>probably not zero</span>
          </div>
        ) : null}
      </Trap>
    </AbsoluteFill>
  );
};

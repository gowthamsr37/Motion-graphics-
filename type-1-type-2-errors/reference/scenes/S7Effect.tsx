// SCENE 7 — SIZE MATTERS TOO. TINY p ≠ BIG EFFECT. 10 million users each: A converts 10.00%, B 10.05% (bars look
// identical). Difference: just 0.05 points, yet p = 0.0002, shown as p < 0.001 (two-proportion z-test, z = 3.72) → ALWAYS CHECK THE EFFECT SIZE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NotEqual, PeopleGlyph } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, NULLC, PLess, PV } from "./S1Hook";

const C = theme.colors;
const BX = 250;
const BW = 560; // 10.05% → about full width

export const S7Effect: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const TINY = s.cueS(0, "tiny");
  const BIG = s.cueS(0, "big");
  const MIL = s.cueS(1, "millions");
  const DIFF = s.cueS(1, "difference");
  const PVW = s.cueS(1, "p-value.");
  const CHECK = s.cueS(1, "check");
  const bars = [
    { k: "A", v: 10.0, c: NULLC },
    { k: "B", v: 10.05, c: PV },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle label="SIZE MATTERS TOO" color={EXT} at={2} />
      <Pop at={TINY - 4} x={540} y={400} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          <span>
            TINY <span style={{ fontStyle: "italic", color: PV, textShadow: glowText(PV, 0.5) }}>p</span>
          </span>
          <NotEqual size={52} color={C.red} />
          <span style={{ opacity: Math.min(1, ease(frame, [BIG - 6, BIG + 2], [0, 1])) }}>
            BIG <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>EFFECT</span>
          </span>
        </div>
      </Pop>
      <Pop at={MIL - 6} x={540} y={560} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 26px", borderRadius: 999, background: alpha(C.text, 0.08), border: `2px solid ${C.edge}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap" }}>
          <PeopleGlyph size={40} color={NULLC} />
          10 MILLION USERS IN EACH GROUP
        </div>
      </Pop>
      {bars.map((b, i) => {
        const p = ease(frame, [MIL + i * 6, MIL + i * 6 + 22], [0, 1], theme.ease.out);
        if (p <= 0) return null;
        const y = 710 + i * 120;
        return (
          <React.Fragment key={b.k}>
            <div style={{ position: "absolute", left: BX - 70, top: y, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: b.c }}>{b.k}</div>
            <div style={{ position: "absolute", left: BX - 20, top: y - 34, width: (b.v / 10.05) * BW * p, height: 68, borderRadius: "6px 18px 18px 6px", background: alpha(b.c, 0.45), border: `3px solid ${b.c}`, boxSizing: "border-box", boxShadow: `0 0 18px ${alpha(b.c, 0.35)}` }} />
            <div style={{ position: "absolute", left: BX - 20 + BW + 24, top: y, transform: "translateY(-50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: C.text }}>{b.v.toFixed(2)}%</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 905, textAlign: "center", opacity: ease(frame, [MIL + 20, MIL + 32], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>CONVERSION RATE</div>
      <Pop at={DIFF - 6} x={540} y={1010} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          DIFFERENCE: <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>JUST 0.05 POINTS</span>
        </div>
      </Pop>
      <Pop at={PVW - 6} x={540} y={1125} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ padding: "12px 34px", borderRadius: 999, background: alpha(PV, 0.2), border: `4px solid ${PV}`, boxShadow: `0 0 30px ${alpha(PV, 0.4)}` }}>
          <PLess v="0.001" size={52} op="<" />
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.dim }}> TINY</span>
        </div>
      </Pop>
      <Pop at={CHECK - 6} x={540} y={1265} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={LINE} size={30}>
          ALWAYS CHECK THE EFFECT SIZE
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

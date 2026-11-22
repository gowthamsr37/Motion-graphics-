// SCENE 5 — THE TEXTBOOK DEFINITION. A definition card builds line by line on the spoken words: LARGE ENOUGH RANDOM SAMPLES
// → THE SAMPLE MEANS → ARE APPROXIMATELY NORMAL → WHATEVER THE SHAPE OF THE DATA; three raw shapes (skewed, flat, yes/no)
// each arrow into the same bell; then the two conditions: 1 INDEPENDENT SAMPLES · 2 LARGE ENOUGH (30 OR MORE).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BarsIcon, CurveIcon } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { Mark, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { skew } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const bellF = (x: number) => Math.exp(-((x - 0.5) ** 2) / 0.03);

export const S5Define: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const L = [s.cueS(1, "large"), s.cueS(1, "means"), s.cueS(1, "normal,"), s.cueS(1, "whatever")];
  const IND = s.cueS(2, "independent,");
  const BIG = s.cueS(2, "30");
  const lines: [string, React.ReactNode][] = [
    ["TAKE", <span key="a">LARGE ENOUGH <span style={{ color: C.cyan }}>RANDOM SAMPLES</span></span>],
    ["THEN", <span key="b">THE <span style={{ color: C.yellow }}>SAMPLE MEANS</span></span>],
    ["ARE", <span key="c">APPROXIMATELY <span style={{ color: C.green }}>NORMAL</span></span>],
    ["FOR", <span key="d">ANY SHAPE OF <span style={{ color: C.orange }}>ORIGINAL DATA</span></span>],
  ];
  const card = spr(s.sent(0).from - 4, theme.spring.smooth);
  return (
    <AbsoluteFill>
      <Pop at={s.sent(0).from - 6} x={540} y={300} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Pill label="THE TEXTBOOK DEFINITION" color={C.violet} size={36} glow={0.6} />
      </Pop>
      <div style={{ position: "absolute", left: 90, top: 380, width: 900, height: 420, borderRadius: 30, background: "rgba(14,24,64,0.88)", border: `3px solid ${alpha(C.violet, 0.6)}`, opacity: Math.min(1, card * 1.5) }} />
      {lines.map(([k, v], i) => (
        <Pop key={k} at={L[i] - 6} x={540} y={450 + i * 95} from="left" dist={40} cfg={theme.spring.bouncy}>
          <div style={{ width: 820, display: "flex", alignItems: "baseline", gap: 22, whiteSpace: "nowrap" }}>
            <span style={{ width: 70, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>{k}</span>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>{v}</span>
          </div>
        </Pop>
      ))}
      {/* three raw shapes → one bell */}
      {[
        <CurveIcon key="s" color={C.orange} f={(x) => skew(x * 4) * 4} w={120} h={60} />,
        <CurveIcon key="u" color={C.orange} f={() => 0.6} w={120} h={60} />,
        <BarsIcon key="b" color={C.orange} vals={[0.52, 0.48]} w={120} h={60} />,
      ].map((ic, i) => (
        <Pop key={i} at={L[3] + i * 6} x={170 + i * 250} y={890} from="up" dist={20} cfg={theme.spring.pop}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {ic}
            <div style={{ opacity: frame > L[3] + 18 + i * 6 ? 1 : 0 }}>
              <Arrow size={28} color={C.dim} />
            </div>
          </div>
        </Pop>
      ))}
      <Pop at={L[3] + 30} x={900} y={890} from="scale" scaleFrom={0.4} cfg={theme.spring.bouncy}>
        <div style={{ padding: "8px 14px", borderRadius: 18, border: `3px solid ${C.green}`, background: alpha(C.green, 0.12) }}>
          <CurveIcon color={C.green} f={bellF} w={120} h={60} />
        </div>
      </Pop>
      {/* conditions */}
      <Pop at={s.sent(2).from - 6} x={540} y={1010} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: C.dim }}>TWO CONDITIONS</div>
      </Pop>
      {[
        { at: IND, n: 1, t: "INDEPENDENT SAMPLES", c: C.cyan },
        { at: BIG, n: 2, t: "LARGE ENOUGH: 30 OR MORE", c: C.yellow },
      ].map((r) => (
        <Pop key={r.n} at={r.at - 8} x={540} y={1010 + r.n * 110} from="left" dist={50} cfg={theme.spring.bouncy}>
          <div style={{ width: 820, height: 90, boxSizing: "border-box", borderRadius: 24, padding: "0 28px", background: `linear-gradient(90deg, ${alpha(r.c, 0.22)}, rgba(14,24,64,0.94))`, border: `3px solid ${r.c}`, display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: r.c, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32 }}>{r.n}</div>
            <div style={{ flex: 1, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", textShadow: glowText(r.c, 0.3) }}>{r.t}</div>
            <Mark kind="check" at={r.at + 4} size={44} color={C.green} />
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

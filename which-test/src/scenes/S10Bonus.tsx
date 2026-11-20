// SCENE 10 — BONUS: NOT NORMAL? t-tests and ANOVA assume roughly normal data. Small + skewed → swap:
// 2-SAMPLE t → MANN-WHITNEY U · PAIRED t → WILCOXON · ANOVA → KRUSKAL-WALLIS.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CurveIcon } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { G2, G3 } from "../components/Tests";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const skew = (u: number) => Math.pow(u * 6, 1.6) * Math.exp(-u * 6) / 1.25;

const Swap: React.FC<{ y: number; at: number; from: string; to: string; c: string }> = ({ y, at, from, to, c }) => {
  const spr = useSpr();
  const a = spr(at - 8, theme.spring.bouncy);
  const b = spr(at, theme.spring.pop);
  if (a <= 0.001) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: y - 55, width: 900, height: 110, boxSizing: "border-box", borderRadius: 26, background: "rgba(14,24,64,0.88)", border: `2px solid ${alpha(c, 0.6)}`, opacity: Math.min(1, a * 2), transform: `translateX(${(1 - Math.min(1, a)) * -40}px)` }} />
      <div style={{ position: "absolute", left: 130, top: y, transform: "translateY(-50%)", opacity: Math.min(1, a * 2) * (1 - 0.45 * Math.min(1, b)), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap", textDecoration: b > 0.5 ? "line-through" : "none", textDecorationColor: alpha(C.text, 0.6) }}>{from}</div>
      <div style={{ position: "absolute", left: 455, top: y - 18, opacity: Math.min(1, b * 2) }}>
        <Arrow size={60} color={c} />
      </div>
      {b > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: y, transform: `translateY(-50%) scale(${interpolate(Math.min(1, b), [0, 1], [1.4, 1])})`, transformOrigin: "left center", opacity: Math.min(1, b * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: c, textShadow: glowText(c, 0.45), whiteSpace: "nowrap" }}>{to}</div>
      ) : null}
    </>
  );
};

export const S10Bonus: React.FC = () => {
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <SceneTitle label="BONUS: NOT NORMAL?" pill="INTERVIEW TIP" color={G3} at={2} pillAt={s.sent(0).from} />
      <Pop at={s.cueS(0, "normal.") - 6} x={540} y={470} from="up" dist={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, whiteSpace: "nowrap" }}>
          <CurveIcon color={C.cyan} f={(u) => Math.exp(-Math.pow((u - 0.5) * 5, 2) / 2)} w={120} h={60} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text }}>t-TESTS & ANOVA ASSUME NORMAL DATA</div>
        </div>
      </Pop>
      <Pop at={s.sent(1).from - 4} x={540} y={600} from="up" dist={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, whiteSpace: "nowrap" }}>
          <CurveIcon color={C.orange} f={skew} w={120} h={60} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text }}>
            SMALL + SKEWED? <span style={{ color: C.orange }}>SWAP:</span>
          </div>
        </div>
      </Pop>
      <Swap y={760} at={s.cueS(1, "Mann-Whitney")} from="2-SAMPLE t" to="MANN-WHITNEY U" c={G2} />
      <Swap y={900} at={s.cueS(1, "Wilcoxon")} from="PAIRED t" to="WILCOXON" c={G2} />
      <Swap y={1040} at={s.cueS(1, "Kruskal-Wallis")} from="ANOVA" to="KRUSKAL-WALLIS" c={G3} />
      <Pop at={s.cueS(1, "Kruskal-Wallis") + 24} x={540} y={1180} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>THEY COMPARE RANKS, NOT AVERAGES</div>
      </Pop>
    </AbsoluteFill>
  );
};

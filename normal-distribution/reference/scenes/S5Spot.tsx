// SCENE 5 — HOW TO SPOT IT. Compare mean and median: mean > median → right skew (our city: ₹50K > ₹30K);
// mean < median → left skew. Or read a box plot: the longer whisker points to the tail.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bars, type Geo, RIGHT } from "../components/Hist";
import { Arrow, Rupee } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { SHAPE } from "./S3Shapes";

const C = theme.colors;
const MEAN = kindColor.mean;
const MED = kindColor.median;
const V = kindColor.spread;
const X = (v: number) => 150 + v * 60;
const G: Geo = { x0: X(1) - 24, bw: 48, gap: 12, base: 1030, maxH: 190, maxC: 13 };
const BOX_Y = 1130;

const Rule: React.FC<{ y: number; sign: string; at: number; resAt: number; label: string; col: string }> = ({ y, sign, at, resAt, label, col }) => (
  <>
    <Pop at={at} x={330} y={y} from="left" dist={30} cfg={theme.spring.bouncy}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
        <span style={{ color: MEAN }}>MEAN</span>
        <span style={{ color: col }}>{sign}</span>
        <span style={{ color: MED }}>MEDIAN</span>
      </div>
    </Pop>
    <Pop at={resAt - 6} x={640} y={y} from="scale" scaleFrom={0.3}>
      <Arrow size={44} color={col} />
    </Pop>
    <Pop at={resAt - 3} x={830} y={y} from="right" dist={30} cfg={theme.spring.bouncy}>
      <Pill label={label} color={col} size={30} glow={0.6} />
    </Pop>
  </>
);

export const S5Spot: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const COMP = s.cueS(0, "compare");
  const ABOVE = s.cueS(1, "above");
  const RIGHTW = s.cueS(1, "Right");
  const BELOW = s.cueS(1, "Below");
  const LEFTW = s.cueS(1, "Left");
  const BOX = s.cueS(2, "box");
  const WHISK = s.cueS(2, "whisker");

  const hist = ease(frame, [BOX - 8, BOX + 8], [0, 1]);
  const box = spr(BOX - 2, theme.spring.bouncy);
  const wl = ease(frame, [BOX + 4, BOX + 16], [0, 1], theme.ease.inOut);
  const long = ease(frame, [WHISK - 4, WHISK + 10], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="HOW TO SPOT IT" color={MEAN} at={2} />
      <Pop at={COMP - 4} out={ABOVE - 6} x={540} y={640} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Pill label="MEAN" color={MEAN} size={40} glow={0.6} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text }}>vs</span>
          <Pill label="MEDIAN" color={MED} size={40} glow={0.6} />
        </div>
      </Pop>
      <Rule y={600} sign=">" at={ABOVE - 4} resAt={RIGHTW} label="RIGHT SKEW" col={SHAPE.right} />
      <Pop at={RIGHTW + 6} x={540} y={672} from="up" dist={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim, whiteSpace: "nowrap" }}>
          our city: mean <Rupee size={22} color={C.dim} />50K &gt; median <Rupee size={22} color={C.dim} />30K
          <Mark kind="check" at={RIGHTW + 10} size={26} color={MED} width={14} />
        </div>
      </Pop>
      <Rule y={770} sign="<" at={BELOW - 4} resAt={LEFTW} label="LEFT SKEW" col={SHAPE.left} />

      {/* or read a box plot */}
      {hist > 0.01 ? (
        <AbsoluteFill style={{ opacity: hist * 0.5 }}>
          <Bars g={G} counts={RIGHT} color={C.cyan} tailColor={SHAPE.right} tail={6} />
        </AbsoluteFill>
      ) : null}
      {box > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: X(0.4), top: BOX_Y + 64, width: X(12.6) - X(0.4), height: 3, background: alpha(C.text, 0.3), opacity: box }} />
          <div style={{ position: "absolute", left: X(3), top: BOX_Y - 32, width: (X(7) - X(3)) * Math.min(1, box), height: 64, boxSizing: "border-box", borderRadius: 10, background: alpha(V, 0.25), border: `4px solid ${V}`, boxShadow: `0 0 20px ${alpha(V, 0.4)}` }} />
          <div style={{ position: "absolute", left: X(4) - 2, top: BOX_Y - 32, height: 64 * Math.min(1, box), borderLeft: `4px solid ${MED}` }} />
          {/* whiskers: 1 → 3 (short) and 7 → 12 (long) */}
          <div style={{ position: "absolute", left: X(3) - (X(3) - X(1)) * wl, top: BOX_Y - 2, width: (X(3) - X(1)) * wl, height: 4, background: V }} />
          <div style={{ position: "absolute", left: X(7), top: BOX_Y - 2, width: (X(12) - X(7)) * wl, height: 4, background: long > 0.5 ? SHAPE.right : V, boxShadow: long > 0.5 ? `0 0 12px ${SHAPE.right}` : "none" }} />
          {wl > 0.95 ? (
            <>
              <div style={{ position: "absolute", left: X(1) - 2, top: BOX_Y - 18, width: 4, height: 36, background: V }} />
              <div style={{ position: "absolute", left: X(12) - 2, top: BOX_Y - 18, width: 4, height: 36, background: long > 0.5 ? SHAPE.right : V }} />
            </>
          ) : null}
        </>
      ) : null}
      <Pop at={WHISK - 2} x={(X(7) + X(12)) / 2} y={BOX_Y - 62} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: SHAPE.right, textShadow: glowText(SHAPE.right, 0.4), whiteSpace: "nowrap" }}>
          LONG WHISKER = TAIL <Arrow size={28} color={SHAPE.right} />
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// SCENE 4 — ANY SHAPE. Waiting times at a bus stop (exponential, mean 5 min): right-skewed with a long tail.
// The averages of 30 waiting times (exact Gamma density) on the same axis: a narrow bell centred on 5 min.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AreaChart, BarChart, meanOfExpPdf } from "../components/Clt";
import { Arrow, Bus } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, SKEW } from "./S1Hook";

const C = theme.colors;
const X0 = 150;
const X1 = 930;
const MAXT = 20;
const tx = (t: number) => X0 + (t / MAXT) * (X1 - X0);
// waiting-time bins of 1 minute, exponential with mean 5
const EXP = Array.from({ length: MAXT }, (_, a) => Math.exp(-a / 5) - Math.exp(-(a + 1) / 5));
const XS = Array.from({ length: 201 }, (_, i) => i / 200);
const MEAN30 = XS.map((u) => meanOfExpPdf(30, 5, u * MAXT));

const Axis: React.FC<{ base: number; p: number }> = ({ base, p }) => (
  <>
    <div style={{ position: "absolute", left: X0 - 10, top: base + 1, width: (X1 - X0 + 20) * p, height: 3, background: alpha(C.text, 0.4) }} />
    {[0, 5, 10, 15, 20].map((t) => (
      <div key={t} style={{ position: "absolute", left: tx(t), top: base + 26, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: t === 5 ? C.text : C.dim, opacity: p }}>{t}</div>
    ))}
    <div style={{ position: "absolute", left: X1 + 14, top: base + 26, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, color: C.dim, opacity: p }}>min</div>
  </>
);

export const S4AnyShape: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const WAIT = s.sent(1).from;
  const TAIL = s.cueS(1, "tail");
  const AVG = s.sent(2).from;
  const BELLW = s.cueS(2, "bell");
  const top = spr(WAIT - 6, theme.spring.smooth);
  const bot = spr(AVG - 6, theme.spring.smooth);
  const BASE1 = 860;
  const BASE2 = 1250;

  return (
    <AbsoluteFill>
      <Pop at={s.sent(0).from - 2} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SKEW, textShadow: glowText(SKEW, 0.5) }}>SKEWED</span> DATA TOO?
        </div>
      </Pop>
      {/* the skewed source */}
      {top > 0.01 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, top * 2) }}>
          <div style={{ position: "absolute", left: 120, top: 540, display: "flex", alignItems: "center", gap: 16 }}>
            <Bus w={90} color={SKEW} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>WAITING TIMES</div>
          </div>
          <BarChart x0={X0} x1={X1} base={BASE1} h={250} vals={EXP} color={SKEW} p={ease(frame, [WAIT, WAIT + 20], [0, 1])} gap={0.14} />
          <Axis base={BASE1} p={ease(frame, [WAIT - 4, WAIT + 10], [0, 1])} />
          <Pop at={TAIL - 2} x={tx(14)} y={BASE1 - 90} from="left" dist={14} cfg={theme.spring.pop}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: SKEW, textShadow: glowText(SKEW, 0.4), whiteSpace: "nowrap" }}>LONG TAIL <Arrow size={30} color={SKEW} /></div>
          </Pop>
        </div>
      ) : null}
      {/* the averages of 30 */}
      {bot > 0.01 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, bot * 2) }}>
          <div style={{ position: "absolute", left: 120, top: 950, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
            AVERAGES OF <span style={{ color: MEANS }}>30</span>
          </div>
          <AreaChart x0={X0} x1={X1} base={BASE2} h={250} xs={XS} vals={MEAN30} color={MEANS} p={ease(frame, [AVG + 4, AVG + 24], [0, 1], theme.ease.out)} />
          <Axis base={BASE2} p={ease(frame, [AVG - 2, AVG + 12], [0, 1])} />
          <Pop at={BELLW - 2} x={tx(12)} y={BASE2 - 140} from="left" dist={14} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: MEANS, textShadow: glowText(MEANS, 0.5), whiteSpace: "nowrap" }}>A BELL AGAIN!</div>
          </Pop>
        </div>
      ) : null}
      {/* the mean, 5 min, on both */}
      <div style={{ position: "absolute", left: tx(5) - 1.5, top: 600, height: 650 * ease(frame, [AVG + 8, AVG + 24], [0, 1]), borderLeft: `3px dashed ${alpha("#F3F7FF", 0.6)}` }} />
    </AbsoluteFill>
  );
};

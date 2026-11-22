// SCENE 4 — USE 2: A/B TESTS. A right-skewed CUSTOMER SPEND histogram (most spend a little, a few a lot); then two bells of
// AVERAGE SPEND (version A green, version B orange) side by side; a simple z / t test compares them.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve } from "../components/Curve";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { skew, UseDots, UseHeader, USES } from "../components/Uses";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[1];
const GS = { x0: 140, x1: 940, vmin: 0, vmax: 5, base: 830, h: 230 };
const GB = { x0: 140, x1: 940, vmin: 0, vmax: 10, base: 1170, h: 210 };

export const S4AB: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const SK = s.cueS(1, "skewed:");
  const AV = s.cueS(2, "average");
  const raw = ease(frame, [SK - 8, SK + 20], [0, 1], theme.ease.inOut);
  const b1 = ease(frame, [AV - 4, AV + 20], [0, 1], theme.ease.inOut);
  const b2 = ease(frame, [AV + 10, AV + 34], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <UseDots idx={1} />
      <UseHeader u={U} at={s.sent(0).from} />
      <FnCurve g={GS} f={skew} fmax={0.23} p={raw} color={U.c} fill={0.3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GS.base + 14, textAlign: "center", opacity: raw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: U.c }}>ONE CUSTOMER&apos;S SPEND: VERY SKEWED</div>
      <Pop at={s.cueS(1, "few") - 4} x={800} y={700} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.dim }}>A FEW BIG SPENDERS</div>
      </Pop>
      <FnCurve g={GB} f={(v) => Math.exp(-((v - 4.2) ** 2) / (2 * 0.55 * 0.55))} fmax={1} p={b1} color={C.green} fill={0.2} />
      <FnCurve g={GB} f={(v) => Math.exp(-((v - 5.6) ** 2) / (2 * 0.55 * 0.55))} fmax={1} p={b2} color={U.c} fill={0.2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GB.base + 14, textAlign: "center", opacity: b1, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.text }}>
          AVERAGE SPEND OVER THOUSANDS: <span style={{ color: C.green }}>A</span> vs <span style={{ color: U.c }}>B</span>, BOTH BELLS
      </div>
      <Pop at={s.cueS(2, "z") - 4} x={540} y={1290} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={U.c} size={30}>
          SO A SIMPLE z OR t TEST CAN COMPARE THEM
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};

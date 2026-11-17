// SCENE 6 — ROLLING UNTIL A SIX. One run (3, 1, 5, 6 → 4 tries). Then the geometric bars: roll 1 = 17%, roll 2 = 14%,
// roll 3 = 12%, then the rest step down; the most likely roll is the very first (crown).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Badge } from "../components/Curve";
import { Crown } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { exitP, Pop, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GeoBars, gTop, GX } from "./GeoBars";
import { RUN, TRY, YES } from "./S1Hook";

const C = theme.colors;

export const S6Rolling: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const FIRST = s.cueS(1, "first");
  const SECOND = s.cueS(2, "second");
  const THIRD = s.cueS(2, "third?");
  const STEP = s.sent(3).from;
  const SURPRISE = s.sent(4).from;
  const runOut = exitP(frame, FIRST - 8, 10);
  const growAt = [FIRST - 4, SECOND - 4, THIRD - 4, ...Array.from({ length: 9 }, (_, i) => STEP + i * 3)];
  const hi: Record<number, string> = frame >= SURPRISE ? { 1: YES } : {};

  return (
    <AbsoluteFill>
      <SceneTitle label="ROLLING UNTIL A SIX" color={TRY} at={2} />
      {runOut < 1
        ? RUN.map((v, i) => {
            const p = spr(8 + i * 8, theme.spring.bouncy);
            if (p <= 0.001) return null;
            return (
              <div key={i} style={{ position: "absolute", left: 270 + i * 180, top: 760, transform: `translate(-50%, -50%) scale(${p * (1 - runOut * 0.3)})`, opacity: 1 - runOut, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Die value={v} size={120} color={v === 6 ? YES : C.orange} glow={v === 6 ? 1 : 0} />
                <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: v === 6 ? YES : C.dim }}>TRY {i + 1}</div>
              </div>
            );
          })
        : null}
      <Pop at={44} out={FIRST - 8} x={540} y={960} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          THIS TIME: <span style={{ color: YES, textShadow: glowText(YES, 0.5) }}>4 TRIES</span>
        </div>
      </Pop>
      <GeoBars growAt={growAt} hi={hi} />
      <Badge x={GX(1)} y={gTop(1) - 40} p={spr(FIRST + 6, theme.spring.pop)} color={YES} size={28}>17%</Badge>
      <Badge x={GX(2) + 18} y={gTop(2) - 40} p={spr(SECOND + 6, theme.spring.pop)} color={TRY} size={26}>14%</Badge>
      <Badge x={GX(3) + 30} y={gTop(3) - 40} p={spr(THIRD + 6, theme.spring.pop)} color={TRY} size={26}>12%</Badge>
      <Pop at={STEP + 6} out={SURPRISE - 4} x={540} y={560} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          EACH EXTRA ROLL: <span style={{ color: TRY }}>A BIT LESS LIKELY</span>
        </div>
      </Pop>
      <Pop at={SURPRISE + 4} x={GX(1) + 30} y={gTop(1) - 120} from="scale" scaleFrom={0.4} cfg={theme.spring.pop}>
        <Crown size={64} color={YES} />
      </Pop>
      <Pop at={SURPRISE + 8} x={560} y={560} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          MOST LIKELY: <span style={{ color: YES, textShadow: glowText(YES, 0.5) }}>ROLL 1!</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

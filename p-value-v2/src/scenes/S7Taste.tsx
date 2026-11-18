// SCENE 7 — EXAMPLE 3: A TASTE TEST. A friend claims they can tell two cola brands apart; blindfolded they get 10 OUT OF
// 10 RIGHT (ten ticks). NULL: JUST GUESSING (50/50) → a guesser gets 10/10 about 1 time in 1,000 ((1/2)^10 = 1/1024)
// → p = 0.001 → FAR BELOW 0.05: SIGNIFICANT.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Mark, Pop, useSpr } from "../components/Motion";
import { ExampleTag } from "../components/Simple";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { LINE, NULLC, PPill } from "./S1Hook";
import { Cups } from "./S3Null";

const C = theme.colors;

export const S7Taste: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const CLAIM = s.sent(1).from;
  const TEN = s.cueS(1, "10");
  const NULLS = s.sent(2).from;
  const THOUS = s.cueS(2, "1,000.");
  const PW = s.cueS(3, "0.001.");
  const SIG = s.cueS(3, "significant.");
  const cups = spr(CLAIM - 4, theme.spring.bouncy);
  const ticks = Math.max(0, Math.min(10, Math.floor((frame - TEN + 2) / 3) + 1));
  const sig = spr(SIG - 4, theme.spring.pop);
  return (
    <AbsoluteFill>
      <ExampleTag n={3} at={s.sent(0).from} color={LINE} label="A TASTE TEST" y={290} />
      {cups > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 470, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cups), [0, 1], [0.5, 1])})`, opacity: Math.min(1, cups * 2), display: "flex", alignItems: "center", gap: 30 }}>
          <Cups w={200} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, lineHeight: 1.15, color: C.text, whiteSpace: "nowrap" }}>
            &ldquo;I can tell the
            <br />
            two colas apart!&rdquo;
          </div>
        </div>
      ) : null}
      {/* ten blindfolded cups */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 12, opacity: frame >= TEN - 8 ? 1 : 0 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const on = i < ticks;
          return (
            <div key={i} style={{ width: 70, height: 70, borderRadius: 16, boxSizing: "border-box", border: `3px solid ${on ? LINE : alpha(C.text, 0.25)}`, background: on ? alpha(LINE, 0.2) : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {on ? <Mark kind="check" at={TEN - 2 + i * 3} size={40} color={LINE} width={8} /> : null}
            </div>
          );
        })}
      </div>
      <Pop at={TEN + 30} x={540} y={765} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: LINE, textShadow: glowText(LINE, 0.5) }}>10 OUT OF 10</span> RIGHT
        </div>
      </Pop>
      <Pop at={NULLS - 4} x={540} y={880} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 22, background: alpha(NULLC, 0.16), border: `3px solid ${NULLC}`, textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: NULLC }}>THE NULL HYPOTHESIS</div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>just guessing (50/50)</div>
        </div>
      </Pop>
      <Pop at={THOUS - 6} x={540} y={1010} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          A GUESSER GETS 10/10: <span style={{ color: C.orange, textShadow: glowText(C.orange, 0.5) }}>ABOUT 1 IN 1,000</span>
        </div>
      </Pop>
      <Pop at={PW - 4} x={540} y={1150} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <PPill v="0.001" size={58} color={LINE} />
      </Pop>
      {sig > 0.01 ? (
        <div style={{ position: "absolute", left: 540, top: 1280, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, sig), [0, 1], [0.6, 1])})`, opacity: Math.min(1, sig * 2), display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(LINE, 0.2), border: `3px solid ${LINE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          <Mark kind="check" at={SIG} size={34} color={LINE} width={8} />
          FAR BELOW 0.05: <span style={{ color: LINE }}>SIGNIFICANT</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

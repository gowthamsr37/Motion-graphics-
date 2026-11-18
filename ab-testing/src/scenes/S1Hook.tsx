// SCENE 1 — HOOK. Two phones: a green BUY button and an orange one → WHICH SELLS MORE? → DON'T GUESS. TEST IT. →
// A/B TESTING (the phones get their A and B tags).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AC, BC, Phone } from "../components/AB";
import { Burst, Pop, useSpr } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const GREEN = s.cueS(0, "green");
  const ORANGE = s.cueS(0, "orange");
  const WHICH = s.cueS(0, "Which");
  const GUESS = s.sent(1).from;
  const AB = s.cueS(1, "A/B");
  const title = spr(AB - 3, theme.spring.pop);
  const tags = spr(AB + 4, theme.spring.pop) > 0.5;
  const phone = (x: number, at: number, color: string, tag: string, tilt: number) => {
    const p = spr(at - 6, theme.spring.bouncy);
    if (p <= 0.001) return null;
    const bob = Math.sin((frame - at) / 14) * 6;
    return (
      <div style={{ position: "absolute", left: x, top: 960 + bob, transform: `translate(-50%, -50%) rotate(${tilt}deg) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) }}>
        <Phone color={color} w={300} tag={tags ? tag : undefined} />
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {phone(300, GREEN, AC, "A", -4)}
      {phone(780, ORANGE, BC, "B", 4)}
      <Pop at={WHICH - 4} out={GUESS - 4} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 62, color: C.text, whiteSpace: "nowrap" }}>
          WHICH ONE <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>SELLS MORE?</span>
        </div>
      </Pop>
      <Pop at={GUESS - 2} out={AB - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
          DON&apos;T GUESS. <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.5) }}>TEST IT.</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 130, whiteSpace: "nowrap" }}>
            <span style={{ color: AC, textShadow: glowText(AC, 0.5) }}>A</span>
            <span style={{ color: C.text }}>/</span>
            <span style={{ color: BC, textShadow: glowText(BC, 0.5) }}>B</span>
          </div>
          <div style={{ fontSize: 96, color: C.text }}>TESTING</div>
        </div>
      ) : null}
      <Burst at={AB} x={540} y={410} color={BC} count={22} radius={340} seed={4} />
      <Pop at={AB + 10} x={540} y={1300} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

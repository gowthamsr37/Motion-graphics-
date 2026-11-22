// SCENE 1 — HOOK. Two verdict cards: z-TEST −2 vs ±1.96 → REJECT (cyan) and t-TEST −2 vs ±2.306 → FAIL TO REJECT
// (violet) shake against each other; WHO'S RIGHT?; Z-TEST vs t-TEST title; SAVE bookmark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Burst, Pop, shake, useSpr } from "../components/Motion";
import { Bottle } from "../components/ZKit";
import { SEc, TC, TL, ZC } from "../components/ZT";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Verdict: React.FC<{ y: number; at: number; c: string; test: string; cut: string; verdict: string; vc: string; dir: number }> = ({ y, at, c, test, cut, verdict, vc, dir }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 380, top: y, width: 610, height: 150, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(c, 0.22)}, rgba(14,24,64,0.92) 65%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * 80 * dir}px) rotate(${Math.sin(frame / 9 + dir) * 1}deg)`, padding: "18px 28px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: c }}>{test}</div>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
        −2 vs {cut}: <span style={{ fontFamily: theme.fonts.display, color: vc, textShadow: glowText(vc, 0.5) }}>{verdict}</span>
      </div>
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const WHO = s.cueS(1, "who's");
  const TITLE = s.cueS(1, "z-test", 0);
  const SAVE = s.cueS(1, "Save");
  const sh = shake(frame, WHO - 2, 14, 10);
  const t = spr(TITLE - 4, theme.spring.pop);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 470, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
        <Bottle w={180} level={0.86} mark={0.9} label="200" />
      </div>
      <div style={{ transform: `translate(${sh.x}px, ${sh.y}px)`, position: "absolute", inset: 0 }}>
        <Verdict y={460} at={s.cueS(0, "z-test")} c={ZC} test="z-TEST" cut="±1.96" verdict="REJECT" vc={TL} dir={1} />
        <Verdict y={640} at={s.cueS(0, "t-test")} c={TC} test="t-TEST" cut="±2.306" verdict="FAIL TO REJECT" vc={SEc} dir={-1} />
      </div>
      <Pop at={WHO - 4} x={540} y={900} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, color: C.text, whiteSpace: "nowrap" }}>
          WHO&apos;S RIGHT<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
        </div>
      </Pop>
      {t > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, t), [0, 1], [1.5, 1])})`, opacity: Math.min(1, t * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 96, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          <span style={{ color: ZC, textShadow: glowText(ZC, 0.5) }}>Z-TEST</span>
          <span style={{ color: C.dim, fontSize: 60 }}> vs </span>
          <span style={{ color: TC, textShadow: glowText(TC, 0.5) }}>
            <span style={{ fontStyle: "italic" }}>t</span>-TEST
          </span>
        </div>
      ) : null}
      <Burst at={TITLE} x={540} y={1060} color={TC} count={22} radius={360} seed={4} />
      <Pop at={SAVE - 4} x={540} y={1230} from="up" dist={60} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 32px", borderRadius: 999, background: alpha(SEc, 0.2), border: `3px solid ${SEc}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 4 ? Math.sin((frame - SAVE) / 4) * 4 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={40} color={SEc} />
          THE COMPLETE COMPARISON
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

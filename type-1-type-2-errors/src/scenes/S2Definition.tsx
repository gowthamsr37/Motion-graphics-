// SCENE 2 — THE DEFINITION. TYPE 1 = FALSE ALARM: rejecting the null when it was actually TRUE.
// TYPE 2 = A MISS: keeping the null when it was actually FALSE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Flame, NULLC, SmokeAlarm, T1C, T2C } from "../components/Errors";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const DefBox: React.FC<{ y: number; at: number; subAt: number; tag: string; name: string; color: string; verb: string; truth: string; icon: React.ReactNode }> = ({ y, at, subAt, tag, name, color, verb, truth, icon }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  const sub = spr(subAt - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 280, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(color, 0.2)}, rgba(14,24,64,0.92) 65%)`, border: `3px solid ${color}`, boxShadow: `0 0 28px ${alpha(color, 0.3)}` }}>
      <div style={{ position: "absolute", left: 40, top: 34, padding: "6px 18px", borderRadius: 999, background: color, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.ink }}>{tag}</div>
      <div style={{ position: "absolute", left: 40, top: 96, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, textShadow: glowText(color, 0.5), whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ position: "absolute", left: 40, top: 196, opacity: Math.min(1, sub * 2), transform: `translateY(${(1 - Math.min(1, sub)) * 10}px)`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
        <span style={{ color }}>{verb}</span> the null when it was <span style={{ color: NULLC, fontWeight: 800 }}>{truth}</span>
      </div>
      <div style={{ position: "absolute", right: 50, top: 110, transform: `translateY(-50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})` }}>{icon}</div>
    </div>
  );
};

export const S2Definition: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const T1 = s.cueS(1, "Type");
  const REJ = s.cueS(1, "rejecting");
  const T2 = s.cueS(2, "Type");
  const KEEP = s.cueS(2, "keeping");
  const ring = frame >= T1 ? ((frame - T1) / 18) % 1 : 0;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={T1C} at={2} pillAt={s.sent(0).from} />
      <DefBox y={640} at={T1} subAt={REJ} tag="TYPE 1" name="FALSE ALARM" color={T1C} verb="rejecting" truth="TRUE" icon={<SmokeAlarm size={130} ring={ring} />} />
      <DefBox
        y={980}
        at={T2}
        subAt={KEEP}
        tag="TYPE 2"
        name="A MISS"
        color={T2C}
        verb="keeping"
        truth="FALSE"
        icon={
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <div style={{ position: "absolute", left: 0, top: -6 }}>
              <SmokeAlarm size={96} />
            </div>
            <div style={{ position: "absolute", left: 66, top: 52 }}>
              <Flame size={96} flick={Math.sin(frame * 0.6) * 0.5 + 0.5} />
            </div>
          </div>
        }
      />
    </AbsoluteFill>
  );
};

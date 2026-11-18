// SCENE 1 — HOOK. A smoke alarm can be wrong in two ways: it RINGS with NO FIRE (false alarm), or stays SILENT during
// a REAL FIRE (missed fire) → TYPE 1 & TYPE 2 ERRORS.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Flame, OKC, SmokeAlarm, T1C, T2C } from "../components/Errors";
import { Burst, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Panel: React.FC<{ x: number; at: number; ringAt: number | null; fire: boolean; top: string; label: string; color: string; labelAt: number }> = ({ x, at, ringAt, fire, top, label, color, labelAt }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, theme.spring.bouncy);
  if (p <= 0.001) return null;
  const ring = ringAt !== null && frame >= ringAt ? ((frame - ringAt) / 18) % 1 : 0;
  const shake = ring > 0 ? Math.sin(frame * 1.7) * 4 : 0;
  const lab = spr(labelAt, theme.spring.pop);
  return (
    <div style={{ position: "absolute", left: x, top: 820, width: 420, height: 560, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 32, background: "linear-gradient(180deg, rgba(30,44,104,0.92), rgba(14,24,64,0.92))", border: `3px solid ${lab > 0.01 ? color : C.edge}`, boxShadow: lab > 0.01 ? `0 0 30px ${alpha(color, 0.3)}` : "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: fire ? C.orange : OKC }}>{top}</div>
      <div style={{ position: "absolute", left: 210, top: 160, transform: `translate(-50%, -50%) rotate(${shake}deg)` }}>
        <SmokeAlarm size={150} ring={ring} />
      </div>
      {fire ? (
        <div style={{ position: "absolute", left: 210, top: 360, transform: "translate(-50%, -50%)" }}>
          <Flame size={150} flick={Math.sin(frame * 0.6) * 0.5 + 0.5} />
        </div>
      ) : (
        <div style={{ position: "absolute", left: 210, top: 360, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.dim, whiteSpace: "nowrap" }}>(nothing burning)</div>
      )}
      {lab > 0.01 ? (
        <div style={{ position: "absolute", left: 210, top: 490, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, lab), [0, 1], [0.5, 1])})`, opacity: Math.min(1, lab * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color, textShadow: glowText(color, 0.5), whiteSpace: "nowrap" }}>{label}</div>
      ) : null}
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const TWO = s.cueS(0, "two");
  const SPLIT = s.sent(1).from;
  const RINGS = s.cueS(1, "rings");
  const NOFIRE = s.cueS(1, "fire,");
  const REAL = s.cueS(1, "real");
  const T = s.sent(2).from;
  const MIST = s.cueS(2, "mistakes.");
  const single = spr(4, theme.spring.bouncy);
  const singleOut = exitP(frame, SPLIT - 6, 8);
  const title = spr(T - 2, theme.spring.pop);
  return (
    <AbsoluteFill>
      {singleOut < 1 && single > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 800, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, single), [0, 1], [0.5, 1]) * (1 - singleOut * 0.3)})`, opacity: Math.min(1, single * 2) * (1 - singleOut) }}>
          <SmokeAlarm size={260} />
        </div>
      ) : null}
      <Pop at={TWO - 4} out={T - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2</span> WAYS TO BE WRONG
        </div>
      </Pop>
      <Panel x={300} at={SPLIT - 4} ringAt={RINGS - 2} fire={false} top="NO FIRE" label="FALSE ALARM" color={T1C} labelAt={NOFIRE} />
      <Panel x={780} at={SPLIT + 2} ringAt={null} fire top="REAL FIRE" label="SILENT: A MISS" color={T2C} labelAt={REAL} />
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.4, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 78, whiteSpace: "nowrap" }}>
            <span style={{ color: T1C, textShadow: glowText(T1C, 0.5) }}>TYPE 1</span> <span style={{ color: C.text }}>&amp;</span> <span style={{ color: T2C, textShadow: glowText(T2C, 0.5) }}>TYPE 2</span>
          </div>
          <div style={{ fontSize: 96, color: C.text }}>ERRORS</div>
        </div>
      ) : null}
      <Burst at={T} x={540} y={400} color={T1C} count={22} radius={340} seed={9} />
      <Pop at={MIST - 4} x={540} y={1180} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};

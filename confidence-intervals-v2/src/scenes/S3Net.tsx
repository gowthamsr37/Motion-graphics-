// SCENE 3 — THE NET. Two panels with the same swimming fish (the true value): ONE NUMBER = a spear that flies past
// it (MISSED), A RANGE = a net that sweeps round it (CAUGHT) → A CONFIDENCE INTERVAL IS THAT NET.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MISS, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;

export const Fish: React.FC<{ size: number; color: string; wiggle?: number }> = ({ size, color, wiggle = 0 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 12px ${alpha(color, 0.6)})` }}>
    <path d={`M84 30 L100 ${14 + wiggle * 4} L100 ${46 - wiggle * 4} Z`} fill={alpha(color, 0.6)} stroke={color} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={46} cy={30} rx={42} ry={22} fill={alpha(color, 0.35)} stroke={color} strokeWidth={4} />
    <circle cx={22} cy={25} r={4.5} fill={C.text} />
  </svg>
);

const Panel: React.FC<{ y: number; at: number; label: string; c: string; children: React.ReactNode }> = ({ y, at, label, c, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 330, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.14)}, rgba(14,24,64,0.92) 50%)`, border: `3px solid ${alpha(c, 0.8)}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 34, top: 26, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: c, textShadow: glowText(c, 0.4) }}>{label}</div>
      {children}
    </div>
  );
};

export const S3Net: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const SPEAR = s.sent(1).from;
  const MISSW = s.cueS(1, "miss.");
  const NET = s.sent(2).from;
  const CATCH = s.cueS(2, "catch");
  const THAT = s.sent(3).from;
  const wig = Math.sin(frame / 5);
  const fx = 540 + Math.sin(frame / 22) * 30;
  const spear = ease(frame, [SPEAR + 8, MISSW + 2], [0, 1], theme.ease.in);
  const net = ease(frame, [NET + 6, CATCH], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <SceneTitle label="THINK OF FISHING" color={RANGE} at={2} />
      <Panel y={580} at={SPEAR} label="ONE NUMBER = A SPEAR" c={MISS}>
        <div style={{ position: "absolute", left: fx - 90, top: 150 }}>
          <Fish size={140} color={TRUE} wiggle={wig} />
        </div>
        {spear > 0 ? (
          <svg width={900} height={330} viewBox="0 0 900 330" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <g transform={`translate(${-260 + spear * 1160} ${118})`}>
              <line x1={-220} y1={0} x2={0} y2={0} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
              <path d="M0 -12 L26 0 L0 12 Z" fill={C.text} />
            </g>
          </svg>
        ) : null}
        <div style={{ position: "absolute", right: 40, top: 22 }}>
          <Mark kind="cross" at={MISSW + 2} size={56} color={C.red} width={10} />
        </div>
        <Pop at={MISSW + 4} x={760} y={280} from="up" dist={8}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.red }}>MISSED</div>
        </Pop>
      </Panel>
      <Panel y={950} at={NET} label="A RANGE = A NET" c={RANGE}>
        <div style={{ position: "absolute", left: fx - 90, top: 150 }}>
          <Fish size={140} color={TRUE} wiggle={wig} />
        </div>
        {net > 0 ? (
          <svg width={900} height={330} viewBox="0 0 900 330" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs>
              <pattern id="mesh" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M0 0 H22 M0 0 V22" stroke={alpha(RANGE, 0.7)} strokeWidth={2} />
              </pattern>
            </defs>
            <g opacity={Math.min(1, net * 1.5)} transform={`translate(${interpolate(net, [0, 1], [-300, 0])} 0)`}>
              <rect x={fx - 190} y={100} width={300} height={170} rx={60} fill="url(#mesh)" stroke={RANGE} strokeWidth={6} />
              <line x1={fx + 110} y1={100} x2={fx + 190} y2={40} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
            </g>
          </svg>
        ) : null}
        <div style={{ position: "absolute", right: 40, top: 22 }}>
          <Mark kind="check" at={CATCH + 2} size={56} color={TRUE} width={10} />
        </div>
        <Pop at={CATCH + 4} x={790} y={280} from="up" dist={8}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: TRUE }}>CAUGHT</div>
        </Pop>
      </Panel>
      <Pop at={THAT - 4} x={540} y={1250} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ padding: "14px 32px", borderRadius: 999, background: alpha(RANGE, 0.2), border: `3px solid ${RANGE}`, boxShadow: `0 0 26px ${alpha(RANGE, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          CONFIDENCE INTERVAL = <span style={{ color: RANGE }}>THE NET</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

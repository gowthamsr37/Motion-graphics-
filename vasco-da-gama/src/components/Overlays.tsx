// Screen-space pieces: grain, burnt vignette, light leak, cartouches, the pepper plate, the price ledger.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { breathe, CLAMP, float } from "./Motion";

const C = theme.colors;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 10;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.12, mixBlendMode: "multiply" }}>
      <svg width="100%" height="100%">
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 1.2 -0.3" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <>
    <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 78% 72% at 50% 50%, transparent 55%, rgba(90,58,23,0.45) 85%, rgba(40,24,8,0.85) 100%)` }} />
    <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 160px rgba(40,24,8,0.55)" }} />
  </>
);

// Warm candle-light grade that drifts slowly.
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 30 + Math.sin(frame / 200) * 20;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "soft-light",
        background: `radial-gradient(ellipse 60% 60% at ${x}% 30%, rgba(255,214,150,0.35), transparent 70%), linear-gradient(180deg, rgba(255,230,180,0.08), rgba(80,40,10,0.18))`,
      }}
    />
  );
};

export const FadeEdges: React.FC<{ fadeIn: number; fadeOut: number; total: number }> = ({ fadeIn, fadeOut, total }) => {
  const frame = useCurrentFrame();
  const o = Math.max(
    interpolate(frame, [0, fadeIn], [1, 0], { easing: theme.ease.out, ...CLAMP }),
    interpolate(frame, [total - fadeOut, total], [0, 1], { easing: theme.ease.in, ...CLAMP }),
  );
  return <AbsoluteFill style={{ background: "#120A03", opacity: o, pointerEvents: "none" }} />;
};

// Ornate frame: double rule with corner flourishes.
export const Frame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; pad?: string }> = ({ children, style, pad = "34px 46px" }) => (
  <div
    style={{
      position: "relative",
      background: `linear-gradient(180deg, ${C.parchmentHi}, ${C.parchment})`,
      border: `2px solid ${C.ink}`,
      outline: `1px solid ${C.ink}`,
      outlineOffset: -9,
      padding: pad,
      boxShadow: "0 20px 50px rgba(40,24,8,0.45), inset 0 0 40px rgba(120,80,30,0.25)",
      ...style,
    }}
  >
    {[
      { left: -8, top: -8 },
      { right: -8, top: -8 },
      { left: -8, bottom: -8 },
      { right: -8, bottom: -8 },
    ].map((pos, i) => (
      <div key={i} style={{ position: "absolute", width: 16, height: 16, background: C.red, transform: "rotate(45deg)", border: `1.5px solid ${C.ink}`, ...pos }} />
    ))}
    {children}
  </div>
);

export const Appear: React.FC<{ delay: number; exit?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, exit, y = 30, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 10], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <div style={{ opacity: interpolate(p, [0, 1], [0, 1], CLAMP) * (1 - out), transform: `translateY(${(1 - p) * y - out * 20}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`, ...style }}>
      {children}
    </div>
  );
};

// Date cartouche, e.g. "20 MAY 1498".
export const DateStamp: React.FC<{ delay: number; exit?: number; top: string; big: string; x: number; y: number }> = ({ delay, exit, top, big, x, y }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y + float(frame, 40, 3) }}>
      <Appear delay={delay} exit={exit}>
        <Frame pad="22px 44px">
          <div style={{ fontFamily: theme.fonts.body, fontStyle: "italic", fontSize: 30, color: C.inkDim, textAlign: "center" }}>{top}</div>
          <div style={{ fontFamily: theme.fonts.title, fontWeight: 700, fontSize: 64, color: C.red, letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.1 }}>{big}</div>
        </Frame>
      </Appear>
    </div>
  );
};

// Engraved-style pepper vine with peppercorns, drawn in SVG.
export const PepperPlate: React.FC<{ delay: number; exit?: number; x: number; y: number }> = ({ delay, exit, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const corns = [
    [0, 0], [16, 6], [-14, 8], [4, 20], [20, 24], [-10, 26], [8, 38], [-4, 50], [14, 52], [2, 66], [-14, 42], [24, 40],
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y + float(frame, 36, 4) }}>
      <Appear delay={delay} exit={exit}>
        <Frame pad="26px 34px">
          <svg width={330} height={330} viewBox="-165 -150 330 330">
            <path d="M-120,-130 C-60,-60 -40,0 -10,60 S40,150 60,170" fill="none" stroke={C.green} strokeWidth={4} />
            {[[-80, -80, -30], [-40, -20, 40], [10, 80, -20]].map(([lx, ly, r], i) => {
              const p = spring({ frame: frame - delay - 10 - i * 6, fps, config: theme.spring.smooth });
              return (
                <g key={i} transform={`translate(${lx},${ly}) rotate(${r}) scale(${p})`}>
                  <path d="M0,0 C30,-40 90,-30 110,0 C90,30 30,40 0,0 Z" fill="#7C8F55" stroke={C.ink} strokeWidth={1.6} />
                  <path d="M0,0 L105,0" stroke={C.ink} strokeWidth={1} opacity={0.6} />
                  {[20, 40, 60, 80].map((k) => <path key={k} d={`M${k},0 l12,-10 M${k},0 l12,10`} stroke={C.ink} strokeWidth={0.7} opacity={0.5} />)}
                </g>
              );
            })}
            <g transform="translate(-40,-40)">
              {corns.map(([cx, cy], i) => {
                const p = spring({ frame: frame - delay - 22 - i * 2, fps, config: theme.spring.bouncy });
                return (
                  <g key={i} transform={`translate(${cx},${cy}) scale(${p})`}>
                    <circle r={9} fill={i % 3 === 0 ? "#3A2A1A" : i % 3 === 1 ? "#5B2E1E" : "#2A1D12"} stroke={C.ink} strokeWidth={1} />
                    <circle cx={-3} cy={-3} r={2.5} fill="#FFF3D6" opacity={0.5} />
                  </g>
                );
              })}
            </g>
          </svg>
          <div style={{ fontFamily: theme.fonts.hand, fontStyle: "italic", fontSize: 34, color: C.ink, textAlign: "center", marginTop: 6 }}>Piper nigrum</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: C.inkDim, textAlign: "center", letterSpacing: "0.12em" }}>BLACK PEPPER</div>
        </Frame>
      </Appear>
    </div>
  );
};

// Price ledger: one bar per hand in the chain; no invented numbers, just the climb.
export const PriceLedger: React.FC<{ delay: number; exit?: number; x: number; y: number; steps: { label: string; at: number }[] }> = ({ delay, exit, x, y, steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <Appear delay={delay} exit={exit}>
        <Frame pad="26px 34px 22px">
          <div style={{ fontFamily: theme.fonts.title, fontSize: 26, letterSpacing: "0.2em", color: C.ink, marginBottom: 6 }}>THE PRICE OF PEPPER</div>
          <div style={{ fontFamily: theme.fonts.body, fontStyle: "italic", fontSize: 22, color: C.inkDim, marginBottom: 18 }}>each hand adds its cut (illustrative)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 270 }}>
            {steps.map((s, i) => {
              const p = spring({ frame: frame - s.at, fps, config: theme.spring.smooth });
              const h = 34 * Math.pow(1.62, i) * p;
              const hero = i === steps.length - 1;
              return (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 86 }}>
                  <div style={{ width: 54, height: h, background: hero ? C.red : C.gold, border: `1.5px solid ${C.ink}`, boxShadow: hero ? `0 0 18px ${C.redGlow}` : undefined, transform: `scaleY(${hero ? breathe(frame, 14, 0.02) : 1})`, transformOrigin: "bottom" }} />
                  <div style={{ fontFamily: theme.fonts.body, fontSize: 19, color: C.ink, textAlign: "center", marginTop: 8, lineHeight: 1.1, opacity: interpolate(p, [0, 0.4], [0, 1], CLAMP) }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </Frame>
      </Appear>
    </div>
  );
};

// Lower-third style info card (e.g. Prince Henry).
export const InfoCard: React.FC<{ delay: number; exit?: number; x: number; y: number; title: string; sub: string; body?: string; width?: number }> = ({ delay, exit, x, y, title, sub, body, width = 520 }) => (
  <div style={{ position: "absolute", left: x, top: y, width }}>
    <Appear delay={delay} exit={exit} y={24}>
      <Frame pad="24px 34px">
        <div style={{ fontFamily: theme.fonts.title, fontWeight: 700, fontSize: 36, color: C.ink, letterSpacing: "0.06em" }}>{title}</div>
        <div style={{ fontFamily: theme.fonts.body, fontStyle: "italic", fontSize: 26, color: C.red, marginTop: 4 }}>{sub}</div>
        {body && <div style={{ fontFamily: theme.fonts.body, fontSize: 25, color: C.inkDim, marginTop: 12, lineHeight: 1.3 }}>{body}</div>}
      </Frame>
    </Appear>
  </div>
);

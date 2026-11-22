import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { captions, SceneId } from "../timing";
import { Scratches } from "./Board";
import { CLAMP } from "./Motion";

// The board clock (the Adelaide board has one on its roof). Second hand ticks with a mechanical snap.
export const Clock: React.FC<{ size: number; startSec?: number }> = ({ size, startSec = 47 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = Math.floor(frame / fps);
  const snap = spring({ frame: frame - sec * fps, fps, config: { damping: 9, stiffness: 300, mass: 0.4 } });
  const secA = ((startSec + sec - 1 + snap) / 60) * 360;
  const minA = ((40 + (startSec + frame / fps) / 60) / 60) * 360;
  const hrA = ((10 + 40 / 60) / 12) * 360;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={c - 4} fill={theme.colors.cream} stroke={theme.colors.trimGreen} strokeWidth={10} />
      <circle cx={c} cy={c} r={c - 14} fill="none" stroke={theme.colors.board} strokeOpacity={0.15} strokeWidth={2} />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const r1 = c - 18;
        const r2 = i % 5 === 0 ? c - 36 : c - 26;
        return (
          <line
            key={i}
            x1={c + Math.sin(a) * r1}
            y1={c - Math.cos(a) * r1}
            x2={c + Math.sin(a) * r2}
            y2={c - Math.cos(a) * r2}
            stroke={theme.colors.board}
            strokeWidth={i % 5 === 0 ? 4 : 1.5}
          />
        );
      })}
      {[
        { a: hrA, len: 0.48, w: 10, col: theme.colors.board },
        { a: minA, len: 0.7, w: 7, col: theme.colors.board },
        { a: secA, len: 0.78, w: 3, col: theme.colors.red },
      ].map((hd, i) => (
        <line
          key={i}
          x1={c}
          y1={c}
          x2={c + Math.sin((hd.a * Math.PI) / 180) * c * hd.len}
          y2={c - Math.cos((hd.a * Math.PI) / 180) * c * hd.len}
          stroke={hd.col}
          strokeWidth={hd.w}
          strokeLinecap="round"
        />
      ))}
      <circle cx={c} cy={c} r={9} fill={theme.colors.board} />
    </svg>
  );
};

// A genuine, licensed photograph mounted on the board in a frame, with its credit painted beneath.
export const PhotoPlate: React.FC<{
  src: string;
  w: number;
  h: number;
  position?: string;
  warmth?: number; // 1 = warm, 0 = faded grey
  credit: string;
  delay?: number;
}> = ({ src, w, h, position = "50% 30%", warmth = 1, credit, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.heavy });
  const kb = interpolate(frame, [0, durationInFrames], [1, 1.07], { easing: theme.ease.soft, ...CLAMP });
  return (
    <div
      style={{
        width: w,
        padding: 10,
        boxSizing: "border-box",
        borderRadius: 10,
        background: `linear-gradient(180deg, ${theme.colors.panelHi}, ${theme.colors.board})`,
        boxShadow: `inset 0 0 0 2px ${theme.colors.panelEdge}, 0 18px 40px -12px ${theme.colors.shadow}`,
        opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        position: "relative",
      }}
    >
      <div style={{ width: w - 20, height: h - 20, overflow: "hidden", borderRadius: 4, boxShadow: `inset 0 0 0 2px ${theme.colors.trimCream}55` }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: position,
            transform: `scale(${kb})`,
            filter: `grayscale(${1 - warmth}) sepia(${0.15 + 0.1 * warmth}) brightness(${0.62 + 0.3 * warmth}) contrast(1.05)`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: theme.fonts.body,
          fontWeight: 500,
          fontSize: 19,
          letterSpacing: "0.12em",
          color: theme.colors.creamDim,
          textAlign: "center",
          whiteSpace: "pre-line",
          lineHeight: 1.3,
        }}
      >
        {credit}
      </div>
    </div>
  );
};

// Subtitles live in a lower scoreboard strip — never over the data.
export const SubtitleStrip: React.FC<{ hidden?: SceneId[]; hiddenAfter?: number }> = ({ hidden = [], hiddenAfter = Infinity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caps = captions(fps).filter((c) => !hidden.includes(c.scene) && c.from < hiddenAfter);
  const cur = caps.find((c) => frame >= c.from - 2 && frame <= c.to + 8);
  const stripOn = caps.some((c) => frame >= c.from - 10 && frame <= c.to + 20);
  const stripP = interpolate(stripOn ? 1 : 0, [0, 1], [0, 1]);
  const enter = cur ? spring({ frame: frame - cur.from + 2, fps, config: theme.spring.snappy }) : 0;
  const leave = cur ? interpolate(frame, [cur.to + 2, cur.to + 8], [0, 1], { easing: theme.ease.in, ...CLAMP }) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 1378,
        width: 960,
        height: 96,
        borderRadius: 8,
        background: `linear-gradient(180deg, ${theme.colors.panelHi}, ${theme.colors.board})`,
        boxShadow: `inset 0 0 0 2px ${theme.colors.panelEdge}`,
        opacity: stripP,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 28px",
        boxSizing: "border-box",
      }}
    >
      <Scratches w={960} h={96} seed={77} count={10} opacity={0.08} />
      {cur && (
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontWeight: 500,
            fontSize: cur.text.length > 46 ? 33 : 38,
            lineHeight: 1.2,
            letterSpacing: "0.02em",
            color: theme.colors.cream,
            textAlign: "center",
            opacity: Math.min(1, enter) * (1 - leave),
            transform: `translateY(${interpolate(enter, [0, 1], [26, 0]) - leave * 20}px)`,
          }}
        >
          {cur.text}
        </span>
      )}
    </div>
  );
};

// Scene container: slow camera push + lateral drift; enters/leaves with a mechanical board turn.
export const SceneShell: React.FC<{ children: React.ReactNode; push?: number; drift?: number; turnIn?: boolean; turnOut?: boolean; pull?: number; shakeFrames?: number[] }> = ({
  children,
  push = 0.035,
  drift = 14,
  turnIn = true,
  turnOut = true,
  pull = 0,
  shakeFrames = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], CLAMP);
  const scale = 1 + push * theme.ease.soft(t) - pull * theme.ease.soft(t);
  let sx = 0, sy = 0;
  for (const s of shakeFrames) {
    const k = frame - s;
    if (k >= 0 && k < 12) { const a = (1 - k / 12) * 10; sx += Math.sin(k * 2.9) * a; sy += Math.cos(k * 3.4) * a * 0.6; }
  }
  const x = drift * (theme.ease.soft(t) - 0.5) + sx;
  const inP = turnIn ? spring({ frame, fps, config: theme.spring.heavy }) : 1;
  const outLen = Math.round(fps * 0.35);
  const outP = turnOut ? interpolate(frame, [durationInFrames - outLen, durationInFrames], [0, 1], { easing: theme.ease.in, ...CLAMP }) : 0;
  return (
    <AbsoluteFill style={{ perspective: 2200 }}>
      <AbsoluteFill
        style={{
          transformOrigin: "50% 45%",
          transform: `translate(${x}px, ${sy}px) scale(${scale}) rotateX(${interpolate(inP, [0, 1], [-5, 0]) + outP * 6}deg)`,
          opacity: interpolate(inP, [0, 0.4], [0, 1], CLAMP) * (1 - outP),
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type SpringConfig = { damping: number; stiffness: number; mass: number };

// 0→1 spring starting at `delay` frames.
export const useSpring = (delay = 0, config: SpringConfig = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

// 0→1 eased exit progress over [start, start + length].
export const useExit = (start: number, length: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + length], [0, 1], { easing: theme.ease.in, ...CLAMP });
};

// Premium entrance: fade + travel + scale, always together.
export const Entrance: React.FC<{
  delay?: number;
  x?: number;
  y?: number;
  scale?: number;
  config?: SpringConfig;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, x = 0, y = 36, scale = 0.94, config = theme.spring.smooth, style, children }) => {
  const p = useSpring(delay, config);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1], CLAMP),
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [scale, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Word-by-word reveal. Pixel gap on purpose (em gaps resolve against the parent font size).
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  gap?: number;
  rise?: number;
  style?: React.CSSProperties;
  wordStyle?: (index: number) => React.CSSProperties;
}> = ({ text, delay = 0, per = 3, gap = 24, rise = 44, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: gap, ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 1], [0, 1], CLAMP),
              transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
              ...wordStyle?.(i),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Odometer: digits that changed between `prev` and `cur` roll upward with `progress`.
export const Odometer: React.FC<{
  prev: string;
  cur: string;
  progress: number;
  digitWidth?: number; // em
  style?: React.CSSProperties;
}> = ({ prev, cur, progress, digitWidth = 0.5, style }) => {
  const p = Math.min(progress, 1.06);
  const blur = Math.max(0, 1 - Math.abs(2 * Math.min(p, 1) - 1)) * 4;
  return (
    <div style={{ display: "flex", lineHeight: "1.1em", ...style }}>
      {cur.split("").map((digit, d) => {
        const old = prev[d] ?? digit;
        const rolling = old !== digit && p < 1.06;
        return (
          <span
            key={d}
            style={{
              position: "relative",
              display: "inline-block",
              width: `${digitWidth}em`,
              height: "1.1em",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {rolling ? (
              <>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateY(${-p * 100}%)`,
                    opacity: interpolate(p, [0, 0.45], [1, 0], CLAMP),
                    filter: `blur(${blur}px)`,
                  }}
                >
                  {old}
                </span>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateY(${(1 - p) * 100}%)`,
                    opacity: interpolate(p, [0.1, 0.6], [0, 1], CLAMP),
                    filter: `blur(${blur}px)`,
                  }}
                >
                  {digit}
                </span>
              </>
            ) : (
              <span style={{ position: "absolute", inset: 0 }}>{digit}</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

// Idle micro-motion for anything on screen longer than ~2s.
export const breathe = (frame: number, period = 22, amount = 0.015) => 1 + Math.sin(frame / period) * amount;
export const float = (frame: number, period = 30, px = 4) => Math.sin(frame / period) * px;

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Entrance, float, useExit, useSpring, WordReveal } from "../components/Motion";
import { Trophy } from "../components/Trophy";
import { theme } from "../theme";
import { exitFrames } from "../timing";

export const INTRO_TITLE_DELAY = 10;

const Rays: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rays = 20;
  return (
    <div style={{ position: "absolute", left: cx, top: cy, transform: `rotate(${frame * 0.22}deg)` }}>
      {Array.from({ length: rays }).map((_, i) => {
        const p = spring({ frame: frame - 4 - i * 1.2, fps, config: theme.spring.snappy });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -4,
              top: 0,
              width: 8,
              height: 300 * p,
              borderRadius: 8,
              transformOrigin: "50% 0%",
              transform: `rotate(${(360 / rays) * i}deg) translateY(170px)`,
              background: `linear-gradient(180deg, ${theme.colors.primary}, transparent)`,
              opacity: 0.28 * Math.min(1, p),
            }}
          />
        );
      })}
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const cup = useSpring(0, theme.spring.bouncy);
  const line = interpolate(frame, [26, 46], [0, 1], { easing: theme.ease.out, ...CLAMP });

  return (
    <AbsoluteFill style={{ opacity: 1 - ex, transform: `scale(${1 + ex * 0.16})` }}>
      <Rays cx={960} cy={318} />
      <div
        style={{
          position: "absolute",
          left: 960 - 115,
          top: 178,
          opacity: interpolate(cup, [0, 0.6], [0, 1], CLAMP),
          transform: `translateY(${interpolate(cup, [0, 1], [140, 0]) + float(frame, 26, 6)}px) scale(${interpolate(cup, [0, 1], [0.4, 1])})`,
        }}
      >
        <Trophy size={230} />
      </div>

      <WordReveal
        text="IPL CHAMPIONS"
        delay={INTRO_TITLE_DELAY}
        per={5}
        gap={40}
        rise={70}
        style={{
          position: "absolute",
          top: 498,
          width: 1920,
          justifyContent: "center",
          fontFamily: theme.fonts.display,
          fontWeight: 900,
          fontSize: 200,
          lineHeight: 1,
          letterSpacing: "0.01em",
          color: theme.colors.text,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 752,
          width: 1920,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ width: 120 * line, height: 2, background: theme.colors.textDim, opacity: line }} />
        <Entrance delay={22} y={24}>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: "0.26em",
              color: theme.colors.textDim,
            }}
          >
            EVERY WINNER · 2008 – 2026
          </span>
        </Entrance>
        <div style={{ width: 120 * line, height: 2, background: theme.colors.textDim, opacity: line }} />
      </div>
    </AbsoluteFill>
  );
};

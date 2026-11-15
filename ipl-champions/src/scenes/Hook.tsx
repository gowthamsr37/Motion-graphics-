import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, float, useExit, useSpring } from "../components/Motion";
import { TeamLogo } from "../components/TeamLogo";
import { YearTins } from "../components/YearTins";
import { champions } from "../data";
import { theme } from "../theme";
import { exitFrames, sections, wordFrame } from "../timing";

// Word-synced beats of the hook line: "Nineteen seasons. Only eight champions. Here's every one."
export const hookBeats = (fps: number) => {
  const base = sections(fps).hook.from;
  const at = (prefix: string, fallback: number) => wordFrame(fps, "hook", prefix, fallback) - base;
  const only = at("only", 1.1);
  return {
    seasons: Math.min(at("19", 0), 0) - 4, // already moving on frame 0
    only,
    eight: at("eight", 1.4),
    champions: at("champ", 1.7),
    logos: at("here", 2.4),
  };
};

const Line: React.FC<{ text: string; delay: number; top: number; size: number; color?: string }> = ({ text, delay, top, size, color = theme.colors.text }) => {
  const p = useSpring(delay, theme.spring.snappy);
  return (
    <div
      style={{
        position: "absolute",
        top,
        width: 1080,
        textAlign: "center",
        fontFamily: theme.fonts.display,
        fontSize: size,
        lineHeight: 0.9,
        color,
        opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
      }}
    >
      {text}
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = hookBeats(fps);
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const onlyP = useSpring(b.only, theme.spring.snappy);
  const tinIn = useSpring(b.only + 2, theme.spring.bouncy);

  return (
    <AbsoluteFill style={{ opacity: 1 - ex, transform: `scale(${1 + ex * 0.14})` }}>
      <Line text="19 SEASONS." delay={b.seasons} top={238} size={210} />

      {/* ONLY [8] */}
      <div style={{ position: "absolute", top: 478, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 250,
            lineHeight: 0.9,
            color: theme.colors.text,
            opacity: interpolate(onlyP, [0, 0.5], [0, 1], CLAMP),
            transform: `translateX(${interpolate(onlyP, [0, 1], [-60, 0])}px)`,
            display: "inline-block",
          }}
        >
          ONLY
        </span>
        <div
          style={{
            opacity: interpolate(tinIn, [0, 0.4], [0, 1], CLAMP),
            transform: `scale(${interpolate(tinIn, [0, 1], [0.5, 1])}) translateY(${float(frame, 20, 4)}px)`,
          }}
        >
          <YearTins
            prev="0"
            cur="8"
            progress={() => spring({ frame: frame - b.eight, fps, config: theme.spring.flip })}
            w={200}
            h={280}
            gap={0}
          />
        </div>
      </div>

      <Line text="CHAMPIONS." delay={b.champions} top={790} size={230} />

      {/* the eight logos */}
      <div
        style={{
          position: "absolute",
          top: 1078,
          left: 90,
          width: 900,
          display: "grid",
          gridTemplateColumns: "repeat(4, 210px)",
          columnGap: 20,
          rowGap: 22,
        }}
      >
        {champions.map((key, i) => {
          const ghost = spring({ frame: frame + 6 - i * 2, fps, config: theme.spring.smooth });
          const p = spring({ frame: frame - b.logos - i * 3, fps, config: theme.spring.bouncy });
          return (
            <div
              key={key}
              style={{
                position: "relative",
                width: 210,
                height: 180,
                transform: `translateY(${interpolate(ghost, [0, 1], [40, 0]) + float(frame + i * 9, 18, 3)}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.16 * Math.min(1, ghost) * (1 - Math.min(1, p)),
                  filter: "brightness(0) invert(1)",
                }}
              >
                <TeamLogo team={theme.teams[key]} w={210} h={180} outline={false} />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(p, [0, 0.4], [0, 1], CLAMP),
                  transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
                }}
              >
                <TeamLogo team={theme.teams[key]} w={210} h={180} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

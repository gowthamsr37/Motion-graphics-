import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, Entrance, float, useSpring, WordReveal } from "../components/Motion";
import { Trophy } from "../components/Trophy";
import { seasons, tally } from "../data";
import { theme } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const cup = useSpring(0, theme.spring.bouncy);
  const underline = interpolate(frame, [34, 52], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const nextYear = seasons[seasons.length - 1].year + 1;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 960 - 260,
          top: 100,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.glow} 0%, transparent 65%)`,
          opacity: 0.55 * Math.min(1, cup),
          transform: `scale(${interpolate(cup, [0, 1], [0.6, 1])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 120,
          top: 190,
          opacity: interpolate(cup, [0, 0.6], [0, 1], CLAMP),
          transform: `translateY(${interpolate(cup, [0, 1], [120, 0]) + float(frame, 24, 6)}px) scale(${interpolate(cup, [0, 1], [0.5, 1])})`,
        }}
      >
        <Trophy size={240} />
      </div>

      <WordReveal
        text={`${seasons.length} SEASONS. ${tally.length} CHAMPIONS.`}
        delay={8}
        per={4}
        gap={34}
        rise={60}
        style={{
          position: "absolute",
          top: 526,
          width: 1920,
          justifyContent: "center",
          fontFamily: theme.fonts.display,
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1,
          color: theme.colors.text,
        }}
      />

      <Entrance delay={22} y={24} style={{ position: "absolute", top: 708, width: 1920, display: "flex", justifyContent: "center" }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 44, color: theme.colors.textDim }}>
          Who lifts the trophy in{" "}
          <span style={{ position: "relative", fontWeight: 700, color: theme.colors.text }}>
            {nextYear}?
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: -8,
                height: 4,
                width: `${underline * 100}%`,
                borderRadius: 4,
                background: theme.colors.text,
              }}
            />
          </span>
        </span>
      </Entrance>
    </AbsoluteFill>
  );
};

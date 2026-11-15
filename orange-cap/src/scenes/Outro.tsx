import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Entrance, float, useSpring } from "../components/Motion";
import { OrangeCap } from "../components/OrangeCap";
import { YearTins } from "../components/YearTins";
import { seasons } from "../data";
import { theme } from "../theme";
import { framesPerBeat, sections, wordFrame } from "../timing";

export const outroBeats = (fps: number) => {
  const base = sections(fps).outro.from;
  return {
    question: Math.max(0, wordFrame(fps, "outro", "who", 0.3) - base - 2),
    year: wordFrame(fps, "outro", "2027", 1.0) - base,
    comment: wordFrame(fps, "outro", "comment", 2.0) - base,
  };
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = outroBeats(fps);
  const cup = useSpring(0, theme.spring.bouncy);
  const q = useSpring(b.question, theme.spring.snappy);
  const tins = useSpring(b.question + 4, theme.spring.smooth);
  const mark = useSpring(b.year + 6, theme.spring.bouncy);
  const last = seasons[seasons.length - 1].year;
  const bounce = Math.abs(Math.sin((frame / framesPerBeat(fps)) * Math.PI)) * 14;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 120,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.capGlow} 0%, transparent 62%)`,
          opacity: 0.6 * Math.min(1, cup),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 170,
          top: 290,
          opacity: interpolate(cup, [0, 0.5], [0, 1], CLAMP),
          transform: `translateY(${interpolate(cup, [0, 1], [120, 0]) + float(frame, 24, 6)}px) scale(${interpolate(cup, [0, 1], [0.5, 1])})`,
        }}
      >
        <OrangeCap size={340} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 600,
          width: 1080,
          textAlign: "center",
          fontFamily: theme.fonts.display,
          fontSize: 170,
          lineHeight: 0.9,
          color: theme.colors.text,
          opacity: interpolate(q, [0, 0.5], [0, 1], CLAMP),
          transform: `translateY(${interpolate(q, [0, 1], [60, 0])}px)`,
        }}
      >
        WHO WEARS IT IN
      </div>

      <div
        style={{
          position: "absolute",
          top: 790,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          opacity: interpolate(tins, [0, 0.4], [0, 1], CLAMP),
          transform: `scale(${interpolate(tins, [0, 1], [0.85, 1])})`,
        }}
      >
        <YearTins
          prev={String(last)}
          cur={String(last + 1)}
          progress={(d) => spring({ frame: frame - b.year - (3 - d) * 2, fps, config: theme.spring.flip })}
          w={170}
          h={236}
          gap={16}
        />
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 250,
            lineHeight: 0.9,
            color: theme.colors.text,
            display: "inline-block",
            opacity: interpolate(mark, [0, 0.4], [0, 1], CLAMP),
            transform: `scale(${interpolate(mark, [0, 1], [0.3, 1])}) rotate(${interpolate(mark, [0, 1], [-20, 0])}deg)`,
          }}
        >
          ?
        </span>
      </div>

      <Entrance delay={b.comment} y={30} style={{ position: "absolute", top: 1118, width: 1080, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 48, letterSpacing: "0.12em", color: theme.colors.text }}>
          COMMENT YOUR PICK
        </span>
        <div style={{ marginTop: 26, transform: `translateY(${bounce}px)` }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: 34,
                marginTop: i === 0 ? 0 : -14,
                borderRight: `6px solid ${theme.colors.primary}`,
                borderBottom: `6px solid ${theme.colors.primary}`,
                transform: "rotate(45deg)",
                opacity: i === 0 ? 0.5 : 1,
              }}
            />
          ))}
        </div>
      </Entrance>
    </AbsoluteFill>
  );
};

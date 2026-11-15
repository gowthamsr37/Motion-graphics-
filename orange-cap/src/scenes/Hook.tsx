import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, float, useExit, useSpring } from "../components/Motion";
import { YearTins } from "../components/YearTins";
import { players } from "../data";
import { theme } from "../theme";
import { exitFrames, sections, wordFrame } from "../timing";

// Word-synced beats of the hook line: "Nineteen Orange Caps. Only fifteen players. Here they are."
export const hookBeats = (fps: number) => {
  const base = sections(fps).hook.from;
  const at = (prefix: string, fallback: number) => wordFrame(fps, "hook", prefix, fallback) - base;
  return {
    caps: Math.min(at("19", 0), 0) - 4, // already moving on frame 0
    only: at("only", 1.3),
    fifteen: at("15", 1.5),
    players: at("players", 1.8),
    names: at("here", 2.5),
  };
};

const Line: React.FC<{ text: string; delay: number; top: number; size: number }> = ({ text, delay, top, size }) => {
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
        color: theme.colors.text,
        opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
      }}
    >
      {text}
    </div>
  );
};

// The batting list, Adelaide-board style: yellow number, white name. Faint until the voice says "here they are".
const NamesBoard: React.FC<{ lightAt: number }> = ({ lightAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = Math.ceil(players.length / 2);
  return (
    <div style={{ position: "absolute", top: 968, left: 70, width: 940, display: "grid", gridTemplateColumns: "460px 460px", columnGap: 20, rowGap: 9 }}>
      {Array.from({ length: rows * 2 }).map((_, cell) => {
        // fill column-wise: 1–8 left, 9–15 right
        const i = (cell % 2) * rows + Math.floor(cell / 2);
        const name = players[i];
        if (!name) return <div key={cell} />;
        const ghost = spring({ frame: frame + 6 - i * 1.5, fps, config: theme.spring.smooth });
        const lit = spring({ frame: frame - lightAt - i * 2, fps, config: theme.spring.snappy });
        return (
          <div
            key={cell}
            style={{
              height: 52,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 14px",
              borderRadius: 6,
              background: theme.colors.plate,
              boxShadow: `inset 0 0 0 1px ${theme.colors.plateEdge}`,
              opacity: Math.min(1, ghost) * interpolate(lit, [0, 1], [0.3, 1], CLAMP),
              transform: `translateX(${interpolate(ghost, [0, 1], [cell % 2 ? 40 : -40, 0])}px) scale(${interpolate(lit, [0, 0.5, 1], [1, 1.04, 1], CLAMP)})`,
            }}
          >
            <span style={{ width: 34, textAlign: "right", fontFamily: theme.fonts.display, fontSize: 44, lineHeight: 1, color: theme.colors.primary }}>{i + 1}</span>
            <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 31, letterSpacing: "0.03em", color: theme.colors.text }}>
              {name.toUpperCase()}
            </span>
          </div>
        );
      })}
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
      <Line text="19 ORANGE CAPS." delay={b.caps} top={226} size={156} />

      {/* ONLY [1][5] */}
      <div style={{ position: "absolute", top: 410, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 240,
            lineHeight: 0.9,
            color: theme.colors.text,
            display: "inline-block",
            opacity: interpolate(onlyP, [0, 0.5], [0, 1], CLAMP),
            transform: `translateX(${interpolate(onlyP, [0, 1], [-60, 0])}px)`,
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
            prev="00"
            cur={String(players.length)}
            progress={(d) => spring({ frame: frame - b.fifteen - (1 - d) * 2, fps, config: theme.spring.flip })}
            w={176}
            h={250}
            gap={14}
          />
        </div>
      </div>

      <Line text="PLAYERS." delay={b.players} top={704} size={230} />

      <NamesBoard lightAt={b.names} />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Entrance, float, useExit, useSpring } from "../components/Motion";
import { TeamLogo } from "../components/TeamLogo";
import { seasons, tally } from "../data";
import { theme } from "../theme";
import { exitFrames, sections, wordFrame } from "../timing";

const LAYOUT = { top: 470, rowH: 116, tinX: 292, tinW: 124, tinH: 78, tinGap: 8 };
const rowDelay = (r: number) => 10 + r * 5;
const segDelay = (r: number, s: number) => rowDelay(r) + 6 + s * 4;
export const LAND_FRAMES = 3;

// When each title plate lands — the soundtrack ticks on these.
export const tallyLandings = () => tally.flatMap((row, r) => row.years.map((_, s) => segDelay(r, s) + LAND_FRAMES));

// Highlight "most titles" as the voice says "lead the way", but never before the chart is built.
export const calloutDelay = (fps: number) =>
  Math.max(segDelay(tally.length - 1, 0) + 12, wordFrame(fps, "tally", "lead", 1.2) - sections(fps).tally.from);

const Plate: React.FC<{ year: number; delay: number; color: string; on: string; x: number }> = ({ year, delay, color, on, x }) => {
  const p = useSpring(delay, theme.spring.snappy);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: (100 - LAYOUT.tinH) / 2,
        width: LAYOUT.tinW,
        height: LAYOUT.tinH,
        borderRadius: 8,
        background: `linear-gradient(180deg, ${color} 0%, ${color} 70%, ${theme.colors.shadow} 260%)`,
        boxShadow: `inset 0 0 0 2px ${theme.colors.plateEdge}`,
        transformOrigin: "50% 0%",
        opacity: interpolate(p, [0, 0.4], [0, 1], CLAMP),
        transform: `perspective(600px) rotateX(${interpolate(p, [0, 1], [-80, 0])}deg) translateY(${interpolate(p, [0, 1], [-10, 0])}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        fontSize: 30,
        color: on,
      }}
    >
      {year}
    </div>
  );
};

const Row: React.FC<{ r: number }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const row = tally[r];
  const team = theme.teams[row.team];
  const landed = row.years.filter((_, s) => frame >= segDelay(r, s) + LAND_FRAMES).length;
  const lastLanded = segDelay(r, Math.max(0, landed - 1)) + LAND_FRAMES;
  const pop = spring({ frame: frame - lastLanded, fps, config: theme.spring.snappy });
  const bump = landed > 0 ? 1 + 0.25 * (1 - Math.min(1, pop)) : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: LAYOUT.top + r * LAYOUT.rowH, width: 1080, height: 100 }}>
      <Entrance delay={rowDelay(r)} x={-40} y={0} style={{ position: "absolute", left: 70, top: 0 }}>
        <TeamLogo team={team} w={108} h={100} />
      </Entrance>
      <div
        style={{
          position: "absolute",
          left: 196,
          top: 2,
          width: 76,
          textAlign: "center",
          fontFamily: theme.fonts.display,
          fontSize: 108,
          lineHeight: 0.92,
          color: theme.colors.text,
          opacity: landed > 0 ? 1 : 0,
          transform: `scale(${bump})`,
        }}
      >
        {landed}
      </div>
      {row.years.map((year, s) => (
        <Plate
          key={year}
          year={year}
          delay={segDelay(r, s)}
          color={team.color}
          on={team.on}
          x={LAYOUT.tinX + s * (LAYOUT.tinW + LAYOUT.tinGap)}
        />
      ))}
    </div>
  );
};

const MostTitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpring(calloutDelay(fps), theme.spring.smooth);
  const top = LAYOUT.top - 12;
  const h = LAYOUT.rowH * 2 - 16 + 24;
  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        top,
        width: 984,
        height: h,
        borderRadius: 20,
        border: `4px solid ${theme.colors.primary}`,
        boxShadow: `0 0 36px ${theme.colors.glow}`,
        opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
        transform: `scale(${interpolate(p, [0, 1], [1.06, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 28,
          top: -26,
          padding: "6px 18px",
          borderRadius: 8,
          background: theme.colors.primary,
          fontFamily: theme.fonts.body,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "0.12em",
          color: theme.colors.board,
          transform: `translateY(${float(frame, 20, 2)}px)`,
        }}
      >
        MOST TITLES
      </div>
    </div>
  );
};

export const Tally: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const title = useSpring(-2, theme.spring.snappy);
  return (
    <AbsoluteFill style={{ opacity: 1 - ex, transform: `translateY(${-30 * ex}px)` }}>
      <div
        style={{
          position: "absolute",
          top: 196,
          width: 1080,
          textAlign: "center",
          fontFamily: theme.fonts.display,
          fontSize: 190,
          lineHeight: 0.9,
          color: theme.colors.text,
          opacity: interpolate(title, [0, 0.5], [0, 1], CLAMP),
          transform: `translateY(${interpolate(title, [0, 1], [60, 0])}px) scale(${interpolate(title, [0, 1], [0.9, 1])})`,
        }}
      >
        TITLE TALLY
      </div>
      <Entrance delay={6} y={20} style={{ position: "absolute", top: 384, width: 1080, textAlign: "center" }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 30, letterSpacing: "0.18em", color: theme.colors.textDim }}>
          {seasons.length} SEASONS · {tally.length} CHAMPIONS
        </span>
      </Entrance>
      {tally.map((_, r) => (
        <Row key={r} r={r} />
      ))}
      <MostTitles />
    </AbsoluteFill>
  );
};

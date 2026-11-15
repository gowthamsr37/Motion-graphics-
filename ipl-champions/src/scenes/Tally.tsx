import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Entrance, float, useExit, useSpring, WordReveal } from "../components/Motion";
import { TeamBadge } from "../components/TeamBadge";
import { seasons, tally } from "../data";
import { theme } from "../theme";
import { exitFrames } from "../timing";

const LAYOUT = { top: 328, rowH: 74, barX: 700, segW: 148, segGap: 10, segH: 50 };
const rowDelay = (r: number) => 14 + r * 5;
const segDelay = (r: number, s: number) => rowDelay(r) + 6 + s * 4;
export const CALLOUT_DELAY = 84;
// A block reads as "landed" a few frames after it starts growing.
export const LAND_FRAMES = 3;

// Exported so the soundtrack can tick exactly when each title block lands.
export const tallyLandings = () => tally.flatMap((row, r) => row.years.map((_, s) => segDelay(r, s) + LAND_FRAMES));

const Segment: React.FC<{ year: number; delay: number; color: string; on: string; x: number }> = ({ year, delay, color, on, x }) => {
  const p = useSpring(delay, theme.spring.snappy);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: (60 - LAYOUT.segH) / 2,
        width: LAYOUT.segW,
        height: LAYOUT.segH,
        borderRadius: 10,
        background: color,
        transformOrigin: "0% 50%",
        opacity: interpolate(p, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px) scaleX(${Math.max(0, p)})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.body,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.04em",
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
  const n = row.years.length;
  const landed = row.years.filter((_, s) => frame >= segDelay(r, s) + LAND_FRAMES).length;
  const lastLanded = segDelay(r, Math.max(0, landed - 1)) + LAND_FRAMES;
  const pop = spring({ frame: frame - lastLanded, fps, config: theme.spring.snappy });
  const bump = landed > 0 ? 1 + 0.22 * (1 - Math.min(1, pop)) : 1;

  return (
    <div style={{ position: "absolute", left: 0, top: LAYOUT.top + r * LAYOUT.rowH, width: 1920, height: 60 }}>
      <Entrance delay={rowDelay(r)} x={-30} y={0} style={{ position: "absolute", left: 120, top: 0, height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 60 }}>
          <TeamBadge team={team} size={54} />
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 29, color: theme.colors.text }}>{team.name}</span>
        </div>
      </Entrance>
      {row.years.map((year, s) => (
        <Segment
          key={year}
          year={year}
          delay={segDelay(r, s)}
          color={team.color}
          on={team.on}
          x={LAYOUT.barX + s * (LAYOUT.segW + LAYOUT.segGap)}
        />
      ))}
      <Entrance
        delay={segDelay(r, 0) + LAND_FRAMES}
        x={-16}
        y={0}
        style={{ position: "absolute", left: LAYOUT.barX + n * (LAYOUT.segW + LAYOUT.segGap) + 14, top: -4 }}
      >
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
            color: theme.colors.text,
            display: "inline-block",
            transform: `scale(${bump})`,
            transformOrigin: "30% 60%",
          }}
        >
          {landed}
        </span>
      </Entrance>
    </div>
  );
};

const Callout: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(CALLOUT_DELAY, theme.spring.smooth);
  const x = LAYOUT.barX + 5 * (LAYOUT.segW + LAYOUT.segGap) + 92;
  const top = LAYOUT.top + 30 - 4;
  const h = LAYOUT.rowH + 8;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top,
          width: 22,
          height: h,
          border: `3px solid ${theme.colors.primary}`,
          borderLeft: "none",
          borderRadius: "0 10px 10px 0",
          transformOrigin: "50% 50%",
          opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
          transform: `scaleY(${Math.max(0, p)})`,
          boxShadow: `6px 0 18px -6px ${theme.colors.glow}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x + 44,
          top: top + h / 2 - 40,
          opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
          transform: `translateX(${interpolate(p, [0, 1], [-24, 0])}px) translateY(${float(frame, 26, 3)}px)`,
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 34,
          lineHeight: 1.05,
          letterSpacing: "0.06em",
          color: theme.colors.primary,
          textShadow: `0 0 28px ${theme.colors.glow}`,
        }}
      >
        MOST
        <br />
        TITLES
      </div>
    </>
  );
};

export const Tally: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const champions = tally.length;

  return (
    <AbsoluteFill style={{ opacity: 1 - ex, transform: `translateY(${-30 * ex + float(frame, 45, 2)}px)` }}>
      <WordReveal
        text="TITLES BY FRANCHISE"
        delay={0}
        per={4}
        gap={26}
        rise={56}
        style={{
          position: "absolute",
          left: 120,
          top: 140,
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 100,
          lineHeight: 1,
          color: theme.colors.text,
        }}
      />
      <Entrance delay={8} y={20} style={{ position: "absolute", left: 122, top: 250 }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 28, color: theme.colors.textDim }}>
          {seasons.length} seasons · {champions} different champions
        </span>
      </Entrance>
      {tally.map((_, r) => (
        <Row key={r} r={r} />
      ))}
      <Callout />
    </AbsoluteFill>
  );
};

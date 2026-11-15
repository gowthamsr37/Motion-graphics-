import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Entrance, float, Odometer, useExit, useSpring, WordReveal } from "../components/Motion";
import { TeamBadge } from "../components/TeamBadge";
import { Trophy } from "../components/Trophy";
import { Season, seasons } from "../data";
import { theme } from "../theme";
import { exitFrames, framesPerBar, framesPerBeat } from "../timing";

const pad2 = (n: number) => String(n).padStart(2, "0");

// ---------- per-season card (lives for one bar) ----------

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
    <span
      style={{
        width: 170,
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        fontSize: 19,
        letterSpacing: "0.22em",
        color: theme.colors.textDim,
      }}
    >
      {label}
    </span>
    <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 34, color: theme.colors.text }}>{value}</span>
  </div>
);

const SeasonCard: React.FC<{ season: Season }> = ({ season }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = framesPerBar(fps);
  const team = theme.teams[season.winner];
  const exitLen = exitFrames(fps);
  const ex = useExit(bar - exitLen - 2, exitLen);
  const out: React.CSSProperties = { opacity: 1 - ex, transform: `translateY(${-30 * ex}px)` };
  const badge = useSpring(0, theme.spring.bouncy);
  const mark = useSpring(0, theme.spring.smooth);
  const divider = interpolate(frame, [8, 28], [0, 1], { easing: theme.ease.out, ...CLAMP });

  return (
    <AbsoluteFill>
      {/* asset layer: giant outlined franchise code */}
      <div
        style={{
          position: "absolute",
          right: -20,
          bottom: 60,
          fontFamily: theme.fonts.display,
          fontWeight: 900,
          fontSize: 640,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `3px ${team.color}`,
          maskImage: "linear-gradient(180deg, black 30%, transparent 78%)",
          WebkitMaskImage: "linear-gradient(180deg, black 30%, transparent 78%)",
          opacity: 0.16 * Math.min(1, mark) * (1 - ex),
          transform: `translateX(${interpolate(mark, [0, 1], [90, 0]) + float(frame, 40, 10)}px) scale(${interpolate(mark, [0, 1], [1.08, 1])})`,
        }}
      >
        {team.code}
      </div>

      {/* fact chip under the year */}
      <div style={{ position: "absolute", left: 120, top: 642, ...out }}>
        <Entrance delay={16} y={18} scale={0.9}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 24px",
              borderRadius: 999,
              border: `2px solid ${team.color}`,
              background: theme.colors.surface,
              fontFamily: theme.fonts.body,
              fontWeight: 600,
              fontSize: 23,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.colors.text,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 10, background: team.color }} />
            {season.note}
          </div>
        </Entrance>
      </div>

      {/* winner block */}
      <div style={{ position: "absolute", left: 860, top: 292, width: 960, ...out }}>
        <Entrance delay={2} x={-24} y={0} scale={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Trophy size={30} glow={0.6} />
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontWeight: 600,
                fontSize: 24,
                letterSpacing: "0.28em",
                color: theme.colors.text,
              }}
            >
              CHAMPIONS
            </span>
          </div>
        </Entrance>

        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 28, minHeight: 210 }}>
          <div
            style={{
              opacity: interpolate(badge, [0, 0.5], [0, 1], CLAMP),
              transform: `translateY(${float(frame, 24, 3)}px) scale(${interpolate(badge, [0, 1], [0.5, 1])}) rotate(${interpolate(badge, [0, 1], [-28, 0])}deg)`,
            }}
          >
            <TeamBadge team={team} size={210} />
          </div>
          <WordReveal
            text={team.name.toUpperCase()}
            delay={4}
            per={3}
            gap={22}
            rise={48}
            style={{
              width: 700,
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 0.98,
              color: theme.colors.text,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 34,
            width: 900 * divider,
            height: 3,
            opacity: divider,
            background: `linear-gradient(90deg, ${team.color}, transparent)`,
          }}
        />

        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
          <Entrance delay={11} y={20}>
            <Stat label="RUNNER-UP" value={season.runnerUp} />
          </Entrance>
          <Entrance delay={14} y={20}>
            <Stat label="CAPTAIN" value={season.captain} />
          </Entrance>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- persistent pieces (live for the whole section) ----------

const RAIL = { left: 150, right: 1770, y: 928 };

const Rail: React.FC<{ index: number; roll: number }> = ({ index, roll }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = framesPerBeat(fps);
  const step = (RAIL.right - RAIL.left) / (seasons.length - 1);
  const xOf = (j: number) => RAIL.left + j * step;
  const base = interpolate(frame, [0, 26], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const head = index === 0 ? xOf(0) : xOf(index - 1) + step * Math.min(roll, 1);
  const pulse = (frame % beat) / beat;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: RAIL.left,
          top: RAIL.y - 1,
          width: (RAIL.right - RAIL.left) * base,
          height: 2,
          background: theme.colors.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RAIL.left,
          top: RAIL.y - 1.5,
          width: (head - RAIL.left) * base,
          height: 3,
          background: theme.colors.textDim,
        }}
      />
      {seasons.map((s, j) => {
        const appear = spring({ frame: frame - 6 - j * 1.5, fps, config: theme.spring.snappy });
        const team = theme.teams[s.winner];
        const active = j === index;
        const past = j < index;
        const fill = active ? Math.min(roll, 1) : past ? 1 : 0;
        const size = active ? interpolate(Math.min(roll, 1.1), [0, 1], [16, 26]) : past ? 16 : 14;
        return (
          <React.Fragment key={s.year}>
            {active && (
              <div
                style={{
                  position: "absolute",
                  left: xOf(j) - 13,
                  top: RAIL.y - 13,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: `2px solid ${team.color}`,
                  opacity: 0.6 * (1 - pulse) * appear,
                  transform: `scale(${1 + pulse * 1.3})`,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: xOf(j) - size / 2,
                top: RAIL.y - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                background: fill > 0 ? team.color : theme.colors.bg,
                opacity: (fill > 0 ? 0.35 + 0.65 * fill : 1) * Math.min(1, appear),
                border: active ? `3px solid ${theme.colors.text}` : fill > 0 ? "none" : `2px solid ${theme.colors.textFaint}`,
                boxSizing: "border-box",
                transform: `scale(${Math.max(0, appear)})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: xOf(j) - 30,
                top: RAIL.y + 24,
                width: 60,
                textAlign: "center",
                fontFamily: theme.fonts.body,
                fontWeight: active ? 700 : 500,
                fontSize: 19,
                color: active ? theme.colors.text : past ? theme.colors.textDim : theme.colors.textFaint,
                opacity: Math.min(1, appear),
                transform: `translateY(${interpolate(appear, [0, 1], [10, 0])}px) scale(${active ? 1.15 : 1})`,
              }}
            >
              {`'${String(s.year).slice(2)}`}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const SeasonsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bar = framesPerBar(fps);
  const index = Math.min(seasons.length - 1, Math.floor(frame / bar));
  const local = frame - index * bar;
  const roll = index === 0 ? 1 : spring({ frame: local, fps, config: theme.spring.roll });
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const cur = seasons[index];
  const prevYear = index === 0 ? cur.year : seasons[index - 1].year;

  return (
    <AbsoluteFill>
      {seasons.map((s, i) => (
        <Sequence key={s.year} from={i * bar} durationInFrames={bar}>
          <SeasonCard season={s} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ opacity: 1 - ex, transform: `translateY(${18 * ex}px)` }}>
        {/* header */}
        <Entrance delay={0} y={-20} style={{ position: "absolute", left: 120, top: 84 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: "0.12em",
                color: theme.colors.text,
              }}
            >
              IPL CHAMPIONS
            </span>
            <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 22, color: theme.colors.textDim }}>
              2008 – 2026
            </span>
          </div>
        </Entrance>
        <Entrance delay={3} y={-20} style={{ position: "absolute", right: 120, top: 76 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "0.24em",
                color: theme.colors.textDim,
              }}
            >
              SEASON
            </span>
            <Odometer
              prev={pad2(index)}
              cur={pad2(index + 1)}
              progress={roll}
              digitWidth={0.52}
              style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: theme.colors.text }}
            />
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: theme.colors.textDim }}>
              / {seasons.length}
            </span>
          </div>
        </Entrance>

        {/* the year */}
        <Entrance delay={0} y={50} style={{ position: "absolute", left: 104, top: 262 }}>
          <Odometer
            prev={String(prevYear)}
            cur={String(cur.year)}
            progress={roll}
            digitWidth={0.5}
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 900,
              fontSize: 330,
              color: theme.colors.text,
              transform: `translateY(${float(frame, 34, 3)}px)`,
            }}
          />
        </Entrance>

        <Rail index={index} roll={roll} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Entrance, float, Odometer, useExit, useSpring, WordReveal } from "../components/Motion";
import { TeamLogo } from "../components/TeamLogo";
import { YearTins } from "../components/YearTins";
import { Season, seasons } from "../data";
import { theme } from "../theme";
import { exitFrames, framesPerBeat, seasonSlots } from "../timing";

const pad2 = (n: number) => String(n).padStart(2, "0");
const LAYOUT = { tinsTop: 214, logoTop: 538, stackTop: 948, railY: 1500 };

// ---------- one season (lives for its slot) ----------

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, height: 50 }}>
    <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 27, letterSpacing: "0.2em", color: theme.colors.primary }}>
      {label}
    </span>
    {children}
  </div>
);

const SeasonCard: React.FC<{ season: Season }> = ({ season }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const team = theme.teams[season.winner];
  const runner = theme.teams[season.runnerUp.team];
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const out: React.CSSProperties = { opacity: 1 - ex, transform: `translateY(${-34 * ex}px)` };
  const logo = useSpring(0, theme.spring.bouncy);
  const glow = useSpring(0, theme.spring.smooth);

  return (
    <AbsoluteFill>
      {/* asset layer: huge faint logo behind everything */}
      <div
        style={{
          position: "absolute",
          left: 540 - 700,
          top: 260,
          opacity: 0.08 * Math.min(1, glow) * (1 - ex),
          filter: "blur(10px)",
          transform: `scale(${interpolate(glow, [0, 1], [1.15, 1])}) rotate(${-6 + frame * 0.06}deg)`,
        }}
      >
        <TeamLogo team={team} w={1400} h={1200} outline={false} />
      </div>

      {/* hero logo with team-color light behind it */}
      <div style={{ position: "absolute", left: 0, top: LAYOUT.logoTop, width: 1080, height: 380, ...out }}>
        <div
          style={{
            position: "absolute",
            left: 540 - 330,
            top: 190 - 330,
            width: 660,
            height: 660,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${"glow" in team ? team.glow : team.color} 0%, transparent 62%)`,
            opacity: 0.45 * Math.min(1, glow),
            transform: `scale(${interpolate(glow, [0, 1], [0.5, 1])})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - 270,
            top: 0,
            opacity: interpolate(logo, [0, 0.4], [0, 1], CLAMP),
            transform: `translateY(${interpolate(logo, [0, 1], [70, 0]) + float(frame, 22, 5)}px) scale(${interpolate(logo, [0, 1], [0.55, 1])})`,
          }}
        >
          <TeamLogo team={team} w={540} h={380} />
        </div>
      </div>

      {/* name, final, captain, fact */}
      <div
        style={{
          position: "absolute",
          top: LAYOUT.stackTop,
          width: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          ...out,
        }}
      >
        <WordReveal
          text={team.name.toUpperCase()}
          delay={3}
          per={3}
          gap={26}
          rise={56}
          style={{
            maxWidth: 960,
            justifyContent: "center",
            fontFamily: theme.fonts.display,
            fontSize: 134,
            lineHeight: 0.92,
            color: theme.colors.text,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          <Entrance delay={8} y={22}>
            <InfoRow label="BEAT">
              <TeamLogo team={runner} w={54} h={48} />
              <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 40, color: theme.colors.text }}>{season.runnerUp.name}</span>
            </InfoRow>
          </Entrance>
          <Entrance delay={11} y={22}>
            <InfoRow label="CAPTAIN">
              <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 40, color: theme.colors.text }}>{season.captain}</span>
            </InfoRow>
          </Entrance>
        </div>
        <Entrance delay={14} y={18} scale={0.9}>
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              border: `3px solid ${theme.colors.primary}`,
              fontFamily: theme.fonts.body,
              fontWeight: 600,
              fontSize: 32,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.colors.text,
            }}
          >
            {season.note}
          </div>
        </Entrance>
      </div>
    </AbsoluteFill>
  );
};

// ---------- persistent pieces ----------

const Rail: React.FC<{ index: number; roll: number }> = ({ index, roll }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = framesPerBeat(fps);
  const left = 120;
  const right = 960;
  const step = (right - left) / (seasons.length - 1);
  const xOf = (j: number) => left + j * step;
  const y = LAYOUT.railY;
  const base = interpolate(frame, [0, 24], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const head = index === 0 ? xOf(0) : xOf(index - 1) + step * Math.min(roll, 1);
  const pulse = (frame % beat) / beat;
  return (
    <>
      <div style={{ position: "absolute", left, top: y - 1, width: (right - left) * base, height: 2, background: theme.colors.line }} />
      <div style={{ position: "absolute", left, top: y - 1.5, width: (head - left) * base, height: 3, background: theme.colors.textDim }} />
      {seasons.map((s, j) => {
        const appear = Math.max(0, spring({ frame: frame - 4 - j * 1.2, fps, config: theme.spring.snappy }));
        const team = theme.teams[s.winner];
        const active = j === index;
        const past = j < index;
        const fill = active ? Math.min(roll, 1) : past ? 1 : 0;
        const size = active ? interpolate(Math.min(roll, 1.1), [0, 1], [14, 24]) : past ? 14 : 12;
        return (
          <React.Fragment key={s.year}>
            {active && (
              <div
                style={{
                  position: "absolute",
                  left: xOf(j) - 12,
                  top: y - 12,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: `2px solid ${team.color}`,
                  opacity: 0.7 * (1 - pulse) * appear,
                  transform: `scale(${1 + pulse * 1.4})`,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: xOf(j) - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                boxSizing: "border-box",
                background: fill > 0 ? team.color : theme.colors.board,
                border: active ? `3px solid ${theme.colors.text}` : fill > 0 ? "none" : `2px solid ${theme.colors.textFaint}`,
                opacity: Math.min(1, appear) * (fill > 0 ? 0.4 + 0.6 * fill : 1),
                transform: `scale(${appear})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: xOf(j) - 24,
                top: y + 18,
                width: 48,
                textAlign: "center",
                fontFamily: theme.fonts.body,
                fontWeight: active ? 700 : 500,
                fontSize: active ? 21 : 16,
                color: active ? theme.colors.text : past ? theme.colors.textDim : theme.colors.textFaint,
                opacity: Math.min(1, appear),
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
  const slots = seasonSlots(fps);
  let index = 0;
  while (index + 1 < slots.length && frame >= slots[index + 1].from) index++;
  const local = frame - slots[index].from;
  const roll = index === 0 ? 1 : spring({ frame: local, fps, config: theme.spring.flip });
  const exitLen = exitFrames(fps);
  const ex = useExit(durationInFrames - exitLen - 2, exitLen);
  const cur = String(seasons[index].year);
  const prev = index === 0 ? cur : String(seasons[index - 1].year);

  return (
    <AbsoluteFill>
      {seasons.map((s, i) => (
        <Sequence key={s.year} from={slots[i].from} durationInFrames={slots[i].duration}>
          <SeasonCard season={s} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ opacity: 1 - ex, transform: `translateY(${16 * ex}px)` }}>
        {/* header */}
        <Entrance delay={0} y={-20} style={{ position: "absolute", left: 70, top: 138 }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: "0.16em", color: theme.colors.text }}>
            IPL CHAMPIONS
          </span>
        </Entrance>
        <Entrance delay={2} y={-20} style={{ position: "absolute", right: 70, top: 128 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 22, letterSpacing: "0.2em", color: theme.colors.textDim }}>
              SEASON
            </span>
            <Odometer
              prev={pad2(index)}
              cur={pad2(index + 1)}
              progress={roll}
              digitWidth={0.5}
              style={{ fontFamily: theme.fonts.display, fontSize: 54, color: theme.colors.text }}
            />
            <span style={{ fontFamily: theme.fonts.display, fontSize: 36, color: theme.colors.textDim }}>/ {seasons.length}</span>
          </div>
        </Entrance>

        {/* the year, on number plates */}
        <Entrance delay={0} y={60} style={{ position: "absolute", top: LAYOUT.tinsTop, width: 1080, display: "flex", justifyContent: "center" }}>
          <YearTins
            prev={prev}
            cur={cur}
            progress={(d) => (index === 0 ? 1 : spring({ frame: local - (cur.length - 1 - d) * 2, fps, config: theme.spring.flip }))}
            w={196}
            h={272}
            gap={18}
          />
        </Entrance>

        <Rail index={index} roll={roll} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

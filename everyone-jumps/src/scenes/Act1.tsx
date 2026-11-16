// Scenes 1–3: the question, the global countdown, the big question.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CityId, CityPanel } from "../components/City";
import { Earth, EarthView, project } from "../components/Earth";
import { PEAK } from "../components/Person";
import { Space } from "../components/Space";
import { Card, Headline, Rise, Tag } from "../components/UI";
import { CLAMP, theme } from "../theme";
import { scene, wordAt } from "../timing";

const CITY_ORDER: CityId[] = ["tokyo", "bengaluru", "london", "newyork"];

// ───────────────────────────── S1 — THE ULTIMATE QUESTION ─────────────────────────────
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cut = wordAt(fps, "s1", "Earth") + 2; // cities appear as "Earth" is spoken
  const k = interpolate(frame, [0, cut + 4], [0, 1], { easing: theme.ease.cam, ...CLAMP });
  const view: EarthView = { cx: 540, cy: 930, r: 330 + 190 * k, lat: 22, lon: 102 - 12 * k, clouds: frame * 0.04 };
  const count = interpolate(frame, [3, 40], [0, 8.3e9], { easing: theme.ease.out, ...CLAMP });
  const counterIn = spring({ frame: frame - 2, fps, config: theme.spring.snappy });
  const counterOut = interpolate(frame, [cut - 6, cut], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const slot = Math.max(1, Math.floor((scene(fps, "s1").duration - cut) / CITY_ORDER.length));
  return (
    <AbsoluteFill>
      <Space drift={-frame * 0.5} />
      {frame < cut + 8 ? (
        <AbsoluteFill style={{ opacity: interpolate(frame, [cut, cut + 7], [1, 0], CLAMP) }}>
          <Earth view={view} />
        </AbsoluteFill>
      ) : null}
      {/* the massive number */}
      <div
        style={{
          position: "absolute",
          top: 300,
          width: 1080,
          textAlign: "center",
          opacity: counterIn * (1 - counterOut),
          transform: `translateY(${interpolate(counterIn, [0, 1], [40, 0]) - counterOut * 30}px) scale(${interpolate(counterIn, [0, 1], [0.92, 1])})`,
        }}
      >
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 98, color: theme.colors.ink, fontVariantNumeric: "tabular-nums", textShadow: `0 0 50px ${theme.colors.cyanGlow}` }}>
          {Math.round(count).toLocaleString("en-US")}
        </div>
        <div style={{ marginTop: 14, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, letterSpacing: "0.34em", color: theme.colors.cyan }}>PEOPLE ON EARTH</div>
      </div>
      {/* rapid city montage: everyone getting ready */}
      {CITY_ORDER.map((id, i) => {
        const s = cut + i * slot;
        const e = i === CITY_ORDER.length - 1 ? 9999 : cut + (i + 1) * slot;
        if (frame < s - 6 || frame > e + 1) return null;
        const xin = interpolate(frame, [s - 6, s], [1100, 0], { easing: theme.ease.out, ...CLAMP });
        const xout = interpolate(frame, [e - 5, e], [0, -1100], { easing: theme.ease.in, ...CLAMP });
        const blur = interpolate(frame, [s - 6, s - 2, s, e - 5, e - 2, e], [10, 8, 0, 0, 8, 10], CLAMP);
        const t = -1.12 + 0.16 * Math.sin(frame / 4.2 + i * 1.7);
        return (
          <div key={id} style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${xin + xout}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
            <Card x={40} y={580} w={1000} h={640}>
              <CityPanel city={id} w={1000} h={640} t={t} crowdSeed={i + 3} zoom={1 + (frame - s) * 0.0025} dense />
            </Card>
          </div>
        );
      })}
      {frame >= cut - 2 ? <Headline top={262} size={90} delay={cut - 2} per={2} text={"WHAT IF\n8.3 BILLION PEOPLE\n*JUMPED* AT ONCE?"} lineHeight={1.02} /> : null}
    </AbsoluteFill>
  );
};

// ───────────────────────────── S2 — THE GLOBAL COUNTDOWN ─────────────────────────────
const PINS: { name: string; lat: number; lon: number; local: string; label?: boolean }[] = [
  { name: "TOKYO", lat: 35.7, lon: 139.7, local: "21:00", label: true },
  { name: "BENGALURU", lat: 12.97, lon: 77.6, local: "17:30", label: true },
  { name: "LAGOS", lat: 6.5, lon: 3.4, local: "13:00", label: true },
  { name: "LONDON", lat: 51.5, lon: -0.13, local: "12:00", label: true },
  { name: "SÃO PAULO", lat: -23.5, lon: -46.6, local: "09:00", label: true },
  { name: "NEW YORK", lat: 40.7, lon: -74.0, local: "07:00", label: true },
  ...[
    [28.6, 77.2], [31.2, 121.5], [-6.2, 106.8], [23.8, 90.4], [30.0, 31.2], [55.8, 37.6], [19.4, -99.1], [-34.6, -58.4],
    [34.1, -118.2], [-4.3, 15.3], [14.6, 121.0], [24.9, 67.0], [41.0, 28.9], [-33.9, 151.2], [39.9, 116.4], [19.1, 72.9],
    [-1.3, 36.8], [6.5, -0.2], [48.9, 2.35], [40.4, -3.7], [13.8, 100.5], [37.6, 127.0], [-12.0, -77.0], [4.7, -74.1],
  ].map(([lat, lon]) => ({ name: "", lat, lon, local: "" })),
];

const Pins: React.FC<{ view: EarthView; on: number }> = ({ view, on }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {PINS.map((p, i) => {
        const q = project(view, p.lat, p.lon);
        const vis = interpolate(q.z, [0.08, 0.32], [0, 1], CLAMP) * on;
        if (vis <= 0.01) return null;
        const pulse = 0.5 + 0.5 * Math.sin(frame / 6 + i);
        const lx = q.x + q.nx * 34, ly = q.y + q.ny * 34;
        const right = q.nx >= -0.15;
        return (
          <g key={i} opacity={vis}>
            <circle cx={q.x} cy={q.y} r={p.label ? 16 + pulse * 6 : 9} fill={theme.colors.cyan} opacity={0.18} />
            <circle cx={q.x} cy={q.y} r={p.label ? 6.5 : 4} fill={theme.colors.cyan} style={{ filter: `drop-shadow(0 0 6px ${theme.colors.cyan})` }} />
            {p.label ? (
              <g>
                <line x1={q.x} y1={q.y} x2={lx} y2={ly} stroke={theme.colors.cyan} strokeWidth={2} opacity={0.8} />
                <rect x={right ? lx : lx - 210} y={ly - 24} width={210} height={46} rx={8} fill="rgba(3,7,18,0.78)" stroke="rgba(88,218,255,0.4)" />
                <text x={(right ? lx : lx - 210) + 14} y={ly + 8} fill={theme.colors.ink} fontFamily={theme.fonts.display} fontWeight={700} fontSize={24} letterSpacing="0.05em">
                  {p.name}
                </text>
                <text x={(right ? lx : lx - 210) + 196} y={ly + 8} textAnchor="end" fill={theme.colors.cyan} fontFamily={theme.fonts.mono} fontWeight={700} fontSize={20}>
                  {p.local}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

const GRID = [
  { x: 40, y: 250 },
  { x: 548, y: 250 },
  { x: 40, y: 763 },
  { x: 548, y: 763 },
];
const CW = 492, CH = 497;
const BADGE = { x: 540, y: 757 };

export const CountdownGrid: React.FC<{ gridIn: number; t: number; freeze: number; zoom?: number; opacity?: number }> = ({ gridIn, t, freeze, zoom = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${zoom})`, filter: freeze > 0 ? `saturate(${1 - 0.55 * freeze}) brightness(${1 - 0.18 * freeze})` : undefined }}>
      {CITY_ORDER.map((id, i) => {
        const p = spring({ frame: frame - gridIn - i * 4, fps, config: theme.spring.smooth });
        return (
          <div key={id} style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`, transformOrigin: `${GRID[i].x + CW / 2}px ${GRID[i].y + CH / 2}px` }}>
            <Card x={GRID[i].x} y={GRID[i].y} w={CW} h={CH}>
              <CityPanel city={id} w={CW} h={CH} t={t} crowdSeed={i} label={interpolate(p, [0.5, 1], [0, 1], CLAMP)} />
            </Card>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Numeral: React.FC<{ at: number; next: number; text: string; hot?: boolean }> = ({ at, next, text, hot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at - 1 || frame > next + 8) return null;
  const p = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 190, mass: 0.7 } });
  const out = interpolate(frame, [next - 5, next + 1], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const c = hot ? theme.colors.orange : theme.colors.ink;
  const ext = hot ? ["#E0702A", "#C25F22", "#A3501C", "#853F15", "#68300F"] : ["#B8C8E4", "#97A9CB", "#788CB1", "#5B6F96", "#3F5279"];
  const shadow = ext.map((col, i) => `0 ${(i + 1) * 3}px 0 ${col}`).join(", ") + `, 0 22px 30px rgba(0,0,0,0.65), 0 0 70px ${hot ? theme.colors.orangeGlow : "rgba(88,218,255,0.35)"}`;
  return (
    <div
      style={{
        position: "absolute",
        left: BADGE.x - 400,
        top: BADGE.y - 200,
        width: 800,
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 900,
        opacity: Math.min(1, p * 1.4) * (1 - out),
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: hot ? 210 : 300,
          lineHeight: 1,
          color: c,
          textShadow: shadow,
          transform: `rotateX(${(1 - p) * -70}deg) scale(${interpolate(p, [0, 1], [1.7, 1]) * (1 + out * 0.35)})`,
          filter: out > 0 ? `blur(${out * 8}px)` : undefined,
          marginTop: -24,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gridIn = wordAt(fps, "s2", "counting") + 4;
  const f3 = wordAt(fps, "s2", "Three"), f2 = wordAt(fps, "s2", "Two"), f1 = wordAt(fps, "s2", "One"), fj = wordAt(fps, "s2", "Jump");
  const rot = interpolate(frame, [0, gridIn + 10], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const view: EarthView = { cx: 540, cy: 910, r: 405, lat: 22 + 6 * Math.sin(rot * Math.PI), lon: 128 - 172 * rot, clouds: frame * 0.04 };
  const earthOut = interpolate(frame, [gridIn - 2, gridIn + 10], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const t = Math.min((frame - fj) / fps, PEAK);
  const freeze = interpolate(frame, [fj + Math.round(PEAK * fps), fj + Math.round(PEAK * fps) + 8], [0, 1], CLAMP);
  const flash = interpolate(frame - (fj + Math.round(PEAK * fps)), [0, 1, 6], [0, 0.55, 0], CLAMP);
  // countdown ring drains between beats
  const beats = [f3, f2, f1, fj];
  const bi = beats.findIndex((b, i) => frame >= b && (i === 3 || frame < beats[i + 1]));
  const ringP = bi >= 0 && bi < 3 ? interpolate(frame, [beats[bi], beats[bi + 1]], [1, 0], CLAMP) : 0;
  const badgeIn = spring({ frame: frame - (f3 - 8), fps, config: theme.spring.snappy });
  const badgeOut = interpolate(frame, [fj + 6, fj + 14], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const pulse = interpolate(frame, [fj, fj + 24], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <AbsoluteFill>
      <Space drift={-frame * 0.5 - 70} />
      {frame < gridIn + 12 ? (
        <AbsoluteFill style={{ opacity: 1 - earthOut, transform: `scale(${1 + earthOut * 0.08})` }}>
          <Earth view={view} />
          <Pins view={view} on={interpolate(frame, [8, 24], [0, 1], CLAMP) * (1 - earthOut)} />
          <Headline top={258} size={84} delay={4} out={gridIn - 6} text={"ALL OF US,\n*ONE* MOMENT"} accent={theme.colors.cyan} />
          <div style={{ position: "absolute", top: 440, width: 1080, display: "flex", justifyContent: "center" }}>
            <Rise delay={14} out={gridIn - 6}>
              <Tag>12:00:00 UTC · SAME INSTANT, EVERY TIME ZONE</Tag>
            </Rise>
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= gridIn - 2 ? <CountdownGrid gridIn={gridIn} t={t} freeze={freeze} /> : null}
      {/* countdown badge */}
      {frame >= f3 - 10 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: badgeIn * (1 - badgeOut) }}>
          <circle cx={BADGE.x} cy={BADGE.y} r={150 * interpolate(badgeIn, [0, 1], [0.6, 1])} fill="rgba(3,7,18,0.72)" stroke="rgba(160,200,255,0.25)" strokeWidth={2} />
          <circle
            cx={BADGE.x}
            cy={BADGE.y}
            r={162}
            fill="none"
            stroke={theme.colors.cyan}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 162 * ringP} ${2 * Math.PI * 162}`}
            transform={`rotate(-90 ${BADGE.x} ${BADGE.y})`}
            style={{ filter: `drop-shadow(0 0 8px ${theme.colors.cyan})` }}
          />
        </svg>
      ) : null}
      <Numeral at={f3 - 2} next={f2 - 2} text="3" />
      <Numeral at={f2 - 2} next={f1 - 2} text="2" />
      <Numeral at={f1 - 2} next={fj - 1} text="1" />
      <Numeral at={fj - 1} next={fj + 12} text="JUMP!" hot />
      {/* globe-wide pulse: a graphic beat that ties the four cities to one instant (not a shockwave) */}
      {pulse > 0 && pulse < 1 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={BADGE.x} cy={BADGE.y} r={150 + pulse * 1050} fill="none" stroke={theme.colors.orangeHi} strokeWidth={10 * (1 - pulse) + 1} opacity={(1 - pulse) * 0.85} />
          <circle cx={BADGE.x} cy={BADGE.y} r={150 + pulse * 700} fill="none" stroke={theme.colors.white} strokeWidth={3} opacity={(1 - pulse) * 0.5} />
        </svg>
      ) : null}
      <AbsoluteFill style={{ background: "#EAF6FF", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── S3 — THE BIG QUESTION ─────────────────────────────
const Hypo: React.FC<{ at: number; out: number; label: string }> = ({ at, out, label }) => (
  <div style={{ position: "absolute", top: 470, width: 1080, display: "flex", justifyContent: "center" }}>
    <Rise delay={at} out={out} dy={24}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Tag dashed color={theme.colors.inkDim} size={20}>
          HYPOTHETICAL
        </Tag>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: theme.colors.ink, letterSpacing: "0.02em" }}>{label}</span>
      </div>
    </Rise>
  </div>
);

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fShake = wordAt(fps, "s3", "shake"), fQuake = wordAt(fps, "s3", "earthquake"), fOrbit = wordAt(fps, "s3", "knock");
  const toEarth = 20;
  const gridOut = interpolate(frame, [toEarth - 4, toEarth + 8], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const earthIn = interpolate(frame, [toEarth - 2, toEarth + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  // orbit beat: pull back so the globe sits on its orbit
  const ob = interpolate(frame, [fOrbit - 6, fOrbit + 18], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const cx = 540 + ob * 130, cy = 880 - ob * 20, r = 330 - ob * 170;
  const view: EarthView = { cx, cy, r, lat: 18, lon: -30 + frame * 0.12, clouds: frame * 0.04, ghost: 0.15 };
  // shake ghosts
  const shakeK = interpolate(frame, [fShake - 2, fShake + 6, fQuake - 6, fQuake + 2], [0, 1, 1, 0], CLAMP);
  const quakeK = interpolate(frame, [fQuake - 2, fQuake + 6, fOrbit - 8, fOrbit], [0, 1, 1, 0], CLAMP);
  const orbitK = interpolate(frame, [fOrbit + 4, fOrbit + 14], [0, 1], CLAMP);
  const drift = interpolate(frame, [fOrbit + 14, fOrbit + 60], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const sun = { x: -150, y: 1180 };
  const orbitR = Math.hypot(cx - sun.x, cy - sun.y);
  return (
    <AbsoluteFill>
      <Space drift={-frame * 0.4 - 200} />
      {earthIn > 0 ? (
        <AbsoluteFill style={{ opacity: earthIn }}>
          {/* sun glow + orbit for the third hypothesis */}
          <AbsoluteFill style={{ opacity: ob }}>
            <div style={{ position: "absolute", left: sun.x - 420, top: sun.y - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,210,1) 0%, rgba(255,214,140,0.95) 14%, rgba(255,160,70,0.4) 26%, rgba(255,140,60,0.1) 48%, transparent 70%)" }} />
          </AbsoluteFill>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ob }}>
            <circle cx={sun.x} cy={sun.y} r={orbitR} fill="none" stroke={theme.colors.inkDim} strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" />
            <text x={sun.x + 175} y={sun.y + 10} fill={theme.colors.inkDim} fontFamily={theme.fonts.body} fontWeight={700} fontSize={24} letterSpacing="0.2em">SUN</text>
          </svg>
          <Earth view={view} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {/* 1 · ghost wobble outlines */}
            {[0, 1, 2].map((i) => {
              const j = Math.sin(frame * 1.7 + i * 2.1) * 14 * shakeK, jy = Math.cos(frame * 1.3 + i) * 10 * shakeK;
              return <circle key={i} cx={cx + j * (i + 1) * 0.6} cy={cy + jy * (i + 1) * 0.6} r={r + 6} fill="none" stroke={theme.colors.ink} strokeWidth={2} strokeDasharray="10 10" opacity={shakeK * (0.55 - i * 0.12)} />;
            })}
            {/* 2 · imagined seismograph spike */}
            {quakeK > 0 ? (
              <g opacity={quakeK}>
                {[1, 2, 3].map((i) => (
                  <circle key={i} cx={cx - 60} cy={cy - 40} r={((frame - fQuake) * 6 + i * 70) % 260} fill="none" stroke={theme.colors.ink} strokeWidth={2} strokeDasharray="8 10" opacity={0.6 * (1 - (((frame - fQuake) * 6 + i * 70) % 260) / 260)} />
                ))}
                <path
                  d={Array.from({ length: 121 }, (_, i) => {
                    const x = 120 + i * 7;
                    const env = Math.exp(-(((i - 60) / 14) ** 2));
                    const y = cy + 30 + Math.sin(i * 1.9 + frame * 0.9) * (6 + 120 * env * Math.min(1, (frame - fQuake + 4) / 8));
                    return `${i ? "L" : "M"} ${x} ${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke={theme.colors.ink}
                  strokeWidth={3}
                  strokeDasharray="9 7"
                />
              </g>
            ) : null}
            {/* 3 · knocked off its path */}
            {orbitK > 0 ? (
              <g opacity={orbitK}>
                <circle cx={cx + drift * 170} cy={cy - drift * 260} r={r} fill="none" stroke={theme.colors.ink} strokeWidth={2.5} strokeDasharray="10 10" opacity={0.8} />
                <path d={`M ${cx + r * 0.7} ${cy - r * 0.7} Q ${cx + 120 + drift * 60} ${cy - 160 - drift * 80} ${cx + drift * 170 + r * 0.2} ${cy - drift * 260 + r * 0.7}`} fill="none" stroke={theme.colors.ink} strokeWidth={3} strokeDasharray="10 8" opacity={drift} />
                <text x={cx + drift * 170} y={cy - drift * 260 + 14} textAnchor="middle" fill={theme.colors.ink} fontFamily={theme.fonts.display} fontWeight={800} fontSize={60} opacity={drift}>
                  ?
                </text>
              </g>
            ) : null}
          </svg>
        </AbsoluteFill>
      ) : null}
      {gridOut < 1 ? (
        <CountdownGrid gridIn={-100} t={PEAK} freeze={1} zoom={1 + gridOut * 0.12} opacity={1 - gridOut} />
      ) : null}
      {frame < toEarth + 2 ? (
        <div style={{ position: "absolute", top: 708, width: 1080, display: "flex", justifyContent: "center", opacity: 1 - gridOut }}>
          <Rise delay={0} dy={10}>
            <Tag size={22}>FROZEN AT THE TOP · 0.25 s IN THE AIR · 30 cm UP</Tag>
          </Rise>
        </div>
      ) : null}
      {frame >= toEarth ? <Headline top={262} size={92} delay={toEarth} text={"CAN HUMANITY\n*MOVE* THE EARTH?"} /> : null}
      <Hypo at={fShake - 3} out={fQuake - 8} label="SHAKE THE PLANET?" />
      <Hypo at={fQuake - 3} out={fOrbit - 8} label="A HUGE EARTHQUAKE?" />
      <Hypo at={fOrbit - 3} out={9999} label="KNOCKED OUT OF ORBIT?" />
    </AbsoluteFill>
  );
};

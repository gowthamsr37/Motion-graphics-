// Scenes 5–6: the landing, and the ending.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { camera } from "../components/Camera";
import { CityPanel } from "../components/City";
import { Earth, EarthView, project } from "../components/Earth";
import { AIR, PEAK, Person, seeded } from "../components/Person";
import { Space } from "../components/Space";
import { Card, Headline, Rise, Tag } from "../components/UI";
import { CLAMP, theme } from "../theme";
import { wordAt } from "../timing";

// ───────────────────────────── S5 — WHAT HAPPENS WHEN WE LAND? ─────────────────────────────
// Slow-motion clock: hold at the peak, then 0.3× through the landing, easing back to real time.
const slowT = (frame: number, fps: number) => {
  let t = PEAK;
  for (let f = 8; f < frame; f++) {
    const sp = interpolate(f, [62, 84], [0.3, 1], CLAMP);
    t += sp / fps;
  }
  return t;
};

const Waves: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = theme.colors.cyan }) => (
  <g stroke={color} strokeWidth={3 * s} fill="none" strokeLinecap="round">
    <path d={`M ${x} ${y - 8 * s} L ${x + 8 * s} ${y - 8 * s} L ${x + 16 * s} ${y - 16 * s} L ${x + 16 * s} ${y + 16 * s} L ${x + 8 * s} ${y + 8 * s} L ${x} ${y + 8 * s} Z`} fill={color} stroke="none" />
    {[1, 2, 3].map((i) => (
      <path key={i} d={`M ${x + 20 * s + i * 7 * s} ${y - (6 + i * 5) * s} Q ${x + 26 * s + i * 9 * s} ${y} ${x + 20 * s + i * 7 * s} ${y + (6 + i * 5) * s}`} opacity={1 - i * 0.22} />
    ))}
  </g>
);

const Chip: React.FC<{ at: number; top: number; icon: React.ReactNode; text: string }> = ({ at, top, icon, text }) => {
  const p = useSpringLocal(at);
  return (
    <div style={{ position: "absolute", left: 64, top, opacity: p, transform: `translateX(${(1 - p) * -24}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px 10px 12px", borderRadius: 12, background: "rgba(3,7,18,0.74)", border: `1.5px solid ${theme.colors.panelEdge}` }}>
        <svg width={56} height={40}>{icon}</svg>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: theme.colors.ink }}>{text}</span>
      </div>
    </div>
  );
};

const useSpringLocal = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: theme.spring.smooth });
};

const TapsGlobe: React.FC<{ v: EarthView; on: number }> = ({ v, on }) => {
  const frame = useCurrentFrame();
  const dots = useMemo(() => {
    const r = seeded(5);
    // weighted toward where people actually live (a rough land/population mask in this view)
    return Array.from({ length: 230 }, () => {
      const lat = Math.asin(r() * 1.5 - 0.6) * 57.3;
      const lon = -20 + r() * 150;
      return { lat, lon, ph: r() * 40, per: 18 + Math.floor(r() * 22) };
    });
  }, []);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: on }}>
      {dots.map((d, i) => {
        const q = project(v, d.lat, d.lon);
        if (q.z < 0.15) return null;
        const ph = ((frame + d.ph) % d.per) / d.per;
        return (
          <g key={i}>
            <circle cx={q.x} cy={q.y} r={3.2} fill={theme.colors.orangeHi} opacity={0.95} />
            <circle cx={q.x} cy={q.y} r={3 + ph * 13} fill="none" stroke={theme.colors.orange} strokeWidth={2} opacity={(1 - ph) * 0.8} />
          </g>
        );
      })}
    </svg>
  );
};

const QuakeCut: React.FC<{ x: number; y: number; w: number; h: number; t0: number }> = ({ x, y, w, h, t0 }) => {
  const frame = useCurrentFrame();
  const surf = y + h * 0.28;
  const focus = { x: x + w * 0.42, y: y + h * 0.78 };
  const shake = frame > t0 ? Math.sin(frame * 2.3) * 3 * Math.exp(-((frame - t0) % 45) / 18) : 0;
  return (
    <g>
      {/* strata */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x} y={surf + i * h * 0.18} width={w} height={h * 0.18 + 1} fill={["#5A4636", "#4A392E", "#3A2E27", "#2B231F"][i]} />
      ))}
      <path d={`M ${x + w * 0.2} ${surf} L ${x + w * 0.62} ${y + h}`} stroke="#1A1411" strokeWidth={5} strokeDasharray="14 8" />
      {/* surface + little buildings */}
      <g transform={`translate(${shake} 0)`}>
        {[0.12, 0.3, 0.55, 0.72, 0.86].map((k, i) => (
          <rect key={i} x={x + w * k} y={surf - (26 + (i % 3) * 18)} width={34} height={26 + (i % 3) * 18} fill="#1E2433" />
        ))}
      </g>
      <line x1={x} y1={surf} x2={x + w} y2={surf} stroke="#8B7A66" strokeWidth={3} />
      {/* energy from one focus, all at once */}
      {frame > t0
        ? [0, 1, 2, 3].map((i) => {
            const rr = (((frame - t0) * 5 + i * 55) % 220) + 10;
            return <circle key={i} cx={focus.x} cy={focus.y} r={rr} fill="none" stroke={theme.colors.orange} strokeWidth={4} opacity={(1 - rr / 230) * 0.9} />;
          })
        : null}
      <circle cx={focus.x} cy={focus.y} r={10} fill={theme.colors.orangeHi} style={{ filter: `drop-shadow(0 0 10px ${theme.colors.orange})` }} />
    </g>
  );
};

const NoRow: React.FC<{ at: number; top: number; text: string }> = ({ at, top, text }) => {
  const p = useSpringLocal(at);
  const x = useSpringLocal(at + 5);
  return (
    <div style={{ position: "absolute", left: 120, width: 840, top, height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p, transform: `translateY(${(1 - p) * 20}px)`, borderBottom: `1.5px solid ${theme.colors.panelEdge}` }}>
      <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: theme.colors.ink, letterSpacing: "0.03em" }}>{text}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 10, transform: `scale(${0.6 + 0.4 * x})`, opacity: x }}>
        <svg width={38} height={38}>
          <circle cx={19} cy={19} r={17} fill="none" stroke={theme.colors.cyan} strokeWidth={3} />
          <path d="M 12 12 L 26 26 M 26 12 L 12 26" stroke={theme.colors.cyan} strokeWidth={3.5} strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 36, color: theme.colors.cyan }}>NO</span>
      </span>
    </div>
  );
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s5", p, n);
  const bB = W("But") - 6, bC = W("No") - 8;
  const t = slowT(frame, fps);
  const landF = (() => {
    for (let f = 0; f < 200; f++) if (slowT(f, fps) >= AIR) return f;
    return 0;
  })();
  const aOut = interpolate(frame, [bB - 8, bB], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const panelIn = spring({ frame, fps, config: theme.spring.smooth });
  const jolt = frame >= landF ? Math.sin((frame - landF) * 2.1) * 3 * Math.exp(-(frame - landF) / 5) : 0;
  const cmpIn = interpolate(frame, [bB, bB + 12], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const cmpOut = interpolate(frame, [bC - 8, bC], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const left = spring({ frame: frame - bB - 2, fps, config: theme.spring.smooth });
  const right = spring({ frame: frame - bB - 8, fps, config: theme.spring.smooth });
  const neq = spring({ frame: frame - W("nothing"), fps, config: theme.spring.bouncy });
  const tapsV: EarthView = { cx: 285, cy: 760, r: 170, lat: 18, lon: 55, clouds: frame * 0.04 };
  // beat C: Earth carries on — real rotation, sun fixed in space (terminator stays put, continents move)
  const fc = Math.max(0, frame - bC);
  const endV: EarthView = { cx: 540, cy: 740, r: 300, lat: 16, lon: 40 + fc * 0.3, utc: 12 + fc * 0.02, clouds: frame * 0.05 };
  return (
    <AbsoluteFill>
      <Space drift={-frame * 0.35 - 500} />
      {/* A · slow-motion landing */}
      {frame < bB + 2 ? (
        <AbsoluteFill style={{ opacity: panelIn * (1 - aOut), transform: `translateY(${(1 - panelIn) * 40 + jolt}px)` }}>
          <Card x={40} y={270} w={1000} h={930}>
            <CityPanel city="bengaluru" w={1000} h={930} t={t} ripples dense crowdSeed={21} zoom={1.02 + frame * 0.0006} />
          </Card>
          <div style={{ position: "absolute", right: 64, top: 290 }}>
            <Tag size={20}>SLOW MOTION · 0.3×</Tag>
          </div>
          <Chip at={W("noise") - 2} top={370} icon={<Waves x={8} y={20} />} text="Local noise" />
          <Chip
            at={W("vibrations") - 2}
            top={446}
            icon={<path d={Array.from({ length: 28 }, (_, i) => `${i ? "L" : "M"} ${2 + i * 1.9} ${20 + Math.sin(i * 1.7 + frame * 0.8) * 9 * Math.exp(-i / 14)}`).join(" ")} stroke={theme.colors.cyan} strokeWidth={2.5} fill="none" />}
            text="Tiny vibrations nearby"
          />
        </AbsoluteFill>
      ) : null}
      {/* B · scattered taps vs one earthquake */}
      {frame >= bB - 2 && frame < bC + 2 ? (
        <AbsoluteFill style={{ opacity: cmpIn * (1 - cmpOut) }}>
          <div style={{ position: "absolute", inset: 0, opacity: left, transform: `translateY(${(1 - left) * 40}px)` }}>
            <Card x={40} y={330} w={490} h={800} style={{ background: "rgba(6,12,28,0.9)" }}>
              <div />
            </Card>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: right, transform: `translateY(${(1 - right) * 40}px)` }}>
            <Card x={550} y={330} w={490} h={800} style={{ background: "rgba(6,12,28,0.9)" }}>
              <div />
            </Card>
          </div>
          <AbsoluteFill style={{ opacity: left }}>
            <Earth view={tapsV} />
            <TapsGlobe v={tapsV} on={1} />
          </AbsoluteFill>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: right }}>
            <QuakeCut x={551} y={540} w={488} h={430} t0={bB + 12} />
          </svg>
          {[
            { x: 40, p: left, title: "8.3 BILLION\nTINY TAPS", sub: "Spread over the planet,\nsoaked up by legs and\nthe ground nearby" },
            { x: 550, p: right, title: "ONE\nEARTHQUAKE", sub: "One fault, deep\nunderground, releasing\nits energy all at once" },
          ].map((c) => (
            <div key={c.x} style={{ position: "absolute", left: c.x, width: 490, top: 352, textAlign: "center", opacity: c.p }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, lineHeight: 1, color: theme.colors.ink, whiteSpace: "pre-line" }}>{c.title}</div>
            </div>
          ))}
          {[
            { x: 40, p: left, sub: "Spread over the planet,\nsoaked up by legs and\nthe ground nearby" },
            { x: 550, p: right, sub: "One fault, deep\nunderground, releasing\nits energy all at once" },
          ].map((c) => (
            <div key={c.x} style={{ position: "absolute", left: c.x + 20, width: 450, top: 990, textAlign: "center", opacity: c.p, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 25, lineHeight: 1.3, color: theme.colors.inkDim, whiteSpace: "pre-line" }}>
              {c.sub}
            </div>
          ))}
          <div style={{ position: "absolute", left: 540 - 60, top: 690, width: 120, height: 120, borderRadius: 60, background: theme.colors.space, border: `2px solid ${theme.colors.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${neq})`, opacity: Math.min(1, neq * 2) }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92, color: theme.colors.cyan, lineHeight: 1, marginTop: -8 }}>≠</span>
          </div>
        </AbsoluteFill>
      ) : null}
      {/* C · Earth carries on */}
      {frame >= bC - 2 ? (
        <AbsoluteFill style={{ opacity: interpolate(frame, [bC - 2, bC + 10], [0, 1], CLAMP) }}>
          <Earth view={endV} />
          <Headline top={262} size={92} delay={bC} text={"EARTH *CARRIES ON*"} accent={theme.colors.cyan} />
          <div style={{ position: "absolute", top: 372, width: 1080, display: "flex", justifyContent: "center" }}>
            <Rise delay={bC + 8}>
              <Tag>STILL SPINNING · STILL ON ITS ORBIT</Tag>
            </Rise>
          </div>
          <NoRow at={W("No")} top={1062} text="PLANET-WIDE QUAKE" />
          <NoRow at={W("tsunami") - 4} top={1124} text="TSUNAMI" />
          <NoRow at={W("change") - 4} top={1186} text="CHANGE TO EARTH'S ORBIT" />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────────── S6 — THE MEMORABLE ENDING ─────────────────────────────
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s6", p, n);
  const v = camera(frame, [
    { at: 0, dur: 1, v: { cx: 540, cy: 1060 + 2600, r: 2600, lat: -70, lon: 46 } },
    { at: 8, dur: 165, v: { cx: 540, cy: 905, r: 320, lat: 16, lon: 62 } },
  ]);
  const view: EarthView = { ...v, lon: v.lon + frame * 0.04, clouds: frame * 0.05 };
  const figs = useMemo(() => {
    const r = seeded(77);
    return Array.from({ length: 19 }, (_, i) => ({ dx: (i - 9) * 30 + (r() - 0.5) * 10, H: 0.85 + r() * 0.3, dir: (r() < 0.5 ? 1 : -1) as 1 | -1, hair: (["short", "pony", "bun", "long", "cap"] as const)[Math.floor(r() * 5)] }));
  }, []);
  const figH = 0.021 * view.r;
  const figOn = interpolate(view.r, [700, 1300], [0, 1], CLAMP);
  const us = interpolate(frame, [10, 22, 60, 76], [0, 1, 1, 0], CLAMP);
  const linesOut = W("So") - 10;
  const end = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <AbsoluteFill>
      <Space drift={-frame * 0.3 - 640} />
      <Earth view={view} />
      {figOn > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: figOn }}>
          {figs.map((f, i) => {
            const s = (f.dx * view.r) / 2600;
            const a = Math.asin(Math.max(-1, Math.min(1, s / view.r)));
            const gx = view.cx + Math.sin(a) * view.r, gy = view.cy - Math.cos(a) * view.r;
            return (
              <g key={i} transform={`rotate(${(a * 180) / Math.PI} ${gx} ${gy})`}>
                <Person x={gx} ground={gy + 1} H={figH * f.H} t={-3} dir={f.dir} color="#0A0E18" look={{ hair: f.hair }} ready={false} shadow={false} />
              </g>
            );
          })}
          <g opacity={us}>
            <path d={`M ${view.cx - 300 * (view.r / 2600)} ${view.cy - view.r - figH * 1.6} l 0 -14 l ${600 * (view.r / 2600)} 0 l 0 14`} fill="none" stroke={theme.colors.cyan} strokeWidth={3} />
          </g>
        </svg>
      ) : null}
      <div style={{ position: "absolute", top: view.cy - view.r - figH * 1.6 - 80, width: 1080, display: "flex", justifyContent: "center", opacity: us }}>
        <Tag size={22}>THAT'S US</Tag>
      </div>
      <Headline top={262} size={84} delay={W("8.3") - 2} out={linesOut} text="8.3 BILLION PEOPLE." />
      <Headline top={358} size={84} delay={W("One") - 2} out={linesOut + 2} text="ONE JUMP." />
      <Headline top={454} size={84} delay={W("And") - 2} out={linesOut + 4} text="*ALMOST ZERO* EFFECT." accent={theme.colors.cyan} />
      <div style={{ position: "absolute", top: 300, width: 1080, textAlign: "center" }}>
        <Rise delay={W("what") - 4} dy={20}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 70, letterSpacing: "0.04em", color: theme.colors.ink, textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
            WHAT SHOULD WE <span style={{ color: theme.colors.cyan }}>TEST NEXT?</span>
          </span>
        </Rise>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: end }} />
    </AbsoluteFill>
  );
};

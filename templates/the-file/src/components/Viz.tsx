// The File — scene widgets. Every widget is absolutely positioned on the 1080×1920 canvas and keyed to
// frames you pass in (usually from wordAt / sentence in ../timing, so visuals land on the spoken word).
//
//   Kicker      serif scene title + small label (top-left, y≈248)
//   DoorCard    a name card that spins like a revolving door through a list (optional steady lead card first)
//   Tally       tally marks + label ("7 batters · 3 years")
//   Slam        a giant number that slams in;  ScoreStack: a column of slammed numbers with captions
//   Lollipop    ranked horizontal lollipop chart with an optional dashed benchmark line
//   Road        career timeline on a seam with a tracking camera, stations and dotted gaps
//   DotColumn   one dot per unit (balls per dismissal, runs per innings …), bottom-aligned columns
//   FlyRow      one butterfly (mirror) row comparing A (left, accent) and B (right);  Crack: red zigzag divider
//   CaseFile    a taped photo print;  Stamp: a rubber stamp that lands on a frame
//   StatRow     a row of 3–5 headline stats;  Footnote: small source line
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP, Disp, fade, Label, Seam, Serif, useP } from "./Ed";

const C = theme.colors;
type Tone = "pick" | "main" | "muted";
const toneColor = (t: Tone = "main") => (t === "pick" ? C.accent : t === "muted" ? C.mute : C.ink);

/* ---------- Kicker ---------- */
export const Kicker: React.FC<{ title: string; sub?: string; subAt?: number; outAt?: number; size?: number; top?: number }> = ({ title, sub, subAt = 0, outAt, size = 56, top = 248 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top, opacity: outAt === undefined ? 1 : 1 - fade(frame, outAt, 10) }}>
      <Serif size={size}>{title}</Serif>
      {sub && (
        <div style={{ marginTop: 10, opacity: fade(frame, subAt) }}>
          <Label size={22}>{sub}</Label>
        </div>
      )}
    </div>
  );
};

/* ---------- DoorCard ---------- */
export const DoorCard: React.FC<{
  names: string[];
  start: number; // frame the spinning starts
  end: number; // frame the card disappears
  per?: number; // frames per name (default: fit the list between start and end)
  lead?: { name: string; note?: string; from?: number }; // steady card shown before `start`, then spun away
  top?: number;
}> = ({ names, start, end, per, lead, top = 690 }) => {
  const frame = useCurrentFrame();
  const step = per ?? Math.max(10, Math.floor((end - start) / names.length));
  const leadFrom = lead?.from ?? 14;
  const pre = Boolean(lead) && frame < start;
  if (frame < (lead ? leadFrom : start) || frame >= end) return null;
  const k = Math.floor((frame - start) / step);
  const local = ((frame - start) % step) / step;
  const name = pre ? lead!.name : names[Math.max(0, Math.min(names.length - 1, k))];
  const rot = pre ? interpolate(frame, [leadFrom, leadFrom + 8, start - 6, start], [-80, 0, 0, 80], CLAMP) : interpolate(local, [0, 0.25, 0.75, 1], [-80, 0, 0, 80]);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", perspective: 900 }}>
      <div style={{ transform: `rotateY(${rot}deg)`, opacity: interpolate(Math.abs(rot), [0, 80], [1, 0]), background: C.paper, padding: "14px 30px 6px", boxShadow: "0 18px 40px rgba(40,30,10,0.18)" }}>
        <Disp size={name.length > 14 ? 92 : 110}>{name}</Disp>
        {pre && lead!.note && (
          <div style={{ textAlign: "center", paddingBottom: 8 }}>
            <Label size={20} color={C.red}>
              {lead!.note}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Tally ---------- */
export const Tally: React.FC<{ n: number; at: number; label: string; extra?: string; extraAt?: number; outAt?: number; top?: number }> = ({ n, at, label, extra, extraAt, outAt, top = 1150 }) => {
  const frame = useCurrentFrame();
  const shown = Math.min(n, Math.max(0, Math.floor((frame - at) / 3)));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: fade(frame, at - 2) * (outAt === undefined ? 1 : 1 - fade(frame, outAt, 6)) }}>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 70, background: i < shown ? C.ink : C.line, transform: i % 5 === 4 ? "rotate(18deg)" : undefined }} />
        ))}
      </div>
      <Label size={40} color={C.ink} weight={900}>
        {label}
      </Label>
      {extra && (
        <Serif size={44} color={C.accent} style={{ opacity: fade(frame, extraAt ?? at) }}>
          {extra}
        </Serif>
      )}
    </div>
  );
};

/* ---------- Slam / ScoreStack ---------- */
export const Slam: React.FC<{ text: string; at: number; color?: string; size?: number }> = ({ text, at, color = C.ink, size = 300 }) => {
  const frame = useCurrentFrame();
  const p = useP(at, { damping: 12, stiffness: 260, mass: 0.7 });
  if (frame < at - 1) return null;
  return (
    <div style={{ transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`, transformOrigin: "0% 60%", opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
      <Disp size={size} color={color}>
        {text}
      </Disp>
    </div>
  );
};

export const ScoreStack: React.FC<{ rows: { t: string; label: string; at: number; color?: string }[]; left?: number; top?: number; size?: number; rowH?: number }> = ({ rows, left = 70, top = 360, size = 280, rowH = 300 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top, display: "flex", flexDirection: "column", gap: 18 }}>
      {rows.map((r) => (
        <div key={r.t + r.label} style={{ height: rowH }}>
          <Slam text={r.t} at={r.at} color={r.color} size={size} />
          <div style={{ opacity: fade(frame, r.at + 4), marginTop: 4 }}>
            <Label size={24} color={C.ink2}>
              {r.label}
            </Label>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------- Lollipop ---------- */
export const Lollipop: React.FC<{
  rows: { name: string; sub?: string; value: number; at: number; tone?: Tone }[];
  max: number;
  ticks?: number[];
  benchmark?: { value: number; label: string; at: number };
  top?: number; // first row
  rowH?: number;
  x0?: number; // axis x
  x1?: number; // x of `max` — keep ≤ 870 so the pick's big label fits
  decimals?: number;
}> = ({ rows, max, ticks, benchmark, top = 420, rowH = 114, x0 = 360, x1 = 870, decimals = 1 }) => {
  const frame = useCurrentFrame();
  const X = (v: number) => x0 + ((x1 - x0) * v) / max;
  const H = rows.length * rowH;
  const axisTop = top - 20;
  const bj = benchmark ? fade(frame, benchmark.at, 12) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: x0, top: axisTop, width: x1 - x0, height: H, borderLeft: `2px solid ${C.ink}` }} />
      {(ticks ?? [max / 4, max / 2, (3 * max) / 4, max]).map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v), top: axisTop, height: H, borderLeft: `1px solid ${C.line}` }}>
          <div style={{ position: "absolute", top: H + 8, left: -18 }}>
            <Label size={18} color={C.mute}>
              {String(v)}
            </Label>
          </div>
        </div>
      ))}
      {benchmark && (
        <>
          <div style={{ position: "absolute", left: X(benchmark.value), top: axisTop - 8, height: H + 16, borderLeft: `3px dashed ${C.red}`, opacity: bj }} />
          <div style={{ position: "absolute", right: 1080 - X(benchmark.value) + 12, top: axisTop - 38, opacity: bj, textAlign: "right" }}>
            <Label size={20} color={C.red} weight={900}>
              {benchmark.label}
            </Label>
          </div>
        </>
      )}
      <div style={{ position: "absolute", left: 70, top, width: 940 }}>
        {rows.map((r) => {
          const p = theme.ease.out(interpolate(frame, [r.at, r.at + 16], [0, 1], CLAMP));
          const v = r.value * p;
          const pick = r.tone === "pick";
          const col = toneColor(r.tone);
          return (
            <div key={r.name} style={{ position: "relative", height: rowH, opacity: interpolate(p, [0, 0.15], [0.12, 1], CLAMP) }}>
              <div style={{ position: "absolute", left: 0, top: 26, width: x0 - 80 }}>
                <Label size={pick ? 26 : 22} color={col} weight={900} spacing="0.06em">
                  {r.name}
                </Label>
                {r.sub && (
                  <div>
                    <Label size={15} color={C.mute}>
                      {r.sub}
                    </Label>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", left: x0 - 70, top: 44, width: X(v) - x0, height: pick ? 8 : 4, background: col }} />
              <div style={{ position: "absolute", left: X(v) - 70 - (pick ? 18 : 11), top: pick ? 34 : 37, width: pick ? 36 : 22, height: pick ? 36 : 22, borderRadius: 40, background: col, boxShadow: pick ? `0 0 0 8px ${C.accentSoft}` : undefined }} />
              <div style={{ position: "absolute", left: X(v) - 70 + (pick ? 30 : 20), top: pick ? 8 : 22 }}>
                <Disp size={pick ? 84 : 44} color={col}>
                  {v.toFixed(decimals)}
                </Disp>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- Road ---------- */
// solid seam between gaps, dotted (unstitched) inside them
const segments = (gaps: { from: number; to: number }[], width: number) => {
  const out: { a: number; b: number; gap: boolean }[] = [];
  let x = 0;
  [...gaps].sort((p, q) => p.from - q.from).forEach((g) => {
    if (g.from > x) out.push({ a: x, b: g.from, gap: false });
    out.push({ a: g.from, b: g.to, gap: true });
    x = g.to;
  });
  if (x < width) out.push({ a: x, b: width, gap: false });
  return out;
};
type Station = { x: number; value: string; date: string; place: string; note?: string; at: number; tone?: "ink" | "accent" | "red" };
export const Road: React.FC<{
  stations: Station[]; // x in road coordinates (0 … width); keep ≥ 380 px between stations
  camera: { t: number; x: number }[]; // keyframes: at frame t, centre the road on x
  gaps?: { from: number; to: number; label: string; at: number }[]; // dotted stretches, road coordinates
  width: number;
  y?: number; // seam y
}> = ({ stations, camera, gaps = [], width, y = 1070 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let camX = camera[0].x;
  for (let i = 0; i < camera.length - 1; i++) {
    if (frame >= camera[i].t) camX = interpolate(frame, [camera[i + 1].t - 14, camera[i + 1].t], [camera[i].x, camera[i + 1].x], { easing: theme.ease.inOut, ...CLAMP });
  }
  const col = (t: Station["tone"]) => (t === "accent" ? C.accent : t === "red" ? C.red : C.ink);
  return (
    <div style={{ position: "absolute", left: 540 - camX, top: 0, width, height: 1920 }}>
      {segments(gaps, width).map((g, i) => (
        <Seam key={i} x={g.a} y={y} w={g.b - g.a} dotted={g.gap ? [0, g.b - g.a] : undefined} />
      ))}
      {gaps.map((g) => (
        <div key={g.label} style={{ position: "absolute", left: g.from, top: y - 92, width: g.to - g.from, textAlign: "center", opacity: fade(frame, g.at - 4) }}>
          <Serif size={50} color={C.ink2}>
            {g.label}
          </Serif>
        </div>
      ))}
      {stations.map((s) => {
        const p = spring({ frame: frame - s.at, fps, config: theme.spring.pop });
        const lit = frame >= s.at;
        const c = col(s.tone);
        return (
          <div key={s.place + s.date} style={{ position: "absolute", left: s.x - 200, top: y - 270, width: 400, display: "flex", flexDirection: "column", alignItems: "center", opacity: lit ? interpolate(p, [0, 0.3], [0, 1], CLAMP) : 0.12 }}>
            <div style={{ transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)` }}>
              <Disp size={210} color={c}>
                {s.value}
              </Disp>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: 22, background: c, marginTop: 10, boxShadow: `0 0 0 6px ${C.paper}` }} />
            <div style={{ marginTop: 26, textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
              <Label size={20} color={C.mute}>
                {s.date}
              </Label>
              <Disp size={50}>{s.place}</Disp>
              {s.note && (
                <Label size={16} color={c === C.ink ? C.ink2 : c}>
                  {s.note}
                </Label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- DotColumn ---------- */
export const DotColumn: React.FC<{ n: number; at: number; x: number; label: string; sub?: string; tone?: Tone; bottom?: number; perRow?: number; dot?: number }> = ({ n, at, x, label, sub, tone = "main", bottom = 1130, perRow = 8, dot = 22 }) => {
  const frame = useCurrentFrame();
  const g = 6;
  const color = toneColor(tone);
  const big = tone === "pick";
  const rows = Math.ceil(n / perRow);
  const shown = Math.floor(interpolate(frame, [at, at + 26], [0, n], { easing: theme.ease.out, ...CLAMP }));
  const w = perRow * (dot + g) - g;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: 0, width: w }}>
      <div style={{ position: "absolute", left: -40, top: bottom - rows * (dot + g) - 110, width: w + 80, textAlign: "center", opacity: fade(frame, at) }}>
        <Disp size={big ? 110 : 84} color={color}>
          {String(shown)}
        </Disp>
      </div>
      {Array.from({ length: n }).map((_, i) => {
        const r = Math.floor(i / perRow), c = i % perRow;
        return <div key={i} style={{ position: "absolute", left: c * (dot + g), top: bottom - (r + 1) * (dot + g), width: dot, height: dot, borderRadius: dot, background: i < shown ? color : "transparent", boxShadow: i < shown ? undefined : `inset 0 0 0 1.5px ${C.line}` }} />;
      })}
      <div style={{ position: "absolute", left: -60, width: w + 120, top: bottom + 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 4, opacity: fade(frame, at - 6) }}>
        <Disp size={44} color={big ? C.accent : C.ink}>
          {label}
        </Disp>
        {sub && (
          <Label size={16} color={C.mute}>
            {sub}
          </Label>
        )}
      </div>
    </div>
  );
};

/* ---------- FlyRow / Crack ---------- */
// A sits left in the accent colour; B right in ink (or muted once A clearly wins: winA).
export const FlyRow: React.FC<{ label: string; a: number; b: number; max: number; at: number; fmtA: string; fmtB: string; winA?: boolean; colorA?: string; colorB?: string }> = ({ label, a, b, max, at, fmtA, fmtB, winA, colorA = C.accent, colorB }) => {
  const cB = colorB ?? (winA ? C.mute : C.ink);
  const frame = useCurrentFrame();
  const p = theme.ease.out(interpolate(frame, [at, at + 18], [0, 1], CLAMP));
  const W = 270;
  const left = 540 - 120 - W * (a / max) * p;
  return (
    <div style={{ position: "relative", height: 92, opacity: interpolate(p, [0, 0.15], [0.12, 1], CLAMP) }}>
      <div style={{ position: "absolute", left, top: 26, width: W * (a / max) * p, height: 40, background: colorA }} />
      <div style={{ position: "absolute", left: 540 + 120, top: 26, width: W * (b / max) * p, height: 40, background: cB }} />
      <div style={{ position: "absolute", right: 1080 - (left - 12), top: 10, textAlign: "right" }}>
        <Disp size={64} color={colorA}>
          {fmtA}
        </Disp>
      </div>
      <div style={{ position: "absolute", left: 540 + 130 + W * (b / max) * p, top: 10, width: 200 }}>
        <Disp size={64} color={cB}>
          {fmtB}
        </Disp>
      </div>
      <div style={{ position: "absolute", left: 540 - 116, width: 232, top: 32, textAlign: "center" }}>
        <Label size={17} color={C.ink2}>
          {label}
        </Label>
      </div>
    </div>
  );
};

export const Crack: React.FC<{ y: number; at: number }> = ({ y, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const pts = Array.from({ length: 19 }, (_, i) => `${i * 60},${i % 2 ? 6 : -6}`).join(" ");
  return (
    <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: y, overflow: "visible" }}>
      <polyline points={pts} transform="translate(0,20)" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="1300" strokeDashoffset={1300 * (1 - p)} />
    </svg>
  );
};

/* ---------- CaseFile / Stamp ---------- */
// A taped photo print that drops in at `at`. Put a <Stamp> inside as a child (coordinates are relative to the print).
export const CaseFile: React.FC<{ src: string; at: number; x?: number; y?: number; w?: number; h?: number; pos?: string; tilt?: number; children?: React.ReactNode }> = ({ src, at, x = 90, y = 384, w = 900, h = 524, pos = "50% 30%", tilt = -3, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: C.paperHi,
        padding: 20,
        boxSizing: "border-box",
        boxShadow: "0 30px 60px rgba(40,30,10,0.32), 0 4px 10px rgba(40,30,10,0.18)",
        transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px) rotate(${interpolate(p, [0, 1], [tilt - 7, tilt])}deg)`,
        opacity: interpolate(p, [0, 0.25], [0, 1], CLAMP),
      }}
    >
      <Img src={staticFile(`photos/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />
      <div style={{ position: "absolute", left: w / 2 - 90, top: -22, width: 180, height: 46, background: "rgba(251,246,232,0.78)", transform: "rotate(3deg)", boxShadow: "0 2px 6px rgba(40,30,10,0.12)" }} />
      {children}
    </div>
  );
};

// Lands (scale 2.4 → 1, then a small settle) at frame `at`. Put the "slam" + "impact" SFX at at - 2.
export const Stamp: React.FC<{ text: string; sub?: string; at: number; x: number; y: number; rotate?: number; size?: number }> = ({ text, sub, at, x, y, rotate = -11, size = 118 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at - 6) return null;
  const st = interpolate(frame, [at - 6, at], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const settle = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 300, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg) scale(${interpolate(st, [0, 1], [2.4, 1]) * interpolate(settle, [0, 1], [0.94, 1])})`,
        opacity: interpolate(st, [0, 0.4], [0, 0.92], CLAMP),
        border: `7px solid ${C.red}`,
        outline: `3px solid ${C.red}`,
        outlineOffset: 6,
        padding: "6px 26px 0",
        textAlign: "center",
        mixBlendMode: "multiply",
      }}
    >
      <Disp size={size} color={C.red}>
        {text}
      </Disp>
      {sub && (
        <div style={{ marginTop: -10, paddingBottom: 8 }}>
          <Label size={20} color={C.red} weight={900} spacing="0.3em">
            {sub}
          </Label>
        </div>
      )}
    </div>
  );
};

/* ---------- StatRow / Footnote ---------- */
export const StatRow: React.FC<{ stats: { v: string; l: string; accent?: boolean }[]; at: number; outAt?: number; top?: number; size?: number }> = ({ stats, at, outAt, top = 1196, size = 72 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", gap: 40, opacity: fade(frame, at) * (outAt === undefined ? 1 : 1 - fade(frame, outAt, 8)) }}>
      {stats.map((x, i) => (
        <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: fade(frame, at + i * 5) }}>
          <Disp size={size} color={x.accent ? C.accent : C.ink}>
            {x.v}
          </Disp>
          <Label size={16} color={C.mute}>
            {x.l}
          </Label>
        </div>
      ))}
    </div>
  );
};

export const Footnote: React.FC<{ text: string; at: number; top?: number }> = ({ text, at, top = 1262 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", opacity: fade(frame, at) }}>
      <Label size={15} color={C.mute} weight={600} spacing="0.08em">
        {text}
      </Label>
    </div>
  );
};

/* ---------- Lockup / Versus / Brand ---------- */
// Hero name + an ink tag beneath (readable over an accent-filled glyph).
export const Lockup: React.FC<{ name: string; tag?: string; at: number; top?: number; size?: number }> = ({ name, tag, at, top = 236, size = 104 }) => {
  const p = useP(at, theme.spring.heavy);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)` }}>
      <Disp size={size}>{name}</Disp>
      {tag && (
        <div style={{ marginTop: 10 }}>
          <span style={{ background: C.ink, padding: "4px 22px 10px" }}>
            <Serif size={44} color={C.paperHi} weight={900}>
              {tag}
            </Serif>
          </span>
        </div>
      )}
    </div>
  );
};

export const Versus: React.FC<{ a: string; b: string; top?: number; size?: number; colorB?: string }> = ({ a, b, top = 250, size = 86, colorB = C.ink }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <Disp size={size} color={C.accent}>
      {a}
    </Disp>
    <Serif size={44} color={C.mute}>
      vs
    </Serif>
    <Disp size={size} color={colorB}>
      {b}
    </Disp>
  </div>
);

export const Brand: React.FC<{ at: number; top?: number; series: string; tagline: string }> = ({ at, top = 1196, series, tagline }) => {
  const p = useP(at, theme.spring.heavy);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)` }}>
      <Label size={22} color={C.mute} spacing="0.3em">
        {tagline}
      </Label>
      <div style={{ marginTop: 8 }}>
        <Disp size={92}>{series}</Disp>
      </div>
    </div>
  );
};

// SCENE 1 — HOOK. Two batters, two cities, two buses: same average every time → "SAME AVERAGE." → the dots burst apart: "DIFFERENT SPREAD!"
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Avatar, Bus, Thermometer } from "../components/Icons";
import { A_SCORES, B_SCORES, labelLift, labelNudge, ScoreDot, sx, type Scale } from "../components/Runs";
import { alpha, BAT_A, BAT_B, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const KEY = [C.cyan, C.green, C.violet];

const Chip: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = C.text, size = 30 }) => (
  <div style={{ padding: "8px 18px", borderRadius: 18, background: alpha(color, 0.14), border: `2.5px solid ${alpha(color, 0.75)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{children}</div>
);

// ---------- vignette 1: two batters ----------
const BSC: Scale = { lo: 0, hi: 80, x0: 240, x1: 950 };
const BattersVignette: React.FC<{ H: number }> = ({ H }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const rows = [
    { y: 900, scores: A_SCORES, who: "A" as const, shirt: "#93C5FD" },
    { y: 1110, scores: B_SCORES, who: "B" as const, shirt: BAT_B },
  ];
  const meanP = ease(frame, [H + 4, H + 16], [0, 1], theme.ease.inOut);
  return (
    <>
      {rows.map((r, ri) => {
        const av = spr(ri * 3, theme.spring.bouncy);
        return (
          <React.Fragment key={r.who}>
            <div style={{ position: "absolute", left: 130 - 45, top: r.y - 50, opacity: Math.min(1, av * 2), transform: `translateX(${(1 - av) * -60}px)` }}>
              <Avatar size={90} shirt={r.shirt} skin={ri ? C.skin[2] : C.skin[0]} hair={C.hair[ri]} />
            </div>
            <div style={{ position: "absolute", left: BSC.x0 - 16, top: r.y - 2, width: (BSC.x1 - BSC.x0 + 32) * ease(frame, [ri * 3, ri * 3 + 14], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.3) }} />
            {r.scores.map((v, i) => (
              <ScoreDot key={i} x={sx(BSC, v)} y={r.y} at={3 + ri * 4 + i * 3} who={r.who} label={String(v)} r={15} labelDx={labelNudge(r.who, v)} labelDy={labelLift(r.who, v)} />
            ))}
          </React.Fragment>
        );
      })}
      {meanP > 0.01 ? (
        <div style={{ position: "absolute", left: sx(BSC, 40) - 2, top: 820, height: 330 * meanP, borderLeft: `4px dashed ${alpha(C.text, 0.8)}` }} />
      ) : null}
      <Pop at={H + 10} x={sx(BSC, 40)} y={780} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Chip>BOTH AVERAGE 40</Chip>
      </Pop>
    </>
  );
};

// ---------- vignette 2: two cities, same average temperature ----------
const TH = { top: 790, h: 440 };
const tubeY = (lv: number) => TH.top + (318 / 400) * TH.h - ((318 - 40) / 400) * TH.h * lv;
const CitiesVignette: React.FC<{ C1: number }> = ({ C1 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const cities = [
    { x: 330, name: "CITY A", lo: 23, hi: 27, t: 25 + 2 * Math.sin(frame / 6), color: C.green },
    { x: 750, name: "CITY B", lo: 12, hi: 38, t: 25 + 13 * Math.sin(frame / 8 + 1), color: C.orange },
  ];
  return (
    <>
      {cities.map((c, i) => {
        const p = spr(C1 - 12 + i * 3, theme.spring.bouncy);
        const band = ease(frame, [C1 + 8, C1 + 20], [0, 1]);
        return (
          <React.Fragment key={c.name}>
            <div style={{ position: "absolute", left: c.x - 66, top: TH.top, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 80}px)` }}>
              <Thermometer height={TH.h} level={c.t / 45} color={c.color} />
            </div>
            {/* the range this city swings through */}
            <div style={{ position: "absolute", left: c.x + 62, top: tubeY(c.hi / 45), width: 14, height: (tubeY(c.lo / 45) - tubeY(c.hi / 45)) * band, borderRadius: 7, background: alpha(c.color, 0.5), boxShadow: `0 0 12px ${alpha(c.color, 0.6)}` }} />
            <div style={{ position: "absolute", left: c.x + 90, top: tubeY(c.hi / 45) - 16, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: band }}>{c.hi}°</div>
            <div style={{ position: "absolute", left: c.x + 90, top: tubeY(c.lo / 45) - 16, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: band }}>{c.lo}°</div>
            <Pop at={C1 - 6 + i * 3} x={c.x} y={TH.top + TH.h + 40} from="up" dist={16}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim }}>{c.name}</div>
            </Pop>
          </React.Fragment>
        );
      })}
      <Pop at={C1 + 6} x={540} y={740} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Chip>BOTH AVERAGE 25°C</Chip>
      </Pop>
    </>
  );
};

// ---------- vignette 3: two buses, both "on time" on average ----------
const TX = (min: number) => 540 + min * 26.7;
const BusesVignette: React.FC<{ C2: number }> = ({ C2 }) => {
  const frame = useCurrentFrame();
  const rows = [
    { y: 930, arr: [-1, 1, 0, 0.5], color: "#93C5FD", name: "BUS A" },
    { y: 1060, arr: [-13, 12, -5, 8], color: C.orange, name: "BUS B" },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: 1168, width: 840 * ease(frame, [C2 - 12, C2], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {[
        { m: -15, t: "8:45" },
        { m: 0, t: "9:00" },
        { m: 15, t: "9:15" },
      ].map((l) => (
        <div key={l.t} style={{ position: "absolute", left: TX(l.m), top: 1200, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: C.dim, opacity: ease(frame, [C2 - 8, C2], [0, 1]) }}>
          {l.t}
        </div>
      ))}
      <div style={{ position: "absolute", left: TX(0) - 2, top: 860, height: 300 * ease(frame, [C2 + 8, C2 + 18], [0, 1]), borderLeft: `4px dashed ${alpha(C.text, 0.7)}` }} />
      {rows.map((r, ri) =>
        r.arr.map((m, i) => {
          const at = C2 - 10 + ri * 6 + i * 3;
          const e = ease(frame, [at, at + 16], [0, 1], theme.ease.out);
          if (e <= 0) return null;
          return (
            <div key={`${ri}-${i}`} style={{ position: "absolute", left: interpolate(e, [0, 1], [TX(m) + 420, TX(m)]) - 32, top: r.y - 20 - (ri === 0 ? i * 10 : 0), opacity: Math.min(1, e * 3) }}>
              <Bus w={64} color={r.color} />
            </div>
          );
        }),
      )}
      {rows.map((r, ri) => (
        <Pop key={r.name} at={C2 - 6 + ri * 4} x={190} y={r.y - 50} from="up" dist={12}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: C.dim }}>{r.name}</div>
        </Pop>
      ))}
      <Pop at={C2 + 12} x={540} y={820} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Chip>BOTH AVERAGE 9:00</Chip>
      </Pop>
    </>
  );
};

// ---------- kinetic headline stack ----------
const Line: React.FC<{ at: number; out: number; y: number; pre: string; word: string; color: string }> = ({ at, out, y, pre, word, color }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const a = spr(at - 3, theme.spring.snappy);
  const b = spr(at + 1, theme.spring.pop);
  const e = exitP(frame, out, 8);
  const under = ease(frame, [at + 4, at + 14], [0, 1]);
  if (a <= 0.001 || e >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 22, transform: `translateY(-50%) translateY(${-30 * e}px)`, opacity: 1 - e, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, letterSpacing: "-0.02em", lineHeight: 1 }}>
      <span style={{ color: C.text, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>{pre}</span>
      <span style={{ position: "relative", color, opacity: Math.min(1, b * 1.5), transform: `scale(${interpolate(b, [0, 1], [1.35, 1])})`, textShadow: glowText(color, 0.7) }}>
        {word}
        <span style={{ position: "absolute", left: 0, bottom: -10, height: 8, borderRadius: 4, width: `${under * 100}%`, background: color }} />
      </span>
    </div>
  );
};

const SPREAD_A = [-70, -36, -12, 12, 36, 70];
const SPREAD_B = [-400, -260, -110, 110, 260, 400];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const H0 = s.sent(0).from;
  const C1 = s.sent(1).from;
  const C2 = s.sent(2).from;
  const D = s.sent(3).from;
  const T = s.sent(4).from;
  const END = s.duration;
  const OUT = END - 15;

  const cam = (f: number) => ease(f, [C1 - 8, C1 + 3], [0, -1080], theme.ease.inOut) + ease(f, [C2 - 8, C2 + 3], [0, -1080], theme.ease.inOut);
  const camX = cam(frame);
  const blur = Math.min(16, Math.abs(camX - cam(frame - 1)) * 0.09);
  const collapse = ease(frame, [D - 7, D + 7], [0, 1], theme.ease.inOut);
  const sh = shake(frame, D + 1, 12, 12);
  const sh2 = shake(frame, T + 6, 12, 12);
  const same = spr(D, theme.spring.pop);
  const spreadA = spr(T + 4, theme.spring.smooth);
  const spreadB = spr(T + 6, theme.spring.bouncy);
  const merge = ease(frame, [OUT, END - 2], [0, 1], theme.ease.in);
  const textOut = exitP(frame, OUT - 2, 8);
  const dotsIn = spr(D + 4, theme.spring.pop);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      {collapse < 1 ? (
        <AbsoluteFill style={{ transformOrigin: "540px 960px", transform: `scale(${1 - collapse * 0.7})`, opacity: 1 - collapse }}>
          <AbsoluteFill style={{ transform: `translateX(${camX}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
            {frame < C1 + 6 ? <BattersVignette H={H0} /> : null}
            {frame > C1 - 14 && frame < C2 + 6 ? (
              <AbsoluteFill style={{ left: 1080 }}>
                <CitiesVignette C1={C1} />
              </AbsoluteFill>
            ) : null}
            {frame > C2 - 16 ? (
              <AbsoluteFill style={{ left: 2160 }}>
                <BusesVignette C2={C2} />
              </AbsoluteFill>
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Line at={H0} out={D - 9} y={310} pre="TWO" word="BATTERS," color={KEY[0]} />
      <Line at={C1} out={D - 7} y={398} pre="TWO" word="CITIES," color={KEY[1]} />
      <Line at={C2} out={D - 5} y={486} pre="TWO" word="BUSES…" color={KEY[2]} />

      {/* SAME AVERAGE. */}
      {same > 0.001 && textOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", opacity: Math.min(1, same * 2) * (1 - textOut), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 56, color: C.text, letterSpacing: "0.02em", transform: `translateY(${(1 - same) * 30}px)` }}>ALL THREE HAVE THE</div>
          <div
            style={{
              marginTop: 18,
              fontSize: 104,
              letterSpacing: "-0.03em",
              transform: `scale(${interpolate(same, [0, 1], [1.6, 1])})`,
              background: `linear-gradient(180deg, #FFFFFF, ${C.cyan})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 24px ${alpha(C.cyan, 0.6)})`,
            }}
          >
            SAME AVERAGE.
          </div>
        </div>
      ) : null}
      <Ripple at={D + 2} x={540} y={660} color={C.cyan} size={900} rings={2} flat={0.35} />

      {/* two rows of dots: stacked on one average... then the spread is revealed */}
      {dotsIn > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: 538, top: 830, height: 240 * dotsIn * (1 - merge), borderLeft: `4px dashed ${alpha(C.text, 0.7)}`, opacity: 1 - textOut }} />
          {[
            { y: 890, offs: SPREAD_A, p: spreadA, col: BAT_A },
            { y: 1010, offs: SPREAD_B, p: spreadB, col: BAT_B },
          ].map((row, ri) =>
            row.offs.map((o, i) => {
              const x = 540 + o * row.p * (1 - merge);
              const y = interpolate(merge, [0, 1], [row.y, 930]);
              return (
                <div
                  key={`${ri}-${i}`}
                  style={{
                    position: "absolute",
                    left: x - 18,
                    top: y - 18,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: row.col,
                    boxShadow: `0 0 16px ${alpha(row.col, 0.8)}`,
                    transform: `scale(${dotsIn * (1 - merge * 0.5)})`,
                    opacity: row.p < 0.05 ? (i === 0 ? 1 : 0.35) : 1,
                  }}
                />
              );
            }),
          )}
        </>
      ) : null}
      <Burst at={T + 8} x={540} y={1010} color={C.orange} count={18} radius={300} seed={14} />

      {/* BUT A COMPLETELY DIFFERENT SPREAD! — RGB-split glitch */}
      {frame >= T - 2 && textOut < 1
        ? (() => {
            const p1 = spr(T - 2, theme.spring.snappy);
            const p2 = spr(T + 6, theme.spring.pop);
            const g = Math.max(0, 1 - (frame - T - 6) / 12);
            const dx = Math.sin((frame - T) * 2.3) * 9 * g;
            const glitch = g > 0 ? `${dx}px 0 ${alpha(C.cyan, 0.9)}, ${-dx}px 0 ${alpha(C.red, 0.9)}` : "none";
            return (
              <div style={{ position: "absolute", left: 0, right: 0, top: 1150, opacity: 1 - textOut, fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, textAlign: "center" }}>
                <div style={{ fontSize: 70, color: C.text, opacity: p1, transform: `translateY(${-50 + (1 - p1) * 40}%)`, textShadow: glitch }}>BUT A COMPLETELY</div>
                <div
                  style={{
                    marginTop: 24,
                    fontSize: 80,
                    opacity: Math.min(1, p2 * 1.5),
                    transform: `scale(${interpolate(p2, [0, 1], [1.4, 1])}) skewX(${dx * -0.6}deg)`,
                    background: `linear-gradient(90deg, ${C.cyan}, ${C.green} 35%, ${C.violet} 70%, ${C.orange})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  DIFFERENT SPREAD!
                </div>
              </div>
            );
          })()
        : null}

      {merge > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 930, width: 420, height: 420, borderRadius: "50%", transform: `translate(-50%, -50%) scale(${0.2 + merge})`, background: `radial-gradient(circle, rgba(255,255,255,${0.9 * merge}) 0%, ${alpha(C.cyan, 0.5 * merge)} 30%, transparent 65%)` }} />
      ) : null}
    </AbsoluteFill>
  );
};

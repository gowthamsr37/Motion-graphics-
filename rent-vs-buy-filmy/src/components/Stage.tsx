// The Bollywood stage: velvet curtains, gold valance, sweeping spotlights, bokeh, film grain + gate weave,
// filmy subtitles, poster titles, the INTERVAL curtain, triple-zoom drama, gold numbers, the race chart.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import model from "../model.json";
import { theme, Who, whoColor, whoName } from "../theme";
import { captionWords, captions } from "../timing";
import { CLAMP } from "./Motion";

const C = theme.colors;

const velvet = (dir: "l" | "r") =>
  `repeating-linear-gradient(90deg, ${C.maroon} 0px, ${C.velvet} 22px, ${C.velvetHi} 34px, ${C.velvet} 46px, ${C.maroon} 70px), linear-gradient(${dir === "l" ? 90 : 270}deg, rgba(0,0,0,0.0), rgba(0,0,0,0.5))`;

export const Curtain: React.FC<{ close: number }> = ({ close }) => {
  // close: 0 = fully open (panels off-screen), 1 = closed
  const w = 560;
  const sag = (1 - close) * 30;
  return (
    <>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: -w + close * w, width: w + 20, background: velvet("l"), boxShadow: "20px 0 40px rgba(0,0,0,0.6)", borderBottomRightRadius: sag }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: -w + close * w, width: w + 20, background: velvet("r"), boxShadow: "-20px 0 40px rgba(0,0,0,0.6)", borderBottomLeftRadius: sag }} />
    </>
  );
};

export const Backdrop: React.FC<{ tint?: number; redAlert?: number }> = ({ tint = 0, redAlert = 0 }) => {
  const frame = useCurrentFrame();
  const sweep = (k: number) => Math.sin(frame / (70 + k * 13) + k) * 18;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at 50% 55%, ${C.maroon}, ${C.bg} 75%)` }} />
      {/* back wall pattern: faint gold jaali */}
      <AbsoluteFill style={{ opacity: 0.07, backgroundImage: `radial-gradient(circle at 50% 50%, ${C.gold} 2px, transparent 3px), radial-gradient(circle at 0 0, ${C.gold} 1.5px, transparent 2.5px)`, backgroundSize: "60px 60px, 60px 60px", backgroundPosition: "0 0, 30px 30px" }} />
      {/* spotlights */}
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 540 - 400,
            top: -200,
            width: 800,
            height: 2300,
            transformOrigin: "50% 0%",
            transform: `rotate(${(k - 1) * 22 + sweep(k)}deg)`,
            background: `linear-gradient(180deg, rgba(255,231,163,${0.16 - k * 0.03}), rgba(255,231,163,0) 75%)`,
            clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
            mixBlendMode: "screen",
          }}
        />
      ))}
      {/* gold bokeh */}
      {Array.from({ length: 26 }, (_, i) => {
        const x = random(`bx${i}`) * 1080;
        const y = 1920 - ((frame * (0.4 + random(`bs${i}`) * 0.8) + random(`by${i}`) * 1920) % 2000);
        const r = 6 + random(`br${i}`) * 18;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: C.gold, opacity: 0.08 + random(`bo${i}`) * 0.14, filter: `blur(${2 + random(`bb${i}`) * 4}px)` }} />;
      })}
      {/* stage floor */}
      <div style={{ position: "absolute", left: -100, right: -100, top: 1450, height: 600, background: `radial-gradient(ellipse 50% 40% at 50% 10%, rgba(242,193,78,0.25), transparent 70%), linear-gradient(180deg, #2A0712, #0E0206)` }} />
      <AbsoluteFill style={{ background: "#2040FF", opacity: tint * 0.18, mixBlendMode: "color" }} />
      <AbsoluteFill style={{ background: C.red, opacity: redAlert * 0.3, mixBlendMode: "screen" }} />
      {/* side curtains (always framing) + valance */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: -40, width: 120, background: velvet("l") }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: -40, width: 120, background: velvet("r") }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: `repeating-radial-gradient(circle at 50% -40px, ${C.velvetHi} 0 30px, ${C.velvet} 30px 60px)`, borderBottom: `6px solid ${C.gold}`, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 18, backgroundImage: `radial-gradient(circle at 12px 4px, ${C.gold} 6px, transparent 7px)`, backgroundSize: "48px 18px" }} />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 10;
  const scratch = random(`sc${Math.floor(frame / 3)}`) > 0.82;
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.1, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id={`g${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} />
          </filter>
          <rect width="100%" height="100%" filter={`url(#g${seed})`} />
        </svg>
      </AbsoluteFill>
      {scratch && <div style={{ position: "absolute", top: 0, bottom: 0, left: random(`sx${Math.floor(frame / 3)}`) * 1080, width: 2, background: "rgba(255,240,210,0.25)" }} />}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 75% 65% at 50% 46%, transparent 50%, rgba(10,0,4,0.75) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", background: "linear-gradient(180deg, rgba(255,190,120,0.18), rgba(120,20,60,0.18))" }} />
    </>
  );
};

// Gate weave: the whole picture drifts a pixel or two, like a projector.
export const Weave: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${Math.sin(frame * 1.7) * 0.8}px, ${Math.cos(frame * 1.3) * 1.2}px)` }}>{children}</AbsoluteFill>;
};

export const Flash: React.FC<{ at: number[]; strength?: number }> = ({ at, strength = 0.85 }) => {
  const frame = useCurrentFrame();
  const o = Math.max(0, ...at.map((a) => interpolate(frame, [a - 1, a, a + 7], [0, strength, 0], CLAMP)));
  return <AbsoluteFill style={{ background: "#FFF6E0", opacity: o, pointerEvents: "none" }} />;
};

// Classic TV-serial triple zoom: three punch-ins on a face, with flashes.
export const tripleZoom = (frame: number, at: number) => {
  const steps = [at, at + 9, at + 18];
  let s = 1;
  steps.forEach((t, i) => {
    s += interpolate(frame, [t, t + 3], [0, 0.18 + i * 0.06], { easing: theme.ease.out, ...CLAMP });
  });
  const back = interpolate(frame, [at + 40, at + 52], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  return 1 + (s - 1) * (1 - back);
};

export const PosterText: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties; font?: "poster" | "filmy" }> = ({ children, size = 140, style, font = "poster" }) => {
  const frame = useCurrentFrame();
  const shine = ((frame * 2.2) % 260) - 80;
  return (
    <div
      style={{
        fontFamily: font === "poster" ? theme.fonts.poster : theme.fonts.filmy,
        fontSize: size,
        lineHeight: 1.02,
        textAlign: "center",
        backgroundImage: `linear-gradient(100deg, ${C.goldDeep} 0%, ${C.gold} 30%, ${C.goldHi} ${shine}%, ${C.gold} ${shine + 12}%, ${C.goldDeep} 100%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        filter: `drop-shadow(0 4px 0 ${C.ink}) drop-shadow(0 0 24px rgba(242,193,78,0.45))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pop: React.FC<{ delay: number; exit?: number; children: React.ReactNode; style?: React.CSSProperties; y?: number; scale?: number; config?: { damping: number; stiffness: number; mass: number } }> = ({ delay, exit, children, style, y = 40, scale = 0.85, config = theme.spring.smooth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 9], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return <div style={{ opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) * (1 - out), transform: `translateY(${(1 - p) * y - out * 24}px) scale(${interpolate(p, [0, 1], [scale, 1]) - out * 0.05})`, ...style }}>{children}</div>;
};

// Ornate gold-framed plaque for numbers and facts.
export const Plaque: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.gold, style }) => (
  <div style={{ position: "relative", background: "linear-gradient(180deg, rgba(74,11,30,0.95), rgba(30,4,12,0.95))", border: `4px solid ${color}`, borderRadius: 22, padding: "24px 34px", boxShadow: `0 0 0 3px ${C.ink}, 0 0 30px rgba(242,193,78,0.25), 0 24px 50px rgba(0,0,0,0.5)`, ...style }}>
    {[{ left: -12, top: -12 }, { right: -12, top: -12 }, { left: -12, bottom: -12 }, { right: -12, bottom: -12 }].map((pos, i) => (
      <div key={i} style={{ position: "absolute", width: 20, height: 20, transform: "rotate(45deg)", background: color, border: `2px solid ${C.ink}`, ...pos }} />
    ))}
    {children}
  </div>
);

export const Num: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 90, color = C.gold }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, lineHeight: 1, color, textShadow: `0 4px 0 ${C.ink}, 0 0 20px ${color}66`, letterSpacing: "-0.01em" }}>{children}</div>
);
export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 28, color = C.dim }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: size, color, letterSpacing: "0.06em" }}>{children}</div>
);

// Filmy subtitles: speaker chip + line, current word in gold.
export const Subtitles: React.FC<{ hideAfter: number }> = ({ hideAfter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cur = captions(fps).find((c) => frame >= c.from - 2 && frame <= c.to + 8);
  if (!cur || frame > hideAfter) return null;
  const ws = captionWords(fps).filter((w) => w.from >= cur.from - 1 && w.from <= cur.to);
  const inP = interpolate(frame, [cur.from - 2, cur.from + 5], [0, 1], CLAMP);
  const outP = interpolate(frame, [cur.to + 2, cur.to + 8], [0, 1], CLAMP);
  const who = cur.who as Who;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 1530, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 14}px)` }}>
      {whoName[who] && (
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.ink, background: whoColor(who), padding: "4px 16px", borderRadius: 8 }}>{whoName[who]}</div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 13, rowGap: 0, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 44, lineHeight: 1.28, textAlign: "center", textShadow: `0 3px 0 ${C.ink}, 0 0 12px rgba(0,0,0,0.9)`, fontStyle: who === "narrator" ? "italic" : "normal" }}>
        {ws.map((w, i) => {
          const said = frame >= w.from;
          const now = said && (i === ws.length - 1 || frame < ws[i + 1].from);
          return (
            <span key={i} style={{ color: now ? C.gold : said ? C.cream : "rgba(255,244,222,0.5)" }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const lakh = (v: number) => (v >= 1e7 ? `₹${(v / 1e7).toFixed(1)} Cr` : `₹${Math.round(v / 1e5)} L`);

type Row = { y: number; arjun: number; meera: number };
const ROWS: Row[] = [{ y: 0, arjun: 18e5, meera: 25e5 }, ...(model as unknown as { base: Row[] }).base.map((r) => ({ y: r.y, arjun: r.arjun, meera: r.meera }))];
const valAt = (key: "arjun" | "meera", t: number) => {
  const i = Math.min(ROWS.length - 2, Math.max(0, Math.floor(t)));
  return ROWS[i][key] + (ROWS[i + 1][key] - ROWS[i][key]) * Math.min(1, Math.max(0, t - i));
};

// Marquee race: two glowing lines on a dark stage board.
export const Race: React.FC<{ year: number; yMax: number; xMax: number; width?: number; height?: number; crash?: number }> = ({ year, yMax, xMax, width = 900, height = 620, crash = 0 }) => {
  const frame = useCurrentFrame();
  const padL = 20, padR = 190, padT = 30, padB = 60;
  const x = (t: number) => padL + (t / xMax) * (width - padL - padR);
  const y = (v: number) => height - padB - (v / yMax) * (height - padT - padB);
  const path = (key: "arjun" | "meera") => {
    const pts: string[] = [];
    for (let t = 0; t <= year + 1e-6; t += 0.1) pts.push(`${x(t).toFixed(1)},${y(valAt(key, t)).toFixed(1)}`);
    pts.push(`${x(year).toFixed(1)},${y(valAt(key, year)).toFixed(1)}`);
    return "M" + pts.join("L");
  };
  const ya = y(valAt("arjun", year)), ym = y(valAt("meera", year));
  const gap = 50 - Math.abs(ya - ym), push = gap > 0 ? gap / 2 : 0;
  const dy = { arjun: ya >= ym ? push : -push, meera: ym > ya ? push : -push };
  const ticks = xMax <= 6 ? [0, 1, 2, 3, 4, 5, 6] : [0, 5, 10, 15, 20];
  const head = (key: "arjun" | "meera", color: string) => {
    const v = valAt(key, year);
    return (
      <g transform={`translate(${x(year)}, ${y(v)})`}>
        <circle r={24 + Math.sin(frame / 5) * 3} fill={color} opacity={0.3} />
        <circle r={13} fill={color} stroke={C.ink} strokeWidth={4} />
        <text x={26} y={12 + dy[key]} fontFamily={theme.fonts.body} fontWeight={800} fontSize={38} fill={color} stroke={C.ink} strokeWidth={6} paintOrder="stroke">{lakh(v)}</text>
      </g>
    );
  };
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((k) => <line key={k} x1={padL} x2={width - padR + 10} y1={y(yMax * k)} y2={y(yMax * k)} stroke="rgba(242,193,78,0.12)" strokeWidth={2} strokeDasharray="4 8" />)}
      {ticks.map((t) => (
        <text key={t} x={x(t)} y={height - padB + 44} fontFamily={theme.fonts.body} fontWeight={600} fontSize={24} fill={C.dim} textAnchor="middle">{t === 0 ? "Start" : `Yr ${t}`}</text>
      ))}
      {crash > 0 && <rect x={x(5)} y={padT - 20} width={x(6) - x(5)} height={height - padT - padB + 20} fill={C.red} opacity={0.18 * crash} rx={10} />}
      <path d={path("arjun")} fill="none" stroke={C.arjun} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${C.arjun})` }} />
      <path d={path("meera")} fill="none" stroke={C.meera} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${C.meera})` }} />
      {head("arjun", C.arjun)}
      {head("meera", C.meera)}
    </svg>
  );
};

export const RaceLegend: React.FC = () => (
  <div style={{ display: "flex", gap: 30, justifyContent: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26 }}>
    <span style={{ color: C.arjun }}>● ARJUN · his share of the flat</span>
    <span style={{ color: C.meera }}>● MEERA · investments</span>
  </div>
);

// SCENE 1 — THE HOOK. Height, city, exam rank → "ALL ARE DATA" → "BUT NOT THE SAME TYPE!"
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Burst, Confetti, ease, exitP, Pop, Ripple, rng, shake, useSpr } from "../components/Motion";
import { MapPin, MedalGlyph, Person, PinGlyph, RulerGlyph } from "../components/Icons";
import { Pill } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const PX_PER_CM = 2.7;
const FLOOR = 1300;
const KEY = [C.green, C.violet, C.orange]; // height = continuous, city = nominal, rank = ordinal (revealed later)

// ---------- the three opening vignettes ----------
const HeightVignette: React.FC<{ H: number }> = ({ H }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const rise = spr(2, theme.spring.smooth);
  const ruler = ease(frame, [4, 22], [0, 1]);
  const headTop = FLOOR - 172 * PX_PER_CM;
  const bar = spr(H + 1, theme.spring.bouncy);
  const barY = interpolate(bar, [0, 1], [headTop - 170, headTop]);
  const count = ease(frame, [H + 6, H + 22], [120, 172], theme.ease.out);
  const ticks = Array.from({ length: 23 }).map((_, i) => i * 10);
  return (
    <>
      <div style={{ position: "absolute", left: 160, top: FLOOR - 26, width: 600, height: 60, borderRadius: "50%", background: `radial-gradient(ellipse, ${alpha(C.green, 0.25)}, transparent 70%)` }} />
      {/* ruler */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: FLOOR - 222 * PX_PER_CM,
          width: 64,
          height: 222 * PX_PER_CM,
          transformOrigin: "50% 100%",
          transform: `scaleY(${ruler})`,
          borderRadius: 10,
          background: `linear-gradient(90deg, ${alpha(C.green, 0.28)}, ${alpha(C.green, 0.1)})`,
          border: `2px solid ${alpha(C.green, 0.6)}`,
        }}
      >
        {ticks.map((cm) => (
          <div key={cm} style={{ position: "absolute", left: 0, top: (222 - cm) * PX_PER_CM, width: cm % 50 === 0 ? 34 : 18, height: 3, background: alpha(C.text, 0.7) }} />
        ))}
        {[50, 100, 150, 200].map((cm) => (
          <div key={cm} style={{ position: "absolute", left: 74, top: (222 - cm) * PX_PER_CM - 16, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: C.dim }}>
            {cm}
          </div>
        ))}
      </div>
      {/* person */}
      <div style={{ position: "absolute", left: 420 - 125, top: FLOOR - 490, opacity: rise, transform: `translateY(${(1 - rise) * 140}px)` }}>
        <Person height={500} shirt={C.cyan} skin={C.skin[1]} hair={C.hair[0]} blink={frame % 70 > 66} smile={0.7} />
      </div>
      {/* head bar */}
      {bar > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: 330, top: barY - 7, width: 380, height: 14, borderRadius: 7, background: C.green, boxShadow: `0 0 24px ${alpha(C.green, 0.7)}`, opacity: Math.min(1, bar * 2) }} />
          <div style={{ position: "absolute", left: 708, top: barY - 1, width: 70, height: 0, borderTop: `3px dashed ${alpha(C.green, 0.8)}`, opacity: ease(frame, [H + 8, H + 12], [0, 1]) }} />
        </>
      ) : null}
      <Pop at={H + 7} x={880} y={headTop} from="left" dist={40}>
        <div
          style={{
            padding: "16px 26px",
            borderRadius: 22,
            background: alpha(C.green, 0.16),
            border: `3px solid ${C.green}`,
            fontFamily: theme.fonts.mono,
            fontWeight: 800,
            fontSize: 54,
            color: C.text,
            whiteSpace: "nowrap",
            boxShadow: `0 0 40px ${alpha(C.green, 0.35)}`,
          }}
        >
          {Math.round(count)}
          <span style={{ fontSize: 34, color: C.green, marginLeft: 8 }}>cm</span>
        </div>
      </Pop>
    </>
  );
};

const BUILDINGS = (() => {
  const r = rng(5);
  const out: { x: number; w: number; h: number; c: string }[] = [];
  let x = 70;
  while (x < 1010) {
    const w = 80 + r() * 70;
    out.push({ x, w, h: 160 + r() * 260, c: r() > 0.5 ? "#1B2266" : "#232A78" });
    x += w + 10;
  }
  return out;
})();

const CityVignette: React.FC<{ C0: number }> = ({ C0 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const drop = spr(C0, theme.spring.bouncy);
  const tipY = 1010;
  const pinTop = tipY - 190 * 1.3 * (124 / 130);
  const r = rng(9);
  return (
    <>
      {BUILDINGS.map((b, i) => {
        const g = spr(C0 - 12 + i * 1.5, theme.spring.smooth);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: FLOOR - b.h,
              width: b.w,
              height: b.h,
              transformOrigin: "50% 100%",
              transform: `scaleY(${g})`,
              borderRadius: "10px 10px 0 0",
              background: `linear-gradient(180deg, ${b.c}, #11164A)`,
              border: `1.5px solid ${alpha(C.violet, 0.22)}`,
              overflow: "hidden",
            }}
          >
            {Array.from({ length: Math.floor(b.h / 46) * 2 }).map((_, k) => {
              const lit = r() > 0.45;
              const tw = 0.4 + 0.5 * (0.5 + 0.5 * Math.sin(frame / 9 + k * 1.7 + i));
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: (k % 2) * (b.w / 2) + b.w / 4 - 9,
                    top: 24 + Math.floor(k / 2) * 46,
                    width: 18,
                    height: 22,
                    borderRadius: 4,
                    background: lit ? alpha(C.yellow, 0.75 * tw) : alpha(C.violet, 0.15),
                  }}
                />
              );
            })}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 540 - 60 * drop,
          top: tipY - 12 * drop,
          width: 120 * drop,
          height: 24 * drop,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.45)",
        }}
      />
      <Ripple at={C0 + 7} x={540} y={tipY} color={C.violet} size={420} rings={3} flat={0.32} />
      <div style={{ position: "absolute", left: 540 - 95, top: pinTop, transform: `translateY(${(1 - drop) * -520}px)`, opacity: Math.min(1, drop * 3) }}>
        <MapPin size={190} color={C.violet} />
      </div>
      <Pop at={C0 + 9} x={540} y={pinTop - 70} from="up" dist={30} cfg={theme.spring.bouncy}>
        <Pill label="BENGALURU" color={C.violet} size={36} glow={0.4} />
      </Pop>
    </>
  );
};

const PODIUM = [
  { rank: 2, x: 305, h: 180, shirt: C.cyan, skin: C.skin[2], hair: C.hair[1] },
  { rank: 1, x: 540, h: 250, shirt: C.orange, skin: C.skin[0], hair: C.hair[0] },
  { rank: 3, x: 775, h: 130, shirt: C.violet, skin: C.skin[3], hair: C.hair[2] },
];

const RankVignette: React.FC<{ R: number }> = ({ R }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const badgeAt = (rank: number) => R + (rank === 3 ? 5 : rank === 2 ? 9 : 14);
  return (
    <>
      {PODIUM.map((p, i) => {
        const g = spr(R - 14 + i * 3, theme.spring.smooth);
        const st = spr(R - 6 + i * 3, theme.spring.bouncy);
        const b = spr(badgeAt(p.rank), theme.spring.bouncy);
        const top = FLOOR - p.h;
        const cheer = p.rank === 1 ? ease(frame, [badgeAt(1) + 4, badgeAt(1) + 14], [0, 1]) : 0;
        return (
          <React.Fragment key={p.rank}>
            <div
              style={{
                position: "absolute",
                left: p.x - 115,
                top,
                width: 230,
                height: p.h,
                transformOrigin: "50% 100%",
                transform: `scaleY(${g})`,
                borderRadius: "16px 16px 0 0",
                background: `linear-gradient(180deg, ${alpha(C.orange, p.rank === 1 ? 0.42 : 0.26)}, ${alpha(C.orange, 0.06)})`,
                border: `2px solid ${alpha(C.orange, 0.5)}`,
                display: "flex",
                justifyContent: "center",
                paddingTop: 18,
                boxSizing: "border-box",
                fontFamily: theme.fonts.display,
                fontWeight: 800,
                fontSize: 84,
                color: alpha(C.text, 0.85),
              }}
            >
              {p.rank}
            </div>
            <div style={{ position: "absolute", left: p.x - 57, top: top - 228, opacity: Math.min(1, st * 2), transform: `translateY(${(1 - st) * 60 - cheer * Math.abs(Math.sin(frame / 4)) * 14}px)` }}>
              <Person height={230} shirt={p.shirt} skin={p.skin} hair={p.hair} armsUp={cheer} smile={p.rank === 1 ? 1 : 0.4} />
            </div>
            {b > 0.01 ? (
              <div
                style={{
                  position: "absolute",
                  left: p.x,
                  top: top - 300,
                  transform: `translate(-50%, -50%) translateY(${(1 - b) * -160}px) scale(${p.rank === 1 ? 1.2 : 1})`,
                  opacity: Math.min(1, b * 2),
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  background: `radial-gradient(circle at 35% 30%, #FFD9B0, ${C.orange})`,
                  boxShadow: p.rank === 1 ? `0 0 40px ${alpha(C.orange, 0.8)}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.fonts.display,
                  fontWeight: 800,
                  fontSize: 40,
                  color: C.ink,
                }}
              >
                #{p.rank}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <Burst at={badgeAt(1) + 3} x={540} y={FLOOR - 250 - 300} color={C.orange} count={18} radius={190} seed={3} />
      <Confetti at={badgeAt(1) + 4} x={540} y={FLOOR - 250 - 300} colors={[C.orange, C.cyan, C.violet, C.green, C.yellow]} count={40} />
    </>
  );
};

// ---------- kinetic headline stack ----------
const Line: React.FC<{ at: number; out: number; y: number; word: string; color: string }> = ({ at, out, y, word, color }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const a = spr(at - 3, theme.spring.snappy);
  const b = spr(at + 1, theme.spring.pop);
  const e = exitP(frame, out, 8);
  const under = ease(frame, [at + 4, at + 14], [0, 1]);
  if (a <= 0.001 || e >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        gap: 24,
        transform: `translateY(-50%) translateY(${-30 * e}px)`,
        opacity: 1 - e,
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: 70,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      <span style={{ color: C.text, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>YOUR</span>
      <span style={{ position: "relative", color, opacity: Math.min(1, b * 1.5), transform: `scale(${interpolate(b, [0, 1], [1.35, 1])})`, textShadow: glowText(color, 0.7) }}>
        {word}
        <span style={{ position: "absolute", left: 0, bottom: -10, height: 8, borderRadius: 4, width: `${under * 100}%`, background: color }} />
      </span>
    </div>
  );
};

const BADGES = [
  { x: 230, glyph: RulerGlyph, value: "172 cm" },
  { x: 540, glyph: PinGlyph, value: "Bengaluru" },
  { x: 850, glyph: MedalGlyph, value: "Rank #1" },
];
const BADGE_Y = 905;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const H = s.cue("height,");
  const C0 = s.cue("city,");
  const R = s.cue("exam");
  const D = s.sent(3).from;
  const T = s.sent(4).from;
  const END = s.duration;
  const OUT = END - 15;

  const cam = (f: number) => ease(f, [C0 - 8, C0 + 3], [0, -1080], theme.ease.inOut) + ease(f, [R - 8, R + 3], [0, -1080], theme.ease.inOut);
  const camX = cam(frame);
  const blur = Math.min(16, Math.abs(camX - cam(frame - 1)) * 0.09);
  const collapse = ease(frame, [D - 7, D + 7], [0, 1], theme.ease.inOut);
  const sh = shake(frame, D + 1, 12, 14);
  const sh2 = shake(frame, T + 1, 10, 8);

  const data = spr(D, theme.spring.pop);
  const diff = ease(frame, [T, T + 14], [0, 1], theme.ease.out);
  const merge = ease(frame, [OUT, END - 2], [0, 1], theme.ease.in);
  const textOut = exitP(frame, OUT - 2, 8);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      {/* vignettes on a horizontal strip, whip-panned */}
      {collapse < 1 ? (
        <AbsoluteFill
          style={{
            transformOrigin: "850px 905px",
            transform: `translate(${collapse * 310}px, 0) scale(${1 - collapse * 0.8})`,
            opacity: 1 - collapse,
          }}
        >
          <AbsoluteFill style={{ transform: `translateX(${camX}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
            {frame < C0 + 6 ? <HeightVignette H={H} /> : null}
            {frame > C0 - 14 && frame < R + 6 ? (
              <AbsoluteFill style={{ left: 1080 }}>
                <CityVignette C0={C0} />
              </AbsoluteFill>
            ) : null}
            {frame > R - 16 ? (
              <AbsoluteFill style={{ left: 2160 }}>
                <RankVignette R={R} />
              </AbsoluteFill>
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Line at={H} out={D - 9} y={310} word="HEIGHT," color={KEY[0]} />
      <Line at={C0} out={D - 7} y={398} word="CITY," color={KEY[1]} />
      <Line at={R} out={D - 5} y={486} word="EXAM RANK…" color={KEY[2]} />

      {/* ALL ARE DATA */}
      {data > 0.001 && textOut < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 640,
            display: "flex",
            justifyContent: "center",
            gap: 30,
            transform: `translateY(-50%) scale(${interpolate(data, [0, 1], [1.6, 1])})`,
            opacity: Math.min(1, data * 2) * (1 - textOut),
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 120,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: C.text }}>ALL ARE</span>
          <span
            style={{
              background: `linear-gradient(180deg, #FFFFFF, ${C.cyan})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 24px ${alpha(C.cyan, 0.6)})`,
            }}
          >
            DATA.
          </span>
        </div>
      ) : null}
      <Ripple at={D + 2} x={540} y={640} color={C.cyan} size={900} rings={2} flat={0.35} />

      {/* the three badges: identical at first ("all data"), then each takes its own colour ("not the same type") */}
      {BADGES.map((b, i) => {
        const p = spr(D + 3 + i * 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const flip = ease(frame, [T + 2 + i * 4, T + 18 + i * 4], [0, 1], theme.ease.inOut);
        const col = interpolateColors(flip, [0, 0.5, 1], [kindColor.data, kindColor.data, KEY[i]]);
        const x = interpolate(merge, [0, 1], [b.x, 540]);
        const y = interpolate(merge, [0, 1], [BADGE_Y, 930]);
        const G = b.glyph;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) perspective(900px) scale(${interpolate(p, [0, 1], [0.3, 1]) * (1 - merge * 0.6)}) rotateY(${flip * 360}deg)`,
              opacity: Math.min(1, p * 2),
              width: 190,
              height: 190,
              borderRadius: 95,
              background: `radial-gradient(circle at 40% 30%, ${alpha(col, 0.32)}, ${alpha(col, 0.08)} 70%)`,
              border: `4px solid ${col}`,
              boxShadow: `0 0 ${30 + diff * 20}px ${alpha(col, 0.45)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <G size={96} color={col} />
            {diff > 0.01 ? (
              <div
                style={{
                  position: "absolute",
                  right: -6,
                  top: -6,
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  background: KEY[i],
                  color: C.ink,
                  fontFamily: theme.fonts.display,
                  fontWeight: 800,
                  fontSize: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${spr(T + 12 + i * 4, theme.spring.pop)})`,
                  opacity: 1 - merge,
                }}
              >
                ?
              </div>
            ) : null}
          </div>
        );
      })}
      {BADGES.map((b, i) => (
        <Pop key={`v${i}`} at={D + 8 + i * 4} out={OUT - 4} x={b.x} y={BADGE_Y + 140} from="up" dist={20}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 32, color: C.dim, whiteSpace: "nowrap" }}>{b.value}</div>
        </Pop>
      ))}

      {/* BUT NOT THE SAME TYPE! — with a short RGB-split glitch on entry */}
      {frame >= T - 2 && textOut < 1
        ? (() => {
            const p1 = spr(T - 2, theme.spring.snappy);
            const p2 = spr(T + 4, theme.spring.pop);
            const g = Math.max(0, 1 - (frame - T - 4) / 12);
            const dx = Math.sin((frame - T) * 2.3) * 9 * g;
            const glitch = g > 0 ? `${dx}px 0 ${alpha(C.cyan, 0.9)}, ${-dx}px 0 ${alpha(C.red, 0.9)}` : "none";
            return (
              <div style={{ position: "absolute", left: 0, right: 0, top: 1150, opacity: 1 - textOut, fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, textAlign: "center" }}>
                <div style={{ fontSize: 76, color: C.text, opacity: p1, transform: `translateY(${-50 + (1 - p1) * 40}%)`, textShadow: glitch }}>BUT NOT THE</div>
                <div
                  style={{
                    marginTop: 26,
                    fontSize: 108,
                    opacity: Math.min(1, p2 * 1.5),
                    transform: `scale(${interpolate(p2, [0, 1], [1.4, 1])}) skewX(${dx * -0.6}deg)`,
                    background: `linear-gradient(90deg, ${C.green}, ${C.violet} 50%, ${C.orange})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  SAME TYPE!
                </div>
              </div>
            );
          })()
        : null}

      {/* merge flash → becomes the DATA orb of scene 2 */}
      {merge > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 930,
            width: 420,
            height: 420,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${0.2 + merge})`,
            background: `radial-gradient(circle, rgba(255,255,255,${0.9 * merge}) 0%, ${alpha(C.cyan, 0.5 * merge)} 30%, transparent 65%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

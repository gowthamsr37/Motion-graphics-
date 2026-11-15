// SCENE 1 — HOOK. Class average, a typical salary, the most popular shoe size → "ALL THREE FIND THE CENTRE." → "BUT THEY DON'T ALWAYS AGREE!"
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Crown, MeanGlyph, MedianGlyph, ModeGlyph, NotEqual, Person, Rupee, ShoeBox } from "../components/Icons";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const FLOOR = 1260;
const KEY = [C.cyan, C.green, C.violet]; // mean, median, mode

// ---------- vignette 1: class test scores and their average ----------
const SCORES = [62, 75, 88, 70, 95];
const SX = [300, 420, 540, 660, 780];
const PX = 5;
const AverageVignette: React.FC<{ H: number }> = ({ H }) => {
  const spr = useSpr();
  const avgY = FLOOR - 78 * PX;
  const line = spr(H + 6, theme.spring.smooth);
  return (
    <>
      <div style={{ position: "absolute", left: 220, top: FLOOR, width: 640, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {SCORES.map((v, k) => {
        const g = spr(2 + k * 3, theme.spring.smooth);
        const h = v * PX * g;
        return (
          <React.Fragment key={k}>
            <div
              style={{
                position: "absolute",
                left: SX[k] - 42,
                top: FLOOR - h,
                width: 84,
                height: h,
                borderRadius: "14px 14px 4px 4px",
                background: `linear-gradient(180deg, ${alpha(C.cyan, 0.55)}, ${alpha(C.cyan, 0.12)})`,
                border: `2px solid ${alpha(C.cyan, 0.55)}`,
              }}
            />
            <Pop at={8 + k * 3} x={SX[k]} y={FLOOR - v * PX - 30} from="up" dist={16} cfg={theme.spring.pop}>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text }}>{v}</div>
            </Pop>
          </React.Fragment>
        );
      })}
      {line > 0.01 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 230,
              top: interpolate(line, [0, 1], [FLOOR - 100 * PX - 60, avgY]) - 3,
              width: 620,
              height: 0,
              borderTop: `6px dashed ${C.cyan}`,
              filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.8)})`,
              opacity: Math.min(1, line * 2),
            }}
          />
          <Pop at={H + 12} x={880} y={avgY} from="left" dist={30} cfg={theme.spring.bouncy}>
            <div style={{ padding: "12px 22px", borderRadius: 20, background: alpha(C.cyan, 0.18), border: `3px solid ${C.cyan}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", boxShadow: `0 0 30px ${alpha(C.cyan, 0.35)}` }}>
              AVG 78
            </div>
          </Pop>
        </>
      ) : null}
    </>
  );
};

// ---------- vignette 2: salaries, the middle one is typical ----------
const PEOPLE = [
  { x: 200, pay: "25K", shirt: "#60A5FA", skin: C.skin[1], hair: C.hair[0] },
  { x: 370, pay: "32K", shirt: "#F472B6", skin: C.skin[3], hair: C.hair[2] },
  { x: 540, pay: "45K", shirt: C.green, skin: C.skin[0], hair: C.hair[1] },
  { x: 710, pay: "60K", shirt: "#E879F9", skin: C.skin[2], hair: C.hair[3] },
  { x: 880, pay: "4L", shirt: "#94A3B8", skin: C.skin[0], hair: C.hair[0] },
];
const SalaryVignette: React.FC<{ C0: number }> = ({ C0 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const HL = C0 + 16;
  const hl = ease(frame, [HL, HL + 10], [0, 1]);
  return (
    <>
      {PEOPLE.map((p, k) => {
        const st = spr(C0 - 12 + k * 2, theme.spring.bouncy);
        const mid = k === 2;
        const tag = spr(C0 + 2 + k * 3, theme.spring.pop);
        const col = mid ? interpolateColors(hl, [0, 1], [C.edgeHi, C.green]) : k === 4 ? C.orange : C.edgeHi;
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: p.x - 57, top: FLOOR - 226, opacity: Math.min(1, st * 2) * (mid ? 1 : 1 - hl * 0.45), transform: `translateY(${(1 - st) * 50}px)` }}>
              <Person height={230} shirt={p.shirt} skin={p.skin} hair={p.hair} smile={mid ? 0.9 : 0.4} blink={(frame + k * 9) % 70 > 66} />
            </div>
            {tag > 0.01 ? (
              <div
                style={{
                  position: "absolute",
                  left: p.x,
                  top: FLOOR - 290,
                  transform: `translate(-50%, -50%) scale(${interpolate(tag, [0, 1], [0.5, 1]) * (mid ? 1 + hl * 0.28 : 1)})`,
                  opacity: Math.min(1, tag * 2) * (mid ? 1 : 1 - hl * 0.35),
                  padding: "8px 14px",
                  borderRadius: 16,
                  background: mid ? alpha(C.green, 0.12 + 0.12 * hl) : "rgba(8,14,44,0.85)",
                  border: `2.5px solid ${col}`,
                  boxShadow: mid ? `0 0 ${30 * hl}px ${alpha(C.green, 0.5)}` : "none",
                  fontFamily: theme.fonts.mono,
                  fontWeight: 800,
                  fontSize: 32,
                  color: k === 4 ? C.orange : C.text,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Rupee size={30} color={k === 4 ? C.orange : C.text} />
                {p.pay}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <Pop at={HL} x={540} y={FLOOR - 360} from="down" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.green }}>TYPICAL</div>
      </Pop>
      <Ripple at={HL + 2} x={540} y={FLOOR} color={C.green} size={360} rings={2} flat={0.3} />
    </>
  );
};

// ---------- vignette 3: shoe boxes by size, the tallest pile wins ----------
const SIZES = [6, 7, 8, 9, 10];
const COUNTS = [2, 3, 5, 3, 1];
const BX = [260, 400, 540, 680, 820];
const BOX = 120;
const BOX_STEP = 58;
const ShoeVignette: React.FC<{ R: number }> = ({ R }) => {
  const spr = useSpr();
  const CR = R + 18;
  const crown = spr(CR, theme.spring.bouncy);
  const top = FLOOR - 5 * BOX_STEP;
  return (
    <>
      {SIZES.map((sz, k) => (
        <React.Fragment key={sz}>
          {Array.from({ length: COUNTS[k] }).map((_, j) => {
            const p = spr(R - 12 + k * 2 + j * 2, theme.spring.bouncy);
            if (p <= 0.001) return null;
            return (
              <div key={j} style={{ position: "absolute", left: BX[k] - BOX / 2, top: FLOOR - (j + 1) * BOX_STEP, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -260}px)` }}>
                <ShoeBox w={BOX} color={k === 2 ? C.violet : "#7C86D8"} />
              </div>
            );
          })}
          <Pop at={R - 8 + k * 2} x={BX[k]} y={FLOOR + 34} from="up" dist={12}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: k === 2 ? C.violet : C.dim }}>{sz}</div>
          </Pop>
        </React.Fragment>
      ))}
      {crown > 0.01 ? (
        <div style={{ position: "absolute", left: 540 - 50, top: top - 80, transform: `translateY(${(1 - crown) * -300}px) rotate(${(1 - crown) * -20}deg)`, opacity: Math.min(1, crown * 2) }}>
          <Crown size={100} color={C.violet} />
        </div>
      ) : null}
      <Burst at={CR + 6} x={540} y={top - 50} color={C.violet} count={14} radius={150} seed={5} />
      <Pop at={CR + 8} x={540} y={top - 140} from="down" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 22px", borderRadius: 20, background: alpha(C.violet, 0.18), border: `3px solid ${C.violet}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>SIZE 8</div>
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
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        gap: 22,
        transform: `translateY(-50%) translateY(${-30 * e}px)`,
        opacity: 1 - e,
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: 68,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      <span style={{ color: C.text, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>{pre}</span>
      <span style={{ position: "relative", color, opacity: Math.min(1, b * 1.5), transform: `scale(${interpolate(b, [0, 1], [1.35, 1])})`, textShadow: glowText(color, 0.7) }}>
        {word}
        <span style={{ position: "absolute", left: 0, bottom: -10, height: 8, borderRadius: 4, width: `${under * 100}%`, background: color }} />
      </span>
    </div>
  );
};

const BADGES = [
  { x: 230, glyph: MeanGlyph, value: "AVG 78" },
  { x: 540, glyph: MedianGlyph, value: "45K", rupee: true },
  { x: 850, glyph: ModeGlyph, value: "SIZE 8" },
];
const BADGE_Y = 905;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const H = s.sent(0).from;
  const C0 = s.sent(1).from;
  const R = s.sent(2).from;
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
  const centre = spr(D + 2, theme.spring.pop);
  const diff = ease(frame, [T, T + 14], [0, 1], theme.ease.out);
  const merge = ease(frame, [OUT, END - 2], [0, 1], theme.ease.in);
  const textOut = exitP(frame, OUT - 2, 8);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      {collapse < 1 ? (
        <AbsoluteFill style={{ transformOrigin: "850px 905px", transform: `translate(${collapse * 310}px, 0) scale(${1 - collapse * 0.8})`, opacity: 1 - collapse }}>
          <AbsoluteFill style={{ transform: `translateX(${camX}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
            {frame < C0 + 6 ? <AverageVignette H={H} /> : null}
            {frame > C0 - 14 && frame < R + 6 ? (
              <AbsoluteFill style={{ left: 1080 }}>
                <SalaryVignette C0={C0} />
              </AbsoluteFill>
            ) : null}
            {frame > R - 16 ? (
              <AbsoluteFill style={{ left: 2160 }}>
                <ShoeVignette R={R} />
              </AbsoluteFill>
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Line at={H} out={D - 9} y={310} pre="YOUR" word="CLASS AVERAGE," color={KEY[0]} />
      <Line at={C0} out={D - 7} y={398} pre="A" word="TYPICAL SALARY," color={KEY[1]} />
      <Line at={R} out={D - 5} y={486} pre="THE" word="POPULAR SIZE…" color={KEY[2]} />

      {/* ALL THREE FIND THE CENTRE. */}
      {centre > 0.001 && textOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: Math.min(1, centre * 2) * (1 - textOut), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 58, color: C.text, letterSpacing: "0.02em", transform: `translateY(${(1 - centre) * 30}px)` }}>ALL THREE FIND</div>
          <div
            style={{
              marginTop: 18,
              fontSize: 118,
              letterSpacing: "-0.03em",
              transform: `scale(${interpolate(centre, [0, 1], [1.6, 1])})`,
              background: `linear-gradient(180deg, #FFFFFF, ${C.cyan})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 24px ${alpha(C.cyan, 0.6)})`,
            }}
          >
            THE CENTRE.
          </div>
        </div>
      ) : null}
      <Ripple at={D + 3} x={540} y={680} color={C.cyan} size={900} rings={2} flat={0.35} />

      {/* badges: identical at first, then each takes its own colour, with ≠ between them */}
      {BADGES.map((b, i) => {
        const p = spr(D + 4 + i * 4, theme.spring.bouncy);
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
            <G size={100} color={col} />
          </div>
        );
      })}
      {[385, 695].map((x, i) => (
        <Pop key={x} at={T + 14 + i * 4} out={OUT - 4} x={x} y={BADGE_Y} from="scale" scaleFrom={0.3} cfg={theme.spring.pop}>
          <NotEqual size={58} color={C.text} />
        </Pop>
      ))}
      {BADGES.map((b, i) => (
        <Pop key={`v${i}`} at={D + 9 + i * 4} out={OUT - 4} x={b.x} y={BADGE_Y + 140} from="up" dist={20}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 32, color: C.dim, whiteSpace: "nowrap" }}>
            {b.rupee ? <Rupee size={30} color={C.dim} /> : null}
            {b.value}
          </div>
        </Pop>
      ))}

      {/* BUT THEY DON'T ALWAYS AGREE! — RGB-split glitch on entry */}
      {frame >= T - 2 && textOut < 1
        ? (() => {
            const p1 = spr(T - 2, theme.spring.snappy);
            const p2 = spr(T + 6, theme.spring.pop);
            const g = Math.max(0, 1 - (frame - T - 6) / 12);
            const dx = Math.sin((frame - T) * 2.3) * 9 * g;
            const glitch = g > 0 ? `${dx}px 0 ${alpha(C.cyan, 0.9)}, ${-dx}px 0 ${alpha(C.red, 0.9)}` : "none";
            return (
              <div style={{ position: "absolute", left: 0, right: 0, top: 1150, opacity: 1 - textOut, fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, textAlign: "center" }}>
                <div style={{ fontSize: 74, color: C.text, opacity: p1, transform: `translateY(${-50 + (1 - p1) * 40}%)`, textShadow: glitch }}>BUT THEY DON&apos;T</div>
                <div
                  style={{
                    marginTop: 24,
                    fontSize: 98,
                    opacity: Math.min(1, p2 * 1.5),
                    transform: `scale(${interpolate(p2, [0, 1], [1.4, 1])}) skewX(${dx * -0.6}deg)`,
                    background: `linear-gradient(90deg, ${C.cyan}, ${C.green} 50%, ${C.violet})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  ALWAYS AGREE!
                </div>
              </div>
            );
          })()
        : null}

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

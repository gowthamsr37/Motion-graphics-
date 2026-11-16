// SCENE 1 — HOOK. Nine friends in a café, average salary ₹40,000. A billionaire (₹10 crore a month) walks in:
// the average jumps to ₹1,00,36,000. Nobody earns that. The people collapse into dots: nine huddled together,
// one far away → "THAT'S AN OUTLIER!"
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Crown, Person } from "../components/Icons";
import { Lamp, Money, Stamp } from "../components/Kit";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
// salaries in ₹ thousand, in the order they stand (sorted: 30 34 36 40 40 42 44 46 48 → mean 40, median 40, range 18)
export const FRIENDS = [40, 34, 46, 30, 42, 48, 36, 44, 40];
export const BILLIONAIRE = 100000; // ₹10 crore a month (10,00,00,000), in ₹ thousand
export const MEAN_AFTER = (FRIENDS.reduce((a, b) => a + b, 0) + BILLIONAIRE) * 100; // ₹ → 1,00,36,000
const PX = (i: number) => 120 + i * 82;
const BX = 905;
const FLOOR = 1235;
const PH = 220;
const SHIRTS = ["#60A5FA", "#F472B6", "#A3E635", "#E879F9", "#FDE68A", "#5EEAD4", "#93C5FD", "#FCA5A5", "#C4B5FD"];
// where the dots settle (S2 starts from exactly here)
export const DOT_Y = 1100;
export const dotX = (v: number) => 140 + ((v - 30) / 18) * 330;
// equal salaries stack upward (two friends earn ₹40K)
export const dotY = (i: number) => DOT_Y - FRIENDS.slice(0, i).filter((v) => v === FRIENDS[i]).length * 34;
export const OUT_X = 915;

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

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const H0 = s.sent(0).from;
  const AVG = s.cueS(1, "40,000");
  const BIL = s.sent(2).from;
  const WALK = s.cueS(2, "walks");
  const CR = s.cueS(3, "crore!");
  const CHG = s.cueS(4, "changed");
  const OUTW = s.cueS(5, "outlier!");
  const END = s.duration;

  // the average readout
  const climb = ease(frame, [CR - 8, CR + 10], [0, 1], theme.ease.inOut);
  const avg = interpolate(climb, [0, 1], [40000, MEAN_AFTER]);
  const avgCol = interpolateColors(climb, [0, 1], [C.text, O]);
  const avgIn = spr(AVG - 3, theme.spring.bouncy);
  const headOut = exitP(frame, CHG - 8, 10);
  const sh = shake(frame, CR + 10, 14, 10);
  const sh2 = shake(frame, OUTW, 12, 14);

  // billionaire walks in from the right
  const walk = ease(frame, [BIL - 2, WALK + 18], [0, 1], theme.ease.out);
  const bx = interpolate(walk, [0, 1], [1220, BX]);
  const walking = walk > 0.01 && walk < 0.97;
  const shocked = frame >= CR + 10;

  // people → dots → huddle vs far away
  const toDot = ease(frame, [CHG - 8, CHG + 4], [0, 1], theme.ease.inOut);
  const huddle = ease(frame, [CHG + 4, CHG + 20], [0, 1], theme.ease.inOut);
  const lampIn = ease(frame, [2, 16], [0, 1]);
  const slam = spr(OUTW - 3, theme.spring.pop);
  const slamOut = exitP(frame, END - 10, 9);
  const glitch = frame >= OUTW - 2 && frame < OUTW + 8 ? (frame % 2 ? 1 : -1) : 0;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      {/* café ambience */}
      <AbsoluteFill style={{ opacity: 1 - toDot }}>
        {[210, 540, 870].map((x, i) => (
          <Lamp key={x} x={x} top={500} len={60 + (i % 2) * 30} p={lampIn} glow={0.7 + Math.sin(frame / 9 + i) * 0.15} />
        ))}
        <div style={{ position: "absolute", left: 80, top: FLOOR, width: 920 * ease(frame, [0, 14], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.25) }} />
      </AbsoluteFill>

      {/* headline + average */}
      {headOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - headOut }}>
          <Line at={H0} out={BIL - 6} y={300} pre="NINE" word="FRIENDS" color={C.cyan} />
          <Line at={BIL} out={CHG - 10} y={300} pre="+1" word="BILLIONAIRE" color={O} />
          {avgIn > 0.001 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 452, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(avgIn, [0, 1], [0.6, 1]) * (1 + climb * (1 - climb) * 0.3)})`, opacity: Math.min(1, avgIn * 2) }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.26em", color: C.dim }}>AVERAGE SALARY</div>
              <div style={{ marginTop: 4, filter: `drop-shadow(0 0 ${10 + climb * 20}px ${alpha(avgCol, 0.6)})` }}>
                <Money v={avg} size={84} color={avgCol} />
              </div>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* the nine friends */}
      {FRIENDS.map((v, i) => {
        const p = spr(H0 + 2 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const tag = spr(AVG - 6 + i * 2, theme.spring.pop);
        const personOut = toDot;
        const dx = interpolate(huddle, [0, 1], [PX(i), dotX(v)]);
        const dotIn = ease(frame, [CHG - 4, CHG + 4], [0, 1]);
        return (
          <React.Fragment key={i}>
            {personOut < 1 ? (
              <div style={{ position: "absolute", left: PX(i) - PH / 4, top: FLOOR - PH, opacity: Math.min(1, p * 2) * (1 - personOut), transformOrigin: "50% 100%", transform: `translateY(${(1 - p) * 40}px) scale(${1 - personOut * 0.6})` }}>
                <Person height={PH} shirt={SHIRTS[i]} skin={C.skin[i % 4]} hair={C.hair[(i + 1) % 4]} smile={shocked ? -1 : 0.6} blink={(frame + i * 7) % 70 < 3} />
              </div>
            ) : null}
            {tag > 0.001 && personOut < 1 ? (
              <div style={{ position: "absolute", left: PX(i), top: FLOOR - PH - 34, transform: `translate(-50%, -50%) scale(${interpolate(tag, [0, 1], [0.4, 1])})`, opacity: Math.min(1, tag * 2) * (1 - personOut) }}>
                <Money v={`${v}K`} size={24} color={C.text} weight={700} />
              </div>
            ) : null}
            {dotIn > 0.001 ? (
              <div style={{ position: "absolute", left: dx - 15, top: interpolate(huddle, [0, 1], [DOT_Y, dotY(i)]) - 15, width: 30, height: 30, borderRadius: 15, background: kindColor.data, boxShadow: `0 0 14px ${alpha(kindColor.data, 0.8)}`, transform: `scale(${dotIn})` }} />
            ) : null}
          </React.Fragment>
        );
      })}

      {/* the billionaire */}
      {walk > 0.001 && toDot < 1 ? (
        <>
          <div style={{ position: "absolute", left: bx - PH / 4, top: FLOOR - PH, opacity: 1 - toDot, transformOrigin: "50% 100%", transform: `scale(${1 - toDot * 0.6})` }}>
            <Person height={PH} shirt={O} skin={C.skin[1]} hair={C.hair[0]} swing={walking ? Math.sin(frame / 2.6) * 22 : 0} smile={0.9} />
          </div>
          <div style={{ position: "absolute", left: bx - 22, top: FLOOR - PH - 22, opacity: 1 - toDot, transform: `rotate(${Math.sin(frame / 10) * 4}deg)` }}>
            <Crown size={44} color={O} />
          </div>
          {(() => {
            const t = spr(WALK + 10, theme.spring.bouncy);
            if (t <= 0.001) return null;
            return (
              <div style={{ position: "absolute", left: BX, top: FLOOR - PH - 80, transform: `translate(-50%, -50%) scale(${interpolate(t, [0, 1], [0.4, 1])})`, opacity: Math.min(1, t * 2) * (1 - toDot), textAlign: "center" }}>
                <Money v="10 CR" size={32} color={O} />
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.2em", color: alpha(O, 0.9) }}>A MONTH</div>
              </div>
            );
          })()}
        </>
      ) : null}
      {/* the outlier dot */}
      {(() => {
        const d = ease(frame, [CHG - 4, CHG + 4], [0, 1]);
        if (d <= 0.001) return null;
        const x = interpolate(huddle, [0, 1], [BX, OUT_X]);
        const ring = ease(frame, [OUTW - 2, OUTW + 10], [0, 1], theme.ease.out);
        return (
          <>
            <div style={{ position: "absolute", left: x - 17, top: DOT_Y - 17, width: 34, height: 34, borderRadius: 17, background: O, boxShadow: `0 0 22px ${alpha(O, 0.9)}`, transform: `scale(${d})` }} />
            {ring > 0.01 ? <div style={{ position: "absolute", left: x - 40, top: DOT_Y - 40, width: 80, height: 80, borderRadius: 40, border: `4px solid ${O}`, opacity: 0.9, transform: `scale(${interpolate(ring, [0, 1], [2, 1]) * (1 + Math.sin(frame / 6) * 0.05)})`, boxShadow: `0 0 20px ${alpha(O, 0.6)}` }} /> : null}
          </>
        );
      })()}
      <Ripple at={OUTW} x={OUT_X} y={DOT_Y} color={O} size={340} rings={2} flat={0.5} />

      {/* "?" bubbles + nobody earns that */}
      {[1, 4, 7].map((i, k) => (
        <Pop key={i} at={CR + 12 + k * 3} out={CHG - 8} x={PX(i) + 26} y={FLOOR - PH - 92} from="down" dist={14} cfg={theme.spring.pop}>
          <div style={{ width: 50, height: 50, borderRadius: 25, background: C.yellow, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32 }}>?</div>
        </Pop>
      ))}
      {frame < CHG - 3 ? (
        <Stamp at={CR + 14} x={470} y={760} color={C.red} size={38}>
          NOBODY HERE EARNS THIS
        </Stamp>
      ) : null}

      {/* THAT'S AN OUTLIER! */}
      {slam > 0.001 && slamOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: Math.min(1, slam * 2) * (1 - slamOut), transform: `translateY(-50%) translateY(${-30 * slamOut}px)`, fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 60, color: C.text, letterSpacing: "0.02em", transform: `translateY(${(1 - slam) * 30}px)` }}>THAT&apos;S AN</div>
          <div
            style={{
              marginTop: 14,
              fontSize: 150,
              letterSpacing: "-0.03em",
              transform: `translateX(${glitch * 8}px) scale(${interpolate(slam, [0, 1], [1.7, 1])})`,
              background: `linear-gradient(180deg, #FFFFFF, ${O})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: glitch ? `drop-shadow(-6px 0 0 ${alpha(C.cyan, 0.8)}) drop-shadow(6px 0 0 ${alpha(C.red, 0.8)})` : `drop-shadow(0 0 26px ${alpha(O, 0.55)})`,
            }}
          >
            OUTLIER!
          </div>
        </div>
      ) : null}
      <Burst at={OUTW} x={540} y={760} color={O} count={22} radius={320} seed={7} />
    </AbsoluteFill>
  );
};

// SCENE 1 — HOOK. A river 3 ft deep on average (with an 8 ft channel), a delivery app averaging 30 min (5 to 55),
// a city averaging ₹50K (one ₹2L earner) → "AVERAGES ALONE CAN MISLEAD." → "YOU NEED THE CENTRE AND THE SPREAD!"
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Avatar, ClockGlyph, Crown, Rupee, SpreadGlyph, TargetGlyph, WaveGlyph } from "../components/Icons";
import { River, type RiverGeo } from "../components/River";
import { alpha, BAT_B, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const KEY = [C.cyan, C.green, C.violet];
const RG: RiverGeo = { x0: 100, x1: 980, surface: 760, ft: 52 };

const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 18px", borderRadius: 18, background: "rgba(8,14,44,0.88)", border: `2.5px solid ${alpha(color, 0.8)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{children}</div>
);

const RiverVignette: React.FC<{ H: number }> = ({ H }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  return (
    <>
      <River g={RG} p={ease(frame, [0, 12], [0, 1])} avg={ease(frame, [H + 4, H + 18], [0, 1], theme.ease.inOut)} personIn={spr(3, theme.spring.bouncy)} worried={frame > H + 30} />
      <Pop at={H + 14} x={820} y={RG.surface + 3 * RG.ft - 40} from="left" dist={20} cfg={theme.spring.bouncy}>
        <Chip color={C.cyan}>AVERAGE 3 FT</Chip>
      </Pop>
      <Pop at={H + 30} x={RG.x0 + 0.18 * (RG.x1 - RG.x0) + 70} y={RG.surface - 300} from="down" dist={14} cfg={theme.spring.pop}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: C.yellow, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36 }}>?</div>
      </Pop>
    </>
  );
};

const TIMES = [5, 15, 25, 25, 35, 35, 45, 55]; // mean 30, SD 15
const TX = (m: number) => 150 + (m / 60) * 780;
const DeliveryVignette: React.FC<{ C1: number }> = ({ C1 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const ax = ease(frame, [C1 - 12, C1], [0, 1]);
  return (
    <>
      <Pop at={C1 - 10} x={540} y={760} from="down" dist={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: C.dim }}>
          <ClockGlyph size={40} color={C.dim} />
          DELIVERY TIMES
        </div>
      </Pop>
      <div style={{ position: "absolute", left: TX(0) - 20, top: 1098, width: (TX(60) - TX(0) + 40) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {[0, 15, 30, 45, 60].map((m) => (
        <div key={m} style={{ position: "absolute", left: TX(m), top: 1136, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: ax }}>{m}m</div>
      ))}
      {TIMES.map((t, i) => {
        const p = spr(C1 - 6 + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        const stack = i > 0 && TIMES[i - 1] === t ? 1 : 0;
        return <div key={i} style={{ position: "absolute", left: TX(t) - 18, top: 1100 - 18 - 44 - stack * 44, width: 36, height: 36, borderRadius: 18, background: BAT_B, boxShadow: `0 0 16px ${alpha(BAT_B, 0.8)}`, transform: `scale(${p}) translateY(${(1 - p) * -60}px)` }} />;
      })}
      <div style={{ position: "absolute", left: TX(30) - 2, top: 930, height: 180 * ease(frame, [C1 + 8, C1 + 18], [0, 1]), borderLeft: `4px dashed ${alpha(C.text, 0.8)}` }} />
      <Pop at={C1 + 12} x={540} y={890} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Chip>AVERAGE 30 MIN</Chip>
      </Pop>
    </>
  );
};

const PAY = ["18K", "22K", "25K", "28K", "30K", "33K", "38K", "56K", "2L"]; // mean ₹50K, median ₹30K
const SalaryVignette: React.FC<{ C2: number }> = ({ C2 }) => {
  const spr = useSpr();
  return (
    <>
      {PAY.map((pay, i) => {
        const p = spr(C2 - 12 + i * 2, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const x = 140 + i * 100;
        const rich = i === 8;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 38, top: 1120, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 50}px)` }}>
              <Avatar size={76} shirt={rich ? C.orange : ["#60A5FA", "#F472B6", "#A3E635", "#E879F9", "#FDE68A"][i % 5]} skin={C.skin[i % 4]} hair={C.hair[i % 4]} />
            </div>
            {rich ? (
              <div style={{ position: "absolute", left: x - 24, top: 1084, transform: `scale(${p})` }}>
                <Crown size={48} color={C.orange} />
              </div>
            ) : null}
            <div style={{ position: "absolute", left: x, top: 1060 - (rich ? 26 : 0), transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: rich ? 30 : 23, color: rich ? C.orange : C.text }}>
              <Rupee size={rich ? 28 : 21} color={rich ? C.orange : C.text} />
              {pay}
            </div>
          </React.Fragment>
        );
      })}
      <Pop at={C2 + 12} x={540} y={890} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Chip>
          AVERAGE <Rupee size={28} color={C.text} />
          50K
        </Chip>
      </Pop>
    </>
  );
};

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
  const mis = spr(D, theme.spring.pop);
  const merge3 = ease(frame, [T, T + 10], [0, 1], theme.ease.in);
  const merge = ease(frame, [OUT, END - 2], [0, 1], theme.ease.in);
  const textOut = exitP(frame, OUT - 2, 8);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {collapse < 1 ? (
        <AbsoluteFill style={{ transformOrigin: "540px 960px", transform: `scale(${1 - collapse * 0.7})`, opacity: 1 - collapse }}>
          <AbsoluteFill style={{ transform: `translateX(${camX}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
            {frame < C1 + 6 ? <RiverVignette H={H0} /> : null}
            {frame > C1 - 14 && frame < C2 + 6 ? (
              <AbsoluteFill style={{ left: 1080 }}>
                <DeliveryVignette C1={C1} />
              </AbsoluteFill>
            ) : null}
            {frame > C2 - 16 ? (
              <AbsoluteFill style={{ left: 2160 }}>
                <SalaryVignette C2={C2} />
              </AbsoluteFill>
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Line at={H0} out={D - 9} y={310} pre="A" word="RIVER," color={KEY[0]} />
      <Line at={C1} out={D - 7} y={398} pre="AN" word="APP," color={KEY[1]} />
      <Line at={C2} out={D - 5} y={486} pre="A" word="CITY…" color={KEY[2]} />

      {/* AVERAGES ALONE CAN MISLEAD. */}
      {mis > 0.001 && textOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", opacity: Math.min(1, mis * 2) * (1 - textOut), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 58, color: C.text, letterSpacing: "0.02em", transform: `translateY(${(1 - mis) * 30}px)` }}>AVERAGES ALONE</div>
          <div style={{ marginTop: 18, fontSize: 104, letterSpacing: "-0.03em", transform: `scale(${interpolate(mis, [0, 1], [1.6, 1])})`, background: `linear-gradient(180deg, #FFFFFF, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(C.orange, 0.5)})` }}>
            CAN MISLEAD.
          </div>
        </div>
      ) : null}
      <Ripple at={D + 2} x={540} y={660} color={C.orange} size={900} rings={2} flat={0.35} />

      {/* three "average" badges → the two things you actually need */}
      {[
        { x: 230, G: WaveGlyph, label: "3 FT" },
        { x: 540, G: ClockGlyph, label: "30 MIN" },
        { x: 850, G: null, label: "50K" },
      ].map((b, i) => {
        const p = spr(D + 4 + i * 4, theme.spring.bouncy);
        if (p <= 0.001 || merge3 >= 1) return null;
        const x = interpolate(merge3, [0, 1], [b.x, 540]);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: 905, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.3, 1]) * (1 - merge3 * 0.7)})`, opacity: Math.min(1, p * 2) * (1 - merge3), width: 170, height: 170, borderRadius: 85, background: `radial-gradient(circle at 40% 30%, ${alpha(kindColor.data, 0.28)}, ${alpha(kindColor.data, 0.06)} 70%)`, border: `4px solid ${kindColor.data}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {b.G ? <b.G size={86} color={kindColor.data} /> : <Rupee size={80} color={kindColor.data} />}
            </div>
            <div style={{ position: "absolute", left: x, top: 1030, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2) * (1 - merge3), fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: C.dim, whiteSpace: "nowrap" }}>avg {b.label}</div>
          </React.Fragment>
        );
      })}
      {[
        { x: 330, G: TargetGlyph, label: "CENTRE", col: kindColor.centre, at: T + 6 },
        { x: 750, G: SpreadGlyph, label: "SPREAD", col: kindColor.spread, at: T + 12 },
      ].map((b) => {
        const p = spr(b.at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const x = interpolate(merge, [0, 1], [b.x, 540]);
        const y = interpolate(merge, [0, 1], [905, 930]);
        return (
          <React.Fragment key={b.label}>
            <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.3, 1]) * (1 - merge * 0.6)})`, opacity: Math.min(1, p * 2), width: 190, height: 190, borderRadius: 95, background: `radial-gradient(circle at 40% 30%, ${alpha(b.col, 0.32)}, ${alpha(b.col, 0.08)} 70%)`, border: `4px solid ${b.col}`, boxShadow: `0 0 40px ${alpha(b.col, 0.45)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <b.G size={96} color={b.col} />
            </div>
            <div style={{ position: "absolute", left: x, top: 1040, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2) * (1 - merge), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: b.col, textShadow: glowText(b.col, 0.5) }}>{b.label}</div>
          </React.Fragment>
        );
      })}
      <Pop at={T + 10} out={OUT - 4} x={540} y={905} from="scale" scaleFrom={0.3} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, color: C.text }}>+</div>
      </Pop>
      <Burst at={T + 6} x={540} y={905} color={C.cyan} count={18} radius={260} seed={14} />

      {/* YOU NEED THE CENTRE AND THE SPREAD! */}
      {frame >= T - 2 && textOut < 1
        ? (() => {
            const p1 = spr(T - 2, theme.spring.snappy);
            const p2 = spr(T + 8, theme.spring.pop);
            return (
              <div style={{ position: "absolute", left: 0, right: 0, top: 1160, opacity: 1 - textOut, fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, textAlign: "center" }}>
                <div style={{ fontSize: 62, color: C.text, opacity: p1, transform: `translateY(${-50 + (1 - p1) * 40}%)` }}>YOU NEED THE CENTRE</div>
                <div style={{ marginTop: 22, fontSize: 88, opacity: Math.min(1, p2 * 1.5), transform: `scale(${interpolate(p2, [0, 1], [1.4, 1])})`, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  AND THE SPREAD!
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

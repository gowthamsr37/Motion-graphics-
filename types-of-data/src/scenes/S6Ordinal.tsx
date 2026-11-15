// SCENE 4b — CATEGORICAL → ORDINAL. LOW → MEDIUM → HIGH rise into a staircase; the gaps between steps are unknown.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Mark, Pop, useSpr } from "../components/Motion";
import { Arrow, Face, Person } from "../components/Icons";
import { TreeHeader } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { CAT_HEADER } from "./S5Nominal";

const C = theme.colors;
const LEVELS = [
  { label: "LOW", mood: -1 as const, tone: "#FDBA74", bars: 1 },
  { label: "MEDIUM", mood: 0 as const, tone: "#FB923C", bars: 2 },
  { label: "HIGH", mood: 1 as const, tone: "#F97316", bars: 3 },
];
const XS = [220, 540, 860];
const CARD_W = 250;
const CARD_H = 250;
const BASE = 1262; // floor line of the staircase
const RISE = [0, 150, 300];

export const S6Ordinal: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const ORD = s.cue("ordinal.");
  const RATE = s.sent(1).from;
  const lvAt = [s.cue("low,"), s.cue("medium,"), s.cue("high.")];
  const ORDER = s.cue("order");
  const EACH = s.cue("Each");
  const ABOVE = s.cue("above");
  const GAPS = s.cue("gaps");
  const MEAS = s.cue("measured,");
  const EQUAL = s.cue("equal.");
  const END = s.duration;
  const OUT = END - 14;

  const stair = ease(frame, [ORDER - 4, ORDER + 18], [0, 1], theme.ease.inOut);
  // gaps become unknown: the middle step drifts so the two gaps stop matching
  const wob = ease(frame, [MEAS - 6, MEAS + 4], [0, 1]) * Math.sin((frame - MEAS) / 5);
  const unequal = ease(frame, [EQUAL - 10, EQUAL + 6], [0, 1], theme.ease.inOut);
  const rise = (i: number) => {
    const r = RISE[i] * stair;
    if (i !== 1) return r;
    return r + wob * 55 * (1 - unequal) + unequal * -80;
  };
  const shrink = ease(frame, [OUT, END], [0, 1], theme.ease.in);
  const top = (i: number) => BASE - CARD_H - rise(i);

  // climber hops LOW → MEDIUM → HIGH
  const hop1 = ease(frame, [EACH - 2, EACH + 10], [0, 1], theme.ease.soft);
  const hop2 = ease(frame, [ABOVE - 2, ABOVE + 10], [0, 1], theme.ease.soft);
  const climbIn = spr(ORDER + 16, theme.spring.bouncy);
  const seg = hop2 > 0 ? 1 : 0;
  const hp = hop2 > 0 ? hop2 : hop1;
  const cx = interpolate(hp, [0, 1], [XS[seg], XS[seg + 1]]);
  const cy = interpolate(hp, [0, 1], [top(seg), top(seg + 1)]) - Math.sin(hp * Math.PI) * 90;

  return (
    <AbsoluteFill style={{ transformOrigin: "640px 1180px", transform: `scale(${1 - shrink * 0.7})`, opacity: 1 - shrink }}>
      <TreeHeader {...CAT_HEADER} parentIn={-60} kidsIn={-60} activeAt={ORD} activeIdx={1} prevIdx={0} />

      <Pop at={RATE - 4} out={ORDER - 6} x={540} y={600} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>SATISFACTION</div>
      </Pop>
      <Pop at={ORDER + 2} out={GAPS - 6} x={540} y={600} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <Mark kind="check" at={ORDER + 4} size={52} color={C.green} />
          ORDER <span style={{ color: C.orange, textShadow: glowText(C.orange, 0.6) }}>MATTERS</span>
        </div>
      </Pop>
      <Pop at={EQUAL - 2} x={540} y={600} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mark kind="check" at={EQUAL} size={44} color={C.green} />
            ORDER
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mark kind="cross" at={EQUAL + 6} size={40} color={C.red} width={13} />
            EQUAL GAPS
          </span>
        </div>
      </Pop>

      {/* step columns under each card */}
      {LEVELS.map((l, i) => {
        const h = rise(i);
        if (h <= 1) return null;
        return (
          <div
            key={`col${i}`}
            style={{
              position: "absolute",
              left: XS[i] - CARD_W / 2,
              top: BASE - h,
              width: CARD_W,
              height: h,
              borderRadius: "0 0 18px 18px",
              background: `linear-gradient(180deg, ${alpha(l.tone, 0.45)}, ${alpha(l.tone, 0.08)})`,
              borderLeft: `2px solid ${alpha(l.tone, 0.4)}`,
              borderRight: `2px solid ${alpha(l.tone, 0.4)}`,
            }}
          />
        );
      })}

      {/* the three level cards */}
      {LEVELS.map((l, i) => {
        const p = spr(lvAt[i] - 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div
            key={l.label}
            style={{
              position: "absolute",
              left: XS[i] - CARD_W / 2,
              top: top(i),
              width: CARD_W,
              height: CARD_H,
              transform: `translateY(${(1 - p) * 80}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
              opacity: Math.min(1, p * 2),
              borderRadius: 30,
              background: `linear-gradient(180deg, ${alpha("#3A2414", 0.96)}, ${alpha("#1E1430", 0.96)})`,
              border: `3px solid ${l.tone}`,
              boxShadow: `0 0 ${18 + i * 12}px ${alpha(l.tone, 0.35 + i * 0.1)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <Face size={96} mood={l.mood} color={l.tone} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, letterSpacing: "0.04em" }}>{l.label}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map((b) => (
                <div key={b} style={{ width: 30, height: 10, borderRadius: 5, background: b < l.bars ? l.tone : alpha(C.text, 0.15) }} />
              ))}
            </div>
          </div>
        );
      })}

      {/* arrows between levels: → when flat, ↗ when they become a staircase */}
      {[0, 1].map((i) => {
        const p = spr(lvAt[2] + 6 + i * 4, theme.spring.pop);
        if (p <= 0.001) return null;
        const x = (XS[i] + XS[i + 1]) / 2;
        const y = (top(i) + top(i + 1)) / 2 + CARD_H / 2 - 20;
        const gone = ease(frame, [GAPS - 6, GAPS], [0, 1]);
        return (
          <div key={`ar${i}`} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${-40 * stair}deg) scale(${p})`, opacity: 1 - gone, filter: `drop-shadow(0 0 10px ${alpha(C.orange, 0.7)})` }}>
            <Arrow size={64} color={C.orange} />
          </div>
        );
      })}

      {/* the unknown gaps */}
      {[0, 1].map((i) => {
        const p = spr(GAPS + i * 5, theme.spring.pop);
        if (p <= 0.001) return null;
        const x = XS[i] + CARD_W / 2 + 26;
        const y0 = top(i);
        const y1 = top(i + 1);
        return (
          <React.Fragment key={`gap${i}`}>
            <div style={{ position: "absolute", left: x - 2, top: y1, width: 4, height: Math.max(0, y0 - y1) * p, background: C.text, borderRadius: 2 }} />
            <div style={{ position: "absolute", left: x - 14, top: y1, width: 28, height: 4, background: C.text, borderRadius: 2, opacity: p }} />
            <div style={{ position: "absolute", left: x - 14, top: y0 - 4, width: 28, height: 4, background: C.text, borderRadius: 2, opacity: p }} />
            <div
              style={{
                position: "absolute",
                left: x - 40,
                top: (y0 + y1) / 2,
                transform: `translate(-50%, -50%) scale(${p * (1 + 0.08 * Math.sin(frame / 4 + i))})`,
                width: 54,
                height: 54,
                borderRadius: 27,
                background: C.yellow,
                color: C.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fonts.display,
                fontWeight: 800,
                fontSize: 34,
              }}
            >
              ?
            </div>
          </React.Fragment>
        );
      })}

      {/* climber */}
      {climbIn > 0.01 ? (
        <div style={{ position: "absolute", left: cx - 37, top: cy - 150, transform: `scale(${climbIn})`, transformOrigin: "50% 100%" }}>
          <Person height={150} shirt={C.cyan} skin={C.skin[1]} hair={C.hair[0]} swing={Math.sin(hp * Math.PI) * 30} armsUp={hop2 >= 1 ? 1 : 0} smile={1} />
        </div>
      ) : null}
      <Burst at={ABOVE + 10} x={XS[2]} y={top(2) - 60} color={C.orange} seed={61} count={14} radius={140} />
    </AbsoluteFill>
  );
};

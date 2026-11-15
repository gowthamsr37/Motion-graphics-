// SCENE 5 — THE COMPLETE PICTURE. The full hierarchy assembles as a file-tree, one example beside each type.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Pop, useSpr } from "../components/Motion";
import { DotsGlyph, DropGlyph, RulerGlyph, StairsGlyph } from "../components/Icons";
import { Orb, Pill, Wires } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
type Pt = [number, number];

const poly = (pts: Pt[]) => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const at = (t: number): Pt => {
    let d = t * total;
    for (let i = 0; i < segs.length; i++) {
      if (d <= segs[i] || i === segs.length - 1) {
        const k = segs[i] ? Math.min(1, d / segs[i]) : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      d -= segs[i];
    }
    return pts[pts.length - 1];
  };
  return { d: pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" "), at };
};

const ROOT: Pt = [150, 430];
const Y = { num: 586, dis: 716, con: 846, cat: 1002, nom: 1132, ord: 1262 };
const TRUNK_X = 150;
const SUB_X = 252;
const CARD_X = 305;
const CARD_W = 650;

const Leaf: React.FC<{ y: number; at: number; label: string; color: string; icon: React.ReactNode; example: string; shineAt: number }> = ({ y, at, label, color, icon, example, shineAt }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, theme.spring.smooth);
  const ex = spr(at + 7, theme.spring.snappy);
  const shine = ease(frame, [shineAt, shineAt + 22], [-0.3, 1.3], theme.ease.inOut);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X,
        top: y - 52,
        width: CARD_W,
        height: 104,
        boxSizing: "border-box",
        padding: "0 22px 0 26px",
        borderRadius: 26,
        background: `linear-gradient(90deg, ${alpha(color, 0.2)}, ${alpha("#101A4A", 0.85)} 60%)`,
        border: `2.5px solid ${alpha(color, 0.65)}`,
        boxShadow: `0 20px 40px -22px rgba(0,0,0,0.8), 0 0 24px ${alpha(color, 0.18)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        opacity: Math.min(1, p * 1.5),
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 26px)`,
        transform: `translateX(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: color, boxShadow: `0 0 14px ${color}` }} />
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color, textShadow: glowText(color, 0.35) }}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderRadius: 16,
          background: "rgba(5, 10, 31, 0.6)",
          border: `1.5px solid ${C.edge}`,
          opacity: ex,
          transform: `scale(${interpolate(ex, [0, 1], [0.8, 1])})`,
        }}
      >
        {icon}
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 29, color: C.text, whiteSpace: "nowrap" }}>{example}</span>
      </div>
      {shine > -0.3 && shine < 1.3 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine * 100}%`, width: 120, transform: "translateX(-50%) skewX(-20deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }} />
      ) : null}
    </div>
  );
};

export const S7Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const HERE = s.sent(0).from;
  const NUMW = s.cue("Numerical");
  const DISC = s.cue("discrete");
  const CONT = s.cue("continuous.");
  const CATW = s.cue("Categorical");
  const NOMW = s.cue("nominal");
  const ORDW = s.cue("ordinal.");
  const END = s.duration;
  const OUT = END - 12;
  const SHINE = ORDW + 16;

  const push = interpolate(frame, [0, END], [1, 1.035], { easing: theme.ease.soft });
  const out = ease(frame, [OUT, END], [0, 1], theme.ease.in);
  const draw = (a: number, b: number) => ease(frame, [a, b], [0, 1], theme.ease.inOut);

  const trunk1 = poly([[TRUNK_X, ROOT[1] + 56], [TRUNK_X, Y.num], [205, Y.num]]);
  const trunk2 = poly([[TRUNK_X, Y.num], [TRUNK_X, Y.cat], [205, Y.cat]]);
  const dis = poly([[SUB_X, Y.num + 34], [SUB_X, Y.dis], [CARD_X - 4, Y.dis]]);
  const con = poly([[SUB_X, Y.dis], [SUB_X, Y.con], [CARD_X - 4, Y.con]]);
  const nom = poly([[SUB_X, Y.cat + 34], [SUB_X, Y.nom], [CARD_X - 4, Y.nom]]);
  const ord = poly([[SUB_X, Y.nom], [SUB_X, Y.ord], [CARD_X - 4, Y.ord]]);

  const rootIn = spr(0, theme.spring.pop);
  const pulse = Math.max(0, 1 - Math.abs(frame - SHINE) / 10);

  return (
    <AbsoluteFill style={{ transformOrigin: "540px 860px", transform: `scale(${push * (1 - out * 0.12)})`, opacity: 1 - out }}>
      <Pop at={HERE - 4} x={540} y={300} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.26em", color: C.dim, whiteSpace: "nowrap" }}>THE COMPLETE PICTURE</div>
      </Pop>

      <Wires
        wires={[
          { d: trunk1.d, at: trunk1.at, color: kindColor.data, p: draw(NUMW - 10, NUMW + 2), width: 5, pulseFrom: NUMW + 10 },
          { d: trunk2.d, at: trunk2.at, color: kindColor.data, p: draw(CATW - 12, CATW + 2), width: 5, pulseFrom: CATW + 10 },
          { d: dis.d, at: dis.at, color: C.cyan, p: draw(DISC - 9, DISC + 1), pulseFrom: DISC + 8 },
          { d: con.d, at: con.at, color: C.green, p: draw(CONT - 9, CONT + 1), pulseFrom: CONT + 8 },
          { d: nom.d, at: nom.at, color: C.violet, p: draw(NOMW - 9, NOMW + 1), pulseFrom: NOMW + 8 },
          { d: ord.d, at: ord.at, color: C.orange, p: draw(ORDW - 9, ORDW + 1), pulseFrom: ORDW + 8 },
        ]}
      />

      {/* root */}
      <div style={{ position: "absolute", left: ROOT[0], top: ROOT[1], transform: `translate(-50%, -50%) scale(${rootIn})` }}>
        <Orb size={104} pulse={pulse} />
      </div>
      <Pop at={4} x={330} y={ROOT[1]} from="left" dist={30}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, color: C.text, letterSpacing: "-0.01em", textShadow: glowText(C.cyan, 0.4 + pulse) }}>DATA</div>
      </Pop>

      {/* families */}
      {[
        { at: NUMW - 1, y: Y.num, label: "NUMERICAL", color: C.cyan },
        { at: CATW - 1, y: Y.cat, label: "CATEGORICAL", color: C.violet },
      ].map((f) => {
        const p = spr(f.at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={f.label} style={{ position: "absolute", left: 208, top: f.y, transformOrigin: "0% 50%", transform: `translateY(-50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) }}>
            <Pill label={f.label} color={f.color} size={32} glow={0.4} />
          </div>
        );
      })}

      <Leaf y={Y.dis} at={DISC - 2} label="Discrete" color={C.cyan} icon={<DotsGlyph size={34} color={C.cyan} />} example="5 students" shineAt={SHINE} />
      <Leaf y={Y.con} at={CONT - 2} label="Continuous" color={C.green} icon={<RulerGlyph size={34} color={C.green} />} example="165.8 cm" shineAt={SHINE + 4} />
      <Leaf y={Y.nom} at={NOMW - 2} label="Nominal" color={C.violet} icon={<DropGlyph size={34} color={C.violet} />} example="Blood group AB" shineAt={SHINE + 8} />
      <Leaf y={Y.ord} at={ORDW - 2} label="Ordinal" color={C.orange} icon={<StairsGlyph size={34} color={C.orange} />} example="Low < Mid < High" shineAt={SHINE + 12} />
    </AbsoluteFill>
  );
};

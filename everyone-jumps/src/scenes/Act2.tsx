// Scene 4: the scientific reveal.
// Numbers: Earth 5.97×10²⁴ kg. Humanity 8.3×10⁹ × 62 kg ≈ 5.1×10¹¹ kg. Ratio ≈ 1.2×10¹³ ("over ten trillion").
// All-in-one-spot recoil: Earth moves (m/M)·0.30 m ≈ 2.6×10⁻¹⁴ m, then comes back on landing
// (the shared centre of mass never moves). An atom is ~10⁻¹⁰ m wide, so that is ~4,000× smaller.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { camera } from "../components/Camera";
import { Earth, EarthView } from "../components/Earth";
import { AIR, JUMP_H, liftAt, Person, seeded } from "../components/Person";
import { Space } from "../components/Space";
import { Arrow, Headline, Rise, Sci, Tag } from "../components/UI";
import { CLAMP, theme } from "../theme";
import { wordAt } from "../timing";

const LIGHT = "#DCE7F7"; // diagram figures are light so they read against space

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s4", p, n);
  const bB = W("We") - 8, bC = W("So") - 4, bD = W("Even") - 6, bE = W("spread") - 8;

  const v = camera(frame, [
    { at: 0, dur: 1, v: { cx: 670, cy: 860, r: 160, lat: 18, lon: -8, ghost: 0.15 } }, // where scene 3 left the globe
    { at: 1, dur: 24, v: { cx: 540, cy: 900, r: 340, lat: 18, lon: -20 } },
    { at: bB - 6, dur: 22, v: { cx: 540, cy: 2530, r: 1500, lat: -68, lon: 16 } },
    { at: bC - 4, dur: 22, v: { cx: 540, cy: 760, r: 255, lat: 12, lon: 30 } },
    { at: bD - 4, dur: 20, v: { cx: 540, cy: 820, r: 250, lat: 8, lon: 20 } },
    { at: bE - 4, dur: 20, v: { cx: 540, cy: 840, r: 260, lat: 18, lon: 40 } },
  ]);
  const view: EarthView = { ...v, clouds: frame * 0.04 };

  // Beat D: everyone in one spot jumps (slow motion ×0.45); Earth recoils the other way, exaggerated.
  const takeoffD = W("spot") + 6;
  const tD = ((frame - takeoffD) / fps) * 0.45;
  const liftD = liftAt(tD) / JUMP_H; // 0..1
  const EXAG = 36; // px at full lift — purely for visibility
  const dD = frame >= bD - 4 && frame < bE ? liftD * EXAG : 0;
  const earth: EarthView = { ...view, cy: view.cy + dD };

  return (
    <AbsoluteFill>
      <Space drift={-frame * 0.35 - 300} />
      <Earth view={earth} />
      {frame < bB + 4 ? <BeatA from={0} to={bB} /> : null}
      {frame >= bB - 4 && frame < bC + 6 ? <BeatB from={bB} to={bC} v={view} W={W} /> : null}
      {frame >= bC - 4 && frame < bD + 6 ? <BeatC from={bC} to={bD} v={view} W={W} /> : null}
      {frame >= bD - 4 && frame < bE + 6 ? <BeatD from={bD} to={bE} v={view} W={W} takeoff={takeoffD} tD={tD} shift={dD} /> : null}
      {frame >= bE - 4 ? <BeatE from={bE} v={view} W={W} /> : null}
    </AbsoluteFill>
  );
};

type BeatProps = { from: number; to?: number; v: EarthView; W: (p: string, n?: number) => number };

// ── A: the answer ──
const BeatA: React.FC<{ from: number; to: number }> = ({ to }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Headline top={262} size={104} delay={wordAt(fps, "s4", "almost") - 2} out={to - 8} text={"ALMOST *NOTHING*\nHAPPENS"} accent={theme.colors.cyan} />
    </>
  );
};

// ── B: Newton's third law ──
const BeatB: React.FC<BeatProps> = ({ from, to, v, W }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const top = v.cy - v.r; // limb top
  const takeoff = W("pushes") + 7;
  const t = (frame - takeoff) / fps;
  const down = spring({ frame: frame - W("push"), fps, config: theme.spring.snappy });
  const up = spring({ frame: frame - W("pushes"), fps, config: theme.spring.snappy });
  const push = interpolate(t, [-0.3, -0.05, 0.05], [0, 1, 0], CLAMP); // force peaks during the push-off
  const out = interpolate(frame, [to! - 8, to!], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const inn = interpolate(frame, [from + 10, from + 22], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const L = 150 * (1 + 0.15 * push);
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - out) }}>
      <Headline top={262} size={92} delay={from + 6} text={"NEWTON'S *THIRD* LAW"} />
      <div style={{ position: "absolute", top: 372, width: 1080, display: "flex", justifyContent: "center" }}>
        <Rise delay={from + 12}>
          <Tag>EQUAL AND OPPOSITE FORCES</Tag>
        </Rise>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Person x={548} ground={top + 2} H={290} t={t} dir={1} color={LIGHT} look={{ hair: "pony" }} shadow={false} />
        {/* force on Earth, at the feet, pointing down */}
        <Arrow x1={430} y1={top + 12} x2={430} y2={top + 12 + L} p={down} width={12} head={34} />
        {/* force on the person, pointing up */}
        <Arrow x1={700} y1={top - 8} x2={700} y2={top - 8 - L} p={up} width={12} head={34} />
      </svg>
      <div style={{ position: "absolute", right: 1080 - 405, top: top + 46, textAlign: "right", opacity: down, padding: "12px 18px", borderRadius: 14, background: "rgba(3,7,18,0.78)", border: `1.5px solid ${theme.colors.panelEdge}` }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: theme.colors.orange, lineHeight: 1 }}>WE PUSH EARTH</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: theme.colors.ink, marginTop: 6 }}>down, with our legs</div>
      </div>
      <div style={{ position: "absolute", left: 728, top: top - 176, opacity: up, padding: "12px 18px", borderRadius: 14, background: "rgba(3,7,18,0.78)", border: `1.5px solid ${theme.colors.panelEdge}` }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: theme.colors.orange, lineHeight: 1 }}>EARTH PUSHES US</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: theme.colors.ink, marginTop: 6 }}>up, just as hard</div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 470, opacity: inn }}>
        <Tag dashed color={theme.colors.inkDim} size={18}>
          PERSON NOT TO SCALE
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

// ── C: the mass comparison ──
const BeatC: React.FC<BeatProps> = ({ from, to, v, W }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [to! - 8, to!], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const r1 = spring({ frame: frame - W("planet"), fps, config: theme.spring.smooth });
  const r2 = spring({ frame: frame - W("but"), fps, config: theme.spring.smooth });
  const call = spring({ frame: frame - W("ten") + 2, fps, config: theme.spring.bouncy });
  const bar = interpolate(frame, [W("planet") + 4, W("planet") + 26], [0, 1], { easing: theme.ease.out, ...CLAMP });
  // tiny speck beside the globe + magnified callout of the whole of humanity
  const dot = { x: v.cx + v.r * 0.98 + 26, y: v.cy - v.r * 0.42 };
  const cc = { x: 905, y: 520 };
  const crowd = React.useMemo(() => {
    const r = seeded(42);
    return Array.from({ length: 11 }, (_, i) => ({ x: cc.x - 58 + (i % 6) * 23 + (r() - 0.5) * 8 + (i >= 6 ? 11 : 0), g: cc.y + (i >= 6 ? 46 : 14), H: 38 + r() * 10, dir: (r() < 0.5 ? 1 : -1) as 1 | -1 }));
  }, [cc.x, cc.y]);
  const rowStyle: React.CSSProperties = { position: "absolute", left: 100, width: 880, display: "flex", alignItems: "baseline", justifyContent: "space-between" };
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Headline top={262} size={80} delay={W("trillion") - 2} text={"EARTH IS *12 TRILLION*\nTIMES HEAVIER THAN US"} lineHeight={1.04} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={call}>
          <circle cx={dot.x} cy={dot.y} r={3} fill={theme.colors.orange} />
          <line x1={dot.x} y1={dot.y} x2={cc.x - 70} y2={cc.y + 50} stroke={theme.colors.orange} strokeWidth={2} strokeDasharray="5 6" />
          <circle cx={cc.x} cy={cc.y + 30} r={92 * call} fill="rgba(3,7,18,0.82)" stroke={theme.colors.orange} strokeWidth={2.5} />
          {crowd.map((p, i) => (
            <Person key={i} x={p.x} ground={p.g} H={p.H * call} t={-3} dir={p.dir} color={LIGHT} shadow={false} ready={false} />
          ))}
        </g>
      </svg>
      <div style={{ position: "absolute", left: cc.x - 120, top: cc.y + 128, width: 240, textAlign: "center", opacity: call, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: theme.colors.orange, letterSpacing: "0.06em" }}>
        ALL OF US
      </div>
      {/* data rows */}
      <div style={{ ...rowStyle, top: 1040, opacity: r1, transform: `translateY(${(1 - r1) * 24}px)` }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: theme.colors.ink, letterSpacing: "0.04em" }}>EARTH</span>
        <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 46, color: theme.colors.cyan }}>
          <Sci m="5.97" e="24" unit="kg" />
        </span>
      </div>
      <div style={{ position: "absolute", left: 100, top: 1104, width: 880 * bar, height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${theme.colors.cyanDeep}, ${theme.colors.cyan})`, opacity: r1, boxShadow: `0 0 18px ${theme.colors.cyanGlow}` }} />
      <div style={{ ...rowStyle, top: 1136, opacity: r2, transform: `translateY(${(1 - r2) * 24}px)` }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: theme.colors.ink, letterSpacing: "0.04em" }}>ALL HUMANS</span>
        <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 46, color: theme.colors.orange }}>
          ≈ <Sci m="5" e="11" unit="kg" />
        </span>
      </div>
      <div style={{ position: "absolute", left: 100, top: 1196, width: 880, display: "flex", justifyContent: "space-between", opacity: r2 }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 22, color: theme.colors.inkDim }}>8.3 billion × 62 kg (average)</span>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 22, color: theme.colors.inkDim }}>bar too thin to draw</span>
      </div>
    </AbsoluteFill>
  );
};

// ── D: everyone in one spot — exaggerated recoil ──
const BeatD: React.FC<BeatProps & { takeoff: number; tD: number; shift: number }> = ({ from, to, v, W, tD, shift }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(frame, [from + 8, from + 20], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const out = interpolate(frame, [to! - 8, to!], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const cyE = v.cy + shift;
  const crowd = React.useMemo(() => {
    const r = seeded(9);
    return Array.from({ length: 17 }, (_, i) => ({ a: (i - 8) * 2.6 + (r() - 0.5) * 1.2, H: 40 + r() * 12, dir: (r() < 0.5 ? 1 : -1) as 1 | -1, look: { hair: (["short", "pony", "bun", "long"] as const)[Math.floor(r() * 4)] } }));
  }, []);
  const fly = interpolate(tD, [0, 0.03, AIR - 0.03, AIR], [0, 1, 1, 0], CLAMP);
  const readIn = spring({ frame: frame - W("shift"), fps, config: theme.spring.smooth });
  const atom = spring({ frame: frame - W("atom") + 2, fps, config: theme.spring.smooth });
  const exag = spring({ frame: frame - W("spot") - 4, fps, config: theme.spring.snappy });
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - out) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* where Earth started */}
        <circle cx={v.cx} cy={v.cy} r={v.r} fill="none" stroke={theme.colors.inkDim} strokeWidth={2.5} strokeDasharray="10 10" opacity={exag * 0.9} />
        {/* the crowd stands on the original ground; they go up, Earth goes down */}
        {crowd.map((p, i) => {
          const a = (p.a * Math.PI) / 180;
          const gx = v.cx + Math.sin(a) * v.r, gy = v.cy - Math.cos(a) * v.r;
          return (
            <g key={i} transform={`rotate(${p.a} ${gx} ${gy})`}>
              <Person x={gx} ground={gy} H={p.H} t={tD} dir={p.dir} color={LIGHT} look={p.look} shadow={false} />
            </g>
          );
        })}
        <Arrow x1={v.cx + 170} y1={v.cy - v.r - 20} x2={v.cx + 170} y2={v.cy - v.r - 120} p={fly} width={9} head={26} />
        <Arrow x1={v.cx} y1={cyE + v.r + 16} x2={v.cx} y2={cyE + v.r + 96} p={fly} width={9} head={26} />
      </svg>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 300, display: "flex", justifyContent: "center" }}>
        <Rise delay={from + 8} out={W("shift") - 6}>
          <Tag dashed color={theme.colors.ink} size={26}>
            IMAGINE: EVERYONE IN ONE SPOT
          </Tag>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 610, top: v.cy + v.r + 40, opacity: exag }}>
        <Tag color={theme.colors.orange} size={19}>
          EXAGGERATED FOR VISIBILITY
        </Tag>
      </div>
      {/* the real number */}
      <div style={{ position: "absolute", top: 262, width: 1080, textAlign: "center", opacity: readIn, transform: `translateY(${(1 - readIn) * 30}px)` }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: "0.26em", color: theme.colors.cyan }}>REAL SHIFT OF THE EARTH</div>
        <div style={{ marginTop: 8, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 60, color: theme.colors.ink, textShadow: `0 0 36px ${theme.colors.cyanGlow}` }}>0.00000000000003 m</div>
      </div>
      <div style={{ position: "absolute", top: 392, width: 1080, textAlign: "center", opacity: atom, transform: `translateY(${(1 - atom) * 24}px)` }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: theme.colors.ink, letterSpacing: "0.02em" }}>
          THOUSANDS OF TIMES <span style={{ color: theme.colors.cyan }}>SMALLER THAN AN ATOM</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── E: spread out, the pushes partly cancel ──
const N = 14;
const BeatE: React.FC<Omit<BeatProps, "to">> = ({ from, v, W }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fSpread = W("spread"), fCancel = W("cancel");
  const th0 = -0.9; // where more people live (upper right, roughly Asia in this view)
  const arrows = Array.from({ length: N }, (_, i) => {
    const th = (i / N) * Math.PI * 2 + 0.11;
    const w = 0.55 + 0.45 * Math.cos(th - th0);
    return { th, w };
  });
  // net = Σ w·(inward unit); with this weighting it is ~⅓ of the total — partial cancellation
  const net = arrows.reduce((acc, a) => [acc[0] - a.w * Math.cos(a.th), acc[1] - a.w * Math.sin(a.th)], [0, 0]);
  const fade = interpolate(frame, [fCancel - 4, fCancel + 14], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const netP = spring({ frame: frame - fCancel - 6, fps, config: theme.spring.smooth });
  const inn = interpolate(frame, [from + 6, from + 16], [0, 1], CLAMP);
  const k = 22; // px per unit of net
  return (
    <AbsoluteFill style={{ opacity: inn }}>
      <Headline top={262} size={84} delay={from + 8} text={"SPREAD AROUND THE GLOBE,\nPUSHES *PARTLY CANCEL*"} lineHeight={1.04} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {arrows.map((a, i) => {
          const p = spring({ frame: frame - fSpread - i * 1.5, fps, config: theme.spring.snappy });
          const ux = Math.cos(a.th), uy = Math.sin(a.th);
          const r0 = v.r + 20 + 90 * a.w, r1 = v.r + 14;
          return <Arrow key={i} x1={v.cx + ux * r0} y1={v.cy + uy * r0} x2={v.cx + ux * r1} y2={v.cy + uy * r1} p={p} width={8} head={22} glow={false} opacity={1 - 0.75 * fade} />;
        })}
        <circle cx={v.cx} cy={v.cy} r={10 * netP} fill={theme.colors.orange} />
        <Arrow x1={v.cx} y1={v.cy} x2={v.cx + net[0] * k} y2={v.cy + net[1] * k} p={netP} width={11} head={30} />
      </svg>
      <div style={{ position: "absolute", left: v.cx + net[0] * k - 40, top: v.cy + net[1] * k + 24, opacity: netP }}>
        <Tag color={theme.colors.orange} size={20}>
          WHAT'S LEFT
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

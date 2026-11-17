// S4 the captain's dilemma · S5 the season swing and sampling variation.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SamplingDots, SeasonBars } from "../components/Charts";
import { BallIcon, BatIcon } from "../components/Icons";
import { Flash, Headline, Kicker, Photo, Rise, Source, Tag } from "../components/UI";
import { IPL_DECISION } from "../data";
import { CLAMP, theme } from "../theme";
import { scene, wordAt } from "../timing";
import { Cam, CoinView, StadiumView } from "../three/views";

const C = theme.colors;

// Illustrative T20 innings worm (runs vs overs). Not data.
const Worm: React.FC<{ p: number; mode: "set" | "chase"; col: string }> = ({ p, mode, col }) => {
  const W = 360, H = 170;
  const pts = Array.from({ length: 21 }, (_, o) => {
    const set = 0.9 * o * 8.2 + (o > 15 ? (o - 15) * 3.5 : 0);
    const chase = 0.95 * o * 8.4 + (o > 14 ? (o - 14) * 4.2 : 0);
    return [o, mode === "set" ? set : chase] as const;
  });
  const target = 181;
  const X = (o: number) => (o / 20) * W, Y = (r: number) => H - (r / 210) * H;
  const n = Math.max(1, Math.floor(p * 20));
  const d = pts.slice(0, n + 1).map(([o, r], i) => `${i ? "L" : "M"} ${X(o)} ${Y(Math.min(r, mode === "chase" ? target + 2 : 999))}`).join(" ");
  return (
    <svg width={W} height={H + 26}>
      <line x1={0} x2={W} y1={H} y2={H} stroke={C.creamFaint} strokeWidth={2} />
      {mode === "chase" ? <line x1={0} x2={W} y1={Y(target)} y2={Y(target)} stroke={C.cream} strokeWidth={2} strokeDasharray="6 6" opacity={0.7} /> : null}
      <path d={d} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <text x={0} y={H + 22} fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={16}>OVER 0</text>
      <text x={W} y={H + 22} textAnchor="end" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={16}>20</text>
      {mode === "chase" ? (
        <text x={4} y={Y(target) - 8} fill={C.cream} fontFamily={theme.fonts.body} fontSize={16} letterSpacing="2">TARGET KNOWN</text>
      ) : (
        <text x={W - 4} y={Y(176) - 10} textAnchor="end" fill={C.cream} fontFamily={theme.fonts.body} fontSize={16} letterSpacing="2" opacity={p > 0.9 ? 1 : 0}>TOTAL TO DEFEND</text>
      )}
    </svg>
  );
};

// ───────────── S4 — THE CAPTAIN'S DILEMMA ─────────────
export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s4", p, n);
  const dur = scene(fps, "s4").duration;
  const a = 0.2 + frame * 0.0012;
  const cam: Cam = { pos: [Math.cos(a) * 30, 22, Math.sin(a) * 30], target: [0, 0, 0], fov: 55 };
  const fBowl = W("fifty-five"), fBat = W("forty-five"), fBut = W("But");
  const panels = [
    { t: "BOWL FIRST", sub: "CHASE A TARGET", pct: IPL_DECISION.field, col: C.green, glow: C.greenGlow, at: fBowl, mode: "chase" as const, icon: <BallIcon size={74} />, x: 60 },
    { t: "BAT FIRST", sub: "SET A TARGET", pct: IPL_DECISION.bat, col: C.blue, glow: C.blueGlow, at: fBat, mode: "set" as const, icon: <BatIcon size={74} />, x: 548 },
  ];
  const dimPanels = interpolate(frame, [fBut - 4, fBut + 8], [0, 1], CLAMP);
  const corr = spring({ frame: frame - fBut - 2, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <StadiumView cam={cam} tod={1} time={frame / fps} scale={0.5} shadows={false} style={{ filter: "blur(4px) brightness(0.55)" }} />
      <Flash at={0} peak={0.25} color="#0b1220" />
      {/* the captain: a real IPL captain, photographed in 2014 */}
      <div style={{ opacity: 1 - dimPanels, transform: `translateY(${-dimPanels * 30}px)` }}>
        <Photo src="photos/gambhir-ipl-2014.jpg" x={60} y={262} w={300} h={372} from={0} dur={dur} zoom={[1.0, 1.08]} pan={[0, 0]} focus="50% 30%" caption="GAUTAM GAMBHIR" credit="KKR captain · IPL 2014 · Photo: KKR (CC BY 3.0)" />
        <div style={{ position: "absolute", left: 392, top: 280, width: 640 }}>
          <Rise delay={2}>
            <Kicker size={24}>IPL toss winners</Kicker>
          </Rise>
        </div>
        <Headline top={320} left={392} width={640} align="left" size={92} delay={6} text={"WHAT DID THE\n*CAPTAIN* CHOOSE?"} />
        <div style={{ position: "absolute", left: 392, top: 548, width: 620 }}>
          <Rise delay={14}>
            <Source style={{ fontSize: 22, color: C.cream }}>Match-win rate of toss-winning captains, by their decision</Source>
          </Rise>
        </div>
      </div>
      {/* split screen */}
      {panels.map((p, i) => {
        const inP = spring({ frame: frame - (i === 0 ? 8 : 14), fps, config: theme.spring.smooth });
        const g = spring({ frame: frame - p.at, fps, config: { damping: 22, stiffness: 70, mass: 1 } });
        const worm = interpolate(frame, [12 + i * 6, p.at + 6], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
        return (
          <div key={p.t} style={{ position: "absolute", left: p.x, top: 664, width: 472, height: 640, borderRadius: 20, background: "rgba(5,8,14,0.78)", border: `2px solid ${p.col}`, boxShadow: `0 0 ${30 * g}px ${p.glow}`, opacity: inP * (1 - dimPanels), transform: `translateY(${(1 - inP) * 50 + dimPanels * 120}px) scale(${1 - dimPanels * 0.1})`, transformOrigin: "50% 100%" }}>
            <div style={{ position: "absolute", left: 26, top: 20, display: "flex", alignItems: "center", gap: 12 }}>
              {p.icon}
              <div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 64, color: p.col, lineHeight: 1 }}>{p.t}</div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 18, letterSpacing: "0.2em", color: C.creamDim }}>{p.sub}</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 56, top: 128 }}>
              <Worm p={worm} mode={p.mode} col={p.col} />
            </div>
            <div style={{ position: "absolute", right: 22, top: 318 }}>
              <Tag size={14} dashed color={C.creamDim}>ILLUSTRATIVE</Tag>
            </div>
            {/* the data: same 0–100 scale in both panels */}
            <div style={{ position: "absolute", left: 26, right: 26, top: 352, textAlign: "center", fontFamily: theme.fonts.display, fontSize: 150, color: p.col, lineHeight: 1, opacity: g, textShadow: `0 0 30px ${p.glow}` }}>{(p.pct * g).toFixed(1)}%</div>
            <svg width={472} height={90} style={{ position: "absolute", left: 0, top: 520 }}>
              <rect x={26} y={22} width={420} height={22} rx={4} fill="rgba(237,228,204,0.1)" />
              <rect x={26} y={22} width={(420 * p.pct * g) / 100} height={22} rx={4} fill={p.col} />
              <line x1={236} x2={236} y1={10} y2={56} stroke={C.cream} strokeWidth={2.5} strokeDasharray="5 5" />
              <text x={236} y={76} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={17}>50%</text>
              <text x={26} y={76} fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={17}>0%</text>
              <text x={446} y={76} textAnchor="end" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={17}>100%</text>
            </svg>
          </div>
        );
      })}
      {/* correlation is not causation */}
      {frame >= fBut - 4 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
          <Headline top={262} size={92} delay={fBut} text={"CORRELATION\nIS NOT *CAUSATION*"} />
          <div style={{ position: "absolute", left: 90, top: 500, width: 900, height: 500, opacity: corr, transform: `translateY(${(1 - corr) * 30}px)` }}>
            <svg width={900} height={500} style={{ position: "absolute", inset: 0 }}>
              <defs>
                <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill={C.cream} />
                </marker>
              </defs>
              <line x1={450} y1={150} x2={210} y2={300} stroke={C.green} strokeWidth={5} markerEnd="url(#ah)" />
              <line x1={450} y1={150} x2={690} y2={300} stroke={C.green} strokeWidth={5} markerEnd="url(#ah)" />
              <line x1={300} y1={380} x2={600} y2={380} stroke={C.cream} strokeWidth={4} strokeDasharray="10 10" markerEnd="url(#ah)" opacity={0.75} />
              <text x={450} y={366} textAnchor="middle" fill={C.cream} fontFamily={theme.fonts.display} fontSize={56}>?</text>
            </svg>
            {[
              { t: "CONDITIONS", s: "dew · pitch · weather", x: 450, y: 70, col: C.green },
              { t: "THE DECISION", s: "bowl or bat", x: 170, y: 380, col: C.cream },
              { t: "THE RESULT", s: "win or lose", x: 730, y: 380, col: C.cream },
            ].map((n) => (
              <div key={n.t} style={{ position: "absolute", left: n.x - 150, top: n.y - 56, width: 300, height: 112, borderRadius: 14, background: C.panel, border: `2px solid ${n.col}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 52, color: n.col, lineHeight: 1 }}>{n.t}</div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 19, color: C.creamDim, letterSpacing: "0.06em" }}>{n.s}</div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 120, width: 840, top: 1020, textAlign: "center", opacity: corr }}>
            <Source style={{ fontSize: 24, color: C.cream, lineHeight: 1.4 }}>Captains choose based on conditions — and the same conditions affect who wins. The gap is observed, not a guaranteed effect of bowling first.</Source>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────── S5 — BUT WAIT: TWO SEASONS, ONE COIN ─────────────
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s5", p, n);
  const f24 = W("forty-four"), f25 = W("sixty-one");
  const simAt = W("change") + 2;
  const swap = interpolate(frame, [simAt - 6, simAt + 6], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const coinCam: Cam = { pos: [0, 0, 2.3], target: [0, 0, 0], fov: 38 };
  const slam = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 220, mass: 0.6 } });
  const butOut = interpolate(frame, [W("In") - 4, W("In") + 4], [0, 1], CLAMP);
  const shake = frame < 14 ? Math.sin(frame * 3.1) * (14 - frame) * 0.9 : 0;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <StadiumView cam={{ pos: [60, 30, -40], target: [0, -10, 0], fov: 60 }} tod={1} time={frame / fps} scale={0.45} shadows={false} style={{ filter: "blur(10px) brightness(0.32)" }} />
      <Flash at={0} peak={0.8} color="#ffffff" len={5} />
      {/* pattern interrupt */}
      <div style={{ position: "absolute", top: 780, width: 1080, textAlign: "center", opacity: slam * (1 - butOut), transform: `scale(${2 - slam}) translateX(${shake}px)` }}>
        <span style={{ fontFamily: theme.fonts.display, fontSize: 210, color: C.gold, textShadow: `0 0 50px ${C.goldGlow}` }}>BUT WAIT…</span>
      </div>
      {/* two seasons, equal scale */}
      <div style={{ opacity: butOut * (1 - swap), transform: `translateY(${-swap * 40}px)` }}>
        <Headline top={262} size={88} delay={W("In") - 2} text={"SAME LEAGUE.\nTWO *VERY* DIFFERENT SEASONS."} />
        <SeasonBars at={[f24, f25]} top={500} height={560} />
        <div style={{ position: "absolute", left: 0, top: -170, width: 1080, height: 1920, opacity: interpolate(frame, [W("In") + 4, W("In") + 16], [0, 1], CLAMP) }}>
          <CoinView cam={coinCam} pose={{ y: 0, flip: 1.5, tilt: 0, yaw: frame * 0.09 }} />
        </div>
        <div style={{ position: "absolute", top: 1010, width: 1080, textAlign: "center", opacity: interpolate(frame, [W("coin") - 2, W("coin") + 8], [0, 1], CLAMP) }}>
          <Kicker color={C.cream}>Same coin · same 50–50</Kicker>
        </div>
      </div>
      {/* sampling variation */}
      {swap > 0 ? (
        <div style={{ opacity: swap }}>
          <Headline top={262} size={88} delay={simAt} text={"SMALL SAMPLES\n*SWING*"} />
          <div style={{ position: "absolute", top: 470, width: 1080, textAlign: "center" }}>
            <Rise delay={simAt + 6}>
              <Kicker size={23} color={C.creamDim}>Simulation · a fair coin, 70 matches at a time</Kicker>
            </Rise>
          </div>
          <SamplingDots at={simAt + 8} top={560} count={48} per={1.4} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

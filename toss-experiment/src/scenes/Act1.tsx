// S1 the hook · S2 the first statistical shock · S3 you are the captain.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FormatBars } from "../components/Charts";
import { BallIcon, BatIcon, DropIcon } from "../components/Icons";
import { Flash, Headline, Kicker, Rise, Source, Tag } from "../components/UI";
import { COIN_Y, heroCam, lerpCam, spinPose, track } from "../shots";
import { CLAMP, theme } from "../theme";
import { scene, wordAt } from "../timing";
import { Cam, CoinView, StadiumView } from "../three/views";

const C = theme.colors;

// The opening coin shot (also the loop target at the very end of the film).
export const OPEN_A = -0.95; // camera orbit angle at frame 0
export const OPEN_RATE = 0.0021; // radians per frame
export const FREEZE_FLIP = 1.42; // coin angle when frozen: heads toward the camera, 3/4 view

export const CoinHero: React.FC<{ cam: Cam; pose: ReturnType<typeof spinPose> & { yaw?: number }; bgBlur?: number; tod?: number; time: number; desat?: number; glow?: number }> = ({ cam, pose, bgBlur = 6, tod = 1, time, desat = 0, glow = 0 }) => (
  <AbsoluteFill>
    <StadiumView cam={cam} tod={tod} time={time} scale={0.42} shadows={false} style={{ filter: `blur(${bgBlur}px) saturate(${1 - desat * 0.6}) brightness(${1 - desat * 0.15})`, transform: "scale(1.04)" }} />
    <CoinView cam={cam} pose={pose} glow={glow} />
  </AbsoluteFill>
);

// ───────────── S1 — THE HOOK ─────────────
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s1", p, n);
  const dur = scene(fps, "s1").duration;
  const freezeF = W("toss");
  const resumeF = W("Let's") + 2;
  const a = OPEN_A + frame * OPEN_RATE;
  // spin clock: runs, freezes on "toss" (bullet time: the camera keeps orbiting), resumes on "Let's"
  const tf = Math.min(frame, freezeF) / fps + Math.max(0, frame - resumeF) / fps;
  const rate = 3.2;
  const phase = FREEZE_FLIP - (freezeF / fps) * rate;
  const yaw = Math.PI / 2 - (OPEN_A + freezeF * OPEN_RATE);
  const pose = { ...spinPose(tf, rate, phase), yaw };
  // after "Let's look at the numbers" the camera rises away toward the aerial view
  const pull = track(frame, [[resumeF, 0], [dur, 1]], theme.ease.in);
  const cam = lerpCam(heroCam(a), { pos: [Math.cos(a) * 3.2, 4.6, Math.sin(a) * 3.2], target: [0, COIN_Y - 0.4, 0], fov: 56 }, pull);
  const frozen = frame >= freezeF && frame < resumeF;
  const desat = frozen ? interpolate(frame, [freezeF, freezeF + 6], [0, 1], CLAMP) : interpolate(frame, [resumeF, resumeF + 6], [1, 0], CLAMP) * (frame >= resumeF ? 1 : 0);
  const iplAt = W("IPL") - 2;
  const chip = spring({ frame: frame - iplAt, fps, config: theme.spring.smooth });
  const base = interpolate(frame, [iplAt + 10, iplAt + 26], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const outAll = resumeF + 4;
  return (
    <AbsoluteFill>
      <CoinHero cam={cam} pose={pose} time={frame / fps} desat={desat} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.78) 0%, rgba(4,6,12,0.35) 26%, transparent 38%)" }} />
      <Flash at={freezeF} peak={0.55} />
      <Headline top={262} size={112} delay={freezeF + 3} out={outAll} text={"WIN THE TOSS *=*\nWIN THE MATCH?"} lineHeight={0.95} />
      {/* IPL 51.6 % with a subtle 50 % baseline */}
      <div style={{ position: "absolute", left: 140, top: 1120, width: 800, height: 210, opacity: chip * (1 - interpolate(frame, [outAll, outAll + 8], [0, 1], CLAMP)), transform: `translateY(${(1 - chip) * 30}px)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: C.panel, boxShadow: `inset 0 0 0 1.5px ${C.panelEdge}` }} />
        <div style={{ position: "absolute", left: 34, top: 22 }}>
          <Kicker size={22} color={C.creamDim}>IPL · toss winner won</Kicker>
        </div>
        <div style={{ position: "absolute", right: 34, top: 8, fontFamily: theme.fonts.display, fontSize: 104, color: C.gold, lineHeight: 1, textShadow: `0 0 30px ${C.goldGlow}` }}>51.6%</div>
        <svg width={800} height={80} style={{ position: "absolute", left: 0, top: 120 }}>
          <line x1={34} x2={766} y1={40} y2={40} stroke={C.creamFaint} strokeWidth={3} />
          <line x1={34} x2={34 + 732 * 0.516 * base} y1={40} y2={40} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
          <line x1={400} x2={400} y1={18} y2={62} stroke={C.cream} strokeWidth={2.5} strokeDasharray="5 5" opacity={base} />
          <text x={400} y={14} textAnchor="middle" fill={C.cream} fontFamily={theme.fonts.body} fontSize={18} letterSpacing="3" opacity={base}>
            50%
          </text>
          <text x={34} y={78} fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={16}>0%</text>
          <text x={766} y={78} textAnchor="end" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={16}>100%</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── S2 — THE FIRST STATISTICAL SHOCK ─────────────
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s2", p, n);
  const a = 0.9 + frame * 0.0016;
  const h = track(frame, [[0, 120], [60, 92]], theme.ease.out);
  const cam: Cam = { pos: [Math.cos(a) * 120, h, Math.sin(a) * 120], target: [0, -6, 0], fov: 50 };
  const at = [W("fifty-four"), W("forty-nine"), W("fifty"), W("fifty-one")];
  const words = at.map((x, i) => x);
  const active = words.reduce((acc, x, i) => (frame >= x - 2 ? i : acc), -1);
  return (
    <AbsoluteFill>
      <StadiumView cam={cam} tod={1} time={frame / fps} scale={0.6} shadows={false} style={{ filter: "blur(1.5px)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.82) 0%, rgba(4,6,12,0.42) 28%, rgba(4,6,12,0.55) 60%, rgba(4,6,12,0.85) 100%)" }} />
      <Flash at={0} peak={0.35} color="#0b1220" len={10} />
      <div style={{ position: "absolute", top: 258, width: 1080, textAlign: "center" }}>
        <Rise delay={2}>
          <Kicker>Thousands of matches</Kicker>
        </Rise>
      </div>
      <Headline top={300} size={92} delay={6} text={"HOW OFTEN DID THE\n*TOSS WINNER* WIN?"} />
      <FormatBars at={at} top={560} active={active} />
      <div style={{ position: "absolute", top: 1300, width: 1080, textAlign: "center", opacity: interpolate(frame, [at[0], at[0] + 12], [0, 1], CLAMP) }}>
        <Source>Decided men's matches · draws, ties & no-results excluded · internationals between ICC Full Members</Source>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── S3 — YOU ARE THE CAPTAIN ─────────────
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s3", p, n);
  const dur = scene(fps, "s3").duration;
  const z = track(frame, [[0, -13.2], [dur, -10.2]], theme.ease.inOut);
  const bob = Math.sin(frame / 17) * 0.012;
  const look = track(frame, [[0, 0.4], [W("toss") - 6, 0.1], [W("Would"), 1.0]], theme.ease.inOut);
  const cam: Cam = { pos: [0.35, 1.74 + bob, z], target: [0.05, 0.9 + look * 1.2, 8], fov: 58 };
  const tossAt = W("toss") - 14;
  const tt = (frame - tossAt) / fps;
  // the coin goes up in front of you and comes down: real projectile timing (~1.1 s up and down)
  const coinVis = frame >= tossAt && frame < tossAt + 26;
  const cy = 1.0 + 3.9 * tt - 4.905 * tt * tt; // flicked up ~0.77 m and caught again (0.8 s)
  const coinPose = { x: 0.16, y: Math.max(0.98, cy), z: z + 1.3, flip: tt * 24, tilt: 0.3, yaw: 0 };
  const wonAt = W("toss") + 12;
  const choiceAt = W("Would") - 4;
  const cdStart = scene(fps, "s3").duration - Math.round(3.3 * fps) + 4;
  const cd = [0, 1, 2].map((i) => cdStart + Math.round(i * 0.95 * fps));
  const cdIdx = cd.reduce((acc, f, i) => (frame >= f ? i : acc), -1);
  const pick = spring({ frame: frame - choiceAt, fps, config: theme.spring.bouncy });
  const pulse = 1 + 0.03 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <StadiumView cam={cam} tod={1} time={frame / fps} shadows={false} />
      {coinVis ? <CoinView cam={cam} pose={coinPose} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.7) 0%, transparent 30%, transparent 70%, rgba(4,6,12,0.6) 100%)" }} />
      {/* captain's view framing */}
      <div style={{ position: "absolute", top: 256, width: 1080, textAlign: "center" }}>
        <Rise delay={4} out={choiceAt - 6}>
          <Kicker>You are the captain</Kicker>
        </Rise>
      </div>
      <div style={{ position: "absolute", top: 300, width: 1080, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        <Rise delay={W("IPL") - 2} out={choiceAt - 6}>
          <Tag color={C.cream}>IPL · UNDER LIGHTS</Tag>
        </Rise>
        <Rise delay={W("dew") - 2} out={choiceAt - 6}>
          <Tag color="#9fd0ff">
            <DropIcon size={22} /> DEW LIKELY LATER
          </Tag>
        </Rise>
      </div>
      <div style={{ position: "absolute", top: 380, width: 1080, textAlign: "center" }}>
        <Rise delay={wonAt} out={choiceAt - 6}>
          <span style={{ fontFamily: theme.fonts.display, fontSize: 96, color: C.gold, textShadow: `0 0 30px ${C.goldGlow}` }}>YOU WON THE TOSS</span>
        </Rise>
      </div>
      {/* the choice */}
      {frame >= choiceAt - 2 ? (
        <>
          <Headline top={262} size={96} delay={choiceAt} text={"BAT FIRST *OR* BOWL FIRST?"} />
          {[
            { t: "BAT FIRST", icon: <BatIcon size={150} />, x: 70, col: C.blue },
            { t: "BOWL FIRST", icon: <BallIcon size={150} />, x: 560, col: C.green },
          ].map((c, i) => {
            const p = spring({ frame: frame - choiceAt - 4 - i * 5, fps, config: theme.spring.bouncy });
            return (
              <div key={c.t} style={{ position: "absolute", left: c.x, top: 470, width: 450, height: 330, borderRadius: 22, background: "rgba(5,8,14,0.74)", border: `3px solid ${c.col}`, boxShadow: `0 0 40px ${c.col}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${(0.9 + 0.1 * p) * (cdIdx >= 0 ? pulse : 1)})` }}>
                {c.icon}
                <div style={{ fontFamily: theme.fonts.display, fontSize: 74, color: c.col, lineHeight: 1 }}>{c.t}</div>
              </div>
            );
          })}
        </>
      ) : null}
      {/* countdown: a moment to decide */}
      {cdIdx >= 0 ? (
        <div style={{ position: "absolute", left: 0, top: 860, width: 1080, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[3, 2, 1].map((n, i) => {
            if (i !== cdIdx) return null;
            const p = spring({ frame: frame - cd[i], fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
            const o = interpolate(frame, [cd[i] + 20, cd[i] + 28], [1, 0], CLAMP);
            return (
              <div key={n} style={{ position: "relative", width: 230, height: 230 }}>
                <svg width={230} height={230} style={{ position: "absolute", inset: 0 }}>
                  <circle cx={115} cy={115} r={100} fill="rgba(5,8,14,0.8)" stroke={C.creamFaint} strokeWidth={3} />
                  <circle cx={115} cy={115} r={100} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 100 * Math.min(1, (frame - cd[i]) / 28)} 999`} transform="rotate(-90 115 115)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontSize: 170, color: C.cream, opacity: o, transform: `scale(${1.5 - 0.5 * p})` }}>{n}</div>
              </div>
            );
          })}
        </div>
      ) : null}
      {cdIdx >= 0 ? (
        <div style={{ position: "absolute", top: 1180, width: 1080, textAlign: "center", opacity: interpolate(frame, [cd[0], cd[0] + 10], [0, 1], CLAMP) }}>
          <Kicker color={C.cream} size={26}>
            Make your call
          </Kicker>
        </div>
      ) : null}
      <div style={{ opacity: pick > 2 ? 0 : 1 }} />
    </AbsoluteFill>
  );
};

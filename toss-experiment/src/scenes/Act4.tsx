// S8 the real data-science lesson · S9 the ending, the landing, and the loop back to the opening coin.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BallIcon, BatIcon, DropIcon } from "../components/Icons";
import { Flash, Headline, Kicker, Photo, Rise, Source, Tag } from "../components/UI";
import { FORMATS, STUDY } from "../data";
import { COIN_Y, heroCam, spinPose, track } from "../shots";
import { CLAMP, theme } from "../theme";
import { scene, wordAt } from "../timing";
import { COIN_R, DewMacro, PitchMacro, StadiumView } from "../three/views";
import { CoinHero, FREEZE_FLIP, OPEN_A, OPEN_RATE } from "./Act1";

const C = theme.colors;
const COIN_T = 0.011;

// Diagram: TOSS → CHOICE → MATCH, with CONDITIONS shaping both the choice and its value.
const Flow: React.FC<{ top: number; at: { toss: number; choice: number; cond: number; match: number }; items: { t: string; at: number }[] }> = ({ top, at, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (f: number) => spring({ frame: frame - f, fps, config: theme.spring.snappy });
  const grow = (f: number) => interpolate(frame, [f, f + 12], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const box = (t: string, sub: string, x: number, y: number, w: number, col: string, f: number) => {
    const s = sp(f);
    return (
      <div key={t} style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 104, borderRadius: 14, background: C.panel, border: `2.5px solid ${col}`, boxShadow: `0 0 26px ${col}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 56, color: col, lineHeight: 1 }}>{t}</div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: C.creamDim, letterSpacing: "0.08em", marginTop: 2 }}>{sub}</div>
      </div>
    );
  };
  const arrow = (x1: number, y1: number, x2: number, y2: number, p: number, col: string, dashed = false) => {
    const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
    const a = Math.atan2(y2 - y1, x2 - x1);
    return (
      <g opacity={p > 0.02 ? 1 : 0}>
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={dashed ? "10 9" : undefined} />
        {p > 0.9 ? <polygon points={`${ex},${ey} ${ex - Math.cos(a - 0.45) * 20},${ey - Math.sin(a - 0.45) * 20} ${ex - Math.cos(a + 0.45) * 20},${ey - Math.sin(a + 0.45) * 20}`} fill={col} /> : null}
      </g>
    );
  };
  const X = 760;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: 480 }}>
      <svg width={1080} height={480} style={{ position: "absolute", inset: 0 }}>
        {arrow(X, 108, X, 166, grow(at.choice), C.cream)}
        {arrow(X, 278, X, 336, grow(at.match), C.cream)}
        {arrow(440, 222, 600, 222, grow(at.cond + 6), C.green)}
        {arrow(440, 262, 744, 306, grow(at.match + 6), C.green, true)}
      </svg>
      {box("TOSS", "a 50–50 coin", X, 0, 300, C.gold, at.toss)}
      {box("CHOICE", "bat or bowl", X, 170, 300, C.cream, at.choice)}
      {box("MATCH", "the result", X, 340, 300, C.cream, at.match)}
      {/* conditions node with its items ticking in */}
      <div style={{ position: "absolute", left: 40, top: 150, width: 400, height: 250, borderRadius: 16, background: C.panel, border: `2.5px solid ${C.green}`, opacity: sp(at.cond), transform: `scale(${0.85 + 0.15 * sp(at.cond)})` }}>
        <div style={{ position: "absolute", left: 24, top: 14, fontFamily: theme.fonts.display, fontSize: 56, color: C.green }}>CONDITIONS</div>
        <div style={{ position: "absolute", left: 24, top: 86, display: "flex", flexWrap: "wrap", gap: 10, width: 360 }}>
          {items.map((it) => (
            <div key={it.t} style={{ opacity: sp(it.at), transform: `translateY(${(1 - sp(it.at)) * 14}px)`, padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${C.creamFaint}`, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 21, letterSpacing: "0.1em", color: C.cream }}>
              {it.t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 470, top: 300, width: 220, opacity: grow(at.match + 10) }}>
        <Source style={{ color: C.green, fontSize: 19 }}>…and how much the choice is worth</Source>
      </div>
    </div>
  );
};

// ───────────── S8 — THE REAL DATA-SCIENCE LESSON ─────────────
export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s8", p, n);
  const dur = scene(fps, "s8").duration;
  const fChoice = W("It's"), fAnd = W("And"), fPitch = W("pitch,"), fWeather = W("weather,"), fFormat = W("match"), fCond = W("conditions.");
  const box = { x: 40, y: 250, w: 1000, h: 540 };
  const seg = (a: number, b: number) => frame >= a - 1 && frame < b + 1;
  const fade = (a: number) => interpolate(frame, [a - 1, a + 3], [0, 1], CLAMP);
  const shot = (a: number, b: number, el: React.ReactNode) => (seg(a, b) ? <div style={{ position: "absolute", inset: 0, opacity: fade(a) }}>{el}</div> : null);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {/* media window: genuine photographs + 3D illustrations, cut to the words */}
      <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 20, overflow: "hidden", boxShadow: `0 30px 80px -24px rgba(0,0,0,0.85), inset 0 0 0 1.5px ${C.panelEdge}` }}>
        <div style={{ position: "absolute", left: -box.x, top: -box.y, width: 1080, height: 1920 }}>
          {shot(0, fChoice, <Photo src="photos/toss-bradman.jpg" x={box.x} y={box.y} w={box.w} h={box.h} from={0} dur={fChoice} zoom={[1.02, 1.14]} pan={[10, -10]} focus="50% 35%" radius={0} caption="A TOSS IN THE 1930s · BRADMAN & ALLEN" credit="Photo: unknown author · public domain" />)}
          {shot(fChoice, fAnd, (
            <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${C.navyHi}, ${C.night})` }}>
              {[
                { t: "BAT FIRST", icon: <BatIcon size={140} />, x: 90, col: C.blue },
                { t: "BOWL FIRST", icon: <BallIcon size={140} />, x: 560, col: C.green },
              ].map((c, i) => {
                const p = spring({ frame: frame - fChoice - i * 4, fps, config: theme.spring.bouncy });
                return (
                  <div key={c.t} style={{ position: "absolute", left: c.x, top: box.y + 110, width: 430, height: 320, borderRadius: 20, border: `3px solid ${c.col}`, background: "rgba(5,8,14,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
                    {c.icon}
                    <div style={{ fontFamily: theme.fonts.display, fontSize: 70, color: c.col, lineHeight: 1 }}>{c.t}</div>
                  </div>
                );
              })}
            </AbsoluteFill>
          ))}
          {shot(fAnd, fPitch, <Photo src="photos/chin-floodlights-2014.jpg" x={box.x} y={box.y} w={box.w} h={box.h} from={fAnd} dur={fPitch - fAnd} zoom={[1.1, 1.2]} pan={[20, -20]} radius={0} caption="FLOODLIGHTS · IPL · CHINNASWAMY 2014" credit="Photo: Ramesh NG · CC BY-SA 2.0" />)}
          {shot(fPitch, fWeather, (
            <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: -box.x, top: -box.y - 380, width: 1080, height: 1920 }}>
                <PitchMacro cam={{ pos: [0.25, 1.3, 1.15], target: [0.1, 0, 0.35], fov: 40 }} day={5} />
              </div>
              <div style={{ position: "absolute", left: 22, bottom: 20 }}>
                <Tag size={16} dashed color={C.creamDim}>3D ILLUSTRATION · A WORN PITCH</Tag>
              </div>
            </div>
          ))}
          {shot(fWeather, fWeather + Math.round((fFormat - fWeather) / 2), <Photo src="photos/otr-rain-2014.jpg" x={box.x} y={box.y} w={box.w} h={box.h} from={fWeather} dur={20} zoom={[1.05, 1.12]} radius={0} caption="RAIN · OLD TRAFFORD · AUG 2014" credit="Photo: Anthony O'Neil · CC BY-SA 2.0" />)}
          {shot(fWeather + Math.round((fFormat - fWeather) / 2), fFormat, <Photo src="photos/toss-delayed-2017.jpg" x={box.x} y={box.y} w={box.w} h={box.h} from={fWeather} dur={30} zoom={[1.08, 1.16]} focus="40% 45%" radius={0} caption="THE TOSS WILL BE DELAYED · WOMEN'S WORLD CUP 2017" credit="Photo: Robert Drummond · CC0" />)}
          {shot(fFormat, fCond, (
            <>
              <Photo src="photos/tb-2018-wide.jpg" x={box.x} y={box.y} w={box.w} h={box.h} from={fFormat} dur={30} zoom={[1.04, 1.12]} radius={0} caption="A DAY TEST · TRENT BRIDGE · AUG 2018" credit="Photo: Dun.can · CC BY 2.0" />
              <div style={{ position: "absolute", left: box.x + 30, top: box.y + 30, display: "flex", gap: 10 }}>
                {FORMATS.map((f, i) => (
                  <div key={f.key} style={{ opacity: spring({ frame: frame - fFormat - i * 2, fps, config: theme.spring.snappy }) }}>
                    <Tag size={22} color={C.gold}>{f.label}</Tag>
                  </div>
                ))}
              </div>
            </>
          ))}
          {shot(fCond, dur + 2, (
            <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: -box.x, top: -box.y - 300, width: 1080, height: 1920 }}>
                <DewMacro cam={{ pos: [0.03, 0.07, 0.2], target: [0, 0.032, 0], fov: 36 }} wet={1} time={frame / fps} />
              </div>
              <div style={{ position: "absolute", left: 22, bottom: 20 }}>
                <Tag size={16} dashed color="#9fd0ff">
                  <DropIcon size={18} /> 3D ILLUSTRATION · DEW UNDER LIGHTS
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", top: 806, width: 1080, textAlign: "center" }}>
        <Rise delay={W("coin") - 2}>
          <Kicker size={24} color={C.cream}>The real advantage</Kicker>
        </Rise>
      </div>
      <Flow
        top={850}
        at={{ toss: W("coin") - 2, choice: W("choice.") - 2, cond: fPitch - 4, match: fCond }}
        items={[
          { t: "PITCH", at: fPitch },
          { t: "WEATHER", at: fWeather },
          { t: "FORMAT", at: W("format") },
          { t: "DEW", at: fCond },
        ]}
      />
    </AbsoluteFill>
  );
};

// ───────────── S9 — THE ENDING AND CALLBACK ─────────────
// Coin landing: a short drop, two damped bounces, then a decaying Euler's-disk wobble.
const landingPose = (t: number) => {
  const g = 9.81, h0 = 0.95, rest = 0.0125 + COIN_T / 2; // pitch surface sits 12.5 mm up
  const tFall = Math.sqrt((2 * (h0 - rest)) / g);
  if (t < tFall) {
    const tt = t - tFall; // ≤ 0
    return { y: rest + 0.5 * g * tt * tt, flip: tt * 17, tilt: 0.0, yaw: 0.4 };
  }
  const v1 = g * tFall * 0.32, b1 = (2 * v1) / g, v2 = v1 * 0.3, b2 = (2 * v2) / g;
  const tb = t - tFall;
  if (tb < b1) return { y: rest + v1 * tb - 0.5 * g * tb * tb, flip: tb * 6, tilt: 0.1, yaw: 0.4 };
  if (tb < b1 + b2) {
    const u = tb - b1;
    return { y: rest + v2 * u - 0.5 * g * u * u, flip: b1 * 6 + u * 4, tilt: 0.12, yaw: 0.4 };
  }
  const w = tb - b1 - b2;
  const theta = 0.16 * Math.exp(-w / 0.45);
  const psi = 0.4 + 7 * w + 18 * w * w * (1 - Math.exp(-w));
  const flipEnd = b1 * 6 + b2 * 4;
  return { y: 0.0125 + (COIN_T / 2) * Math.cos(theta) + COIN_R * Math.sin(theta), flip: flipEnd * Math.exp(-w / 0.2) + theta, tilt: 0, yaw: psi };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s9", p, n);
  const dur = scene(fps, "s9").duration;
  const fUsually = W("Usually,"), fBut = W("But"), fToss = W("toss", 1), fDoesnt = W("It"), fBeyond = W("Beyond");
  const landCut = W("winner.") - 4;
  const loopLen = Math.round(1.05 * fps);
  const loopAt = dur - loopLen;
  // spinning hero coin, sharing the opening shot's maths
  const s1Freeze = wordAt(fps, "s1", "toss");
  const rate = 3.2;
  const phase = FREEZE_FLIP - (s1Freeze / fps) * rate;
  const yaw = Math.PI / 2 - (OPEN_A + s1Freeze * OPEN_RATE);
  let body: React.ReactNode;
  if (frame >= loopAt) {
    // the last second is the opening shot, timed to run straight into frame 0 of the film
    const k = frame - dur; // −loopLen … −1
    const pose = { ...spinPose(k / fps, rate, phase), yaw };
    body = <CoinHero cam={heroCam(OPEN_A + k * OPEN_RATE)} pose={pose} time={k / fps} />;
  } else if (frame >= landCut) {
    const t = (frame - landCut) / fps - 0.15;
    const p = landingPose(Math.max(0, t));
    const ca = 0.9 + (frame - landCut) * 0.002;
    body = (
      <StadiumView
        cam={{ pos: [Math.cos(ca) * 0.72, 0.3, Math.sin(ca) * 0.72], target: [-Math.cos(ca) * 1.2, 0.0, -Math.sin(ca) * 1.2], fov: 44 }}
        tod={1}
        time={frame / fps}
        coin={{ x: 0, y: p.y, z: 0, flip: p.flip, tilt: p.tilt, yaw: p.yaw }}
      />
    );
  } else {
    const a = 0.35 + frame * 0.0018;
    const spinT = frame / fps;
    const pose = { ...spinPose(spinT, 2.4, 0.3), y: COIN_Y + 0.02 * Math.sin(spinT) };
    body = <CoinHero cam={heroCam(a, 0.66)} pose={pose} time={frame / fps} glow={interpolate(frame, [fBut + 10, fBut + 30, fToss - 4, fToss + 8], [0, 1, 1, 0], CLAMP)} />;
  }
  const chipsIn = (f: number) => spring({ frame: frame - f, fps, config: theme.spring.smooth });
  const brand = spring({ frame: frame - fBeyond + 2, fps, config: theme.spring.heavy });
  const linesOut = landCut + 26;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {body}
      {frame < loopAt ? (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.82) 0%, rgba(4,6,12,0.35) 28%, transparent 42%, transparent 70%, rgba(4,6,12,0.55) 100%)" }} />
          <Headline top={262} size={100} delay={4} out={fToss - 8} text={"DOES WINNING THE TOSS\n*WIN MATCHES?*"} />
          {/* usually, not by much */}
          <div style={{ position: "absolute", left: 60, top: 1080, width: 960, display: "flex", justifyContent: "space-between", opacity: frame < fBut + 2 ? 1 : interpolate(frame, [fBut + 2, fBut + 10], [1, 0], CLAMP) }}>
            {FORMATS.map((f, i) => {
              const p = chipsIn(fUsually - 4 + i * 3);
              return (
                <div key={f.key} style={{ width: 222, height: 150, borderRadius: 14, background: C.panel, boxShadow: `inset 0 0 0 1.5px ${C.panelEdge}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 22, letterSpacing: "0.2em", color: C.creamDim }}>{f.label}</div>
                  <div style={{ fontFamily: theme.fonts.display, fontSize: 76, color: C.cream, lineHeight: 1 }}>{f.pct}%</div>
                </div>
              );
            })}
          </div>
          {/* …but in the right conditions */}
          <div style={{ position: "absolute", left: 60, top: 1080, width: 960, display: "flex", justifyContent: "center", gap: 24, opacity: frame < fToss - 8 ? 1 : interpolate(frame, [fToss - 8, fToss], [1, 0], CLAMP) }}>
            {[
              { t: "DAY-NIGHT LIMITED-OVERS", v: `+${STUDY.dayNightLimited}` },
              { t: "TEST CRICKET", v: `+${STUDY.test}` },
            ].map((c, i) => {
              const p = chipsIn(W("conditions,") + i * 5);
              return (
                <div key={c.t} style={{ width: 420, height: 150, borderRadius: 14, background: C.panel, border: `2px solid ${C.gold}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 20, letterSpacing: "0.16em", color: C.creamDim }}>{c.t}</div>
                  <div style={{ fontFamily: theme.fonts.display, fontSize: 76, color: C.gold, lineHeight: 1 }}>
                    {c.v} <span style={{ fontFamily: theme.fonts.body, fontSize: 24, letterSpacing: "0.1em" }}>PTS</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* the two lines */}
          <Headline top={262} size={96} delay={fToss - 2} out={linesOut} text={"THE TOSS DOESN'T\nGUARANTEE *VICTORY.*"} />
          <Headline top={470} size={96} delay={fDoesnt} out={linesOut} accent={C.green} text={"CONDITIONS CHANGE\nITS *VALUE.*"} />
          {/* brand lockup */}
          {frame >= fBeyond - 4 ? (
            <div style={{ position: "absolute", left: 0, top: 300, width: 1080, textAlign: "center", opacity: brand, transform: `translateY(${(1 - brand) * 40}px)` }}>
              <div style={{ width: 120 * brand, height: 4, background: C.gold, margin: "0 auto 26px", boxShadow: `0 0 20px ${C.goldGlow}` }} />
              <div style={{ fontFamily: theme.fonts.display, fontSize: 150, color: C.cream, lineHeight: 0.92, letterSpacing: "0.02em", textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
                BEYOND THE
                <br />
                SCOREBOARD
              </div>
              <div style={{ marginTop: 22 }}>
                <Kicker size={24} color={C.creamDim}>The toss starts the match. It doesn't decide the winner.</Kicker>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      <Flash at={landCut} peak={0.25} len={6} />
      <Flash at={loopAt} peak={0.5} len={6} />
    </AbsoluteFill>
  );
};

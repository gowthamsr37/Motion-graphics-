// S6 the day-night experiment · S7 Test cricket's hidden advantage.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EffectBars } from "../components/Charts";
import { DropIcon } from "../components/Icons";
import { Headline, Kicker, Rise, Source, Tag } from "../components/UI";
import { STUDY } from "../data";
import { lerpCam, track } from "../shots";
import { CLAMP, theme } from "../theme";
import { scene, wordAt } from "../timing";
import { Cam, DewMacro, PitchMacro, StadiumView } from "../three/views";

const C = theme.colors;

const clock = (h: number) => {
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60 / 5) * 5;
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`;
};

// ───────────── S6 — THE DAY-NIGHT EXPERIMENT ─────────────
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s6", p, n);
  const dur = scene(fps, "s6").duration;
  const fBut = W("But"), fEst = W("estimated"), fThree = W("three"), fPts = W("points.");
  const dewAt = fPts - 8;
  const tod = track(frame, [[0, 0.03], [fBut - 10, 0.33], [fEst, 0.66], [fThree, 0.9], [dur, 0.95]], theme.ease.inOut);
  const a = track(frame, [[0, 0.35], [dewAt, 1.55]], theme.ease.inOut);
  const orbit: Cam = { pos: [Math.cos(a) * 44, 11, Math.sin(a) * 44], target: [-Math.cos(a) * 20, 15, -Math.sin(a) * 20], fov: 60 };
  const dive = track(frame, [[dewAt - 22, 0], [dewAt + 4, 1]], theme.ease.in);
  const low: Cam = { pos: [Math.cos(a) * 6, 0.6, Math.sin(a) * 6], target: [Math.cos(a) * 4.5, 0, Math.sin(a) * 4.5], fov: 60 };
  const cam = lerpCam(orbit, low, dive);
  const dewIn = interpolate(frame, [dewAt - 2, dewAt + 8], [0, 1], CLAMP);
  const wet = interpolate(frame, [dewAt, dur - 10], [0.15, 1], CLAMP);
  const hour = 15.5 + tod * 5;
  const lapse = interpolate(frame, [8, 20], [0, 1], CLAMP) * (1 - dewIn);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {dewIn < 1 ? <StadiumView cam={cam} tod={tod} time={(frame / fps) * 9} shadows={false} /> : null}
      {dewIn > 0 ? (
        <AbsoluteFill style={{ opacity: dewIn }}>
          <DewMacro cam={{ pos: [0.03 - (frame - dewAt) * 0.0006, 0.075, 0.21], target: [0, 0.032, 0], fov: 38 }} wet={wet} time={frame / fps} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.82) 0%, rgba(4,6,12,0.55) 22%, transparent 40%, transparent 80%, rgba(4,6,12,0.5) 100%)" }} />
      <div style={{ position: "absolute", top: 256, width: 1080, textAlign: "center" }}>
        <Rise delay={4} out={W("Researchers") - 6}>
          <Kicker>The day-night experiment</Kicker>
        </Rise>
      </div>
      <Headline top={300} size={96} delay={8} out={W("Researchers") - 6} text={"WHAT HAPPENS\nWHEN THE *LIGHTS* COME ON?"} />
      {/* time-lapse clock */}
      <div style={{ position: "absolute", left: 64, top: 1180, opacity: lapse, display: "flex", alignItems: "center", gap: 14 }}>
        <Tag size={18} color={C.creamDim}>TIME-LAPSE</Tag>
        <span style={{ fontFamily: theme.fonts.display, fontSize: 58, color: C.cream, textShadow: "0 3px 16px rgba(0,0,0,0.7)" }}>{clock(hour)}</span>
      </div>
      {/* the research finding */}
      {frame >= W("Researchers") - 8 ? (
        <div style={{ position: "absolute", left: 40, top: 236, width: 1000, height: 430, borderRadius: 18, background: "rgba(5,8,14,0.72)", boxShadow: `inset 0 0 0 1.5px ${C.panelEdge}`, opacity: interpolate(frame, [W("Researchers") - 8, W("Researchers")], [0, 1], CLAMP) }}>
          <div style={{ position: "absolute", right: 24, top: 18 }}>
            <Tag size={16} color={C.gold}>RESEARCH FINDING</Tag>
          </div>
          <EffectBars
            top={22}
            titleAt={W("Researchers") - 6}
            rows={[
              { label: "DAYTIME · INTERNATIONAL LIMITED-OVERS", v: STUDY.dayLimited, at: W("daytime"), approx: true },
              { label: "DAY-NIGHT · INTERNATIONAL LIMITED-OVERS", v: STUDY.dayNightLimited, at: fThree, hot: true },
            ]}
          />
        </div>
      ) : null}
      {dewIn > 0.3 ? (
        <div style={{ position: "absolute", left: 64, top: 1150, opacity: dewIn }}>
          <Tag size={19} color="#9fd0ff" dashed>
            <DropIcon size={22} /> ILLUSTRATION · EVENING DEW
          </Tag>
          <div style={{ marginTop: 10 }}>
            <Source style={{ color: C.cream, fontSize: 21 }}>One possible reason. The study measures the effect, not the cause.</Source>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────── S7 — TEST CRICKET'S HIDDEN ADVANTAGE ─────────────
export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = (p: string, n = 0) => wordAt(fps, "s7", p, n);
  const dur = scene(fps, "s7").duration;
  const fFour = W("four"), d1 = W("five"), d3 = W("pitch"), d5 = W("completely");
  const day = track(frame, [[0, 1], [d3 - 6, 1], [d3 + 10, 3], [d5 - 6, 3], [d5 + 10, 5]], theme.ease.inOut);
  const k = track(frame, [[0, 0], [dur, 1]], theme.ease.inOut);
  const cam = lerpCam({ pos: [1.1, 1.75, 3.4], target: [0, 0, -0.5], fov: 44 }, { pos: [0.55, 0.62, 1.75], target: [0.05, 0, 0.0], fov: 42 }, k);
  const b1 = (frame - (d1 + 4)) / (0.95 * fps);
  const b5 = (frame - (d5 + 16)) / (0.95 * fps);
  const label = frame < d3 ? 1 : frame < d5 ? 3 : 5;
  const labels: Record<number, [string, string]> = { 1: ["DAY 1", "Fresh, even surface"], 3: ["DAY 3", "Wear and footmarks"], 5: ["DAY 5", "Cracks · rough patches · variable bounce"] };
  const big = interpolate(frame, [fFour - 4, fFour + 6], [0, 1], CLAMP);
  const topOut = interpolate(frame, [d1 - 8, d1 + 4], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <PitchMacro
        cam={cam}
        day={day}
        sunAz={0.55 + k * 0.4}
        ball={[
          { p: b1, path: "true", show: b1 > 0, trail: 0.7 },
          { p: b5, path: "crack", show: b5 > 0, trail: 0.7 },
        ]}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.85) 0%, rgba(4,6,12,0.45) 24%, transparent 40%, transparent 78%, rgba(4,6,12,0.55) 100%)" }} />
      <div style={{ opacity: 1 - topOut * 0.0 }}>
        <div style={{ position: "absolute", top: 254, width: 1080, textAlign: "center" }}>
          <Rise delay={3}>
            <Kicker>Test cricket</Kicker>
          </Rise>
        </div>
        <div style={{ position: "absolute", top: 290, width: 1080, textAlign: "center", opacity: big, transform: `scale(${0.85 + 0.15 * big})` }}>
          <span style={{ fontFamily: theme.fonts.display, fontSize: 230, color: C.gold, lineHeight: 1, textShadow: `0 0 50px ${C.goldGlow}` }}>+4.9</span>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: "0.26em", color: C.cream, marginTop: -6 }}>PERCENTAGE POINTS</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 21, color: C.creamDim, marginTop: 8 }}>Estimated toss effect · 2023 study · vs day-night limited-overs +3.3</div>
        </div>
      </div>
      {/* day labels */}
      {frame >= d1 - 4 ? (
        <div style={{ position: "absolute", left: 64, top: 1130 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {[1, 3, 5].map((d) => (
              <div key={d} style={{ padding: "6px 16px", borderRadius: 6, border: `2px solid ${d === label ? C.gold : C.creamFaint}`, background: d === label ? "rgba(242,181,68,0.18)" : "rgba(5,8,14,0.6)", fontFamily: theme.fonts.display, fontSize: 40, color: d === label ? C.gold : C.creamDim }}>
                DAY {d}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 28, color: C.cream, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{labels[label][1]}</div>
        </div>
      ) : null}
      {b1 > 0 ? (
        <div style={{ position: "absolute", right: 64, top: 1130, textAlign: "right", opacity: interpolate(b1, [0, 0.2], [0, 1], CLAMP) }}>
          <Tag size={17} dashed color={C.creamDim}>ILLUSTRATION · NOT MATCH DATA</Tag>
          <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontSize: 21, color: C.cream, lineHeight: 1.4 }}>
            <span style={{ color: "#ffffff" }}>━ </span>true bounce
            {b5 > 0 ? (
              <>
                <br />
                <span style={{ color: "#ffcf5a" }}>━ </span>off a crack
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      {frame >= d5 + 4 ? (
        <div style={{ position: "absolute", left: 64, right: 64, top: 1262, opacity: interpolate(frame, [d5 + 4, d5 + 14], [0, 1], CLAMP) }}>
          <Source style={{ color: C.creamDim, fontSize: 20 }}>Pitches don't all wear the same way.</Source>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

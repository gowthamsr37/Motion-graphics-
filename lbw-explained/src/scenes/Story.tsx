// LBW, explained — nine scenes. Every reveal is tied to the narrator's word.
// The rules follow MCC Law 36 (Leg before wicket).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BatFirstIcon, Finger, LampBoard, LampState, NoBallIcon, QuestionBar, Stamp } from "../components/LBW";
import { CLAMP } from "../components/Motion";
import { Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { AMBER, Delivery, GREEN, PitchView, RED } from "../components/Pitch";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Reveal, useAt } from "./common";

const C = theme.colors;
const L = (at: number, s: LampState) => ({ at, s });

// the hook ball: pitches OUTSIDE LEG, hits the pad in line, would hit middle stump
const hookBall = (at: number, extra: Partial<Delivery> = {}): Delivery => ({
  pitch: { x: 0.55, z: 2.55 },
  impact: { x: 0.04, y: 0.32 },
  stumps: { x: -0.03, y: 0.36 },
  at,
  dur: 20,
  pitchVerdict: "bad",
  impactVerdict: "ok",
  wicketVerdict: "ok",
  ...extra,
});

const PitchPanel: React.FC<{ delay?: number; closeAt?: number; children: React.ReactNode }> = ({ delay = 0, closeAt, children }) => (
  <Panel x={60} y={346} w={960} h={836} delay={delay} closeAt={closeAt} seed={90}>
    <div style={{ position: "absolute", left: 0, top: 8 }}>{children}</div>
  </Panel>
);

/* ================= S1 — THE HOOK ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s1", i));
  return { ball: 2, hitting: s[1].from, appeal: s[2].from, notOut: wordAt(fps, "s1", "not", 6.9), why: s[3].to + 2 };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const appeal = useAt(b.appeal, theme.spring.bouncy);
  return (
    <SceneShell push={0.04} turnIn={false}>
      <Panel x={60} y={226} w={960} h={104} delay={-10} seed={61}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={60}>OUT… OR NOT OUT?</Lettering>
        </div>
      </Panel>
      <PitchPanel delay={-8}>
        <PitchView deliveries={[hookBall(b.ball, { showPitchMark: false, projectDelay: b.hitting - b.ball - 20 })]} />
      </PitchPanel>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: interpolate(appeal, [0, 0.3], [0, 1], CLAMP) * (frame < b.notOut ? 1 : 0), transform: `scale(${interpolate(appeal, [0, 1], [1.6, 1])}) rotate(-4deg)` }}>
        <Lettering size={150} color={AMBER} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
          HOWZAT?!
        </Lettering>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
        <Stamp text="NOT OUT" at={b.notOut} color={C.cream} size={170} />
      </div>
      <Panel x={60} y={1198} w={960} h={150} delay={b.why} seed={62} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={52} color={AMBER}>
            WHY? THE ANSWER IS AT THE END
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S2 — THREE QUESTIONS ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s2", i));
  return { lbw: s[0].from, three: s[1].from, any: s[2].from, red: wordAt(fps, "s2", "no", 7.1) };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const letters = ["L", "B", "W"];
  const words = ["LEG", "BEFORE", "WICKET"];
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={300} delay={0} seed={201}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 46 }}>
          {letters.map((l, i) => {
            const on = interpolate(frame, [b.lbw + i * 6, b.lbw + i * 6 + 10], [0, 1], CLAMP);
            return (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: 0.2 + 0.8 * on }}>
                <Lettering size={160} color={AMBER}>
                  {l}
                </Lettering>
                <Lettering size={40}>{words[i]}</Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel x={60} y={542} w={960} h={120} delay={b.three - 6} seed={202}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={66}>THE UMPIRE ASKS 3 QUESTIONS</Lettering>
        </div>
      </Panel>
      <LampBoard x={60} y={678} w={960} h={420} delay={b.three} big lamps={[[L(b.three + 6, "ok"), L(b.red, "bad")], [L(b.three + 12, "ok")], [L(b.three + 18, "ok")]]} />
      <Panel x={60} y={1114} w={960} h={236} delay={b.any - 4} seed={203}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Lettering size={56}>
            <span style={{ color: RED }}>ANY RED LIGHT</span> = NOT OUT
          </Lettering>
          <Lettering size={56}>
            <span style={{ color: GREEN }}>ALL THREE GREEN</span> = OUT
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — QUESTION 1: WHERE DID IT PITCH? ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s3", i));
  return { q: s[0].from, leg: s[1].from, ever: s[2].from, fine: s[3].from, toss: s[4].from };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const lanes = interpolate(frame, [b.q + 10, b.q + 24], [0, 1], CLAMP);
  const deliveries: Delivery[] = [
    { pitch: { x: 0.6, z: 2.6 }, impact: { x: 0.32, y: 0.3 }, stumps: { x: 0.25, y: 0.3 }, at: b.leg + 4, pitchVerdict: "bad", projectDelay: 999, ghost: frame > b.fine + 10 },
    { pitch: { x: 0.0, z: 2.9 }, impact: { x: 0.03, y: 0.32 }, stumps: { x: 0, y: 0.3 }, at: b.fine + 2, pitchVerdict: "ok", projectDelay: 999 },
    { pitch: { x: -0.65, z: 2.6 }, impact: { x: -0.1, y: 0.32 }, stumps: { x: 0, y: 0.3 }, at: b.fine + 30, pitchVerdict: "ok", projectDelay: 999 },
  ];
  const toss = interpolate(frame, [b.toss, b.toss + 10], [0, 1], CLAMP);
  return (
    <SceneShell push={0.02}>
      <QuestionBar n={1} text="WHERE DID IT PITCH?" />
      <PitchPanel delay={2}>
        <PitchView lanes={lanes} deliveries={deliveries} batterOn={0.5} />
      </PitchPanel>
      <div style={{ position: "absolute", left: 640, top: 560 }}>
        <Stamp text="NOT OUT. EVER." at={b.ever} color={RED} size={58} rotate={-4} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 380, opacity: toss, transform: `translateY(${interpolate(toss, [0, 1], [16, 0])}px)` }}>
        <div style={{ padding: "10px 18px 8px", borderRadius: 8, background: "rgba(10,15,12,0.9)", boxShadow: `inset 0 0 0 2px ${AMBER}` }}>
          <Lettering size={40} color={AMBER}>
            FULL TOSS? SKIP QUESTION 1
          </Lettering>
        </div>
      </div>
      <LampBoard x={60} y={1198} w={960} h={150} delay={b.q} lamps={[[L(b.leg + 4 + 14, "bad"), L(b.fine + 16, "ok")], [], []]} />
    </SceneShell>
  );
};

/* ================= S4 — QUESTION 2: WHERE DID IT HIT HIM? ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s4", i));
  return { q: s[0].from, inLine: s[1].from, leg: s[2].from, off: s[3].from, shot: wordAt(fps, "s4", "try", 10.6) };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const wall = interpolate(frame, [b.q + 10, b.q + 24], [0, 1], CLAMP);
  const offMaybe = interpolate(frame, [b.off, b.off + 10], [0, 1], CLAMP);
  const d1: Delivery = { pitch: { x: 0.05, z: 3.4 }, impact: { x: 0.02, y: 0.34 }, stumps: { x: 0, y: 0.3 }, at: b.inLine, impactVerdict: "ok", projectDelay: 999, showPitchMark: false, ghost: frame > b.leg };
  const d2: Delivery = { pitch: { x: 0.5, z: 3.4 }, impact: { x: 0.48, y: 0.34 }, stumps: { x: 0.4, y: 0.3 }, at: b.leg, impactVerdict: "bad", projectDelay: 999, showPitchMark: false, ghost: frame > b.off };
  const d3: Delivery = { pitch: { x: -0.55, z: 3.4 }, impact: { x: -0.5, y: 0.34 }, stumps: { x: -0.1, y: 0.3 }, at: b.off, impactVerdict: "maybe", projectDelay: 999, showPitchMark: false };
  const batterX = interpolate(frame, [b.inLine - 6, b.inLine, b.leg - 6, b.leg, b.off - 6, b.off], [0.02, 0.02, 0.02, 0.48, 0.48, -0.5], CLAMP);
  const shot = interpolate(frame, [b.shot, b.shot + 10], [0, 1], CLAMP);
  return (
    <SceneShell push={0.02}>
      <QuestionBar n={2} text="WHERE DID IT HIT HIM?" />
      <PitchPanel delay={2}>
        <PitchView wall={wall} offMaybe={offMaybe} deliveries={[d1, d2, d3]} batterX={batterX} />
      </PitchPanel>
      <div style={{ position: "absolute", left: 90, top: 372, opacity: offMaybe }}>
        <div style={{ padding: "12px 18px 10px", borderRadius: 8, background: "rgba(10,15,12,0.92)", boxShadow: `inset 0 0 0 2px ${AMBER}`, display: "flex", flexDirection: "column", gap: 8 }}>
          <Lettering size={30} color={AMBER}>
            OUTSIDE OFF STUMP:
          </Lettering>
          <Lettering size={30} color={C.cream} style={{ opacity: 0.35 + 0.65 * shot }}>
            PLAYED A SHOT → NOT OUT
          </Lettering>
          <Lettering size={30} color={C.cream} style={{ opacity: 0.35 + 0.65 * shot }}>
            NO SHOT → CAN BE OUT
          </Lettering>
        </div>
      </div>
      <LampBoard x={60} y={1198} w={960} h={150} delay={b.q} lamps={[[], [L(b.inLine + 22, "ok"), L(b.leg + 22, "bad"), L(b.off + 22, "maybe")], []]} />
    </SceneShell>
  );
};

/* ================= S5 — QUESTION 3: WOULD IT HIT THE STUMPS? ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s5", i));
  return { q: s[0].from, hit: s[0].from + 30, over: wordAt(fps, "s5", "over", 5.6), turn: wordAt(fps, "s5", "turned", 6.4) };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const zone = interpolate(frame, [b.q + 8, b.q + 22], [0, 1], CLAMP);
  const d: Delivery[] = [
    { pitch: { x: 0.0, z: 3.6 }, impact: { x: 0.02, y: 0.34 }, stumps: { x: -0.02, y: 0.38 }, at: b.hit, impactVerdict: "ok", wicketVerdict: "ok", projectDelay: 4, showPitchMark: false, ghost: frame > b.over },
    { pitch: { x: 0.02, z: 5.0 }, impact: { x: 0.02, y: 0.66 }, stumps: { x: 0.0, y: 1.02 }, at: b.over - 20, impactVerdict: "ok", wicketVerdict: "bad", projectDelay: 2, showPitchMark: false, ghost: frame > b.turn + 10 },
    { pitch: { x: -0.1, z: 3.4 }, impact: { x: 0.12, y: 0.32 }, stumps: { x: 0.5, y: 0.3 }, at: b.turn - 18, impactVerdict: "ok", wicketVerdict: "bad", projectDelay: 2, showPitchMark: false },
  ];
  return (
    <SceneShell push={0.02}>
      <QuestionBar n={3} text="WOULD IT HIT THE STUMPS?" />
      <PitchPanel delay={2}>
        <PitchView stumpZone={zone} deliveries={d} batterOn={0.55} />
      </PitchPanel>
      <div style={{ position: "absolute", left: 90, top: 372, display: "flex", flexDirection: "column", gap: 10 }}>
        <Reveal at={b.over} x={-20}>
          <Lettering size={40} color={RED}>
            ✕ OVER THE TOP
          </Lettering>
        </Reveal>
        <Reveal at={b.turn} x={-20}>
          <Lettering size={40} color={RED}>
            ✕ TURNING PAST
          </Lettering>
        </Reveal>
      </div>
      <LampBoard x={60} y={1198} w={960} h={150} delay={b.q} lamps={[[], [], [L(b.hit + 26, "ok"), L(b.over + 6, "bad")]]} />
    </SceneShell>
  );
};

/* ================= S6 — TWO MORE RULES ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s6", i));
  return { two: s[0].from, bat: s[1].from, nb: s[2].from };
};

export const S6: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const card = (icon: React.ReactNode, title: string, sub: string, at: number, y: number) => (
    <Panel x={60} y={y} w={960} h={420} delay={at - 6} seed={600 + y}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 40, padding: "0 50px" }}>
        {icon}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Lettering size={70}>{title}</Lettering>
          <Stamp text={sub} at={at + 24} color={RED} size={58} rotate={-3} />
        </div>
      </div>
    </Panel>
  );
  return (
    <SceneShell push={0.02}>
      <QuestionBar text="TWO MORE RULES" />
      {card(<BatFirstIcon size={260} />, "HIT THE BAT FIRST?", "NOT LBW", b.bat, 346)}
      {card(<NoBallIcon size={260} />, "IT'S A NO-BALL?", "NOT LBW", b.nb, 782)}
    </SceneShell>
  );
};

/* ================= S7 — THE RECAP ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s7", i));
  return { p: s[1].from, i: s[2].from, w: s[3].from, finger: wordAt(fps, "s7", "finger", 6.0) };
};

export const S7: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  return (
    <SceneShell push={0.03}>
      <QuestionBar text="THE WHOLE RULE IN 3 LIGHTS" />
      <LampBoard x={60} y={346} w={960} h={440} delay={0} big lamps={[[L(b.p, "ok")], [L(b.i, "ok")], [L(b.w, "ok")]]} />
      <Panel x={60} y={802} w={960} h={548} delay={b.finger - 14} seed={702} glow={C.amberGlow} glowOn={0.6}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 50 }}>
          <Finger size={240} at={b.finger} />
          <Stamp text="OUT" at={b.finger + 8} color={AMBER} size={200} rotate={-6} />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S8 — NOW YOU'RE THE UMPIRE ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5].map((i) => sentence(fps, "s8", i));
  return { you: s[0].from, replay: s[1].from, inLine: s[2].from, ask: s[3].from, reveal: s[4].from, notOut: s[5].from + 6 };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const lanes = interpolate(frame, [b.reveal, b.reveal + 10], [0, 1], CLAMP);
  const count = frame >= b.ask + 20 && frame < b.reveal ? 3 - Math.min(2, Math.floor((frame - (b.ask + 20)) / ((b.reveal - b.ask - 20) / 3))) : 0;
  return (
    <SceneShell push={0.02}>
      <QuestionBar text="NOW YOU'RE THE UMPIRE" color={AMBER} />
      <PitchPanel delay={2}>
        <PitchView lanes={lanes} deliveries={[hookBall(b.replay, { markAt: b.reveal, projectDelay: b.inLine - b.replay - 20 + 20 })]} />
      </PitchPanel>
      {count > 0 && (
        <div style={{ position: "absolute", left: 90, top: 360, width: 240, textAlign: "center" }}>
          <Lettering size={240} color={AMBER} style={{ textShadow: "0 8px 40px rgba(0,0,0,0.8)" }}>
            {count}
          </Lettering>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center" }}>
        <Stamp text="NOT OUT" at={b.notOut} color={C.cream} size={150} />
      </div>
      <LampBoard
        x={60}
        y={1198}
        w={960}
        h={150}
        delay={b.replay}
        lamps={[[L(b.ask, "maybe"), L(b.reveal + 6, "bad")], [L(b.inLine + 6, "ok")], [L(b.inLine + 26, "ok")]]}
      />
    </SceneShell>
  );
};

/* ================= S9 — OUTRO ================= */
export const s9Beats = (fps: number) => ({ know: sentence(fps, "s9", 0).from, brand: sentence(fps, "s9", 1).from - 8 });

export const S9: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const brand = useAt(b.brand, theme.spring.heavy);
  return (
    <SceneShell push={0} pull={0.04} turnOut={false}>
      <LampBoard x={60} y={300} w={960} h={170} delay={0} lamps={[[L(4, "ok")], [L(10, "ok")], [L(16, "ok")]]} />
      <Panel x={60} y={490} w={960} h={240} delay={b.know} seed={901} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Lettering size={64} color={AMBER}>
            SAVE THIS FOR THE NEXT
          </Lettering>
          <Lettering size={64} color={AMBER}>
            LBW ARGUMENT
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 760, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={300} delay={b.brand} seed={902}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Lettering size={28} font="body" color={C.creamDim} spacing="0.3em">
              CRICKET RULES, MADE SIMPLE
            </Lettering>
            <Lettering size={100} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};

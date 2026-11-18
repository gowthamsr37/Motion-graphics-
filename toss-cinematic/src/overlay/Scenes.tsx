// The 2D layer for each scene: statistics, labels, graphs and the brand. All numbers come from ../data.ts,
// all timing from ../beats.ts (which comes from the narration). Positions stay inside the Reels safe area.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { B } from "../beats";
import { FORMATS, IPL_DECISION, IPL_SEASONS, SIM_SEASONS, SOURCES, TOSS_EFFECT } from "../data";
import { CLAMP, theme } from "../theme";
import { montageCuts, s2Anchors, s2RefAnchor } from "../three/director";
import { E, S, sentence, W } from "../timing";
import { Display, ease, fmt, HBar, Icon, Kicker, Note, Panel, Rise, shadow, useTime, useWin, Wipe } from "./kit";

const C = theme.colors;
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const centered = (y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", ...extra });
const FOOT_Y = 1262;

const Foot: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
  <div style={centered(FOOT_Y)}>
    <Rise a={a} b={b} dy={10}>
      <Note style={{ maxWidth: 880, textAlign: "center", color: C.dim, background: "rgba(4,7,13,0.62)", padding: "8px 18px", borderRadius: 12 }}>{children}</Note>
    </Rise>
  </div>
);

// =========================================================================== S1 — the hook
export const O1: React.FC = () => {
  const t = useTime();
  const b = B.s1;
  const slam = useWin(b.stat, b.statOut, theme.spring.slam, 0.22);
  const rule = ease(t, b.stat + 0.05, b.stat + 0.6);
  return (
    <>
      {slam.vis && (
        <div style={centered(1004, { opacity: Math.min(1, slam.inP * 2) * (1 - slam.outP), transform: `scale(${1.28 - 0.28 * slam.inP})` })}>
          <Kicker color={C.white} size={30} style={{ letterSpacing: "0.32em" }}>
            IPL · TOSS WINNERS WON
          </Kicker>
          <Display size={236} color={C.gold} glow style={{ marginTop: 6 }}>
            51.6%
          </Display>
          <div style={{ width: 520 * rule, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginTop: 4 }} />
          <Note size={28} style={{ marginTop: 12, color: C.white }}>
            of 1,218 decided matches
          </Note>
        </div>
      )}
      <div style={centered(1018)}>
        <Wipe a={b.title} b={E("s1") + 0.05}>
          <Display size={124} style={{ letterSpacing: "0.01em" }}>
            DOES THE TOSS
          </Display>
        </Wipe>
        <Wipe a={b.title} delay={0.12} b={E("s1") + 0.05}>
          <Display size={124} color={C.gold} glow style={{ letterSpacing: "0.01em" }}>
            REALLY MATTER?
          </Display>
        </Wipe>
      </div>
    </>
  );
};

// =========================================================================== S2 — four formats
export const O2: React.FC = () => {
  const t = useTime();
  const s = S("s2");
  const e = E("s2");
  const anchors = s2Anchors(t);
  const ref = s2RefAnchor(t);
  const first = B.s2.rise[0][0];
  // the 50% tag rides the reference line at the right edge of the frame
  const lx = ref.left.x;
  const rx = ref.right.x;
  const tagX = 1000;
  const tagY = Math.abs(rx - lx) < 1 ? ref.left.y : ref.left.y + ((tagX - lx) / (rx - lx)) * (ref.right.y - ref.left.y);
  const out = interpolate(t, [e - 0.25, e], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <div style={abs(64, 248)}>
        <Rise a={s + 0.35} b={e}>
          <Kicker color={C.white} size={26}>
            Toss winner's win rate
          </Kicker>
          <Note size={21} style={{ marginTop: 6 }}>
            Decided matches only · bars start at 0%
          </Note>
        </Rise>
      </div>
      {anchors.map((a, i) => {
        if (a.grow <= 0.001 || !a.front) return null;
        const f = FORMATS[i];
        const size = Math.max(56, Math.min(132, a.ppm * 1.4));
        const edgeFade = interpolate(a.x, [-60, 40, 1040, 1140], [0, 1, 1, 0], CLAMP);
        const p = spring({ frame: Math.round((t - B.s2.rise[i][0]) * 30), fps: 30, config: theme.spring.snappy });
        const done = a.grow > 0.999;
        const hero = f.pct > 50 && i === 0;
        return (
          <div key={f.key} style={{ position: "absolute", left: a.x, top: a.y - 14, transform: `translate(-50%, -100%) translateY(${(1 - p) * 20}px)`, opacity: edgeFade * Math.min(1, p * 2), textAlign: "center", whiteSpace: "nowrap" }}>
            <Kicker color={C.white} size={Math.max(22, size * 0.3)} style={{ letterSpacing: "0.16em", textTransform: "none" }}>
              {f.name}
            </Kicker>
            <Display size={size} color={hero && done ? C.gold : C.white} glow={hero && done} style={{ marginTop: 2 }}>
              {fmt(a.value)}%
            </Display>
            <Note size={Math.max(19, size * 0.2)} style={{ color: C.dim, marginTop: 4 }}>
              n = {f.n.toLocaleString("en-IN")}
            </Note>
          </div>
        );
      })}
      {ref.ref > 0.01 && (
        <div style={{ position: "absolute", left: tagX, top: tagY, transform: "translate(-100%, 22px)", opacity: ref.ref, textAlign: "right", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.ice, textShadow: `0 0 18px ${C.iceGlow}, ${shadow}` }}>50%</div>
          <Kicker size={17} color={C.ice} style={{ letterSpacing: "0.16em" }}>
            coin-flip line
          </Kicker>
        </div>
      )}
      <Foot a={first + 0.4} b={e}>
        Draws, ties &amp; no-results excluded · internationals: men's matches between ICC Full Members
      </Foot>
    </div>
  );
};

// =========================================================================== S3 — you are the captain
const Chip: React.FC<{ a: number; b: number; icon: "moon" | "drop" | "coin"; children: React.ReactNode }> = ({ a, b, icon, children }) => (
  <Rise a={a} b={b} dx={-30} dy={0} style={{ marginBottom: 14 }}>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 22px 12px 16px", borderRadius: 40, background: "rgba(6,10,18,0.62)", border: `1.5px solid ${C.glassEdge}` }}>
      <Icon kind={icon} size={34} color={icon === "coin" ? C.gold : C.white} />
      <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 28, letterSpacing: "0.1em", color: C.white, textTransform: "uppercase" }}>{children}</span>
    </div>
  </Rise>
);

const Choice: React.FC<{ a: number; b: number; label: string; icon: "bat" | "ball"; x: number; pulse: number }> = ({ a, b, label, icon, x, pulse }) => {
  const { inP, outP, vis } = useWin(a, b, theme.spring.bouncy, 0.25);
  if (!vis || inP < 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 720, width: 440, opacity: Math.min(1, inP * 2) * (1 - outP), transform: `translateY(${(1 - inP) * 60}px) scale(${(0.9 + 0.1 * inP) * (1 + pulse * 0.03)})` }}>
      <Panel style={{ padding: "34px 20px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, borderColor: `rgba(246,242,232,${0.16 + pulse * 0.3})` }}>
        <Icon kind={icon} size={64} color={C.white} />
        <Display size={80} style={{ whiteSpace: "nowrap" }}>
          {label}
        </Display>
      </Panel>
    </div>
  );
};

export const O3: React.FC = () => {
  const t = useTime();
  const b = B.s3;
  const s = S("s3");
  const think = Math.max(0, t - b.think);
  const span = b.end - b.think;
  const count = Math.min(3, Math.floor((think / span) * 3) + 1);
  const ring = interpolate(t, [b.think, b.end - 0.1], [0, 1], CLAMP);
  // during the thinking time the two cards breathe alternately
  const pa = t > b.think ? Math.max(0, Math.sin((t - b.think) * 5)) : 0;
  const pb = t > b.think ? Math.max(0, -Math.sin((t - b.think) * 5)) : 0;
  const cd = useWin(b.think, b.end + 0.02, theme.spring.snappy, 0.12);
  return (
    <>
      <div style={abs(64, 252)}>
        <Rise a={s + 0.25} b={b.choose}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 30, border: `1.5px solid ${C.gold}`, background: "rgba(6,10,18,0.5)" }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: C.gold, boxShadow: `0 0 12px ${C.goldGlow}`, opacity: 0.6 + 0.4 * Math.sin(t * 6) }} />
            <Kicker color={C.white} size={24} style={{ letterSpacing: "0.22em" }}>
              Your view · the captain
            </Kicker>
          </div>
        </Rise>
        <div style={{ marginTop: 22 }}>
          <Chip a={b.lights - 0.05} b={b.choose} icon="moon">
            IPL · under lights
          </Chip>
          <Chip a={b.dew} b={b.choose} icon="drop">
            Dew later?
          </Chip>
          <Chip a={b.won} b={b.choose} icon="coin">
            Toss: won
          </Chip>
        </div>
      </div>
      <div style={centered(560)}>
        <Rise a={b.choose} b={b.end + 0.02}>
          <Kicker color={C.white} size={30} style={{ letterSpacing: "0.3em" }}>
            Your call
          </Kicker>
        </Rise>
      </div>
      <Choice a={b.bat} b={b.end + 0.02} label="BAT FIRST" icon="bat" x={70} pulse={pa} />
      <Choice a={b.bowl} b={b.end + 0.02} label="BOWL FIRST" icon="ball" x={570} pulse={pb} />
      {cd.vis && cd.inP > 0.01 && (
        <div style={{ position: "absolute", left: 540 - 72, top: 1056, width: 144, height: 144, opacity: Math.min(1, cd.inP * 2) * (1 - cd.outP) }}>
          <svg width={144} height={144} viewBox="0 0 144 144">
            <circle cx={72} cy={72} r={62} fill="rgba(6,10,18,0.55)" stroke="rgba(246,242,232,0.18)" strokeWidth={6} />
            <circle cx={72} cy={72} r={62} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 62}`} strokeDashoffset={`${2 * Math.PI * 62 * ring}`} transform="rotate(-90 72 72)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Display size={78} key={count} style={{ transform: `scale(${1 + 0.25 * Math.max(0, 1 - ((think / span) * 3 - (count - 1)) * 4)})` }}>
              {4 - count}
            </Display>
          </div>
        </div>
      )}
    </>
  );
};

// =========================================================================== S4 — what captains chose
const Half: React.FC<{ top: number; a: number; b: number; label: string; pct: number; n: number; color: string; dim: number }> = ({ top, a, b, label, pct, n, color, dim }) => {
  const t = useTime();
  const fill = ease(t, a + 0.1, a + 1.1);
  return (
    <div style={{ position: "absolute", left: 70, top, width: 880, opacity: 1 - dim * 0.55 }}>
      <Rise a={a} b={b}>
        <Kicker color={C.white} size={30} style={{ letterSpacing: "0.24em" }}>
          {label}
        </Kicker>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 4 }}>
          <Display size={132} color={color} glow={color === C.gold}>
            {fmt(pct * fill)}%
          </Display>
          <Note size={22} style={{ color: C.dim }}>
            won · n = {n} decided
          </Note>
        </div>
        <div style={{ marginTop: 16 }}>
          <HBar value={pct} max={100} width={880} height={22} color={color} fill={fill} refAt={50} />
        </div>
      </Rise>
    </div>
  );
};

export const O4: React.FC = () => {
  const t = useTime();
  const b = B.s4;
  const s = S("s4");
  const e = E("s4");
  const dim = ease(t, b.doubt, b.doubt + 0.5);
  const stamp = useWin(b.stamp, e, theme.spring.slam, 0.25);
  const neq = ease(t, b.stamp + 0.25, b.stamp + 0.6);
  const why = b.stamp + 0.75;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 958, height: 4, background: `linear-gradient(90deg, transparent, ${C.hair}, transparent)` }} />
      <div style={abs(70, 246)}>
        <Rise a={s + 0.2} b={b.stamp}>
          <Note size={21} style={{ color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            IPL · toss winners who chose to…
          </Note>
        </Rise>
      </div>
      <Half top={292} a={b.bowlBar} b={b.stamp} label={IPL_DECISION.bowl.label} pct={IPL_DECISION.bowl.pct} n={IPL_DECISION.bowl.n} color={C.gold} dim={dim} />
      <Half top={996} a={b.batBar} b={b.stamp} label={IPL_DECISION.bat.label} pct={IPL_DECISION.bat.pct} n={IPL_DECISION.bat.n} color={C.coral} dim={dim} />
      {stamp.vis && stamp.inP > 0.01 && (
        <div style={centered(262, { opacity: Math.min(1, stamp.inP * 2) * (1 - stamp.outP), transform: `scale(${1.2 - 0.2 * stamp.inP}) rotate(${(1 - stamp.inP) * -3}deg)` })}>
          <Panel style={{ padding: "20px 40px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Display size={96} style={{ whiteSpace: "nowrap" }}>
              CORRELATION
            </Display>
            <Display size={96} color={C.gold} glow style={{ transform: `scale(${0.6 + 0.4 * neq})`, opacity: neq, margin: "-4px 0" }}>
              ≠
            </Display>
            <Display size={96} style={{ whiteSpace: "nowrap" }}>
              CAUSATION
            </Display>
          </Panel>
        </div>
      )}
      <Rise a={why} b={e} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 540, top: 632, transform: "translateX(-50%)" }}>
          <Panel style={{ padding: "12px 28px", whiteSpace: "nowrap" }}>
            <Kicker color={C.gold} size={28} style={{ letterSpacing: "0.18em" }}>
              Match conditions
            </Kicker>
          </Panel>
        </div>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" fill={C.white} />
            </marker>
          </defs>
          <path d="M470 700 C 410 730, 350 750, 290 776" stroke={C.white} strokeWidth={3} fill="none" markerEnd="url(#ah)" strokeDasharray={220} strokeDashoffset={220 * (1 - ease(t, why + 0.15, why + 0.6))} />
          <path d="M610 700 C 670 730, 730 750, 790 776" stroke={C.white} strokeWidth={3} fill="none" markerEnd="url(#ah)" strokeDasharray={220} strokeDashoffset={220 * (1 - ease(t, why + 0.3, why + 0.75))} />
        </svg>
        <div style={{ position: "absolute", left: 270, top: 790, transform: "translateX(-50%)", whiteSpace: "nowrap", opacity: ease(t, why + 0.45, why + 0.8) }}>
          <Panel style={{ padding: "10px 22px" }}>
            <Kicker color={C.white} size={25}>
              The captain's choice
            </Kicker>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 810, top: 790, transform: "translateX(-50%)", whiteSpace: "nowrap", opacity: ease(t, why + 0.6, why + 0.95) }}>
          <Panel style={{ padding: "10px 22px" }}>
            <Kicker color={C.white} size={25}>
              The result
            </Kicker>
          </Panel>
        </div>
      </Rise>
      <div style={centered(868)}>
        <Rise a={why + 0.7} b={e}>
          <Note size={25} style={{ color: C.white, maxWidth: 860, background: "rgba(4,7,13,0.6)", padding: "10px 20px", borderRadius: 14 }}>
            Captains choose based on the conditions — and those same conditions also shape the result.
          </Note>
        </Rise>
      </div>
    </>
  );
};

// =========================================================================== S5 — two seasons
const Waffle: React.FC<{ a: number; wins: number; n: number; color: string }> = ({ a, wins, n, color }) => {
  const t = useTime();
  const T = 30;
  const G = 6;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${T}px)`, gap: G }}>
      {Array.from({ length: n }).map((_, i) => {
        const at = a + (i / n) * 1.1;
        const p = interpolate(t, [at, at + 0.18], [0, 1], { easing: theme.ease.out, ...CLAMP });
        const win = i < wins;
        return <div key={i} style={{ width: T, height: T, borderRadius: 6, background: win ? color : "rgba(246,242,232,0.16)", boxShadow: win ? `0 0 10px ${color}55` : "inset 0 0 0 1px rgba(246,242,232,0.18)", opacity: p, transform: `scale(${0.5 + 0.5 * p})` }} />;
      })}
    </div>
  );
};

const Season: React.FC<{ x: number; i: 0 | 1; a: number; v: number; color: string; out: number }> = ({ x, i, a, v, color, out }) => {
  const t = useTime();
  const s = IPL_SEASONS[i];
  const fill = ease(t, v, v + 1.1);
  return (
    <div style={{ position: "absolute", left: x, top: 650, width: 354, opacity: 1 - out }}>
      <Rise a={a} b={Infinity}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <Display size={64} color={C.dim}>
            {s.year}
          </Display>
          <Display size={104} color={color} glow={color === C.gold}>
            {Math.round(s.pct * fill)}%
          </Display>
        </div>
        <div style={{ marginTop: 14 }}>
          <Waffle a={v} wins={s.wins} n={s.n} color={color} />
        </div>
        <div style={{ marginTop: 16 }}>
          <HBar value={s.pct} max={100} width={354} height={12} color={color} fill={fill} refAt={50} />
        </div>
        <Note size={20} style={{ marginTop: 14, color: C.dim, textAlign: "center" }}>
          {s.wins} of {s.n} decided matches
        </Note>
      </Rise>
    </div>
  );
};

export const O5: React.FC = () => {
  const t = useTime();
  const b = B.s5;
  const e = E("s5");
  const out = interpolate(t, [e - 0.25, e], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const simOn = useWin(b.same, b.why, theme.spring.snappy, 0.2);
  const k = Math.min(SIM_SEASONS.length - 1, Math.max(0, Math.floor((t - b.same - 0.35) / 0.28)));
  const simPct = SIM_SEASONS[k];
  const simWins = Math.round((simPct * 70) / 100);
  return (
    <>
      <div style={abs(64, 248, { opacity: 1 - out })}>
        <Rise a={S("s5") + 0.4} b={e}>
          <Kicker color={C.white} size={26}>
            IPL · toss winner's win rate
          </Kicker>
          <Note size={21} style={{ marginTop: 6 }}>
            Same tile size and same scale for both seasons
          </Note>
        </Rise>
      </div>
      <Season x={96} i={0} a={b.y24} v={b.v24} color={C.coral} out={out} />
      <Season x={630} i={1} a={b.y25} v={b.v25} color={C.gold} out={out} />
      {simOn.vis && simOn.inP > 0.01 && (
        <div style={centered(1150, { opacity: Math.min(1, simOn.inP * 2) * (1 - simOn.outP) })}>
          <Note size={19} style={{ color: C.ice, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Simulation · a fair coin, 70 matches, re-run
          </Note>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
            <Display size={52} color={C.ice} style={{ width: 120, textAlign: "right" }}>
              {Math.round(simPct)}%
            </Display>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(35, 16px)", gap: 4 }}>
              {Array.from({ length: 70 }).map((_, i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: 3, background: i < simWins ? C.ice : "rgba(246,242,232,0.16)" }} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={centered(1166, { opacity: 1 - out })}>
        <Wipe a={b.why} b={e + 0.05}>
          <Display size={86} style={{ whiteSpace: "nowrap" }}>
            WHY SUCH A <span style={{ color: C.gold }}>BIG DIFFERENCE?</span>
          </Display>
        </Wipe>
      </div>
    </>
  );
};

// =========================================================================== S6 & S7 — estimated effects
const SCALE = 6; // percentage points across the full bar
const EffectRow: React.FC<{ a: number; label: string; value: number; text: string; color: string; hero?: boolean }> = ({ a, label, value, text, color, hero }) => {
  const t = useTime();
  const fill = ease(t, a + 0.1, a + 1.0);
  const W_ = 560;
  return (
    <Rise a={a} b={Infinity} dy={18} style={{ marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 230, textAlign: "right" }}>
          <Kicker color={hero ? C.white : C.dim} size={24} style={{ letterSpacing: "0.14em" }}>
            {label}
          </Kicker>
        </div>
        <div style={{ position: "relative", width: W_, height: 34 }}>
          <div style={{ position: "absolute", left: 0, top: -8, bottom: -8, width: 3, background: C.ice }} />
          {value > 0 ? (
            <div style={{ position: "absolute", left: 3, top: 4, bottom: 4, width: (value / SCALE) * W_ * fill, borderRadius: 6, background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: hero ? `0 0 26px ${color}66` : "none" }} />
          ) : (
            <div style={{ position: "absolute", left: -6, top: 11, width: 15, height: 15, borderRadius: 8, background: color, opacity: fill }} />
          )}
          <div style={{ position: "absolute", left: (Math.max(value, 0) / SCALE) * W_ * fill + 22, top: -14, whiteSpace: "nowrap" }}>
            <Display size={hero ? 62 : 50} color={hero ? C.gold : C.white} glow={hero}>
              {value > 0 ? `+${fmt(value * fill)}` : text}
              {hero && <span style={{ fontSize: 30, marginLeft: 8, color: C.white }}>POINTS</span>}
            </Display>
          </div>
        </div>
      </div>
    </Rise>
  );
};
const EffectAxis: React.FC = () => (
  <div style={{ display: "flex", marginLeft: 252, width: 560, justifyContent: "space-between", marginTop: 14 }}>
    {[0, 2, 4, 6].map((v) => (
      <Note key={v} size={18} style={{ width: 0, display: "flex", justifyContent: "center", whiteSpace: "nowrap" }}>
        {v === 0 ? "0" : `+${v}`}
      </Note>
    ))}
  </div>
);

export const O6: React.FC = () => {
  const t = useTime();
  const b = B.s6;
  const e = E("s6");
  const night = ease(t, b.lights - 0.2, b.lights + 0.5);
  const sunArc = ease(t, b.lapse[0], b.lapse[1], theme.ease.soft);
  const card = b.reveal - 0.9;
  const head = useWin(b.dayLabel, card, theme.spring.snappy, 0.25);
  return (
    <>
      {head.vis && head.inP > 0.01 && (
        <div style={abs(64, 250, { opacity: Math.min(1, head.inP * 2) * (1 - head.outP), transform: `translateY(${(1 - head.inP) * 26}px)` })}>
          <Kicker size={24} color={C.white} style={{ background: "rgba(4,7,13,0.55)", padding: "6px 14px", borderRadius: 10, display: "inline-block" }}>
            International limited-overs
          </Kicker>
          <div style={{ position: "relative", height: 112, marginTop: 4 }}>
            <Display size={112} style={{ position: "absolute", opacity: 1 - night, whiteSpace: "nowrap" }}>
              DAYTIME
            </Display>
            <Display size={112} color={C.gold} glow style={{ position: "absolute", opacity: night, whiteSpace: "nowrap" }}>
              DAY-NIGHT
            </Display>
          </div>
          {/* the sun crossing the sky becomes the moon */}
          <svg width={420} height={96} viewBox="0 0 420 96" style={{ marginTop: 16, overflow: "visible" }}>
            <path d="M10 86 A 200 200 0 0 1 410 86" fill="none" stroke={C.hair} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
            {(() => {
              const a = Math.PI * (0.92 - 0.84 * sunArc);
              const x = 210 + Math.cos(a) * 200;
              const y = 86 - Math.sin(a) * 76;
              return (
                <g transform={`translate(${x - 17} ${y - 17})`}>
                  <g opacity={1 - night}>
                    <Icon kind="sun" size={34} color={C.gold} />
                  </g>
                  <g opacity={night}>
                    <Icon kind="moon" size={34} color={C.ice} />
                  </g>
                </g>
              );
            })()}
          </svg>
        </div>
      )}
      <div style={abs(54, 262)}>
        <Rise a={card} b={e}>
          <Panel style={{ padding: "26px 34px 26px 20px", width: 930, boxSizing: "border-box" }}>
            <div style={{ marginLeft: 14 }}>
              <Kicker color={C.white} size={26} style={{ letterSpacing: "0.2em" }}>
                Estimated toss effect
              </Kicker>
              <Note size={20} style={{ marginTop: 4 }}>
                Change in win probability · percentage points · international limited-overs
              </Note>
            </div>
            <EffectRow a={card + 0.2} label={TOSS_EFFECT.day.label} value={TOSS_EFFECT.day.value} text={TOSS_EFFECT.day.text} color={C.dim} />
            <EffectRow a={b.reveal} label={TOSS_EFFECT.dayNight.label} value={TOSS_EFFECT.dayNight.value} text={TOSS_EFFECT.dayNight.text} color={C.gold} hero />
            <EffectAxis />
          </Panel>
        </Rise>
      </div>
      <Foot a={card + 0.3} b={e}>
        {SOURCES.paper} · dew shown as one possible factor, not a measured cause
      </Foot>
    </>
  );
};

const DAYS = [
  { day: 1, label: "Fresh pitch" },
  { day: 3, label: "Surface wear · footmarks" },
  { day: 5, label: "Cracks · variable bounce" },
];
export const O7: React.FC = () => {
  const t = useTime();
  const b = B.s7;
  const s = S("s7");
  const e = E("s7");
  const cardOut = b.over + 0.35;
  const cur = t >= b.day5 ? 2 : t >= b.day3 ? 1 : 0;
  const tracker = useWin(b.over + 0.25, e, theme.spring.snappy, 0.25);
  const prog = ease(t, b.over + 0.4, b.over + 1.0) * 0 + (cur === 0 ? 0 : cur === 1 ? ease(t, b.day3, b.day3 + 0.6) * 0.5 : 0.5 + ease(t, b.day5, b.day5 + 0.6) * 0.5);
  return (
    <>
      <div style={abs(54, 262)}>
        <Rise a={s + 0.25} b={cardOut}>
          <Panel style={{ padding: "26px 34px 26px 20px", width: 930, boxSizing: "border-box" }}>
            <div style={{ marginLeft: 14 }}>
              <Kicker color={C.white} size={26} style={{ letterSpacing: "0.2em" }}>
                Estimated toss effect
              </Kicker>
              <Note size={20} style={{ marginTop: 4 }}>
                Change in win probability · percentage points
              </Note>
            </div>
            <EffectRow a={s + 0.35} label={TOSS_EFFECT.day.label} value={TOSS_EFFECT.day.value} text={TOSS_EFFECT.day.text} color={C.dim} />
            <EffectRow a={s + 0.5} label={TOSS_EFFECT.dayNight.label} value={TOSS_EFFECT.dayNight.value} text={TOSS_EFFECT.dayNight.text} color={C.dim} />
            <EffectRow a={b.reveal} label="TESTS" value={TOSS_EFFECT.tests.value} text={TOSS_EFFECT.tests.text} color={C.gold} hero />
            <EffectAxis />
          </Panel>
        </Rise>
      </div>
      <div style={abs(54, 262 + 400)}>
        <Wipe a={b.reveal + 0.35} b={cardOut}>
          <Display size={84} style={{ marginLeft: 20, whiteSpace: "nowrap" }}>
            TEST CRICKET: <span style={{ color: C.gold }}>+4.9 POINTS</span>
          </Display>
        </Wipe>
      </div>
      {tracker.vis && tracker.inP > 0.01 && (
        <div style={abs(54, 252, { width: 900, padding: "22px 26px 18px", borderRadius: 26, background: "linear-gradient(180deg, rgba(10,17,28,0.8), rgba(6,10,18,0.66))", border: `1.5px solid ${C.glassEdge}`, opacity: Math.min(1, tracker.inP * 2) * (1 - tracker.outP), transform: `translateY(${(1 - tracker.inP) * 24}px)` })}>
          <Kicker size={22} color={C.dim}>
            Five days of one Test pitch
          </Kicker>
          <div style={{ position: "relative", height: 70, marginTop: 18, width: 820 }}>
            <div style={{ position: "absolute", left: 20, right: 20, top: 33, height: 4, background: C.hair, borderRadius: 2 }} />
            <div style={{ position: "absolute", left: 20, top: 33, height: 4, width: 780 * prog, background: C.gold, borderRadius: 2, boxShadow: `0 0 12px ${C.goldGlow}` }} />
            {[1, 2, 3, 4, 5].map((d, i) => {
              const reached = (d === 1) || (d <= 3 && cur >= 1 && prog >= (d - 1) / 4 - 0.001) || (cur >= 2 && prog >= (d - 1) / 4 - 0.001);
              return (
                <div key={d} style={{ position: "absolute", left: 20 + (i / 4) * 780 - 26, top: 9, width: 52, height: 52, borderRadius: 26, background: reached ? C.gold : "rgba(6,10,18,0.8)", border: `2px solid ${reached ? C.gold : C.hair}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: reached ? C.night : C.dim }}>{d}</span>
                </div>
              );
            })}
          </div>
          <div style={{ position: "relative", height: 138, marginTop: 16 }}>
            {DAYS.map((d, i) => {
              const on = i === cur ? 1 : 0;
              const at = i === 0 ? b.over + 0.25 : i === 1 ? b.day3 : b.day5;
              const p = ease(t, at, at + 0.45);
              return (
                <div key={d.day} style={{ position: "absolute", left: 0, top: 0, opacity: on * p, transform: `translateY(${(1 - p) * 20}px)` }}>
                  <Display size={96} style={{ whiteSpace: "nowrap" }}>
                    DAY {d.day}
                  </Display>
                  <Kicker color={C.white} size={28} style={{ marginTop: 6 }}>
                    {d.label}
                  </Kicker>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Foot a={b.over + 0.5} b={e}>
        Representative illustration of how a Test pitch can wear — not a claim about every venue
      </Foot>
      <Foot a={s + 0.4} b={b.over + 0.4}>
        {SOURCES.paper}
      </Foot>
    </>
  );
};

// =========================================================================== S8 — the lesson
const TAGS = ["Pitch inspection", "The toss", "Hot, dry ground", "Sunset", "Dew on the grass", "A worn Test pitch", "Talking strategy"];
const Node: React.FC<{ a: number; y: number; label: string; hi: number; children?: React.ReactNode; w?: number }> = ({ a, y, label, hi, children, w = 560 }) => {
  const { inP, vis } = useWin(a, Infinity, theme.spring.snappy);
  if (!vis || inP < 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 540 - w / 2, top: y, width: w, opacity: Math.min(1, inP * 2), transform: `translateY(${(1 - inP) * 24}px) scale(${0.94 + 0.06 * inP})` }}>
      <Panel style={{ padding: "18px 24px", textAlign: "center", borderColor: hi > 0.01 ? `rgba(246,188,69,${0.3 + 0.6 * hi})` : C.glassEdge, boxShadow: hi > 0.01 ? `0 0 ${40 * hi}px rgba(246,188,69,${0.35 * hi}), 0 24px 60px rgba(0,0,0,0.45)` : undefined }}>
        <Display size={58} color={hi > 0.5 ? C.gold : C.white} style={{ whiteSpace: "nowrap" }}>
          {label}
        </Display>
        {children}
      </Panel>
    </div>
  );
};
const Arrow: React.FC<{ a: number; y0: number; y1: number }> = ({ a, y0, y1 }) => {
  const t = useTime();
  const p = ease(t, a, a + 0.3);
  if (p <= 0) return null;
  return (
    <svg style={{ position: "absolute", left: 520, top: y0, overflow: "visible" }} width={40} height={y1 - y0}>
      <line x1={20} y1={0} x2={20} y2={(y1 - y0 - 12) * p} stroke={C.white} strokeWidth={3} />
      {p > 0.95 && <path d={`M10 ${y1 - y0 - 14} L20 ${y1 - y0} L30 ${y1 - y0 - 14}`} fill="none" stroke={C.white} strokeWidth={3} strokeLinejoin="round" />}
    </svg>
  );
};

export const O8: React.FC = () => {
  const t = useTime();
  const b = B.s8;
  const e = E("s8");
  const cuts = montageCuts;
  const shot = cuts.findIndex((c, i) => t >= c && t < (cuts[i + 1] ?? -1));
  const d0 = b.nodes[0];
  const fb = ease(t, b.feedback, b.feedback + 0.6);
  const chips: [string, number][] = [
    ["PITCH", W("s8", "pitch")],
    ["WEATHER", W("s8", "weather")],
    ["FORMAT", W("s8", "format")],
  ];
  const outHi = ease(t, b.nodes[3], b.nodes[3] + 0.4);
  return (
    <>
      {shot >= 0 && shot < 7 && (
        <div style={abs(64, 254)} key={shot}>
          <Rise a={cuts[shot]} b={cuts[shot + 1]} dx={-24} dy={0} cfg={theme.spring.slam}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Display size={40} color={C.gold}>
                {String(shot + 1).padStart(2, "0")}
              </Display>
              <div style={{ width: 2, height: 30, background: C.hair }} />
              <Kicker color={C.white} size={26}>
                {TAGS[shot]}
              </Kicker>
            </div>
          </Rise>
        </div>
      )}
      <Node a={d0} y={300} label="TOSS" hi={0} />
      <Arrow a={d0 + 0.15} y0={402} y1={470} />
      <Node a={d0 + 0.25} y={474} label="CHOICE" hi={fb} />
      <Arrow a={d0 + 0.4} y0={576} y1={644} />
      <Node a={d0 + 0.5} y={648} label="MATCH CONDITIONS" hi={0} w={700}>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 12, minHeight: 46 }}>
          {chips.map(([c, at]) => {
            const p = ease(t, at - 0.05, at + 0.3);
            return (
              <div key={c} style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)`, padding: "8px 18px", borderRadius: 24, border: `1.5px solid ${C.glassEdge}`, background: "rgba(246,242,232,0.06)" }}>
                <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 22, letterSpacing: "0.14em", color: C.white }}>{c}</span>
              </div>
            );
          })}
        </div>
      </Node>
      <Arrow a={d0 + 0.65} y0={818} y1={886} />
      <Node a={d0 + 0.75} y={890} label="OUTCOME" hi={outHi} />
      {/* conditions also shape the choice */}
      {fb > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1080} height={1920}>
          <path d="M190 740 C 90 720, 90 560, 250 528" fill="none" stroke={C.gold} strokeWidth={3.5} strokeDasharray={400} strokeDashoffset={400 * (1 - fb)} />
          {fb > 0.95 && <path d="M232 512 L252 528 L228 540" fill="none" stroke={C.gold} strokeWidth={3.5} strokeLinejoin="round" />}
        </svg>
      )}
      <div style={abs(60, 1012, { width: 300 })}>
        <Rise a={b.feedback + 0.3} b={e}>
          <Note size={21} style={{ color: C.gold }}>
            Conditions also shape the captain's choice
          </Note>
        </Rise>
      </div>
      <Foot a={d0 + 0.8} b={e}>
        The toss only decides who chooses — conditions influence both the choice and the outcome
      </Foot>
    </>
  );
};

// =========================================================================== S9 — the verdict
export const O9: React.FC = () => {
  const t = useTime();
  const b = B.s9;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lock = spring({ frame: frame - Math.round(b.lockup * fps), fps, config: theme.spring.heavy });
  const lockOut = interpolate(t, [b.retoss, b.retoss + 0.3], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const sweep = interpolate(t, [b.lockup + 0.3, b.lockup + 1.4], [-0.3, 1.3], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <>
      <div style={centered(1000)}>
        <Rise a={b.values} b={b.valuesOut}>
          <Panel style={{ padding: "16px 34px", display: "grid", gridTemplateColumns: "repeat(4, auto)", columnGap: 36, rowGap: 0, alignItems: "baseline" }}>
            {FORMATS.map((f, i) => (
              <Rise key={f.key} a={b.values} delay={i * 0.07} dy={14}>
                <div style={{ textAlign: "center" }}>
                  <Kicker size={22} color={C.dim} style={{ letterSpacing: "0.14em", textTransform: "none" }}>
                    {f.name}
                  </Kicker>
                  <Display size={64}>{fmt(f.pct)}%</Display>
                </div>
              </Rise>
            ))}
          </Panel>
          <Note size={19} style={{ marginTop: 12 }}>
            Toss winner's win rate · decided matches
          </Note>
        </Rise>
      </div>
      <div style={centered(1000)}>
        <Wipe a={b.line1} b={b.linesOut}>
          <Display size={84} style={{ whiteSpace: "nowrap" }}>
            THE TOSS DOESN'T
          </Display>
        </Wipe>
        <Wipe a={b.line1} delay={0.1} b={b.linesOut}>
          <Display size={84} style={{ whiteSpace: "nowrap" }}>
            GUARANTEE VICTORY.
          </Display>
        </Wipe>
        <Wipe a={b.line2} b={b.linesOut} style={{ marginTop: 16 }}>
          <Display size={84} color={C.gold} glow style={{ whiteSpace: "nowrap" }}>
            CONDITIONS CHANGE
          </Display>
        </Wipe>
        <Wipe a={b.line2} delay={0.1} b={b.linesOut}>
          <Display size={84} color={C.gold} glow style={{ whiteSpace: "nowrap" }}>
            EVERYTHING.
          </Display>
        </Wipe>
      </div>
      {t >= b.lockup && lockOut < 1 && (
        <div style={centered(560, { opacity: Math.min(1, lock * 1.6) * (1 - lockOut), transform: `translateY(${(1 - lock) * 40}px)` })}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 120 * lock, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
            <Kicker color={C.white} size={34} style={{ letterSpacing: "0.5em", marginRight: "-0.5em" }}>
              Beyond the
            </Kicker>
            <div style={{ width: 120 * lock, height: 2, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
          </div>
          <div style={{ position: "relative", marginTop: 10 }}>
            <Display size={150} style={{ letterSpacing: "0.02em" }}>
              SCOREBOARD
            </Display>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${sweep * 100 - 12}%, rgba(255,240,200,0.55) ${sweep * 100}%, transparent ${sweep * 100 + 12}%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
          </div>
          <div style={{ width: 420 * lock, height: 3, marginTop: 14, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
        </div>
      )}
    </>
  );
};

void sentence;

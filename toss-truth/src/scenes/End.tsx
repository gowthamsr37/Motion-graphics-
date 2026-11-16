// Scenes 7–9: the Test exception, the IPL decision, the verdict.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Coin } from "../components/Coin";
import { Arrow, Ball } from "../components/Icons";
import { At, Scene } from "../components/Scene";
import { Card, count, Display, Label, Rise, Slam, Words } from "../components/Type";
import { DATA } from "../data";
import { CLAMP, theme } from "../theme";
import { tok } from "../timing";

const C = theme.colors;

/* ============ 7. TESTS ============ */
export const testsBeats = (fps: number) => ({
  one: tok(fps, "tests", "one"),
  edge: tok(fps, "tests", "edge"),
  inT: tok(fps, "tests", "tests"),
  bat: tok(fps, "tests", "bat", 0),
  v57: tok(fps, "tests", "57"),
  because: tok(fps, "tests", "because"),
  day5: tok(fps, "tests", "day-5"),
});

// crack paths on the pitch, revealed day by day
const CRACKS = [
  "M210 60 L232 110 L220 150 L246 205 L238 250",
  "M300 40 L290 92 L312 130 L300 180",
  "M150 160 L196 178 L214 230 L262 248",
  "M360 120 L336 170 L352 220 L330 270 L344 320",
  "M260 300 L232 336 L250 380",
  "M120 250 L170 270 L160 320 L200 352",
  "M390 240 L420 290 L404 340",
  "M200 40 L250 70 L300 60",
];

export const Tests: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = testsBeats(fps);
  const dayStep = (b.day5 - b.because) / 4;
  const day = frame < b.because ? 0 : Math.min(5, 1 + Math.floor((frame - b.because) / dayStep));
  const crackU = interpolate(frame, [b.because, b.day5 + 8], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const ballX = interpolate(spring({ frame: frame - b.inT, fps, config: theme.spring.smooth }), [0, 1], [-300, 0]);
  return (
    <Scene shakes={[b.one, b.day5]}>
      {/* A — one real edge */}
      {frame < b.inT + 2 && (
        <At y={560}>
          <Rise at={1} out={b.inT - 6} dist={20}>
            <Label size={32} color={C.ink}>But there is</Label>
          </Rise>
          <Slam at={b.one} out={b.inT - 6} style={{ marginTop: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Display size={190} color={C.mint} glow={C.mintGlow}>ONE REAL</Display>
              <Display size={190} color={C.mint} glow={C.mintGlow}>EDGE</Display>
            </div>
          </Slam>
        </At>
      )}
      {/* B — Tests: bat first */}
      {frame >= b.inT - 2 && (
        <>
          <At y={270}>
            <Rise at={b.inT}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ transform: `translateX(${ballX}px)` }}>
                  <Ball size={96} spin={ballX * 1.2 + frame * 0.6} />
                </div>
                <Display size={140}>TESTS</Display>
              </div>
            </Rise>
          </At>
          <div style={{ position: "absolute", left: 60, top: 470, width: 960, display: "flex", gap: 28 }}>
            {[
              { at: b.bat, cnt: b.v57, what: "Batted first", v: DATA.tests.bat, hero: true },
              { at: b.bat + 10, cnt: b.v57 + 12, what: "Bowled first", v: DATA.tests.bowl, hero: false },
            ].map((c, i) => {
              const v = count(frame, c.cnt, c.cnt + 22, c.v, 40);
              const done = frame >= c.cnt + 22;
              return (
                <Rise key={i} at={c.at} style={{ flex: 1 }}>
                  <Card style={{ height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }} edge={c.hero && done ? C.mint : undefined} glow={c.hero && done ? C.mintGlow : undefined}>
                    <Label size={22}>Won the toss &</Label>
                    <Label size={30} color={C.ink}>{c.what}</Label>
                    <div style={{ height: 8 }} />
                    <Display size={128} color={frame < c.cnt ? C.inkSoft : c.hero ? C.mint : C.ink} glow={c.hero && done ? C.mintGlow : undefined}>
                      {frame < c.cnt ? "—" : `${v.toFixed(1)}%`}
                    </Display>
                    <Label size={17} color={C.inkSoft} spacing="0.12em">of decided Tests</Label>
                  </Card>
                </Rise>
              );
            })}
          </div>
        </>
      )}
      {/* C — the day-5 pitch */}
      {frame >= b.because - 2 && (
        <Rise at={b.because} style={{ position: "absolute", left: 60, top: 920, width: 960, height: 380 }}>
          <svg width="960" height="380" viewBox="0 0 960 380" style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="pitchg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.pitchDark} />
                <stop offset="100%" stopColor={C.pitch} />
              </linearGradient>
            </defs>
            <polygon points="300,10 660,10 800,370 160,370" fill="url(#pitchg)" opacity="0.92" />
            <line x1="282" y1="56" x2="678" y2="56" stroke="#F4F1EA" strokeWidth="4" opacity="0.8" />
            <line x1="190" y1="300" x2="770" y2="300" stroke="#F4F1EA" strokeWidth="5" opacity="0.8" />
            <g transform="translate(250 0)">
              {CRACKS.map((d, i) => {
                const local = interpolate(crackU, [i / CRACKS.length, Math.min(1, i / CRACKS.length + 0.35)], [0, 1], CLAMP);
                return <path key={i} d={d} fill="none" stroke="#3B2A16" strokeWidth={3 + (i % 3)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - local} />;
              })}
            </g>
          </svg>
          <div style={{ position: "absolute", right: 0, top: 30, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Label size={20}>Pitch</Label>
            <Display size={84} color={day >= 5 ? C.red : C.ink}>DAY {Math.max(1, day)}</Display>
          </div>
          <div style={{ position: "absolute", left: 0, top: 30, display: "flex", flexDirection: "column", opacity: interpolate(frame, [b.day5 - 4, b.day5 + 6], [0, 1], CLAMP) }}>
            <Label size={20}>Batting last</Label>
            <Display size={60} color={C.ink}>ON THIS</Display>
          </div>
        </Rise>
      )}
    </Scene>
  );
};

/* ============ 8. IPL ============ */
export const iplBeats = (fps: number) => ({
  ipl: tok(fps, "ipl", "ipl"),
  bowl: tok(fps, "ipl", "bowl"),
  v55: tok(fps, "ipl", "55"),
  batting: tok(fps, "ipl", "batting"),
  v45: tok(fps, "ipl", "45"),
});

const Ring: React.FC<{ pct: number; color: string; glow?: string; size: number }> = ({ pct, color, glow, size }) => {
  const r = size / 2 - 22;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)", filter: glow ? `drop-shadow(0 0 18px ${glow})` : undefined }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.inkFaint} strokeWidth="30" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="30" strokeLinecap="round" strokeDasharray={`${(circ * pct) / 100} ${circ}`} />
    </svg>
  );
};

export const Ipl: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = iplBeats(fps);
  const S = 420;
  const rings = [
    { at: b.bowl - 6, fill: b.v55 - 8, label: "Bowled first", v: DATA.ipl.bowl, color: C.gold, glow: C.goldGlow },
    { at: b.bowl + 4, fill: b.v45 - 8, label: "Batted first", v: DATA.ipl.bat, color: "rgba(244,241,234,0.7)", glow: undefined },
  ];
  return (
    <Scene>
      <At y={262}>
        <Slam at={b.ipl}>
          <Display size={170}>IPL</Display>
        </Slam>
      </At>
      <At y={462}>
        <Rise at={b.ipl + 8} dist={20}>
          <Label size={26} color={C.ink}>Toss winners who…</Label>
        </Rise>
      </At>
      <div style={{ position: "absolute", left: 60, top: 540, width: 960, display: "flex", justifyContent: "space-between" }}>
        {rings.map((r, i) => {
          const pct = count(frame, r.fill, r.fill + 26, r.v);
          const live = frame >= r.fill;
          return (
            <Rise key={i} at={r.at} style={{ width: S }}>
              <div style={{ position: "relative", width: S, height: S }}>
                <Ring pct={live ? pct : 0} color={r.color} glow={live && i === 0 ? r.glow : undefined} size={S} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Display size={110} color={!live ? C.inkSoft : i === 0 ? C.gold : C.ink}>{live ? `${pct.toFixed(1)}%` : "—"}</Display>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 22 }}>
                <Label size={30} color={C.ink}>{r.label}</Label>
                <div>
                  <Label size={18} color={C.inkSoft}>won the match</Label>
                </div>
              </div>
            </Rise>
          );
        })}
      </div>
      <At y={1170}>
        <Rise at={b.v45 + 10} dist={16}>
          <Label size={20} color={C.inkSoft}>1,218 decided IPL games · 2008–2026</Label>
        </Rise>
      </At>
    </Scene>
  );
};

/* ============ 9. VERDICT ============ */
export const verdictBeats = (fps: number) => ({
  so: tok(fps, "verdict", "so"),
  no: tok(fps, "verdict", "no"),
  but: tok(fps, "verdict", "but"),
  call: tok(fps, "verdict", "call", 0),
  whats: tok(fps, "verdict", "what's"),
  worst: tok(fps, "verdict", "worst"),
  seen: tok(fps, "verdict", "seen"),
  tell: tok(fps, "verdict", "tell"),
  comments: tok(fps, "verdict", "comments"),
});

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = verdictBeats(fps);
  const stampP = spring({ frame: frame - b.no, fps, config: theme.spring.slam });
  const shrink = spring({ frame: frame - b.but, fps, config: theme.spring.smooth });
  const stampOut = interpolate(frame, [b.whats - 8, b.whats], [1, 0], { easing: theme.ease.in, ...CLAMP });
  const spinF = frame * 0.42;
  const bob = Math.sin(frame / 5) * 14;
  return (
    <Scene shakes={[b.no]} noExit>
      {/* A — the question, coin still in the air */}
      {frame < b.no + 2 && (
        <>
          <div style={{ position: "absolute", left: 540 - 110, top: 300 + Math.sin(frame / 8) * 16, opacity: interpolate(frame, [b.no - 6, b.no], [1, 0], CLAMP) }}>
            <Coin size={220} flip={spinF} glow={0.4} blur={1.2} />
          </div>
          <At y={640}>
            <Words text="DOES WINNING THE TOSS WIN MATCHES?" at={b.so + 6} size={124} per={3} out={b.no - 6} />
          </At>
        </>
      )}
      {/* B — the stamp */}
      {frame >= b.no && frame < b.whats + 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(shrink, [0, 1], [430, 300]), display: "flex", justifyContent: "center", opacity: stampOut }}>
          <div style={{ transform: `rotate(-7deg) scale(${interpolate(stampP, [0, 1], [2.3, 1]) * interpolate(shrink, [0, 1], [1, 0.62])})`, opacity: interpolate(frame, [b.no, b.no + 3], [0, 1], CLAMP), border: `12px solid ${C.red}`, borderRadius: 26, padding: "10px 46px 18px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: `0 0 70px ${C.redGlow}, inset 0 0 40px ${C.redGlow}`, background: "rgba(255,74,92,0.06)", transformOrigin: "50% 0%" }}>
            <Display size={250} color={C.red}>MYTH</Display>
            <Display size={92} color={C.red} style={{ letterSpacing: "0.22em", marginTop: -8 }}>BUSTED</Display>
          </div>
        </div>
      )}
      {frame >= b.but && frame < b.whats + 1 && (
        <>
          <At y={860}>
            <Words text="IT'S NOT THE COIN." at={b.but} size={104} per={3} out={b.whats - 8} />
          </At>
          <At y={990}>
            <Slam at={b.call} out={b.whats - 8}>
              <Display size={150} color={C.mint} glow={C.mintGlow}>IT'S THE CALL.</Display>
            </Slam>
          </At>
        </>
      )}
      {/* C — call to action */}
      {frame >= b.whats - 1 && (
        <>
          <At y={430}>
            <Words text="WHAT'S THE WORST" at={b.whats} size={130} per={3} />
          </At>
          <At y={570}>
            <Words text="TOSS CALL YOU'VE" at={b.worst + 4} size={130} per={3} accent={{ CALL: C.gold }} />
          </At>
          <At y={710}>
            <Words text="EVER SEEN?" at={b.seen - 4} size={130} per={3} />
          </At>
          <At y={930}>
            <Rise at={b.tell - 2}>
              <div style={{ padding: "22px 48px", borderRadius: 999, background: C.gold, boxShadow: `0 0 60px ${C.goldGlow}`, transform: `scale(${1 + 0.025 * Math.sin(frame / 7)})` }}>
                <span style={{ fontFamily: theme.fonts.body, fontWeight: 900, fontSize: 46, letterSpacing: "0.06em", color: C.sky }}>TELL ME IN THE COMMENTS</span>
              </div>
            </Rise>
          </At>
          <At y={1066}>
            <Rise at={b.comments}>
              <div style={{ transform: `translateY(${bob}px)` }}>
                <Arrow size={84} />
              </div>
            </Rise>
          </At>
          <At y={1236}>
            <Rise at={b.comments + 18} dist={12}>
              <Label size={16} color={C.inkSoft} spacing="0.1em">Data: Cricsheet.org · men's Tests, ODIs, T20Is & IPL, 2002–2026 · decided matches only</Label>
            </Rise>
          </At>
        </>
      )}
    </Scene>
  );
};

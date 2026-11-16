// Scenes 1–3: the hook, the evidence, the answer.
import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Coin } from "../components/Coin";
import { Check, Cross } from "../components/Icons";
import { At, Scene } from "../components/Scene";
import { Card, count, Display, Label, Rise, Slam, Words } from "../components/Type";
import { DATA } from "../data";
import { CLAMP, theme } from "../theme";
import { tok } from "../timing";

const C = theme.colors;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/* ============ 1. HOOK ============ */
export const hookBeats = (fps: number) => {
  const w2 = tok(fps, "hook", "win", 1);
  return { w1: tok(fps, "hook", "win", 0), w2, land: w2 - 1, capt: tok(fps, "hook", "captains"), data: tok(fps, "hook", "data") };
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = hookBeats(fps);
  // the toss: thrown up from below the frame, five turns, lands heads-up
  const u = interpolate(frame, [0, b.land], [0, 1], CLAMP);
  const H = 700;
  const cy = frame < b.land ? 1500 - 1070 * u - H * 4 * u * (1 - u) : 430;
  const t = frame - b.land;
  const settle = t >= 0 ? Math.exp(-t / 6) : 0;
  const flip = frame < b.land ? theme.ease.out(u) * Math.PI * 10 : 0.5 * settle * Math.sin(t * 1.3);
  const bounce = t >= 0 ? -Math.abs(Math.sin(t * 0.45)) * 40 * Math.exp(-t / 5) : 0;
  const glow = t >= 0 ? 0.55 + 0.25 * Math.sin(frame / 9) : 0;
  const idle = t > 20 ? Math.sin(frame / 22) * 6 : 0;
  const size = 270;
  return (
    <Scene shakes={[b.w2]} noEnter>
      {/* shadow under the landing spot */}
      <div style={{ position: "absolute", left: 540 - 120, top: 430 + size / 2 + 26, width: 240, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.5)", filter: "blur(12px)", opacity: t >= 0 ? 0.8 : interpolate(u, [0.6, 1], [0, 0.6], CLAMP) }} />
      <div style={{ position: "absolute", left: 540 - size / 2, top: cy - size / 2 + bounce + idle }}>
        <Coin size={size} flip={flip} glow={glow} blur={frame < b.land ? 1.5 + 2.5 * (1 - u) : 0} />
      </div>
      <At y={660}>
        <Slam at={b.w1}>
          <Display size={150}>WIN THE TOSS</Display>
        </Slam>
      </At>
      <At y={830}>
        <Slam at={b.w2}>
          <Display size={150}>
            WIN THE MATCH<span style={{ color: C.red }}>?</span>
          </Display>
        </Slam>
      </At>
      <div style={{ position: "absolute", left: 60, top: 1060, width: 960, display: "flex", gap: 24 }}>
        {[
          { at: b.capt, who: "CAPTAINS", what: "BELIEVE IT", icon: (d: number) => <Check size={54} draw={d} /> },
          { at: b.data, who: "THE DATA", what: "DOESN'T", icon: (d: number) => <Cross size={54} draw={d} /> },
        ].map((c, i) => {
          const d = interpolate(frame, [c.at + 4, c.at + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
          return (
            <Rise key={i} at={c.at} style={{ flex: 1 }}>
              <Card style={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }} edge={i === 1 && d > 0.5 ? C.red : undefined}>
                <Label size={26}>{c.who}</Label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {c.icon(d)}
                  <Display size={72}>{c.what}</Display>
                </div>
              </Card>
            </Rise>
          );
        })}
      </div>
    </Scene>
  );
};

/* ============ 2. THE EVIDENCE ============ */
export const proofBeats = (fps: number) => {
  const n = tok(fps, "proof", "8,408");
  return { n, done: n + 46, mens: tok(fps, "proof", "men's"), matches: tok(fps, "proof", "matches") };
};

// fixed-width digits so the counter never jitters
const Digits: React.FC<{ text: string; size: number; color: string; glow?: string }> = ({ text, size, color, glow }) => (
  <div style={{ display: "flex" }}>
    {text.split("").map((ch, i) => (
      <span key={i} style={{ display: "inline-block", width: /[0-9]/.test(ch) ? size * 0.5 : size * 0.22, textAlign: "center" }}>
        <Display size={size} color={color} glow={glow}>
          {ch}
        </Display>
      </span>
    ))}
  </div>
);

export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = proofBeats(fps);
  const v = count(frame, b.n - 2, b.done, DATA.total);
  const lit = Math.round(v / 10);
  const done = frame >= b.done;
  const COLS = 42;
  const ROWS = 20;
  return (
    <Scene>
      <At y={290}>
        <Rise at={2}>
          <Label size={30}>WE CHECKED</Label>
        </Rise>
      </At>
      <At y={340}>
        <Rise at={b.n - 4} dist={30}>
          <div style={{ transform: `scale(${done ? 1 + 0.012 * Math.sin(frame / 14) : 1})` }}>
            <Digits text={fmt(v)} size={280} color={done ? C.gold : C.ink} glow={done ? C.goldGlow : undefined} />
          </div>
        </Rise>
      </At>
      <At y={640}>
        <Words text="MEN'S MATCHES" at={b.mens} size={100} per={5} />
      </At>
      <div style={{ position: "absolute", left: 120, right: 120, top: 768, display: "flex", justifyContent: "flex-end", opacity: interpolate(frame, [b.n, b.n + 10], [0, 1], CLAMP) }}>
        <Label size={18} color={C.inkSoft}>1 dot = 10 matches</Label>
      </div>
      <div style={{ position: "absolute", left: 120, top: 806, width: COLS * 20, display: "grid", gridTemplateColumns: `repeat(${COLS}, 20px)`, gridAutoRows: "20px" }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const on = i < lit;
          const fresh = on && i > lit - 30 && !done;
          return <div key={i} style={{ width: 13, height: 13, borderRadius: 4, background: on ? (fresh ? C.goldHi : "rgba(244,241,234,0.78)") : C.inkFaint, transform: `scale(${fresh ? 1.25 : 1})` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1240, width: 960, display: "flex", gap: 14, justifyContent: "center" }}>
        {DATA.formats.map((f, i) => (
          <Rise key={f.k} at={b.mens + 6 + i * 5} dist={30}>
            <Card style={{ width: 218, height: 96, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <Label size={18}>{f.k}</Label>
              <Display size={44}>{fmt(f.n)}</Display>
            </Card>
          </Rise>
        ))}
      </div>
    </Scene>
  );
};

/* ============ 3. THE ANSWER ============ */
export const answerBeats = (fps: number) => ({
  tw: tok(fps, "answer", "toss"),
  won: tok(fps, "answer", "won"),
  pct: tok(fps, "answer", "50.9"),
  thats: tok(fps, "answer", "that's"),
  coin: tok(fps, "answer", "coin"),
});

export const Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = answerBeats(fps);
  const revealed = frame >= b.pct;
  // the split wobbles while we wait, then snaps to the real number
  const settle = spring({ frame: frame - b.pct, fps, config: theme.spring.bouncy });
  const wobble = frame < b.won ? 0 : 13 * Math.sin((frame - b.won) / 2.6) * interpolate(frame, [b.won, b.pct], [0.6, 1], CLAMP);
  const split = revealed ? interpolate(settle, [0, 1], [50 + wobble, DATA.overall.pct]) : 50 + wobble;
  const slot = `${10 + Math.floor(random(`d${Math.floor(frame / 2)}`) * 89)}.${Math.floor(random(`e${Math.floor(frame / 2)}`) * 10)}%`;
  const cf = Math.max(0, frame - b.coin);
  const coinFlip = cf < 22 ? theme.ease.out(cf / 22) * Math.PI * 6 : 0;
  return (
    <Scene shakes={[b.pct]}>
      <At y={300}>
        <Words text="TOSS WINNERS WON" at={b.tw} size={104} per={4} />
      </At>
      <At y={440}>
        {!revealed && frame >= b.won && (
          <div style={{ filter: "blur(3px)", opacity: 0.6 }}>
            <Display size={300} color={C.inkDim}>
              {slot}
            </Display>
          </div>
        )}
        <Slam at={b.pct}>
          <Display size={300} color={C.gold} glow={C.goldGlow}>
            50.9%
          </Display>
        </Slam>
      </At>
      <Rise at={b.tw + 8} style={{ position: "absolute", left: 90, top: 840, width: 900 }}>
        <div style={{ position: "relative", height: 64, borderRadius: 32, overflow: "hidden", background: "rgba(244,241,234,0.14)", border: `2px solid ${C.cardEdge}` }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${split}%`, background: `linear-gradient(90deg, ${C.goldDeep}, ${C.gold})` }} />
        </div>
        <div style={{ position: "absolute", left: 450 - 3, top: -18, width: 6, height: 100, borderRadius: 3, background: C.ink, boxShadow: "0 0 12px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: -56, textAlign: "center" }}>
          <Label size={20} color={C.ink}>50%</Label>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label size={20}>TOSS WINNER</Label>
            <Display size={52} color={revealed ? C.gold : C.inkSoft}>{revealed ? `${split.toFixed(1)}%` : "—"}</Display>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Label size={20}>TOSS LOSER</Label>
            <Display size={52} color={revealed ? C.ink : C.inkSoft}>{revealed ? `${(100 - split).toFixed(1)}%` : "—"}</Display>
          </div>
        </div>
      </Rise>
      <div style={{ position: "absolute", left: 60, top: 1090, width: 960, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <Rise at={b.coin - 2} dist={20}>
          <Coin size={128} flip={coinFlip} glow={0.35} />
        </Rise>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Rise at={b.thats} dist={20}>
            <Label size={26}>BASICALLY</Label>
          </Rise>
          <Words text="A COIN FLIP" at={b.coin} size={118} per={4} style={{ justifyContent: "flex-start" }} />
        </div>
      </div>
    </Scene>
  );
};

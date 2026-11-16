// Scenes 4–6: every format, the 2021 World Cup, what happened next.
import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, Cross, Lock, Pin, Trophy } from "../components/Icons";
import { At, Scene } from "../components/Scene";
import { Card, count, Display, Label, Rise, Slam, Words } from "../components/Type";
import { DATA } from "../data";
import { CLAMP, theme } from "../theme";
import { tok } from "../timing";

const C = theme.colors;

/* ============ 4. EVERY FORMAT ============ */
export const formatsBeats = (fps: number) => ({
  odi: tok(fps, "formats", "one-day"),
  odiV: tok(fps, "formats", "50%"),
  t20: tok(fps, "formats", "t20"),
  t20V: tok(fps, "formats", "50.5"),
  ipl: tok(fps, "formats", "ipl"),
  iplV: tok(fps, "formats", "51.6"),
  but: tok(fps, "formats", "but"),
  breaks: tok(fps, "formats", "breaks"),
});

const LO = 42;
const HI = 58;
const TX = 360;
const TW = 650;
const px = (pct: number) => TX + ((pct - LO) / (HI - LO)) * TW;

export const Formats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = formatsBeats(fps);
  const Y0 = 400;
  const RH = 205;
  const starts = [b.odi, b.t20, b.ipl];
  const lands = [b.odiV, b.t20V, b.iplV];
  const active = lands.reduce((a, l, i) => (frame >= l - 6 ? i : a), -1);
  const testsOn = b.iplV + 16;
  const broke = frame >= b.breaks;
  const shake = broke ? Math.sin((frame - b.breaks) * 2.4) * 10 * Math.exp(-(frame - b.breaks) / 6) : 0;
  return (
    <Scene>
      <At y={262}>
        <Rise at={2}>
          <Label size={28} color={C.ink}>Toss winners' win %, by format</Label>
        </Rise>
      </At>
      {/* 50% line through every row */}
      <div style={{ position: "absolute", left: px(50) - 1.5, top: Y0 - 18, width: 3, height: RH * 3 + 10, backgroundImage: `linear-gradient(${C.ink} 55%, transparent 45%)`, backgroundSize: "3px 16px", opacity: interpolate(frame, [b.odi, b.odi + 12], [0, 0.55], CLAMP) }} />
      <div style={{ position: "absolute", left: px(50) - 60, width: 120, top: Y0 - 56, textAlign: "center", opacity: interpolate(frame, [b.odi, b.odi + 12], [0, 1], CLAMP) }}>
        <Label size={20} color={C.ink}>50%</Label>
      </div>
      {DATA.rows.map((r, i) => {
        const y = Y0 + i * RH;
        const land = spring({ frame: frame - lands[i] + 4, fps, config: theme.spring.bouncy });
        const pos = interpolate(land, [0, 1], [LO, r.pct]);
        const isActive = active === i;
        const shown = frame >= lands[i] - 4;
        const bandOn = interpolate(frame, [starts[i] + 4, starts[i] + 16], [0, 1], { easing: theme.ease.out, ...CLAMP });
        return (
          <Rise key={r.k} at={starts[i]} dist={30}>
            <div style={{ position: "absolute", left: 60, top: y + 34 }}>
              <Display size={78} color={isActive ? C.ink : C.inkDim}>{r.k}</Display>
            </div>
            <div style={{ position: "absolute", left: 62, top: y + 124 }}>
              <Label size={18} color={C.inkSoft}>{r.sub}</Label>
            </div>
            {/* coin-flip zone */}
            <div style={{ position: "absolute", left: px(r.band[0]), width: (px(r.band[1]) - px(r.band[0])) * bandOn, top: y + 62, height: 76, borderRadius: 14, background: "rgba(244,241,234,0.09)", border: `2px dashed ${C.line}` }} />
            {i === 0 && (
              <div style={{ position: "absolute", left: px(r.band[0]), width: px(r.band[1]) - px(r.band[0]), top: y + 146, textAlign: "center", opacity: bandOn }}>
                <Label size={16} color={C.inkSoft} spacing="0.12em">coin-flip zone</Label>
              </div>
            )}
            <div style={{ position: "absolute", left: TX, width: TW, top: y + 96, height: 8, borderRadius: 4, background: C.inkFaint }} />
            {shown && (
              <>
                <div style={{ position: "absolute", left: px(pos) - 22, top: y + 78, width: 44, height: 44, borderRadius: "50%", background: isActive ? C.gold : C.ink, boxShadow: isActive ? `0 0 30px ${C.goldGlow}` : "none", border: `4px solid ${C.sky}` }} />
                <div style={{ position: "absolute", left: px(pos) - 100, width: 200, top: y - 6, textAlign: "center" }}>
                  <Display size={62} color={isActive ? C.gold : C.ink}>{pos.toFixed(1)}%</Display>
                </div>
              </>
            )}
            {i === 0 && (
              <Rise at={b.odiV + 6} dist={14} style={{ position: "absolute", left: px(50) + 118, top: y + 8 }}>
                <div style={{ padding: "8px 16px", borderRadius: 12, border: `2px solid ${C.ink}`, background: "rgba(0,0,0,0.35)" }}>
                  <Label size={20} color={C.ink} spacing="0.1em">Exactly half</Label>
                </div>
              </Rise>
            )}
          </Rise>
        );
      })}
      {/* Tests: locked until later */}
      <Rise at={testsOn} dist={30}>
        <div style={{ position: "absolute", left: 40, top: Y0 + 3 * RH + 10, width: 1000, height: 170, borderRadius: 26, border: `2px solid ${broke ? C.red : C.cardEdge}`, background: broke ? "rgba(255,74,92,0.08)" : "rgba(255,255,255,0.03)", boxShadow: broke ? `0 0 50px ${C.redGlow}` : "none", transform: `translateX(${shake}px)` }}>
          <div style={{ position: "absolute", left: 22, top: 40, display: "flex", alignItems: "center", gap: 14 }}>
            <Lock size={44} color={broke ? C.red : C.inkSoft} />
            <Display size={78} color={broke ? C.ink : C.inkSoft}>TESTS</Display>
          </div>
          <div style={{ position: "absolute", left: TX - 40, width: TW, top: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <Display size={96} color={broke ? C.red : C.inkSoft}>?</Display>
            <Label size={24} color={broke ? C.red : C.inkSoft} spacing="0.14em">{broke ? "Breaks the rule" : "Hold that thought"}</Label>
          </div>
        </div>
      </Rise>
      <At y={1290}>
        <Rise at={b.t20} dist={10}>
          <Label size={16} color={C.inkSoft} spacing="0.1em">Shaded: where a fair coin lands 95% of the time over that many games</Label>
        </Rise>
      </At>
    </Scene>
  );
};

/* ============ 5. THE 2021 WORLD CUP ============ */
export const dubaiBeats = (fps: number) => ({
  q: tok(fps, "dubai", "so"),
  yr: tok(fps, "dubai", "2021"),
  inD: tok(fps, "dubai", "dubai"),
  chasing: tok(fps, "dubai", "chasing"),
  twelve: tok(fps, "dubai", "12"),
  thirteen: tok(fps, "dubai", "13"),
  across: tok(fps, "dubai", "across"),
  thirty: tok(fps, "dubai", "30"),
  incl: tok(fps, "dubai", "including"),
});

// which of the 45 dots are toss-winner wins (30, always including the final, dot 44)
const DOTS = (() => {
  const idx = Array.from({ length: 44 }, (_, i) => i).sort((a, b) => random(`o${a}`) - random(`o${b}`));
  const won = new Set([44, ...idx.slice(0, 29)]);
  const order = [...won].sort((a, b) => random(`f${a}`) - random(`f${b}`));
  return { won, order };
})();
const DEFENDED = 8;

export const Dubai: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = dubaiBeats(fps);
  const rewind = interpolate(frame, [b.yr - 2, b.yr + 10], [1, 0], CLAMP);
  const per = (b.thirteen - b.chasing) / 12;
  const fillFrom = b.across + 18;
  const fillTo = b.thirty - 2;
  return (
    <Scene shakes={[b.twelve, b.thirty]}>
      {/* A — where does the myth come from? */}
      <At y={420}>
        <Words text="WHERE DOES THE MYTH COME FROM?" at={b.q} size={128} per={3} out={b.yr - 6} />
      </At>
      {frame >= b.yr && frame < b.inD + 2 && (
        <At y={420}>
          <Rise at={b.yr} out={b.inD - 6}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `translateX(${Math.sin(frame * 3) * 12 * rewind}px)` }}>
              <Label size={30} color={C.ink}>Rewind to</Label>
              <Display size={330} color={C.gold} glow={C.goldGlow}>2021</Display>
              <Display size={100}>T20 WORLD CUP</Display>
              <Label size={24}>UAE & Oman</Label>
            </div>
          </Rise>
          {/* tape-rewind scanlines */}
          <div style={{ position: "absolute", left: -60, right: -60, top: -40, height: 900, backgroundImage: "repeating-linear-gradient(180deg, rgba(201,216,255,0.16) 0 2px, transparent 2px 9px)", opacity: rewind }} />
        </At>
      )}
      {/* B — Dubai: chasing teams won 12 of 13 */}
      {frame >= b.inD - 2 && frame < b.across + 2 && (
        <>
          <At y={280}>
            <Rise at={b.inD} out={b.across - 6}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Pin size={70} />
                <Display size={120}>DUBAI</Display>
              </div>
            </Rise>
          </At>
          <At y={430}>
            <Rise at={b.chasing - 2} out={b.across - 6} dist={20}>
              <Label size={28} color={C.ink}>Chasing teams won</Label>
            </Rise>
          </At>
          <div style={{ position: "absolute", left: 114, top: 500, width: 852, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {Array.from({ length: 13 }).map((_, i) => {
              const at = Math.round(b.chasing + i * per);
              const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
              const exit = interpolate(frame, [b.across - 8 + i * 0.4, b.across - 1], [0, 1], { easing: theme.ease.in, ...CLAMP });
              const chased = i !== DEFENDED;
              return (
                <div key={i} style={{ width: 156, height: 156, borderRadius: 22, perspective: 600, opacity: frame < at ? 0.25 : 1 - exit, transform: `translateY(${-40 * exit}px)` }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 22, transform: `rotateY(${(1 - p) * 90}deg)`, background: frame < at ? C.card : chased ? "rgba(46,230,166,0.14)" : "rgba(244,241,234,0.06)", border: `2px solid ${frame < at ? C.cardEdge : chased ? C.mint : C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {frame >= at && (chased ? <Check size={58} /> : <Cross size={50} color={C.inkSoft} />)}
                    {frame >= at && <Label size={16} color={chased ? C.mint : C.inkSoft} spacing="0.12em">{chased ? "Chased" : "Defended"}</Label>}
                  </div>
                </div>
              );
            })}
          </div>
          <At y={1040}>
            <Slam at={b.twelve} out={b.across - 6}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <Display size={200} color={C.mint} glow={C.mintGlow}>12</Display>
                <Display size={110} color={C.inkDim}>OF 13</Display>
              </div>
            </Slam>
          </At>
        </>
      )}
      {/* C — the whole tournament: toss winners 30 of 45 */}
      {frame >= b.across - 2 && (
        <>
          <At y={290}>
            <Rise at={b.across}>
              <Label size={26}>Whole tournament · 45 decided games</Label>
            </Rise>
          </At>
          <At y={340}>
            <Words text="TOSS WINNERS WON" at={b.across + 4} size={96} per={4} />
          </At>
          <div style={{ position: "absolute", left: 127, top: 500, width: 826, display: "grid", gridTemplateColumns: "repeat(9, 74px)", gap: 20 }}>
            {Array.from({ length: 45 }).map((_, i) => {
              const appear = spring({ frame: frame - (b.across + 4 + i * 0.35), fps, config: theme.spring.snappy });
              const rank = DOTS.order.indexOf(i);
              const fillAt = rank < 0 ? Infinity : fillFrom + (rank / 29) * (fillTo - fillFrom);
              const f = rank < 0 ? 0 : spring({ frame: frame - fillAt, fps, config: theme.spring.bouncy });
              const isFinal = i === 44 && frame >= b.incl;
              const pulse = isFinal ? 1 + 0.12 * Math.abs(Math.sin((frame - b.incl) / 5)) : 1;
              return (
                <div key={i} style={{ width: 74, height: 74, borderRadius: "50%", border: `4px solid ${rank >= 0 && frame >= fillAt ? C.gold : C.line}`, opacity: appear, transform: `scale(${appear * pulse})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isFinal ? `0 0 40px ${C.goldGlow}` : "none" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.gold, transform: `scale(${frame >= fillAt ? f : 0})` }} />
                </div>
              );
            })}
          </div>
          <At y={1000}>
            <Slam at={b.thirty}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <Display size={190} color={C.gold} glow={C.goldGlow}>30</Display>
                <Display size={104} color={C.inkDim}>OF 45</Display>
              </div>
            </Slam>
          </At>
          <At y={1206}>
            <Rise at={b.incl} dist={24}>
              <Card style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 26px 10px 16px", borderRadius: 22 }}>
                <Trophy size={64} />
                <Label size={22} color={C.ink} spacing="0.08em">Final: Australia won the toss, bowled, won</Label>
              </Card>
            </Rise>
          </At>
        </>
      )}
    </Scene>
  );
};

/* ============ 6. WHAT HAPPENED NEXT ============ */
export const afterBeats = (fps: number) => ({
  next: tok(fps, "after", "next"),
  v39: tok(fps, "after", "39"),
  v56: tok(fps, "after", "56"),
  v43: tok(fps, "after", "43"),
  back: tok(fps, "after", "back"),
});

export const After: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = afterBeats(fps);
  const BASE = 1080;
  const K = 8.2; // px per percentage point
  const at = [3, b.v39 - 3, b.v56 - 3, b.v43 - 3];
  const zone = interpolate(frame, [b.next, b.next + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <Scene>
      <At y={292}>
        <Rise at={2}>
          <Label size={26} color={C.ink}>Toss winners' win % · T20 World Cups</Label>
        </Rise>
      </At>
      {/* legend, then the coin-flip zone for ~45 games (≈35–65%) and the 50% line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", gap: 36, opacity: zone }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 20, background: "rgba(244,241,234,0.1)", border: `2px dashed ${C.line}` }} />
          <Label size={17} color={C.inkDim} spacing="0.1em">Coin-flip zone (~45 games)</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 3, backgroundImage: `linear-gradient(90deg, ${C.ink} 55%, transparent 45%)`, backgroundSize: "12px 3px" }} />
          <Label size={17} color={C.inkDim} spacing="0.1em">50%</Label>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, width: 920 * zone, top: BASE - 65 * K, height: 30 * K, background: "rgba(244,241,234,0.07)", borderTop: `2px dashed ${C.line}`, borderBottom: `2px dashed ${C.line}` }} />
      <div style={{ position: "absolute", left: 80, width: 920, top: BASE - 50 * K - 1, height: 3, backgroundImage: `linear-gradient(90deg, ${C.ink} 55%, transparent 45%)`, backgroundSize: "18px 3px", opacity: 0.5 * zone }} />
      <div style={{ position: "absolute", left: 80, width: 920, top: BASE, height: 3, background: C.line }} />
      {DATA.wcs.map((w, i) => {
        const p = spring({ frame: frame - at[i], fps, config: theme.spring.smooth });
        const h = w.pct * K * p;
        const red = i === 0;
        const x = 125 + i * 220;
        const shown = frame >= at[i];
        return (
          <React.Fragment key={w.y}>
            <div style={{ position: "absolute", left: x, top: BASE - h, width: 170, height: h, borderRadius: "16px 16px 0 0", background: red ? `linear-gradient(180deg, ${C.red}, rgba(255,74,92,0.45))` : `linear-gradient(180deg, rgba(244,241,234,0.85), rgba(244,241,234,0.3))`, boxShadow: red ? `0 0 40px ${C.redGlow}` : "none", opacity: shown ? 1 : 0 }} />
            <div style={{ position: "absolute", left: x - 20, width: 210, top: BASE - h - 86, textAlign: "center", opacity: interpolate(p, [0.3, 0.8], [0, 1], CLAMP) }}>
              <Display size={72} color={red ? C.red : C.ink}>{Math.round(count(frame, at[i], at[i] + 18, w.pct))}%</Display>
            </div>
            <div style={{ position: "absolute", left: x - 20, width: 210, top: BASE + 16, textAlign: "center", opacity: shown ? 1 : 0.3 }}>
              <Display size={52} color={red ? C.ink : C.inkDim}>{w.y}</Display>
            </div>
            {red && (
              <div style={{ position: "absolute", left: x - 20, width: 210, top: BASE - h - 120, textAlign: "center", opacity: interpolate(p, [0.5, 1], [0, 1], CLAMP) }}>
                <Label size={18} color={C.red}>The outlier</Label>
              </div>
            )}
          </React.Fragment>
        );
      })}
      <At y={1190}>
        <Words text="BACK TO A COIN FLIP" at={b.back} size={96} per={4} />
      </At>
    </Scene>
  );
};

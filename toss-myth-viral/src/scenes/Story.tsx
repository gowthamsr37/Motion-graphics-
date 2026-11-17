// Myth Busters #01 (viral cut): nine scenes timed to the narration.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Coin, Shell, Stamp, Txt } from "../components/Kit";
import { Meter, Needle } from "../components/Meter";
import { CLAMP } from "../components/Motion";
import { Dew, DubaiTiles, FixtureWall, Hundred, Pitch, WCBars } from "../components/Viz";
import { theme } from "../theme";
import { sentence, voStart, wordAt } from "../timing";

const C = theme.colors;
const fmt = (n: number) => n.toLocaleString("en-US");
const fade = (f: number, at: number, len = 8) => interpolate(f, [at, at + len], [0, 1], CLAMP);
const useP = (at: number, cfg: { damping: number; stiffness: number; mass: number } = theme.spring.pop) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};
// value that springs from `from` to `to` starting at `at` (with the needle's overshoot)
const useNeedle = (at: number, from: number, to: number) => {
  const p = useP(at, theme.spring.needle);
  return from + (to - from) * p;
};

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at, children, style, from = 0.4 }) => {
  const frame = useCurrentFrame();
  const p = useP(at);
  if (frame < at) return null;
  return <div style={{ transform: `scale(${interpolate(p, [0, 1], [from, 1])})`, opacity: interpolate(p, [0, 0.25], [0, 1], CLAMP), ...style }}>{children}</div>;
};

const Title: React.FC<{ text: string; at?: number; color?: string; y?: number; size?: number }> = ({ text, at = 0, color = C.white, y = 268, size = 74 }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "center" }}>
    <Pop at={at} from={0.7}>
      <Txt size={size} color={color} style={{ textShadow: `0 6px 0 rgba(0,0,0,0.5)` }}>
        {text}
      </Txt>
    </Pop>
  </div>
);

const Foot: React.FC<{ text: string; y: number; on?: number }> = ({ text, y, on = 1 }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", opacity: on }}>
    <Txt size={17} font="body" weight={800} color={C.dim} spacing="0.06em">
      {text}
    </Txt>
  </div>
);

/* ================= S1 — HOOK ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  const v = voStart(fps, "s1");
  return {
    w: ["winning", "the", "toss", "is", "worth", "almost", "nothing"].map((x, i) => wordAt(fps, "s1", x, [0, 0.22, 0.44, 0.68, 1.0, 1.2, 1.54][i])),
    nothing: wordAt(fps, "s1", "nothing", 1.54),
    prove: s[1].from,
    count: s[2].from,
    v,
  };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const out = interpolate(frame, [b.prove - 6, b.prove + 6], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const spin = frame * 0.42;
  const coinIn = useP(0, theme.spring.heavy);
  const cnt = theme.ease.out(interpolate(frame, [b.count - 2, b.count + 40], [0, 1], CLAMP));
  const slam = useP(b.count + 40, theme.spring.pop);
  const lines: { words: number[]; size: number; color: string }[] = [
    { words: [0, 1, 2], size: 120, color: C.white },
    { words: [3, 4], size: 120, color: C.white },
    { words: [5, 6], size: 150, color: C.gold },
  ];
  const label = ["WINNING", "THE", "TOSS", "IS", "WORTH", "ALMOST", "NOTHING"];
  return (
    <Shell enter={false} shakeAt={[b.nothing, b.count + 40]}>
      {/* phase A: the claim */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 120}px) scale(${1 - out * 0.1})` }}>
        <div style={{ position: "absolute", left: 540 - 150, top: 300 + (1 - coinIn) * -500, transform: `scale(${interpolate(coinIn, [0, 1], [1.5, 1])})` }}>
          <Coin size={300} angle={spin} glow={0.8} />
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 680, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {lines.map((l, k) => (
            <div key={k} style={{ display: "flex", gap: 24 }}>
              {l.words.map((wi) => (
                <Pop key={wi} at={b.w[wi] - 1} from={1.8}>
                  <Txt size={l.size} color={l.color} style={{ textShadow: k === 2 ? `0 0 40px ${C.goldGlow}, 0 8px 0 rgba(0,0,0,0.5)` : "0 8px 0 rgba(0,0,0,0.5)" }}>
                    {label[wi]}
                  </Txt>
                </Pop>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* phase B: the proof */}
      {frame >= b.prove - 4 && (
        <>
          <div style={{ position: "absolute", left: 54, top: 290 }}>
            <FixtureWall at={b.prove - 4} rate={2.2} dim={0.55} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 1000, background: "radial-gradient(closest-side, rgba(5,8,15,0.92), rgba(5,8,15,0.55) 70%, rgba(5,8,15,0))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Pop at={b.prove} from={0.8}>
              <Txt size={70}>AND WE CAN PROVE IT.</Txt>
            </Pop>
            {frame >= b.count - 2 && (
              <div style={{ transform: `scale(${1 + 0.12 * Math.sin(Math.PI * Math.min(1, slam))})` }}>
                <Txt size={300} color={C.gold} style={{ textShadow: `0 0 60px ${C.goldGlow}, 0 10px 0 rgba(0,0,0,0.5)`, fontVariantNumeric: "tabular-nums" }}>
                  {fmt(Math.round(8408 * cnt))}
                </Txt>
              </div>
            )}
            <Pop at={b.count + 30} from={0.8}>
              <Txt size={64}>MEN'S MATCHES</Txt>
            </Pop>
            <Pop at={b.count + 40} from={0.8}>
              <Txt size={24} font="body" weight={800} color={C.dim} spacing="0.1em">
                TESTS · ODIs · T20Is · IPL · 2002–2026
              </Txt>
            </Pop>
          </div>
        </>
      )}
    </Shell>
  );
};

/* ================= S2 — THE TOSS-O-METER ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s2", i));
  return { winners: wordAt(fps, "s2", "winners", 1.76), half: wordAt(fps, "s2", "half", 2.44), luckLine: s[1].from, z48: wordAt(fps, "s2", "48", 5.84), z52: wordAt(fps, "s2", "52", 6.76), luck: wordAt(fps, "s2", "luck", 8.22) };
};

const MeterBlock: React.FC<{ needles: Needle[]; zoneGlow?: number; edgeGlow?: number; y?: number; w?: number }> = ({ needles, zoneGlow = 0, edgeGlow = 0, y = 400, w = 960 }) => (
  <div style={{ position: "absolute", left: (1080 - w) / 2, top: y }}>
    <Meter w={w} needles={needles} zoneGlow={zoneGlow} edgeGlow={edgeGlow} />
  </div>
);

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const v = useNeedle(b.winners, 40, 50);
  const zone = fade(frame, b.z48, 10) * (0.6 + 0.4 * (frame >= b.luck ? 1 : 0.5 + 0.5 * Math.sin(frame / 5)));
  return (
    <Shell>
      <Title text="THE TOSS-O-METER" at={2} />
      <MeterBlock needles={[{ v, color: C.white }]} zoneGlow={zone} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Pop at={b.half}>
          <Txt size={130}>50%</Txt>
        </Pop>
        <Pop at={b.half + 6}>
          <Txt size={30} font="body" weight={900} color={C.dim} spacing="0.12em">
            = A COIN FLIP
          </Txt>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", gap: 18 }}>
        <Pop at={b.z48}>
          <Chip text="48% – 52%" color="#04140D" bg={C.green} size={30} />
        </Pop>
        <Pop at={b.luck - 2}>
          <Chip text="= JUST LUCK" color={C.green} size={30} />
        </Pop>
      </div>
      <Foot text="LUCK ZONE: WHERE A FAIR COIN LANDS 95% OF THE TIME OVER THIS MANY MATCHES" y={1262} on={fade(frame, b.luck)} />
    </Shell>
  );
};

/* ================= S3 — ODIs: EXACTLY HALF ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s3", i));
  return { odi: wordAt(fps, "s3", "odi", 0.2), won: s[1].from, of: wordAt(fps, "s3", "of", 4.3), drop: s[2].from, exactly: wordAt(fps, "s3", "exactly", 11.04) };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  // tension wobble while the numbers count, then the needle lands dead centre
  const wob = frame < b.drop ? 44 + 3 * Math.sin(frame / 3.2) * fade(frame, b.won, 20) : 0;
  const land = useNeedle(b.drop, 44, 50);
  const v = frame < b.drop ? (frame < b.won ? 40 + 4 * fade(frame, b.odi, 12) : wob) : land;
  const cW = theme.ease.out(interpolate(frame, [b.won + 8, b.of], [0, 1], CLAMP));
  const cN = theme.ease.out(interpolate(frame, [b.of, b.of + 30], [0, 1], CLAMP));
  const slam = useP(b.drop);
  return (
    <Shell shakeAt={[b.drop]}>
      <Title text="ODIs" at={b.odi - 2} color={C.gold} size={96} y={262} />
      <MeterBlock needles={[{ v, color: frame >= b.drop ? C.green : C.white }]} zoneGlow={frame >= b.drop ? 1 : 0.2} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 950, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18, opacity: fade(frame, b.won) * (frame >= b.drop ? 0 : 1) }}>
        <Txt size={34} font="body" weight={900} color={C.dim}>
          TOSS WINNERS WON
        </Txt>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, opacity: fade(frame, b.won) * (frame >= b.drop ? 0 : 1) }}>
        <Txt size={150} color={C.white} style={{ fontVariantNumeric: "tabular-nums" }}>
          {fmt(Math.round(1244 * cW))}
        </Txt>
        <Txt size={60} color={C.dim}>
          OF
        </Txt>
        <Txt size={150} color={C.dim} style={{ fontVariantNumeric: "tabular-nums" }}>
          {fmt(Math.round(2487 * cN))}
        </Txt>
      </div>
      {frame >= b.drop && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, transform: `scale(${interpolate(slam, [0, 1], [2.2, 1])})`, opacity: interpolate(slam, [0, 0.2], [0, 1], CLAMP) }}>
          <Txt size={230} color={C.green} style={{ textShadow: `0 0 50px ${C.greenGlow}, 0 10px 0 rgba(0,0,0,0.5)` }}>
            50.0%
          </Txt>
          <Txt size={26} font="body" weight={900} color={C.dim} spacing="0.1em">
            1,244 OF 2,487 DECIDED ODIs
          </Txt>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1185, display: "flex", justifyContent: "center" }}>
        <Stamp text="EXACTLY HALF" at={b.exactly} color={C.green} size={78} rotate={-4} />
      </div>
    </Shell>
  );
};

/* ================= S4 — EVERY FORMAT: JUST LUCK ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s4", i));
  return { t20: wordAt(fps, "s4", "50", 1.5), ipl: wordAt(fps, "s4", "51", 3.44), luck: s[1].from };
};
const T20C = C.blue, IPLC = "#B48CFF";

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const t = useNeedle(b.t20 - 4, 40, 50.5);
  const i = useNeedle(b.ipl - 4, 40, 51.6);
  const needles: Needle[] = [{ v: 50, color: C.white, ghost: frame >= b.t20 - 4 }];
  if (frame >= b.t20 - 4) needles.push({ v: t, color: T20C });
  if (frame >= b.ipl - 4) needles.push({ v: i, color: IPLC });
  const rows = [
    { k: "ODIs", v: "50.0%", c: C.white, at: 0, n: "2,487 GAMES" },
    { k: "T20Is", v: "50.5%", c: T20C, at: b.t20, n: "3,530 GAMES" },
    { k: "IPL", v: "51.6%", c: IPLC, at: b.ipl, n: "1,218 GAMES" },
  ];
  return (
    <Shell shakeAt={[b.luck]}>
      <Title text="AND THE REST?" at={0} size={70} />
      <MeterBlock needles={needles} zoneGlow={frame >= b.luck ? 1 : 0.35} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 950, display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map((r) => (
          <Pop key={r.k} at={r.at} from={0.8}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 26px", borderRadius: 18, background: C.card, border: `2px solid ${frame >= b.luck ? C.green : C.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 18, height: 18, borderRadius: 18, background: r.c }} />
                <Txt size={50}>{r.k}</Txt>
                <Txt size={18} font="body" weight={800} color={C.dim}>
                  {r.n}
                </Txt>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Txt size={54} color={r.c}>
                  {r.v}
                </Txt>
                {frame >= b.luck && (
                  <Txt size={22} font="body" weight={900} color={C.green}>
                    ✓ LUCK
                  </Txt>
                )}
              </div>
            </div>
          </Pop>
        ))}
      </div>
    </Shell>
  );
};

/* ================= S5 — THE "TOSS WORLD CUP" ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s5", i));
  return {
    q: s[0].from,
    one: s[1].from,
    wc: s[2].from,
    dubai: wordAt(fps, "s5", "dubai", 6.64),
    twelve: wordAt(fps, "s5", "12", 8.4),
    thirteen: wordAt(fps, "s5", "13", 8.92),
    dew: s[3].from,
    slip: wordAt(fps, "s5", "slippery", 11.3),
    bowl: wordAt(fps, "s5", "bol", 13.2),
    across: s[4].from,
    thirty: wordAt(fps, "s5", "30", 16.0),
  };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const per = Math.max(3, Math.round((b.thirteen - b.dubai) / 12));
  const quoteOut = fade(frame, b.dubai - 8, 8);
  const c30 = theme.ease.out(interpolate(frame, [b.thirty - 6, b.thirty + 16], [0, 1], CLAMP));
  return (
    <Shell shakeAt={[b.thirty + 16]}>
      {/* the belief, then the tournament */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: 1 - quoteOut, transform: `translateY(${-quoteOut * 80}px)` }}>
        <Pop at={b.q} from={0.8}>
          <div style={{ textAlign: "center" }}>
            <Txt size={120} color={C.gold}>
              “
            </Txt>
            <Txt size={104}>WIN THE TOSS,</Txt>
            <br />
            <Txt size={104}>WIN THE MATCH</Txt>
            <Txt size={120} color={C.gold}>
              ”
            </Txt>
          </div>
        </Pop>
        <Pop at={b.wc - 2} from={0.6}>
          <div style={{ padding: "18px 40px 14px", borderRadius: 22, background: C.gold }}>
            <Txt size={80} color="#1A1200">
              T20 WORLD CUP 2021
            </Txt>
          </div>
        </Pop>
      </div>
      {frame >= b.dubai - 8 && (
        <>
          <Title text="DUBAI · T20 WORLD CUP 2021" at={b.dubai - 8} size={56} y={270} />
          <div style={{ position: "absolute", left: (1080 - (5 * 168 + 4 * 14)) / 2, top: 360 }}>
            <DubaiTiles at={b.dubai} per={per} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 650, height: 380 }}>
            <Dew on={fade(frame, b.dew, 40)} w={1080} h={420} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>
            <Pop at={b.twelve}>
              <Txt size={120} color={C.green} style={{ textShadow: `0 0 40px ${C.greenGlow}` }}>
                12 / 13
              </Txt>
            </Pop>
            <Pop at={b.twelve + 6}>
              <Txt size={30} font="body" weight={900} color={C.white}>
                WON BY THE
                <br />
                CHASING TEAM
              </Txt>
            </Pop>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 935, display: "flex", justifyContent: "center", gap: 12 }}>
            <Pop at={b.dew}>
              <Chip text="💧 EVENING DEW" color={C.blue} size={26} />
            </Pop>
            <Pop at={b.slip}>
              <Chip text="→ WET BALL" size={26} />
            </Pop>
            <Pop at={b.bowl}>
              <Chip text="→ TOSS WINNERS BOWL" color={C.gold} size={26} />
            </Pop>
          </div>
          <Card x={140} y={1030} w={800} h={230} at={b.across - 4} glow={c30 >= 1 ? C.goldGlow : undefined}>
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
              <Txt size={150} color={C.gold} style={{ fontVariantNumeric: "tabular-nums" }}>
                {Math.round(30 * c30)}/45
              </Txt>
              <Txt size={28} font="body" weight={900} color={C.white}>
                TOSS WINNERS
                <br />
                WON · WHOLE
                <br />
                TOURNAMENT
              </Txt>
            </div>
          </Card>
        </>
      )}
    </Shell>
  );
};

/* ================= S6 — THEN IT VANISHED ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s6", i));
  return { vanished: wordAt(fps, "s6", "vanished", 0.3), bars: s[1].from, y22: wordAt(fps, "s6", "39", 3.02), y24: wordAt(fps, "s6", "56", 3.68), y26: wordAt(fps, "s6", "43", 4.5), law: s[2].from, place: wordAt(fps, "s6", "place", 7.54), season: wordAt(fps, "s6", "season", 8.18) };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const glitch = frame >= b.vanished && frame < b.vanished + 10 ? Math.sin(frame * 9) * 12 : 0;
  const tilesOut = fade(frame, b.bars - 6, 8);
  return (
    <Shell enter={false} shakeAt={[b.vanished]}>
      {/* the 2021 tiles fall away */}
      <div style={{ position: "absolute", left: (1080 - (5 * 168 + 4 * 14)) / 2, top: 360, opacity: 1 - tilesOut }}>
        <DubaiTiles at={-60} per={0} fall={b.vanished} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center", opacity: (1 - tilesOut) * fade(frame, b.vanished - 2, 4), transform: `translateX(${glitch}px)`, zIndex: 5 }}>
        <Txt size={130} color={C.red} style={{ background: "rgba(5,8,15,0.85)", padding: "10px 34px 4px", borderRadius: 20, textShadow: `${-glitch / 2}px 0 0 ${C.blue}, ${glitch / 2}px 0 0 ${C.gold}` }}>
          THEN IT VANISHED
        </Txt>
      </div>
      {frame >= b.bars - 6 && (
        <>
          <Title text="TOSS WINNERS' WIN % · T20 WORLD CUPS" at={b.bars - 6} size={46} y={272} />
          <div style={{ position: "absolute", left: 90, top: 360 }}>
            <WCBars
              w={900}
              h={640}
              lineAt={b.bars}
              items={[
                { label: "2021", sub: "30 OF 45", value: (100 * 30) / 45, at: b.bars - 4, color: C.gold },
                { label: "2022", sub: "15 OF 38*", value: (100 * 15) / 38, at: b.y22 - 3, color: C.white },
                { label: "2024", sub: "23 OF 41*", value: (100 * 23) / 41, at: b.y24 - 3, color: C.white },
                { label: "2026", sub: "21 OF 49*", value: (100 * 21) / 49, at: b.y26 - 3, color: C.white },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Pop at={b.law} from={0.8}>
              <Txt size={70}>
                NOT A <span style={{ color: C.red, textDecoration: "line-through", textDecorationThickness: 8 }}>LAW OF CRICKET</span>
              </Txt>
            </Pop>
            <div style={{ display: "flex", gap: 14 }}>
              <Pop at={b.place - 2}>
                <Chip text="ONE PLACE" color={C.gold} size={30} />
              </Pop>
              <Pop at={b.season - 2}>
                <Chip text="ONE SEASON" color={C.gold} size={30} />
              </Pop>
            </div>
          </div>
          <Foot text="*DATA SOURCE WITHHOLDS AFGHANISTAN'S GAMES · DECIDED MATCHES ONLY" y={1272} on={fade(frame, b.y26)} />
        </>
      )}
    </Shell>
  );
};

/* ================= S7 — TESTS: THE EXCEPTION ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { real: wordAt(fps, "s7", "real", 1.98), test: s[1].from, v57: wordAt(fps, "s7", "57", 5.0), bowl: wordAt(fps, "s7", "bowl", 6.26), v48: wordAt(fps, "s7", "48", 7.58), because: s[2].from, pitch: wordAt(fps, "s7", "pitch", 11.16) };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const bat = useNeedle(b.v57 - 8, 40, 57.1);
  const bowl = useNeedle(b.v48 - 8, 40, 48.3);
  const needles: Needle[] = [];
  if (frame >= b.v48 - 8) needles.push({ v: bowl, color: C.red, ghost: true });
  needles.push({ v: frame >= b.v57 - 8 ? bat : 40, color: C.gold });
  const wear = interpolate(frame, [b.because, b.pitch + 6], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  return (
    <Shell shakeAt={[b.v57]}>
      <Title text="THE ONE EXCEPTION: TESTS" at={0} color={C.gold} size={70} />
      <MeterBlock needles={needles} edgeGlow={frame >= b.v57 ? 1 : 0} y={380} w={900} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 880, display: "flex", justifyContent: "space-around" }}>
        <Pop at={b.v57}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Txt size={150} color={C.gold} style={{ textShadow: `0 0 40px ${C.goldGlow}` }}>
              57%
            </Txt>
            <Txt size={24} font="body" weight={900} color={C.white} spacing="0.08em">
              WON TOSS · BATTED FIRST
            </Txt>
          </div>
        </Pop>
        <Pop at={b.v48}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Txt size={150} color={C.red}>
              48%
            </Txt>
            <Txt size={24} font="body" weight={900} color={C.dim} spacing="0.08em">
              WON TOSS · BOWLED FIRST
            </Txt>
          </div>
        </Pop>
      </div>
      {frame >= b.because - 4 && (
        <div style={{ position: "absolute", left: 90, top: 1080, opacity: fade(frame, b.because - 4) }}>
          <Pitch w={900} wear={wear} />
        </div>
      )}
      <Foot text="SHARE OF DECIDED TESTS WON (DRAWS EXCLUDED) · 283 OF 496 · 113 OF 234" y={1100} on={frame < b.because - 4 ? fade(frame, b.v48 + 10) : 0} />
    </Shell>
  );
};

/* ================= S8 — IPL: IT'S THE CHOICE ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s8", i));
  return { coin: wordAt(fps, "s8", "coin", 1.42), choice: wordAt(fps, "s8", "choice", 2.38), bowl: s[1].from, v55: wordAt(fps, "s8", "55", 4.08), bat: wordAt(fps, "s8", "batting", 5.32), v45: wordAt(fps, "s8", "45", 6.56) };
};

const Side: React.FC<{ x: number; label: string; value: number; color: string; at: number; sub: string }> = ({ x, label, value, color, at, sub }) => {
  const frame = useCurrentFrame();
  const fill = useP(at, theme.spring.smooth);
  const shown = value * Math.min(1, fill);
  return (
    <div style={{ position: "absolute", left: x, top: 420, width: 440, height: 780, borderRadius: 30, background: C.card, border: `3px solid ${frame >= at ? color : C.line}`, overflow: "hidden", boxShadow: frame >= at ? `0 0 40px ${color}55` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${shown}%`, background: `linear-gradient(180deg, ${color}cc, ${color}55)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center" }}>
        <Txt size={62}>{label}</Txt>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: fade(frame, at) }}>
        <Txt size={170} color={C.white} style={{ textShadow: "0 8px 0 rgba(0,0,0,0.4)" }}>
          {Math.round(shown)}%
        </Txt>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", opacity: fade(frame, at + 10) }}>
        <Txt size={22} font="body" weight={900} color={C.white} spacing="0.06em">
          {sub}
        </Txt>
      </div>
    </div>
  );
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  return (
    <Shell shakeAt={[b.v55]}>
      <Title text="IPL: NOT THE COIN. THE CHOICE." at={0} size={66} />
      <Side x={70} label="WON TOSS · BOWLED" value={54.7} color={C.green} at={b.v55 - 6} sub="443 OF 810 WON (54.7%)" />
      <Side x={570} label="WON TOSS · BATTED" value={45.3} color={C.red} at={b.v45 - 6} sub="185 OF 408 WON (45.3%)" />
      <div style={{ position: "absolute", left: 540 - 70, top: 340 }}>
        <Pop at={b.coin - 4}>
          <Coin size={140} angle={(frame - b.coin) * 0.3} glow={0.6} />
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1218, display: "flex", justifyContent: "center", opacity: fade(frame, 4) }}>
        <Txt size={18} font="body" weight={800} color={C.dim} spacing="0.06em">
          IPL 2008–2026 · DECIDED MATCHES
        </Txt>
      </div>
    </Shell>
  );
};

/* ================= S9 — VERDICT ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s9", i));
  return { q: s[0].from, v: s[1].from, less: wordAt(fps, "s9", "less", 3.64), extra: wordAt(fps, "s9", "extra", 4.8), myth: s[2].from, cta: s[3].from };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const tension = 44 + 2.5 * Math.sin(frame / 3) * fade(frame, b.q, 10);
  const land = useNeedle(b.v, 44, 50.9);
  const v = frame < b.v ? tension : land;
  const meterOut = fade(frame, b.less - 6, 8);
  const gridOut = fade(frame, b.myth - 4, 6);
  const ctaIn = useP(b.cta - 4, theme.spring.snappy);
  const stampUp = interpolate(ctaIn, [0, 1], [0, 1]);
  return (
    <Shell exit={false} shakeAt={[b.v, b.myth]} push={0}>
      <div style={{ opacity: 1 - fade(frame, b.cta - 8, 6) }}>
        <Title text="THE VERDICT" at={0} size={84} />
      </div>
      <div style={{ opacity: 1 - meterOut }}>
        <MeterBlock needles={[{ v, color: frame >= b.v ? C.green : C.white }]} zoneGlow={frame >= b.v ? 1 : 0.3} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", flexDirection: "column", alignItems: "center", opacity: fade(frame, b.v, 4) }}>
          <Txt size={210} color={C.green} style={{ textShadow: `0 0 50px ${C.greenGlow}` }}>
            50.9%
          </Txt>
          <Txt size={24} font="body" weight={900} color={C.dim} spacing="0.08em">
            ALL FORMATS · 4,051 OF 7,965 DECIDED MATCHES
          </Txt>
        </div>
      </div>
      {frame >= b.less - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 390, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: fade(frame, b.less - 6) * (1 - gridOut) }}>
          <Txt size={40} font="body" weight={900} color={C.white}>
            EVERY 100 MATCHES:
          </Txt>
          <Hundred at={b.less} extraAt={b.extra} cell={54} gap={10} />
          <div style={{ display: "flex", gap: 40 }}>
            <Txt size={30} font="body" weight={900} color={C.white}>
              ● 50 WINS = A COIN FLIP
            </Txt>
            <Txt size={30} font="body" weight={900} color={C.gold} style={{ opacity: fade(frame, b.extra) }}>
              ● +0.9 = THE TOSS
            </Txt>
          </div>
        </div>
      )}
      {/* the stamp, then the call to action */}
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(stampUp, [0, 1], [640, 330]), display: "flex", justifyContent: "center", transform: `scale(${interpolate(stampUp, [0, 1], [1, 0.62])})` }}>
        <Stamp text="MYTH BUSTED" at={b.myth} color={C.red} size={170} rotate={-7} />
      </div>
      {frame >= b.cta - 4 && (
        <Card x={70} y={600} w={940} h={660} at={b.cta - 4} glow={C.goldGlow}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <Txt size={88} color={C.gold}>
              WHICH MYTH NEXT?
            </Txt>
            <Txt size={30} font="body" weight={900} color={C.white} spacing="0.04em">
              TELL US IN THE COMMENTS 👇
            </Txt>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 6 }}>
              {["DOES BATTING FIRST WIN FINALS?", "IS HOME ADVANTAGE REAL?", "DO THE NERVOUS 90s EXIST?"].map((t, k) => (
                <Pop key={t} at={b.cta + 10 + k * 8} from={0.7}>
                  <Chip text={t} size={28} />
                </Pop>
              ))}
            </div>
            <div style={{ width: 700, height: 2, background: C.line, margin: "10px 0 4px" }} />
            <Txt size={64}>BEYOND THE SCOREBOARD</Txt>
            <Txt size={20} font="body" weight={800} color={C.dim} spacing="0.06em">
              DATA: CRICSHEET.ORG (ODC-BY) · MEN'S MATCHES 2002–2026
            </Txt>
          </div>
        </Card>
      )}
    </Shell>
  );
};

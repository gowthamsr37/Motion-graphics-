// THE KEEPER FILE — Rishabh Pant against India's keepers and the world's. Data: src/data.json (analysis/keepers.py).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BigGlyph, CLAMP, Cutout, Disp, fade, Label, Serif, Shell, useP } from "../components/Ed";
import { Cue } from "../components/Sound";
import { Brand, CaseFile, Footnote, Kicker, Lockup, Lollipop, Road, Slam, Stamp, StatRow } from "../components/Viz";
import { config } from "../config";
import data from "../data.json";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;
const ease = (f: number, a: number, len: number) => interpolate(f, [a, a + len], [0, 1], { easing: theme.ease.out, ...CLAMP });
const win = (f: number, a: number, b: number, len = 8) => fade(f, a, len) * (1 - fade(f, b - len, len));
const Tag: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.ink, size = 24 }) => (
  <span style={{ background: color, padding: "8px 18px", display: "inline-block" }}>
    <Label size={size} color={C.paperHi} weight={900}>
      {text}
    </Label>
  </span>
);

/* ================= S1 — NINE ================= */
const s1Beats = (fps: number) => ({ more: wordAt(fps, "s1", "more", 3.14), dhoni: wordAt(fps, "s1", "doney", 4.28), n90: wordAt(fps, "s1", "90", 5.58), pant: wordAt(fps, "s1", "punt", 7.2), n53: wordAt(fps, "s1", "53", 8.42), but: sentence(fps, "s1", 2).from });
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [0, 26], [0, 1], CLAMP));
  const fill = ease(frame, 14, 16);
  return (
    <Shell enter={false}>
      <BigGlyph char="9" x={183} y={262} size={1150} draw={draw} fill={fill * 0.92} />
      <Cutout src="pant-raise-bat-cut.png" x={372} y={360} h={880} at={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 236 }}>
        <Lockup name="Rishabh Pant" tag="9 Test hundreds" at={8} top={0} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", gap: 30, opacity: fade(frame, b.more - 6) }}>
        <div style={{ background: C.paperHi, padding: "14px 26px", boxShadow: "0 12px 30px rgba(40,30,10,0.16)", opacity: fade(frame, b.dhoni - 4) }}>
          <Label size={18} color={C.mute}>
            MS Dhoni
          </Label>
          <div>
            <Disp size={64}>{`6 in ${fade(frame, b.n90 - 4) > 0.5 ? 90 : "–"} Tests`}</Disp>
          </div>
        </div>
        <div style={{ background: C.accent, padding: "14px 26px", boxShadow: "0 12px 30px rgba(40,30,10,0.16)", opacity: fade(frame, b.pant - 4) }}>
          <Label size={18} color={C.paperHi}>
            Rishabh Pant
          </Label>
          <div>
            <Disp size={64} color={C.paperHi}>{`9 in ${fade(frame, b.n53 - 4) > 0.5 ? 53 : "–"} Tests`}</Disp>
          </div>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S2 — INDIA'S KEEPERS ================= */
const s2Beats = (fps: number) => ({ engineer: wordAt(fps, "s2", "engineer", 2.7), kirmani: wordAt(fps, "s2", "kirmani", 6.44), saha: wordAt(fps, "s2", "saha", 9.16), dhoni: wordAt(fps, "s2", "doni", 11.32), pant: sentence(fps, "s2", 2).from, n15: wordAt(fps, "s2", "15", 16.78) });
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const at: Record<string, number> = { "Syed Kirmani": b.kirmani - 6, "Farokh Engineer": b.engineer - 6, "Wriddhiman Saha": b.saha - 6, "MS Dhoni": b.dhoni - 6, "Rishabh Pant": b.pant - 2 };
  const rows = [...data.india].sort((p, q) => q.tests / q.h - p.tests / p.h);
  return (
    <Shell>
      <Kicker title="India's keepers" sub="One Test hundred every … Tests (shorter is better)" />
      {rows.map((r, i) => {
        const per = r.tests / r.h;
        const p = ease(frame, at[r.n], 18);
        const pant = r.n === "Rishabh Pant";
        const col = pant ? C.accent : C.ink;
        return (
          <div key={r.n} style={{ position: "absolute", left: 70, right: 70, top: 440 + i * 150, opacity: fade(frame, at[r.n] - 2) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Label size={pant ? 26 : 22} color={col} weight={900}>
                {r.n}
              </Label>
              <Label size={18} color={C.mute}>{`${r.h} hundreds · ${r.tests} Tests`}</Label>
            </div>
            <div style={{ position: "relative", marginTop: 10, height: pant ? 64 : 46 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: (760 * per * p) / 44, background: col }} />
              <div style={{ position: "absolute", left: (760 * per * p) / 44 + 16, top: pant ? -10 : -8 }}>
                <Disp size={pant ? 74 : 56} color={col}>
                  {(per * p).toFixed(per < 10 ? 1 : 0)}
                </Disp>
              </div>
            </div>
          </div>
        );
      })}
    </Shell>
  );
};

/* ================= S3 — THE WORLD ================= */
const s3Beats = (fps: number) => ({ dot: wordAt(fps, "s3", "dot", 1.58), most: wordAt(fps, "s3", "most", 5.8), pant: wordAt(fps, "s3", "punt", 12.08), n74: wordAt(fps, "s3", "74", 14.78), gil: wordAt(fps, "s3", "gilchrist", 17.64), n82: wordAt(fps, "s3", "82", 21.2) });
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const X = (sr: number) => 150 + ((sr - 40) / 50) * 820;
  const Y = (avg: number) => 1180 - ((avg - 25) / 25) * 700;
  return (
    <Shell>
      <Kicker title="The world's keepers" sub="Test batting average v strike rate" subAt={b.dot - 6} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: fade(frame, b.dot - 8) }}>
        <line x1={150} y1={1180} x2={980} y2={1180} stroke={C.ink} strokeWidth={2} />
        <line x1={150} y1={480} x2={150} y2={1180} stroke={C.ink} strokeWidth={2} />
        {[40, 50, 60, 70, 80, 90].map((v) => (
          <text key={v} x={X(v)} y={1214} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={800} fontSize={18} fill={C.mute}>
            {v}
          </text>
        ))}
        {[30, 35, 40, 45, 50].map((v) => (
          <text key={v} x={136} y={Y(v) + 6} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={800} fontSize={18} fill={C.mute}>
            {v}
          </text>
        ))}
        <text x={980} y={1250} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={800} fontSize={16} fill={C.mute} letterSpacing="2">
          RUNS PER 100 BALLS →
        </text>
        <text x={160} y={470} fontFamily={theme.fonts.body} fontWeight={800} fontSize={16} fill={C.mute} letterSpacing="2">
          ↑ AVERAGE
        </text>
        <ellipse cx={X(56)} cy={Y(35)} rx={210} ry={150} fill={C.line} opacity={ease(frame, b.most - 6, 14) * 0.9} />
      </svg>
      {data.scatter.map((d, i) => {
        const pant = d.n === "Pant", gil = d.n === "Gilchrist";
        const at = pant ? b.pant - 4 : gil ? b.gil - 6 : b.dot + i * 3;
        const p = useP(at);
        const col = pant ? C.accent : gil ? C.ink : C.mute;
        const r = pant ? 22 : gil ? 16 : 11;
        return (
          <div key={d.n} style={{ position: "absolute", left: X(d.sr) - r, top: Y(d.avg) - r, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `scale(${p})` }}>
            <div style={{ width: 2 * r, height: 2 * r, borderRadius: 2 * r, background: col, boxShadow: pant ? `0 0 0 10px ${C.accentSoft}` : undefined }} />
            <div style={{ position: "absolute", left: 2 * r + 8, top: pant ? -6 : -2, whiteSpace: "nowrap" }}>
              <Label size={pant ? 26 : gil ? 22 : 16} color={col} weight={900}>
                {pant ? `Pant · ${d.avg} · ${d.sr}` : gil ? `Gilchrist · ${d.avg} · ${d.sr.toFixed(0)}` : d.n}
              </Label>
            </div>
          </div>
        );
      })}
      <Footnote text="Cricsheet ball-by-ball since 2002 · Gilchrist and Dhoni full careers · Pant to Wellington 2026" at={b.gil} top={1270} />
    </Shell>
  );
};

/* ================= S4 — THE TEMPO GAP ================= */
const s4Beats = (fps: number) => ({ compare: wordAt(fps, "s4", "compare", 2.52), watling: wordAt(fps, "s4", "watling", 6.22), dhoni: wordAt(fps, "s4", "doni", 9.32), n25: wordAt(fps, "s4", "25", 13.06), edg: wordAt(fps, "s4", "edge", 15.16), n98: wordAt(fps, "s4", "98", 16.46), n146: wordAt(fps, "s4", "146", 18.74), tempo: sentence(fps, "s4", 3).from, changes: wordAt(fps, "s4", "changes", 25.3) });
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const Z = 600, U = 12; // zero line, px per run
  const at = (n: string, i: number) => (n === "Pant" ? b.n25 - 6 : n === "Watling" || n === "Saha" ? b.watling - 6 : n === "Dhoni" ? b.dhoni - 6 : b.compare + i * 3);
  return (
    <Shell>
      <Kicker title="The tempo gap" sub="His strike rate minus his own top-order teammates'" subAt={b.compare - 6} outAt={b.edg - 8} />
      <div style={{ opacity: 1 - fade(frame, b.edg - 8, 8) }}>
        <div style={{ position: "absolute", left: Z, top: 430, width: 2, height: 10 * 74, background: C.ink }} />
        {data.tempo.map((t, i) => {
          const p = ease(frame, at(t.n, i), 16);
          const pant = t.n === "Pant";
          const col = pant ? C.accent : t.gap < 0 ? C.red : C.ink;
          const w = Math.abs(t.gap) * U * p;
          return (
            <div key={t.n} style={{ position: "absolute", left: 70, right: 70, top: 440 + i * 74, height: 60, opacity: fade(frame, at(t.n, i) - 2) }}>
              <div style={{ position: "absolute", left: 0, top: 14, width: 280 }}>
                <Label size={pant ? 24 : 20} color={col} weight={900}>
                  {t.n === "Gilchrist" ? "Gilchrist*" : t.n}
                </Label>
              </div>
              <div style={{ position: "absolute", left: t.gap >= 0 ? Z - 70 : Z - 70 - w, top: 10, width: w, height: pant ? 40 : 30, background: col }} />
              <div style={{ position: "absolute", left: t.gap >= 0 ? Z - 70 + w + 12 : Z - 70 - w - 110, top: 2, width: 100, textAlign: t.gap >= 0 ? "left" : "right" }}>
                <Disp size={pant ? 50 : 40} color={col}>{`${t.gap > 0 ? "+" : ""}${(t.gap * p).toFixed(1)}`}</Disp>
              </div>
            </div>
          );
        })}
        <Footnote text="*Gilchrist: Tests from 2002 to 2008 only, in the ball-by-ball data" at={b.compare + 30} top={1210} />
      </div>
      {/* Edgbaston */}
      <div style={{ opacity: fade(frame, b.edg - 6) }}>
        <Cutout src="pant-hit-cut.png" x={470} y={330} h={640} at={b.edg - 4} from="right" />
        <div style={{ position: "absolute", left: 70, top: 380 }}>
          <Label size={22} color={C.mute}>
            Edgbaston · 2022
          </Label>
          <div style={{ marginTop: 10, opacity: fade(frame, b.n98 - 6) }}>
            <Label size={20} color={C.mute}>
              India were
            </Label>
            <div>
              <Disp size={120} color={C.red}>
                98/5
              </Disp>
            </div>
          </div>
          <div style={{ marginTop: 20, height: 220 }}>
            <Slam text="146" at={b.n146 - 4} size={210} color={C.accent} />
          </div>
          <div style={{ opacity: fade(frame, b.n146 + 10) }}>
            <Label size={26} color={C.ink2} weight={900}>
              off 111 balls
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 1080, textAlign: "center", opacity: fade(frame, b.tempo - 4) }}>
          <Serif size={56} weight={900}>
            He doesn't fit the tempo. <span style={{ color: C.accent }}>He changes it.</span>
          </Serif>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S5 — SIXES ================= */
const s5Beats = (fps: number) => ({ n108: wordAt(fps, "s5", "108", 2.32), gil: wordAt(fps, "s5", "gilchrist", 6.12) });
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const rows = [
    { n: "Rishabh Pant", v: 108, at: b.n108 - 4, c: C.accent },
    { n: "Adam Gilchrist", v: 100, at: b.gil - 6, c: C.ink },
    { n: "MS Dhoni", v: 78, at: b.gil + 6, c: C.ink },
  ];
  return (
    <Shell>
      <Kicker title="Most Test sixes by a wicketkeeper" size={48} />
      <Cutout src="pant-flick-cut.png" x={600} y={360} h={560} at={4} from="right" />
      <div style={{ position: "absolute", left: 70, top: 420 }}>
        <Slam text="108" at={b.n108 - 4} size={280} color={C.accent} />
      </div>
      {rows.map((r, i) => {
        const p = ease(frame, r.at, 16);
        return (
          <div key={r.n} style={{ position: "absolute", left: 70, right: 70, top: 900 + i * 100, opacity: fade(frame, r.at - 2) }}>
            <Label size={20} color={r.c} weight={900}>
              {r.n}
            </Label>
            <div style={{ position: "relative", marginTop: 8, height: 40 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 760 * (r.v / 110) * p, background: r.c }} />
              <div style={{ position: "absolute", left: 760 * (r.v / 110) * p + 14, top: -8 }}>
                <Disp size={52} color={r.c}>
                  {String(Math.round(r.v * p))}
                </Disp>
              </div>
            </div>
          </div>
        );
      })}
    </Shell>
  );
};

/* ================= S6 — HOME AND AWAY ================= */
const s6Beats = (fps: number) => ({ home: wordAt(fps, "s6", "home", 0.14), spin: wordAt(fps, "s6", "spin", 2.88), away: wordAt(fps, "s6", "away", 6.52), dhoni: wordAt(fps, "s6", "doney", 9.72), since: sentence(fps, "s6", 1).from, three: wordAt(fps, "s6", "three", 15.38), seven: wordAt(fps, "s6", "seven", 18.28), sena: wordAt(fps, "s6", "countries", 19.84), never: wordAt(fps, "s6", "never", 22.58) });
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const keepers: [string, number[], number][] = [
    ["Pant", data.home.Pant, b.home - 4],
    ["Dhoni", data.home.Dhoni, b.dhoni - 6],
    ["Saha", data.home.Saha, b.dhoni + 6],
  ];
  return (
    <Shell>
      <Kicker title="Home and away" sub="Test batting average" outAt={b.since} />
      <div style={{ opacity: 1 - fade(frame, b.since - 6, 8) }}>
        {keepers.map(([n, [h, a], at], i) => {
          const ph = ease(frame, at, 16), pa = ease(frame, n === "Pant" ? b.away - 6 : at + 6, 16);
          const col = n === "Pant" ? C.accent : C.ink;
          return (
            <div key={n} style={{ position: "absolute", left: 70, right: 70, top: 440 + i * 210, opacity: fade(frame, at - 2) }}>
              <Disp size={52} color={col}>
                {n}
              </Disp>
              {[
                ["Home", h, ph],
                ["Away", a, pa],
              ].map(([l, v, p]) => (
                <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
                  <div style={{ width: 90 }}>
                    <Label size={16} color={C.mute}>
                      {l as string}
                    </Label>
                  </div>
                  <div style={{ height: 30, width: 720 * ((v as number) / 55) * (p as number), background: l === "Home" ? col : n === "Pant" ? C.red : C.mute }} />
                  <Disp size={40} color={col}>
                    {((v as number) * (p as number)).toFixed(1)}
                  </Disp>
                </div>
              ))}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 70, top: 1100, opacity: fade(frame, b.spin - 6) }}>
          <Tag text={`At home v spin: ${data.spin_home_sr.toFixed(0)} runs per 100 balls`} color={C.accent} size={24} />
        </div>
      </div>
      {/* away hundreds */}
      <div style={{ opacity: fade(frame, b.since - 4) }}>
        <div style={{ position: "absolute", left: 70, top: 330 }}>
          <Serif size={52}>Away Test hundreds</Serif>
          <div style={{ marginTop: 6 }}>
            <Label size={20}>Since 2002</Label>
          </div>
        </div>
        {[
          { n: "India's other keepers", k: 3, at: b.three - 6, c: C.ink },
          { n: "Rishabh Pant", k: 7, at: b.seven - 6, c: C.accent },
        ].map((r, i) => (
          <div key={r.n} style={{ position: "absolute", left: 70, top: 500 + i * 190, opacity: fade(frame, r.at) }}>
            <Label size={22} color={r.c} weight={900}>
              {r.n}
            </Label>
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              {Array.from({ length: r.k }).map((_, j) => (
                <div key={j} style={{ width: 84, height: 84, borderRadius: 84, background: r.c, opacity: fade(frame, r.at + j * 3, 6) }} />
              ))}
              <div style={{ marginLeft: 10, opacity: fade(frame, r.at + 20) }}>
                <Disp size={84} color={r.c}>
                  {String(r.k)}
                </Disp>
              </div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 70, right: 70, top: 920, display: "flex", flexWrap: "wrap", gap: 12, opacity: fade(frame, b.sena - 8) }}>
          {["England · 114", "Australia · 159*", "South Africa · 100*", "New Zealand · 128"].map((t, i) => (
            <div key={t} style={{ opacity: fade(frame, b.sena - 8 + i * 4) }}>
              <Tag text={t} color={C.accent} size={22} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 70, top: 1060, opacity: fade(frame, b.never - 6) }}>
          <Tag text="Dhoni in SENA countries: 0 hundreds" color={C.ink} size={22} />
        </div>
      </div>
    </Shell>
  );
};

/* ================= S7 — LOSING SITUATIONS ================= */
const s7Beats = (fps: number) => ({ n34: wordAt(fps, "s7", "34", 5.9), decock: wordAt(fps, "s7", "decock", 7.52), fourth: sentence(fps, "s7", 1).from, n114: wordAt(fps, "s7", "114", 13.46), n97: wordAt(fps, "s7", "97", 15.56), n89: wordAt(fps, "s7", "89", 18.78), n64: wordAt(fps, "s7", "64", 21.98), n57: wordAt(fps, "s7", "57", 25.04), avg41: sentence(fps, "s7", 2).from, lose: sentence(fps, "s7", 3).from, n39: wordAt(fps, "s7", "39", 34.04), n27: wordAt(fps, "s7", "27", 36.42), defeat: wordAt(fps, "s7", "defeat", 39.68) });
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  return (
    <Shell>
      {/* A: in trouble */}
      <div style={{ opacity: 1 - fade(frame, b.fourth - 8, 8) }}>
        <Kicker title="Walking in at 4 down, under 150" sub="Average in those innings" />
        <Lollipop
          top={460}
          rowH={100}
          max={50}
          ticks={[10, 20, 30, 40, 50]}
          rows={data.trouble.map((t, i) => ({ name: t.n.toUpperCase(), sub: `${t.inns} innings`, value: t.v, at: t.n === "Pant" ? b.n34 - 6 : t.n === "de Kock" || t.n === "Watling" ? b.decock - 6 : 14 + i * 4, tone: t.n === "Pant" ? ("pick" as const) : ("main" as const) }))}
        />
      </div>
      {/* B: the fourth innings */}
      <div style={{ opacity: win(frame, b.fourth - 4, b.lose) }}>
        <Kicker title="The fourth innings" sub="When Tests are decided" />
        <Road
          width={1700}
          y={1000}
          stations={[
            { x: 300, value: "114", date: "2018", place: "The Oval", note: "His first Test hundred", at: b.n114 - 4, tone: "ink" },
            { x: 700, value: "97", date: "Jan 2021", place: "Sydney", note: "Test saved", at: b.n97 - 4, tone: "accent" },
            { x: 1100, value: "89*", date: "Jan 2021", place: "The Gabba", note: "Chase won · series won", at: b.n89 - 4, tone: "accent" },
            { x: 1500, value: "64", date: "Nov 2024", place: "Mumbai", note: "The rest of the innings: 57", at: b.n64 - 4, tone: "ink" },
          ]}
          camera={[
            { t: 0, x: 300 },
            { t: b.n97, x: 700 },
            { t: b.n89, x: 1100 },
            { t: b.n64, x: 1500 },
          ]}
        />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", gap: 30, opacity: fade(frame, b.avg41 - 4) }}>
          <Tag text={`4th-innings average · Pant ${data.fourth.Pant.toFixed(0)}`} color={C.accent} size={26} />
          <Tag text={`Dhoni ${data.fourth.Dhoni.toFixed(0)}`} color={C.ink} size={26} />
        </div>
      </div>
      {/* C: in defeat */}
      <div style={{ opacity: fade(frame, b.lose - 4) }}>
        <Kicker title="Average in Tests his team lost" />
        <Lollipop
          top={440}
          rowH={100}
          max={45}
          ticks={[10, 20, 30, 40]}
          rows={data.lost.map((t, i) => ({ name: (t.n === "Gilchrist" ? "Gilchrist*" : t.n).toUpperCase(), value: t.v, at: t.n === "Pant" ? b.n39 - 6 : t.n === "Dhoni" ? b.n27 - 6 : b.lose + 6 + i * 4, tone: t.n === "Pant" ? ("pick" as const) : ("main" as const) }))}
        />
        <Footnote text="*Gilchrist: 2002–08 only · ball-by-ball since 2002" at={b.lose + 20} top={1180} />
      </div>
    </Shell>
  );
};

/* ================= S8 — VERDICT ================= */
const s8Beats = (fps: number) => ({ close: wordAt(fps, "s8", "close", 7.44), gloves: sentence(fps, "s8", 1).from, brand: sentence(fps, "s8", 2).from - 6 });
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  return (
    <Shell exit={false} drift={0.02}>
      <CaseFile src="pant-portrait.jpg" at={4} x={250} y={300} w={580} h={660} pos="50% 18%" tilt={-3} />
      <div style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
        <Stamp text="Nobody close" sub="India's keeper-batters" at={b.close} x={270} y={930} rotate={-5} size={84} />
      </div>
      <StatRow
        top={1150}
        at={20}
        outAt={b.gloves - 4}
        size={64}
        stats={[
          { v: "9", l: "Hundreds", accent: true },
          { v: "74", l: "Per 100 balls", accent: true },
          { v: "108", l: "Sixes" },
          { v: "7", l: "Away hundreds" },
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center", opacity: win(frame, b.gloves - 2, b.brand + 2) }}>
        <Serif size={56} weight={900}>
          The gloves? <span style={{ color: C.mute }}>Another debate.</span>
        </Serif>
      </div>
      <Brand at={b.brand + 2} top={1150} series={config.series} tagline={config.tagline} />
    </Shell>
  );
};

/* ================= wiring ================= */
export const STORY = {
  scenes: [
    ["s1", S1],
    ["s2", S2],
    ["s3", S3],
    ["s4", S4],
    ["s5", S5],
    ["s6", S6],
    ["s7", S7],
    ["s8", S8],
  ] as [string, React.FC][],
  warmFrom: (fps: number) => scene(fps, "s8").from,
  mastheadOffAt: (fps: number) => scene(fps, "s8").from + s8Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s8").from + sentence(fps, "s8", 2).from - 2,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7", "s8"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.24 }));
    add("s1", 2, "pen.wav", 0.35);
    add("s1", 14, "impact.wav", 0.5);
    add("s1", b1.dhoni - 4, "pop.wav", 0.3);
    add("s1", b1.pant - 4, "slam.wav", 0.45);
    [b2.engineer, b2.kirmani, b2.saha, b2.dhoni].forEach((x) => add("s2", x - 6, "pop.wav", 0.24));
    add("s2", b2.pant - 2, "slam.wav", 0.45);
    add("s3", b3.dot, "ticks.wav", 0.28);
    add("s3", b3.pant - 4, "slam.wav", 0.45);
    add("s3", b3.gil - 6, "pop.wav", 0.35);
    add("s4", b4.compare, "ticks.wav", 0.25);
    add("s4", b4.n25 - 6, "slam.wav", 0.45);
    add("s4", b4.edg - 4, "whip.wav", 0.3);
    add("s4", b4.n146 - 4, "slam.wav", 0.5);
    add("s4", b4.n146, "crowd.wav", 0.22);
    add("s5", b5.n108 - 4, "slam.wav", 0.55);
    add("s5", b5.n108, "crowd.wav", 0.22);
    add("s6", b6.home - 4, "pop.wav", 0.25);
    add("s6", b6.three - 6, "pop.wav", 0.3);
    add("s6", b6.seven - 6, "rise.wav", 0.25);
    add("s6", b6.seven + 14, "impact.wav", 0.4);
    add("s7", b7.n34 - 6, "pop.wav", 0.3);
    [b7.n114, b7.n97, b7.n89, b7.n64].forEach((x, i) => add("s7", x - 4, i === 2 ? "slam.wav" : "pop.wav", i === 2 ? 0.45 : 0.3));
    add("s7", b7.n89, "crowd.wav", 0.22);
    add("s7", b7.n39 - 6, "slam.wav", 0.45);
    add("s8", 6, "swoosh.wav", 0.22);
    add("s8", b8.close - 2, "slam.wav", 0.55);
    add("s8", b8.close - 2, "impact.wav", 0.5);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.25 });
    return c;
  },
};

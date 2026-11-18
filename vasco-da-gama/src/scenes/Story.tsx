// Five scenes + the camera path. All beats come from the narration timeline (timing.ts).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caravel, GeoLabel, Key, LonLat, Marker, Region, Route, useProject, WIDTH, HEIGHT } from "../components/Map";
import { CLAMP, breathe } from "../components/Motion";
import { Appear, DateStamp, Frame, InfoCard, PepperPlate, PriceLedger } from "../components/Overlays";
import { theme } from "../theme";
import { scene, SceneId, sentence } from "../timing";

const C = theme.colors;
const seg = (fps: number, id: SceneId, i: number) => sentence(fps, id, i).from;
const segEnd = (fps: number, id: SceneId, i: number) => sentence(fps, id, i).to;

// ---------------- places ----------------
export const P = {
  lisbon: [-9.14, 38.72] as LonLat,
  calicut: [75.78, 11.25] as LonLat,
  venice: [12.33, 45.44] as LonLat,
  alexandria: [29.92, 31.2] as LonLat,
  cairo: [31.24, 30.04] as LonLat,
  aden: [45.03, 12.8] as LonLat,
  srilanka: [80.7, 7.9] as LonLat,
  maluku: [127.8, -3.2] as LonLat,
  bojador: [-14.48, 26.13] as LonLat,
  congo: [12.25, -6.05] as LonLat,
  cape: [18.47, -34.36] as LonLat,
  kwaaihoek: [26.6, -33.7] as LonLat,
  capeverde: [-23.5, 15.0] as LonLat,
  malindi: [40.12, -3.22] as LonLat,
  mozambique: [40.73, -15.03] as LonLat,
};

// ---------------- routes ----------------
const SPICE_A: LonLat[] = [P.calicut, [72, 12.6], [64, 13.8], [55, 13.6], [48.5, 12.4], [43.4, 12.6]];
const SPICE_B: LonLat[] = [[43.4, 12.6], [40.5, 16.5], [37.5, 21], [34.4, 26.0], [32.7, 26.2], [31.6, 28.4], P.cairo, P.alexandria];
const SPICE_C: LonLat[] = [P.alexandria, [24.5, 34.0], [19.5, 37.8], [17.2, 40.9], [14.2, 43.6], P.venice, [10.8, 47.6], [8.2, 50.0]];

const DIAS_A: LonLat[] = [P.lisbon, [-11.5, 35], [-13.2, 29.5], P.bojador];
const DIAS_B: LonLat[] = [P.bojador, [-18, 20.5], [-18.2, 14.7], [-14.5, 8.5], [-8.5, 4.3], [1.5, 3.6], [8.6, 1.2], [11.4, -3], P.congo];
const DIAS_C: LonLat[] = [P.congo, [11.2, -12], [12.6, -20], [14.6, -27.5], [16.8, -33.2], [18.6, -35.0], [22.3, -34.5], P.kwaaihoek];

const GAMA_1: LonLat[] = [P.lisbon, [-12.5, 33.5], [-15.6, 28.2], [-20, 20], P.capeverde];
const GAMA_2: LonLat[] = [P.capeverde, [-24.5, 6], [-28.5, -4], [-31, -14], [-28.5, -24], [-18, -31.2], [-4, -33.6], [17.9, -32.7]];
const GAMA_3: LonLat[] = [[17.9, -32.7], [17.4, -34.6], [18.6, -35.1], [22.3, -34.7], [28.2, -33.4], [32.6, -29.2], [35.8, -24.5], [40.9, -15.2], [40.8, -9], [40.0, -4.2], P.malindi];
const GAMA_4: LonLat[] = [P.malindi, [50, 0.2], [60, 5], [68, 9], [75.5, 11.3]];
const GHOST: LonLat[] = [P.capeverde, [-17.8, 14.2], [-14.5, 8.5], [-8.5, 4.3], [1.5, 3.6], [8.6, 1.2], [11.4, -3], [12, -12], [13, -21], [15, -28.5], [18.3, -34.4]];

const prog = (frame: number, a: number, b: number, ease = theme.ease.inOut) => interpolate(frame, [a, b], [0, 1], { easing: ease, ...CLAMP });

// ---------------- camera ----------------
export const cameraKeys = (fps: number): Key[] => {
  const A = (id: SceneId, rel: number) => scene(fps, id).from + rel;
  const S = (id: SceneId, i: number) => A(id, seg(fps, id, i));
  return [
    { f: 0, cam: { lon: 74, lat: 13, w: 34 } },
    { f: S("s1", 0) + 150, cam: { lon: 75.6, lat: 11.4, w: 12 } },
    { f: S("s1", 1) - 4, cam: { lon: 75.6, lat: 11.4, w: 12 } },
    { f: S("s1", 1) + 60, cam: { lon: 28, lat: 4, w: 128 } },
    { f: S("s1", 4) - 6, cam: { lon: 28, lat: 4, w: 128 } },
    { f: S("s1", 4) + 70, cam: { lon: 76, lat: 11, w: 16 } },
    { f: S("s2", 2) - 4, cam: { lon: 76, lat: 11, w: 16 } },
    { f: S("s2", 2) + 70, cam: { lon: 100, lat: 4, w: 72 } },
    { f: S("s2", 3) - 4, cam: { lon: 100, lat: 4, w: 72 } },
    { f: S("s2", 3) + 80, cam: { lon: 44, lat: 28, w: 70 } },
    { f: S("s3", 7) - 4, cam: { lon: 44, lat: 28, w: 70 } },
    { f: S("s3", 7) + 60, cam: { lon: 32, lat: 36, w: 58 } },
    { f: A("s4", 0), cam: { lon: 32, lat: 36, w: 58 } },
    { f: S("s4", 0) + 70, cam: { lon: -6, lat: 39, w: 26 } },
    { f: S("s4", 1) - 4, cam: { lon: -6, lat: 39, w: 26 } },
    { f: S("s4", 1) + 60, cam: { lon: -17, lat: 32, w: 46 } },
    { f: S("s4", 3) + 10, cam: { lon: -14, lat: 24, w: 50 } },
    { f: S("s4", 4) + 10, cam: { lon: 2, lat: 6, w: 76 } },
    { f: S("s4", 5) + 80, cam: { lon: 10, lat: -12, w: 82 } },
    { f: S("s4", 6) + 30, cam: { lon: 21, lat: -31, w: 34 } },
    { f: A("s5", 0) + 4, cam: { lon: 21, lat: -31, w: 34 } },
    { f: S("s5", 0) + 50, cam: { lon: 25, lat: 3, w: 124 } },
    { f: S("s5", 4) + 20, cam: { lon: 25, lat: 3, w: 124 } },
    { f: S("s5", 4) + 200, cam: { lon: 26, lat: 3, w: 116 } },
  ];
};

// Static caravels at anchor.
const Ships: React.FC<{ at: LonLat[]; delay: number; scale?: number; exit?: number }> = ({ at, delay, scale = 1, exit }) => {
  const project = useProject();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 12], [0, 1], CLAMP);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {at.map((ll, i) => {
        const [x, y] = project(ll);
        const p = spring({ frame: frame - delay - i * 6, fps, config: theme.spring.smooth });
        return (
          <g key={i} transform={`translate(${x},${y + Math.sin((frame + i * 20) / 11) * 2.5 + (1 - p) * 30}) scale(${scale * p}) rotate(${Math.sin((frame + i * 13) / 15) * 3})`} opacity={p}>
            <Caravel />
          </g>
        );
      })}
    </svg>
  );
};

// Screen-space "?" seal.
const Question: React.FC<{ at: LonLat; delay: number; size?: number; exit?: number }> = ({ at, delay, size = 160, exit }) => {
  const project = useProject();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [x, y] = project(at);
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 10], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p * breathe(frame, 16, 0.03)}) rotate(${(1 - p) * -20}deg)`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) * (1 - out), fontFamily: theme.fonts.title, fontWeight: 700, fontSize: size, color: C.red, textShadow: `0 0 30px ${C.redGlow}, 0 4px 0 ${C.parchmentHi}` }}>
      ?
    </div>
  );
};

// =====================================================================================
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s1", i);
  const sea = s(1) + 50;
  return (
    <AbsoluteFill>
      <GeoLabel at={[66, 15]} text="ARABIAN SEA" delay={10} size={34} exit={s(1) + 10} />
      <GeoLabel at={[77.2, 10.4]} text="Kerala" delay={s(0) + 50} size={40} italic color={C.ink} spacing={0.05} exit={s(1)} />
      <Marker at={P.calicut} delay={s(0) + 64} label="Calicut" sub="KOZHIKODE" side="r" size={38} exit={s(1) + 30} />
      <Ships at={[[75.15, 11.75], [74.85, 11.2], [75.25, 10.95]]} delay={s(0) + 20} scale={1.25} exit={s(1) + 10} />
      <DateStamp delay={s(0) + 2} exit={s(1) - 6} top="the twentieth of May" big="1498" x={1330} y={120} />
      {/* the whole voyage, sketched quickly */}
      <Route way={[...GAMA_1, ...GAMA_2.slice(1), ...GAMA_3.slice(1), ...GAMA_4.slice(1)]} p={prog(frame, sea, sea + 110)} width={3.5} opacity={interpolate(frame, [s(4) - 6, s(4) + 10], [1, 0], CLAMP)} arrow />
      <Marker at={P.lisbon} delay={sea - 6} label="Lisbon" side="l" size={32} exit={s(4)} />
      <Marker at={P.calicut} delay={sea + 104} label="Calicut" side="r" size={32} exit={s(4)} />
      <GeoLabel at={[20, 5]} text="AFRICA" delay={sea + 10} size={44} exit={s(4)} spacing={0.6} />
      <GeoLabel at={[-25, -10]} text="OCEANUS" delay={sea + 30} size={30} exit={s(4)} />
      <GeoLabel at={[75, -15]} text="INDIAN OCEAN" delay={sea + 40} size={30} exit={s(4)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <Appear delay={s(2) + 6} exit={s(3) - 4}>
          <Frame pad="16px 40px">
            <div style={{ fontFamily: theme.fonts.title, fontSize: 40, color: C.ink, letterSpacing: "0.1em" }}>THE FIRST SEA ROUTE FROM EUROPE TO INDIA</div>
          </Frame>
        </Appear>
      </div>
      <GeoLabel at={[-9, 43.5]} text="PORTUGAL" delay={s(3) + 8} size={32} color={C.red} exit={s(4)} spacing={0.3} />
      <Question at={[-2, 30]} delay={s(3) + 30} size={150} exit={s(4) - 4} />
      {/* the seed */}
      <Marker at={P.calicut} delay={s(4) + 60} side="r" color={C.ink} exit={scene(fps, "s1").duration - 10} />
    </AbsoluteFill>
  );
};

// =====================================================================================
const MALABAR: LonLat[] = [[74.85, 12.9], [75.35, 11.9], [75.78, 11.25], [76.27, 9.95], [76.6, 8.88], [76.95, 8.45]];

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s2", i);
  const coast = prog(frame, s(1) + 10, s(1) + 60);
  return (
    <AbsoluteFill>
      <PepperPlate delay={s(0) - 4} exit={s(2) + 20} x={1360} y={190} />
      <Route way={MALABAR} p={coast} color={C.green} width={14} dash="1 0" opacity={0.75 * interpolate(frame, [s(3) + 20, s(3) + 40], [1, 0], CLAMP)} />
      <GeoLabel at={[72.6, 11.4]} text="Malabar Coast" delay={s(1) + 30} size={40} italic color={C.green} spacing={0.04} exit={s(2) + 30} />
      <Marker at={P.srilanka} delay={s(2) + 60} label="Ceylon" sub="CINNAMON" side="r" color={C.gold} exit={s(3) + 20} />
      <Marker at={P.maluku} delay={s(2) + 90} label="Spice Islands" sub="CLOVES · NUTMEG" side="l" color={C.gold} exit={s(3) + 20} />
      <Marker at={[76.2, 10.6]} delay={s(2) + 40} label="Malabar" sub="PEPPER · GINGER" side="r" color={C.green} exit={s(3) + 20} />
      <GeoLabel at={[88, -8]} text="INDIAN OCEAN" delay={s(2) + 50} size={32} exit={s(3) + 20} />
      {/* Europe's appetite */}
      <GeoLabel at={[10, 50]} text="EUROPE" delay={s(3) + 60} size={46} spacing={0.6} color={C.ink} />
      <div style={{ position: "absolute", left: 120, top: 640, display: "flex", gap: 22 }}>
        {["the food of the rich", "medicine", "a sign of wealth"].map((t, i) => (
          <Appear key={t} delay={s(3) + 80 + i * 22} exit={scene(fps, "s2").duration - 12}>
            <Frame pad="12px 26px">
              <div style={{ fontFamily: theme.fonts.hand, fontStyle: "italic", fontSize: 34, color: C.ink }}>{t}</div>
            </Frame>
          </Appear>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s3", i);
  const pa = prog(frame, s(1) + 6, segEnd(fps, "s3", 1));
  const pb = prog(frame, s(2), segEnd(fps, "s3", 2) + 6);
  const pc = prog(frame, s(3), segEnd(fps, "s3", 3) + 10);
  const shipOn = (a: number, b: number) => frame >= a && frame < b;
  const keys = s(6);
  const ottoman = interpolate(frame, [s(7) + 30, s(7) + 60], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <GeoLabel at={[62, 17]} text="ARABIAN SEA" delay={10} size={28} />
      <GeoLabel at={[38.7, 20.5]} text="RED SEA" delay={s(2)} size={22} spacing={0.25} />
      <GeoLabel at={[19, 34.3]} text="MARE MEDITERRANEUM" delay={s(3)} size={24} spacing={0.3} />
      <Marker at={P.calicut} delay={4} label="Calicut" side="r" />
      <Route way={SPICE_A} p={pa} ship={shipOn(s(1), s(2) + 10)} shipScale={0.8} arrow />
      <Route way={SPICE_B} p={pb} ship={shipOn(s(2), s(3))} shipScale={0.7} arrow />
      <Route way={SPICE_C} p={pc} ship={shipOn(s(3), s(4) + 20)} shipScale={0.7} arrow />
      <Marker at={[44.0, 13.5]} delay={s(1) + 40} label="Arab & Gujarati" sub="MERCHANTS" side="b" color={C.gold} size={28} />
      <Marker at={P.cairo} delay={s(2) + 70} label="Cairo" side="r" size={30} exit={keys} />
      <Marker at={P.alexandria} delay={s(2) + 100} label="Alexandria" side="l" size={30} />
      <Marker at={P.venice} delay={s(3) + 40} label="Venice" side="l" size={32} exit={keys + 14} />
      {/* each hand takes its cut */}
      <PriceLedger
        delay={s(4) - 6}
        exit={keys - 6}
        x={1330}
        y={70}
        steps={[
          { label: "Malabar grower", at: s(4) + 8 },
          { label: "Arabian Sea", at: s(4) + 22 },
          { label: "Egypt", at: s(4) + 36 },
          { label: "Venice", at: s(4) + 50 },
          { label: "European table", at: s(5) + 20 },
        ]}
      />
      {/* keys to the trade */}
      <Marker at={P.cairo} delay={keys + 8} label="Mamluk Egypt" side="b" color={C.gold} size={34} />
      <Marker at={P.venice} delay={keys + 26} label="Republic of Venice" side="r" color={C.gold} size={34} />
      {/* Ottoman shadow (approximate extent c. 1453: Anatolia + the Balkans) */}
      <Region ids={["792", "300", "100", "807", "008"]} p={ottoman} color={C.ottoman} hatch />
      <div style={{ opacity: ottoman }}>
        <GeoLabel at={[33, 40.6]} text="OTTOMAN EMPIRE" delay={s(7) + 40} size={30} color={C.ottoman} spacing={0.3} />
        <GeoLabel at={[33, 38.9]} text="after 1453 (approx. extent)" delay={s(7) + 60} size={24} color={C.ottoman} spacing={0.04} italic />
        <Marker at={[28.98, 41.01]} delay={s(7) + 40} label="Constantinople" sub="FELL 1453" side="t" color={C.ottoman} size={28} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================
export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s4", i);
  const pa = prog(frame, s(2) + 40, s(3) + 20);
  const pb = prog(frame, s(3) + 30, s(4) + 30);
  const pc = prog(frame, s(5) + 10, s(5) + 150);
  const door = spring({ frame: frame - s(6), fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <GeoLabel at={[-8.2, 40.2]} text="PORTUGAL" delay={s(0) + 50} size={38} color={C.red} spacing={0.3} exit={s(2) + 40} />
      <GeoLabel at={[-3.5, 40.3]} text="Castile" delay={s(0) + 70} size={30} italic spacing={0.05} exit={s(1) + 30} />
      <GeoLabel at={[10, 45.5]} text="→ the spice trade, far to the east" delay={s(0) + 90} size={28} italic color={C.inkDim} spacing={0.02} exit={s(1)} />
      <GeoLabel at={[-30, 33]} text="MARE OCEANUS" delay={s(1) + 20} size={40} spacing={0.5} />
      <GeoLabel at={[-30, 30.3]} text="the open Atlantic" delay={s(1) + 40} size={28} italic spacing={0.04} />
      <InfoCard delay={s(2) + 10} exit={s(3) + 40} x={90} y={560} title="PRINCE HENRY" sub={'"the Navigator", 1394–1460'} body="Sponsored decades of voyages down the African coast." />
      <Route way={DIAS_A} p={pa} width={4} />
      <Route way={DIAS_B} p={pb} width={4} />
      <Marker at={P.bojador} delay={s(3) + 6} label="Cape Bojador" sub="1434" side="r" size={34} />
      <Marker at={P.congo} delay={s(4) + 10} label="River Congo" sub="1482 · DIOGO CÃO" side="r" size={34} />
      <Route way={DIAS_C} p={pc} width={5} ship={pc > 0 && pc < 1 ? true : frame >= s(5) + 150} shipScale={0.9} />
      <InfoCard delay={s(5) + 20} exit={s(6) - 4} x={1290} y={140} title="BARTOLOMEU DIAS" sub="1488" body="Rounds the southern tip of Africa." width={480} />
      <Marker at={P.cape} delay={s(5) + 120} label="Cape of Good Hope" side="l" size={36} />
      {/* the door opens */}
      <div style={{ opacity: door }}>
        <GeoLabel at={[33, -29.5]} text="INDIAN OCEAN" delay={s(6) + 4} size={42} spacing={0.45} color={C.ink} />
      </div>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: door * 0.9 }}>
        <defs>
          <radialGradient id="doorglow">
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={1180} cy={720} r={380 * door * breathe(frame, 20, 0.04)} fill="url(#doorglow)" />
      </svg>
    </AbsoluteFill>
  );
};

// =====================================================================================
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s5", i);
  const p1 = prog(frame, s(0) + 30, s(1) + 10);
  const ghost = prog(frame, s(1) + 10, s(2) + 10);
  const p2 = prog(frame, s(2) + 30, s(3) - 10);
  const p3 = prog(frame, s(3) + 10, s(4) - 10);
  const p4 = prog(frame, s(4) - 10, s(4) + 60);
  const title = s(4) + 70;
  const on = (a: number, b: number) => frame >= a && frame < b;
  const months = interpolate(frame, [s(2) + 100, s(2) + 120], [0, 1], CLAMP) * interpolate(frame, [s(3) + 40, s(3) + 55], [1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <InfoCard delay={s(0) + 4} exit={s(1) + 30} x={1290} y={110} title="VASCO DA GAMA" sub="leaves Lisbon, 8 July 1497" body="Four ships, about 170 men." width={500} />
      <Marker at={P.lisbon} delay={s(0) + 20} label="Lisbon" side="l" size={32} />
      <Route way={GHOST} p={ghost} color={C.inkDim} width={3} dash="4 10" opacity={interpolate(frame, [title - 20, title], [1, 0], CLAMP)} />
      <GeoLabel at={[3, 8.5]} text="the expected way?" delay={s(1) + 40} size={28} italic color={C.inkDim} spacing={0.02} exit={s(3)} />
      <Route way={GAMA_1} p={p1} width={5} ship={on(s(0) + 30, s(2) + 30)} shipScale={0.9} />
      <Route way={GAMA_2} p={p2} width={6} ship={on(s(2) + 30, s(3) + 10)} shipScale={0.9} />
      <Route way={GAMA_3} p={p3} width={5} ship={on(s(3) + 10, s(4) - 10)} shipScale={0.9} />
      <Route way={GAMA_4} p={p4} width={5} ship={frame >= s(4) - 10} shipScale={0.9} />
      <div style={{ position: "absolute", left: 230, top: 700, opacity: months, transform: `translateY(${(1 - months) * 20}px)` }}>
        <Frame pad="14px 30px">
          <div style={{ fontFamily: theme.fonts.title, fontSize: 30, color: C.red, letterSpacing: "0.08em" }}>≈ 3 MONTHS</div>
          <div style={{ fontFamily: theme.fonts.body, fontStyle: "italic", fontSize: 26, color: C.ink }}>without sight of land</div>
        </Frame>
      </div>
      <Question at={[-36, -12]} delay={s(3) + 4} size={170} exit={title - 10} />
      <Marker at={P.calicut} delay={s(4) + 50} label="Calicut" side="r" size={32} />
      {/* title card */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Appear delay={title} y={40}>
          <Frame pad="40px 90px">
            <div style={{ fontFamily: theme.fonts.body, fontStyle: "italic", fontSize: 34, color: C.inkDim, textAlign: "center" }}>Vasco da Gama · 1497–1499</div>
            <div style={{ fontFamily: theme.fonts.title, fontWeight: 700, fontSize: 92, color: C.ink, letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.1, marginTop: 8 }}>
              THE SEA ROAD
              <br />
              <span style={{ color: C.red }}>TO INDIA</span>
            </div>
          </Frame>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

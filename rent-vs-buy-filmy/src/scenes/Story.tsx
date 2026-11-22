// Eight filmy scenes. Beats are tied to each spoken line (timing.ts); numbers come from model.json.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../components/Cast";
import { breathe, CLAMP, float } from "../components/Motion";
import { Curtain, Flash, Label, lakh, Num, Plaque, Pop, PosterText, Race, RaceLegend, tripleZoom } from "../components/Stage";
import model from "../model.json";
import { theme } from "../theme";
import { line, scene, SceneId } from "../timing";

const C = theme.colors;
const L = (fps: number, id: SceneId, i: number) => line(fps, id, i);
const M = model as unknown as Record<"base" | "panic", { arjun: number; meera: number }[]>;
const FINAL = { arjun: M.base[19].arjun, meera: M.base[19].meera, panic: M.panic[19].meera };
const ARJUN_8 = 90e5 * Math.pow(1.08, 20);

const Shell: React.FC<{ id: SceneId; children: React.ReactNode; noExit?: boolean }> = ({ id, children, noExit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene(fps, id).duration;
  const out = noExit ? 0 : interpolate(frame, [d - 8, d], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.06})` }}>{children}</AbsoluteFill>;
};
const At: React.FC<{ x?: number; y: number; w?: number; center?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ x = 110, y, w = 860, center = true, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", alignItems: center ? "center" : "stretch", ...style }}>{children}</div>
);
// A camera that pushes toward a point: scale + translate around (ox, oy).
const Camera: React.FC<{ s: number; ox?: number; oy?: number; children: React.ReactNode }> = ({ s, ox = 540, oy = 900, children }) => (
  <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px` }}>{children}</AbsoluteFill>
);
const Spot: React.FC<{ x: number; y: number; r?: number; color?: string; o?: number }> = ({ x, y, r = 330, color = "rgba(255,231,163,0.28)", o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r * 0.35, width: r * 2, height: r * 0.7, borderRadius: "50%", background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`, opacity: o }} />
);
const useCount = (to: number, start: number, len: number, from = 0) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + len], [from, to], { easing: theme.ease.out, ...CLAMP });
};

// =====================================================================================
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s1", i).from;
  const curtain = interpolate(frame, [6, 40], [1, 0], { easing: theme.ease.inOut, ...CLAMP });
  const castOut = l(2) + 70;
  return (
    <Shell id="s1">
      <At y={250}>
        <Pop delay={34} exit={l(1) - 6}>
          <Label size={30} color={C.gold}>A MONEY STORIES PRESENTATION</Label>
        </Pop>
        <Pop delay={l(0) + 4} exit={l(1) - 6} style={{ marginTop: 40 }}>
          <PosterText size={150} font="filmy">Bangalore</PosterText>
        </Pop>
        <Pop delay={l(0) + 40} exit={l(1) - 6} style={{ marginTop: 30 }}>
          <Label size={34} color={C.cream}>Two friends · Same age · Same salary</Label>
        </Pop>
      </At>
      {/* the two leads in spotlights */}
      <div style={{ opacity: interpolate(frame, [castOut, castOut + 10], [1, 0], CLAMP) }}>
        <Spot x={330} y={1240} o={interpolate(frame, [l(1), l(1) + 10], [0, 1], CLAMP)} />
        <Spot x={750} y={1240} o={interpolate(frame, [l(1) + 8, l(1) + 18], [0, 1], CLAMP)} />
        <div style={{ position: "absolute", left: 120, top: 600 }}>
          <Character who="arjun" mood="happy" size={420} delay={l(1)} />
        </div>
        <div style={{ position: "absolute", left: 540, top: 600 }}>
          <Character who="meera" mood="happy" size={420} delay={l(1) + 8} />
        </div>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", left: i ? 600 : 180, top: 420 + float(frame, 22 + i * 5, 6) }}>
            <Pop delay={l(1) + 60 + i * 8} config={theme.spring.bouncy}>
              <Plaque style={{ padding: "12px 26px" }}>
                <Num size={60}>₹25 L</Num>
              </Plaque>
            </Pop>
          </div>
        ))}
        <div style={{ position: "absolute", left: 110, top: 1150, width: 860, display: "flex", justifyContent: "space-around" }}>
          {[["ARJUN", C.arjun, "WILL BUY"], ["MEERA", C.meera, "WILL RENT"]].map(([n, c, v], i) => (
            <div key={n} style={{ textAlign: "center" }}>
              <Pop delay={l(1) + 20 + i * 8}>
                <div style={{ fontFamily: theme.fonts.poster, fontSize: 70, color: c, textShadow: `0 4px 0 ${C.ink}` }}>{n}</div>
              </Pop>
              <Pop delay={l(2) + (i ? 26 : 4)} config={theme.spring.bouncy}>
                <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, letterSpacing: "0.14em", color: C.ink, background: c, padding: "6px 22px", borderRadius: 10 }}>{v}</div>
              </Pop>
            </div>
          ))}
        </div>
      </div>
      {/* title poster */}
      <At y={540}>
        <Pop delay={castOut + 6} scale={1.4}>
          <PosterText size={170}>ARJUN</PosterText>
          <div style={{ fontFamily: theme.fonts.filmy, fontSize: 80, color: C.cream, textAlign: "center", margin: "-6px 0", textShadow: `0 3px 0 ${C.ink}` }}>vs</div>
          <PosterText size={170}>MEERA</PosterText>
        </Pop>
        <Pop delay={castOut + 24} style={{ marginTop: 36 }}>
          <Label size={34} color={C.cream}>ONE FLAT. TWO CHOICES. TWENTY YEARS.</Label>
        </Pop>
      </At>
      <Flash at={[castOut + 6]} strength={0.6} />
      <AbsoluteFill>
        <Curtain close={curtain} />
      </AbsoluteFill>
    </Shell>
  );
};

// =====================================================================================
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s2", i).from;
  const emi = useCount(62500, l(2) + 20, 40);
  // camera: start on Papa, swing to Arjun, then triple-zoom on Arjun's "Twenty years?!"
  const toArjun = interpolate(frame, [l(1) - 10, l(1) + 10], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const ox = 330 + toArjun * 420;
  const push = 1.08 + Math.sin(frame / 80) * 0.01;
  const z = tripleZoom(frame, l(3));
  const zoomOn = frame >= l(3) - 2;
  return (
    <Shell id="s2">
      <Camera s={zoomOn ? z * 1.05 : push} ox={zoomOn ? 760 : ox} oy={zoomOn ? 760 : 1000}>
        <Spot x={330} y={1300} o={1 - toArjun * 0.6} />
        <Spot x={760} y={1300} o={0.4 + toArjun * 0.6} />
        <div style={{ position: "absolute", left: 100, top: 760 }}>
          <Character who="papa" mood={frame < l(1) ? "smug" : "happy"} size={430} delay={0} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 780 }}>
          <Character who="arjun" mood={frame >= l(3) ? "shocked" : frame >= l(2) + 30 ? "worried" : "neutral"} size={410} delay={6} />
        </div>
      </Camera>
      <At y={170}>
        <Pop delay={l(0) + 70} exit={l(1) - 4}>
          <Plaque>
            <div style={{ fontFamily: theme.fonts.filmy, fontSize: 56, color: C.cream, textAlign: "center", lineHeight: 1.15 }}>
              "Property never
              <br />
              goes down!"
            </div>
          </Plaque>
        </Pop>
      </At>
      <At y={170}>
        <Pop delay={l(1) + 20} exit={l(2) - 4}>
          <Plaque style={{ textAlign: "center" }}>
            <Label>2BHK FLAT</Label>
            <Num size={110}>₹90 L</Num>
            <div style={{ display: "flex", gap: 30, marginTop: 14, justifyContent: "center" }}>
              <div><Label size={24}>DOWN + STAMP DUTY</Label><Num size={44} color={C.cream}>₹25 L</Num></div>
              <div><Label size={24}>HOME LOAN @ 8.5%</Label><Num size={44} color={C.cream}>₹72 L</Num></div>
            </div>
          </Plaque>
        </Pop>
      </At>
      <At y={170}>
        <Pop delay={l(2) + 10} config={theme.spring.stamp} scale={1.6}>
          <Plaque color={C.red} style={{ textAlign: "center" }}>
            <Label color={C.cream}>EMI · EVERY MONTH</Label>
            <Num size={130}>₹{Math.round(emi).toLocaleString("en-IN")}</Num>
            <Label size={30} color={C.red}>× 240 MONTHS</Label>
          </Plaque>
        </Pop>
      </At>
      <Flash at={[l(3), l(3) + 9, l(3) + 18]} strength={0.32} />
    </Shell>
  );
};

// =====================================================================================
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s3", i).from;
  const toMeera = interpolate(frame, [l(1) - 10, l(1) + 10], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const z = tripleZoom(frame, l(3));
  const zoomOn = frame >= l(3) - 2;
  return (
    <Shell id="s3">
      <Camera s={zoomOn ? z * 1.05 : 1.08} ox={zoomOn ? 320 : 330 + toMeera * 420} oy={zoomOn ? 760 : 1000}>
        <Spot x={320} y={1300} o={1 - toMeera * 0.6} color="rgba(255,111,145,0.25)" />
        <Spot x={760} y={1300} o={0.4 + toMeera * 0.6} color="rgba(46,196,166,0.25)" />
        <div style={{ position: "absolute", left: 100, top: 770 }}>
          <Character who="maa" mood={frame >= l(3) ? "shocked" : "worried"} size={420} delay={0} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 780 }}>
          <Character who="meera" mood="calm" size={410} delay={6} />
        </div>
      </Camera>
      <At y={170}>
        <Pop delay={l(1) + 10} exit={l(2) - 4}>
          <Plaque color={C.meera} style={{ textAlign: "center" }}>
            <Label>RENT, SIMILAR FLAT</Label>
            <Num size={96} color={C.meera}>₹21,000<span style={{ fontSize: 44, color: C.dim }}>/mo</span></Num>
            <div style={{ display: "flex", gap: 18, alignItems: "center", justifyContent: "center", marginTop: 12 }}>
              <Num size={48} color={C.cream}>₹25 L</Num>
              <span style={{ fontFamily: theme.fonts.body, fontSize: 40, color: C.gold }}>→</span>
              <span style={{ fontFamily: theme.fonts.filmy, fontSize: 48, color: C.cream }}>Index Fund</span>
            </div>
          </Plaque>
        </Pop>
      </At>
      <At y={170}>
        <Pop delay={l(2) + 10} config={theme.spring.bouncy} exit={l(3) - 4}>
          <Plaque color={C.meera} style={{ textAlign: "center" }}>
            <Label>INVESTED · EVERY MONTH</Label>
            <Num size={120} color={C.meera}>₹45,500</Num>
            <Label size={24} color={C.dim}>EMI ₹62,500 + upkeep ₹4,000 − rent ₹21,000</Label>
          </Plaque>
        </Pop>
      </At>
      <Flash at={[l(3), l(3) + 9, l(3) + 18]} strength={0.32} />
    </Shell>
  );
};

// =====================================================================================
const RaceBoard: React.FC<{ year: number; yMax: number; xMax: number; crash?: number; top?: number }> = ({ top = 330, ...p }) => (
  <At y={top}>
    <Plaque style={{ padding: "24px 18px 8px" }}>
      <RaceLegend />
      <div style={{ marginTop: 10 }}>
        <Race {...p} width={800} height={560} />
      </div>
    </Plaque>
  </At>
);

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s4", i).from;
  const year = interpolate(frame, [l(0) + 10, l(1) + 120], [0, 5], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <Shell id="s4">
      <At y={170}>
        <Pop delay={0} scale={1.5}>
          <PosterText size={96} font="filmy">5 years later</PosterText>
        </Pop>
      </At>
      <RaceBoard year={year} yMax={1e7} xMax={6} />
      <div style={{ position: "absolute", left: 640, top: 1040 }}>
        <Character who="meera" mood="smug" size={300} delay={l(2) - 6} />
      </div>
    </Shell>
  );
};

// =====================================================================================
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s5", i).from;
  const curtain = interpolate(frame, [0, 14, 52, 70], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP });
  const year = interpolate(frame, [l(0) + 50, l(0) + 90], [5, 6], { easing: theme.ease.in, ...CLAMP });
  const crash = interpolate(frame, [l(0) + 50, l(0) + 60], [0, 1], CLAMP);
  const stamp = spring({ frame: frame - (l(0) + 62), fps, config: theme.spring.stamp });
  const z = tripleZoom(frame, l(1));
  const chartOut = l(3) - 6;
  return (
    <Shell id="s5">
      <div style={{ opacity: interpolate(frame, [chartOut, chartOut + 10], [1, 0], CLAMP) }}>
        <RaceBoard year={year} yMax={1e7} xMax={6} crash={crash} top={200} />
        <div style={{ position: "absolute", left: 210, top: 380, transform: `rotate(-10deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`, opacity: interpolate(stamp, [0, 0.2], [0, 1], CLAMP) }}>
          <div style={{ border: `7px solid ${C.red}`, borderRadius: 18, padding: "4px 28px", fontFamily: theme.fonts.poster, fontSize: 120, color: C.red, background: "rgba(20,4,10,0.75)", boxShadow: `0 0 50px ${C.redGlow}` }}>−35%</div>
        </div>
        {/* Maa's triple zoom, then Arjun gloats */}
        <div style={{ position: "absolute", left: 120, top: 930, transform: `scale(${frame >= l(1) - 2 && frame < l(2) ? z : 1})`, transformOrigin: "200px 200px" }}>
          <Character who="maa" mood={frame >= l(1) ? "angry" : "worried"} size={330} delay={l(1) - 10} />
        </div>
        <div style={{ position: "absolute", left: 620, top: 930 }}>
          <Character who="arjun" mood="smug" size={330} delay={l(2) - 8} />
        </div>
        <div style={{ position: "absolute", left: 590, top: 860 }}>
          <Pop delay={l(2) + 30} config={theme.spring.bouncy}>
            <Plaque color={C.arjun} style={{ padding: "10px 22px" }}>
              <Label size={22}>MEERA, ON PAPER</Label>
              <Num size={56} color={C.red}>−₹23 L</Num>
            </Plaque>
          </Pop>
        </div>
      </div>
      {/* Meera holds her nerve */}
      <div style={{ position: "absolute", left: 240, top: 520, opacity: interpolate(frame, [l(3) - 4, l(3) + 8], [0, 1], CLAMP) }}>
        <Character who="meera" mood="calm" size={600} delay={l(3) - 4} />
      </div>
      <At y={250}>
        <Pop delay={l(3) + 70} config={theme.spring.bouncy}>
          <Plaque color={C.meera} style={{ textAlign: "center", padding: "18px 30px" }}>
            <div style={{ fontFamily: theme.fonts.filmy, fontSize: 60, color: C.meera }}>Not selling.</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const p = spring({ frame: frame - (l(3) + 90 + i * 8), fps, config: theme.spring.bouncy });
                return (
                  <svg key={i} width={52} height={52} viewBox="0 0 24 24" style={{ transform: `scale(${p})` }}>
                    <circle cx={12} cy={12} r={11} fill={C.meera} stroke={C.ink} strokeWidth={1.5} />
                    <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                );
              })}
            </div>
            <Label size={24}>INVESTING EVERY MONTH</Label>
          </Plaque>
        </Pop>
      </At>
      <Flash at={[l(0) + 62, l(1), l(1) + 9, l(1) + 18]} strength={0.6} />
      {/* INTERVAL */}
      <AbsoluteFill>
        <Curtain close={curtain} />
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(frame, [12, 20, 48, 56], [0, 1, 1, 0], CLAMP) }}>
          <PosterText size={160}>INTERVAL</PosterText>
        </AbsoluteFill>
      </AbsoluteFill>
    </Shell>
  );
};

// =====================================================================================
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s6", i).from;
  const spin = interpolate(frame, [0, l(0) + 40], [0, 720 * 3], { easing: theme.ease.inOut, ...CLAMP });
  const titleOut = l(1) - 8;
  return (
    <Shell id="s6">
      <div style={{ opacity: interpolate(frame, [titleOut, titleOut + 10], [1, 0], CLAMP) }}>
        <At y={560}>
          <svg width={260} height={260} viewBox="-130 -130 260 260">
            <circle r={120} fill="rgba(20,4,10,0.8)" stroke={C.gold} strokeWidth={8} />
            {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-100} x2={0} y2={-86} stroke={C.gold} strokeWidth={6} transform={`rotate(${i * 30})`} />)}
            <line x1={0} y1={0} x2={0} y2={-80} stroke={C.cream} strokeWidth={8} strokeLinecap="round" transform={`rotate(${spin})`} />
            <line x1={0} y1={0} x2={0} y2={-56} stroke={C.gold} strokeWidth={10} strokeLinecap="round" transform={`rotate(${spin / 12})`} />
          </svg>
          <Pop delay={l(0) - 4} scale={1.5} style={{ marginTop: 40 }}>
            <PosterText size={110} font="filmy">20 years later</PosterText>
          </Pop>
        </At>
      </div>
      <div style={{ opacity: interpolate(frame, [titleOut, titleOut + 10], [0, 1], CLAMP) }}>
        <div style={{ position: "absolute", left: 100, top: 760 }}>
          <Character who="arjun" mood="happy" size={400} delay={titleOut} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 760 }}>
          <Character who="meera" mood="happy" size={400} delay={titleOut + 6} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 400, width: 840, display: "flex", justifyContent: "space-between" }}>
          <Pop delay={l(1) + 50} config={theme.spring.bouncy}>
            <Plaque color={C.arjun} style={{ textAlign: "center", padding: "18px 26px" }}>
              <Label size={22}>LOAN-FREE FLAT</Label>
              <Num size={76} color={C.arjun}>{lakh(FINAL.arjun)}</Num>
            </Plaque>
          </Pop>
          <Pop delay={l(2) + 40} config={theme.spring.bouncy} scale={1.4}>
            <Plaque color={C.meera} style={{ textAlign: "center", padding: "18px 26px", transform: `scale(${breathe(frame, 12, 0.03)})` }}>
              <Label size={22}>PORTFOLIO</Label>
              <Num size={76} color={C.meera}>{lakh(FINAL.meera)}</Num>
            </Plaque>
          </Pop>
        </div>
      </div>
      <Flash at={[l(2) + 40]} strength={0.25} />
    </Shell>
  );
};

// =====================================================================================
export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s7", i).from;
  const max = 4.5e7, H = 640;
  const flip = interpolate(frame, [l(3) + 20, l(3) + 60], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const arjunV = FINAL.arjun + (ARJUN_8 - FINAL.arjun) * flip;
  const loss = spring({ frame: frame - (l(2) + 4), fps, config: theme.spring.stamp });
  const bar = (name: string, sub: string, v: number, color: string, delay: number, dim = false) => {
    const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
    return (
      <div style={{ width: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
        <Num size={54} color={color}>{lakh(v * Math.min(1, p))}</Num>
        <div style={{ width: 140, height: (v / max) * H * p, marginTop: 12, borderRadius: "16px 16px 4px 4px", background: `linear-gradient(180deg, ${color}, ${color}88)`, border: `3px solid ${C.ink}`, opacity: dim ? 0.35 : 1, boxShadow: dim ? undefined : `0 0 30px ${color}66` }} />
        <div style={{ fontFamily: theme.fonts.poster, fontSize: 44, color: C.cream, marginTop: 10 }}>{name}</div>
        <Label size={22}>{sub}</Label>
      </div>
    );
  };
  return (
    <Shell id="s7">
      <At y={170}>
        <Pop delay={2} scale={1.6} config={theme.spring.stamp}>
          <PosterText size={120} font="filmy">The Twist</PosterText>
        </Pop>
      </At>
      <div style={{ position: "absolute", left: 110, top: 380, width: 860, height: 1080, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {bar("Meera", "STAYED INVESTED", FINAL.meera, C.meera, l(1) - 10, flip > 0.05)}
        {bar("Meera", "PANICKED ONCE", FINAL.panic, C.red, l(1) + 110)}
        {bar("Arjun", flip > 0 ? "IF PRICES GREW 8%" : "BOUGHT", arjunV, C.arjun, l(1) + 30)}
      </div>
      <div style={{ position: "absolute", left: 270, top: 960, transform: `rotate(-8deg) scale(${interpolate(loss, [0, 1], [2.2, 1])})`, opacity: interpolate(loss, [0, 0.2], [0, 1], CLAMP) * interpolate(frame, [l(3), l(3) + 10], [1, 0], CLAMP) }}>
        <Plaque color={C.red} style={{ textAlign: "center" }}>
          <Label color={C.red} size={28}>ONE PANIC</Label>
          <Num size={96} color={C.red}>−₹1.5 Cr</Num>
        </Plaque>
      </div>
      <Flash at={[l(2) + 4]} strength={0.32} />
    </Shell>
  );
};

// =====================================================================================
export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = (i: number) => L(fps, "s8", i).from;
  const endCard = l(3) - 6;
  const curtain = interpolate(frame, [endCard - 4, endCard + 12], [0, 0.62], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <Shell id="s8" noExit>
      <div style={{ opacity: interpolate(frame, [endCard, endCard + 10], [1, 0], CLAMP) }}>
        <At y={190}>
          <Pop delay={4}>
            <Label size={34} color={C.gold}>MORAL OF THE STORY</Label>
          </Pop>
          <Pop delay={10} style={{ marginTop: 20 }}>
            <div style={{ fontFamily: theme.fonts.poster, fontSize: 70, color: C.cream, textAlign: "center", lineHeight: 1.1, textShadow: `0 4px 0 ${C.ink}` }}>Renting doesn't beat buying.</div>
          </Pop>
          <Pop delay={l(0) + 100} scale={1.5} config={theme.spring.stamp} style={{ marginTop: 20 }}>
            <PosterText size={130}>DISCIPLINE DOES.</PosterText>
          </Pop>
        </At>
        <div style={{ position: "absolute", left: 100, top: 780 }}>
          <Character who="arjun" mood="happy" size={400} delay={l(1) - 8} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 780 }}>
          <Character who="meera" mood="happy" size={400} delay={l(1)} />
        </div>
      </div>
      <AbsoluteFill>
        <Curtain close={curtain} />
      </AbsoluteFill>
      <At y={260}>
        <Pop delay={endCard + 10}>
          <PosterText size={110}>The End?</PosterText>
        </Pop>
        <Pop delay={endCard + 26} style={{ marginTop: 40 }}>
          <Plaque style={{ textAlign: "center" }}>
            <Label color={C.gold} size={28}>COMING SOON · EPISODE 2</Label>
            <div style={{ fontFamily: theme.fonts.filmy, fontSize: 64, color: C.cream, lineHeight: 1.15, marginTop: 8 }}>
              Should Arjun
              <br />
              prepay his loan?
            </div>
          </Plaque>
        </Pop>
        <Pop delay={endCard + 46} config={theme.spring.bouncy} style={{ marginTop: 44 }}>
          <div style={{ padding: "18px 54px", borderRadius: 999, background: `linear-gradient(180deg, ${C.goldHi}, ${C.gold})`, border: `4px solid ${C.ink}`, color: C.ink, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 46, transform: `scale(${breathe(frame, 12, 0.03)})` }}>FOLLOW FOR EP 2</div>
        </Pop>
      </At>
      <At y={1200}>
        <Pop delay={endCard + 60}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 21, color: C.dim, textAlign: "center", lineHeight: 1.5, background: "rgba(20,4,10,0.75)", padding: "16px 24px", borderRadius: 14, border: `1.5px solid rgba(242,193,78,0.35)` }}>
            Illustrative scenario: flat ₹90 L, 20% down + ₹7 L costs, loan 8.5% for 20 yrs, rent ₹21k +7%/yr, upkeep ₹4k +5%/yr, flat value +5%/yr, index fund ≈10%/yr avg with a hypothetical −35% year. Before tax & selling costs.
            <div style={{ color: C.gold, fontWeight: 700, marginTop: 6 }}>Educational only. Not investment advice.</div>
          </div>
        </Pop>
      </At>
    </Shell>
  );
};

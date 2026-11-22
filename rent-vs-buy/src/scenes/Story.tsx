// Eight story beats. Timing comes from the narration (timing.ts); numbers from analysis/model.py → model.json.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Bubble, FlatBlock, Gift, Key, NameTag } from "../components/Cast";
import { breathe, CLAMP, float } from "../components/Motion";
import { Card, lakh, Legend, Pop, Race } from "../components/Stage";
import model from "../model.json";
import { theme } from "../theme";
import { scene, SceneId, sentence } from "../timing";

const C = theme.colors;
const seg = (fps: number, id: SceneId, i: number) => sentence(fps, id, i).from;
const M = model as unknown as Record<"base" | "panic" | "h7", { y: number; arjun: number; meera: number; house: number }[]>;
const FINAL = { arjun: M.base[19].arjun, meera: M.base[19].meera, panic: M.panic[19].meera };
const ARJUN_8 = 90e5 * Math.pow(1.08, 20); // flat value if prices grow 8%/yr, loan paid off

const Shell: React.FC<{ id: SceneId; children: React.ReactNode; noExit?: boolean }> = ({ id, children, noExit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene(fps, id).duration;
  const out = noExit ? 0 : interpolate(frame, [d - 9, d], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.03})` }}>{children}</AbsoluteFill>;
};
const Abs: React.FC<{ x?: number; y: number; w?: number; center?: boolean; children: React.ReactNode }> = ({ x = 60, y, w = 960, center, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, display: center ? "flex" : "block", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>{children}</div>
);
const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = C.text, size = 96 }) => (
  <div style={{ fontFamily: theme.fonts.num, fontWeight: 700, fontSize: size, color, lineHeight: 1, letterSpacing: "-0.02em" }}>{children}</div>
);
const Story: React.FC<{ children: React.ReactNode; size?: number; color?: string; italic?: boolean }> = ({ children, size = 70, color = C.text, italic }) => (
  <div style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontStyle: italic ? "italic" : "normal", fontSize: size, color, lineHeight: 1.1, textAlign: "center" }}>{children}</div>
);
const useCount = (to: number, start: number, len: number, from = 0) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + len], [from, to], { easing: theme.ease.out, ...CLAMP });
};

// =====================================================================================
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s1", i);
  const gap = useCount(1.73, s(3) + 10, 40);
  const pairOut = s(3) - 4;
  return (
    <Shell id="s1">
      <div style={{ opacity: interpolate(frame, [pairOut, pairOut + 10], [1, 0], CLAMP) }}>
        <Abs y={250} center>
          <Pop delay={s(0) + 50}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: "0.2em", color: C.dim }}>AGE 28 · SAME SALARY · BANGALORE</div>
          </Pop>
        </Abs>
        <div style={{ position: "absolute", left: 60, top: 360, width: 960, display: "flex", justifyContent: "space-around" }}>
          {(["arjun", "meera"] as const).map((who, i) => (
            <div key={who} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={{ height: 150, display: "flex", alignItems: "flex-end" }}>
                <Pop delay={s(1) + 40 + i * 10} config={theme.spring.bouncy} y={-80}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, transform: `translateY(${float(frame, 24 + i * 4, 6)}px)` }}>
                    <Gift size={96} color={who === "arjun" ? C.arjun : C.meera} />
                    <Big size={56} color={C.text}>₹25 L</Big>
                  </div>
                </Pop>
              </div>
              <Avatar who={who} mood="happy" size={340} delay={8 + i * 10} bob={i} />
              <NameTag name={who === "arjun" ? "Arjun" : "Meera"} color={who === "arjun" ? C.arjun : C.meera} delay={20 + i * 10} />
              <div style={{ height: 120 }}>
                <Pop delay={s(2) + (i ? 28 : 4)} config={theme.spring.bouncy}>
                  <div style={{ padding: "16px 36px", borderRadius: 999, background: who === "arjun" ? C.arjun : C.meera, color: C.bg, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 44, letterSpacing: "0.1em" }}>
                    {who === "arjun" ? "BUYS" : "RENTS"}
                  </div>
                </Pop>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* the gap */}
      <Abs y={520} center>
        <Pop delay={s(3) + 4} exit={s(4) - 4}>
          <div style={{ textAlign: "center" }}>
            <Story size={58} color={C.dim}>20 years later, the gap:</Story>
            <div style={{ marginTop: 30 }}>
              <Big size={190} color={C.meera}>₹{gap.toFixed(2)} Cr</Big>
            </div>
          </div>
        </Pop>
      </Abs>
      <Abs y={620} center>
        <Pop delay={s(4) + 2}>
          <Story size={82} italic>
            …but it <span style={{ color: C.red }}>almost</span>
            <br />
            went the other way.
          </Story>
        </Pop>
      </Abs>
    </Shell>
  );
};

// =====================================================================================
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s2", i);
  const emi = useCount(62500, s(3) + 70, 40);
  return (
    <Shell id="s2">
      <div style={{ position: "absolute", left: 60, top: 260, display: "flex", alignItems: "flex-end", gap: 10 }}>
        <Avatar who="dad" mood="smug" size={230} delay={2} />
        <div style={{ marginBottom: 210 }}>
          <Bubble text="Rent is money thrown away!" delay={s(0) + 30} exit={s(1) + 10} size={44} style={{ maxWidth: 560 }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 300, opacity: interpolate(frame, [s(1) - 4, s(1) + 8], [0, 1], CLAMP) }}>
        <Avatar who="arjun" mood={frame > s(3) + 70 ? "worried" : "happy"} size={200} delay={s(1) - 4} />
      </div>
      <Abs y={600} w={960}>
        <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
          <div style={{ transform: `scale(${breathe(frame, 30, 0.01)})`, transformOrigin: "bottom" }}>
            <FlatBlock color={C.arjun} width={300} delay={s(1)} floors={6} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
            <Pop delay={s(1) + 14}>
              <Card color={C.arjun}>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: C.dim }}>2BHK flat</div>
                <Big size={84} color={C.arjun}>₹90 L</Big>
              </Card>
            </Pop>
            <Pop delay={s(2) + 6}>
              <Card>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 26, color: C.dim, marginBottom: 10 }}>₹25 L upfront</div>
                <div style={{ display: "flex", height: 34, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ width: `${(18 / 25) * 100 * interpolate(frame, [s(2) + 14, s(2) + 40], [0, 1], CLAMP)}%`, background: C.arjun }} />
                  <div style={{ width: `${(7 / 25) * 100 * interpolate(frame, [s(2) + 40, s(2) + 60], [0, 1], CLAMP)}%`, background: C.dim }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.body, fontSize: 24, color: C.text, marginTop: 10 }}>
                  <span>Down payment ₹18 L</span>
                  <span style={{ color: C.dim }}>Stamp + reg. ₹7 L</span>
                </div>
              </Card>
            </Pop>
            <Pop delay={s(3) + 6}>
              <Card>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 26, color: C.dim }}>Home loan ₹72 L · 8.5% · 20 yrs</div>
              </Card>
            </Pop>
          </div>
        </div>
      </Abs>
      <Abs y={1100} center>
        <Pop delay={s(3) + 60} config={theme.spring.bouncy}>
          <Card color={C.arjun} style={{ textAlign: "center", padding: "30px 60px" }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30, color: C.dim, letterSpacing: "0.12em" }}>EMI EVERY MONTH</div>
            <Big size={130} color={C.arjun}>₹{Math.round(emi).toLocaleString("en-IN")}</Big>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: C.dim, marginTop: 8 }}>for 240 months</div>
          </Card>
        </Pop>
      </Abs>
    </Shell>
  );
};

// =====================================================================================
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s3", i);
  const row = (label: string, value: string, color: string, delay: number, sign = "") => (
    <Pop delay={delay} y={20}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.num, fontSize: 40, color, padding: "8px 0" }}>
        <span style={{ fontFamily: theme.fonts.body, fontSize: 32, color: C.dim }}>{label}</span>
        <span>
          {sign}
          {value}
        </span>
      </div>
    </Pop>
  );
  return (
    <Shell id="s3">
      <div style={{ position: "absolute", left: 60, top: 260, display: "flex", alignItems: "center", gap: 30 }}>
        <Avatar who="meera" mood="calm" size={220} delay={2} />
        <Pop delay={s(0) + 20}>
          <Card color={C.meera}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: C.dim }}>Rent, similar flat next door</div>
            <Big size={84} color={C.meera}>₹21,000<span style={{ fontSize: 40, color: C.dim }}>/mo</span></Big>
          </Card>
        </Pop>
      </div>
      <Abs y={620}>
        <Pop delay={s(1)}>
          <Card style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Big size={64} color={C.meera}>₹25 L</Big>
            <svg width={90} height={40}><path d="M5,20 H75 M60,6 L80,20 L60,34" fill="none" stroke={C.dim} strokeWidth={5} strokeLinecap="round" /></svg>
            <div style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 48, color: C.text }}>Index fund</div>
          </Card>
        </Pop>
      </Abs>
      <Abs y={820}>
        <Pop delay={s(2) - 4}>
          <Card>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 28, color: C.dim, letterSpacing: "0.1em", marginBottom: 6 }}>EVERY MONTH, YEAR 1</div>
            {row("Arjun's EMI", "₹62,500", C.arjun, s(2) + 14)}
            {row("Arjun's maintenance", "₹4,000", C.arjun, s(2) + 26, "+ ")}
            {row("Meera's rent", "₹21,000", C.text, s(2) + 38, "− ")}
            <div style={{ height: 2, background: C.edge, margin: "10px 0" }} />
            <Pop delay={s(2) + 56} config={theme.spring.bouncy}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 42, color: C.meera }}>Meera invests</span>
                <Big size={80} color={C.meera}>₹45,500</Big>
              </div>
            </Pop>
          </Card>
        </Pop>
      </Abs>
      <div style={{ position: "absolute", right: 60, top: 1180, display: "flex", alignItems: "flex-end", gap: 10, opacity: interpolate(frame, [s(3) - 6, s(3) + 4], [0, 1], CLAMP) }}>
        <div style={{ marginBottom: 150 }}>
          <Bubble text="Renting? At your age?" delay={s(3) + 10} tail="right" size={40} />
        </div>
        <Avatar who="mom" mood="worried" size={190} delay={s(3) - 4} />
      </div>
    </Shell>
  );
};

// =====================================================================================
const RaceBlock: React.FC<{ year: number; yMax: number; xMax: number; crash?: number }> = (p) => (
  <Abs y={290}>
    <Card style={{ padding: "26px 20px 10px" }}>
      <div style={{ paddingLeft: 16, marginBottom: 6 }}>
        <Legend />
      </div>
      <Race {...p} width={920} height={700} />
    </Card>
  </Abs>
);

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s4", i);
  const year = interpolate(frame, [s(0), s(2) + 20], [0, 5], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <Shell id="s4" noExit>
      <RaceBlock year={year} yMax={1e7} xMax={6} />
      <div style={{ position: "absolute", left: 60, top: 1090, width: 960, display: "flex", justifyContent: "space-between" }}>
        <Pop delay={s(1) + 6}>
          <Card style={{ padding: "18px 26px" }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>Meera's rent</div>
            <Big size={50} color={C.text}>₹{Math.round(21000 * Math.pow(1.07, Math.max(0, Math.floor(year - 0.01)))).toLocaleString("en-IN")}</Big>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: C.faint }}>+7% every year</div>
          </Card>
        </Pop>
        <Pop delay={s(2) + 24} config={theme.spring.bouncy}>
          <Card color={C.meera} style={{ padding: "18px 26px" }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>Year 5</div>
            <Big size={50} color={C.meera}>Meera ahead</Big>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: C.dim }}>by ₹27 L</div>
          </Card>
        </Pop>
      </div>
    </Shell>
  );
};

// =====================================================================================
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s5", i);
  const year = interpolate(frame, [s(0) + 30, s(1) + 10], [5, 6], { easing: theme.ease.in, ...CLAMP });
  const crash = interpolate(frame, [s(0) + 20, s(0) + 40], [0, 1], CLAMP);
  const stamp = spring({ frame: frame - (s(0) + 34), fps, config: theme.spring.stamp });
  const chartOut = s(2) - 4;
  return (
    <Shell id="s5">
      <div style={{ opacity: interpolate(frame, [chartOut, chartOut + 10], [1, 0], CLAMP) }}>
        <RaceBlock year={year} yMax={1e7} xMax={6} crash={crash} />
        <div style={{ position: "absolute", left: 170, top: 560, transform: `rotate(-10deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`, opacity: interpolate(stamp, [0, 0.2], [0, 1], CLAMP) }}>
          <div style={{ border: `6px solid ${C.red}`, borderRadius: 18, padding: "6px 26px", fontFamily: theme.fonts.num, fontWeight: 700, fontSize: 96, color: C.red, boxShadow: `0 0 40px ${C.redGlow}`, background: "rgba(20,17,43,0.7)" }}>−35%</div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 1090, width: 960, display: "flex", justifyContent: "space-between" }}>
          <Pop delay={s(1) + 4}>
            <Card color={C.red} style={{ padding: "18px 26px" }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>Meera, on paper</div>
              <Big size={56} color={C.red}>−₹23 L</Big>
            </Card>
          </Pop>
          <Pop delay={s(1) + 50} config={theme.spring.bouncy}>
            <Card color={C.arjun} style={{ padding: "18px 26px" }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>For the first time</div>
              <Big size={56} color={C.arjun}>Arjun ahead</Big>
            </Card>
          </Pop>
        </div>
      </div>
      {/* the pressure */}
      <Abs y={300} center>
        <div style={{ opacity: interpolate(frame, [s(2) - 2, s(2) + 8], [0, 1], CLAMP), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
            <Bubble text="Told you!" delay={s(2) + 6} size={44} color="#FFD1DA" tail="down" />
            <Bubble text="I sold everything." delay={s(2) + 30} size={40} tail="down" color="#D9D3EA" />
          </div>
          <Bubble text="Get out before it's zero!" delay={s(2) + 56} size={40} tail="down" color="#FFE3A3" />
          <Avatar who="meera" mood={frame > s(3) ? "calm" : "worried"} size={320} delay={s(2)} />
        </div>
      </Abs>
      <Abs y={1190} center>
        <Pop delay={s(3) + 20} config={theme.spring.bouncy}>
          <Card color={C.meera} style={{ display: "flex", gap: 14, alignItems: "center", padding: "20px 34px" }}>
            <span style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 42, color: C.meera }}>Keeps investing</span>
            {Array.from({ length: 6 }).map((_, i) => {
              const p = spring({ frame: frame - (s(3) + 40 + i * 7), fps, config: theme.spring.bouncy });
              return (
                <svg key={i} width={46} height={46} viewBox="0 0 24 24" style={{ transform: `scale(${p})` }}>
                  <circle cx={12} cy={12} r={11} fill={C.meera} />
                  <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke={C.bg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              );
            })}
          </Card>
        </Pop>
      </Abs>
    </Shell>
  );
};

// =====================================================================================
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s6", i);
  const year = interpolate(frame, [4, s(0) + 120], [6, 20], { easing: theme.ease.inOut, ...CLAMP });
  const yMax = interpolate(year, [6, 20], [1e7, 4.5e7], CLAMP);
  return (
    <Shell id="s6">
      <RaceBlock year={year} yMax={yMax} xMax={interpolate(year, [6, 20], [6, 20], CLAMP)} />
      <div style={{ position: "absolute", left: 60, top: 1090, width: 960, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Pop delay={s(0) + 90}>
          <Card color={C.arjun} style={{ padding: "18px 26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>
              <Key size={40} color={C.arjun} /> Loan-free flat
            </div>
            <Big size={70} color={C.arjun}>{lakh(FINAL.arjun)}</Big>
          </Card>
        </Pop>
        <Pop delay={s(1) + 10} config={theme.spring.bouncy}>
          <Card color={C.meera} style={{ padding: "18px 26px" }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>Meera's portfolio</div>
            <Big size={70} color={C.meera}>{lakh(FINAL.meera)}</Big>
          </Card>
        </Pop>
      </div>
    </Shell>
  );
};

// =====================================================================================
export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s7", i);
  const max = 4.5e7, H = 640;
  const bar = (label: string, sub: string, v: number, color: string, delay: number, dim = false) => {
    const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
        <Big size={52} color={color}>{lakh(v * Math.min(1, p))}</Big>
        <div style={{ width: 150, height: (v / max) * H * p, marginTop: 14, borderRadius: "18px 18px 6px 6px", background: color, opacity: dim ? 0.4 : 1, boxShadow: dim ? undefined : `0 0 30px ${color}55` }} />
        <div style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 16, textAlign: "center" }}>{label}</div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim, textAlign: "center", height: 60 }}>{sub}</div>
      </div>
    );
  };
  const flipP = interpolate(frame, [s(3) + 10, s(3) + 50], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const arjunV = FINAL.arjun + (ARJUN_8 - FINAL.arjun) * flipP;
  const lossP = spring({ frame: frame - (s(2) + 6), fps, config: theme.spring.stamp });
  return (
    <Shell id="s7">
      <Abs y={270} center>
        <Pop delay={4}>
          <Story size={64}>What the spreadsheet doesn't show</Story>
        </Pop>
      </Abs>
      <div style={{ position: "absolute", left: 60, top: 460, width: 960, height: 980, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {bar("Meera", "stayed invested", FINAL.meera, C.meera, s(1) - 10, frame > s(3) + 10)}
        {bar("Meera", "panicked once", FINAL.panic, C.red, s(1) + 90)}
        {bar("Arjun", flipP > 0 ? "if prices grew 8%/yr" : "bought", arjunV, C.arjun, s(1) + 20)}
      </div>
      <div style={{ position: "absolute", left: 330, top: 560, transform: `rotate(-8deg) scale(${interpolate(lossP, [0, 1], [2, 1])})`, opacity: interpolate(lossP, [0, 0.2], [0, 1], CLAMP) * interpolate(frame, [s(3), s(3) + 10], [1, 0], CLAMP) }}>
        <div style={{ border: `6px solid ${C.red}`, borderRadius: 18, padding: "8px 24px", background: "rgba(20,17,43,0.85)", textAlign: "center", boxShadow: `0 0 40px ${C.redGlow}` }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.red, letterSpacing: "0.12em" }}>ONE PANIC</div>
          <Big size={84} color={C.red}>−₹1.5 Cr</Big>
        </div>
      </div>
      {flipP > 0.95 && (
        <div style={{ position: "absolute", right: 60, top: 450 + float(frame, 14, 5) }}>
          <Pop delay={s(3) + 50} config={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, color: C.bg, background: C.arjun, padding: "10px 22px", borderRadius: 999 }}>Arjun wins</div>
          </Pop>
        </div>
      )}
    </Shell>
  );
};

// =====================================================================================
export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (i: number) => seg(fps, "s8", i);
  const d = scene(fps, "s8").duration;
  const endCard = s(3) - 4;
  return (
    <Shell id="s8" noExit>
      <div style={{ opacity: interpolate(frame, [endCard, endCard + 10], [1, 0], CLAMP) }}>
        <Abs y={300} center>
          <Pop delay={4}>
            <Story size={72} color={C.dim}>Renting doesn't beat buying.</Story>
          </Pop>
          <Pop delay={s(0) + 44} config={theme.spring.bouncy} style={{ marginTop: 24 }}>
            <Story size={120} color={C.meera}>Discipline does.</Story>
          </Pop>
        </Abs>
        <Abs y={680}>
          {["Invest the difference", "Every single month", "Through every crash"].map((t, i) => (
            <Pop key={t} delay={s(1) + 20 + i * 26} style={{ marginBottom: 20 }}>
              <Card style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 30px" }}>
                <svg width={50} height={50} viewBox="0 0 24 24">
                  <circle cx={12} cy={12} r={11} fill={C.green} />
                  <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke={C.bg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 48, color: C.text }}>{t}</span>
              </Card>
            </Pop>
          ))}
        </Abs>
        <div style={{ position: "absolute", left: 60, top: 1130, display: "flex", alignItems: "center", gap: 24, opacity: interpolate(frame, [s(2) - 4, s(2) + 8], [0, 1], CLAMP) }}>
          <Avatar who="arjun" mood="happy" size={170} delay={s(2)} />
          <Pop delay={s(2) + 16}>
            <Card color={C.arjun} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 26px" }}>
              <Key size={56} color={C.arjun} />
              <span style={{ fontFamily: theme.fonts.story, fontWeight: 600, fontSize: 36, color: C.text }}>No landlord. Ever.</span>
            </Card>
          </Pop>
        </div>
      </div>
      {/* end card */}
      <Abs y={300} center>
        <Pop delay={endCard + 6}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: C.dim, textAlign: "center" }}>NEXT EPISODE</div>
          <div style={{ marginTop: 20 }}>
            <Story size={86}>
              Should Arjun have
              <br />
              <span style={{ color: C.arjun }}>prepaid his loan?</span>
            </Story>
          </div>
        </Pop>
        <Pop delay={endCard + 26} config={theme.spring.bouncy} style={{ marginTop: 50 }}>
          <div style={{ padding: "22px 56px", borderRadius: 999, background: C.meera, color: C.bg, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 46, transform: `scale(${breathe(frame, 12, 0.03)})` }}>Follow for Ep 02</div>
        </Pop>
      </Abs>
      <Abs y={1000}>
        <Pop delay={endCard + 40}>
          <Card style={{ padding: "26px 32px" }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim, letterSpacing: "0.14em", marginBottom: 10 }}>ASSUMPTIONS · ILLUSTRATIVE SCENARIO</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.text, lineHeight: 1.5 }}>
              Flat ₹90 L · 20% down + ₹7 L costs · loan 8.5%, 20 yrs · rent ₹21k, +7%/yr · maintenance ₹4k, +5%/yr · flat value +5%/yr · index fund ≈10%/yr average with a −35% year in yr 6 (hypothetical) · before tax and selling costs.
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: C.meera, marginTop: 12 }}>Educational only. Not investment advice.</div>
          </Card>
        </Pop>
      </Abs>
      <div style={{ opacity: interpolate(frame, [d - 20, d], [1, 1], CLAMP) }} />
    </Shell>
  );
};

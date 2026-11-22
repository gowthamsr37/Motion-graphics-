// t-test kit: colour code (brand A = cyan, brand B = violet, standard error = green, tail / reject = orange), the
// two-sample formula with value slots, the variance worksheet, the t table (df 6–10, one- and two-tailed headers) with
// row / column / cell highlights, the t(8) zone curve (two-tailed or right-tailed) and the 5-step tracker.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Radical } from "./Clt";
import { FnCurve, type Geo, gx, ValueAxis } from "./Curve";
import { ease, useSpr } from "./Motion";
import { tpdf } from "./TDist";
import { XBar } from "./ZKit";
import { alpha, glowBox, glowText, theme } from "../theme";

const C = theme.colors;
export const BA = C.cyan;
export const BB = C.violet;
export const SE = C.green;
export const TAIL = C.orange;
export const A = [6, 8, 7, 5, 9];
export const B = [9, 10, 8, 11, 12];
export const DF = 8;

const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => <sub style={{ fontSize: "0.5em", verticalAlign: "-0.25em", marginLeft: 2 }}>{children}</sub>;

// t = (x̄B − x̄A) / √( sp² (1/nA + 1/nB) )
export const TFormula: React.FC<{ size: number; gap?: React.ReactNode; sp?: React.ReactNode; inner?: React.ReactNode; hiTop?: number; hiBot?: number; result?: React.ReactNode }> = ({ size, gap, sp, inner, hiTop = 0, hiBot = 0, result }) => {
  const box = (k: number, c: string): React.CSSProperties => ({ padding: `${size * 0.08}px ${size * 0.22}px`, borderRadius: 18, background: alpha(c, 0.18 * k), boxShadow: k > 0.01 ? glowBox(c, 0.6 * k) : "none", border: `2px solid ${alpha(c, 0.8 * k)}` });
  const mono: React.CSSProperties = { fontFamily: theme.fonts.mono, fontWeight: 800 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>
      <span style={{ fontStyle: "italic" }}>t</span>
      <span>=</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...box(hiTop, BB), display: "flex", alignItems: "center", gap: size * 0.2 }}>
          {gap !== undefined ? (
            <span style={{ ...mono, color: BB }}>{gap}</span>
          ) : (
            <>
              <span style={{ color: BB }}>
                <XBar color={BB} />
                <Sub>B</Sub>
              </span>
              <span>−</span>
              <span style={{ color: BA }}>
                <XBar color={BA} />
                <Sub>A</Sub>
              </span>
            </>
          )}
        </div>
        <div style={{ width: "100%", height: Math.max(4, size * 0.07), borderRadius: 3, background: C.text, margin: `${size * 0.1}px 0` }} />
        <div style={{ ...box(hiBot, SE) }}>
          <Radical color={C.text} size={size * 0.9}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.12 }}>
              {sp !== undefined ? (
                <span style={{ ...mono, color: SE }}>{sp}</span>
              ) : (
                <span style={{ color: SE }}>
                  s<Sub>p</Sub>
                  <sup style={{ fontSize: "0.5em" }}>2</sup>
                </span>
              )}
              <span style={{ fontSize: size * 0.8 }}>(</span>
              {inner !== undefined ? (
                <span style={{ ...mono, fontSize: size * 0.8 }}>{inner}</span>
              ) : (
                <span style={{ fontSize: size * 0.7 }}>
                  1/n<Sub>A</Sub> + 1/n<Sub>B</Sub>
                </span>
              )}
              <span style={{ fontSize: size * 0.8 }}>)</span>
            </span>
          </Radical>
        </div>
      </div>
      {result !== undefined ? (
        <>
          <span>=</span>
          <span style={{ ...mono, color: TAIL, textShadow: glowText(TAIL, 0.6) }}>{result}</span>
        </>
      ) : null}
    </div>
  );
};

// variance worksheet for one brand: value · distance from the mean · squared, rows reveal one by one
export const VarSheet: React.FC<{ x: number; y: number; vals: number[]; mean: number; c: string; label: string; rowAt: number[]; sumAt: number; divAt: number; unit?: string; res?: React.ReactNode; rowH?: number }> = ({ x, y, vals, mean, c, label, rowAt, sumAt, divAt, unit = "HOURS", res, rowH = 46 }) => {
  const spr = useSpr();
  const head = spr(rowAt[0] - 10, theme.spring.smooth);
  const cw = [110, 150, 150];
  const W = cw[0] + cw[1] + cw[2];
  const cell = (w: number, content: React.ReactNode, color: string = C.text, bold = false): React.ReactNode => (
    <div style={{ width: w, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: bold ? 800 : 700, fontSize: 30, color }}>{content}</div>
  );
  const sum = spr(sumAt - 4, theme.spring.pop);
  const div = spr(divAt - 4, theme.spring.pop);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, transform: "translateX(-50%)", opacity: Math.min(1, head * 2) }}>
      <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: c, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", borderBottom: `2px solid ${alpha(C.text, 0.25)}`, paddingBottom: 6, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.1em", color: C.dim }}>
        <div style={{ width: cw[0], textAlign: "center" }}>{unit}</div>
        <div style={{ width: cw[1], textAlign: "center" }}>− {mean}</div>
        <div style={{ width: cw[2], textAlign: "center" }}>SQUARED</div>
      </div>
      {vals.map((v, i) => {
        const p = spr(rowAt[i] - 4, theme.spring.pop);
        const d = v - mean;
        return (
          <div key={i} style={{ display: "flex", height: rowH, alignItems: "center", opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -20}px)` }}>
            {cell(cw[0], v, c, true)}
            {cell(cw[1], d > 0 ? `+${d}` : d < 0 ? `−${-d}` : "0", C.dim)}
            {cell(cw[2], d * d, TAIL, true)}
          </div>
        );
      })}
      <div style={{ borderTop: `2px solid ${alpha(C.text, 0.25)}`, marginTop: 4, paddingTop: 8, display: "flex", justifyContent: "flex-end", gap: 14, alignItems: "baseline", opacity: Math.min(1, sum * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>
        <span style={{ fontFamily: theme.fonts.body, fontSize: 18, letterSpacing: "0.1em", color: C.dim }}>SUM</span>
        <span style={{ color: TAIL, width: cw[2], textAlign: "center" }}>{vals.reduce((a, v) => a + (v - mean) ** 2, 0)}</span>
      </div>
      <div style={{ marginTop: 10, textAlign: "center", opacity: Math.min(1, div * 2), transform: `scale(${interpolate(Math.min(1, div), [0, 1], [0.7, 1])})`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text }}>
        {res ?? (
          <>
            s² = 10 ÷ 4 = <span style={{ color: SE, textShadow: glowText(SE, 0.5) }}>2.5</span>
          </>
        )}
      </div>
    </div>
  );
};

// t table excerpt
export const TROWS = [6, 7, 8, 9, 10];
export const ONE_T = ["0.05", "0.025", "0.01", "0.005"];
export const TWO_T = ["0.10", "0.05", "0.02", "0.01"];
export const TVALS: Record<number, string[]> = {
  6: ["1.943", "2.447", "3.143", "3.707"],
  7: ["1.895", "2.365", "2.998", "3.499"],
  8: ["1.860", "2.306", "2.896", "3.355"],
  9: ["1.833", "2.262", "2.821", "3.250"],
  10: ["1.812", "2.228", "2.764", "3.169"],
};

export const TTable: React.FC<{ x: number; y: number; p: number; row?: number; col?: number; rowP?: number; colP?: number; cells?: [number, number][]; cellP?: number; hiHead?: "one" | "two" }> = ({ x, y, p, row, col, rowP = 0, colP = 0, cells = [], cellP = 0, hiHead }) => {
  const cw = 170, rh = 58, hw = 120;
  const W = hw + cw * 4;
  const H = rh * (TROWS.length + 2);
  const headC = (which: "one" | "two") => (hiHead === which ? TAIL : C.dim);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: `translateX(-50%) translateY(${(1 - p) * 20}px)`, opacity: Math.min(1, p * 1.5), borderRadius: 18, overflow: "hidden", background: "rgba(10,18,52,0.95)", border: `2px solid ${alpha(C.text, 0.2)}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: rh * 2, background: alpha(C.text, 0.08) }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: hw, height: H, background: alpha(C.text, 0.08) }} />
      {row !== undefined ? <div style={{ position: "absolute", left: 0, top: rh * (row + 2), width: hw + (W - hw) * rowP, height: rh, background: alpha(TAIL, 0.28), borderTop: `2px solid ${TAIL}`, borderBottom: `2px solid ${TAIL}` }} /> : null}
      {col !== undefined ? <div style={{ position: "absolute", left: hw + cw * col, top: 0, width: cw, height: rh * 2 + (H - rh * 2) * colP, background: alpha(TAIL, 0.28), borderLeft: `2px solid ${TAIL}`, borderRight: `2px solid ${TAIL}` }} /> : null}
      <div style={{ position: "absolute", left: 0, top: 0, width: hw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: headC("one") }}>ONE-TAIL</div>
      <div style={{ position: "absolute", left: 0, top: rh, width: hw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: headC("two") }}>TWO-TAIL</div>
      {ONE_T.map((h, j) => (
        <div key={`o${j}`} style={{ position: "absolute", left: hw + cw * j, top: 0, width: cw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: hiHead === "one" && col === j && colP > 0.5 ? TAIL : C.dim }}>{h}</div>
      ))}
      {TWO_T.map((h, j) => (
        <div key={`t${j}`} style={{ position: "absolute", left: hw + cw * j, top: rh, width: cw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: hiHead === "two" && col === j && colP > 0.5 ? TAIL : C.dim }}>{h}</div>
      ))}
      {TROWS.map((r, i) => (
        <React.Fragment key={r}>
          <div style={{ position: "absolute", left: 0, top: rh * (i + 2), width: hw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: row === i && rowP > 0.5 ? TAIL : C.dim }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: 16 }}>df</span> {r}
          </div>
          {TVALS[r].map((v, j) => {
            const hot = cells.some(([a, b]) => a === i && b === j) ? cellP : 0;
            return (
              <div key={j} style={{ position: "absolute", left: hw + cw * j, top: rh * (i + 2), width: cw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: hot > 0.3 ? C.ink : alpha(C.text, 0.85), background: hot > 0.01 ? alpha(TAIL, hot) : "transparent", transform: `scale(${1 + 0.15 * hot})`, borderRadius: 10, boxShadow: hot > 0.3 ? glowBox(TAIL, hot) : "none", zIndex: hot > 0 ? 2 : 1 }}>
                {v}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

// t(8) density and zone curve
export const tf = (v: number) => tpdf(v, DF);
export const TFMAX = tpdf(0, DF);
export const tGeo = (base: number, h: number, x0 = 120, x1 = 960): Geo => ({ x0, x1, vmin: -4.5, vmax: 4.5, base, h });
export const TZone: React.FC<{ g: Geo; p: number; zones: number; side?: "two" | "right" | "left"; labels?: boolean }> = ({ g, p, zones, side = "two", labels = true }) => {
  const cut = side === "two" ? 2.306 : 1.86;
  const bands =
    side === "two"
      ? [{ a: -4.5, b: -cut, color: TAIL, opacity: 0.7, p: zones }, { a: cut, b: 4.5, color: TAIL, opacity: 0.7, p: zones }, { a: -cut, b: cut, color: SE, opacity: 0.18, p: zones }]
      : side === "right"
        ? [{ a: cut, b: 4.5, color: TAIL, opacity: 0.7, p: zones }, { a: -4.5, b: cut, color: SE, opacity: 0.18, p: zones }]
        : [{ a: -4.5, b: -cut, color: TAIL, opacity: 0.7, p: zones }, { a: -cut, b: 4.5, color: SE, opacity: 0.18, p: zones }];
  const lab = (x: number, top: number, t: React.ReactNode, c: string) => (
    <div style={{ position: "absolute", left: x, top, transform: "translateX(-50%)", opacity: zones, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, lineHeight: 1.25, letterSpacing: "0.1em", color: c }}>{t}</div>
  );
  return (
    <>
      <FnCurve g={g} f={tf} fmax={TFMAX} p={p} color={BB} fill={0.1} bands={bands} />
      <ValueAxis g={g} p={p} ticks={side === "two" ? [{ v: -cut, label: "−2.306", color: TAIL, big: true }, { v: 0, label: "0" }, { v: cut, label: "+2.306", color: TAIL, big: true }] : side === "right" ? [{ v: 0, label: "0" }, { v: cut, label: "+1.860", color: TAIL, big: true }] : [{ v: -cut, label: "−1.860", color: TAIL, big: true }, { v: 0, label: "0" }]} />
      {labels ? (
        <>
          {side !== "right" ? lab(gx(g, -3.85), g.base - g.h * 0.5, <>REJECT<br />{side === "two" ? "2.5%" : "5%"}</>, TAIL) : null}
          {side !== "left" ? lab(gx(g, 3.95), g.base - g.h * 0.5, <>REJECT<br />{side === "two" ? "2.5%" : "5%"}</>, TAIL) : null}
          {lab(gx(g, side === "two" ? 0 : side === "right" ? -0.6 : 0.6), g.base - g.h * 0.42, <>FAIL TO REJECT<br />95%</>, SE)}
        </>
      ) : null}
    </>
  );
};

export const TSTEPS = ["HYPOTHESES", "ALPHA", "FORMULA", "t TABLE", "DECIDE"];
export const StepTracker: React.FC<{ active: number }> = ({ active }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const k = spr(2, theme.spring.smooth);
  const glow = ease(frame, [0, 14], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 90, top: 250, width: 900, display: "flex", gap: 10, opacity: Math.min(1, k * 2) }}>
      {TSTEPS.map((t, i) => {
        const done = i < active;
        const on = i === active;
        const c = done ? SE : on ? C.yellow : alpha(C.text, 0.3);
        return (
          <div key={t} style={{ flex: 1, height: 64, boxSizing: "border-box", borderRadius: 16, border: `2px solid ${c}`, background: on ? alpha(C.yellow, 0.14 * glow) : done ? alpha(SE, 0.12) : "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 17, letterSpacing: "0.06em", color: on ? C.text : done ? SE : C.dim, transform: on ? `scale(${interpolate(glow, [0, 1], [0.94, 1])})` : undefined }}>
            {done ? (
              <svg width={20} height={20} viewBox="0 0 20 20" style={{ display: "block" }}>
                <path d="M3 10 L8 15 L17 4" fill="none" stroke={SE} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{ fontFamily: theme.fonts.mono, fontSize: 20 }}>{i + 1}</span>
            )}
            {t}
          </div>
        );
      })}
    </div>
  );
};

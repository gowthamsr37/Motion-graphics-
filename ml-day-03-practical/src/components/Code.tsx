// A code-editor window for the practical guide: a title bar with three dots and a filename, numbered lines that type in
// one by one at given frames (simple Python highlighting: keywords violet, strings green, numbers orange, comments dim,
// functions cyan), and an optional output panel beneath ("Out:").
import React from "react";
import { useCurrentFrame } from "remotion";
import { ease } from "./Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;
const KW = new Set(["import", "from", "as", "def", "return", "for", "in", "if", "print", "None", "True", "False"]);

const hl = (line: string) => {
  if (line.trim().startsWith("#")) return [<span key={0} style={{ color: alpha(C.text, 0.45) }}>{line}</span>];
  const out: React.ReactNode[] = [];
  const re = /("[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*(?=\()|\b[A-Za-z_][A-Za-z0-9_]*\b|[^"'\w]+)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(line))) {
    const t = m[0];
    let c: string = C.text;
    if (/^["']/.test(t)) c = C.green;
    else if (/^\d/.test(t)) c = C.orange;
    else if (KW.has(t)) c = C.violet;
    else if (/^[A-Za-z_]\w*$/.test(t) && line[m.index + t.length] === "(") c = C.cyan;
    out.push(<span key={k++} style={{ color: c }}>{t}</span>);
  }
  return out;
};

export const Code: React.FC<{ file?: string; lines: string[]; at: number[]; w?: number; fs?: number; out?: { at: number; text: React.ReactNode } }> = ({ file = "flats.py", lines, at, w = 980, fs = 34, out }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, borderRadius: 22, overflow: "hidden", background: "#0B1020", border: `3px solid ${alpha(C.text, 0.18)}`, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "#141B33" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim }}>{file}</div>
      </div>
      <div style={{ padding: "20px 26px", display: "flex", flexDirection: "column", gap: 10 }}>
        {lines.map((l, i) => {
          const p = ease(frame, [at[i] ?? 0, (at[i] ?? 0) + 8], [0, 1]);
          const n = Math.round(l.length * p);
          return (
            <div key={i} style={{ display: "flex", gap: 20, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: fs, whiteSpace: "pre", opacity: p > 0 ? 1 : 0.15 }}>
              <span style={{ color: alpha(C.text, 0.3), width: 34, textAlign: "right" }}>{i + 1}</span>
              <span>{p > 0 ? hl(l.slice(0, n)) : null}</span>
            </div>
          );
        })}
      </div>
      {out ? (
        <div style={{ borderTop: `2px solid ${alpha(C.text, 0.12)}`, padding: "16px 26px", background: "#070B17", opacity: ease(frame, [out.at, out.at + 8], [0, 1]), fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: fs - 4, color: C.text, whiteSpace: "pre" }}>
          <span style={{ color: C.yellow }}>Out: </span>
          {out.text}
        </div>
      ) : null}
    </div>
  );
};

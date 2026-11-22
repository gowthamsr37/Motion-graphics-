// SCENE 4 — REPEAT THE POLL. Each new poll result (51, 53, 52, 50, 54, then many more) drops as a chip onto a 46–58%
// axis and stacks; a bell outline draws over the pile; MOST LAND NEAR THE MIDDLE; tag: THAT'S THE CENTRAL LIMIT THEOREM.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FnCurve, Geo, gx, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, rng } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Arrow } from "../components/Icons";
import { bell, USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const G: Geo = { x0: 140, x1: 940, vmin: 46.5, vmax: 57.5, base: 1120, h: 150 * 0.2525 * 11 };
const FIRST = [51, 53, 52, 50, 54];
const r = rng(31);
const gauss = () => {
  const u = Math.max(1e-6, r()), v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const MORE = Array.from({ length: 145 }, () => Math.round(Math.min(57, Math.max(47, 52 + 1.58 * gauss()))));
const ALL = [...FIRST, ...MORE];
// stack height per value, in drop order
const LEVEL: number[] = [];
{
  const cnt: Record<number, number> = {};
  for (const v of ALL) {
    cnt[v] = (cnt[v] ?? 0) + 1;
    LEVEL.push(cnt[v] - 1);
  }
}
const CH = 11; // chip height + gap

export const S4Repeat: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const AGAIN = s.cueS(0, "again");
  const F = [s.cueS(1, "51"), s.cueS(1, "53"), s.cueS(1, "52"), s.cueS(1, "50"), s.cueS(1, "54")];
  const STACK = s.cueS(1, "Stack");
  const BELL = s.cueS(1, "bell");
  const MID = s.cueS(2, "middle.");
  const CLT = s.sent(3).from;
  const dropAt = (i: number) => (i < 5 ? F[i] - 4 : STACK + (i - 5) * ((BELL + 12 - STACK) / MORE.length));
  const curve = ease(frame, [BELL - 4, BELL + 26], [0, 1]);
  const mid = ease(frame, [MID - 10, MID + 6], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="RUN THE POLL AGAIN AND AGAIN" color={U.c} at={2} />
      <Pop at={AGAIN - 8} x={540} y={400} from="up" dist={12}>
        <div style={{ display: "flex", gap: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ padding: "8px 18px", borderRadius: 14, border: `2px solid ${alpha(U.c, 0.7)}`, background: alpha(U.c, 0.12), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap", opacity: ease(frame, [AGAIN - 6 + i * 5, AGAIN + i * 5], [0, 1]) }}>POLL {i + 1}</div>
          ))}
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.dim, alignSelf: "center", opacity: ease(frame, [AGAIN + 18, AGAIN + 24], [0, 1]) }}>…</div>
        </div>
      </Pop>
      <Pop at={AGAIN + 6} x={540} y={470} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>A DIFFERENT 1,000 PEOPLE EACH TIME</div>
      </Pop>
      {/* middle band */}
      <div style={{ position: "absolute", left: gx(G, 50.5), width: gx(G, 53.5) - gx(G, 50.5), top: G.base - G.h - 10, height: G.h + 10, borderRadius: 18, background: alpha(C.green, 0.1 * mid), border: `2px dashed ${alpha(C.green, 0.6 * mid)}` }} />
      {ALL.map((v, i) => {
        const t0 = dropAt(i);
        const p = ease(frame, [t0, t0 + (i < 5 ? 10 : 6)], [0, 1], theme.ease.out);
        if (p <= 0) return null;
        const yEnd = G.base - 8 - LEVEL[i] * CH;
        const y = interpolate(p, [0, 1], [yEnd - 160, yEnd]);
        const w = (gx(G, 1) - gx(G, 0)) * 0.82;
        return <div key={i} style={{ position: "absolute", left: gx(G, v) - w / 2, top: y - 8, width: w, height: 8, borderRadius: 3, background: i < 5 ? U.c : alpha(U.c, 0.55), boxShadow: i < 5 ? `0 0 10px ${U.c}` : "none", opacity: Math.min(1, p * 2) }} />;
      })}
      {FIRST.map((v, i) => (
        <Pop key={i} at={F[i] - 4} out={STACK + 10} x={gx(G, v)} y={G.base - 70 - LEVEL[i] * CH - (i === 2 ? 36 : 0)} from="up" dist={30} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: U.c, textShadow: glowText(U.c, 0.5) }}>{v}%</div>
        </Pop>
      ))}
      <FnCurve g={G} f={bell(52, 1.58)} fmax={1} p={curve} color={C.yellow} fill={0.05} width={6} />
      <ValueAxis g={G} ticks={[47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].map((v) => ({ v, label: `${v}`, color: v === 52 ? U.c : undefined, big: v === 52 }))} label="POLL RESULT (% SAYING YES)" />
      <Pop at={MID - 6} x={540} y={540} from="up" dist={10} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.green, whiteSpace: "nowrap" }}>MOST LAND NEAR THE MIDDLE</div>
      </Pop>
      <Pop at={CLT - 4} x={540} y={1260} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={C.yellow} size={30}>
          THAT&apos;S THE CENTRAL LIMIT THEOREM
        </Tag>
      </Pop>
      <Pop at={s.cueS(3, "yes") - 4} x={540} y={1340} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: C.dim, whiteSpace: "nowrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>YES/NO ANSWERS <Arrow size={26} color={C.dim} /></span> <span style={{ color: C.yellow }}>AVERAGES FORM A BELL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

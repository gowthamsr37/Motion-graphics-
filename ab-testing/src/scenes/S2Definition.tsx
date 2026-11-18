// SCENE 2 — THE DEFINITION: TWO VERSIONS (A and B) · shown to RANDOM GROUPS of users · a HYPOTHESIS TEST decides
// if the difference is real.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AC, BC, NULLC, PV } from "../components/AB";
import { DefCard } from "../components/Explain";
import { PeopleGlyph } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const MiniAB: React.FC = () => (
  <div style={{ display: "flex", gap: 8 }}>
    {[AC, BC].map((c, i) => (
      <div key={c} style={{ width: 46, height: 46, borderRadius: 12, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.ink }}>{i ? "B" : "A"}</div>
    ))}
  </div>
);

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={BC} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "show ", key: "TWO VERSIONS", c: BC, at: s.cueS(1, "two"), icon: <MiniAB /> },
          { pre: "to ", key: "RANDOM GROUPS", c: NULLC, at: s.cueS(1, "random"), icon: <PeopleGlyph size={60} color={NULLC} /> },
          { pre: "a ", key: "HYPOTHESIS TEST", post: " decides", c: PV, at: s.cueS(2, "hypothesis") },
        ]}
      />
      <Pop at={doneAt} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S <span style={{ color: AC }}>A</span>/<span style={{ color: BC }}>B</span> TESTING
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

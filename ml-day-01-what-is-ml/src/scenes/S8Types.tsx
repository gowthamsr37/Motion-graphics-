// SCENE 8 — THE 3 TYPES. Three notebook rows, each sketched on its sentence: SUPERVISED (flash cards with ✓/✗ answers ·
// learns from examples WITH answers · e.g. spam or not spam), UNSUPERVISED (dots that get circled into 3 groups · NO
// answers, finds hidden groups · e.g. types of customers), REINFORCEMENT (gamepad + trophy · trial & error + rewards ·
// e.g. mastering a video game).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Clusters, Flashcards, Gamepad, Trophy } from "../components/Doodles";
import { Header, Hi, Layer, Sketch, Write, WriteAt } from "../components/NB";
import { nb } from "../theme";
import { useScene } from "../timing";

export const S8Types: React.FC = () => {
  const s = useScene("s8");
  const rows = [
    { y: 520, t: "Supervised", c: nb.blue, hl: nb.sky, d1: "learns from examples WITH answers", d2: "e.g. spam or not spam", at: s.cueS(1, "Supervised"), d: s.cueS(1, "answers,") },
    { y: 840, t: "Unsupervised", c: nb.orange, hl: "#FFD8A8", d1: "NO answers: finds hidden groups", d2: "e.g. types of customers", at: s.cueS(2, "Unsupervised"), d: s.cueS(2, "groups,") },
    { y: 1160, t: "Reinforcement", c: nb.purple, hl: "#D0BFFF", d1: "trial and error + rewards", d2: "e.g. mastering a video game", at: s.cueS(3, "Reinforcement"), d: s.cueS(3, "rewards,") },
  ];
  return (
    <AbsoluteFill>
      <Header text="the 3 types of machine learning" at={s.sent(0).from - 4} />
      <Layer>
        <Flashcards x={235} y={rows[0].y} s={200} at={rows[0].at - 6} />
        <Clusters x={235} y={rows[1].y} s={210} at={rows[1].at - 6} />
        <Gamepad x={215} y={rows[2].y + 10} s={190} at={rows[2].at - 6} />
        <Trophy x={300} y={rows[2].y - 70} s={90} at={s.cueS(3, "rewards,") - 4} />
        {[680, 1000].map((y, i) => (
          <Sketch key={y} s={{ k: "line", x1: 160, y1: y, x2: 980, y2: y + 4 }} at={rows[i + 1].at - 12} dur={10} o={{ color: nb.faint, width: 2.5, seed: 400 + i }} />
        ))}
      </Layer>
      {rows.map((r, i) => (
        <React.Fragment key={r.t}>
          <div style={{ position: "absolute", left: 380, top: r.y - 60, transform: "translateY(-50%)" }}>
            <WriteAt x={-40} y={0} at={r.at - 6} size={56} color={r.c} cps={30} pencil={false}>
              {`${i + 1}`}
            </WriteAt>
            <Hi at={r.at + 8} color={r.hl}>
              <Write at={r.at - 4} size={82} color={r.c} cps={26}>
                {r.t}
              </Write>
            </Hi>
          </div>
          <WriteAt x={385} y={r.y + 20} align="left" at={r.d - 10} size={44} font="body" cps={46} pencil={false}>
            {r.d1}
          </WriteAt>
          <WriteAt x={385} y={r.y + 80} align="left" at={r.d - 2} size={40} color={nb.pencil} font="body" cps={46} pencil={false}>
            {r.d2}
          </WriteAt>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

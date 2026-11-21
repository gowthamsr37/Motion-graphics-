// SCENES 3–9 — one full-screen card per test (data and template in components/Tests.tsx).
import React from "react";
import { AbsoluteFill } from "remotion";
import { TestCard } from "../components/Tests";
import type { SceneId } from "../timing";

const make = (id: SceneId, idx: number): React.FC => {
  const Card: React.FC = () => (
    <AbsoluteFill>
      <TestCard id={id} idx={idx} />
    </AbsoluteFill>
  );
  return Card;
};

export const CARD_SCENES: Record<string, React.FC> = Object.fromEntries((["s3", "s4", "s5", "s6", "s7", "s8", "s9"] as SceneId[]).map((id, i) => [id, make(id, i)]));

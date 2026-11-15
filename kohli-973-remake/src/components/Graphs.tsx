import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { milestones } from "../data";
import { theme, toneColor, toneGlow } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering } from "./Panel";

// Graph A: the chase as a connected scoreboard timeline. lit[i] (0..1) lights milestone i.
export const MilestoneRail: React.FC<{ w: number; lit: number[] }> = ({ w, lit }) => {
  const n = milestones.length;
  const pad = 70;
  const x = (i: number) => pad + (i * (w - pad * 2)) / (n - 1);
  return (
    <div style={{ position: "relative", width: w, height: 200 }}>
      <div style={{ position: "absolute", left: pad, right: pad, top: 92, height: 3, background: theme.colors.creamFaint }} />
      {milestones.slice(1).map((m, i) => (
        <div
          key={m.score}
          style={{
            position: "absolute",
            left: x(i),
            top: 91,
            height: 5,
            width: (x(i + 1) - x(i)) * Math.min(1, lit[i + 1] ?? 0),
            background: i === 0 ? theme.colors.amber : theme.colors.amber,
            boxShadow: `0 0 10px ${theme.colors.amberGlow}`,
          }}
        />
      ))}
      {milestones.map((m, i) => {
        const on = Math.min(1, Math.max(0, lit[i] ?? 0));
        const col = on > 0.3 ? toneColor(m.tone) : theme.colors.creamFaint;
        return (
          <div key={m.score} style={{ position: "absolute", left: x(i) - 90, width: 180, top: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Lettering size={44} color={col} style={{ opacity: 0.35 + 0.65 * on, textShadow: on > 0.3 && m.tone !== "cream" ? `0 0 14px ${toneGlow(m.tone)}` : undefined }}>
              {m.score}
            </Lettering>
            <div style={{ marginTop: 18 }}>
              <Lamp color={toneColor(m.tone === "cream" ? "amber" : m.tone)} glow={toneGlow(m.tone === "cream" ? "amber" : m.tone)} on={on} size={24} />
            </div>
            <div style={{ marginTop: 14, textAlign: "center", opacity: 0.4 + 0.6 * on }}>
              <Lettering size={17} font="body" color={on > 0.3 ? theme.colors.cream : theme.colors.creamDim} spacing="0.12em">
                {m.caption}
              </Lettering>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Ten wicket lamps: `fallen` (fractional) light up red one after another; the last unlit one can pulse.
export const WicketLamps: React.FC<{ fallen: number; pulseLast?: boolean; size?: number }> = ({ fallen, pulseLast = false, size = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 0.9);
  return (
    <div style={{ display: "flex", gap: size * 0.38, justifyContent: "center" }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const on = interpolate(fallen - i, [0, 1], [0, 1], CLAMP);
        const isLast = i === 9 && pulseLast && on < 0.5;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Lamp color={theme.colors.red} glow={theme.colors.redGlow} on={on} size={size} />
            {isLast && (
              <div style={{ marginTop: -size - 8, width: size, height: size, borderRadius: size, boxShadow: `0 0 0 3px ${theme.colors.amber}`, opacity: 0.4 + 0.6 * pulse }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

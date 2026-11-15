import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PhotoId, photos } from "../photos";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lettering, Panel } from "./Panel";

const C = theme.colors;

// A genuine photograph hung in a scoreboard frame: shutter-opens like every panel, slow Ken Burns move,
// graded cold (2014) or warm (2018), with its place/date plate and licence credit painted beneath.
export const PhotoFrame: React.FC<{
  id: PhotoId;
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  closeAt?: number;
  focus?: string; // object-position
  zoom?: [number, number]; // Ken Burns scale from → to over `life` frames
  pan?: [number, number]; // horizontal drift in px
  life?: number;
  warmth?: number; // 0 = cold, desaturated 2014 · 1 = warm amber 2018
  label?: string; // optional year tag painted on the frame
  labelColor?: string;
  seed?: number;
  glow?: string;
  glowOn?: number;
  compact?: boolean; // small caption for narrow frames
}> = ({ id, x, y, w, h, delay = 0, closeAt, focus = "50% 40%", zoom = [1.04, 1.14], pan = [0, 0], life = 300, warmth = 1, label, labelColor = C.amber, seed = 600, glow, glowOn = 0, compact = false }) => {
  const frame = useCurrentFrame();
  const p = photos[id];
  const t = interpolate(frame, [delay, delay + life], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const scale = interpolate(t, [0, 1], zoom);
  const dx = interpolate(t, [0, 1], pan);
  const capH = compact ? 62 : 74;
  const inset = 12;
  const cold = 1 - warmth;
  const filter = `grayscale(${0.55 * cold}) sepia(${0.12 + 0.2 * warmth}) saturate(${0.85 + 0.25 * warmth}) brightness(${0.62 + 0.3 * warmth}) contrast(${1.12 - 0.04 * warmth})`;
  return (
    <Panel x={x} y={y} w={w} h={h} delay={delay} closeAt={closeAt} seed={seed} glow={glow} glowOn={glowOn}>
      <div style={{ position: "absolute", left: inset, top: inset, width: w - inset * 2, height: h - inset * 2 - capH, overflow: "hidden", borderRadius: 4, background: C.board }}>
        <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, transform: `translateX(${dx}px) scale(${scale})`, filter }} />
        {/* grade: steel-blue night for 2014, amber floodlight for 2018 */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(40,70,90,${0.32 * cold}) 0%, rgba(10,20,30,${0.38 * cold}) 100%)`, mixBlendMode: "multiply" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 10%, rgba(242,169,59,${0.28 * warmth}) 0%, transparent 65%)`, mixBlendMode: "soft-light" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${C.trimCream}44, inset 0 0 80px rgba(0,0,0,0.55)` }} />
        {label && (
          <div style={{ position: "absolute", left: 16, top: 16, padding: "8px 14px 6px", borderRadius: 6, background: "rgba(10,15,12,0.82)", boxShadow: `inset 0 0 0 2px ${C.panelEdge}` }}>
            <Lettering size={compact ? 40 : 50} color={labelColor}>
              {label}
            </Lettering>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: inset, right: inset, bottom: inset, height: capH - 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6 }}>
        <Lettering size={compact ? 16 : 25} font="body" weight={600} spacing={compact ? "0.07em" : "0.14em"} style={{ whiteSpace: "nowrap" }}>
          {p.place}
        </Lettering>
        <Lettering size={compact ? 11 : 15} font="body" weight={400} color={C.creamDim} spacing={compact ? "0.06em" : "0.12em"} style={{ whiteSpace: "nowrap" }}>
          {p.credit}
        </Lettering>
      </div>
    </Panel>
  );
};

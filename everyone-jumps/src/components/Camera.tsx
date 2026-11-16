import { interpolate } from "remotion";
import { CLAMP, theme } from "../theme";
import { EarthView } from "./Earth";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const lerpView = (a: EarthView, b: EarthView, k: number): EarthView => ({
  ...b,
  cx: lerp(a.cx, b.cx, k),
  cy: lerp(a.cy, b.cy, k),
  r: Math.exp(lerp(Math.log(a.r), Math.log(b.r), k)), // zooms feel even in log space
  lat: lerp(a.lat, b.lat, k),
  lon: lerp(a.lon, b.lon, k),
  ghost: lerp(a.ghost ?? 0, b.ghost ?? 0, k),
  exposure: lerp(a.exposure ?? 1.6, b.exposure ?? 1.6, k),
  utc: lerp(a.utc ?? 12, b.utc ?? 12, k),
});

// Camera keys: hold each view, then glide to the next over `dur` frames starting at `at`.
export const camera = (frame: number, keys: { at: number; dur: number; v: EarthView }[]) => {
  let v = keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const k = interpolate(frame, [keys[i].at, keys[i].at + keys[i].dur], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
    if (k <= 0) break;
    v = lerpView(v, keys[i].v, k);
  }
  return v;
};

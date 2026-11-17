// Shared camera moves and coin motion, so the opening and closing coin shots match exactly (loop).
import { interpolate } from "remotion";
import { CLAMP, theme } from "./theme";
import { Cam, CoinPose, V3 } from "./three/views";

export const COIN_Y = 1.62;

// Heroic low angle: camera below the coin looking up past it to the stands and floodlights.
export const heroCam = (a: number, dist = 0.74, h = 1.47, fov = 48): Cam => ({
  pos: [Math.cos(a) * dist, h, Math.sin(a) * dist],
  target: [0, COIN_Y - 0.03, 0],
  fov,
});

// The coin as it hangs near the top of the toss, flipping end over end (slow motion).
export const spinPose = (t: number, rate = 3.2, phase = 0.9): CoinPose => ({
  y: COIN_Y + 0.025 * Math.sin(t * 0.9),
  flip: phase + t * rate,
  tilt: 0.22 * Math.sin(t * 0.7 + 0.4),
});

// Ease a value between keyframes (frame → value).
export const track = (frame: number, keys: [number, number][], ease = theme.ease.inOut) => {
  const fr = keys.map((k) => k[0]);
  const vs = keys.map((k) => k[1]);
  return interpolate(frame, fr, vs, { ...CLAMP, easing: ease });
};

export const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({ pos: lerp3(a.pos, b.pos, k), target: lerp3(a.target, b.target, k), fov: a.fov + (b.fov - a.fov) * k, roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * k });

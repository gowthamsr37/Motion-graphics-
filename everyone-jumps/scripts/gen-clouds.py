"""Procedural cloud map (equirectangular, seamless on the sphere) -> public/tex/clouds.png.

The Blue Marble texture is cloud-free; real Earth from space is ~2/3 cloudy. This builds a light,
plausible cloud layer from 3D fractal noise sampled on the sphere (so there is no seam or pole
pinch), with more cloud in the tropical convergence band and the mid-latitude storm tracks and
less over the subtropical deserts. Run once: python scripts/gen-clouds.py
"""
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
W, H = 2048, 1024
rng = np.random.default_rng(7)
PERM = rng.permutation(256)
PERM = np.concatenate([PERM, PERM])
GRAD = rng.normal(size=(256, 3))
GRAD /= np.linalg.norm(GRAD, axis=1, keepdims=True)


def gnoise(p):
    """3D gradient noise, vectorised. p: (..., 3)."""
    i = np.floor(p).astype(np.int64)
    f = p - i
    u = f * f * f * (f * (f * 6 - 15) + 10)
    out = 0.0
    res = np.zeros(p.shape[:-1])
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                ii = (i[..., 0] + dx) & 255
                jj = (i[..., 1] + dy) & 255
                kk = (i[..., 2] + dz) & 255
                h = PERM[PERM[PERM[ii] + jj] + kk]
                g = GRAD[h]
                d = f - np.array([dx, dy, dz])
                dot = (g * d).sum(-1)
                wx = u[..., 0] if dx else 1 - u[..., 0]
                wy = u[..., 1] if dy else 1 - u[..., 1]
                wz = u[..., 2] if dz else 1 - u[..., 2]
                res += dot * wx * wy * wz
    return res


def fbm(p, octaves=7, lac=2.03, gain=0.5):
    s, a = 0.0, 0.5
    for o in range(octaves):
        s = s + a * gnoise(p + o * 17.31)
        p = p * lac
        a *= gain
    return s


lon = (np.arange(W) + 0.5) / W * 2 * np.pi - np.pi
lat = np.pi / 2 - (np.arange(H) + 0.5) / H * np.pi
LON, LAT = np.meshgrid(lon, lat)
P = np.stack([np.cos(LAT) * np.sin(LON), np.sin(LAT), np.cos(LAT) * np.cos(LON)], -1)

# Stretch along longitude at mid-latitudes (storm bands), domain-warp for swirls.
warp = np.stack([fbm(P * 1.6 + 3.1, 4), fbm(P * 1.6 + 8.7, 4), fbm(P * 1.6 + 1.9, 4)], -1)
Q = P * np.array([2.2, 3.4, 2.2]) + warp * 1.35
n = fbm(Q, 7)

latd = np.degrees(LAT)
band = (
    0.10 * np.exp(-((latd - 6) / 9) ** 2)  # tropical convergence zone
    + 0.12 * np.exp(-((np.abs(latd) - 52) / 12) ** 2)  # storm tracks
    - 0.10 * np.exp(-((np.abs(latd) - 24) / 8) ** 2)  # subtropical deserts
    + 0.06 * np.exp(-((np.abs(latd) - 70) / 10) ** 2)
)
v = n + band
c = np.clip((v + 0.07) / 0.36, 0, 1) ** 1.25
# fine wispy detail
detail = fbm(P * 26.0 + warp * 0.4, 4)
c = np.clip(c * (0.78 + 0.9 * detail) - 0.04, 0, 1)
img = (c * 255).astype(np.uint8)
out = ROOT / "public" / "tex" / "clouds.png"
Image.fromarray(img, "L").save(out)
print("cloud cover (mean)", round(float(c.mean()), 3), "->", out)

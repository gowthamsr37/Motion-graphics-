"""Procedural Test-pitch surfaces for the five-day deterioration sequence (illustrative).

Writes public/tex/pitch_d{1,3,5}_col.png and _nrm.png: a 3.05 m × 3.05 m patch around the
batter's popping crease. Day 1: fresh, pale, a little live grass. Day 3: bowlers' footmarks outside
off stump and the first hairline cracks. Day 5: an open crack network (Voronoi-style plates),
rough dusty patches and deeper footmarks. Not a model of any real pitch.
Run once: python scripts/gen-pitch.py   (numpy + pillow)
"""
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
N = 2048
M = 3.05  # metres across
rng = np.random.default_rng(11)
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / N * M  # metres


def value_noise(scale, seed):
    r = np.random.default_rng(seed)
    g = r.random((int(M / scale) + 3, int(M / scale) + 3)).astype(np.float32)
    fx, fy = xx / scale, yy / scale
    ix, iy = fx.astype(int), fy.astype(int)
    tx, ty = fx - ix, fy - iy
    tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
    a, b = g[iy, ix], g[iy, ix + 1]
    c, d = g[iy + 1, ix], g[iy + 1, ix + 1]
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty


def fbm(scale, seed, octaves=5):
    s, a, tot = 0, 0.5, 0
    for o in range(octaves):
        s = s + a * value_noise(scale / (2 ** o), seed + o)
        tot += a
        a *= 0.5
    return s / tot


def voronoi_edges(cell, seed, wx, wy):
    """Distance (m) to the nearest Voronoi edge (F2 - F1) on domain-warped coordinates."""
    r = np.random.default_rng(seed)
    G = int(M / cell) + 6
    jit = r.random((G, G, 2)).astype(np.float32)
    X, Y = xx + wx, yy + wy
    gx, gy = np.floor(X / cell).astype(int) + 2, np.floor(Y / cell).astype(int) + 2
    f1 = np.full((N, N), 9.0, np.float32)
    f2 = np.full((N, N), 9.0, np.float32)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            cx, cy = gx + dx, gy + dy
            px = (cx - 2 + jit[cy, cx, 0]) * cell
            py = (cy - 2 + jit[cy, cx, 1]) * cell
            d = np.hypot(X - px, Y - py)
            f2 = np.where(d < f1, f1, np.minimum(f2, d))
            f1 = np.minimum(f1, d)
    return (f2 - f1) * 0.5


warp = (fbm(0.4, 3) - 0.5) * 0.06
crease_y = 0.9  # popping crease, metres from the top edge (the batter stands toward y=0)
mid = M / 2

base_noise = fbm(0.25, 1)
fine = fbm(0.03, 2, 4)
grass = np.clip((fbm(0.08, 5) - 0.56) * 3, 0, 1)

wx = (fbm(0.22, 51) - 0.5) * 0.09 + (fbm(0.05, 52, 3) - 0.5) * 0.012
wy = (fbm(0.22, 53) - 0.5) * 0.09 + (fbm(0.05, 54, 3) - 0.5) * 0.012
edges_big = voronoi_edges(0.42, 7, wx, wy)
edges_small = voronoi_edges(0.2, 8, wx * 1.3, wy * 1.3)
crack_noise = fbm(0.2, 9)


def footmarks(strength, seed):
    r = np.random.default_rng(seed)
    out = np.zeros((N, N), np.float32)
    # bowlers land just outside the batter's off stump, beyond the popping crease
    for _ in range(int(14 * strength) + 4):
        cx = mid + 0.55 + r.normal(0, 0.18)
        cy = crease_y + 1.3 + r.normal(0, 0.35)
        rx, ry = 0.09 + r.random() * 0.05, 0.14 + r.random() * 0.06
        ang = r.normal(0, 0.3)
        X, Y = xx - cx, yy - cy
        u = (X * np.cos(ang) + Y * np.sin(ang)) / rx
        v = (-X * np.sin(ang) + Y * np.cos(ang)) / ry
        out = np.maximum(out, np.clip(1 - (u * u + v * v), 0, 1) ** 0.6)
    return out * np.clip(0.6 + 0.8 * (fbm(0.05, seed + 1, 3) - 0.5), 0, 1)


def surface(day):
    k = {1: 0.0, 3: 0.5, 5: 1.0}[day]
    soil = np.stack([0.79, 0.67, 0.49])[:, None, None] * (0.86 + 0.22 * base_noise + 0.10 * (fine - 0.5))
    soil = soil * (1 - 0.06 * k) + np.stack([0.06, 0.05, 0.03])[:, None, None] * k  # drier, dustier
    g_amt = grass * (0.32 - 0.28 * k)
    col = soil * (1 - g_amt) + np.stack([0.42, 0.52, 0.28])[:, None, None] * g_amt
    height = 0.5 + 0.04 * (fine - 0.5) + 0.03 * (base_noise - 0.5)
    # cracks
    if day >= 3:
        k = {3: 0.28, 5: 1.0}[day]  # cracks open slowly at first, then quickly
        w_small = 0.0012 + 0.0014 * k
        w_big = 0.0014 + 0.0042 * k
        vis_big = np.clip((crack_noise - (0.52 - 0.3 * k)) * 8, 0, 1)
        vis_small = np.clip((crack_noise - (0.66 - 0.18 * k)) * 8, 0, 1) * k
        cmask_big = np.clip(1 - edges_big / w_big, 0, 1) ** 0.7 * vis_big
        cmask_small = np.clip(1 - edges_small / w_small, 0, 1) ** 0.7 * vis_small
        cm = np.maximum(cmask_big, cmask_small * 0.8)
        col = col * (1 - cm * 0.82)
        height = height - cm * (0.25 + 0.2 * k)
        # crack lips catch light: slightly paler plates near edges
        lip = (np.clip(1 - edges_big / (w_big * 3), 0, 1) - cm) * vis_big
        col = col + np.clip(lip, 0, 1) * 0.05
    k = {1: 0.0, 3: 0.5, 5: 1.0}[day]
    # footmarks
    if day >= 3:
        fm = footmarks(k, 21)
        rough = fbm(0.012, 22, 3)
        col = col * (1 - fm * (0.18 + 0.12 * k)) + fm * (rough - 0.5) * 0.12
        height = height - fm * (0.06 + 0.1 * k) + fm * (rough - 0.5) * 0.12 * k
    # rough dusty patches on day 5
    if day == 5:
        dust = np.clip((fbm(0.18, 31) - 0.58) * 5, 0, 1)
        col = col * (1 - dust * 0.1) + dust * 0.06
        height = height + dust * (fbm(0.01, 32, 3) - 0.5) * 0.1
    # crease lines (white paint), worn with time
    lines = np.zeros((N, N), np.float32)
    lw = 0.025
    lines = np.maximum(lines, (np.abs(yy - crease_y) < lw).astype(np.float32))
    for sx in (-1.32, 1.32):
        lines = np.maximum(lines, ((np.abs(xx - (mid + sx)) < lw) & (yy < crease_y + lw)).astype(np.float32))
    lines = lines * np.clip(1 - k * 0.45 * (fbm(0.04, 41, 3) > 0.55), 0, 1)
    col = col * (1 - lines) + 0.93 * lines
    return np.clip(col, 0, 1), height


def normal_map(h, strength=55.0):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * strength
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * strength
    n = np.stack([-dx, dy, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return ((n * 0.5 + 0.5) * 255).astype(np.uint8)


out = ROOT / "public" / "tex"
out.mkdir(parents=True, exist_ok=True)
for day in (1, 3, 5):
    col, h = surface(day)
    Image.fromarray((np.transpose(col, (1, 2, 0)) * 255).astype(np.uint8)).save(out / f"pitch_d{day}_col.jpg", quality=92)
    Image.fromarray(normal_map(h)).save(out / f"pitch_d{day}_nrm.png")
    print("day", day, "done")

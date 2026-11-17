// Chi-square helpers: the density (via log-gamma), the dice data, and a seeded simulation of fair-dice scores.
import { rng } from "./Motion";

const G = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
const lgamma = (z: number): number => {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  const x = z - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < 8; i++) a += G[i] / (x + i + 1);
  const t = x + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
};
export const chiPdf = (x: number, k: number) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - lgamma(k / 2)));
export const CRIT95 = 11.07; // chi-square, 5 df: 95% of scores fall below
export const OBS = [8, 9, 12, 11, 4, 16]; // 60 rolls of the dice in the Reel
export const EXPECTED = 10;
export const SCORE = OBS.reduce((a, o) => a + (o - EXPECTED) ** 2 / EXPECTED, 0); // 8.2
// 150 fair dice, 60 rolls each → their chi-square scores (seed 3 checked: mean 4.95, 5.3% above 11.07, max 19.0)
export const SIM = (() => {
  const r = rng(3);
  return Array.from({ length: 150 }, () => {
    const c = [0, 0, 0, 0, 0, 0];
    for (let j = 0; j < 60; j++) c[Math.floor(r() * 6)]++;
    return c.reduce((a, o) => a + (o - 10) ** 2 / 10, 0);
  });
})();

// Student's t helpers: exact density via log-gamma (Lanczos), the normal density, and the two-sided 95% cut-offs.
const G = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
export const lgamma = (z: number): number => {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  const x = z - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < 8; i++) a += G[i] / (x + i + 1);
  const t = x + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
};
export const tpdf = (x: number, nu: number) => Math.exp(lgamma((nu + 1) / 2) - lgamma(nu / 2)) / Math.sqrt(nu * Math.PI) * Math.pow(1 + (x * x) / nu, -(nu + 1) / 2);
export const npdf = (x: number) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
// two-sided 95% critical values (t tables)
export const Z95 = 1.96;
export const T95: Record<number, number> = { 4: 2.776, 9: 2.262, 29: 2.045 };

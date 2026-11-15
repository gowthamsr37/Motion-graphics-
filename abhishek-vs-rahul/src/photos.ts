// Player photos supplied by the creator. Both were cut out of their original backgrounds (BiRefNet, MIT licence)
// and are shown on one identical scoreboard-style backdrop so the two players match.
// subject: where the player sits in the cut-out (fractions of the image) — used to size both players identically.
export type PhotoId = "abhishek-cutout" | "rahul-cutout";

export const photos: Record<PhotoId, { src: string; place: string; credit: string; aspect: number; subject: { cx: number; width: number; top: number } }> = {
  "abhishek-cutout": { src: "photos/abhishek-cutout.png", place: "ABHISHEK SHARMA · INDIA", credit: "SUPPLIED PHOTO · BACKGROUND REPLACED", aspect: 512 / 512, subject: { cx: 0.5, width: 0.6, top: 0.02 } },
  "rahul-cutout": { src: "photos/rahul-cutout.png", place: "KL RAHUL · INDIA", credit: "SUPPLIED PHOTO · BACKGROUND REPLACED", aspect: 1020 / 648, subject: { cx: 0.455, width: 0.5, top: 0.02 } },
};

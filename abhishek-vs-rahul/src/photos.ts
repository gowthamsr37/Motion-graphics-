// Genuine photographs from Wikimedia Commons, credited on screen and in README.md.
// Abhishek Sharma photo: supplied by the creator (no freely licensed photo of him exists on Commons).
export type PhotoId = "rahul-t20wc-2022" | "abhishek-t20wc-2026";

export const photos: Record<PhotoId, { src: string; place: string; credit: string }> = {
  "rahul-t20wc-2022": { src: "photos/rahul-t20wc-2022.jpg", place: "KL RAHUL · T20 WORLD CUP · MCG · NOV 2022", credit: "PHOTO: STORM MACHINE · CC BY-SA 4.0 · WIKIMEDIA COMMONS" },
  "abhishek-t20wc-2026": { src: "photos/abhishek-t20wc-2026.jpg", place: "ABHISHEK SHARMA · T20 WORLD CUP 2026", credit: "SUPPLIED PHOTO" },
};

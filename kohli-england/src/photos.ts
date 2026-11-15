// Genuine photographs from Wikimedia Commons, credited on screen and in README.md (licences: CC BY 2.0 / CC BY-SA 2.0).
export type PhotoId = "otr-scoreboard-2014" | "otr-rain-2014" | "otr-ground-2014" | "otr-covers-2014" | "tb-2014-a" | "tb-2014-b" | "anderson-perth-2013" | "broad-anderson-2014" | "kohli-batting-tb-2018" | "kohli-century-tb-2018" | "kohli-leaves-tb-2018" | "tb-2018-wide" | "edgbaston-2018";

export const photos: Record<PhotoId, { src: string; place: string; credit: string }> = {
  "otr-scoreboard-2014": { src: "photos/otr-scoreboard-2014.jpg", place: "OLD TRAFFORD \u00b7 4TH TEST \u00b7 8 AUG 2014", credit: "PHOTO: ANTHONY O'NEIL \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "otr-rain-2014": { src: "photos/otr-rain-2014.jpg", place: "OLD TRAFFORD \u00b7 4TH TEST \u00b7 AUG 2014", credit: "PHOTO: ANTHONY O'NEIL \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "otr-ground-2014": { src: "photos/otr-ground-2014.jpg", place: "OLD TRAFFORD \u00b7 4TH TEST \u00b7 AUG 2014", credit: "PHOTO: ANTHONY O'NEIL \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "otr-covers-2014": { src: "photos/otr-covers-2014.jpg", place: "OLD TRAFFORD \u00b7 4TH TEST \u00b7 AUG 2014", credit: "PHOTO: ANTHONY O'NEIL \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "tb-2014-a": { src: "photos/tb-2014-a.jpg", place: "TRENT BRIDGE \u00b7 1ST TEST \u00b7 10 JUL 2014", credit: "PHOTO: DNCNH \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "tb-2014-b": { src: "photos/tb-2014-b.jpg", place: "TRENT BRIDGE \u00b7 1ST TEST \u00b7 10 JUL 2014", credit: "PHOTO: DNCNH \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "anderson-perth-2013": { src: "photos/anderson-perth-2013.jpg", place: "JAMES ANDERSON \u00b7 PERTH \u00b7 DEC 2013", credit: "PHOTO: DAN HEAP \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "broad-anderson-2014": { src: "photos/broad-anderson-2014.jpg", place: "STUART BROAD & JAMES ANDERSON \u00b7 JAN 2014", credit: "PHOTO: NAPARAZZI \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "kohli-batting-tb-2018": { src: "photos/kohli-batting-tb-2018.jpg", place: "KOHLI BATTING \u00b7 TRENT BRIDGE \u00b7 AUG 2018", credit: "PHOTO: IT'S NO GAME \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "kohli-century-tb-2018": { src: "photos/kohli-century-tb-2018.jpg", place: "KOHLI'S HUNDRED \u00b7 TRENT BRIDGE \u00b7 20 AUG 2018", credit: "PHOTO: DUN.CAN \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "kohli-leaves-tb-2018": { src: "photos/kohli-leaves-tb-2018.jpg", place: "AFTER HIS HUNDRED \u00b7 TRENT BRIDGE \u00b7 AUG 2018", credit: "PHOTO: IT'S NO GAME \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "tb-2018-wide": { src: "photos/tb-2018-wide.jpg", place: "TRENT BRIDGE \u00b7 3RD TEST \u00b7 20 AUG 2018", credit: "PHOTO: DUN.CAN \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "edgbaston-2018": { src: "photos/edgbaston-2018.jpg", place: "SHAMI AT EDGBASTON \u00b7 1ST TEST \u00b7 3 AUG 2018", credit: "PHOTO: AIDAN SAMMONS \u00b7 CC BY 2.0 \u00b7 WIKIMEDIA COMMONS" },
};

// Genuine photographs from Wikimedia Commons, credited on screen and in README.md.
// 2016 photos: the IPL final (CC0) and Kohli in June 2016 (CC BY 3.0). RCB/Chinnaswamy atmosphere photos are from May 2014 and captioned as such.
export type PhotoId = "chin-fireworks-2014" | "chin-floodlights-2014" | "chin-flags-2014" | "rcb-flag-2014" | "chin-stand-2014" | "chin-night-2014" | "chin-crowd-2014" | "final-2016-watson" | "final-2016-trophy" | "kohli-june-2016";

export const photos: Record<PhotoId, { src: string; place: string; credit: string }> = {
  "chin-fireworks-2014": { src: "photos/chin-fireworks-2014.jpg", place: "RCB AT THE CHINNASWAMY \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "chin-floodlights-2014": { src: "photos/chin-floodlights-2014.jpg", place: "CHINNASWAMY FLOODLIGHTS \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "chin-flags-2014": { src: "photos/chin-flags-2014.jpg", place: "RCB FANS \u00b7 CHINNASWAMY \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "rcb-flag-2014": { src: "photos/rcb-flag-2014.jpg", place: "AN RCB FLAG \u00b7 CHINNASWAMY \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "chin-stand-2014": { src: "photos/chin-stand-2014.jpg", place: "THE RCB STANDS \u00b7 CHINNASWAMY \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "chin-night-2014": { src: "photos/chin-night-2014.jpg", place: "CHINNASWAMY UNDER LIGHTS \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "chin-crowd-2014": { src: "photos/chin-crowd-2014.jpg", place: "RCB CROWD \u00b7 CHINNASWAMY \u00b7 MAY 2014", credit: "PHOTO: RAMESH NG \u00b7 CC BY-SA 2.0 \u00b7 WIKIMEDIA COMMONS" },
  "final-2016-watson": { src: "photos/final-2016-watson.jpg", place: "IPL 2016 FINAL \u00b7 SRH v RCB \u00b7 29 MAY 2016", credit: "PHOTO: MSNLALITHPREM \u00b7 CC0 \u00b7 WIKIMEDIA COMMONS" },
  "final-2016-trophy": { src: "photos/final-2016-trophy.jpg", place: "SRH WITH THE 2016 TROPHY \u00b7 29 MAY 2016", credit: "PHOTO: MSNLALITHPREM \u00b7 CC0 \u00b7 WIKIMEDIA COMMONS" },
  "kohli-june-2016": { src: "photos/kohli-june-2016.jpg", place: "VIRAT KOHLI \u00b7 JUNE 2016", credit: "PHOTO: BOLLYWOOD HUNGAMA \u00b7 CC BY 3.0 \u00b7 WIKIMEDIA COMMONS" },
};

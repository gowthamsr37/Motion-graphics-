import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

// Anton (OFL, via Fontsource) for numbers and headlines; Inter Display (OFL) for captions and labels.
const faces: { family: string; file: string; weight: string; format: string }[] = [
  { family: theme.fonts.display, file: "anton-latin-400-normal.woff2", weight: "400", format: "woff2" },
  { family: theme.fonts.body, file: "InterDisplay-SemiBold.otf", weight: "600", format: "opentype" },
  { family: theme.fonts.body, file: "InterDisplay-ExtraBold.otf", weight: "800", format: "opentype" },
  { family: theme.fonts.body, file: "InterDisplay-Black.otf", weight: "900", format: "opentype" },
];

const handle = delayRender("Loading fonts");

Promise.all(
  faces.map(async ({ family, file, weight, format }) => {
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('${format}')`, { weight });
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));

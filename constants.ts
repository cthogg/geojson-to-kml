import path from "path";

export const BLUE_PLAQUE_WIKI_LINKS_FILE = path.resolve(
  __dirname,
  "..",
  "bluePlaqueWikiLinks.json"
);
export const OUTPUT_FOLDER = path.resolve(__dirname, "output");
export const INPUT_FOLDER = path.resolve(__dirname, "input");
export const BLUE_PLAQUES_OUTPUT_FOLDER = path.resolve(
  OUTPUT_FOLDER,
  "blue-plaques-output"
);
export const LISTED_BUILDINGS_OUTPUT_FOLDER = path.resolve(
  OUTPUT_FOLDER,
  "listed-buildings-output"
);

// Add new constants
export const BLUE_PLAQUES_INPUT_FILE = path.resolve(
  INPUT_FOLDER,
  "london-open-plaques.json"
);
export const LISTED_BUILDINGS_INPUT_FILE = path.resolve(
  INPUT_FOLDER,
  "filtered-listed-buildings.geojson"
);

export const BATCH_SIZE = 10000;

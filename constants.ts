import path from "path";

export const BLUE_PLAQUE_WIKI_LINKS_FILE = path.resolve(
  __dirname,
  "..",
  "bluePlaqueWikiLinks.json"
);
export const LARGE_FILES_FOLDER = path.resolve(__dirname, "largeFiles");
export const BLUE_PLAQUES_OUTPUT_FOLDER = path.resolve(
  LARGE_FILES_FOLDER,
  "blue-plaques-output"
);
export const LISTED_BUILDINGS_OUTPUT_FOLDER = path.resolve(
  LARGE_FILES_FOLDER,
  "listed-buildings-output"
);

// Add new constants
export const BLUE_PLAQUES_INPUT_FILE = path.resolve(
  LARGE_FILES_FOLDER,
  "london-open-plaques.json"
);
export const LISTED_BUILDINGS_INPUT_FILE = path.resolve(
  LARGE_FILES_FOLDER,
  "filtered-listed-buildings.geojson"
);

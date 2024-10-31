import path from "path";
import { z } from "zod";
import {
  LISTED_BUILDINGS_INPUT_FILE,
  LISTED_BUILDINGS_OUTPUT_FOLDER,
} from "../constants";
import { Placemark } from "../types";
import { generateKmlFile, writeKmlFiles } from "../utils/kmlGeneration";
const listedBuildingSchema = z.object({
  geometry: z.string(),
  name: z.string(),
  reference: z.string(),
  documentation_url: z.string().url().optional(),
  listed_building_grade: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

const PLACEMARK_ID = "placemark-green";

const geoJsonPlacemarks = (geojson: unknown): Placemark[] =>
  z
    .array(listedBuildingSchema)
    .parse(geojson)
    .map((feature) => ({
      name: feature.name,
      description: `Grade ${feature.listed_building_grade} listed building. ${feature.documentation_url}`,
      styleUrl: `#${PLACEMARK_ID}`,
      Point: {
        coordinates: `${feature.longitude},${feature.latitude}`,
      },
      fullName: feature.name,
      wiki: {
        summary: "",
        url: "",
      },
    }));

export const generateListedBuildingsKml = async () => {
  const data = await Bun.file(LISTED_BUILDINGS_INPUT_FILE).text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(data));

  const config = {
    placemarkId: PLACEMARK_ID,
    documentName: "Listed buildings",
  };

  await writeKmlFiles(
    allPlacemarks,
    LISTED_BUILDINGS_OUTPUT_FOLDER,
    "listed-buildings",
    10000
  );

  // Generate single complete file
  const completeKml = generateKmlFile(allPlacemarks, config).replace(
    /&/g,
    "and"
  );
  await Bun.write(
    path.join(LISTED_BUILDINGS_OUTPUT_FOLDER, "listed-buildings-output.kml"),
    completeKml
  );
};

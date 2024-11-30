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
  "documentation-url": z.string().url().optional(),
  "listed-building-grade": z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

const PLACEMARK_ID = "placemark-green";

const BRITISH_LISTED_BUILDINGS_URL = "https://britishlistedbuildings.co.uk/";

const createBritishListedBuildingsUrl = (reference: string) =>
  `${BRITISH_LISTED_BUILDINGS_URL}${reference}`;

const geoJsonPlacemarks = (geojson: unknown): Placemark[] =>
  z
    .array(listedBuildingSchema)
    .parse(geojson)
    .map((feature) => ({
      name: feature.name,
      description: `Grade ${
        feature["listed-building-grade"]
      } listed building. ${
        feature["documentation-url"]
      } ${createBritishListedBuildingsUrl(feature.reference)}`,
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

export const generateListedBuildingsKml = async ({
  batchSize,
}: {
  batchSize: number;
}) => {
  const data = await Bun.file(LISTED_BUILDINGS_INPUT_FILE).text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(data));

  const config = {
    placemarkId: PLACEMARK_ID,
    documentName: "Listed buildings",
  };

  await writeKmlFiles(
    allPlacemarks,
    LISTED_BUILDINGS_OUTPUT_FOLDER,
    "listed-buildings-batched",
    batchSize
  );

  // Generate single complete file
  const completeKml = generateKmlFile(allPlacemarks, config).replace(
    /&/g,
    "and"
  );
  await Bun.write(
    path.join(LISTED_BUILDINGS_OUTPUT_FOLDER, "listed-buildings-full.kml"),
    completeKml
  );
};

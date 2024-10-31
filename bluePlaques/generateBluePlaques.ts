import path from "path";
import { z } from "zod";
import {
  BLUE_PLAQUES_INPUT_FILE,
  BLUE_PLAQUES_OUTPUT_FOLDER,
} from "../constants";
import { Placemark, WikiLinksJson } from "../types";
import { generateKmlFile, writeKmlFiles } from "../utils/kmlGeneration";
import wikilinks from "./bluePlaqueWikiLinks.json";

const plaqueSchema = z.object({
  id: z.number(),
  uri: z.string().url(),
  latitude: z.number(),
  longitude: z.number(),
  inscription: z.string(),
  title: z.string(),
  people: z.array(
    z.object({
      full_name: z.string(),
      uri: z.string().url(),
      primary_role_name: z.string().nullable(),
    })
  ),
  colour_name: z.string().nullable(),
});

const plaquesSchema = z.array(plaqueSchema);

const PLACEMARK_ID = "placemark-blue";

const geoJsonPlacemarks = (geojson: unknown): Placemark[] =>
  plaquesSchema.parse(geojson).map((feature) => {
    const wikijson = WikiLinksJson.parse(wikilinks);
    return {
      name: feature.title,
      description: feature.inscription,
      styleUrl: `#${PLACEMARK_ID}`,
      Point: {
        coordinates: `${feature.longitude},${feature.latitude}`,
      },
      fullName: feature.people[0]?.full_name,
      wiki: {
        summary: wikijson[feature.people[0]?.full_name]?.summary,
        url: wikijson[feature.people[0]?.full_name]?.url,
      },
    };
  });

export const generateBluePlaquesKml = async () => {
  console.log("Generating blue plaques KML...");
  const data = await Bun.file(BLUE_PLAQUES_INPUT_FILE).text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(data));

  const config = {
    placemarkId: PLACEMARK_ID,
    documentName: "Blue plaques",
  };

  await writeKmlFiles(
    allPlacemarks,
    BLUE_PLAQUES_OUTPUT_FOLDER,
    "output",
    20000
  );

  // Generate single complete file
  const completeKml = generateKmlFile(allPlacemarks, config).replace(
    /&/g,
    "and"
  );
  await Bun.write(
    path.join(BLUE_PLAQUES_OUTPUT_FOLDER, "blue-plaques-output.kml"),
    completeKml
  );

  console.log(`Blue plaques KML generated at ${BLUE_PLAQUES_OUTPUT_FOLDER}`);
};

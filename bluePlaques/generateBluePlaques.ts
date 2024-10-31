import { mkdir } from "node:fs/promises";
import path from "path";
import { z } from "zod";
import {
  BLUE_PLAQUES_INPUT_FILE,
  BLUE_PLAQUES_OUTPUT_FOLDER,
} from "../constants";
import { Placemark, WikiLinksJson } from "../types";
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

const frontMatter = `<?xml version="1.0" encoding="UTF-8"?>
<kml
	xmlns="http://earth.google.com/kml/2.2">
	<Document>
		<Style id="${PLACEMARK_ID}">
			<IconStyle>
				<Icon>
					<href>https://omaps.app/placemarks/${PLACEMARK_ID}.png</href>
				</Icon>
			</IconStyle>
		</Style>
		<name>Blue plaques</name>
		<visibility>1</visibility>
    `;

const endMatter = `	</Document>
</kml>`;

const placemarkToKml = (placemark: Placemark) => {
  return `
  <Placemark>
    <name>${placemark.name}</name>
    <description>${placemark.description}
    ${placemark.wiki.url}
    ${placemark.wiki.summary}
    </description>
    <styleUrl>${placemark.styleUrl}</styleUrl>
    <Point>
      <coordinates>${placemark.Point.coordinates}</coordinates>
    </Point>
  </Placemark>
  `;
};

const convertPlacemarksToKml = (placemarks: Placemark[]) => {
  return placemarks.map(placemarkToKml).join("\n");
};

const allPlacemarksText = (placemarks: Placemark[]) =>
  `${frontMatter}${convertPlacemarksToKml(placemarks)}${endMatter}`;

export const generateBluePlaquesKml = async () => {
  console.log("Generating blue plaques KML...");
  const foo = await Bun.file(BLUE_PLAQUES_INPUT_FILE).text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(foo));

  // Create output directory
  await mkdir(BLUE_PLAQUES_OUTPUT_FOLDER, { recursive: true });

  const batchSize = 20000;
  for (let i = 0; i < allPlacemarks.length; i += batchSize) {
    const batch = allPlacemarks.slice(i, i + batchSize);
    const file = allPlacemarksText(batch).replace(/&/g, "and");
    Bun.write(
      path.join(
        BLUE_PLAQUES_OUTPUT_FOLDER,
        `output-${Math.floor((i + 1) / batchSize)}.kml`
      ),
      file
    );
  }

  const file = allPlacemarksText(geoJsonPlacemarks(JSON.parse(foo))).replace(
    /&/g,
    "and"
  );

  Bun.write(
    path.join(BLUE_PLAQUES_OUTPUT_FOLDER, "blue-plaques-output.kml"),
    file
  );
  console.log(`Blue plaques KML generated at ${BLUE_PLAQUES_OUTPUT_FOLDER}`);
};

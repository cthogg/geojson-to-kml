import { mkdir } from "node:fs/promises";
import { z } from "zod";
import wikilinks from "./bluePlaqueWikiLinks.json";
import { Placemark, WikiLinksJson } from "./types";
// example plaque

// {
//   "id": 9850,
//   "erected_at": "1997-07-10",
//   "uri": "https://openplaques.org/plaques/9850",
//   "latitude": 51.48904,
//   "longitude": -0.29049,
//   "inscription": "Kew Bridge Pumping Station Unique in its approach to the preservation of water pumping equipment, in particular the original installations of five famous Cornish beam engines.",
//   "title": "Kew Bridge Pumping Station grey plaque",
//   "people": [
//     {
//       "full_name": "Kew Bridge Pumping Station",
//       "uri": "https://openplaques.org/people/19146.html",
//       "primary_role_name": "pumping station"
//     }
//   ],
//   "colour_name": "grey"
// }

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

// const featureSchema = z.object({
//   type: z.literal("Feature"),
//   geometry: z.object({
//     type: z.literal("Point"),
//     coordinates: z.tuple([z.number(), z.number()]),
//     is_accurate: z.boolean(),
//   }),
//   properties: z.object({
//     id: z.string(),
//     inscription: z.string(),
//     title: z.string(),
//     uri: z.string().url(),
//     type: z.literal("open-plaque"),
//   }),
// });
// const featureCollectionSchema = z.object({
//   type: z.literal("FeatureCollection"),
//   features: z.array(featureSchema),
// });

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
  const foo = await Bun.file("largeFiles/london-open-plaques.json").text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(foo));
  // make a new output folder and then create a new file for each in batches of 2000
  const outputFolder = "largeFiles/blue-plaques-output";
  await mkdir(outputFolder);
  const batchSize = 20000;
  for (let i = 0; i < allPlacemarks.length; i += batchSize) {
    const batch = allPlacemarks.slice(i, i + batchSize);
    // replace all & with because otherwise did not parse well
    const file = allPlacemarksText(batch).replace(/&/g, "and");
    Bun.write(
      `${outputFolder}/output-${Math.floor((i + 1) / batchSize)}.kml`,
      file
    );
  }

  const file = allPlacemarksText(geoJsonPlacemarks(JSON.parse(foo))).replace(
    /&/g,
    "and"
  );

  Bun.write("largeFiles/blue-plaques-output.kml", file);
};

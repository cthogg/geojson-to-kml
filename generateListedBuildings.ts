import { mkdir } from "node:fs/promises";
import { z } from "zod";
import { Placemark } from "./types";

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
    }));

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
		<name>Listed buildings</name>
		<visibility>1</visibility>
    `;

const endMatter = `	</Document>
</kml>`;

const placemarkToKml = (placemark: Placemark) => {
  return `
  <Placemark>
    <name>${placemark.name}</name>
    <description>${placemark.description}</description>
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

export const generateListedBuildingsKml = async () => {
  const foo = await Bun.file(
    "largeFiles/filtered-listed-buildings.geojson"
  ).text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(foo));

  // make a new output folder and then create a new file for each in batches of 2000
  const outputFolder = "largeFiles/listed-buildings-output";
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

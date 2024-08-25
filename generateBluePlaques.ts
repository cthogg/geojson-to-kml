import { mkdir } from "node:fs/promises";
import { z } from "zod";
type Placemark = {
  name: string;
  description: string;
  styleUrl: string;
  Point: {
    coordinates: string;
  };
};

const featureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
    is_accurate: z.boolean(),
  }),
  properties: z.object({
    id: z.string(),
    inscription: z.string(),
    title: z.string(),
    uri: z.string().url(),
    type: z.literal("open-plaque"),
  }),
});
const featureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(featureSchema),
});

const PLACEMARK_ID = "placemark-blue";

const geoJsonPlacemarks = (geojson: unknown): Placemark[] =>
  featureCollectionSchema.parse(geojson).features.map((feature) => ({
    name: feature.properties.title,
    description: feature.properties.inscription,
    styleUrl: `#${PLACEMARK_ID}`,
    Point: {
      coordinates: feature.geometry.coordinates.join(","),
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
		<name>Blue plaques</name>
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

export const generateBluePlaquesKml = async () => {
  const foo = await Bun.file("largeFiles/london-open-plaques.geojson").text();
  const allPlacemarks = geoJsonPlacemarks(JSON.parse(foo));

  // make a new output folder and then create a new file for each in batches of 2000
  const outputFolder = "largeFiles/blue-plaques-output";
  await mkdir(outputFolder);
  const batchSize = 2000;
  for (let i = 0; i < allPlacemarks.length; i += batchSize) {
    const batch = allPlacemarks.slice(i, i + batchSize);
    const file = allPlacemarksText(batch);
    Bun.write(
      `${outputFolder}/output-${Math.floor((i + 1) / batchSize)}.kml`,
      file
    );
  }

  const file = allPlacemarksText(geoJsonPlacemarks(JSON.parse(foo)));
  Bun.write("largeFiles/blue-plaques-output.kml", file);
};

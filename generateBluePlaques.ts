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

const geoJsonPlacemarks = (geojson: unknown): Placemark[] =>
  featureCollectionSchema.parse(geojson).features.map((feature) => ({
    name: feature.properties.title,
    description: feature.properties.inscription,
    styleUrl: "#placemark-red",
    Point: {
      coordinates: feature.geometry.coordinates.join(","),
    },
  }));

const frontMatter = `<?xml version="1.0" encoding="UTF-8"?>
<kml
	xmlns="http://earth.google.com/kml/2.2">
	<Document>
		<Style id="placemark-red">
			<IconStyle>
				<Icon>
					<href>https://omaps.app/placemarks/placemark-red.png</href>
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
  const file = allPlacemarksText(geoJsonPlacemarks(JSON.parse(foo)));
  Bun.write("largeFiles/blue-plaques-output.kml", file);
};

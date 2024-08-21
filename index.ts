import prettier from "prettier";

type Placemark = {
  name: string;
  description: string;
  styleUrl: string;
  Point: {
    coordinates: string;
  };
};

// Get the whole blue plaques file
// Get what data I need to have it on (i.e. the KML).
// convert the geojson to KML using probably https://gdal.org/programs/ogr2ogr.html
// and https://bun.sh/guides/runtime/shell

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-0.29049, 51.48904],
        is_accurate: true,
      },
      properties: {
        id: "9850",
        inscription:
          "Kew Bridge Pumping Station Unique in its approach to the preservation of water pumping equipment, in particular the original installations of five famous Cornish beam engines.",
        title: "Kew Bridge Pumping Station grey plaque",
        uri: "https://openplaques.org/plaques/9850",
        type: "open-plaque",
      },
    },
  ],
};

const geoJsonPlacemark: Placemark = {
  name: "Kew Bridge Pumping Station grey plaque",
  description:
    "Kew Bridge Pumping Station Unique in its approach to the preservation of water pumping equipment, in particular the original installations of five famous Cornish beam engines.",
  styleUrl: "#placemark-red",
  Point: {
    coordinates: "-0.29049,51.48904",
  },
};

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

const formatText = async (text: string) =>
  await prettier.format(text, {
    parser: "html", // Use 'html' parser for HTML-like content
    semi: false,
    singleQuote: true,
    tabWidth: 2,
  });

console.log(
  await formatText(allPlacemarksText([geoJsonPlacemark, geoJsonPlacemark]))
);

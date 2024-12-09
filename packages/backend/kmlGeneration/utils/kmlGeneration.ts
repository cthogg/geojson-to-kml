import { mkdir } from "node:fs/promises";
import path from "path";
import { Placemark } from "../kmlTypes";

interface KmlConfig {
  placemarkId: string;
  documentName: string;
}

const generateFrontMatter = (
  config: KmlConfig
) => `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.2">
  <Document>
    <Style id="${config.placemarkId}">
      <IconStyle>
        <Icon>
          <href>https://omaps.app/placemarks/${config.placemarkId}.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <name>${config.documentName}</name>
    <visibility>1</visibility>
`;

const endMatter = `  </Document>
</kml>`;

const placemarkToKml = (placemark: Placemark) => {
  const wikiContent =
    placemark.wiki.url || placemark.wiki.summary
      ? `\n    ${placemark.wiki.url}\n    ${placemark.wiki.summary}`
      : "";

  return `
  <Placemark>
    <name>${placemark.name}</name>
    <description>${placemark.description}${wikiContent}</description>
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

export const generateKmlFile = (placemarks: Placemark[], config: KmlConfig) => {
  const frontMatter = generateFrontMatter(config);
  return `${frontMatter}${convertPlacemarksToKml(placemarks)}${endMatter}`;
};

export const writeKmlFiles = async (
  placemarks: Placemark[],
  outputFolder: string,
  filePrefix: string,
  batchSize: number
) => {
  await mkdir(outputFolder, { recursive: true });

  const config = {
    placemarkId: "placemark-blue",
    documentName: "Blue Plaques",
  };

  for (let i = 0; i < placemarks.length; i += batchSize) {
    const batch = placemarks.slice(i, i + batchSize);
    const batchNumber = Math.floor((i + 1) / batchSize);
    const filename = `${filePrefix}-${batchNumber}.kml`;
    const filePath = path.join(outputFolder, filename);
    const kmlContent =
      batch.length > 0
        ? generateKmlFile(batch, config).replace(/&/g, "and")
        : "";
    await Bun.write(filePath, kmlContent);
  }
};

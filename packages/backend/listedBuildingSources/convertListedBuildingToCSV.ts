import { getListedBuildingFile } from "./listedBuildingFile";
import { ListedBuilding } from "./listedBuildingFileTypes";

function convertToCSV(buildings: ListedBuilding[]): string {
  // Define headers
  const headers = [
    "title",
    "type",
    "grade",
    "list_entry",
    "wikidata_entry",
    "latitude",
    "longitude",
    "image_url",
    "historical_england_text",
    "wikipedia_text",
  ].join(",");

  // Convert each building to CSV row
  const rows = buildings.map((building) => {
    // Escape and wrap fields that might contain commas or newlines
    const escapedFields = [
      `"${building.title.replace(/"/g, '""')}"`,
      `"${building.type.replace(/"/g, '""')}"`,
      `"${building.grade.replace(/"/g, '""')}"`,
      building.listEntry,
      building.wikidataEntry,
      building.coordinates?.[0] ?? "",
      building.coordinates?.[1] ?? "",
      building.imageUrl ? `"${building.imageUrl.replace(/"/g, '""')}"` : "",
      building.historicalEnglandText
        ? `"${building.historicalEnglandText.replace(/"/g, '""')}"`
        : "",
      building.wikipediaText
        ? `"${building.wikipediaText.replace(/"/g, '""')}"`
        : "",
    ];

    return escapedFields.join(",");
  });

  // Combine headers and rows
  return [headers, ...rows].join("\n");
}

try {
  const buildings = await getListedBuildingFile();
  const buildingsToTry = buildings;
  const csv = convertToCSV(buildingsToTry);

  // Write to new file
  Bun.write("listedBuildings2.csv", csv);
  console.log("Successfully converted JSON to CSV");
} catch (error) {
  console.error("Error converting file:", error);
}

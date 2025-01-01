import { ListedBuilding } from "./beSyncListedBuildingSources/listedBuildingFileTypes";
import { getListedBuildingFile } from "./getListedBuilding";

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
      building.list_entry,
      building.wikidata_entry,
      building.latitude,
      building.longitude,
      building.image_url ? `"${building.image_url.replace(/"/g, '""')}"` : "",
      building.historical_england_text
        ? `"${building.historical_england_text.replace(/"/g, '""')}"`
        : "",
      building.wikipedia_text
        ? `"${building.wikipedia_text.replace(/"/g, '""')}"`
        : "",
    ];

    return escapedFields.join(",");
  });

  // Combine headers and rows
  return [headers, ...rows].join("\n");
}

try {
  //FIXME: make this the frontend file.
  const buildings = await getListedBuildingFile();
  const buildingsToTry = buildings;
  const csv = convertToCSV(buildingsToTry);

  // Write to new file
  Bun.write("listedBuildings2.csv", csv);
  console.log("Successfully converted JSON to CSV");
} catch (error) {
  console.error("Error converting file:", error);
}

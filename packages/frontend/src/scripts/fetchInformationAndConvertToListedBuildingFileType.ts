import { ListedBuilding } from "./listedBuildingFileTypes";
import {
  QueryUrlResponseSchema,
  generateUrlOfListedBuildingNumber,
} from "./queryUrl";

export async function fetchListedBuilding(
  listedBuildingNumber: string
): Promise<ListedBuilding> {
  // Generate URL and fetch data
  const url = generateUrlOfListedBuildingNumber(listedBuildingNumber);
  const response = await fetch(url);
  const data = await response.json();

  // Validate response format
  const validatedData = QueryUrlResponseSchema.parse(data);

  // Handle case where no results are found
  if (validatedData.results.bindings.length === 0) {
    throw new Error(
      `No listed building found with number ${listedBuildingNumber}`
    );
  }

  const building = validatedData.results.bindings[0];

  // Parse coordinates from the "Point(long lat)" format
  const coordinateMatch = building.coordinateLocation?.value.match(
    /Point\(([-\d.]+) ([-\d.]+)\)/
  );
  const coordinates: [number, number] = coordinateMatch
    ? [parseFloat(coordinateMatch[2]), parseFloat(coordinateMatch[1])] // Convert to [lat, long]
    : [0, 0]; // Default coordinates if none found

  // Transform to ListedBuilding type
  const listedBuilding: ListedBuilding = {
    title: building.itemLabel.value,
    type: "Listed Building", // Default value
    grade: "", // Would need additional SPARQL query to get grade
    listEntry: listedBuildingNumber,
    wikidataEntry: building.item.value,
    coordinates: coordinates,
    imageUrl: building.image?.value ?? "",
    audioUrl: null,
    aiGeneratedText: "", // To be filled by AI generation
    prompt: "", // To be filled when generating AI text
    listedBuildingText: "", // Would need additional source
    wikipediaText: "", // Would need additional SPARQL query
  };

  return listedBuilding;
}

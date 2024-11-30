import { z } from "zod";
import { ListedBuilding } from "./listedBuildingFileTypes";
import {
  QueryUrlResponse,
  QueryUrlResponseSchema,
  generateUrlOfListedBuildingNumber,
} from "./queryUrl";

const getGradeOfListedBuilding = (
  heritageDesignation: QueryUrlResponse["results"]["bindings"][0]["heritageDesignation"]
) => {
  const url = heritageDesignation?.value;
  if (url?.includes("www.wikidata.org/wiki/Q15700834")) {
    return "II*";
  }
  return "Grade Unknown";
};

const WikipediaTextSchema = z.object({
  query: z.object({
    pages: z.array(z.object({ extract: z.string() })),
  }),
});

const fetchWikipediaText = async (wikipediaTitle: string) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${wikipediaTitle}&formatversion=2&explaintext=1&origin=*`;
  const response = await fetch(url);
  const data = await response.json();
  const validatedData = WikipediaTextSchema.parse(data);
  return validatedData.query.pages[0].extract;
};

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
  const wikipediaText = await fetchWikipediaText(
    building.wikipediaTitle?.value ?? ""
  );
  // Transform to ListedBuilding type
  const listedBuilding: ListedBuilding = {
    title: building.itemLabel.value,
    type: "Listed Building", // Default value
    grade: getGradeOfListedBuilding(building.heritageDesignation),
    listEntry: listedBuildingNumber,
    wikidataEntry: building.item.value,
    coordinates: coordinates,
    imageUrl: building.image?.value ?? null,
    listedBuildingText: "", // Would need additional source
    wikipediaText: wikipediaText, // Would need additional SPARQL query
  };

  return listedBuilding;
}

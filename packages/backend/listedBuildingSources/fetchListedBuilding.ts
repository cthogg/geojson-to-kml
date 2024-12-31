import { z } from "zod";
import { getTextOfListedBuilding } from "./fetchTextListedBuildingHistoricEngland";
import { ListedBuilding } from "./listedBuildingFileTypes";
import {
  WikidataResponse,
  WikidataResponseSchema,
  getWikiDataUrl,
} from "./wikidata";

const getGradeOfListedBuilding = (
  heritageDesignation: WikidataResponse["results"]["bindings"][0]["heritageDesignation"]
) => {
  const url = heritageDesignation?.value;
  //TODO: make this more robust by checking the url or getting a hashmap of the grades.
  if (url?.includes("www.wikidata.org/wiki/Q15700834")) {
    return "II*";
  }
  if (url?.includes("www.wikidata.org/wiki/Q15700818")) {
    return "I";
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

const parseCoordinates = (
  coordinateLocation?: WikidataResponse["results"]["bindings"][0]["coordinateLocation"]
): [number, number] | undefined => {
  if (!coordinateLocation?.value) return undefined;

  const coordinateMatch = coordinateLocation.value.match(
    /Point\(([-\d.]+) ([-\d.]+)\)/
  );
  return coordinateMatch
    ? [parseFloat(coordinateMatch[2]), parseFloat(coordinateMatch[1])] // Convert to [lat, long]
    : undefined;
};

export async function fetchListedBuilding(
  listedBuildingNumber: string
): Promise<ListedBuilding> {
  // Generate URL and fetch data
  const url = getWikiDataUrl(listedBuildingNumber);
  const response = await fetch(url);
  const data = await response.json();

  const validatedData = WikidataResponseSchema.parse(data);

  if (validatedData.results.bindings.length === 0) {
    throw new Error(
      `No listed building found with number ${listedBuildingNumber}`
    );
  }
  //TODO: case where there are multiple results.
  const building = validatedData.results.bindings[0];

  const listedBuilding: ListedBuilding = {
    title: building.itemLabel.value,
    type: "Listed Building", // Default value
    grade: getGradeOfListedBuilding(building.heritageDesignation),
    listEntry: listedBuildingNumber,
    wikidataEntry: building.item.value,
    coordinates: parseCoordinates(building.coordinateLocation) ?? null,
    imageUrl: building.image?.value ?? null,
    historicalEnglandText: await getTextOfListedBuilding({
      listedBuildingNumber: listedBuildingNumber,
    }),
    wikipediaText: building.wikipediaTitle?.value
      ? await fetchWikipediaText(building.wikipediaTitle.value)
      : null,
  };

  return listedBuilding;
}

import { BLUE_PLAQUE_WIKI_LINKS_FILE } from "../constants";
import { Placemark } from "../types";
import { WikipediaSearchSchema, WikipediaSummarySchema } from "../wikiTypes";

export const fetchWikipediaSearchResult = async (personName: string) => {
  const wikipediaSearch = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${personName}&limit=10&namespace=0&format=json`;
  const resp = await fetch(wikipediaSearch);
  const text = await resp.json();
  const wikipediaData = WikipediaSearchSchema.parse(text);
  return { articleUri: wikipediaData[3][0], articleName: wikipediaData[1][0] };
};

export const fetchWikipediaSummary = async (articleTitle: string) => {
  const wikipediaSearch = `https://en.wikipedia.org/api/rest_v1/page/summary/${articleTitle}`;
  const resp = await fetch(wikipediaSearch);
  const text = await resp.json();
  const wikipediaData = WikipediaSummarySchema.parse(text);
  return wikipediaData;
};

type Wikilinks = {
  summary: string;
  url: string;
};

export const bluePlaqueWikiLinks: { [key: string]: Wikilinks } = {};

export const fetchBluePlaqueWikiLinks = async (placemarks: Placemark[]) => {
  for (const placemark of placemarks) {
    const personName = placemark.fullName;
    if (personName !== undefined) {
      const { articleUri, articleName } = await fetchWikipediaSearchResult(
        personName
      );
      const { extract } = await fetchWikipediaSummary(articleName);
      bluePlaqueWikiLinks[personName] = {
        summary: extract.includes("may refer to:")
          ? "No information found"
          : extract,
        url: articleUri,
      };
    }
  }
  return bluePlaqueWikiLinks;
};

export const saveBluePlaqueWikiLinks = async (placemarks: Placemark[]) => {
  const bluePlaqueWikiLinks = await fetchBluePlaqueWikiLinks(placemarks);
  const json = JSON.stringify(bluePlaqueWikiLinks, null, 2);
  Bun.write(BLUE_PLAQUE_WIKI_LINKS_FILE, json);
};

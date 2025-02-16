// curl -G 'https://query.wikidata.org/sparql' --data-urlencode 'format=json' --data-urlencode 'query=SELECT ?place ?placeLabel ?location ?article WHERE { SERVICE wikibase:around { ?place wdt:P625 ?location. bd:serviceParam wikibase:center "Point(-0.128916 51.525081)"^^geo:wktLiteral. bd:serviceParam wikibase:radius "0.1". } ?article schema:about ?place; schema:isPartOf <https://en.wikipedia.org/>. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }' | cat

import { z } from "zod";
import { WikipediaLanguage } from "../../settings/atoms";
import { WikipediaArticleSchema } from "./WikipediaArticlesTypes";

const WikidataResponseSchema = z.object({
  head: z.object({
    vars: z.array(z.string()),
  }),
  results: z.object({
    bindings: z.array(
      z.object({
        place: z.object({
          type: z.literal("uri"),
          value: z.string(),
        }),
        placeLabel: z.object({
          type: z.literal("literal"),
          value: z.string(),
        }),
        location: z.object({
          type: z.literal("literal"),
          value: z.string(),
        }),
        article: z.object({
          type: z.literal("uri"),
          value: z.string(),
        }),
      })
    ),
  }),
});

export async function getNearbyWikipediaArticles(
  latitude: number,
  longitude: number,
  radiusKm: number = 0.1,
  language: WikipediaLanguage
) {
  const query = `
    SELECT ?place ?placeLabel ?location ?article 
    WHERE {
      SERVICE wikibase:around {
        ?place wdt:P625 ?location.
        bd:serviceParam wikibase:center "Point(${longitude} ${latitude})"^^geo:wktLiteral.
        bd:serviceParam wikibase:radius "${radiusKm}".
      }
      ?article schema:about ?place;
        schema:isPartOf <https://${language}.wikipedia.org/>.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "${language}". }
    }
  `;

  const params = new URLSearchParams({
    format: "json",
    query: query,
  });

  const response = await fetch(`https://query.wikidata.org/sparql?${params}`);
  const data = await response.json();

  const parsedData = WikidataResponseSchema.parse(data);

  return parsedData.results.bindings.map((binding) => {
    // Extract coordinates from the Point string
    const locationMatch = binding.location.value.match(
      /Point\(([-\d.]+) ([-\d.]+)\)/
    );
    if (!locationMatch)
      throw new Error(`Invalid location format: ${binding.location.value}`);

    const [, longitude, latitude] = locationMatch;

    return WikipediaArticleSchema.parse({
      latitude: Number(latitude),
      longitude: Number(longitude),
      id: binding.place.value.split("/").pop() || "",
      wikipedia_article_url: binding.article.value,
      name: binding.placeLabel.value,
      wikidata_url: binding.place.value,
    });
  });
}

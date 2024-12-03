import { z } from "zod";

const getSparQlQuery = (listedBuildingNumber: string) => {
  return `PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/> 
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX v: <http://www.wikidata.org/prop/statement/>
PREFIX schema: <http://schema.org/>

SELECT ?item ?itemLabel ?coordinateLocation ?heritageDesignation ?image ?wikipediaTitle WHERE {
   ?item wdt:P1216 "${listedBuildingNumber}" .
   OPTIONAL { ?item wdt:P625 ?coordinateLocation. }
   OPTIONAL { ?item wdt:P1435 ?heritageDesignation. }
   OPTIONAL { ?item wdt:P18 ?image. }
   OPTIONAL {
     ?wikipediaArticle schema:about ?item ;
                       schema:isPartOf <https://en.wikipedia.org/> .
     BIND(REPLACE(STR(?wikipediaArticle), "https://en.wikipedia.org/wiki/", "") AS ?wikipediaTitle)
   }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
   }
}`;
};

export function convertsparQlQueryToWikidataUrl(query: string): string {
  const baseUrl = "https://query.wikidata.org/sparql?format=json&";
  const encodedQuery = encodeURIComponent(query);
  return `${baseUrl}query=${encodedQuery}`;
}

export const getWikiDataUrl = (listedBuildingNumber: string) => {
  return convertsparQlQueryToWikidataUrl(getSparQlQuery(listedBuildingNumber));
};

export const WikidataResponseSchema = z.object({
  head: z.object({
    vars: z.array(z.string()),
  }),
  results: z.object({
    bindings: z.array(
      z.object({
        item: z.object({
          type: z.literal("uri"),
          value: z.string().url(),
        }),
        itemLabel: z.object({
          "xml:lang": z.string(),
          type: z.literal("literal"),
          value: z.string(),
        }),
        coordinateLocation: z
          .object({
            datatype: z.string(),
            type: z.literal("literal"),
            value: z.string(),
          })
          .optional(),
        heritageDesignation: z
          .object({
            type: z.literal("uri"),
            value: z.string().url(),
          })
          .optional(),
        image: z
          .object({
            type: z.literal("uri"),
            value: z.string().url(),
          })
          .optional(),
        wikipediaTitle: z
          .object({
            type: z.literal("literal"),
            value: z.string(),
          })
          .optional(),
      })
    ),
  }),
});

export type WikidataResponse = z.infer<typeof WikidataResponseSchema>;

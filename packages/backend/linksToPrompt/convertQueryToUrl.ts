export function convertQueryToUrl(query: string): string {
  // Base URL for Wikidata Query Service
  const baseUrl = "https://query.wikidata.org/sparql?format=json&";

  // Encode the query for use in URL
  const encodedQuery = encodeURIComponent(query);

  // Create the full URL with the query parameter
  return `${baseUrl}query=${encodedQuery}`;
}

// Example usage:
const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/> 
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX v: <http://www.wikidata.org/prop/statement/>

SELECT ?item ?itemLabel ?coordinateLocation ?heritageDesignation ?image WHERE {
   ?item wdt:P1216 "1065590" .
   OPTIONAL { ?item wdt:P625 ?coordinateLocation. }
   OPTIONAL { ?item wdt:P1435 ?heritageDesignation. }
   OPTIONAL { ?item wdt:P18 ?image. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
   }
}`;

const generateSparQlQueryOfListedBuildingNumber = (
  listedBuildingNumber: string
) => {
  return `PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/> 
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX v: <http://www.wikidata.org/prop/statement/>

SELECT ?item ?itemLabel ?coordinateLocation ?heritageDesignation ?image WHERE {
   ?item wdt:P1216 "${listedBuildingNumber}" .
   OPTIONAL { ?item wdt:P625 ?coordinateLocation. }
   OPTIONAL { ?item wdt:P1435 ?heritageDesignation. }
   OPTIONAL { ?item wdt:P18 ?image. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
   }
}`;
};

export const generateUrlOfListedBuildingNumber = (
  listedBuildingNumber: string
) => {
  return convertQueryToUrl(
    generateSparQlQueryOfListedBuildingNumber(listedBuildingNumber)
  );
};

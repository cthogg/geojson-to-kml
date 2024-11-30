// Do for all here https://en.wikipedia.org/wiki/Grade_II*_listed_buildings_in_the_London_Borough_of_Waltham_Forest

const wikidataEntry = "Q1043896";
const listedBuildingNumber = 1065590;
const listedBuildingLink = `https://historicengland.org.uk/listing/the-list/list-entry/${listedBuildingNumber}`;
const wikipediaLink = "https://en.wikipedia.org/wiki/Vestry_House_Museum";
const wikidataLink = "https://www.wikidata.org/wiki/Q1043896";

//Can do this query
//https://query.wikidata.org/sparql?format=json&query=PREFIX%20wikibase%3A%20%3Chttp%3A%2F%2Fwikiba.se%2Fontology%23%3E%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20p%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2F%3E%0APREFIX%20v%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fstatement%2F%3E%0ASELECT%20%3Fitem%20%3FitemLabel%20WHERE%20%7B%0A%20%20%20%20%3Fitem%20wdt%3AP1216%20%221065590%22%20.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20.%0A%20%20%7D%0A%7D

const fullQuery = `https://query.wikidata.org/sparql?format=json&query=PREFIX%20wikibase%3A%20%3Chttp%3A%2F%2Fwikiba.se%2Fontology%23%3E%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20p%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2F%3E%0APREFIX%20v%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fstatement%2F%3E%0ASELECT%20%3Fitem%20%3FitemLabel%20WHERE%20%7B%0A%20%20%20%20%3Fitem%20wdt%3AP1216%20%${listedBuildingNumber}%22%20.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20.%0A%20%20%7D%0A%7D
`;
// I will give you a     historic england website https://historicengland.org.uk/listing/the-list/list-entry/1065590
// A wikipedia link
// An image
// Can you do the following:

// From the wikipedia link find the coordinates and output it as

// get title
// get grade of listed building
// get coordinates of listed building
// prompt is always the same

// Get the listed building text
// Get the wikipedia text
// Output it like below in the markdown.

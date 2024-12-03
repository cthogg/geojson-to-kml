import * as cheerio from "cheerio";

const fetchSiteHtml = async (listedBuildingNumber: string) => {
  const url = `https://britishlistedbuildings.co.uk/101065590-abc-cinema-high-street-ward`;
  const response = await fetch(url);
  const responseText = await response.text();

  // Load the HTML into cheerio
  const $ = cheerio.load(responseText);

  // Find the specific div and get its HTML
  const targetDiv = $(".medium-12.large-9.columns");

  // Return the HTML of the div if found, otherwise return null
  return targetDiv.length > 0 ? targetDiv.toString() : null;
};
console.log(await fetchSiteHtml("101065590"));

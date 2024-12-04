import * as cheerio from "cheerio";

export const fetchListedBuildingDescription = async ({
  listedBuildingNumber,
}: {
  listedBuildingNumber: string;
}) => {
  const url = `https://historicengland.org.uk/listing/the-list/list-entry/${listedBuildingNumber}`;
  console.log("url", url);
  const response = await fetch(url);
  const responseText = await response.text();
  console.log("responseText", responseText);
  // console.log("responseText", responseText);

  // Load the HTML into cheerio
  const $ = cheerio.load(responseText);
  console.log("responseText", responseText);

  // Find the specific div and get its HTML
  const targetDiv = $("div");
  console.log("Found sections:", targetDiv.length);
  // console.log("targetDiv", targetDiv.text());

  // Return the HTML of the div if found, otherwise return null
  const description = targetDiv.length > 0 ? targetDiv.text() : null;
  return description;
};

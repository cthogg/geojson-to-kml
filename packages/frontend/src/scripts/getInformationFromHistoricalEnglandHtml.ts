import * as cheerio from "cheerio";

const fetchSiteHtml = async (listedBuildingNumber: string) => {
  const url = `https://historicengland.org.uk/listing/the-list/list-entry/${listedBuildingNumber}?section=official-list-entry`;
  const response = await fetch(url);
  const responseText = await response.text();
  return responseText;
};

const getInformationFromHistoricEnglandNumber = async (
  listedBuildingNumber: string
) => {
  const siteHtml = await fetchSiteHtml(listedBuildingNumber);
  console.log("siteHtml", siteHtml);
  return getInformationFromHistoricalEnglandHtml(siteHtml);
};

const getInformationFromHistoricalEnglandHtml = async (siteHtml: string) => {
  const $ = cheerio.load(siteHtml);
  const body = $("body");

  // Find the Details section and extract its text
  const detailsSection = body
    .find(".nhle-entry__section-official--no-spacing-top")
    .find('h3:contains("Details")')
    .parent()
    .find("p")
    .text()
    // Replace multiple spaces and newlines with single space
    .replace(/\s+/g, " ")
    // Replace <br> tags (which appear as spaces) with newlines
    .replace(/\s*<br>\s*/g, "\n")
    .trim();
  // Find the Sources section
  const sourcesSection = body
    .find(".nhle-entry__section-official--no-spacing-top")
    .find('h3:contains("Sources")')
    .parent()
    .text()
    .replace(/\s+/g, " ")
    .trim();
  return {
    details: detailsSection,
    sources: sourcesSection,
    detailsAndSources: `${detailsSection}\n${sourcesSection}`,
  };
};

console.log(
  //FIXME: get some things
  (await getInformationFromHistoricEnglandNumber("1190187")).detailsAndSources
);

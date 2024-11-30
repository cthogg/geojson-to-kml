import * as cheerio from "cheerio";
import { siteHtml } from "./siteHtml";

export const getInformationFromHistoricalEnglandHtml = async (
  siteHtml: string
) => {
  const $ = cheerio.load(siteHtml);

  // Find the Details section and extract its text
  const detailsSection = $(".nhle-entry__section-official--no-spacing-top")
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
  const sourcesSection = $(".nhle-entry__section-official--no-spacing-top")
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
  (await getInformationFromHistoricalEnglandHtml(siteHtml)).detailsAndSources
);

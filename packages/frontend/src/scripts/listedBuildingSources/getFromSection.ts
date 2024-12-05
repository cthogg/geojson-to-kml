import * as cheerio from "cheerio";

const test = `
<noscript>
<section id="official-list-entry">
<div id="overview">
  This is some test content
</div>
</section>
</noscript>
`;

function extractOfficialListEntryText(html: string): string {
  const $ = cheerio.load(html);
  // First get the noscript content
  const sectionContent = $("#nhle-entry-section-wrapper > noscript").html();

  // Then parse that content and find the overview
  const $inner = cheerio.load(sectionContent || "");
  const overview = $inner("#official-list-entry").text().trim();
  return overview;
}

export const getTextOfListedBuilding = async ({
  listedBuildingNumber,
}: {
  listedBuildingNumber: string;
}) => {
  const url = `https://historicengland.org.uk/listing/the-list/list-entry/${listedBuildingNumber}`;
  console.log("url", url);
  const response = await fetch(url);
  const responseText = await response.text();
  return extractOfficialListEntryText(responseText);
};

console.log(await getTextOfListedBuilding({ listedBuildingNumber: "1065590" }));

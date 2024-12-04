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

console.log(
  extractOfficialListEntryText(await Bun.file("./1191188.html").text())
);

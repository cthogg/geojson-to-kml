const cheerio = require("cheerio");
const fs = require("fs");

function extractPlacemark(html) {
  const $ = cheerio.load(html);
  const row = $("tr.vcard");

  const name = row.find("td:first-child a").first().text().trim();

  const description = row
    .find("td:last-child")
    .contents()
    .first()
    .text()
    .trim();

  const coordinatesText = row.find("span.coordinates a").text();
  const coordinates = coordinatesText.replace(/\s+/g, " ").trim();

  const placemark = {
    name,
    description,
    styleUrl: "#placemark-blue",
    Point: {
      coordinates,
    },
    fullName: undefined,
    wiki: {
      summary: "-",
      url: undefined,
    },
  };

  return placemark;
}

// Read the HTML file
const html = fs.readFileSync("example-files/one-row.html", "utf-8");

// Extract the Placemark
const placemark = extractPlacemark(html);

// Output the result
console.log(JSON.stringify(placemark, null, 2));

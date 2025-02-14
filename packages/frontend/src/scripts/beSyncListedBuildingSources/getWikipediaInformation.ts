import { z } from "zod";

// Schema for Wikipedia API response based on the Edge Function schema
const WikiSummarySchema = z.object({
  type: z.string(),
  title: z.string(),
  displaytitle: z.string(),
  namespace: z.object({ id: z.number(), text: z.string() }),
  wikibase_item: z.string().optional(),
  titles: z.object({
    canonical: z.string(),
    normalized: z.string(),
    display: z.string(),
  }),
  pageid: z.number(),
  thumbnail: z
    .object({
      source: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  originalimage: z
    .object({
      source: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  lang: z.string(),
  dir: z.string(),
  revision: z.string(),
  extract: z.string(),
  extract_html: z.string(),
  description: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

type WikiSummary = z.infer<typeof WikiSummarySchema>;

const WIKIPEDIA_API_BASE_URL =
  "https://en.wikipedia.org/api/rest_v1/page/summary";

export async function getWikipediaSummary(title: string): Promise<WikiSummary> {
  const response = await fetch(
    `${WIKIPEDIA_API_BASE_URL}/${encodeURIComponent(title)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Wikipedia summary for ${title}`);
  }

  const data = await response.json();
  console.log("data", data);
  const result = WikiSummarySchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Wikipedia API response validation failed: ${result.error.message}`
    );
  }
  return result.data;
}

export async function getWikipediaInformationFromUrl(
  wikipediaUrl: string
): Promise<WikiSummary> {
  // Extract the title from the Wikipedia URL
  const title = wikipediaUrl.split("/wiki/").pop();
  if (!title) {
    throw new Error("Invalid Wikipedia URL");
  }
  const summary = await getWikipediaSummary(decodeURIComponent(title));
  console.log("summary", summary);

  return summary;
}

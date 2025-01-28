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
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

type WikiSummary = z.infer<typeof WikiSummarySchema>;

const SUPABASE_FUNCTION_URL =
  "http://127.0.0.1:54321/functions/v1/wikipedia-summary";

export async function getWikipediaSummary(title: string): Promise<WikiSummary> {
  const response = await fetch(
    `${SUPABASE_FUNCTION_URL}/${encodeURIComponent(title)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Wikipedia summary for ${title}`);
  }

  const data = await response.json();
  return WikiSummarySchema.parse(data);
}

export async function getWikipediaInformationFromUrl(
  wikipediaUrl: string
): Promise<WikiSummary> {
  // Extract the title from the Wikipedia URL
  const title = wikipediaUrl.split("/wiki/").pop();
  if (!title) {
    throw new Error("Invalid Wikipedia URL");
  }

  return getWikipediaSummary(decodeURIComponent(title));
}

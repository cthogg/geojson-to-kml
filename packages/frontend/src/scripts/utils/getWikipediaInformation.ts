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

// Schema for full Wikipedia article response
const WikiFullArticleResponseSchema = z.object({
  batchcomplete: z.string(),
  query: z.object({
    normalized: z
      .array(
        z.object({
          from: z.string(),
          to: z.string(),
        })
      )
      .optional(),
    pages: z.record(
      z.string(),
      z.object({
        pageid: z.number(),
        ns: z.number(),
        title: z.string(),
        extract: z.string(),
      })
    ),
  }),
});

const WIKIPEDIA_API_BASE_URL =
  "https://en.wikipedia.org/api/rest_v1/page/summary";
const WIKIPEDIA_FULL_API_URL = "https://en.wikipedia.org/w/api.php";

export async function getWikipediaSummary(title: string): Promise<WikiSummary> {
  const response = await fetch(
    `${WIKIPEDIA_API_BASE_URL}/${encodeURIComponent(title)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Wikipedia summary for ${title}`);
  }

  const data = await response.json();
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
): Promise<{ summary: WikiSummary }> {
  // Extract the title from the Wikipedia URL
  const title = wikipediaUrl.split("/wiki/").pop();
  if (!title) {
    throw new Error("Invalid Wikipedia URL");
  }
  const summary = await getWikipediaSummary(decodeURIComponent(title));

  return { summary };
}

export async function getWikipediaFullArticle(title: string): Promise<string> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "extracts",
    titles: title,
    explaintext: "1",
    origin: "*",
  });

  const response = await fetch(`${WIKIPEDIA_FULL_API_URL}?${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch full Wikipedia article for ${title}`);
  }

  const data = await response.json();
  const result = WikiFullArticleResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Wikipedia API response validation failed: ${result.error.message}`
    );
  }

  // Get the first (and only) page from the pages object
  const page = Object.values(result.data.query.pages)[0];
  return page.extract;
}

export async function getWikipediaFullArticleFromUrl(
  wikipediaUrl: string
): Promise<string> {
  // Extract the title from the Wikipedia URL
  const title = wikipediaUrl.split("/wiki/").pop();
  if (!title) {
    throw new Error("Invalid Wikipedia URL");
  }
  return await getWikipediaFullArticle(decodeURIComponent(title));
}

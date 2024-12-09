import { z } from "zod";

/**
 * Used for search endpoint
 * e.g. https://en.wikipedia.org/w/api.php?action=opensearch&search=Alan_Turing&limit=10&namespace=0&format=json
 */
export const WikipediaSearchSchema = z.tuple([
  z.string(),
  z.array(z.string()),
  z.array(z.string()),
  z.array(z.string()), //Wikipedia links
]);

/**
 * Used for summary endpoints e.g
 * https://en.wikipedia.org/api/rest_v1/page/summary/Alan_Turing
 */
export const WikipediaSummarySchema = z.object({
  type: z.string(),
  title: z.string(),
  displaytitle: z.string(),
  namespace: z.object({ id: z.number(), text: z.string() }),
  wikibase_item: z.string(),
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
  tid: z.string(),
  timestamp: z.string(),
  description: z.string().optional(),
  description_source: z.string().optional(),
  content_urls: z.object({
    desktop: z.object({
      page: z.string(),
      revisions: z.string(),
      edit: z.string(),
      talk: z.string(),
    }),
    mobile: z.object({
      page: z.string(),
      revisions: z.string(),
      edit: z.string(),
      talk: z.string(),
    }),
  }),
  extract: z.string(),
  extract_html: z.string(),
});

export type WikipediaSummary = z.infer<typeof WikipediaSummarySchema>;

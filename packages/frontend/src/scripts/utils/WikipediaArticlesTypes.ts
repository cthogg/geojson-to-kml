import { z } from "zod";

export const WikipediaArticleSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
    id: z.string(),
    wikipedia_article_url: z.string(),
    name: z.string(),
    wikidata_url: z.string(),
  })
  .strict();

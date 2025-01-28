import { Hono } from "jsr:@hono/hono";
import { z } from "npm:zod";

// Schema for Wikipedia API response
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

// change this to your function name
const functionName = "wikipedia-summary";
const app = new Hono().basePath(`/${functionName}`);

app.get("/test", (c) => c.text("Wikipedia Summary!Yo"));

app.get("/:title", async (c) => {
  try {
    const title = c.req.param("title");

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`
    );

    if (!response.ok) {
      return c.json(
        { error: "Failed to fetch Wikipedia summary" },
        response.status
      );
    }

    const data = await response.json();
    const result = WikiSummarySchema.safeParse(data);

    if (!result.success) {
      return c.json(
        { error: "Invalid response schema", details: result.error },
        500
      );
    }

    return c.json(result.data);
  } catch (error) {
    return c.json(
      { error: "Internal server error", details: error.message },
      500
    );
  }
});

Deno.serve(app.fetch);

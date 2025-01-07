import { z } from "zod";

export const ListedBuildingSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  id: z.string(),
  title: z.string(),
  type: z.string(),
  grade: z.string(),
  list_entry: z.string(),
  wikidata_entry: z.string(),
  image_url: z.string().nullable(),
});

export const ListedBuildingMinimalSchema = ListedBuildingSchema.pick({
  latitude: true,
  longitude: true,
  id: true,
  title: true,
  image_url: true,
  list_entry: true,
}).extend({
  ai_summaries: z.array(
    z.object({
      ai_summary: z.string(),
    })
  ),
});

export type ListedBuildingMinimal = z.infer<typeof ListedBuildingMinimalSchema>;
export const ListedBuildingMinimalArraySchema = z.array(
  ListedBuildingMinimalSchema
);

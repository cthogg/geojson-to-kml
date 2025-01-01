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
  historical_england_text: z.string().nullable(),
  wikipedia_text: z.string().nullable(),
});

export type ListedBuilding = z.infer<typeof ListedBuildingSchema>;

export const ListedBuildingArraySchema = z.array(ListedBuildingSchema);

export const ListedBuildingMinimalSchema = ListedBuildingSchema.pick({
  latitude: true,
  longitude: true,
  id: true,
  title: true,
});

export type ListedBuildingMinimal = z.infer<typeof ListedBuildingMinimalSchema>;
export const ListedBuildingMinimalArraySchema = z.array(
  ListedBuildingMinimalSchema
);

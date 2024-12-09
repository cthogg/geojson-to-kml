import { z } from "zod";
export const ListedBuildingSchema = z.object({
  title: z.string(),
  type: z.string(),
  grade: z.string(),
  listEntry: z.string(),
  wikidataEntry: z.string(),
  coordinates: z.tuple([z.number(), z.number()]).nullable(),
  imageUrl: z.string().nullable(),
  historicalEnglandText: z.string().nullable(),
  wikipediaText: z.string().nullable(),
});

export const ListedBuildingArraySchema = z.array(ListedBuildingSchema);

export type ListedBuilding = z.infer<typeof ListedBuildingSchema>;

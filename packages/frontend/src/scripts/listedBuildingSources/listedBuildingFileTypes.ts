import { z } from "zod";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
/* eslint-enable @typescript-eslint/no-unused-vars */

export type ListedBuilding = z.infer<typeof ListedBuildingSchema>;

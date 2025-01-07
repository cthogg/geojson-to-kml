import { z } from "zod";

export const ListedBuildingSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
    id: z.string(),
    title: z.string(),
    list_entry: z.string(),
    blabla: z.string(),
    image_url: z.string().nullable(),
    ai_summaries: z.array(
      z.object({
        ai_summary: z.string(),
      })
    ),
  })
  .strict();

export type ListedBuilding = z.infer<typeof ListedBuildingSchema>;
export const ListedBuildingArraySchema = z.array(ListedBuildingSchema);

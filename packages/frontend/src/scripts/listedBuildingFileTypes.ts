import { z } from "zod";
/* eslint-disable @typescript-eslint/no-unused-vars */
const ListedBuildingSchema = z.object({
  title: z.string(),
  type: z.string(),
  grade: z.string(),
  listEntry: z.string(),
  wikidataEntry: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  imageUrl: z.string().nullable(),
  listedBuildingText: z.string(),
  wikipediaText: z.string(),
});
/* eslint-enable @typescript-eslint/no-unused-vars */

export type ListedBuilding = z.infer<typeof ListedBuildingSchema>;

export type PromptInfo = {
  listEntry: string;
  prompt: string | null;
  audioUrl: string | null;
  aiGeneratedText: string | null;
};

export type ListedBuildingWithPrompt = ListedBuilding &
  Omit<PromptInfo, "listEntry">;

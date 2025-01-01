import { z } from "zod";
export const ListedBuildingSchema = z.object({
  title: z.string(),
  type: z.string(),
  grade: z.string(),
  listEntry: z.string(),
  wikidataEntry: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().nullable(),
  historicalEnglandText: z.string().nullable(),
  wikipediaText: z.string().nullable(),
});

export const ListedBuildingArraySchema = z.array(ListedBuildingSchema);

export type ListedBuilding = z.infer<typeof ListedBuildingSchema>;

export const ListedBuildingSchemaBE = z.object({
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

export const ListedBuildingArraySchemaBE = z.array(ListedBuildingSchemaBE);
export type ListedBuildingArrayBE = z.infer<typeof ListedBuildingArraySchemaBE>;

export type ListedBuildingBE = z.infer<typeof ListedBuildingSchemaBE>;

export const convertListedBuildingBEToFE = (
  listedBuildingBE: ListedBuildingBE
): ListedBuilding => {
  return {
    title: listedBuildingBE.title,
    type: listedBuildingBE.type,
    grade: listedBuildingBE.grade,
    listEntry: listedBuildingBE.list_entry,
    wikidataEntry: listedBuildingBE.wikidata_entry,
    latitude: listedBuildingBE.latitude,
    longitude: listedBuildingBE.longitude,
    imageUrl: listedBuildingBE.image_url,
    historicalEnglandText: listedBuildingBE.historical_england_text,
    wikipediaText: listedBuildingBE.wikipedia_text,
  };
};

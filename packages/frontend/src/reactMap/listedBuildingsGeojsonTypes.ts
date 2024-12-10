import data from "../backendSync/filtered-listed-buildings.json";

import { z } from "zod";
import { getListedBuildingFileFE } from "../scripts/listedBuildingSources/getListedBuildingFE";

const ListedBuildingGeojsonSchema = z.object({
  "listed-building-grade": z.string(),
  reference: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type ListedBuildingGeojson = z.infer<typeof ListedBuildingGeojsonSchema>;

export const getListedBuildingGeojson = (): ListedBuildingGeojson[] => {
  const allSources = getListedBuildingFileFE().map((s) => s.listEntry);
  const geo = z
    .array(ListedBuildingGeojsonSchema)
    .parse(data)
    .filter((geo) => allSources.includes(geo.reference));
  return geo;
};

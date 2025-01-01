import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "./beSyncListedBuildingSources/listedBuildingFileTypes";
import data from "./listedBuildings.json";
export const getListedBuildingFile = async (): Promise<ListedBuilding[]> => {
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  return parseListedBuildings;
};

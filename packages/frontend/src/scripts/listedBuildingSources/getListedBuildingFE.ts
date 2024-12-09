import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "./listedBuildingFileTypes";
import data from "./listedBuildings.json";

export const getListedBuildingFileFE = (): ListedBuilding[] => {
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  return parseListedBuildings;
};

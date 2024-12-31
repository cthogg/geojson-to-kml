import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "../../backendSync/listedBuildingFileTypes";
import data from "../../backendSync/listedBuildings.json";
export const getListedBuildingFileFE = (): ListedBuilding[] => {
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  console.log(`parseListedBuildings.length: ${parseListedBuildings.length}`);
  return parseListedBuildings;
};

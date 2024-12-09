import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "../../../../backend/listedBuildingSources/listedBuildingFileTypes";
import data from "../../../../backend/listedBuildingSources/listedBuildings.json";

export const getListedBuildingFileFE = (): ListedBuilding[] => {
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  return parseListedBuildings;
};

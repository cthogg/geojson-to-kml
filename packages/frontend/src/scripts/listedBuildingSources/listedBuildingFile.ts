import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "./listedBuildingFileTypes";

export const getListedBuildingFile = async (): Promise<ListedBuilding[]> => {
  const file = Bun.file("listedBuildings.json");
  const listedBuildings = await file.json();
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  return parseListedBuildings;
};

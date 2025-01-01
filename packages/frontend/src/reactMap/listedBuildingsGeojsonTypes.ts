import { ListedBuilding } from "../backendSync/listedBuildingFileTypes";
import { getListedBuildingFileFE } from "../scripts/listedBuildingSources/getListedBuildingFE";

export const getListedBuildingGeojson = async (): Promise<ListedBuilding[]> => {
  const allSources = await getListedBuildingFileFE();

  return allSources;
};

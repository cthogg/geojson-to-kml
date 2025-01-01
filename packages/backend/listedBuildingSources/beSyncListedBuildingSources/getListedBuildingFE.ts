import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "./listedBuildingFileTypes";
import { SUPABASE_API_KEY, SUPABASE_URL } from "./supabaseApiKey";

//FIXME: need to just get the basic id and latitude and longitude. Only on click should get full data.
const fetchListedBuildings = async () => {
  const response = await fetch(`${SUPABASE_URL}/places`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getListedBuildingFileBE = async (): Promise<ListedBuilding[]> => {
  const data = await fetchListedBuildings();
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  return parseListedBuildings;
};

import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "./listedBuildingFileTypes";
import { SUPABASE_API_KEY, SUPABASE_URL } from "./supabaseApiKey";

const fetchListedBuildingsMinimal = async () => {
  const response = await fetch(
    `${SUPABASE_URL}/places?select=id,title,latitude,longitude,image_url,list_entry,ai_summaries(ai_summary)`,
    {
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getListedBuildingsMinimal = async (): Promise<
  ListedBuilding[]
> => {
  const data = await fetchListedBuildingsMinimal();
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  return parseListedBuildings;
};

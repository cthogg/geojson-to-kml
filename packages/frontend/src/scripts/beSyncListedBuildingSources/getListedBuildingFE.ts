import {
  ListedBuilding,
  ListedBuildingArraySchema,
  ListedBuildingSchema,
} from "./listedBuildingFileTypes";
import { SUPABASE_API_KEY, SUPABASE_URL } from "./supabaseApiKey";

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

export async function fetchSingleListedBuilding(id: string) {
  const response = await fetch(`${SUPABASE_URL}/places?id=eq.${id}`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export const getSingleListedBuilding = async (id: string) => {
  const data = await fetchSingleListedBuilding(id);
  const listedBuilding = data;
  const parseListedBuilding = ListedBuildingSchema.parse(listedBuilding);
  return parseListedBuilding;
};

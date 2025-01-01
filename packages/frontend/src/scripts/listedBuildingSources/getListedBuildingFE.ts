import { z } from "zod";
import {
  ListedBuilding,
  ListedBuildingArraySchema,
} from "../../backendSync/listedBuildingFileTypes";

// ... existing imports ...

const fetchListedBuildings = async () => {
  const response = await fetch(
    "https://yvrmwbxbhglycwnckely.supabase.co/rest/v1/places?select=id,latitude,longitude",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU",
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getListedBuildingFileFE = (): ListedBuilding[] => {
  const listedBuildings = data;
  const parseListedBuildings = ListedBuildingArraySchema.parse(listedBuildings);
  console.log(`parseListedBuildings.length: ${parseListedBuildings.length}`);
  return parseListedBuildings;
};

export const ListedBuildingSchemaBE = z.object({
  latitude: z.number(),
  longitude: z.number(),
  id: z.string(),
});

export const ListedBuildingArraySchemaBE = z.array(ListedBuildingSchemaBE);

export type ListedBuildingBE = z.infer<typeof ListedBuildingSchemaBE>;

export const getListedBuildingFileBE = async () => {
  const data = await fetchListedBuildings();
  const listedBuildings = data;
  const parseListedBuildings =
    ListedBuildingArraySchemaBE.parse(listedBuildings);
  console.log(`parseListedBuildings.length: ${parseListedBuildings.length}`);
  return parseListedBuildings;
};

console.log(await getListedBuildingFileBE());

import { createClient } from "@supabase/supabase-js";
import { ListedBuilding } from "./beSyncListedBuildingSources/listedBuildingFileTypes";
import { getListedBuildingFile } from "./getListedBuilding";

const supabaseUrl = "https://yvrmwbxbhglycwnckely.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertListedBuildings(buildings: ListedBuilding[]) {
  const buildingsWithoutId = buildings.map((building) => {
    const { id, ...buildingWithoutId } = building;
    return buildingWithoutId;
  });

  const { data, error } = await supabase
    .from("places")
    .insert(buildingsWithoutId)
    .select();

  if (error) {
    console.error("Error inserting buildings:", error);
    throw error;
  } else {
    console.log(`Inserted ${data.length} buildings`);
  }

  return data;
}

// Helper function to insert a single building
export async function insertSingleListedBuilding(building: ListedBuilding) {
  const { id, ...buildingWithoutId } = building;

  const { data, error } = await supabase
    .from("places")
    .insert(buildingWithoutId)
    .select();

  if (error) {
    console.error("Error inserting building:", error);
    throw error;
  }

  return data;
}

// If this does not work, check the security policy https://supabase.com/dashboard/project/yvrmwbxbhglycwnckely/auth/policies?search=29225&schema=public
export async function insertAllListedBuildingsInJsonFile() {
  const buildings = await getListedBuildingFile();
  insertListedBuildings(buildings);
}

await insertAllListedBuildingsInJsonFile();

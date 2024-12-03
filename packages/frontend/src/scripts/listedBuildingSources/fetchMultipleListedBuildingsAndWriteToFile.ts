import { fetchListedBuilding } from "./fetchListedBuilding";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMultipleListedBuildings = async (
  listedBuildingNumbers: string[]
) => {
  const listedBuildings = [];
  for (const number of listedBuildingNumbers) {
    const building = await fetchListedBuilding(number);
    listedBuildings.push(building);
    await delay(5000); // 1 second delay between requests
  }
  return listedBuildings;
};

console.log(await fetchMultipleListedBuildings(["1065590", "1191062"]));

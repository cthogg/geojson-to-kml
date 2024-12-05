import { fetchListedBuilding } from "./fetchListedBuilding";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMultipleListedBuildings = async (
  listedBuildingNumbers: string[]
) => {
  const listedBuildings = [];
  for (const number of listedBuildingNumbers) {
    const building = await fetchListedBuilding(number);
    listedBuildings.push(building);
    await delay(5100); // 5.1 second delay between as per historicengland.org.uk/robots.txt
  }
  return listedBuildings;
};

console.log(await fetchMultipleListedBuildings(["1065590", "1191062"]));

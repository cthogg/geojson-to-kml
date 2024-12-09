import { fetchListedBuilding } from "./fetchListedBuilding";
import { getListedBuildingFile } from "./listedBuildingFile";
import { ListedBuilding } from "./listedBuildingFileTypes";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMultipleListedBuildings = async (
  listedBuildingNumbers: string[]
): Promise<ListedBuilding[]> => {
  const listedBuildings = await getListedBuildingFile();
  for (const number of listedBuildingNumbers) {
    const listedBuilding = listedBuildings.find(
      (listedBuilding) => listedBuilding.listEntry === number
    );
    if (listedBuilding) {
      console.log(`Listed building ${number} already exists`);
      continue;
    }
    const building = await fetchListedBuilding(number);
    listedBuildings.push(building);
    await delay(5100); // 5.1 second delay between as per historicengland.org.uk/robots.txt
  }
  return listedBuildings;
};

const writeToFile = (listedBuildings: ListedBuilding[]) => {
  Bun.write("listedBuildings.json", JSON.stringify(listedBuildings, null, 2));
};

const listedBuildingNumbers = ["1065590", "1191062", "1191063", "1191064"];
const listedBuildings = await fetchMultipleListedBuildings(
  listedBuildingNumbers
);
writeToFile(listedBuildings);

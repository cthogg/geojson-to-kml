import gradeIIBoundsStartListedBuildingNumbers from "../kmlGeneration/output/bounds-grade-II-star.json";
import { getListedBuildingFileBE } from "./beSyncListedBuildingSources/getListedBuildingFE";
import { ListedBuilding } from "./beSyncListedBuildingSources/listedBuildingFileTypes";
import { fetchListedBuilding } from "./fetchListedBuilding";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMultipleListedBuildings = async (
  listedBuildingNumbers: string[]
): Promise<ListedBuilding[]> => {
  const listedBuildings: ListedBuilding[] = await getListedBuildingFileBE();
  const newListedBuildings: ListedBuilding[] = [];
  for (const [i, number] of listedBuildingNumbers.entries()) {
    console.log(
      `Fetching listed building ${i} of ${listedBuildingNumbers.length}`
    );
    const listedBuilding = listedBuildings.find(
      (lb) => lb.list_entry === number
    );
    if (listedBuilding) {
      console.log(`Listed building ${number} already exists`);
      continue;
    }
    const building = await fetchListedBuilding(number);
    newListedBuildings.push(building);
    await delay(5100); // 5.1 second delay between as per historicengland.org.uk/robots.txt
  }
  return newListedBuildings;
};

const writeToFile = (listedBuildings: ListedBuilding[]) => {
  Bun.write(
    "./listedBuildingSources/listedBuildings.json",
    JSON.stringify(listedBuildings, null, 2)
  );
};

const gradeIListedBuildingNumbers =
  gradeIIBoundsStartListedBuildingNumbers.slice(0, 100);
const listedBuildings = await fetchMultipleListedBuildings(
  gradeIListedBuildingNumbers
);
writeToFile(listedBuildings);

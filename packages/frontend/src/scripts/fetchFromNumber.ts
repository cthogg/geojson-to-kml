import { fetchListedBuilding } from "./fetchInformationAndConvertToListedBuildingFileType";

const fetchFromNumber = async (number: string) => {
  const listedBuilding = await fetchListedBuilding(number);
  console.log(listedBuilding);
  return listedBuilding;
};

fetchFromNumber("1065590");

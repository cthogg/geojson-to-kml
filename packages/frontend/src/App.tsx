import "./App.css";
import { ListedBuilding } from "./backendSync/listedBuildingFileTypes";
import { ListedBuildingInfo } from "./ListedBuildingInfo";
import { Map } from "./Map";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";

function getListedBuildingNumberFromRoute() {
  const url = window.location.href;
  const match = url.match(/listed-building\/(\d+)/);
  return match ? match[1] : null;
}
function getListedBuildingInformation(
  listedBuildingNumber: string
): ListedBuilding | undefined {
  const buildings = getListedBuildingFileFE();
  const listedBuilding = buildings.find(
    (listedBuilding) => listedBuilding.listEntry === listedBuildingNumber
  );
  return listedBuilding;
}

function App() {
  const listedBuildingNumber = getListedBuildingNumberFromRoute();
  if (!listedBuildingNumber) {
    return <Map />;
  }
  const listedBuildingInformation =
    getListedBuildingInformation(listedBuildingNumber);
  if (!listedBuildingInformation) {
    return <div>No listed building information found</div>;
  }

  return (
    <>
      <ListedBuildingInfo
        title={listedBuildingInformation.title}
        imageUrl={listedBuildingInformation.imageUrl}
        wikipediaText={listedBuildingInformation.wikipediaText}
        historicalEnglandText={listedBuildingInformation.historicalEnglandText}
        listedBuildingNumber={listedBuildingNumber}
      />
    </>
  );
}

export default App;

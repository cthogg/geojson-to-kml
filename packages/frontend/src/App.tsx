import "./App.css";

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

function getAllListedBuildingNamesAndNumbers(): {
  name: string;
  number: string;
}[] {
  const buildings = getListedBuildingFileFE();
  return buildings.map((listedBuilding) => ({
    name: listedBuilding.title,
    number: listedBuilding.listEntry,
  }));
}

function App() {
  const listedBuildingNumber = getListedBuildingNumberFromRoute();
  const allBuildings = getAllListedBuildingNamesAndNumbers();
  if (!listedBuildingNumber) {
    return <div>No listed building number found</div>;
  }
  const listedBuildingInformation =
    getListedBuildingInformation(listedBuildingNumber);
  if (!listedBuildingInformation) {
    return <div>No listed building information found</div>;
  }
  const { title, imageUrl, wikipediaText, historicalEnglandText } =
    listedBuildingInformation;
  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Walking Tour App
          </h2>
          <div className="relative group">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Select Building ▼
            </button>
            <div className="absolute right-0 w-64 mt-0 bg-white border rounded-md shadow-lg hidden group-hover:block max-h-96 overflow-y-auto">
              {allBuildings.map((building) => (
                <a
                  key={building.number}
                  href={`/listed-building/${building.number}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {building.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - add padding-top to account for fixed header */}
      <div className="min-h-screen bg-gray-100 py-8 px-4 pt-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            {title}
          </h1>
          <p className="text-gray-700 leading-relaxed mt-2">
            Listed Building Number: {listedBuildingNumber}
          </p>

          {/* Audio Player */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Audio Player</h2>
            {/* TODO: Add audio */}
            {/* {audioUrl && (
              <audio controls className="w-full">
                <source src={audioUrl} type="video/mp4" />
                Your browser does not support the audio element.
              </audio>
            )} */}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Image</h2>
              <img
                src={imageUrl}
                alt="Description of your image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <details className="group">
              <summary className="text-xl font-semibold mb-4 cursor-pointer list-none">
                <span className="ml-2 mr-2 text-gray-500 group-open:hidden inline-block">
                  ►
                </span>
                <span className="ml-2 mr-2 text-gray-500 hidden group-open:inline-block">
                  ▼
                </span>
                Wikipedia text
              </summary>
              <p className="text-gray-700 leading-relaxed mt-2">
                {wikipediaText}
              </p>
            </details>
          </div>

          {historicalEnglandText && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <details className="group">
                <summary className="text-xl font-semibold mb-4 cursor-pointer list-none">
                  <span className="ml-2 mr-2 text-gray-500 group-open:hidden inline-block">
                    ►
                  </span>
                  <span className="ml-2 mr-2 text-gray-500 hidden group-open:inline-block">
                    ▼
                  </span>
                  Historical England text
                </summary>
                <p className="text-gray-700 leading-relaxed mt-2">
                  {historicalEnglandText}
                </p>
              </details>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

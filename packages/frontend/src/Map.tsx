import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { ListedBuildingInfo } from "./ListedBuildingInfo";
import { getListedBuildingGeojson } from "./reactMap/listedBuildingsGeojsonTypes";
import { getPromptData } from "./scripts/ai/getPromptData";
import { listedBuildingAudio } from "./scripts/ai/listedBuildingAudio";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";
import { Table } from "./Table";

function getAiSummary(listedBuildingNumber: string): string | undefined {
  const promptData = getPromptData();
  const prompt = promptData.find(
    (prompt) => prompt.listEntry === listedBuildingNumber
  );
  return prompt?.aiGeneratedText ?? undefined;
}

const routes = [
  {
    name: "Walthamstow",
    listedBuildings: ["1065590", "1391928", "1191188", "1191062"],
  },
  {
    name: "Bloomsbury",
    listedBuildings: [
      "1379009",
      "1113038",
      "1113106",
      "1113107",
      "1401342",
      "1272403",
    ],
  },
];

export function Map() {
  // Add map ref to control map programmatically
  const [map, setMap] = useState<L.Map | null>(null);

  // Modify selected feature state to include coordinates
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string;
    imageUrl?: string;
    audioUrl?: string;
    coordinates: [number, number];
    listedEntry: string;
  } | null>(null);
  console.log(selectedFeature);
  // Set up default icon for Leaflet
  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const allMarkers = getListedBuildingGeojson();

  // Add new state for selected route
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Modify the markers filter to use selectedRoute
  const markersd = allMarkers.filter((marker) =>
    selectedRoute === "All" || selectedRoute === null
      ? true
      : routes
          .find((route) => route.name === selectedRoute)
          ?.listedBuildings.includes(marker.reference)
  );

  // Add custom yellow icon
  const selectedIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "selected-marker", // We'll use this to style the icon yellow
  });

  // Add custom yellow icon
  const unselectedIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "unselected-marker", // We'll use this to style the icon yellow
  });

  // Add new helper function
  const centerMapOnFeature = (latitude: number, longitude: number) => {
    map?.setView([latitude - 0.00045, longitude], 18);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const handleTableRowClick = ({
    latitude,
    longitude,
    name,
    listedEntry,
    imageUrl,
    audioUrl,
  }: {
    latitude: number;
    longitude: number;
    name: string;
    listedEntry: string;
    imageUrl?: string;
    audioUrl?: string;
  }) => {
    setSelectedFeature({
      name,
      coordinates: [latitude, longitude],
      listedEntry: listedEntry,
      imageUrl: imageUrl,
      audioUrl: audioUrl,
    });
    centerMapOnFeature(latitude, longitude);
    setIsTableModalOpen(false); // Optionally close the modal after selection
  };

  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col relative">
      {/* Add buttons container */}
      <div className="absolute top-4 right-4 z-[1000] flex overflow-x-auto max-w-[calc(100%-2rem)] hide-scrollbar">
        <div className="flex gap-2 px-1">
          <button
            onClick={() => {
              setSelectedRoute("Walthamstow");
              const marker = allMarkers.filter((marker) =>
                routes
                  .find((route) => route.name === "Walthamstow")
                  ?.listedBuildings.includes(marker.reference)
              );
              centerMapOnFeature(marker[0].latitude, marker[0].longitude);
            }}
            className={`flex-shrink-0 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
              selectedRoute === "Walthamstow" ? "bg-gray-200" : ""
            }`}
          >
            <span className="text-gray-700 font-medium">Walthamstow</span>
          </button>
          <button
            onClick={() => {
              setSelectedRoute("Bloomsbury");
              const marker = allMarkers.filter((marker) =>
                routes
                  .find((route) => route.name === "Bloomsbury")
                  ?.listedBuildings.includes(marker.reference)
              );
              centerMapOnFeature(marker[0].latitude, marker[0].longitude);
            }}
            className={`flex-shrink-0 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
              selectedRoute === "Bloomsbury" ? "bg-gray-200" : ""
            }`}
          >
            <span className="text-gray-700 font-medium">Bloomsbury</span>
          </button>
          <button
            onClick={() => {
              setSelectedRoute("All");
              map?.setView([51.5225, -0.129256], 12);
            }}
            className={`flex-shrink-0 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
              selectedRoute === "All" ? "bg-gray-200" : ""
            }`}
          >
            <span className="text-gray-700 font-medium">All</span>
          </button>
          <button
            onClick={() => {
              setIsTableModalOpen(true);
            }}
            className={`flex-shrink-0 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap`}
          >
            <span className="text-gray-700 font-medium">Table 🧮</span>
          </button>
        </div>
      </div>

      <MapContainer
        className="h-[100dvh] w-[100dvw]"
        center={[51.522333, -0.132239]}
        zoom={12}
        maxZoom={18}
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {markersd.map((feature, index) => {
            const listedBuilding = getListedBuildingFileFE().find(
              (lb) => lb.listEntry === feature.reference
            );
            const audio = listedBuildingAudio.find(
              (lb) => lb.listEntry === feature.reference
            );
            const isSelected =
              selectedFeature?.coordinates[0] === feature.latitude &&
              selectedFeature?.coordinates[1] === feature.longitude;

            return (
              <Marker
                key={`marker-${feature.reference || index}`}
                position={[feature.latitude, feature.longitude]}
                icon={isSelected ? selectedIcon : unselectedIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedFeature({
                      name: feature.name,
                      imageUrl: listedBuilding?.imageUrl ?? undefined,
                      audioUrl: audio?.audioUrl ?? undefined,
                      listedEntry: feature.reference,
                      coordinates: [feature.latitude, feature.longitude],
                    });
                    centerMapOnFeature(feature.latitude, feature.longitude);
                  },
                }}
              />
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
      {selectedFeature && (
        <div
          style={{ zIndex: 1000 }}
          className={`absolute bg-gray-100 bottom-0 left-0 right-0 overflow-y-auto rounded-t-lg shadow-lg transition-all duration-300 ${
            isExpanded ? "h-[80vh]" : "h-400"
          }`}
        >
          <div className="relative z-10 p-4  backdrop-blur-sm">
            <div className="flex justify-between items-start text-black">
              <button
                onClick={() => {
                  const currentIndex = markersd.findIndex(
                    (feature) =>
                      feature.latitude === selectedFeature.coordinates[0] &&
                      feature.longitude === selectedFeature.coordinates[1]
                  );
                  const prevIndex =
                    (currentIndex - 1 + markersd.length) % markersd.length;
                  const prevFeature = markersd[prevIndex];
                  const prevListedBuilding = getListedBuildingFileFE().find(
                    (lb) => lb.listEntry === prevFeature.reference
                  );
                  const prevAudio = listedBuildingAudio.find(
                    (lb) => lb.listEntry === prevFeature.reference
                  );

                  setSelectedFeature({
                    name: prevFeature.name,
                    imageUrl: prevListedBuilding?.imageUrl ?? undefined,
                    audioUrl: prevAudio?.audioUrl ?? undefined,
                    listedEntry: prevFeature.reference,
                    coordinates: [prevFeature.latitude, prevFeature.longitude],
                  });
                  centerMapOnFeature(
                    prevFeature.latitude,
                    prevFeature.longitude
                  );
                }}
                className="text-black  px-2 py-1"
              >
                ←
              </button>

              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {selectedFeature.name}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-black  px-2 py-1"
                >
                  {isExpanded ? "↓" : "↑"}
                </button>
                <button
                  onClick={() => {
                    const currentIndex = markersd.findIndex(
                      (feature) =>
                        feature.latitude === selectedFeature.coordinates[0] &&
                        feature.longitude === selectedFeature.coordinates[1]
                    );
                    const nextIndex = (currentIndex + 1) % markersd.length;
                    const nextFeature = markersd[nextIndex];
                    const nextListedBuilding = getListedBuildingFileFE().find(
                      (lb) => lb.listEntry === nextFeature.reference
                    );
                    const nextAudio = listedBuildingAudio.find(
                      (lb) => lb.listEntry === nextFeature.reference
                    );

                    setSelectedFeature({
                      name: nextFeature.name,
                      imageUrl: nextListedBuilding?.imageUrl ?? undefined,
                      audioUrl: nextAudio?.audioUrl ?? undefined,
                      listedEntry: nextFeature.reference,
                      coordinates: [
                        nextFeature.latitude,
                        nextFeature.longitude,
                      ],
                    });
                    centerMapOnFeature(
                      nextFeature.latitude,
                      nextFeature.longitude
                    );
                  }}
                  className="text-black  px-2 py-1"
                >
                  →
                </button>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-black  ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {selectedFeature.audioUrl ? (
                <audio controls className="w-full">
                  <source src={selectedFeature.audioUrl} type="video/mp4" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                      } else {
                        const speech = new SpeechSynthesisUtterance(
                          getAiSummary(selectedFeature.listedEntry) ??
                            "Hello is no audio"
                        );
                        speech.onend = () => setIsSpeaking(false);
                        window.speechSynthesis.speak(speech);
                        setIsSpeaking(true);
                      }
                    }}
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-white rounded text-gray-700"
                  >
                    {isSpeaking ? "Stop" : "Play Text-to-Speech Message"}
                  </button>
                </div>
              )}
            </div>
            {isExpanded && (
              <ListedBuildingInfo
                imageUrl={selectedFeature.imageUrl ?? null}
                wikipediaText={""}
                historicalEnglandText={""}
                listedBuildingNumber={selectedFeature.listedEntry}
              />
            )}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Listed Buildings Table</h2>
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Table
              data={getListedBuildingFileFE().filter((building) =>
                selectedRoute === "All" || selectedRoute === null
                  ? true
                  : routes
                      .find((route) => route.name === selectedRoute)
                      ?.listedBuildings.includes(building.listEntry)
              )}
              onRowClick={handleTableRowClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

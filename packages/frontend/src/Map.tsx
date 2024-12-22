import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getListedBuildingGeojson } from "./reactMap/listedBuildingsGeojsonTypes";
import { getPromptData } from "./scripts/ai/getPromptData";
import { listedBuildingAudio } from "./scripts/ai/listedBuildingAudio";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";

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
      ? routes.some((route) => route.listedBuildings.includes(marker.reference))
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

  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col relative">
      {/* Add buttons container */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <button
          onClick={() => setSelectedRoute("Walthamstow")}
          className={`bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
            selectedRoute === "Walthamstow" ? "bg-gray-200" : ""
          }`}
        >
          <span className="text-gray-700 font-medium">Walthamstow</span>
        </button>
        <button
          onClick={() => setSelectedRoute("Bloomsbury")}
          className={`bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
            selectedRoute === "Bloomsbury" ? "bg-gray-200" : ""
          }`}
        >
          <span className="text-gray-700 font-medium">Bloomsbury</span>
        </button>
        <button
          onClick={() => setSelectedRoute("All")}
          className={`bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
            selectedRoute === "All" ? "bg-gray-200" : ""
          }`}
        >
          <span className="text-gray-700 font-medium">All</span>
        </button>
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
          className={`absolute bottom-0 left-0 right-0 overflow-y-auto rounded-t-lg bg-white p-4 shadow-lg transition-all duration-300 ${
            isExpanded ? "h-[80vh]" : "h-400"
          }`}
        >
          {selectedFeature.imageUrl && (
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${selectedFeature.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <div className="relative z-10">
            <div className="flex justify-between items-start">
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
                className="text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                ←
              </button>

              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {selectedFeature.name}
                <a
                  href={`/listed-building/${selectedFeature.listedEntry}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ℹ️
                </a>
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-500 hover:text-gray-700 px-2 py-1"
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
                  className="text-gray-500 hover:text-gray-700 px-2 py-1"
                >
                  →
                </button>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
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
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    {isSpeaking ? "Stop" : "Play Text-to-Speech Message"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

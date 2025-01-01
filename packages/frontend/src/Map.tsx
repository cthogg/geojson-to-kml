import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { BuildingDetailsPanel } from "./BuildingDetailsPanel";
import { getAiSummaries } from "./scripts/beSyncListedBuildingSources/getAiSummaries";
import { getListedBuildingsMinimal } from "./scripts/beSyncListedBuildingSources/getListedBuildingFE";
import {
  ListedBuilding,
  ListedBuildingMinimal,
} from "./scripts/beSyncListedBuildingSources/listedBuildingFileTypes";
import { TableWrapper } from "./Table";

export function Map() {
  // Add map ref to control map programmatically
  const [map, setMap] = useState<L.Map | null>(null);

  // Modify selected feature state to include coordinates
  const [selectedFeature, setSelectedFeature] =
    useState<ListedBuildingMinimal | null>(null);
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

  //FIXME: put query into own file
  const query = useQuery({
    queryKey: ["getListedBuildingsMinimal"],
    queryFn: getListedBuildingsMinimal,
  });

  const promptDataQuery = useQuery({
    queryKey: ["getAiSummaries"],
    queryFn: getAiSummaries,
  });

  const allMarkers = query.data ?? [];

  // Modify the markers filter to use selectedRoute
  const markersd = allMarkers;

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

  const handleTableRowClick = (feature: ListedBuilding) => {
    setSelectedFeature(feature);
    centerMapOnFeature(feature.latitude, feature.longitude);
    setIsTableModalOpen(false); // Optionally close the modal after selection
  };

  if (query.isLoading || promptDataQuery.isLoading) {
    return (
      <div className="h-[100dvh] w-[100dvw] flex flex-col relative">
        <div className="flex justify-center items-center h-full">
          <div className="text-2xl font-bold animate-pulse">
            Loading your next tour...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col relative">
      {/* Add buttons container */}
      <div className="absolute top-4 right-4 z-[1000] flex overflow-x-auto max-w-[calc(100%-2rem)] hide-scrollbar">
        <div className="flex gap-2 px-1">
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
            const isSelected =
              selectedFeature?.latitude === feature.latitude &&
              selectedFeature?.longitude === feature.longitude;

            return (
              <Marker
                key={`marker-${feature.id || index}`}
                position={[feature.latitude, feature.longitude]}
                icon={isSelected ? selectedIcon : unselectedIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedFeature(feature);
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
          <React.Suspense
            fallback={
              <div className="text-2xl font-bold animate-pulse">Loading...</div>
            }
          >
            <BuildingDetailsPanel
              selectedFeature={selectedFeature}
              isExpanded={isExpanded}
              isSpeaking={isSpeaking}
              setSelectedFeature={setSelectedFeature}
              setIsExpanded={setIsExpanded}
              setIsSpeaking={setIsSpeaking}
            />
          </React.Suspense>
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
            <TableWrapper onRowClick={handleTableRowClick} />
          </div>
        </div>
      )}
    </div>
  );
}

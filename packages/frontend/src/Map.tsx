import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getListedBuildingGeojson } from "./reactMap/listedBuildingsGeojsonTypes";
import { listedBuildingAudio } from "./scripts/ai/listedBuildingAudio";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";

export function Map() {
  // Add map ref to control map programmatically
  const [map, setMap] = useState<L.Map | null>(null);

  // Modify selected feature state to include coordinates
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string;
    imageUrl?: string;
    audioUrl?: string;
    coordinates: [number, number];
  } | null>(null);

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

  const markersd = getListedBuildingGeojson();

  // Add custom yellow icon
  const selectedIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "selected-marker", // We'll use this to style the icon yellow
  });

  // Add custom yellow icon
  const unseSelectedIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "unselected-marker", // We'll use this to style the icon yellow
  });

  return (
    <div className="h-screen w-screen flex flex-col relative">
      <MapContainer
        className="h-screen w-screen"
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
                icon={isSelected ? selectedIcon : unseSelectedIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedFeature({
                      name: feature.name,
                      imageUrl: listedBuilding?.imageUrl ?? undefined,
                      audioUrl: audio?.audioUrl ?? undefined,
                      coordinates: [feature.latitude, feature.longitude],
                    });
                    // Center map on selected marker
                    map?.setView(
                      [feature.latitude, feature.longitude],
                      map.getZoom()
                    );
                  },
                }}
              />
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Bottom Card */}
      {selectedFeature && (
        <div
          style={{ zIndex: 1000 }}
          className=" z-50 absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-lg max-h-[40vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-4">
              {selectedFeature.name}
            </h2>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {selectedFeature.imageUrl && (
              <img
                src={selectedFeature.imageUrl}
                alt={selectedFeature.name}
                className="max-h-48 object-cover rounded-lg max-w-48"
              />
            )}
            {selectedFeature.audioUrl && (
              <audio controls className="w-full">
                <source src={selectedFeature.audioUrl} type="video/mp4" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getListedBuildingGeojson } from "./reactMap/listedBuildingsGeojsonTypes";

export function Map() {
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

  return (
    <div className="h-full w-full flex flex-row">
      <MapContainer
        className="h-screen w-screen"
        center={[51.522333, -0.132239]}
        zoom={12}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup>
          {markersd.map((feature, index) => (
            <Marker
              key={`marker-${feature.reference || index}`}
              position={[feature.latitude, feature.longitude]}
            >
              <Popup>
                {feature.name}
                <audio controls className="w-full">
                  <source
                    src={
                      "https://github.com/user-attachments/assets/950b6541-dbfc-42b1-94c7-6f77b0bf4d11"
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the audio element.
                </audio>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

export function Map() {
  const [markers, setMarkers] = useState([]);

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

  useEffect(() => {
    const fetchMarkers = async () => {
      const response = await fetch(
        "https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson"
      );
      const jsonData = await response.json();
      setMarkers(jsonData.features);
    };

    fetchMarkers();
  }, []);

  return (
    <div className="h-full w-full flex flex-row">
      <MapContainer
        className="h-screen w-screen"
        center={[37.8, -122.4]}
        zoom={14}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup>
          {markers.map((feature, index) => (
            <Marker
              key={`marker-${feature.id || index}`}
              position={[
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
              ]}
            >
              <Popup>Magnitude: {feature.properties.mag}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

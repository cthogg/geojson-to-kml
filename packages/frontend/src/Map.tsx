import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl/maplibre";

export function Map() {
  const viewportRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    viewportRef.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

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

  const markerElements = useMemo(
    () =>
      markers.map((feature, index) => (
        <Marker
          key={`marker-${feature.id || index}`}
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
          onClick={() => setSelectedMarker(feature)}
        >
          <div className="cursor-pointer text-red-500">📍</div>
        </Marker>
      )),
    [markers]
  );

  return (
    <div className="h-full w-full flex flex-row bg-red-500">
      <ReactMapGL
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{
          width: viewportRef.current.width,
          height: viewportRef.current.height,
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
        {markerElements}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.geometry.coordinates[0]}
            latitude={selectedMarker.geometry.coordinates[1]}
            onClose={() => setSelectedMarker(null)}
          >
            Magnitude: {selectedMarker.properties.mag}
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}

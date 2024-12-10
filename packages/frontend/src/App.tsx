import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";

function App() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full w-full flex flex-row bg-red-500">
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: viewport.width, height: viewport.height }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      />
    </div>
  );
}

export default App;

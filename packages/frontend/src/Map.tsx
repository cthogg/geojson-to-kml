import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { z } from "zod";
import { getNearbyWikipediaArticles } from "./scripts/utils/getLocalWiki";
import { WikipediaArticleSchema } from "./scripts/utils/WikipediaArticlesTypes";
import { WikipediaPanel } from "./WikipediaPanel";

const openAiKeyAtom = atomWithStorage("openai-api-key", "");
type WikipediaArticle = z.infer<typeof WikipediaArticleSchema>;

export function Map() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    51.522333, -0.132239,
  ]);
  const [openAiKey, setOpenAiKey] = useAtom(openAiKeyAtom);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const [selectedWikiArticle, setSelectedWikiArticle] =
    useState<WikipediaArticle | null>(null);

  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const wikiQuery = useQuery({
    queryKey: ["getWikiArticles", mapCenter],
    queryFn: () => getNearbyWikipediaArticles(mapCenter[0], mapCenter[1], 0.5),
    enabled: !!mapCenter,
    throwOnError: true,
  });

  const [cachedWikiMarkers, setCachedWikiMarkers] = useState<
    WikipediaArticle[]
  >([]);

  useEffect(() => {
    if (wikiQuery.data) {
      setCachedWikiMarkers(wikiQuery.data);
    }
  }, [wikiQuery.data]);

  const wikiMarkers = wikiQuery.data ?? cachedWikiMarkers;

  // Add custom wikipedia icon
  const wikipediaIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "wikipedia-marker", // We'll use this to style the icon green
  });

  const centerMapOnFeature = (latitude: number, longitude: number) => {
    map?.setView([latitude - 0.00045, longitude], 18);
  };

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  function LocationMarker() {
    useMapEvents({
      locationfound(e) {
        setUserLocation([e.latlng.lat, e.latlng.lng]);
        map?.flyTo(e.latlng, map.getZoom());
      },
    });

    return userLocation ? (
      <Marker
        position={userLocation}
        icon={L.divIcon({
          className: "user-location-marker",
          html: '<div class="ping"></div>',
          iconSize: [20, 20],
        })}
      />
    ) : null;
  }

  function MapCenterHandler() {
    useMapEvents({
      moveend: (e) => {
        const center = e.target.getCenter();
        setMapCenter([center.lat, center.lng]);
      },
    });
    return null;
  }

  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col relative">
      <div className="absolute top-4 right-4 z-[1000] flex overflow-x-auto max-w-[calc(100%-2rem)] hide-scrollbar">
        <div className="flex gap-2 px-1">
          <button
            onClick={() => map?.locate()}
            className="flex-shrink-0 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-gray-700 font-medium">📍 My Location</span>
          </button>

          <button
            onClick={() => {
              setShowApiKeyPrompt(true);
              setTempApiKey(openAiKey);
            }}
            className="flex-shrink-0 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-200 px-4 py-2 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-gray-700 font-medium">🔧 APIs</span>
          </button>

          {wikiQuery.isLoading && (
            <div className="flex-shrink-0 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {showApiKeyPrompt && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your OpenAI API key below:
            </p>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-2 border border-gray-300 rounded mb-4 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none mb-4"
              >
                {showApiKey ? (
                  <span role="img" aria-label="hide key">
                    👁️
                  </span>
                ) : (
                  <span role="img" aria-label="show key">
                    👁️‍🗨️
                  </span>
                )}
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowApiKeyPrompt(false);
                  setTempApiKey("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOpenAiKey(tempApiKey);
                  setShowApiKeyPrompt(false);
                  setTempApiKey("");
                }}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        className="h-[100dvh] w-[100dvw]"
        center={[51.522333, -0.132239]}
        zoom={17}
        maxZoom={18}
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
        <MapCenterHandler />

        <MarkerClusterGroup
          spiderfyOnMaxZoom={true}
          spiderLegPolylineOptions={{
            weight: 1.5,
            color: "#222",
            opacity: 0.5,
          }}
          spiderfyDistanceMultiplier={5}
          circleFootSeparation={80}
          spiralFootSeparation={100}
          spiralLengthStart={20}
          spiralLengthFactor={10}
          zoomToBoundsOnClick={false}
        >
          {wikiMarkers.map((article, index) => (
            <Marker
              key={`wiki-${article.id || index}`}
              position={[article.latitude, article.longitude]}
              icon={wikipediaIcon}
              eventHandlers={{
                click: () => {
                  setSelectedWikiArticle(article);
                  centerMapOnFeature(article.latitude, article.longitude);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -20]} permanent>
                {article.name}
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {selectedWikiArticle && (
        <div
          style={{ zIndex: 1000 }}
          className={`absolute bg-gray-100 bottom-0 left-0 right-0 overflow-y-auto rounded-t-lg shadow-lg transition-all duration-300`}
        >
          <WikipediaPanel
            selectedArticle={selectedWikiArticle}
            setSelectedArticle={setSelectedWikiArticle}
            openAiKey={openAiKey}
          />
        </div>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { z } from "zod";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { getNearbyWikipediaArticles } from "./scripts/utils/getLocalWiki";
import { getWikipediaInformationFromUrl } from "./scripts/utils/getWikipediaInformation";
import { WikipediaArticleSchema } from "./scripts/utils/WikipediaArticlesTypes";
import { ApiSettings } from "./settings/ApiSettings";
import {
  openAiKeyAtom,
  unrealSpeechTokenAtom,
  wikipediaLanguageAtom,
} from "./settings/atoms";
import { WikipediaPanel } from "./WikipediaPanel";

type WikipediaArticle = z.infer<typeof WikipediaArticleSchema>;

export function Map() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    51.522333, -0.132239,
  ]);
  const [openAiKey] = useAtom(openAiKeyAtom);
  const [unrealSpeechToken] = useAtom(unrealSpeechTokenAtom);
  const [language] = useAtom(wikipediaLanguageAtom);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
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
    queryFn: () =>
      getNearbyWikipediaArticles(mapCenter[0], mapCenter[1], 0.5, language),
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

  // Default wikipedia icon for articles without thumbnails
  const defaultWikipediaIcon = L.icon({
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/200px-Wikipedia-logo-v2.svg.png",
    shadowUrl: iconShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: "wikipedia-marker",
  });

  // Query to get Wikipedia article information including thumbnails for all markers
  const markerInfoQueries = useQuery({
    queryKey: [
      "getWikiInfoBatch",
      wikiMarkers.map((m) => m.wikipedia_article_url),
    ],
    queryFn: async () => {
      const results = await Promise.all(
        wikiMarkers.map((marker) =>
          getWikipediaInformationFromUrl(marker.wikipedia_article_url, language)
        )
      );
      return results.reduce((acc, info, index) => {
        acc[wikiMarkers[index].wikipedia_article_url] = info;
        return acc;
      }, {} as Record<string, { summary: { thumbnail?: { source: string } } }>);
    },
    enabled: wikiMarkers.length > 0,
  });

  // Function to create icon with article thumbnail
  const createWikipediaIcon = (article: WikipediaArticle) => {
    const thumbnailUrl =
      markerInfoQueries.data?.[article.wikipedia_article_url]?.summary.thumbnail
        ?.source;
    return L.icon({
      iconUrl: thumbnailUrl || defaultWikipediaIcon.options.iconUrl,
      shadowUrl: iconShadow,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
      className: "rounded-full",
    });
  };

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
            onClick={() => setShowApiKeyPrompt(true)}
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

      <ApiSettings
        showApiKeyPrompt={showApiKeyPrompt}
        setShowApiKeyPrompt={setShowApiKeyPrompt}
      />

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
              icon={createWikipediaIcon(article)}
              eventHandlers={{
                click: () => {
                  setSelectedWikiArticle(article);
                  centerMapOnFeature(article.latitude, article.longitude);
                },
              }}
            >
              {/* <Tooltip direction="top" offset={[0, -20]} permanent>
                {article.name}
              </Tooltip> */}
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {selectedWikiArticle && (
        <div
          style={{ zIndex: 1000 }}
          className={`absolute bg-gray-100 bottom-0 left-0 right-0 overflow-y-auto rounded-t-lg shadow-lg transition-all duration-300`}
        >
          <ErrorBoundary>
            <WikipediaPanel
              selectedArticle={selectedWikiArticle}
              setSelectedArticle={setSelectedWikiArticle}
              openAiKey={openAiKey}
              unrealSpeechToken={unrealSpeechToken}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

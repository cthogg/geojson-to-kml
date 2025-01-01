import { useQuery } from "@tanstack/react-query";
import * as changeCase from "change-case";
import { ListedBuildingInfo } from "./ListedBuildingInfo";
import { getSingleAiSummary } from "./scripts/beSyncListedBuildingSources/getAiSummaries";
import { getSingleListedBuilding } from "./scripts/beSyncListedBuildingSources/getListedBuildingFE";
import { PromptInfo } from "./scripts/beSyncListedBuildingSources/listedBuildingAiInformation";
import { ListedBuilding } from "./scripts/beSyncListedBuildingSources/listedBuildingFileTypes";

interface BuildingDetailsPanelProps {
  selectedFeature: ListedBuilding;
  isExpanded: boolean;
  isSpeaking: boolean;
  markersd: ListedBuilding[];
  setSelectedFeature: (feature: ListedBuilding | null) => void;
  setIsExpanded: (expanded: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  centerMapOnFeature: (latitude: number, longitude: number) => void;
}

export function BuildingDetailsPanel({
  selectedFeature,
  isExpanded,
  isSpeaking,
  markersd,
  setSelectedFeature,
  setIsExpanded,
  setIsSpeaking,
  centerMapOnFeature,
}: BuildingDetailsPanelProps) {
  const query = useQuery({
    queryKey: ["getSingleListedBuilding", selectedFeature.list_entry],
    queryFn: () => getSingleListedBuilding(selectedFeature.id),
  });

  const queryA = useQuery({
    queryKey: ["getSingleAiSummary", selectedFeature.list_entry],
    queryFn: () => getSingleAiSummary(selectedFeature.list_entry),
  });
  if (query.isLoading || queryA.isLoading || !query.data || !queryA.data) {
    return <div>Loading...</div>;
  }

  const selectedFeature2: ListedBuilding = query.data;
  const promptData: PromptInfo = queryA.data;
  return (
    <div className="relative z-10 p-4 backdrop-blur-sm">
      <div className="flex justify-between items-start text-black">
        <button
          onClick={() => {
            const currentIndex = markersd.findIndex(
              (feature) =>
                feature.latitude === selectedFeature2.latitude &&
                feature.longitude === selectedFeature2.longitude
            );
            const prevIndex =
              (currentIndex - 1 + markersd.length) % markersd.length;
            const prevFeature = markersd[prevIndex];

            setSelectedFeature(prevFeature);
            centerMapOnFeature(prevFeature.latitude, prevFeature.longitude);
          }}
          className="text-black px-2 py-1"
        >
          ←
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {changeCase.capitalCase(selectedFeature2.title)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-black px-2 py-1"
          >
            {isExpanded ? "↓" : "↑"}
          </button>
          <button
            onClick={() => {
              const currentIndex = markersd.findIndex(
                (feature) =>
                  feature.latitude === selectedFeature2.latitude &&
                  feature.longitude === selectedFeature2.longitude
              );
              const nextIndex = (currentIndex + 1) % markersd.length;
              const nextFeature = markersd[nextIndex];

              setSelectedFeature(nextFeature);
              centerMapOnFeature(nextFeature.latitude, nextFeature.longitude);
            }}
            className="text-black px-2 py-1"
          >
            →
          </button>
          <button
            onClick={() => setSelectedFeature(null)}
            className="text-black ml-2"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              } else {
                const speech = new SpeechSynthesisUtterance(
                  promptData.ai_summary ?? "No audio summary"
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
      </div>
      {isExpanded && (
        <ListedBuildingInfo
          imageUrl={selectedFeature2.image_url ?? null}
          wikipediaText={selectedFeature2.wikipedia_text ?? ""}
          historicalEnglandText={selectedFeature2.historical_england_text ?? ""}
          listedBuildingNumber={selectedFeature2.list_entry}
        />
      )}
    </div>
  );
}

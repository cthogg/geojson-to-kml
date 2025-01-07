import * as changeCase from "change-case";
import { ListedBuilding } from "./scripts/beSyncListedBuildingSources/listedBuildingFileTypes";

interface BuildingDetailsPanelProps {
  selectedFeature: ListedBuilding;
  isExpanded: boolean;
  isSpeaking: boolean;
  setSelectedFeature: (feature: ListedBuilding | null) => void;
  setIsExpanded: (expanded: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
}

export function BuildingDetailsPanel({
  selectedFeature,
  isExpanded,
  isSpeaking,
  setSelectedFeature,
  setIsSpeaking,
}: BuildingDetailsPanelProps) {
  return (
    <div className="relative z-10 p-4 backdrop-blur-sm">
      <div className="flex justify-between items-start text-black">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {changeCase.capitalCase(selectedFeature.title)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFeature(null)}
            className="text-black ml-2"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          {selectedFeature.image_url && (
            <div className="w-1/3">
              <img
                src={selectedFeature.image_url}
                alt={selectedFeature.title}
                className="max-h-48 max-w-full h-auto object-contain rounded"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              {selectedFeature.ai_summaries[0].ai_summary}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              } else {
                const speech = new SpeechSynthesisUtterance(
                  selectedFeature.ai_summaries[0].ai_summary ??
                    "No audio summary"
                );
                speech.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(speech);
                setIsSpeaking(true);
              }
            }}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-white rounded text-gray-700"
          >
            {isSpeaking ? "Stop" : "Play Audio"}
          </button>
        </div>
      </div>
    </div>
  );
}

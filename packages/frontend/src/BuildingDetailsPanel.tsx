import * as changeCase from "change-case";
import { ListedBuildingInfo } from "./ListedBuildingInfo";
import { ListedBuildingMinimal } from "./scripts/beSyncListedBuildingSources/listedBuildingFileTypes";

interface BuildingDetailsPanelProps {
  selectedFeature: ListedBuildingMinimal;
  isExpanded: boolean;
  isSpeaking: boolean;
  setSelectedFeature: (feature: ListedBuildingMinimal | null) => void;
  setIsExpanded: (expanded: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
}

export function BuildingDetailsPanel({
  selectedFeature,
  isExpanded,
  isSpeaking,
  setSelectedFeature,
  setIsExpanded,
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
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-black px-2 py-1"
          >
            {isExpanded ? "↓" : "↑"}
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
      {isExpanded && (
        <ListedBuildingInfo
          imageUrl={selectedFeature.image_url ?? null}
          listedBuildingNumber={selectedFeature.list_entry}
        />
      )}
    </div>
  );
}

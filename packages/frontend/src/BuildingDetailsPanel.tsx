import * as changeCase from "change-case";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ListedBuilding } from "./scripts/beSyncListedBuildingSources/listedBuildingFileTypes";

interface BuildingDetailsPanelProps {
  selectedFeature: ListedBuilding;
  isSpeaking: boolean;
  setSelectedFeature: (feature: ListedBuilding | null) => void;
  setIsSpeaking: (speaking: boolean) => void;
}

export function BuildingDetailsPanel({
  selectedFeature,
  isSpeaking,
  setSelectedFeature,
  setIsSpeaking,
}: BuildingDetailsPanelProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {selectedFeature.image_url && (
            <div className="w-1/3">
              <img
                src={selectedFeature.image_url}
                alt={selectedFeature.title}
                className="max-h-48 max-w-full h-auto object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-700 max-h-[20vh] overflow-y-auto pr-2">
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

      {/* Image Modal */}
      {isImageModalOpen &&
        selectedFeature.image_url &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="max-w-[90vw] max-h-[90vh]">
              <img
                src={selectedFeature.image_url}
                alt={selectedFeature.title}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

import { useState } from "react";
import { getPromptData } from "./scripts/ai/getPromptData";
import { listedBuildingAudio } from "./scripts/ai/listedBuildingAudio";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";

interface ListedBuildingInfoProps {
  title: string;
  imageUrl: string | null;
  wikipediaText: string | null;
  historicalEnglandText: string | null;
  listedBuildingNumber: string;
}

function getAllListedBuildingNamesAndNumbers(): {
  name: string;
  number: string;
}[] {
  const buildings = getListedBuildingFileFE();
  return buildings
    .map((listedBuilding) => ({
      name: listedBuilding.title,
      number: listedBuilding.listEntry,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getAiSummary(listedBuildingNumber: string): string | undefined {
  const promptData = getPromptData();
  const prompt = promptData.find(
    (prompt) => prompt.listEntry === listedBuildingNumber
  );
  return prompt?.aiGeneratedText ?? undefined;
}

function getAudioUrl(listedBuildingNumber: string): string | undefined {
  const audio = listedBuildingAudio.find(
    (audio) => audio.listEntry === listedBuildingNumber
  );
  return audio?.audioUrl ?? undefined;
}

export const ListedBuildingInfo = ({
  title,
  imageUrl,
  wikipediaText,
  historicalEnglandText,
  listedBuildingNumber,
}: ListedBuildingInfoProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const allBuildings = getAllListedBuildingNamesAndNumbers();

  const aiSummary = getAiSummary(listedBuildingNumber);
  const audioUrl = getAudioUrl(listedBuildingNumber);
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Walking Tour App
          </h2>
          <div className="relative group">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Select Building ▼
            </button>
            <div className="absolute right-0 w-64 mt-0 bg-white border rounded-md shadow-lg hidden group-hover:block max-h-96 overflow-y-auto">
              {allBuildings.map((building) => (
                <a
                  key={building.number}
                  href={`/listed-building/${building.number}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {building.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>
      ;{/* Main Content - add padding-top to account for fixed header */}
      <div className="min-h-screen bg-gray-100 py-8 px-4 pt-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            {title}
          </h1>
          <p className="text-gray-700 leading-relaxed mt-2">
            Listed Building Number: {listedBuildingNumber}
          </p>

          {/* Audio Player */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Audio Player</h2>
            {audioUrl ? (
              <audio controls className="w-full">
                <source src={audioUrl} type="video/mp4" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    } else {
                      const speech = new SpeechSynthesisUtterance(
                        aiSummary ?? "No text available for speech"
                      );
                      speech.onend = () => setIsSpeaking(false);
                      window.speechSynthesis.speak(speech);
                      setIsSpeaking(true);
                    }
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                >
                  {isSpeaking ? "Stop" : "Play Text-to-Speech Message"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <details className="group">
              <summary className="text-xl font-semibold mb-4 cursor-pointer list-none">
                <span className="ml-2 mr-2 text-gray-500 group-open:hidden inline-block">
                  ►
                </span>
                <span className="ml-2 mr-2 text-gray-500 hidden group-open:inline-block">
                  ▼
                </span>
                Summary
              </summary>
              <p className="text-gray-700 leading-relaxed mt-2">{aiSummary}</p>
            </details>
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Image</h2>
              <img
                src={imageUrl}
                alt="Description of your image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <details className="group">
              <summary className="text-xl font-semibold mb-4 cursor-pointer list-none">
                <span className="ml-2 mr-2 text-gray-500 group-open:hidden inline-block">
                  ►
                </span>
                <span className="ml-2 mr-2 text-gray-500 hidden group-open:inline-block">
                  ▼
                </span>
                Wikipedia text
              </summary>
              <p className="text-gray-700 leading-relaxed mt-2">
                {wikipediaText}
              </p>
            </details>
          </div>

          {historicalEnglandText && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <details className="group">
                <summary className="text-xl font-semibold mb-4 cursor-pointer list-none">
                  <span className="ml-2 mr-2 text-gray-500 group-open:hidden inline-block">
                    ►
                  </span>
                  <span className="ml-2 mr-2 text-gray-500 hidden group-open:inline-block">
                    ▼
                  </span>
                  Historical England text
                </summary>
                <p className="text-gray-700 leading-relaxed mt-2">
                  {historicalEnglandText}
                </p>
              </details>
            </div>
          )}
        </div>
      </div>
      ;
    </>
  );
};

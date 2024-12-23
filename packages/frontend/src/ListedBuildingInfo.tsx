import { getPromptData } from "./scripts/ai/getPromptData";

interface ListedBuildingInfoProps {
  imageUrl: string | null;
  wikipediaText: string | null;
  historicalEnglandText: string | null;
  listedBuildingNumber: string;
}

function getAiSummary(listedBuildingNumber: string): string | undefined {
  const promptData = getPromptData();
  const prompt = promptData.find(
    (prompt) => prompt.listEntry === listedBuildingNumber
  );
  return prompt?.aiGeneratedText ?? undefined;
}

export const ListedBuildingInfo = ({
  imageUrl,
  wikipediaText,
  historicalEnglandText,
  listedBuildingNumber,
}: ListedBuildingInfoProps) => {
  const aiSummary = getAiSummary(listedBuildingNumber);
  return (
    <>
      {/* Main Content - add padding-top to account for fixed header */}
      <div className="min-h-screen bg-gray-100 py-8 px-4 pt-16">
        <div className="max-w-2xl mx-auto space-y-8">
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
          <p className="text-gray-700 leading-relaxed mt-2">
            Listed Building Number: {listedBuildingNumber}
          </p>

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

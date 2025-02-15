import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { openAiKeyAtom, unrealSpeechTokenAtom } from "./atoms";

interface ApiSettingsProps {
  showApiKeyPrompt: boolean;
  setShowApiKeyPrompt: (show: boolean) => void;
}

export function ApiSettings({
  showApiKeyPrompt,
  setShowApiKeyPrompt,
}: ApiSettingsProps) {
  const [openAiKey, setOpenAiKey] = useAtom(openAiKeyAtom);
  const [unrealSpeechToken, setUnrealSpeechToken] = useAtom(
    unrealSpeechTokenAtom
  );
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempUnrealSpeechToken, setTempUnrealSpeechToken] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showUnrealSpeechToken, setShowUnrealSpeechToken] = useState(false);

  // Initialize temporary values when modal opens
  useEffect(() => {
    if (showApiKeyPrompt) {
      setTempApiKey(openAiKey);
      setTempUnrealSpeechToken(unrealSpeechToken);
    }
  }, [showApiKeyPrompt, openAiKey, unrealSpeechToken]);

  if (!showApiKeyPrompt) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <p className="text-sm text-gray-600 mb-4">OpenAI API key</p>
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

        <p className="text-sm text-gray-600 mb-4">Unreal Speech Auth Token</p>
        <div className="relative">
          <input
            type={showUnrealSpeechToken ? "text" : "password"}
            value={tempUnrealSpeechToken}
            onChange={(e) => setTempUnrealSpeechToken(e.target.value)}
            placeholder="Enter token..."
            className="w-full p-2 border border-gray-300 rounded mb-4 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowUnrealSpeechToken(!showUnrealSpeechToken)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none mb-4"
          >
            {showUnrealSpeechToken ? (
              <span role="img" aria-label="hide token">
                👁️
              </span>
            ) : (
              <span role="img" aria-label="show token">
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
              setTempUnrealSpeechToken("");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setOpenAiKey(tempApiKey);
              setUnrealSpeechToken(tempUnrealSpeechToken);
              setShowApiKeyPrompt(false);
              setTempApiKey("");
              setTempUnrealSpeechToken("");
            }}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

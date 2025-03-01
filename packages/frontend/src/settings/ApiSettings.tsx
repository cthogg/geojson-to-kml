import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  customTourGuideStyleAtom,
  openAiKeyAtom,
  SpeakerLanguage,
  speakerLanguageAtom,
  TourGuideStyle,
  tourGuideStyleAtom,
  unrealSpeechTokenAtom,
  WikipediaLanguage,
  wikipediaLanguageAtom,
  wordLimitAtom,
} from "./atoms";

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
  const [tourGuideStyle, setTourGuideStyle] = useAtom(tourGuideStyleAtom);
  const [customTourGuideStyle, setCustomTourGuideStyle] = useAtom(
    customTourGuideStyleAtom
  );
  const [wikipediaLanguage, setWikipediaLanguage] = useAtom(
    wikipediaLanguageAtom
  );
  const [speakerLanguage, setSpeakerLanguage] = useAtom(speakerLanguageAtom);
  const [wordLimit, setWordLimit] = useAtom(wordLimitAtom);
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempUnrealSpeechToken, setTempUnrealSpeechToken] = useState("");
  const [tempWordLimit, setTempWordLimit] = useState(wordLimit);
  const [tempTourGuideStyle, setTempTourGuideStyle] =
    useState<TourGuideStyle>(tourGuideStyle);
  const [tempCustomTourGuideStyle, setTempCustomTourGuideStyle] =
    useState(customTourGuideStyle);
  const [tempWikipediaLanguage, setTempWikipediaLanguage] =
    useState<WikipediaLanguage>(wikipediaLanguage);
  const [tempSpeakerLanguage, setTempSpeakerLanguage] =
    useState<SpeakerLanguage>(speakerLanguage);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showUnrealSpeechToken, setShowUnrealSpeechToken] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [unrealSpeechTokenError, setUnrealSpeechTokenError] = useState(false);

  // Initialize temporary values when modal opens
  useEffect(() => {
    if (showApiKeyPrompt) {
      setTempApiKey(openAiKey);
      setTempUnrealSpeechToken(unrealSpeechToken);
      setTempTourGuideStyle(tourGuideStyle);
      setTempCustomTourGuideStyle(customTourGuideStyle);
      setTempWikipediaLanguage(wikipediaLanguage);
      setTempSpeakerLanguage(speakerLanguage);
      setTempWordLimit(wordLimit);

      // Initialize validation states
      validateApiKey(openAiKey);
      validateUnrealSpeechToken(unrealSpeechToken);
    }
  }, [
    showApiKeyPrompt,
    openAiKey,
    unrealSpeechToken,
    tourGuideStyle,
    customTourGuideStyle,
    wikipediaLanguage,
    speakerLanguage,
    wordLimit,
  ]);

  // Validation functions
  const validateApiKey = (key: string) => {
    setApiKeyError(!key || key.length <= 1);
  };

  const validateUnrealSpeechToken = (token: string) => {
    setUnrealSpeechTokenError(!token || token.length <= 1);
  };

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
            onChange={(e) => {
              setTempApiKey(e.target.value);
              validateApiKey(e.target.value);
            }}
            placeholder="sk-..."
            className={`w-full p-2 border rounded pr-10 ${
              apiKeyError ? "border-red-500 mb-1" : "border-gray-300 mb-4"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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
          {apiKeyError && (
            <p className="text-red-500 text-xs mb-4">
              Please enter a valid OpenAI API key
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">Unreal Speech Auth Token</p>
        <div className="relative">
          <input
            type={showUnrealSpeechToken ? "text" : "password"}
            value={tempUnrealSpeechToken}
            onChange={(e) => {
              setTempUnrealSpeechToken(e.target.value);
              validateUnrealSpeechToken(e.target.value);
            }}
            placeholder="Enter token..."
            className={`w-full p-2 border rounded pr-10 ${
              unrealSpeechTokenError
                ? "border-red-500 mb-1"
                : "border-gray-300 mb-4"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowUnrealSpeechToken(!showUnrealSpeechToken)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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
          {unrealSpeechTokenError && (
            <p className="text-red-500 text-xs mb-4">
              Please enter a valid Unreal Speech Auth Token
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">Tour Guide Style</p>
        <select
          value={tempTourGuideStyle}
          onChange={(e) =>
            setTempTourGuideStyle(e.target.value as TourGuideStyle)
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="tour guide">Tour Guide</option>
          <option value="comedian">Comedian</option>
          <option value="philosopher">Philosopher</option>
          <option value="poet">Poet</option>
          <option value="custom">Custom Style</option>
        </select>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Custom Style Description</p>
          <textarea
            value={tempCustomTourGuideStyle}
            onChange={(e) => setTempCustomTourGuideStyle(e.target.value)}
            placeholder="The summary should be in the style of a..."
            className="w-full p-2 border border-gray-300 rounded h-24 resize-none"
          />
        </div>

        <p className="text-sm text-gray-600 mb-4">Wikipedia Language</p>
        <select
          value={tempWikipediaLanguage}
          onChange={(e) =>
            setTempWikipediaLanguage(e.target.value as WikipediaLanguage)
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="cs">Czech</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
        </select>

        <p className="text-sm text-gray-600 mb-4">Speaker Language</p>
        <select
          value={tempSpeakerLanguage}
          onChange={(e) =>
            setTempSpeakerLanguage(e.target.value as SpeakerLanguage)
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="english">English</option>
          <option value="french">French</option>
          <option value="mandarin">Mandarin Chinese</option>
        </select>

        <p className="text-sm text-gray-600 mb-4">
          Word Limit (50 words ≈ 15 seconds)
        </p>
        <input
          type="number"
          min="0"
          value={tempWordLimit}
          onChange={(e) =>
            setTempWordLimit(Math.max(0, parseInt(e.target.value) || 0))
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowApiKeyPrompt(false);
              setTempApiKey("");
              setTempUnrealSpeechToken("");
              setTempCustomTourGuideStyle("");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Validate before saving
              validateApiKey(tempApiKey);
              validateUnrealSpeechToken(tempUnrealSpeechToken);

              setOpenAiKey(tempApiKey);
              setUnrealSpeechToken(tempUnrealSpeechToken);
              setTourGuideStyle(tempTourGuideStyle);
              setCustomTourGuideStyle(tempCustomTourGuideStyle);
              setWikipediaLanguage(tempWikipediaLanguage);
              setSpeakerLanguage(tempSpeakerLanguage);
              setWordLimit(tempWordLimit);
              setShowApiKeyPrompt(false);
              setTempApiKey("");
              setTempUnrealSpeechToken("");
              setTempCustomTourGuideStyle("");
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

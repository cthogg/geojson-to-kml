import { atomWithStorage } from "jotai/utils";

export type TourGuideStyle =
  | "comedian"
  | "tour guide"
  | "history buff"
  | "architect"
  | "local expert"
  | "foodie"
  | "rap artist"
  | "person who speaks one setence english one sentence german"
  | "person who only speaks in words that start with the letter 'S'"
  | "arrogant know-it-all"
  | "motivational speaker"
  | "philosopher"
  | "poet"
  | "historian"
  | "custom";

export const openAiKeyAtom = atomWithStorage("openai-api-key", "");
export const unrealSpeechTokenAtom = atomWithStorage("unreal-speech-token", "");
export const elevenlabsApiKeyAtom = atomWithStorage("elevenlabs-api-key", "");

export type SpeakerLanguage = "english" | "french";
export const speakerLanguageAtom = atomWithStorage<SpeakerLanguage>(
  "speaker-language",
  "english"
);

export const tourGuideStyleAtom = atomWithStorage<TourGuideStyle>(
  "tour-guide-style",
  "tour guide"
);
export const customTourGuideStyleAtom = atomWithStorage(
  "custom-tour-guide-style",
  ""
);

export type WikipediaLanguage = "en" | "fr" | "cs" | "es" | "de";

export const wikipediaLanguageAtom = atomWithStorage<WikipediaLanguage>(
  "wikipedia-language",
  "en"
);

export const wordLimitAtom = atomWithStorage<number>("word-limit", 50);

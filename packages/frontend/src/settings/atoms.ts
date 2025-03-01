import { atomWithStorage } from "jotai/utils";

export type TourGuideStyle =
  | "comedian"
  | "tour guide"
  | "philosopher"
  | "poet"
  | "custom";

export const openAiKeyAtom = atomWithStorage("openai-api-key", "");
export const unrealSpeechTokenAtom = atomWithStorage("unreal-speech-token", "");

export type SpeakerLanguage = "english" | "french" | "mandarin";
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

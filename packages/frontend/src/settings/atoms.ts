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
  | "historian";

export const openAiKeyAtom = atomWithStorage("openai-api-key", "");
export const unrealSpeechTokenAtom = atomWithStorage("unreal-speech-token", "");
export const tourGuideStyleAtom = atomWithStorage<TourGuideStyle>(
  "tour-guide-style",
  "tour guide"
);

import { atomWithStorage } from "jotai/utils";

export const openAiKeyAtom = atomWithStorage("openai-api-key", "");
export const unrealSpeechTokenAtom = atomWithStorage("unreal-speech-token", "");

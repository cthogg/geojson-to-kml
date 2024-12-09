export type PromptInfo = PromptInfoFE & {
  prompt: string | null;
  aiGeneratedText: string | null;
};

export type PromptInfoFE = {
  listEntry: string;
  audioUrl: string | null;
};

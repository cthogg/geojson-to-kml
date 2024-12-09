import { z } from "zod";

export const PromptInfoSchema = z.object({
  listEntry: z.string(),
  audioUrl: z.string().nullable(),
  prompt: z.string().nullable(),
  aiGeneratedText: z.string().nullable(),
  model: z.string().nullable(),
});

export type PromptInfo = z.infer<typeof PromptInfoSchema>;

export type PromptInfoFE = Omit<
  PromptInfo,
  "model" | "aiGeneratedText" | "prompt"
>;

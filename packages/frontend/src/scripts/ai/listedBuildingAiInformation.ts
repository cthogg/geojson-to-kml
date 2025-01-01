import { z } from "zod";

export const PromptInfoSchema = z.object({
  list_entry: z.string(),
  prompt: z.string().nullable(),
  ai_generated_text: z.string().nullable(),
  model: z.string().nullable(),
});

export type PromptInfo = z.infer<typeof PromptInfoSchema>;

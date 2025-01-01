import { z } from "zod";

export const PromptInfoSchema = z.object({
  list_entry: z.string(),
  prompt: z.string().nullable(),
  ai_generated_text: z.string().nullable(),
  model: z.string().nullable(),
});

export type PromptInfo = z.infer<typeof PromptInfoSchema>;

export const PromptInfoSchemaBE = z.object({
  list_entry: z.string(),
  prompt: z.string().nullable(),
  ai_summary: z.string().nullable(),
  model: z.string().nullable(),
});

export const PromptInfoSchemaBEArray = z.array(PromptInfoSchemaBE);

export type PromptInfoBE = z.infer<typeof PromptInfoSchemaBE>;

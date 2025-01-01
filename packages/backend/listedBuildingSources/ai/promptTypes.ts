import { z } from "zod";

export const PromptSchema = z.object({
  prompt: z.string(),
  id: z.string(),
});

export const PromptSchemaArray = z.array(PromptSchema);

export type Prompt = z.infer<typeof PromptSchema>;
export type PromptArray = z.infer<typeof PromptSchemaArray>;

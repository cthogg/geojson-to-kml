import ollama from "ollama";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const Message = z.object({
  message: z.string(),
});

export const generateMessageOllama = async ({
  imageUrl,
  details,
  systemPrompt,
  model,
}: {
  imageUrl: string | undefined;
  details: string;
  systemPrompt: string;
  model: string;
}) => {
  const response = await ollama.chat({
    model,
    messages: [{ role: systemPrompt, content: details }],
    format: zodToJsonSchema(Message),
  });

  const message = Message.parse(JSON.parse(response.message.content));

  return message.message;
};

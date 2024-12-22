import ollama from "ollama";

export const generateMessageOllama = async ({
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
    messages: [
      {
        role: "user",
        content: `${systemPrompt} ${details}`,
      },
    ],
  });

  return response.message.content;
};

import ollama from "ollama";

export const generateMessageOllama = async ({
  details,
  systemPrompt,
  model,
  endPrompt,
}: {
  details: string;
  systemPrompt: string;
  model: string;
  endPrompt: string;
}) => {
  const response = await ollama.chat({
    model,
    keep_alive: "10m",
    messages: [
      {
        role: "user",
        content: `${systemPrompt} ${details} ${endPrompt}`,
      },
    ],
  });

  return response.message.content;
};

import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_API_KEY } from "../../secrets/claudeApiKey";

// const CLAUDE_API_KEY = "BLABLABLA_DO_NOT_USE";

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

async function getBase64FromUrl(url: string): Promise<string | undefined> {
  const response = await fetch(url);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  const size = base64String.length;
  if (size > 4000000) {
    return undefined;
  }
  return base64String;
}

export const generateMessage = async ({
  imageUrl,
  details,
  systemPrompt,
  model,
}: {
  imageUrl: string | undefined;
  details: string;
  systemPrompt: string;
  model: Anthropic.Messages.Model;
}) => {
  const imageData = imageUrl ? await getBase64FromUrl(imageUrl) : undefined;
  const message: Anthropic.MessageCreateParamsNonStreaming = imageData
    ? {
        model,
        max_tokens: 1000,
        temperature: 0,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: details,
              },
              //TODO: Add image but it is around 4x more expensive.
              // {
              //   type: "image",
              //   source: {
              //     media_type: "image/jpeg",
              //     type: "base64",
              //     data: imageData,
              //   },
              // },
            ],
          },
        ],
      }
    : {
        model,
        max_tokens: 1000,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: "user", content: details }],
      };

  const msg = await anthropic.messages.create(message);
  return msg.content[0].type === "text" ? msg.content[0].text : "";
};

// console.log(await generateMessage({ imageUrl, details }));

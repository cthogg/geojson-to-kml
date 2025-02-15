import OpenAI from "openai";
import { TourGuideStyle } from "../../settings/atoms";

export const createCompletion = async ({
  fullArticle,
  openAiKey,
  style,
}: {
  fullArticle: string;
  openAiKey: string;
  style: TourGuideStyle;
}) => {
  const openai = new OpenAI({
    organization: "org-NnvD2zTUZJPKSal9Y5kSw3z0",
    project: "proj_a7KpL1G0NqZPrAg1JjRK3xP0",
    dangerouslyAllowBrowser: true,
    apiKey: openAiKey,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: ` You are a London tour guide. You are given a location. Write a 100 word summary of the location. The summary should be in the style of a ${style}.`,
      },
      {
        role: "user",
        content: fullArticle,
      },
    ],
  });

  return completion;
};

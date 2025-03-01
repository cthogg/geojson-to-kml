import OpenAI from "openai";
import { SpeakerLanguage, TourGuideStyle } from "../../settings/atoms";

export const createCompletion = async ({
  fullArticle,
  openAiKey,
  style,
  customTourGuideStyle,
  wordLimit,
  speakerLanguage,
}: {
  fullArticle: string;
  openAiKey: string;
  style: TourGuideStyle;
  customTourGuideStyle: string;
  wordLimit: number;
  speakerLanguage: SpeakerLanguage;
}) => {
  const openai = new OpenAI({
    organization: "org-NnvD2zTUZJPKSal9Y5kSw3z0",
    project: "proj_a7KpL1G0NqZPrAg1JjRK3xP0",
    dangerouslyAllowBrowser: true,
    apiKey: openAiKey,
  });

  const styleToUse = style === "custom" ? customTourGuideStyle : style;
  const languageToUse = speakerLanguage === "french" ? "French" : "English";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a local tour guide. You are given a location. Write a ${wordLimit} word summary of the location. The summary should be in the style of a ${styleToUse}. Answer in the ${languageToUse} language.`,
      },
      {
        role: "user",
        content: fullArticle,
      },
    ],
  });

  return completion;
};

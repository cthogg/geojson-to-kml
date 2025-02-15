import OpenAI from "openai";
import { APIError } from "openai/error";

export const createCompletion = async ({
  fullArticle,
  openAiKey,
}: {
  fullArticle: string;
  openAiKey: string;
}) => {
  try {
    const openai = new OpenAI({
      organization: "org-NnvD2zTUZJPKSal9Y5kSw3z0",
      project: "proj_a7KpL1G0NqZPrAg1JjRK3xP0",
      dangerouslyAllowBrowser: true,
      apiKey: openAiKey,
    });
    console.log("openai", openai);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a London tour guide. You are given a location. Write a 100 word summary of the location. The summary should be in the style of a tour guide.",
        },
        {
          role: "user",
          content: fullArticle,
        },
      ],
    });

    return { success: true, data: completion };
  } catch (error) {
    const apiError = error as APIError;
    return {
      success: false,
      error: {
        message: apiError.message || "An unknown error occurred",
        code: apiError.code || "UNKNOWN_ERROR",
        status: apiError.status || 500,
      },
    };
  }
};

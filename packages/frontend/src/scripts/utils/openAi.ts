import OpenAI from "openai";

export const createCompletion = async ({
  fullArticle,
  openAiKey,
}: {
  fullArticle: string;
  openAiKey: string;
}) => {
  const openai = new OpenAI({
    organization: "org-NnvD2zTUZJPKSal9Y5kSw3z0",
    project: "proj_a7KpL1G0NqZPrAg1JjRK3xP0",
    dangerouslyAllowBrowser: true,
    apiKey: openAiKey,
  });
  console.log("openai", openai);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "developer",
        content:
          "You are a London tour guide. You are given a location. Write a 100 word summary of the location. The summary should be in the style of a tour guide.",
      },
      {
        role: "user",
        content: fullArticle,
      },
    ],
    store: true,
  });

  return completion;
};

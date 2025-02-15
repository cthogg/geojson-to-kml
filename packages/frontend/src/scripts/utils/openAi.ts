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

  const styles = [
    "comedian",
    "tour guide",
    "history buff",
    "local expert",
    "foodie",
    "rap artist",
    "a person who speaks one setence english one sentence german",
    "a person who only speaks in words that start with the letter 'S'",
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: ` You are a London tour guide. You are given a location. Write a 100 word summary of the location. The summary should be in the style of a ${styles[7]}.`,
      },
      {
        role: "user",
        content: fullArticle,
      },
    ],
  });

  return completion;
};

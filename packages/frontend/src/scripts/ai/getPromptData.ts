import { z } from "zod";
import { PromptInfo, PromptInfoSchema } from "./listedBuildingAiInformation";
import promptData from "./promptData.json";
export const getPromptData = (): PromptInfo[] => {
  const promptDataParsed = z.array(PromptInfoSchema).parse(promptData);
  return promptDataParsed.filter(
    (prompt) => prompt.model === "claude-3-5-haiku-20241022"
  );
};

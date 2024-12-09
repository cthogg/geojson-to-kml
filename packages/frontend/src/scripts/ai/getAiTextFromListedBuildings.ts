import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getListedBuildingFileFE } from "../listedBuildingSources/getListedBuildingFE";
import { generateMessage } from "./claudeQuery";
import { PromptInfo, PromptInfoSchema } from "./listedBuildingAiInformation";
import promptData from "./promptData.json";
const systemPrompt =
  "You are an architectural tour guide, giving a tour to a person with a lay interest in historical architecture. Describe the listed building in this text and images, pointing out specific features on the building to look out for. Please describe the as if you are standing in front of it from the perspective of the image. Do not use phrases like 'Points to decorative details' => but instead phrases like 'look at the decorative details'. Please keep the answer to under 200 words.";

const model: Anthropic.Messages.Model = "claude-3-5-sonnet-20241022";

const getPromptData = (): PromptInfo[] => {
  const promptDataParsed = z.array(PromptInfoSchema).parse(promptData);
  return promptDataParsed;
};

export const getAiTextFromListedBuildings = async () => {
  const buildings = getListedBuildingFileFE();
  console.log("buildings", buildings.length);
  const promptDb = getPromptData();
  console.log("promptDb", promptDb.length);
  const filteredPromptDb = buildings.filter(
    (building) =>
      !promptDb.some(
        (prompt) =>
          prompt.listEntry === building.listEntry &&
          prompt.prompt === systemPrompt &&
          prompt.model === model
      )
  );
  console.log(filteredPromptDb.length);
  const aiText = await Promise.all(
    filteredPromptDb.map(async (building) => {
      console.log(building.listEntry);
      const message = await generateMessage({
        imageUrl: building.imageUrl ?? undefined,
        systemPrompt,
        details: `${building.wikipediaText ?? ""} ${
          building.historicalEnglandText ?? ""
        }`,
        model,
      });
      const promptInfo: PromptInfo = {
        prompt: systemPrompt,
        model: model,
        listEntry: building.listEntry,
        audioUrl: null,
        aiGeneratedText: message,
      };
      return promptInfo;
    })
  );
  const newPromptDb: PromptInfo[] = [...promptDb, ...aiText];
  Bun.write("promptData.json", JSON.stringify(newPromptDb));
};

await getAiTextFromListedBuildings();

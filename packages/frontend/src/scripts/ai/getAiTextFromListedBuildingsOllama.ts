import { getListedBuildingFileFE } from "../listedBuildingSources/getListedBuildingFE";
import { getPromptData } from "./getPromptData";
import { PromptInfo } from "./listedBuildingAiInformation";
import { generateMessageOllama } from "./ollamaQueryBuildings";
const systemPrompt =
  "You are an architectural tour guide, giving a tour to a person with a lay interest in historical architecture. Describe the listed building in this text and images, pointing out specific features on the building to look out for, and interesting parts of its history. Please describe the as if you are standing in front of it from the perspective of the image. Do not use phrases like 'Points to decorative details' => but instead phrases like 'look at the decorative details'. Please keep the answer to under 200 words. Please write in the second person and do not include the first person.";

const endPrompt =
  'Please write in the second person and do not include the first person. Do not use a list in the response. Please start with "Welcome to". ';
const model = "llama3.2";

export const getAiTextFromListedBuildings = async () => {
  const buildings = getListedBuildingFileFE().slice(0, 2);
  const promptDb = getPromptData();
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
      const message = await generateMessageOllama({
        systemPrompt,
        endPrompt,
        details: `${building.wikipediaText ?? ""} ${
          building.historicalEnglandText ?? ""
        }`,
        model,
      });
      const promptInfo: PromptInfo = {
        prompt: `${systemPrompt} ${endPrompt}`,
        model: model,
        listEntry: building.listEntry,
        audioUrl: null,
        aiGeneratedText: message,
      };
      return promptInfo;
    })
  );
  const newPromptDb: PromptInfo[] = [...promptDb, ...aiText];
  Bun.write("prompData.json", JSON.stringify(newPromptDb));
};

await getAiTextFromListedBuildings();

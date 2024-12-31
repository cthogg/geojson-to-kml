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
  const buildings = getListedBuildingFileFE().slice(0, 10);
  const promptDb = getPromptData();
  const filteredPromptDb = buildings.filter(
    (building) =>
      !promptDb.some(
        (prompt) =>
          prompt.listEntry === building.listEntry &&
          prompt.prompt === `${systemPrompt} ${endPrompt}` &&
          prompt.model === model
      )
  );
  console.log(`Processing ${filteredPromptDb.length} buildings`);

  // Process in batches of 2
  for (let i = 0; i < filteredPromptDb.length; i += 2) {
    const batch = filteredPromptDb.slice(i, i + 2);
    console.log(
      `Processing batch ${i / 2 + 1} of ${Math.ceil(
        filteredPromptDb.length / 2
      )}`
    );

    const results = await Promise.allSettled(
      batch.map(async (building) => {
        try {
          console.log(`Processing building: ${building.listEntry}`);
          const message = await generateMessageOllama({
            systemPrompt,
            endPrompt,
            details: `${building.wikipediaText ?? ""} ${
              building.historicalEnglandText ?? ""
            }`,
            model,
          });
          console.log(`Successfully processed building: ${building.listEntry}`);

          return {
            success: true,
            data: {
              prompt: `${systemPrompt} ${endPrompt}`,
              model: model,
              listEntry: building.listEntry,
              audioUrl: null,
              aiGeneratedText: message,
            } as PromptInfo,
          };
        } catch (error) {
          return {
            success: false,
            listEntry: building.listEntry,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    const successfulResults = results
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          success: true;
          data: PromptInfo;
        }> => result.status === "fulfilled" && result.value.success
      )
      .map((result) => result.value.data);
    const failures = results
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          success: false;
          listEntry: string;
          error: string;
        }> => result.status === "fulfilled" && !result.value.success
      )
      .map((result) => result.value);

    if (failures.length > 0) {
      console.error(`Failed to process ${failures.length} buildings:`);
      failures.forEach((failure) => {
        console.error(`- Building ${failure.listEntry}: ${failure.error}`);
      });
    }

    // Write to file after each batch
    const newPromptDb: PromptInfo[] = [...promptDb, ...successfulResults];
    await Bun.write("promptData.json", JSON.stringify(newPromptDb));

    // Update promptDb for next batch
    promptDb.push(...successfulResults);
  }
};

await getAiTextFromListedBuildings();

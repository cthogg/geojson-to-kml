import Anthropic from "@anthropic-ai/sdk";
import { getAiSummaries } from "../beSyncListedBuildingSources/getAiSummaries";
import { getListedBuildingFileBE } from "../beSyncListedBuildingSources/getListedBuildingFE";
import { PromptInfo } from "../beSyncListedBuildingSources/listedBuildingAiInformation";
import { generateMessage } from "./claudeQuery";
import { getPrompts } from "./getPrompts";
const systemPrompt =
  "You are an architectural tour guide, giving a tour to a person with a lay interest in historical architecture. Describe the listed building in this text and images, pointing out specific features on the building to look out for. Please describe the as if you are standing in front of it from the perspective of the image. Do not use phrases like 'Points to decorative details' => but instead phrases like 'look at the decorative details'. Can you start with Welcome to. Please keep the answer to under 200 words.";

const model: Anthropic.Messages.Model = "claude-3-5-haiku-20241022";
const BATCH_SIZE = 20;

export const getAiTextFromListedBuildings = async () => {
  const prompts = await getPrompts();
  const buildings = await getListedBuildingFileBE();
  const promptDb = await getAiSummaries();
  const filteredPromptDb = buildings.filter(
    (building) =>
      !promptDb.some(
        (prompt) =>
          prompt.list_entry === building.list_entry &&
          prompts.find((p) => p.id === prompt.prompt)?.prompt ===
            systemPrompt &&
          prompt.model === model
      )
  );
  console.log(
    `Filterting out ${buildings.length - filteredPromptDb.length} buildings`
  );
  console.log(`Processing ${filteredPromptDb.length} buildings`);
  const newPromptData: PromptInfo[] = [];
  // Process in batches
  for (let i = 0; i < filteredPromptDb.length; i += BATCH_SIZE) {
    const batch = filteredPromptDb.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
        filteredPromptDb.length / BATCH_SIZE
      )}`
    );

    const results = await Promise.allSettled(
      batch.map(async (building) => {
        try {
          console.log(`Processing building: ${building.list_entry}`);
          const message = await generateMessage({
            imageUrl: building.image_url ?? undefined,
            systemPrompt,
            details: `${building.wikipedia_text ?? ""} ${
              building.historical_england_text ?? ""
            }`,
            model,
          });
          console.log(
            `Successfully processed building: ${building.list_entry}`
          );

          return {
            success: true,
            data: {
              prompt: systemPrompt,
              model: model,
              list_entry: building.list_entry,
              ai_summary: message,
            } as PromptInfo,
          };
        } catch (error) {
          return {
            success: false,
            list_entry: building.list_entry,
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
          list_entry: string;
          error: string;
        }> => result.status === "fulfilled" && !result.value.success
      )
      .map((result) => result.value);

    if (failures.length > 0) {
      console.error(`Failed to process ${failures.length} buildings:`);
      failures.forEach((failure) => {
        console.error(`- Building ${failure.list_entry}: ${failure.error}`);
      });
    }

    // Write to file after each batch
    const newPromptDb: PromptInfo[] = [...newPromptData, ...successfulResults];
    await Bun.write(
      "./listedBuildingSources/ai/promptData.json",
      JSON.stringify(newPromptDb)
    );

    // Update promptDb for next batch
    promptDb.push(...successfulResults);
    newPromptData.push(...successfulResults);
  }
};

await getAiTextFromListedBuildings();

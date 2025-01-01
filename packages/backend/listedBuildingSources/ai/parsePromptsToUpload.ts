import { getPrompts } from "./getPrompts";
import promptData from "./promptData.json";
import { PromptArray } from "./promptTypes";

async function checkMissingPrompts() {
  // Get unique prompts from promptData.json
  const localPrompts = [...new Set(promptData.map((item) => item.prompt))];

  // Get prompts from database
  const dbPrompts: PromptArray = await getPrompts();
  const dbPromptTexts = dbPrompts.map((item) => item.prompt);

  // Find prompts that don't exist in the database
  const missingPrompts = localPrompts.filter(
    (prompt) => !dbPromptTexts.includes(prompt)
  );

  // Create output JSON
  const missingPromptsJson = missingPrompts.map((prompt) => ({
    prompt,
    model: "claude-3-5-haiku-20241022", // Using the same model as in promptData.json
  }));

  // Output results
  if (missingPrompts.length > 0) {
    console.log(
      "Missing prompts:",
      JSON.stringify(missingPromptsJson, null, 2)
    );
  } else {
    console.log("All prompts exist in the database!");
    const promptForUpload = promptData.map((item) => {
      return {
        ...item,
        prompt: dbPrompts.find((prompt) => prompt.prompt === item.prompt)?.id,
      };
    });
    Bun.write(
      "./listedBuildingSources/ai/promptDataUpload.json",
      JSON.stringify(promptForUpload)
    );
    console.log("promptDataUpload.json written");
  }

  return missingPromptsJson;
}

// Run the check
checkMissingPrompts().catch(console.error);

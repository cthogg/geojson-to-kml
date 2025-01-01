import * as fs from "fs";
import data from "./promptData.json";
interface PromptData {
  list_entry: string;
  prompt: string;
  ai_generated_text: string;
  model: string;
}

function extractUniquePrompts(data: PromptData[]): Map<string, string[]> {
  const promptMap = new Map<string, string[]>();

  data.forEach((entry) => {
    const prompt = entry.prompt;
    const listEntry = entry.list_entry;

    if (promptMap.has(prompt)) {
      promptMap.get(prompt)?.push(listEntry);
    } else {
      promptMap.set(prompt, [listEntry]);
    }
  });

  return promptMap;
}

function writeToCSV(
  promptMap: Map<string, string[]>,
  outputPath: string
): void {
  // Create CSV header
  let csvContent = "id,prompt\n";

  // Add each prompt with its first list entry ID
  promptMap.forEach((listEntries, prompt) => {
    // Escape quotes in prompt and wrap in quotes to handle commas and line breaks
    const escapedPrompt = `"${prompt.replace(/"/g, '""')}"`;
    csvContent += `${listEntries[0]},${escapedPrompt}\n`;
  });

  // Write to file
  fs.writeFileSync(outputPath, csvContent, "utf-8");
  console.log(`CSV file has been written to ${outputPath}`);
}

// Example usage:
const promptData: PromptData[] = data;
const uniquePrompts = extractUniquePrompts(promptData);

// Write to CSV file
const outputPath = "./unique_prompts.csv";
writeToCSV(uniquePrompts, outputPath);

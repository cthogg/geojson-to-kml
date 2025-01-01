// Compare list entries between promptData.json and listEntriesDb.json
interface PromptData {
  list_entry: string;
  prompt?: string;
  ai_generated_text?: string;
  model?: string;
}

interface ListEntry {
  list_entry: string;
}

// Import the JSON files
import listEntriesDb from "./listEntriesDb.json";
import promptData from "./promptData.json";

// Convert listEntriesDb to a Set for faster lookup
const existingEntries = new Set(listEntriesDb.map((entry) => entry.list_entry));

// Find missing entries
const missingEntries = promptData
  .filter((entry) => !existingEntries.has(entry.list_entry))
  .map((entry) => entry.list_entry);

// Print results
if (missingEntries.length > 0) {
  console.log("Missing entries:");
  missingEntries.forEach((entry) => {
    console.log(`  ${entry}`);
  });
} else {
  console.log("No missing entries found.");
}

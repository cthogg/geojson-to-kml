interface PromptData {
  list_entry: string;
  prompt: string;
  ai_generated_text: string;
  model: string;
}

// Read and parse the JSON file
const jsonData = (await Bun.file(
  "promptData.json"
).json()) as unknown as PromptData[];

// Convert JSON to CSV
const headers = ["list_entry", "prompt", "ai_summary", "model"];
const csvRows = [
  // Add headers
  headers.join(","),
  // Add data rows
  ...jsonData.map((item) => {
    return [
      item.list_entry,
      `"${item.prompt}"`,
      `"${item.ai_generated_text.replace(/"/g, '""')}"`, // Escape quotes in text
      `"${item.model}"`,
    ].join(",");
  }),
];

// Write to CSV file
await Bun.write("promptData.csv", csvRows.join("\n"));

console.log("CSV file has been created successfully!");

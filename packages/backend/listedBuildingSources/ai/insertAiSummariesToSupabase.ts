import { createClient } from "@supabase/supabase-js";
import promptDataUpload from "./promptDataUpload.json";

const supabaseUrl = "https://yvrmwbxbhglycwnckely.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU";

const supabase = createClient(supabaseUrl, supabaseKey);

interface AiSummary {
  prompt: string;
  model: string;
  list_entry: string;
  ai_summary: string;
}

async function getAiSummariesFile(): Promise<AiSummary[]> {
  return promptDataUpload;
}

async function insertAiSummaries(summaries: AiSummary[]) {
  const { data, error } = await supabase
    .from("ai_summaries")
    .insert(summaries)
    .select();

  if (error) {
    console.error("Error inserting AI summaries:", error);
    throw error;
  } else {
    console.log(`Inserted ${data.length} AI summaries`);
  }

  return data;
}

async function insertAllAiSummaries() {
  const summaries = await getAiSummariesFile();
  await insertAiSummaries(summaries);
}

// Execute the insertion
await insertAllAiSummaries();

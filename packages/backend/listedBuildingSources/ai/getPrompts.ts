import { PromptArray, PromptSchemaArray } from "./promptTypes";

//FIXME: change the db so the prompt and model in ai_summaries should always be unique.
//FIXME: need to just get the basic id and latitude and longitude. Only on click should get full data.
const fetchPrompts = async () => {
  const response = await fetch(
    "https://yvrmwbxbhglycwnckely.supabase.co/rest/v1/prompts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU",
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getPrompts = async (): Promise<PromptArray> => {
  const data = await fetchPrompts();
  const promptData = data;
  const parsePromptData = PromptSchemaArray.parse(promptData);
  return parsePromptData;
};

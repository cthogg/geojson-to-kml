import { z } from "zod";
import {
  PromptInfo,
  PromptInfoBE,
  PromptInfoSchema,
  PromptInfoSchemaBEArray,
} from "./listedBuildingAiInformation";
import promptData from "./promptData.json";
export const getPromptData = (): PromptInfo[] => {
  const promptDataParsed = z.array(PromptInfoSchema).parse(promptData);
  return promptDataParsed.filter(
    (prompt) => prompt.model === "claude-3-5-haiku-20241022"
  );
};

//FIXME: need to just get the basic id and latitude and longitude. Only on click should get full data.
const fetchAiSummaries = async () => {
  const response = await fetch(
    "https://yvrmwbxbhglycwnckely.supabase.co/rest/v1/ai_summaries",
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

export const getPromptDataBE = async (): Promise<PromptInfoBE[]> => {
  const data = await fetchAiSummaries();
  const promptData = data;
  const parsePromptData = PromptInfoSchemaBEArray.parse(promptData);
  return parsePromptData;
};

import {
  PromptInfoBE,
  PromptInfoSchemaBE,
  PromptInfoSchemaBEArray,
} from "./listedBuildingAiInformation";
import { SUPABASE_API_KEY, SUPABASE_URL } from "./supabaseApiKey";

const fetchAiSummaries = async () => {
  const response = await fetch(`${SUPABASE_URL}/ai_summaries`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getAiSummaries = async (): Promise<PromptInfoBE[]> => {
  const data = await fetchAiSummaries();
  const promptData = data;
  const parsePromptData = PromptInfoSchemaBEArray.parse(promptData);
  return parsePromptData;
};

const fetchSingleAiSummary = async (listEntry: string) => {
  const response = await fetch(
    `${SUPABASE_URL}/ai_summaries?list_entry=eq.${listEntry}`,
    {
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getSingleAiSummary = async (listEntry: string) => {
  const data = await fetchSingleAiSummary(listEntry);
  const promptData = data;
  const parsePromptData = PromptInfoSchemaBE.parse(promptData);
  return parsePromptData;
};

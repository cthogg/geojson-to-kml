import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { z } from "zod";
import {
  getWikipediaFullArticle,
  getWikipediaInformationFromUrl,
} from "./scripts/utils/getWikipediaInformation";
import { createCompletion } from "./scripts/utils/openAi";
import { WikipediaArticleSchema } from "./scripts/utils/WikipediaArticlesTypes";

type WikipediaArticle = z.infer<typeof WikipediaArticleSchema>;

interface WikipediaPanelProps {
  selectedArticle: WikipediaArticle;
  setSelectedArticle: (article: WikipediaArticle | null) => void;
  openAiKey: string;
}

export function WikipediaPanel({
  selectedArticle,
  setSelectedArticle,
  openAiKey,
}: WikipediaPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: wikiInfo, isLoading } = useQuery({
    queryKey: ["wikipediaInfo", selectedArticle.wikipedia_article_url],
    queryFn: () =>
      getWikipediaInformationFromUrl(selectedArticle.wikipedia_article_url),
    enabled: !!selectedArticle.wikipedia_article_url,
  });

  const playAudioMutation = useMutation({
    mutationFn: async () => {
      const title = selectedArticle.wikipedia_article_url.split("/wiki/").pop();

      const fullArticle = await getWikipediaFullArticle(
        //FIXME: do not use !.
        decodeURIComponent(title!)
      );
      const openAiText = await createCompletion({
        fullArticle,
        openAiKey,
      });
      const content = openAiText.choices[0].message.content;

      if (audioRef.current && isPlaying) {
        audioRef.current.play();
        return;
      }

      const response = await fetch("https://api.v7.unrealspeech.com/stream", {
        method: "POST",
        headers: {
          Authorization:
            //FIXME: move to a .env variable
            "Bearer NwDR1Ax5PC3vajVePGPcyvWcS1t56ZIRqzANGQQaQdk6zU1EPXKaAt",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Text: content ?? "",
          VoiceId: "Dan",
          Bitrate: "192k",
          Speed: "0.01",
          Pitch: "0.92",
          Codec: "libmp3lame",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      await audio.play();
      setIsPlaying(true);
    },
  });

  const handlePlayPause = () => {
    if (!audioRef.current) {
      playAudioMutation.mutate();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative z-10 p-4 backdrop-blur-sm">
      <div className="flex justify-between items-start text-black">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {selectedArticle.name}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-black ml-2"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="animate-pulse">Loading...</div>
        ) : (
          <>
            {wikiInfo?.summary.description && (
              <p className="text-gray-700">{wikiInfo.summary.description}</p>
            )}
            {wikiInfo?.summary.thumbnail && (
              <div className="flex justify-center">
                <img
                  src={wikiInfo.summary.thumbnail.source}
                  alt={selectedArticle.name}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}

            <button
              onClick={handlePlayPause}
              disabled={playAudioMutation.isPending}
              className="flex-shrink-0 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300"
            >
              {playAudioMutation.isPending ? (
                <span className="animate-spin">⟳</span>
              ) : isPlaying ? (
                "⏸"
              ) : (
                "▶"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

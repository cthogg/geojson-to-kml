import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { z } from "zod";
import { getWikipediaInformationFromUrl } from "./scripts/beSyncListedBuildingSources/getWikipediaInformation";
import { WikipediaArticleSchema } from "./scripts/beSyncListedBuildingSources/WikipediaArticlesTypes";

type WikipediaArticle = z.infer<typeof WikipediaArticleSchema>;

interface WikipediaPanelProps {
  selectedArticle: WikipediaArticle;
  setSelectedArticle: (article: WikipediaArticle | null) => void;
}

export function WikipediaPanel({
  selectedArticle,
  setSelectedArticle,
}: WikipediaPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: wikiInfo, isLoading } = useQuery({
    queryKey: ["wikipediaInfo", selectedArticle.wikipedia_article_url],
    queryFn: () =>
      getWikipediaInformationFromUrl(selectedArticle.wikipedia_article_url),
    enabled: !!selectedArticle.wikipedia_article_url,
  });

  console.log("wikiInfo", wikiInfo);

  const playAudioMutation = useMutation({
    mutationFn: async () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play();
        return;
      }

      const response = await fetch("https://api.v7.unrealspeech.com/stream", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer NwDR1Ax5PC3vajVePGPcyvWcS1t56ZIRqzANGQQaQdk6zU1EPXKaAt",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Text: wikiInfo?.extract ?? "",
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
            {wikiInfo?.thumbnail && (
              <div className="flex justify-center">
                <img
                  src={wikiInfo.thumbnail.source}
                  alt={selectedArticle.name}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}
            {wikiInfo?.description && (
              <p className="text-gray-700">{wikiInfo.description}</p>
            )}
            {wikiInfo?.extract && (
              <div className="flex items-start gap-2">
                <p className="text-gray-700 text-sm flex-grow">
                  {wikiInfo.extract}
                </p>
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
              </div>
            )}
            <div className="flex-1">
              <a
                href={selectedArticle.wikipedia_article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Read more on Wikipedia
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

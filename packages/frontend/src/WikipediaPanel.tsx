import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { z } from "zod";
import {
  getWikipediaFullArticle,
  getWikipediaInformationFromUrl,
} from "./scripts/utils/getWikipediaInformation";
import { createCompletion } from "./scripts/utils/openAi";
import { WikipediaArticleSchema } from "./scripts/utils/WikipediaArticlesTypes";
import {
  customTourGuideStyleAtom,
  TourGuideStyle,
  tourGuideStyleAtom,
  wikipediaLanguageAtom,
} from "./settings/atoms";

type WikipediaArticle = z.infer<typeof WikipediaArticleSchema>;

interface WikipediaPanelProps {
  selectedArticle: WikipediaArticle;
  setSelectedArticle: (article: WikipediaArticle | null) => void;
  openAiKey: string;
  unrealSpeechToken: string;
}

export function WikipediaPanel({
  selectedArticle,
  setSelectedArticle,
  openAiKey,
  unrealSpeechToken,
}: WikipediaPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tourGuideStyle, setTourGuideStyle] = useAtom(tourGuideStyleAtom);
  const [customTourGuideStyle] = useAtom(customTourGuideStyleAtom);
  const [language] = useAtom(wikipediaLanguageAtom);

  const { data: wikiInfo, isLoading } = useQuery({
    queryKey: ["wikipediaInfo", selectedArticle.wikipedia_article_url],
    queryFn: () =>
      getWikipediaInformationFromUrl(
        selectedArticle.wikipedia_article_url,
        language
      ),
    //FIXME: do not use !.
    enabled: !!selectedArticle.wikipedia_article_url,
    throwOnError: true,
  });

  const playAudioMutation = useMutation({
    mutationFn: async () => {
      const title = selectedArticle.wikipedia_article_url.split("/wiki/").pop();

      const fullArticle = await getWikipediaFullArticle(
        //FIXME: do not use !.
        decodeURIComponent(title!),
        language
      );
      const openAiText = await createCompletion({
        fullArticle,
        openAiKey,
        style: tourGuideStyle,
        customTourGuideStyle,
      });
      const content = openAiText?.choices[0].message.content;

      if (audioRef.current && isPlaying) {
        audioRef.current.play();
        return;
      }

      const response = await fetch("https://api.v7.unrealspeech.com/stream", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${unrealSpeechToken}`,
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
        throw new Error(`${response.status} ${response.statusText}`);
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
    throwOnError: true,
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
          <button
            onClick={handlePlayPause}
            disabled={playAudioMutation.isPending}
            className="flex-shrink-0 p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300 text-sm"
          >
            {playAudioMutation.isPending ? (
              <span className="animate-spin">⟳</span>
            ) : isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z"
                    clip-rule="evenodd"
                  />
                  <path d="M8 7h2v10H8zm6 0h2v10h-2z" />
                </g>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z"
                    clip-rule="evenodd"
                  />
                  <path d="m16 12l-6 4.33V7.67z" />
                </g>
              </svg>
            )}
          </button>
        </h2>
        <p className="text-sm text-gray-500">
          <select
            value={tourGuideStyle}
            onChange={(e) =>
              setTourGuideStyle(e.target.value as TourGuideStyle)
            }
            className="p-1 border border-gray-300 rounded bg-white max-w-[200px]"
          >
            {/* FIXME: automatically generate options from the styles array */}

            <option value="tour guide">Tour Guide</option>
            <option value="comedian">Comedian</option>
            <option value="history buff">History Buff</option>
            <option value="architect">Architect</option>
            <option value="local expert">Local Expert</option>
            <option value="foodie">Foodie</option>
            <option value="rap artist">Rap Artist</option>
            <option value="person who speaks one setence english one sentence german">
              English/German Speaker
            </option>
            <option value="person who only speaks in words that start with the letter 'S'">
              S-Words Only
            </option>
            <option value="arrogant know-it-all">Arrogant Know-it-all</option>
            <option value="motivational speaker">Motivational Speaker</option>
            <option value="philosopher">Philosopher</option>
            <option value="poet">Poet</option>
            <option value="historian">Historian</option>
            <option value="custom">(custom) {customTourGuideStyle}</option>
          </select>
        </p>

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
          </>
        )}
      </div>
    </div>
  );
}

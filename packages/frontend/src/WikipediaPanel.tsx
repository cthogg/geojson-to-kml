import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { LoadingSpinner, PauseIcon, PlayIcon } from "./assets/icons";
import {
  getWikipediaFullArticle,
  getWikipediaInformationFromUrl,
} from "./scripts/utils/getWikipediaInformation";
import { createCompletion } from "./scripts/utils/openAi";
import { WikipediaArticleSchema } from "./scripts/utils/WikipediaArticlesTypes";
import {
  customTourGuideStyleAtom,
  speakerLanguageAtom,
  TourGuideStyle,
  tourGuideStyleAtom,
  wikipediaLanguageAtom,
  wordLimitAtom,
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
  const [showAudioTranscript, setShowAudioTranscript] = useState(false);
  const [audioTranscriptText, setAudioTranscriptText] = useState<string | null>(
    null
  );
  const [audioHasEnded, setAudioHasEnded] = useState(false);
  const [tourGuideStyle, setTourGuideStyle] = useAtom(tourGuideStyleAtom);
  const [customTourGuideStyle] = useAtom(customTourGuideStyleAtom);
  const [language] = useAtom(wikipediaLanguageAtom);
  const [speakerLanguage] = useAtom(speakerLanguageAtom);
  const [wordLimit] = useAtom(wordLimitAtom);

  useEffect(() => {
    // Cleanup audio when selectedArticle changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setShowAudioTranscript(false);
      setAudioTranscriptText(null);
      setAudioHasEnded(false);
    }
  }, [selectedArticle]);

  // Reset audio state when tour guide style changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setShowAudioTranscript(false);
      setAudioTranscriptText(null);
      setAudioHasEnded(false);
    }
  }, [tourGuideStyle, customTourGuideStyle]);

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
        wordLimit,
        speakerLanguage,
      });

      const content = openAiText?.choices[0].message.content;

      // Store the transcript text
      setAudioTranscriptText(content || "");

      if (audioRef.current && isPlaying) {
        audioRef.current.play();
        return;
      }

      // Use Unreal Speech for text-to-speech
      let voiceId;
      if (speakerLanguage === "french") {
        voiceId = "Élodie";
      } else if (speakerLanguage === "mandarin") {
        voiceId = "Mei";
      } else {
        voiceId = "Charlotte";
      }

      const response = await fetch("https://api.v8.unrealspeech.com/stream", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${unrealSpeechToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Text: content ?? "",
          VoiceId: voiceId,
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
        setAudioHasEnded(true);
      });

      await audio.play();
      setIsPlaying(true);
      setShowAudioTranscript(true);
    },
    mutationKey: [tourGuideStyle, customTourGuideStyle],
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
      setShowAudioTranscript(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setShowAudioTranscript(true);
    }
  };

  // Can you change the handleLearnMore function so when the user presses it it:
  // 1. Produces text from @openAi.ts . It takes in the same information and also the current content.
  // The prompt is You are a local tour guide. You are given a location and content which the tour guide has just spoken about. Write a ${wordLimit} word addition to this, not including things they have spoken about. It should be in the style of a ${styleToUse}. Answer in the ${languageToUse} language.
  // When the user presses play it shows the extra text in the Audio transcript and plays it with unreal speech.

  const handleLearnMore = () => {
    alert("FIXME: feature not yet implemented");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative z-10 p-4 backdrop-blur-sm">
      <div className="flex flex-col text-black">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-semibold">{selectedArticle.name}</h2>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                setIsPlaying(false);
                setShowAudioTranscript(false);
                setAudioTranscriptText(null);
              }
              setSelectedArticle(null);
            }}
            className="text-black"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handlePlayPause}
            disabled={playAudioMutation.isPending}
            className="flex-shrink-0 p-1 rounded-full text-black disabled:text-gray-600 text-sm"
          >
            {playAudioMutation.isPending ? (
              <LoadingSpinner />
            ) : isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>
          <select
            value={tourGuideStyle}
            onChange={(e) =>
              setTourGuideStyle(e.target.value as TourGuideStyle)
            }
            className="p-1 border border-gray-300 rounded bg-white max-w-[200px]"
          >
            {/* FIXME: automatically generate options from the styles array */}
            <option value="local history expert who is specific with facts">
              Local history expert
            </option>
            <option value="comedian">Comedian</option>
            <option value="philosopher">Philosopher</option>
            <option value="poet">Poet</option>
            <option value="custom">(custom) {customTourGuideStyle}</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="animate-pulse">Loading...</div>
        ) : (
          <>
            {wikiInfo?.summary.description && !showAudioTranscript && (
              <p className="text-gray-700">{wikiInfo.summary.description}</p>
            )}
            {showAudioTranscript && audioTranscriptText ? (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Audio Transcript</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {audioTranscriptText}
                </p>
                {audioHasEnded && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleLearnMore}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                )}
              </div>
            ) : (
              wikiInfo?.summary.thumbnail &&
              !showAudioTranscript && (
                <div className="flex justify-center">
                  <img
                    src={wikiInfo.summary.thumbnail.source}
                    alt={selectedArticle.name}
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

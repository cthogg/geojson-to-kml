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
  elevenlabsApiKeyAtom,
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
  const [tourGuideStyle, setTourGuideStyle] = useAtom(tourGuideStyleAtom);
  const [customTourGuideStyle] = useAtom(customTourGuideStyleAtom);
  const [language] = useAtom(wikipediaLanguageAtom);
  const [speakerLanguage] = useAtom(speakerLanguageAtom);
  const [wordLimit] = useAtom(wordLimitAtom);
  const [elevenlabsApiKey] = useAtom(elevenlabsApiKeyAtom);

  useEffect(() => {
    // Cleanup audio when selectedArticle changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setShowAudioTranscript(false);
      setAudioTranscriptText(null);
    }
  }, [selectedArticle]);

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

      let audioUrl: string;

      if (elevenlabsApiKey) {
        //Get from https://api.elevenlabs.io/v1/voices
        // const brianVoiceId = "dRe8aG2olO7L6WwHb5en";
        const eastEndSteveVoiceId = "1TE7ou3jyxHsyRehUuMB";
        // Use Elevenlabs if API key is available
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${eastEndSteveVoiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": elevenlabsApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: content ?? "",
              model_id: "eleven_flash_v2_5",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const audioBlob = await response.blob();
        audioUrl = URL.createObjectURL(audioBlob);
      } else {
        // Fallback to Unreal Speech if no Elevenlabs API key
        const voiceId = speakerLanguage === "french" ? "Élodie" : "Charlotte";

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
        audioUrl = URL.createObjectURL(audioBlob);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setShowAudioTranscript(false);
      });

      await audio.play();
      setIsPlaying(true);
      setShowAudioTranscript(true);
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
      setShowAudioTranscript(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setShowAudioTranscript(true);
    }
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

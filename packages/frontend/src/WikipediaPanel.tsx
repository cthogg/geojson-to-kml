import { useQuery } from "@tanstack/react-query";
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
  const { data: wikiInfo, isLoading } = useQuery({
    queryKey: ["wikipediaInfo", selectedArticle.wikipedia_article_url],
    queryFn: () =>
      getWikipediaInformationFromUrl(selectedArticle.wikipedia_article_url),
    enabled: !!selectedArticle.wikipedia_article_url,
  });

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
              <p className="text-gray-700 text-sm">{wikiInfo.extract}</p>
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

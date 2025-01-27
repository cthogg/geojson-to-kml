import { z } from "zod";
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
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <div className="flex-1">
            <a
              href={selectedArticle.wikipedia_article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Read on Wikipedia
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

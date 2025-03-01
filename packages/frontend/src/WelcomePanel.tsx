interface WelcomePanelProps {
  onClose: () => void;
}

export function WelcomePanel({ onClose }: WelcomePanelProps) {
  return (
    <div className="relative z-10 p-4 backdrop-blur-sm">
      <div className="flex flex-col text-black">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-semibold">Welcome to GeoWiki Explorer</h2>
          <button
            onClick={onClose}
            className="text-black hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-700 mb-4 text-center">
            Explore Wikipedia articles around you with an interactive map
            experience. Discover the history and stories of places nearby with
            AI-powered audio guides.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              How to use:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Click on markers to explore Wikipedia articles near that
                location
              </li>
              <li>Use the "My Location" button to find articles around you</li>
              <li>Listen to AI-generated audio guides about each location</li>
              <li>Choose different guide styles for a unique experience</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Getting Started:
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Navigate to an area of interest on the map</li>
              <li>
                Click on a Wikipedia marker (look for the Wikipedia logo or
                image thumbnails)
              </li>
              <li>
                Read about the location or click the play button to listen
              </li>
              <li>
                Configure API settings by clicking the "APIs" button if needed
              </li>
            </ol>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

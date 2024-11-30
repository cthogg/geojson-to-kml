import "./App.css";

function getListedBuildingNumberFromUrl() {
  const url = window.location.href;
  const match = url.match(/listed-building\/(\d+)/);
  return match ? match[1] : null;
}

function App() {
  const imageUrl =
    "https://private-user-images.githubusercontent.com/19980269/389188918-14239c1c-3d89-49aa-8751-76f4e309ca15.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzI5NjIzODYsIm5iZiI6MTczMjk2MjA4NiwicGF0aCI6Ii8xOTk4MDI2OS8zODkxODg5MTgtMTQyMzljMWMtM2Q4OS00OWFhLTg3NTEtNzZmNGUzMDljYTE1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDExMzAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTMwVDEwMjEyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTk0ZTQ4ODc3NzEyYWFmMGNlMzI3NzA5MTQxYjQ4NWE4MWZmMWQ0NGNjM2U2MGU2YjdhOWQyOGRiODg2Mzk5NTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.Wh0zlQ48rkAkpzgD415K8SWGCmltSvOKh3BjV3OyfUE";
  const audioUrl =
    "https://github.com/user-attachments/assets/950b6541-dbfc-42b1-94c7-6f77b0bf4d11";
  const description = "Here is a description of the page";
  const title = "Victoria and Albert Museum";
  const listedBuildingNumber = getListedBuildingNumberFromUrl();
  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Walking Tour App
          </h2>
        </div>
      </header>

      {/* Main Content - add padding-top to account for fixed header */}
      <div className="min-h-screen bg-gray-100 py-8 px-4 pt-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            {title}
          </h1>
          <p className="text-gray-700 leading-relaxed mt-2">
            Listed Building Number: {listedBuildingNumber}
          </p>

          {/* Audio Player */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Audio Player</h2>
            <audio controls className="w-full">
              <source src={audioUrl} type="video/mp4" />
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Image */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Image</h2>
            <img
              src={imageUrl}
              alt="Description of your image"
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <details className="group">
              <summary className="text-xl font-semibold mb-4 cursor-pointer list-none">
                Description
                <span className="ml-2 text-gray-500 group-open:hidden inline-block">
                  ►
                </span>
                <span className="ml-2 text-gray-500 hidden group-open:inline-block">
                  ▼
                </span>
              </summary>
              <p className="text-gray-700 leading-relaxed mt-2">
                {description}
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

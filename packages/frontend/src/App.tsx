import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import { Map } from "./Map";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div
                style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
              >
                <h2 style={{ color: "#e11d48" }}>Something went wrong!</h2>
                <pre
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "4px",
                    overflow: "auto",
                  }}
                >
                  {error.message}
                  {"\n\n"}
                  {error.stack}
                </pre>
                <button
                  onClick={() => resetErrorBoundary()}
                  style={{
                    marginTop: "16px",
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}
          >
            <Map />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
}

export default App;

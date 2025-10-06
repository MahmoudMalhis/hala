import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./components/router/Index";
import { AlbumProvider } from "./context/AlbumContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AlbumProvider>
        <Index />
      </AlbumProvider>
    </ErrorBoundary>
  );
}

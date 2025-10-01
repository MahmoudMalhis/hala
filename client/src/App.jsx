import "./App.css";
import Index from "./components/router/Index";
import { AlbumProvider } from "./context/AlbumContext";

export default function App() {
  return (
    <AlbumProvider>
      <Index />
    </AlbumProvider>
  );
}

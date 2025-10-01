import { UploaderProvider } from "./context/UploaderContext";
import Index from "./routes/Index";

function App() {
  return (
    <UploaderProvider>
      <Index />
    </UploaderProvider>
  );
}
export default App;

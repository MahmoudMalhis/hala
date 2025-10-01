import { createContext, useContext, useState } from "react";

const UploaderContext = createContext();

export function UploaderProvider({ children }) {
  const [resetPreview, setResetPreview] = useState(false);

  return (
    <UploaderContext.Provider value={{ resetPreview, setResetPreview }}>
      {children}
    </UploaderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUploader() {
  return useContext(UploaderContext);
}

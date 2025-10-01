// AlbumContext.jsx
import { createContext, useContext, useState } from "react";

const AlbumContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAlbum = () => useContext(AlbumContext);

export const AlbumProvider = ({ children }) => {
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);

  return (
    <AlbumContext.Provider value={{ isAlbumOpen, setIsAlbumOpen }}>
      {children}
    </AlbumContext.Provider>
  );
};

import { Outlet } from "react-router";
import Header from "../Header";
import Footer from "../Footer";
import { useAlbum } from "../../context/AlbumContext";

export default function Layout() {
  const { isAlbumOpen } = useAlbum();

  return (
    <>
      {!isAlbumOpen && <Header />}
      <Outlet />
      {!isAlbumOpen && <Footer />}
    </>
  );
}

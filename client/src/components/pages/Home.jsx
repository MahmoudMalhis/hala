import { useEffect, useState } from "react";
import mockImages from "../../mockImages";
import GallerySlider from "../GallerySlider";
import RoomCategory from "../RoomCategory";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function Home() {
  const [homeSettings, setHomeSettings] = useState();
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`
        );
        setHomeSettings(res.data);
      } catch (err) {
        console.log("Failed to fetch", err);
      }
    };
    fetchHomeSettings();
  }, []);

  return (
    <div className="mx-auto">
      <div className="bg-gray-600 opacity-30 absolute top-0 h-screen w-full z-10"></div>
      <div className="relative w-full">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${
            homeSettings?.backgroundImage || ""
          }`}
          alt="Main Banner"
          className="w-full h-screen object-cover"
          loading="lazy"
        />
        {isVisible && (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <h1
              className={`text-white font-bold drop-shadow-lg md:text-9xl text-6xl z-20 ${
                isFadingOut ? "animate-fade-out" : "animate-fade-in"
              }`}
            >
              {i18n.language === "ar"
                ? homeSettings?.mainTitle_ar
                : homeSettings?.mainTitle_en}
            </h1>
            <p
              className={`text-white font-bold drop-shadow-lg md:text-5xl text-3xl z-20 mt-7 ${
                isFadingOut ? "animate-fade-out" : "animate-fade-in"
              }`}
            >
              {i18n.language === "ar"
                ? homeSettings?.subTitle_ar
                : homeSettings?.subTitle_en}
            </p>
          </div>
        )}
      </div>
      <RoomCategory />
      <div className="container py-10 m-auto">
        <GallerySlider images={mockImages} />
      </div>
    </div>
  );
}

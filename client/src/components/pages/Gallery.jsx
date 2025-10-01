import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import AlbumCarousel from "../AlbumCarousel";
import { useAlbum } from "../../context/AlbumContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const query = useQuery();
  const category = query.get("category");
  const { i18n } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { isAlbumOpen, setIsAlbumOpen } = useAlbum();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/gallery`
        );
        setImages(res.data);
      } catch (err) {
        console.error("Failed to fetch images", err);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/room-types`
        );
        setRoomTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch room types", err);
      }
    };

    fetchRoomTypes();
  }, []);

  const selectedRoom = roomTypes.find((room) => room.id === category);

  const selectedRoomName =
    i18n.language === "ar" ? selectedRoom?.name_ar : selectedRoom?.name_en;

  useEffect(() => {
    if (!category) {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((img) => {
        const imgRoomTypeId =
          img.roomType && typeof img.roomType === "object"
            ? img.roomType.id
            : img.roomType;

        return String(imgRoomTypeId) === String(category);
      });

      setFilteredImages(filtered);
    }
  }, [category, images]);

  return (
    <div className="container mx-auto p-4 pt-44 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {selectedRoomName ||
          (i18n.language === "ar" ? "جميع الصور" : "All Images")}
      </h2>
      {isAlbumOpen && selectedIndex !== null && (
        <AlbumCarousel
          images={filteredImages}
          initialIndex={selectedIndex}
          onClose={() => {
            setSelectedIndex(null);
            setIsAlbumOpen(false);
          }}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredImages.map((img, idx) => (
          <div
            key={img.id}
            className="relative group rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => {
              setSelectedIndex(idx);
              setIsAlbumOpen(true);
            }}
          >
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${img.imageURL}`}
              alt={img.title_en}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 p-4 text-white flex flex-col justify-end">
              <h2 className="text-xl font-bold">
                {i18n.language === "ar" ? img.title_ar : img.title_en}
              </h2>
              <p className="text-sm text-gray-200">
                {i18n.language === "ar"
                  ? img.description_ar
                  : img.description_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

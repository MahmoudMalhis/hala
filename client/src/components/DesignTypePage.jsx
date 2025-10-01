import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { useTranslation } from "react-i18next";
import AlbumCarousel from "./AlbumCarousel";
import { useAlbum } from "../context/AlbumContext";

export default function DesignTypePage() {
  const { id } = useParams();
  const [albums, setAlbums] = useState({});
  const [allAlbumImages, setAllAlbumImages] = useState({});
  const [typeInfo, setTypeInfo] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const { i18n, t } = useTranslation();
  const { isAlbumOpen, setIsAlbumOpen } = useAlbum();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: allImages } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/gallery`
        );
        const filtered = allImages.filter((img) => {
          // التحقق من وجود designType
          if (!img.designType) return false;

          // معالجة designType بناءً على نوعه
          let designTypeId;

          if (typeof img.designType === "object") {
            // إذا كان designType كائن، استخدم id (وليس _id)
            designTypeId = img.designType.id || img.designType._id;
          } else {
            // إذا كان string أو number
            designTypeId = img.designType;
          }

          // المقارنة كـ strings للتأكد من التطابق
          return String(designTypeId) === String(id);
        });

        const allImagesGrouped = filtered.reduce((acc, img) => {
          const key = img.album || "بدون ألبوم";
          if (!acc[key]) acc[key] = [];
          acc[key].push(img);
          return acc;
        }, {});
        setAllAlbumImages(allImagesGrouped);

        const limitedGrouped = {};
        Object.keys(allImagesGrouped).forEach((key) => {
          limitedGrouped[key] = allImagesGrouped[key].slice(0, 5);
        });
        setAlbums(limitedGrouped);

        const { data: info } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/design-types/${id}`
        );
        setTypeInfo(info);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      }
    }
    fetchData();
  }, [id]);

  const openAlbum = (name) => {
    setSelectedAlbum(name);
  };
  const slides = allAlbumImages[selectedAlbum] || [];

  const offsets = [-40, -20, 0, 20, 40];
  const rotations = [-15, -7, 0, 7, 15];

  return (
    <div className="min-h-screen py-10 md:mt-28 mt-[70px] bg-gray-100 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold md:mb-8 mb-16 text-center text-gray-800">
          {i18n.language === "ar" ? typeInfo?.name_ar : typeInfo?.name_en}
        </h2>
        {isAlbumOpen && selectedAlbum && (
          <AlbumCarousel
            images={slides}
            initialIndex={0}
            onClose={() => {
              setSelectedAlbum(null);
              setIsAlbumOpen(false);
            }}
          />
        )}
        {Object.keys(albums).length === 0 ? (
          <p className="text-center text-gray-600">
            {t("There are no images to display.")}
          </p>
        ) : (
          <div className="flex justify-center items-center flex-wrap gap-36">
            {Object.entries(albums).map(([albumName, imgs]) => (
              <div key={albumName} className="space-y-2 text-center">
                <div
                  className="relative w-64 h-40 mx-auto cursor-pointer"
                  onMouseEnter={() =>
                    imgs.length > 1 && setHoveredAlbum(albumName)
                  }
                  onMouseLeave={() => imgs.length > 1 && setHoveredAlbum(null)}
                  onClick={() => {
                    openAlbum(albumName);
                    setIsAlbumOpen(true);
                  }}
                >
                  {imgs.map((img, idx) => {
                    // إذا كان هناك صورة واحدة فقط، لا تطبق أي ميلان أو إزاحة
                    const offset =
                      imgs.length > 1
                        ? hoveredAlbum === albumName
                          ? offsets[idx] * 1.5
                          : offsets[idx]
                        : 0;
                    const rotate =
                      imgs.length > 1
                        ? hoveredAlbum === albumName
                          ? rotations[idx] * 1.5
                          : rotations[idx]
                        : 0;

                    return (
                      <img
                        key={img.id}
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          img.imageURL
                        }`}
                        alt={img.title_en || img.title_ar || albumName}
                        className="absolute top-1/2 left-1/2 w-64 h-40 object-cover rounded-lg shadow-lg transition-transform duration-300"
                        style={{
                          transform: `translate(-50%, -50%) translateX(${offset}px) rotate(${rotate}deg)`,
                          zIndex: idx,
                        }}
                      />
                    );
                  })}
                </div>
                <h2 className="text-2xl font-semibold text-gray-700">
                  {albumName}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoomTypes } from "../hooks/useRoomTypes";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export default function RoomCategory() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // ✅ استخدام React Query
  const { data: categories = [], isLoading, error } = useRoomTypes();

  const handleClick = (type) => {
    navigate(`/gallery?category=${type}`);
  };

  // ✅ معالجة Loading
  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6]">
        <div className="max-w-6xl mx-auto px-6">
          <LoadingSpinner message="جاري تحميل الفئات..." />
        </div>
      </section>
    );
  }

  // ✅ معالجة Error
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6]">
        <div className="max-w-6xl mx-auto px-6">
          <ErrorMessage message="فشل في تحميل فئات الغرف" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t("explore by room type")}
        </h2>

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد فئات لعرضها</p>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-8 justify-items-center">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className="cursor-pointer group flex flex-col items-center transition transform hover:scale-105"
              >
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${cat.imageURL}`}
                    alt={cat.name_en}
                    className="w-full h-full object-cover group-hover:opacity-80"
                    loading="lazy"
                  />
                </div>
                <span className="mt-3 text-lg text-gray-600 group-hover:underline font-alexandria">
                  {i18n.language === "ar" ? cat.name_ar : cat.name_en}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

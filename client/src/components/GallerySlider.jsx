import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDesignTypes } from "../hooks/useDesignTypes";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export default function GallerySlider() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: designTypes = [], isLoading, error } = useDesignTypes();

  const handleClick = (designTypeId) => {
    navigate(`/designs/${designTypeId}`);
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <LoadingSpinner message="جاري تحميل أنواع التصاميم..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorMessage message="فشل في تحميل أنواع التصاميم" />
      </div>
    );
  }

  if (designTypes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">لا توجد أنواع تصاميم لعرضها</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4">
      <Swiper
        spaceBetween={20}
        slidesPerView={3.2}
        navigation={true}
        modules={[Navigation]}
        style={{ "--swiper-navigation-color": "#ffd230" }}
        className="mySwiper"
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
      >
        {designTypes.map((type) => (
          <SwiperSlide
            key={type.id}
            className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer"
            onClick={() => handleClick(type.id)}
          >
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${type.imageURL}`}
              alt={i18n.language === "ar" ? type.name_ar : type.name_en}
              className="w-full h-52 object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <h2 className="text-md font-semibold text-gray-800 capitalize ">
                {i18n.language === "ar" ? type.name_ar : type.name_en}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

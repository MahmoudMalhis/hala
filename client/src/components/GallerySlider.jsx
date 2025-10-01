import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GallerySlider() {
  const [designTypes, setDesignTypes] = useState([]);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (designTypeId) => {
    navigate(`/designs/${designTypeId}`);
  };

  useEffect(() => {
    const fetchDesignTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/design-types`
        );
        setDesignTypes(response.data);
      } catch (err) {
        console.log("Error fetching design types", err);
      }
    };

    fetchDesignTypes();
  }, []);

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
            key={type._id}
            className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer"
            onClick={() => handleClick(type._id)}
          >
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${type.imageURL}`}
              alt={i18n.language === "ar" ? type.name_ar : type.name_en}
              className="w-full h-52 object-cover"
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

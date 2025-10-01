// components/AlbumCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";

export default function AlbumCarousel({ images, initialIndex = 0, onClose }) {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <>
      {/* الخلفية المظلمة */}
      <div
        className="fixed inset-0 bg-[#0006] z-50 flex justify-center items-center"
        onClick={onClose}
      >
        {/* صندوق الصور */}
        <div className="fixed inset-0  flex items-center justify-center p-4 -z-50">
          <div
            className="relative w-full max-w-5xl bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-5xl text-amber-300 z-50 cursor-pointer"
            >
              ×
            </button>

            {/* الـ Swiper الكبير */}
            {/* الـ Swiper الكبير */}
            <Swiper
              onSwiper={(s) => {
                setSwiper(s);
                s.slideToLoop(initialIndex);
              }}
              onSlideChange={(s) => setActiveIndex(s.realIndex)}
              modules={[Navigation]}
              navigation
              slidesPerView={1}
              spaceBetween={20}
              style={{ "--swiper-navigation-color": "#ffd230" }}
              className="mb-4"
            >
              {images.map((img) => (
                <SwiperSlide key={img.id}>
                  <div
                    className="flex items-center justify-center"
                    style={{ height: "70vh" }}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${
                        img.imageURL
                      }`}
                      alt={img.title_ar || img.title_en || ""}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* مصغّرات الصور */}
            <div className="flex justify-center gap-2 overflow-x-auto pb-4">
              {images.map((img, idx) => (
                <img
                  key={img.id}
                  src={`${import.meta.env.VITE_API_BASE_URL}${img.imageURL}`}
                  alt={img.title_ar || img.title_en || ""}
                  className={`w-16 h-12 object-cover rounded cursor-pointer ${
                    idx === activeIndex
                      ? "opacity-100 border-2 border-amber-300"
                      : "opacity-50"
                  } transition-opacity`}
                  onClick={() => swiper && swiper.slideToLoop(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

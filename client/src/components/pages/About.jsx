import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function About() {
  const { i18n } = useTranslation();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/about-sections`)
      .then((res) => {
        // تأكد من الترتيب
        const sorted = res.data.sort((a, b) => a.order - b.order);
        setSections(sorted);
      })
      .catch((err) => console.error(err));
  }, []);

  // التحقق من تتابع الأقسام بدون صور
  const groupedSections = [];
  let tempGroup = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const hasImage = sec.imageURL && sec.imageURL.trim() !== "";

    if (!hasImage) {
      tempGroup.push(sec);
      if (tempGroup.length === 2 || i === sections.length - 1) {
        groupedSections.push([...tempGroup]);
        tempGroup = [];
      }
    } else {
      if (tempGroup.length) {
        groupedSections.push([...tempGroup]);
        tempGroup = [];
      }
      groupedSections.push(sec);
    }
  }

  return (
    <section className="min-h-screen pt-44 px-6 pb-20 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6] text-amber-300 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-24">
        {groupedSections.map((group, index) => {
          // إذا كان group عبارة عن مجموعة من قسمين بدون صور
          if (Array.isArray(group)) {
            return (
              <div
                key={index}
                className="grid md:grid-cols-2 gap-12"
                data-aos="fade-up"
              >
                {group.map((sec) => (
                  <div key={sec.id}>
                    <h2 className="text-4xl font-bold text-amber-300 mb-4">
                      {i18n.language === "ar" ? sec.title_ar : sec.title_en}
                    </h2>
                    <pre className="font-alexandria text-gray-700 leading-relaxed text-xl whitespace-pre-wrap break-words">
                      {i18n.language === "ar"
                        ? sec.description_ar
                        : sec.description_en}
                    </pre>
                  </div>
                ))}
              </div>
            );
          }

          // إذا كان فيه صورة
          const sec = group;
          const reverse = sec.order % 2 !== 0;

          return (
            <div
              key={sec.id}
              className={`flex gap-12 items-center max-md:flex-wrap ${
                reverse ? "flex-row-reverse" : ""
              }`}
              data-aos="fade-up"
            >
              <div className=" flex-1/2">
                <h2 className="text-4xl font-bold text-amber-300 mb-4">
                  {i18n.language === "ar" ? sec.title_ar : sec.title_en}
                </h2>
                <pre className="text-gray-700 leading-relaxed text-xl whitespace-pre-wrap break-words font-alexandria">
                  {i18n.language === "ar"
                    ? sec.description_ar
                    : sec.description_en}
                </pre>
              </div>

              {/* عرض الصورة إذا موجودة */}
              {sec.imageURL && sec.imageURL.trim() !== "" && (
                <div className="relative flex-1/2">
                  {sec.order === 3 ? (
                    <>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          sec.imageURL
                        }`}
                        className="rounded-xl shadow-xl h-60 w-full object-cover transform rotate-1 absolute top-0 left-0 z-10"
                        data-aos="fade-right"
                        alt="Image 1"
                        loading="lazy"
                      />
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          sec.imageURL
                        }`}
                        className="rounded-xl shadow-xl h-64 w-full object-cover relative z-0 mt-12 ml-6"
                        data-aos="fade-left"
                        alt="Image 2"
                        loading="lazy"
                      />
                    </>
                  ) : (
                    <div className="transform rotate-2 hover:rotate-0 transition duration-500 shadow-lg">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          sec.imageURL
                        }`}
                        alt={sec.title_en}
                        className="rounded-xl object-cover h-80 w-full"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

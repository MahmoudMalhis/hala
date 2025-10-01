import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { useTranslation } from "react-i18next";
import SocialLinks from "../SocialLinks";

export default function ContactUs() {
  const [contactInfo, setContactInfo] = useState();
  const { t, i18n } = useTranslation();

  const sharedClasses =
    "group flex items-center gap-4 font-alexandria bg-white/40 text-gray-900 px-6 py-3 rounded-full shadow-md backdrop-blur-lg transition-all duration-300 hover:scale-105";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/contact`
        );
        setContactInfo(res.data);
      } catch (err) {
        console.log("Failed to fetch", err);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="relative flex items-center pt-44 md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-120px)] text-amber-300 overflow-hidden">
      <img
        src={
          contactInfo?.backgroundImage
            ? `${import.meta.env.VITE_API_BASE_URL}${
                contactInfo.backgroundImage
              }`
            : "2.jpg" // صورة افتراضية في حال لم يرفع
        }
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
        <h2
          className="text-4xl font-bold mb-6 text-amber-300"
          data-aos="fade-down"
        >
          {t("letsConnect")}
        </h2>
        <p
          className="mb-20 text-lg text-white"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {t("reachUsDescription")}
        </p>
        <SocialLinks
          links={contactInfo}
          layout="column"
          aosDelay={400}
          dataAos="zoom-in"
          sharedClasses={sharedClasses}
        />
        <div className="flex flex-col gap-6 items-center">
          {contactInfo?.otherLinks.map((link) => {
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                className={`${sharedClasses} zoom-in hover:ring-2 mt-6 rounded-full`}
                data-aos={"zoom-in"}
                data-aos-delay={400}
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${link.image}`}
                  alt=""
                  className="w-11 h-11 object-contain"
                />
                <span className="text-lg font-semibold capitalize">
                  {i18n.language === "ar" ? link.platform.ar : link.platform.en}
                </span>
              </a>
            );
          })}
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="600"
          className="mt-16 text-white"
        >
          <p className="text-white">{t("orVisitOffice")}</p>
          {contactInfo?.address.map((addr, id) => (
            <p key={id} className="text-white font-semibold mt-1.5 capitalize mp-3">
              {i18n.language === "ar" ? addr.ar : addr.en}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

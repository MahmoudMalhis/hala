import { useTranslation } from "react-i18next";
import Facebook from "./icons/Facebook";
import Instagram from "./icons/Instagram";
import WhatsApp from "./icons/WhatsApp";

export default function SocialLinks({
  links,
  layout,
  aosDelay = 0,
  dataAos,
  sharedClasses,
}) {
  const { t } = useTranslation();

  const layouts = {
    column: "flex flex-col gap-6 items-center",
    row: "flex gap-2.5",
  };

  return (
    <div className={layouts[layout]}>
      {/* Facebook */}
      {links?.facebook && (
        <a
          href={links.facebook}
          target="_blank"
          rel="noreferrer"
          data-aos={dataAos}
          data-aos-delay={aosDelay}
          className={`${sharedClasses} hover:ring-2 hover:ring-blue-500 rounded-full`}
        >
          <Facebook />
          {layout === "column" && (
            <span className="text-lg font-semibold">{t("facebook")}</span>
          )}
        </a>
      )}
      {/* Instagram */}
      {links?.instagram && (
        <a
          href={links.instagram}
          target="_blank"
          rel="noreferrer"
          data-aos={dataAos}
          data-aos-delay={aosDelay}
          className={`${sharedClasses} hover:ring-2 hover:ring-amber-400 rounded-2xl`}
        >
          <Instagram />
          {layout === "column" && (
            <span className="text-lg font-semibold">{t("instagram")}</span>
          )}
        </a>
      )}
      {/* WhatsApp */}
      {links?.whatsapp && (
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noreferrer"
          data-aos={dataAos}
          data-aos-delay={aosDelay}
          className={`${sharedClasses} hover:ring-2 hover:ring-green-400 rounded-full`}
        >
          <WhatsApp />
          {layout === "column" && (
            <span className="text-lg font-semibold">{t("whatsApp")}</span>
          )}
        </a>
      )}
    </div>
  );
}

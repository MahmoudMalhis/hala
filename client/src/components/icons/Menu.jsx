import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom"; // تأكد من التعديل هنا

export default function Menu({ normalClass, activeClass, changeLanguage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="ltr:ml-auto rtl:mr-auto">
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-black z-50 relative"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 8.25H4.5V6.75H19.5V8.25Z"
                fill="#080341"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 12.75H4.5V11.25H19.5V12.75Z"
                fill="#080341"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 17.25H4.5V15.75H19.5V17.25Z"
                fill="#080341"
              ></path>
            </g>
          </svg>
        </button>
      </div>
      <div>
        {menuOpen && (
          <div className="absolute h-[50vh] w-2/3 inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 p-8 transition-all duration-75 animate-fade-in           ltr:left-1/3 rtl:right-1/3">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 rtl:left-6 ltr:right-6 text-black text-2xl font-bold"
            >
              ✕
            </button>

            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? activeClass : normalClass
              }
            >
              {t("home")}
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? activeClass : normalClass
              }
            >
              {t("about")}
            </NavLink>
            <NavLink
              to="/contactus"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? activeClass : normalClass
              }
            >
              {t("contact")}
            </NavLink>

            <select
              onChange={(e) => {
                changeLanguage(e.target.value);
                setMenuOpen(false);
              }}
              value={i18n.language}
              className="rounded-full px-4 py-2 text-lg font-semibold bg-white border border-gray-300 shadow-md"
            >
              <option value="en">EN</option>
              <option value="ar">عربي</option>
            </select>
          </div>
        )}
      </div>
    </>
  );
}

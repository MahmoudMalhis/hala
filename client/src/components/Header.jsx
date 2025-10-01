import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Menu from "./icons/Menu";

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const activeClass =
    "font-alexandria bg-black/30 text-black px-4 py-2 rounded-full transition-all duration-300 scale-105 ring-2 ring-black/50 shadow-lg shadow-white/20 backdrop-blur-md text-xl";
  const normalClass =
    "font-alexandria hover:bg-black/10 hover:text-black text-black px-4 py-2 rounded-full transition-all duration-300";

  return (
    <header className="fixed md:top-9 top-0 left-0 p-2.5 w-full z-50 backdrop-blur-lg bg-white shadow-md opacity-80">
      <div className="container mx-auto flex justify-between items-center py-2 relative">
        <NavLink to="/">
          <img
            src="logo1.png"
            alt="Hala design logo"
            className="md:w-28 w-24 absolute -top-5"
          />
        </NavLink>
        <Menu
          activeClass={activeClass}
          normalClass={normalClass}
          changeLanguage={changeLanguage}
        />

        <nav className="hidden lg:flex gap-3 items-center">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            {t("about")}
          </NavLink>
          <NavLink
            to="/contactus"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            {t("contact")}
          </NavLink>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="
              backdrop-blur-sm text-black 
              rounded-full px-4 py-2 text-md font-semibold
              appearance-none focus:outline-none focus:ring-2 
              focus:ring-black-400 focus:bg-black/30
              cursor-pointer transition-all duration-200 border-1
            "
          >
            <option value="en">EN</option>
            <option value="ar">عربي</option>
          </select>
        </nav>
      </div>
    </header>
  );
}

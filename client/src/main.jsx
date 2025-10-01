import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import "./i18n";

AOS.init();

const lang = localStorage.getItem("i18nextLng") || "en";
document.documentElement.lang = lang;
document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

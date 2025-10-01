export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    fontFamily: {
      // يمكنك الآن استخدام "alexandria" كمفتاح (اختياري)
      alexandria: ["var(--font-alexandria)", "sans-serif"],
    },
    backgroundOpacity: {
      40: "0.4",
    },
  },
};
export const plugins = [require("tailwindcss-rtl")];

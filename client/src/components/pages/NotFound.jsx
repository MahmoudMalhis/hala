import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6] flex items-center justify-center px-4 pt-20">
      <div className="max-w-2xl w-full">
        {/* الرقم 404 */}
        <div className="text-center mb-8">
          <h1 className="text-9xl md:text-[12rem] font-extrabold text-amber-300 leading-none">
            404
          </h1>
          <div className="relative -mt-8">
            <svg
              className="w-64 h-24 mx-auto opacity-30"
              viewBox="0 0 200 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="100" cy="30" rx="80" ry="20" fill="#fbbf24" />
            </svg>
          </div>
        </div>

        {/* النص */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-alexandria">
            الصفحة غير موجودة
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 font-alexandria">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 font-alexandria"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {t("homePage")}
              </span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl border-2 border-gray-200 transform hover:scale-105 transition duration-300 font-alexandria"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                العودة للخلف
              </span>
            </button>
          </div>
        </div>

        {/* روابط سريعة */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4 font-alexandria">أو يمكنك زيارة:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/gallery")}
              className="text-amber-600 hover:text-amber-700 underline font-alexandria"
            >
              المعرض
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-amber-600 hover:text-amber-700 underline font-alexandria"
            >
              {t("about")}
            </button>
            <button
              onClick={() => navigate("/contactus")}
              className="text-amber-600 hover:text-amber-700 underline font-alexandria"
            >
              {t("contact")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

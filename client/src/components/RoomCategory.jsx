import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function RoomCategory() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/room-types`
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (type) => {
    navigate(`/gallery?category=${type}`);
  };
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6]">
        <div className="max-w-6xl mx-auto px-6 text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t("explore by room type")}
        </h2>

        {categories.length === 0 ? (
          <p className="text-center">No categories found</p>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-8 justify-items-center">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className="cursor-pointer group flex flex-col items-center transition transform hover:scale-105"
              >
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${cat.imageURL}`}
                    alt={cat.name_en}
                    className="w-full h-full object-cover group-hover:opacity-80"
                  />
                </div>
                <span className="mt-3 text-lg text-gray-600 group-hover:underline font-alexandria">
                  {i18n.language === "ar" ? cat.name_ar : cat.name_en}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

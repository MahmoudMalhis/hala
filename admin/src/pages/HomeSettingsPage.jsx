import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MyUploader from "../components/MyUploader";
import { useUploader } from "../context/UploaderContext";
import { translateText } from "../utils/translate";

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState({
    mainTitle_en: "",
    mainTitle_ar: "",
    subTitle_en: "",
    subTitle_ar: "",
    backgroundImage: "",
  });
  const [settingsId, setSettingsId] = useState(null);
  const [tempImage, setTempImage] = useState("");
  const { resetPreview, setResetPreview } = useUploader();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`
        );
        if (res.data) {
          setSettings(res.data);
          setSettingsId(res.data.id);
        }
      } catch (err) {
        console.error("خطأ في جلب الإعدادات:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));

    if (name === "mainTitle_ar") {
      const translated = await translateText(value);
      setSettings((prev) => ({ ...prev, mainTitle_en: translated }));
    }

    if (name === "subTitle_ar") {
      const translated = await translateText(value);
      setSettings((prev) => ({ ...prev, subTitle_en: translated }));
    }
  };

  const handleImageUpload = (imageUrl) => {
    setTempImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedSettings = {
        ...settings,
        backgroundImage: tempImage || settings.backgroundImage,
      };

      if (settingsId) {
        await axios.put(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/home-settings/${settingsId}`,
          updatedSettings
        );
        setSettings(updatedSettings);
        setResetPreview(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "تم تحديث الإعدادات بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`,
          updatedSettings
        );
        setSettings(updatedSettings);
        setSettingsId(res.data.id);
        setResetPreview(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "تم إنشاء الإعدادات بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      setTimeout(() => setResetPreview(false), 100);
    } catch (err) {
      console.error("حدث خطأ أثناء الحفظ:", err);
    }
  };

  return (
    <div className=" py-10 px-4 bg-gray-100 min-h-[calc(100vh-96px)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          إعدادات الصفحة الرئيسية
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <div className="flex justify-center gap-4 max-md:flex-col">
            <div className="flex-1 ">
              <input
                type="text"
                name="mainTitle_ar"
                value={settings.mainTitle_ar}
                onChange={handleChange}
                placeholder="العنوان الرئيسي (عربي)"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <input
                type="text"
                name="subTitle_ar"
                value={settings.subTitle_ar}
                onChange={handleChange}
                placeholder="العنوان الفرعي (عربي)"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="mainTitle_en"
                value={settings.mainTitle_en}
                onChange={handleChange}
                placeholder="Main Title (English)"
                className="w-full p-2 border rounded mb-4"
                dir="ltr"
                required
              />
              <input
                type="text"
                name="subTitle_en"
                value={settings.subTitle_en}
                onChange={handleChange}
                placeholder="Sub Title (English)"
                className="w-full p-2 border rounded"
                dir="ltr"
                required
              />
            </div>
          </div>
          <MyUploader
            onUpload={handleImageUpload}
            resetPreview={resetPreview}
          />
          {settings.backgroundImage && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${
                settings.backgroundImage
              }`}
              alt="صورة الخلفية"
              className="w-full h-48 object-cover mt-2 rounded"
              loading="lazy"
            />
          )}
          <button
            type="submit"
            className="bg-green-600  text-white px-6 py-2 rounded hover:bg-green-500 cursor-pointer"
          >
            حفظ الإعدادات
          </button>
        </form>
      </div>
    </div>
  );
}

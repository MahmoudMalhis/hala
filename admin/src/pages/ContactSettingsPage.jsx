import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MyUploader from "../components/MyUploader";
import { translateText } from "../utils/translate";

export default function ContactSettingsPage() {
  const [contactData, setContactData] = useState({
    address: [{ ar: "", en: "" }],
    instagram: "",
    facebook: "",
    whatsapp: "",
    otherLinks: [{ platform: "", url: "" }],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/contact`)
      .then((res) => {
        if (res.data) setContactData(res.data);
      })
      .catch((err) => {
        console.error("فشل في جلب البيانات", err);
      });
  }, []);

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = async (value, index) => {
    const updated = [...contactData.address];

    // تحديث العربي
    if (value.ar !== undefined) {
      updated[index].ar = value.ar;

      // ترجمة تلقائية
      const translated = await translateText(value.ar);
      updated[index].en = translated;
    }

    // تحديث الإنجليزي (يدوي إذا لزم الأمر)
    if (value.en !== undefined) {
      updated[index].en = value.en;
    }

    setContactData((prev) => ({
      ...prev,
      address: updated,
    }));
  };

  const handleOtherLinksChange = async (index, field, value) => {
    const updated = [...contactData.otherLinks];

    if (field === "platform") {
      if (value.ar !== undefined) {
        updated[index].platform = {
          ...updated[index].platform,
          ar: value.ar,
        };

        const translated = await translateText(value.ar);
        updated[index].platform.en = translated;
      }
      if (value.en !== undefined) {
        updated[index].platform = {
          ...updated[index].platform,
          en: value.en,
        };
      }
    } else {
      updated[index][field] = value;
    }

    setContactData((prev) => ({
      ...prev,
      otherLinks: updated,
    }));
  };

  const addAddress = () => {
    setContactData({
      ...contactData,
      address: [...contactData.address, { ar: "", en: "" }],
    });
  };

  const removeAddress = (index) => {
    const updated = contactData.address.filter((_, i) => i !== index);
    setContactData({ ...contactData, address: updated });
  };

  const addOtherLink = () => {
    setContactData({
      ...contactData,
      otherLinks: [...contactData.otherLinks, { platform: "", url: "" }],
    });
  };

  const removeOtherLink = (index) => {
    const updated = contactData.otherLinks.filter((_, i) => i !== index);
    setContactData({ ...contactData, otherLinks: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تنظيف الحقول الفارغة قبل الإرسال
    const cleanedData = {
      ...contactData,
      address: contactData.address.filter(
        (addr) => addr.ar.trim() !== "" && addr.en.trim() !== ""
      ),
      otherLinks: contactData.otherLinks.filter(
        (link) =>
          link.platform &&
          (link.platform.ar?.trim() !== "" ||
            link.platform.en?.trim() !== "") &&
          link.url?.trim() !== ""
      ),
    };

    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
        cleanedData
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "تم حفظ التعديلات بنجاح",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء الحفظ",
      });
      console.error("❌ Error from server:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" py-10 px-4 bg-gray-100 min-h-[calc(100vh-96px)]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          إعدادات صفحة تواصل معنا
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10 bg-white p-6 rounded shadow-md"
        >
          <label className="font-semibold block mb-2">صورة الخلفية:</label>
          <MyUploader
            onUpload={(imageUrl) =>
              setContactData((prev) => ({ ...prev, backgroundImage: imageUrl }))
            }
            imageURL={contactData.backgroundImage}
          />
          {/* العناوين */}
          <div>
            <label className="font-semibold block mb-2">العناوين:</label>
            {contactData.address.map((addr, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center gap-2 mb-2"
              >
                <input
                  type="text"
                  value={addr.ar}
                  onChange={(e) =>
                    handleAddressChange({ ar: e.target.value }, idx)
                  }
                  className="w-full md:flex-1 border p-2 rounded"
                  placeholder={`العنوان ${idx + 1} بالعربي`}
                />
                <input
                  type="text"
                  value={addr.en}
                  onChange={(e) =>
                    handleAddressChange({ en: e.target.value }, idx)
                  }
                  className="w-full md:flex-1 border p-2 rounded"
                  placeholder={`العنوان ${idx + 1} بالانجليزي`}
                />
                {contactData.address.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddress(idx)}
                    className="mt-2 md:mt-0 bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAddress}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              + إضافة عنوان جديد
            </button>
          </div>

          {/* روابط السوشيال */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="instagram"
              placeholder="رابط انستغرام"
              value={contactData.instagram}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="facebook"
              placeholder="رابط فيسبوك"
              value={contactData.facebook}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="whatsapp"
              placeholder="رابط واتساب"
              value={contactData.whatsapp}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* روابط إضافية */}
          <div>
            <label className="font-semibold block mb-2 mt-4">روابط أخرى:</label>
            {contactData.otherLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col gap-2 mb-2">
                <div>
                  <MyUploader
                    onUpload={(uploadedUrl) =>
                      handleOtherLinksChange(idx, "image", uploadedUrl)
                    }
                    imageURL={link.image}
                    customStyle="flex gap-4 mt-4"
                  />
                </div>
                <div className="flex gap-2 max-md:flex-col">
                  <input
                    type="text"
                    placeholder="اسم المنصة بالعربي(مثلاً تويتر)"
                    value={link.platform?.ar || ""}
                    onChange={(e) =>
                      handleOtherLinksChange(idx, "platform", {
                        ar: e.target.value,
                      })
                    }
                    className="w-full flex-1 md:w-1/3 border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="اسم المنصة بالانجليزي (مثلاً Twitter)"
                    value={link.platform?.en || ""}
                    onChange={(e) =>
                      handleOtherLinksChange(idx, "platform", {
                        en: e.target.value,
                      })
                    }
                    className="w-full md:w-1/3 border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="رابط المنصة"
                    value={link.url}
                    onChange={(e) =>
                      handleOtherLinksChange(idx, "url", e.target.value)
                    }
                    className="w-full md:flex-1 md:w-1/3 border p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherLink(idx)}
                    className="w-fit mt-2 md:mt-0 bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addOtherLink}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              + إضافة رابط جديد
            </button>
          </div>

          {/* زر الحفظ */}
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-400 text-white px-6 py-2 rounded hover:bg-amber-300 cursor-pointer"
          >
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MyUploader from "../components/MyUploader";
import { translateText } from "../utils/translate";

export default function DesignTypesPage() {
  const [designTypes, setDesignTypes] = useState([]);
  const [form, setForm] = useState({
    name_ar: "",
    name_en: "",
    imageURL: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  // جلب القائمة

  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypes() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/design-types`
      );
      setDesignTypes(res.data.reverse());
    } catch (err) {
      console.error("فشل في تحميل الأنواع", err);
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "name_ar") {
      const translated = await translateText(value);
      setForm((prev) => ({ ...prev, name_en: translated }));
    }
  };

  function handleUpload(url) {
    setForm((f) => ({ ...f, imageURL: url }));
  }

  // محو النموذج والـ preview
  function resetForm() {
    setForm({ name_ar: "", name_en: "", imageURL: "" });
    setEditingId(null);
    setUploaderKey((k) => k + 1);
  }

  // إضافة أو تعديل
  async function handleSubmit(e) {
    e.preventDefault();
    const { name_ar, name_en, imageURL } = form;
    if (!name_ar || !name_en || !imageURL) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "يرجى إدخال الاسم بالعربي والإنجليزي وتحميل صورة",
      });
    }
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/design-types/${editingId}`,
          form
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "تمت حفظ التعديلات بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const { data: created } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/design-types`,
          form
        );
        setDesignTypes((prev) => [created, ...prev]);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "تمت الاضافة بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      resetForm();
    } catch (err) {
      console.error("فشل في الحفظ", err);
      Swal.fire("خطأ", "حدث خطأ أثناء الحفظ. حاول مرة أخرى.", "error");
    } finally {
      setLoading(false);
    }
  }

  // تجهيز نموذج التعديل
  function handleEdit(type) {
    setForm({
      name_ar: type.name_ar,
      name_en: type.name_en,
      imageURL: type.imageURL,
    });
    setEditingId(type._id);
    setUploaderKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // حذف النوع
  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "هل أنت متأكد من الحذف؟",
      text: "لن تتمكن من التراجع عن هذه العملية!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفها!",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/design-types/${id}`
      );
      setDesignTypes((prev) => prev.filter((t) => t._id !== id));
      Swal.fire("تم الحذف!", "تم حذف النوع بنجاح.", "success");
    } catch (err) {
      console.error("فشل في الحذف", err);
      Swal.fire("خطأ", "حدث خطأ أثناء الحذف. حاول مرة أخرى.", "error");
    }
  }

  return (
    <div className="py-10 px-4 bg-gray-100 min-h-[calc(100vh-96px)]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">أنواع التصميم</h1>

        {/* نموذج الإضافة/التعديل */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10 bg-white p-6 rounded shadow-md"
        >
          <div className="flex gap-4 max-md:flex-col">
            <input
              type="text"
              name="name_ar"
              placeholder="الاسم بالعربي"
              value={form.name_ar}
              onChange={handleChange}
              className="flex-1 border p-2 rounded"
            />
            <input
              type="text"
              name="name_en"
              placeholder="الاسم بالإنجليزي"
              value={form.name_en}
              onChange={handleChange}
              className="flex-1 border p-2 rounded capitalize"
              dir="ltr"
            />
          </div>
          <MyUploader
            key={uploaderKey}
            onUpload={handleUpload}
            imageURL={form.imageURL}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 cursor-pointer"
            >
              {loading
                ? editingId
                  ? "جارٍ حفظ التعديلات..."
                  : "جارٍ الإضافة..."
                : editingId
                ? "حفظ التعديلات"
                : "إضافة"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-fit bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex-1"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>

        {/* عرض الأنواع */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designTypes.map((type) => (
            <div
              key={type._id}
              className="bg-white p-4 rounded shadow flex flex-col items-center text-center capitalize"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${type.imageURL}`}
                alt={type.name_en}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="font-bold text-lg">{type.name_en}</h2>
              <h3 className="text-gray-600">{type.name_ar}</h3>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded cursor-pointer"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(type._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

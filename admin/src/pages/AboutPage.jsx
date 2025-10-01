import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";
import MyUploader from "../components/MyUploader";
import { useUploader } from "../context/UploaderContext";
import { translateText } from "../utils/translate";

export default function AboutPage() {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    imageURL: "",
    order: "",
  });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const { resetPreview, setResetPreview } = useUploader();

  const fetchSections = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/about-sections`
      );
      setSections(res.data);
    } catch (err) {
      console.error("Error fetching about sections:", err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "title_ar") {
      const translated = await translateText(value);
      setForm((prev) => ({ ...prev, title_en: translated }));
    }

    if (name === "description_ar") {
      const translated = await translateText(value);
      setForm((prev) => ({ ...prev, description_en: translated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/about-sections/${editingId}`,
          form
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/about-sections`,
          form
        );
      }
      setForm({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        imageURL: "",
        order: "",
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "تمت الاضافة بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
      setEditingId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchSections();
      setResetPreview(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "الرجاء تعبئة جميع الحقول",
      });
      console.error("Error submitting form:", err);
    }
  };

  const handleEdit = (section) => {
    setForm({
      title_en: section.title_en,
      title_ar: section.title_ar,
      description_en: section.description_en,
      description_ar: section.description_ar,
      imageURL: section.imageURL || "",
      order: section.order || "",
    });
    setEditingId(section.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        `${import.meta.env.VITE_API_BASE_URL}/api/about-sections/${id}`
      );
      fetchSections();
      Swal.fire("تم الحذف!", "تم حذف النوع بنجاح.", "success");
    } catch (err) {
      console.error("Error deleting section:", err);
      Swal.fire("خطأ", "حدث خطأ أثناء الحذف. حاول مرة أخرى.", "error");
    }
  }

  const handleCancelEdit = () => {
    setForm({
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      imageURL: "",
      order: "",
    });
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (imageURL) => {
    setForm({ ...form, imageURL });
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          اعدادات من نحن
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10 bg-white p-6 rounded shadow-md"
        >
          <MyUploader
            onUpload={handleImageUpload}
            resetPreview={resetPreview}
            imageURL={form.imageURL}
          />
          <div className="flex justify-between gap-4 max-md:flex-col">
            <div className="flex-1 gap-4">
              <input
                type="text"
                name="title_ar"
                placeholder="العنوان بالعربي"
                value={form.title_ar}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                required
              />

              <textarea
                name="description_ar"
                placeholder="الوصف بالعربي"
                value={form.description_ar}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1 gap-4">
              <input
                type="text"
                name="title_en"
                placeholder="العنوان بالانجليزي"
                value={form.title_en}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                dir="ltr"
                required
              />
              <textarea
                name="description_en"
                placeholder="الوصف بالاجليزي"
                value={form.description_en}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                dir="ltr"
                required
              />
            </div>
            <div className="">
              <input
                type="number"
                name="order"
                placeholder="رقم الفقرة (1 مثلا)"
                value={form.order}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="mt-4 w-full h-16">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 cursor-pointer w-full h-full text-xl"
                >
                  {editingId ? "حفظ التعديلات" : "اضافة"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 cursor-pointer flex-1"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4"></div>
          <div className="flex-11/12"></div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white p-4 rounded shadow flex flex-col"
            >
              {section.imageURL ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${
                    section.imageURL
                  }`}
                  alt=""
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h2 className="font-bold text-lg">{section.title_en}</h2>
              <h3 className="text-gray-600">{section.title_ar}</h3>
              <p className="text-sm text-gray-700 mt-2">
                {section.description_en?.slice(0, 100)}...
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(section)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-yellow-400"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-red-400"
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

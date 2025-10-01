import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MyUploader from "../components/MyUploader";
import { useUploader } from "../context/UploaderContext";
import { translateText } from "../utils/translate";
export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [designTypes, setDesignTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedDesignType, setSelectedDesignType] = useState("");
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    roomType: "",
    designType: "",
    album: "",
  });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const { resetPreview, setResetPreview } = useUploader();

  // جلب كل الصور
  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/gallery`
      );
      setImages(res.data);
    } catch (err) {
      console.error("فشل في جلب الصور:", err);
    }
  };

  // جلب أنواع الغرف
  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/room-types`
      );
      setRoomTypes(res.data);
    } catch (err) {
      console.error("فشل في جلب أنواع الغرف:", err);
    }
  };

  // جلب أنواع التصميم
  const fetchDesignTypes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/design-types`
      );
      setDesignTypes(res.data);
    } catch (err) {
      console.error("فشل في جلب أنواع التصميم:", err);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchRoomTypes();
    fetchDesignTypes();
  }, []);

  const handleImageUpload = async (imageURL) => {
    setForm({ ...form, imageURL });
  };

  // حفظ الدفعة في قاعدة البيانات مع batchId
  const handleSubmit = async (e) => {
    e.preventDefault();
    // تحقق من كل الحقول المطلوبة
    const { roomType, designType, imageURL, album } = form;
    if (!roomType || !designType || !imageURL || !album) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "الرجاء تعبئة جميع الحقول",
      });
    }
    try {
      if (editingId) {
        // إذا في editingId نعمل PUT
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/gallery/${editingId}`,
          form
        );
        Swal.fire("تم التعديل!", "تم حفظ التعديلات بنجاح.", "success");
      } else {
        // خلاف ذلك POST
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/gallery`,
          form
        );
      }
      setForm({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        roomType: "",
        designType: "",
        album: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "تمت الاضافة بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchImages();
      setEditingId(null);
      setResetPreview(true);
    } catch (err) {
      console.error("فشل في حفظ الدفعة:", err);
      alert("فشل في حفظ البيانات، حاول مرة أخرى");
    }
  };

  const handleEdit = (img) => {
    setForm({
      title_en: img.title_en || "",
      title_ar: img.title_ar || "",
      description_en: img.description_en || "",
      description_ar: img.description_ar || "",
      imageURL: img.imageURL || "",
      roomType: img.roomType?._id || "",
      designType:
        typeof img.designType === "object"
          ? img.designType._id
          : img.designType || "",
      album: img.album || "",
    });
    setEditingId(img._id);
    setResetPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setForm({
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      imageURL: "",
      roomType: "",
      designType: "",
      album: "",
    });
    setEditingId(null);
    setResetPreview(true);
  };

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
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/gallery/${id}`
      );

      if (response.status === 200) {
        Swal.fire("تم الحذف!", "تم حذف الصورة بنجاح.", "success");
        fetchImages();
      }
    } catch (err) {
      console.error("فشل الحذف:", err);

      if (err.response) {
        if (err.response.status === 404) {
          Swal.fire("خطأ!", "الصورة غير موجودة", "error");
        } else {
          Swal.fire("خطأ!", "حدث خطأ أثناء الحذف", "error");
        }
      } else {
        Swal.fire("خطأ!", "لا يمكن الاتصال بالخادم", "error");
      }
    }
  }

  // تصفية الصور بناءً على نوع الغرفة ونوع التصميم
  const filteredImages = images.filter((img) => {
    const matchesRoomType = selectedRoomType
      ? img.roomType?._id === selectedRoomType
      : true;
    const matchesDesignType = selectedDesignType
      ? img.designType?._id === selectedDesignType
      : true;

    return matchesRoomType && matchesDesignType;
  });

  // تنظيم الصور حسب الألبوم
  const imagesByAlbum = filteredImages.reduce((acc, img) => {
    if (!acc[img.album]) {
      acc[img.album] = [];
    }
    acc[img.album].push(img);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          معرض الصور
        </h1>
        <div className="flex md:gap-4 max-md:flex-col ">
          {/* فلترة بحسب نوع الغرفة */}
          <div className="mb-8">
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">كل الأنواع</option>
              {roomTypes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name_ar}
                </option>
              ))}
            </select>
          </div>

          {/* فلترة بحسب نوع التصميم */}
          <div className="mb-6">
            <select
              value={selectedDesignType}
              onChange={(e) => setSelectedDesignType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">اختر نوع التصميم</option>
              {designTypes.map((dt) => (
                <option key={dt._id} value={dt._id}>
                  {dt.name_ar}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-12 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm"
        >
          {/* اختر نوع التصميم */}
          <div className="flex justify-between gap-4 max-md:flex-col">
            <select
              name="designType"
              value={form.designType}
              onChange={(e) => setForm({ ...form, designType: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر نوع التصميم</option>
              {designTypes.map((dt) => (
                <option key={dt._id} value={dt._id}>
                  {dt.name_ar}
                </option>
              ))}
            </select>

            {/* اختر نوع الغرفة */}

            <select
              value={form.roomType}
              onChange={(e) =>
                setForm((p) => ({ ...p, roomType: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر نوع الغرفة</option>
              {roomTypes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name_ar}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="album"
              placeholder="اضف اسم الالبوم"
              value={form.album}
              onChange={(e) => setForm({ ...form, album: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-center gap-4 max-md:flex-col">
            <div className="flex-1">
              <input
                type="text"
                name="title_ar"
                placeholder="العنوان بالعربي"
                value={form.title_ar}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              />
              <textarea
                name="description_ar"
                placeholder="الوصف بالعربي"
                value={form.description_ar}
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="title_en"
                placeholder="العنوان بالإنجليزي"
                value={form.title_en}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4 "
              />
              <textarea
                name="description_en"
                placeholder="الوصف بالإنجليزي"
                value={form.description_en}
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <MyUploader
            onUpload={handleImageUpload}
            resetPreview={resetPreview}
            imageURL={form.imageURL}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 cursor-pointer"
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
        </form>

        {/* عرض الصور */}
        <div className="space-y-6">
          {Object.keys(imagesByAlbum).map((album) => (
            <div key={album}>
              <h2 className="text-2xl font-bold mb-4">{album}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {imagesByAlbum[album].map((img) => (
                  <div
                    key={img._id}
                    className="bg-white rounded shadow overflow-hidden flex flex-col"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${
                        img.imageURL
                      }`}
                      alt="room"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-3 text-sm flex justify-between items-center">
                      <span>
                        {img.roomType?.name_ar ||
                          roomTypes.find((r) => r._id === img.roomType)
                            ?.name_ar ||
                          "غير معروف"}{" "}
                        -{" "}
                        {img.designType?.name_ar ||
                          designTypes.find((r) => r._id === img.designType)
                            ?.name_ar ||
                          "غير معروف"}
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(img)}
                          className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(img._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

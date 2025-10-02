import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MyUploader from "../components/MyUploader";
import { useUploader } from "../context/UploaderContext";
import { translateText } from "../utils/translate";

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ name_en: "", name_ar: "", imageURL: "" });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const { resetPreview, setResetPreview } = useUploader();

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/room-types`
      );
      setRoomTypes(res.data);
    } catch (err) {
      console.error("Error fetching room types:", err);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "name_ar") {
      const translated = await translateText(value);
      setForm((prev) => ({ ...prev, name_en: translated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name_ar || !form.name_en || !form.imageURL) {
        throw new Error("يرجى تعبئة جميع الحقول");
      }

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/room-types/${editingId}`,
          form
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/room-types`,
          form
        );
      }
      setForm({ name_en: "", name_ar: "", imageURL: "" });
      setEditingId(null);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "تمت الاضافة بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchRoomTypes();
      setResetPreview(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "يرجى تعبئة جميع الحقول",
      });
      console.log(err);
    }
  };

  const handleEdit = (room) => {
    setForm({
      name_en: room.name_en,
      name_ar: room.name_ar,
      imageURL: room.imageURL,
    });
    setEditingId(room.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setForm({ name_en: "", name_ar: "", imageURL: "" });
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (imageURL) => {
    setForm({ ...form, imageURL });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد من الحذف؟",
      text: "لن تتمكن من التراجع عن هذه العملية!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفها!",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/room-types/${id}`
        );
        Swal.fire("تم الحذف!", "تم حذف النوع بنجاح.", "success");
        fetchRoomTypes();
      } catch (err) {
        console.error("Error deleting:", err);
        Swal.fire("خطأ", "حدث خطأ أثناء الحذف. حاول مرة أخرى.", "error");
      }
    }
  };

  return (
    <div className="py-10 px-4 bg-gray-100 min-h-[calc(100vh-96px)]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          أنواع الغرف
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10 bg-white p-6 rounded shadow-md"
        >
          <div className="flex justify-between gap-4 max-md:flex-col">
            <input
              type="text"
              name="name_ar"
              placeholder="الاسم بالعربي"
              value={form.name_ar}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="name_en"
              placeholder="Name (EN)"
              value={form.name_en}
              onChange={handleChange}
              className="w-full p-2 border rounded capitalize"
              dir="ltr"
              required
            />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((room) => (
            <div
              key={room.id}
              className="bg-white p-4 rounded shadow flex flex-col items-center text-center capitalize"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${room.imageURL}`}
                alt="Room"
                className="w-full h-40 object-cover rounded mb-3"
                loading="lazy"
              />
              <h2 className="font-bold text-lg">{room.name_en}</h2>
              <h3 className="text-gray-600">{room.name_ar}</h3>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded cursor-pointer"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
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

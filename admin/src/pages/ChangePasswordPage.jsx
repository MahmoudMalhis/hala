import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("تم تغيير كلمة المرور بنجاح!");
      setError("");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        // بعد التغيير، يطلب إعادة تسجيل الدخول
        localStorage.removeItem("token");
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "فشل التغيير");
      setSuccess("");
    }
  };

  return (
    <div className="py-10 px-4 bg-gray-100 min-h-[calc(100vh-96px)] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          تغيير كلمة المرور
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <input
          type="password"
          name="currentPassword"
          placeholder="كلمة المرور الحالية"
          value={form.currentPassword}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="كلمة المرور الجديدة"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-400 text-white py-2 rounded hover:bg-amber-300 cursor-pointer"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}

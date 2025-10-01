import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="البريد الإلكتروني"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-amber-300 text-white py-2 rounded hover:bg-amber-200 hover:text-amber-600 cursor-pointer"
        >
          دخول
        </button>
      </form>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "إعدادات الصفحة الرئيسية" },
  { to: "/room-types", label: "أنواع الغرف" },
  { to: "/design-types", label: "أنواع التصميم" },
  { to: "/gallery", label: "معرض الصور" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "معلومات الاتصال" },
];

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`w-64 h-screen bg-white border-l border-gray-200 p-6 fixed right-0 top-0 shadow-sm text-right   transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
    >
      <h2 className="text-2xl font-extrabold text-amber-300 mb-10 tracking-tight">
        Hala Design
      </h2>
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "block bg-amber-300 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                : "block text-gray-600 hover:bg-amber-100 hover:text-amber-600 px-4 py-2 rounded-lg transition duration-200"
            }
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <div className="pt-6 border-t mt-6 space-y-2">
          <button
            onClick={() => {
              navigate("/login");
              localStorage.removeItem("token");
              setMenuOpen(false);
            }}
            className="block text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition duration-200 w-full text-right cursor-pointer"
          >
            تسجيل خروج
          </button>

          <NavLink
            to="/change-password"
            className={({ isActive }) =>
              isActive
                ? "block bg-amber-300 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                : "block text-gray-600 hover:bg-amber-100 hover:text-amber-600 px-4 py-2 rounded-lg transition duration-200"
            }
            onClick={() => setMenuOpen(false)}
          >
            تغيير كلمة المرور
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

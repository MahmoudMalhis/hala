import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="mt-16 p-4 text-start md:w-[calc(100%-256px)] mr-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

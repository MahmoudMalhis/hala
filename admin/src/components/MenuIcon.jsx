import { useState } from "react";
import Sidebar from "./Sidebar";

export default function MenuIcon() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(true)}
          className="md:invisible text-black z-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 md:hidden"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 8.25H4.5V6.75H19.5V8.25Z"
                fill="#080341"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 12.75H4.5V11.25H19.5V12.75Z"
                fill="#080341"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 17.25H4.5V15.75H19.5V17.25Z"
                fill="#080341"
              ></path>
            </g>
          </svg>
        </button>
      </div>
      <div
        className={`fixed inset-0  bg-opacity-30 z-40 transition-opacity duration-300
          ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* wrapper المتحرّك */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 left-4 text-2xl font-bold z-50"
        >
          ×
        </button>
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </>
  );
}

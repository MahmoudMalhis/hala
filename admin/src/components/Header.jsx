import MenuIcon from "./MenuIcon";

export default function Header() {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-8 fixed top-0 md:right-64 left-0 max-md:w-full z-10">
      <MenuIcon />
      <img src="logo1.png" className=" w-24" />
    </header>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/contact`
        );
        setContactInfo(res.data);
      } catch (err) {
        console.log("Failed to fetch", err);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container flex justify-between items-center m-auto md:flex-row flex-col-reverse gap-4">
        <div>
          &copy; {new Date().getFullYear()} Hala Design. All rights reserved.
        </div>
        <div className="flex gap-2.5">
          <SocialLinks links={contactInfo} layout="row" />
        </div>
      </div>
    </footer>
  );
}

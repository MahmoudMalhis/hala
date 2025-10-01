import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import Gallery from "../pages/Gallery";
import DesignTypePage from "../DesignTypePage";
import ScrollToTop from "../ScrollToTop";

export default function Index() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/designs-type" element={<DesignTypePage />} />
          <Route path="/designs/:id" element={<DesignTypePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

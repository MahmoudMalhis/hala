import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Gallery = lazy(() => import("../pages/Gallery"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const DesignTypePage = lazy(() => import("../DesignTypePage"));
import ScrollToTop from "../ScrollToTop";
import NotFound from "../pages/NotFound";

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-300"></div>
  </div>
);

export default function Index() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/designs-type" element={<DesignTypePage />} />
            <Route path="/designs/:id" element={<DesignTypePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

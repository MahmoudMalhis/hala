// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import LoginPage from "../pages/LoginPage";
import HomeSettingsPage from "../pages/HomeSettingsPage";
import GalleryPage from "../pages/GalleryPage";
import AboutPage from "../pages/AboutPage";
import ContactSettingsPage from "../pages/ContactSettingsPage";
import RoomTypesPage from "../pages/RoomTypesPage";
import DesignTypesPage from "../pages/DesignTypesPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Index() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomeSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room-types"
            element={
              <ProtectedRoute>
                <RoomTypesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/design-types"
            element={
              <ProtectedRoute>
                <DesignTypesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

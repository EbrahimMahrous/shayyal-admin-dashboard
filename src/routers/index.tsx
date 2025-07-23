// Routers.tsx
import { Route, Routes } from "react-router-dom";
// LandingPages Components
import LandingPageLayout from "../Layout/LandingPageLayout";
import Home from "../pages/LandingPages/Home";
import AboutUs from "../pages/LandingPages/AboutUs";
import Features from "../pages/LandingPages/Features";
import HowItWorks from "../pages/LandingPages/HowItWorks";
import FuturePlans from "../pages/LandingPages/FuturePlans";
import IsAdmin from "../pages/IsAdmin";
// AdminPages Components
import AdminLayout from "../Layout/AdminLayout";
import Profile from "../pages/AdminPages/Profile";
import HomeAdmin from "../pages/AdminPages/HomeAdmin";
import Roles from "../pages/AdminPages/Roles";
import Admins from "../pages/AdminPages/Admins";
import Payments from "../pages/AdminPages/Payments";
import Settings from "../pages/AdminPages/Settings";
import Pages from "../pages/AdminPages/Pages";
import Customers from "../pages/HomeAdmin/Customers";
import Drivers from "../pages/HomeAdmin/Drivers";
import Orders from "../pages/HomeAdmin/Orders";
import Items from "../pages/HomeAdmin/Items";
// Auth
import LogIn from "../pages/Auth/Login";
// Protected
import ProtectedRoute from "../components/ProtectedRoute";

export default function Routers() {
  return (
    <Routes>
      {/* Public Landing Pages */}
      <Route path="/" element={<LandingPageLayout />}>
        <Route index element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="features" element={<Features />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="future-plans" element={<FuturePlans />} />
        <Route path="is-admin" element={<IsAdmin />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LogIn />} />

      {/* Protected Admin Pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="admins"
          element={
            <ProtectedRoute>
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="pages"
          element={
            <ProtectedRoute>
              <Pages />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Subpages */}
        <Route
          path="customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="drivers"
          element={
            <ProtectedRoute>
              <Drivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

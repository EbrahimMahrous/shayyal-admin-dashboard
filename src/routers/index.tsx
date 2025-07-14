import { Route, Routes } from "react-router-dom";
// ** LandingPages Components
import LandingPageLayout from "../Layout/LandingPageLayout";
import Home from "../pages/LandingPages/Home";
import AboutUs from "../pages/LandingPages/AboutUs";
import Features from "../pages/LandingPages/Features";
import HowItWorks from "../pages/LandingPages/HowItWorks";
import FuturePlans from "../pages/LandingPages/FuturePlans";
import IsAdmin from "../pages/IsAdmin";
// ** AdminPages Components
import AdminLayout from "../Layout/AdminLayout";
import Profile from "../pages/AdminPages/Profile";
import HomeAdmin from "../pages/AdminPages/HomeAdmin";
import Statistics from "../pages/AdminPages/Statistics";
import OrdersManagement from "../pages/AdminPages/OrdersManagement";
import ServiceProviders from "../pages/AdminPages/ServiceProviders";
// ** ProtectedRoute
import ProtectedRoute from "../components/ProtectedRoute";
import LogIn from "../pages/Auth/Login";
import Roles from "../pages/AdminPages/Roles";

export default function Routers() {
  return (
    <>
      <Routes>
        {/* LandingPage layout */}
        <Route path="/" element={<LandingPageLayout />}>
          <Route index element={<Home />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="features" element={<Features />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="future-plans" element={<FuturePlans />} />
          <Route path="is-admin" element={<IsAdmin />} />
        </Route>
        {/* Login */}
        <Route path="/login" element={<LogIn />} />
        {/* AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <HomeAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="statistics" element={<Statistics />} />
          <Route path="orders-management" element={<OrdersManagement />} />
          <Route path="service-providers" element={<ServiceProviders />} />
          <Route path="roles" element={<Roles />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

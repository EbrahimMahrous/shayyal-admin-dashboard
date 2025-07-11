// ** Styles
import style from "../styles/Layout/AdminLayout.module.css";
// ** Assets
import mainIcon from "../assets/Pages/home.png";
import statistics from "../assets/Pages/pie-chart.png";
import manageOrder from "../assets/Pages/manage-order.png";
import servicesProvider from "../assets/Pages/service-providor.png";
import backHome from "../assets/Pages/back.png";
// import logo from "../assets/Pages/shayyalLogo.png";
import profile from "../assets/Pages/profile.jpg";
// ** Hooks
import { Outlet, useNavigate, useLocation } from "react-router-dom";
// ** Auth
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className={style.adminLayout}>
      <div className={style.adminLayout_container}>
        {/* <div className={style.logo_shayyall_container}>
          <img className={style.logo_shayyall} src={logo} alt="logo" />
        </div> */}
        <div
          className={style.adminInfo}
          onClick={() => navigate("/admin/profile")}
        >
          <img src={profile} alt="" />
          <h2>
            مرحبًا <br />
            {localStorage.getItem("admin_name")}
          </h2>
          {/* <p>{localStorage.getItem("admin_email")}</p> */}
        </div>
        <div className={style.adminLayout_content}>
          <div
            onClick={() => navigate("/admin")}
            className={isActive("/admin") ? style.active : ""}
          >
            <img src={mainIcon} alt="main-icon" />
            <p>الرئيسية</p>
          </div>

          <div
            onClick={() => navigate("/admin/statistics")}
            className={isActive("/admin/statistics") ? style.active : ""}
          >
            <img src={statistics} alt="statistics-icon" />
            <p>إحصائيات</p>
          </div>

          <div
            onClick={() => navigate("/admin/orders-management")}
            className={isActive("/admin/orders-management") ? style.active : ""}
          >
            <img src={manageOrder} alt="manage-order" />
            <p>إدارة الطلبات</p>
          </div>

          <div
            onClick={() => navigate("/admin/service-providers")}
            className={isActive("/admin/service-providers") ? style.active : ""}
          >
            <img src={servicesProvider} alt="services-provider" />
            <p>مزودي الخدمة</p>
          </div>

          <div onClick={handleLogout}>
            <img src={backHome} alt="back-home" />
            <p>تسجيل خروج</p>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

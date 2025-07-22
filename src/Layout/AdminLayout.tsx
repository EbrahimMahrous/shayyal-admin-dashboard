// ** Styles
import style from "../styles/Layout/AdminLayout.module.css";
// ** Assets
import mainIcon from "../assets/Pages/home.svg";
import roles from "../assets/Pages/roles.svg";
import logOut from "../assets/Pages/logout.svg";
import manageAdmins from "../assets/Pages/management-admins.svg";
import payment from "../assets/Pages/payment.svg";
import settings from "../assets/Pages/settings.svg";
import pages from "../assets/Pages/pages.svg";
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
        <div
          className={style.adminInfo}
          onClick={() => navigate("/admin/profile")}
        >
          <h2>
            اهلا بيك <br />
            {localStorage.getItem("admin_name")}
          </h2>
        </div>
        <div className={style.adminLayout_content}>
          <div
            onClick={() => navigate("/admin")}
            className={isActive("/admin") ? style.active : ""}
          >
            <img src={mainIcon} alt="home-icon" />
            <p>الرئيسية</p>
          </div>
          <div
            onClick={() => navigate("/admin/roles")}
            className={isActive("/admin/roles") ? style.active : ""}
          >
            <img src={roles} alt="roles-icon" />
            <p>إدارة الأدوار</p>
          </div>
          <div
            onClick={() => navigate("/admin/admins")}
            className={isActive("/admin/admins") ? style.active : ""}
          >
            <img src={manageAdmins} alt="manageAdmins-icon" />
            <p>إدارة المشرفين</p>
          </div>

          <div
            onClick={() => navigate("/admin/payment")}
            className={isActive("/admin/payment") ? style.active : ""}
          >
            <img src={payment} alt="payment-icon" />
            <p>المدفوعات</p>
          </div>

          <div
            onClick={() => navigate("/admin/pages")}
            className={isActive("/admin/pages") ? style.active : ""}
          >
            <img src={pages} alt="pages-icon" />
            <p>اداره الصفحات</p>
          </div>
          <div
            onClick={() => navigate("/admin/settings")}
            className={isActive("/admin/settings") ? style.active : ""}
          >
            <img src={settings} alt="settings-icon" />
            <p>الاعدادات</p>
          </div>
          <div onClick={handleLogout}>
            <img src={logOut} alt="logout-home" />
            <p>تسجيل خروج</p>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

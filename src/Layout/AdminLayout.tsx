// ** Styles
import style from "../styles/Layout/AdminLayout.module.css";
// ** Assets
import profile from "../assets/Pages/user.png";
import mainIcon from "../assets/Pages/home.svg";
import statistics from "../assets/Pages/stats.svg";
import roles from "../assets/Pages/roles.svg";
import backHome from "../assets/Pages/logout.svg";
import manageAdmins from "../assets/Pages/management-admins.svg";
// import logo from "../assets/Pages/shayyalLogo.png";
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
            كيفك <br />
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

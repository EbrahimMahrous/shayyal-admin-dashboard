// ** Styles
import styles from "../../styles/Pages/Admin/HomeAdmin.module.css";
// ** Assets
// ** Hooks
import { useState } from "react";

export default function HomeAdmin() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const toggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.heading}>مرحباً بك في لوحة التحكم</h1>
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <h2>الطلبات</h2>
          <p>134</p>
        </div>
        <div className={styles.card}>
          <h2>المستخدمين</h2>
          <p>76</p>
        </div>
        <div className={styles.card}>
          <h2>مقدمو الخدمة</h2>
          <p>25</p>
        </div>
        <div className={styles.card}>
          <h2>إجمالي المبيعات (ر.س)</h2>
          <p>13,500</p>
        </div>
      </div>
      <div className={styles.actionsSection}>
        <h3 className={styles.subheading}>إجراءات سريعة</h3>
        <div className={styles.actionsGrid}>
          <button className={styles.actionBtn}>إدارة المستخدمين</button>
          <button className={styles.actionBtn}>إدارة الطلبات</button>
          <button className={styles.actionBtn}>إدارة مقدمي الخدمة</button>
          <button
            className={`${styles.actionBtn} ${
              maintenanceMode ? styles.active : ""
            }`}
            onClick={toggleMaintenance}
          >
            {maintenanceMode ? "إيقاف وضع الصيانة" : "تفعيل وضع الصيانة"}
          </button>
        </div>
      </div>
    </div>
  );
}

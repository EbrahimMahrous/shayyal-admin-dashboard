// ** Style
import styles from "../../styles/Pages/LandingPage/Home.module.css";
// ** Hooks
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.hero}>
        <h1>مرحبًا بك في لوحة تحكم شيّال</h1>
        <p>
          تابع أداء النظام، راقب الطلبات، وتحكم بإدارة الزبائن ومزودي الخدمة
          بسهولة. لوحة تحكم "شيّال" تتيح لك <br />
          إدارة الطلبات والحجوزات وتفعيل وضع الصيانة.
        </p>
        <button className={styles.goButton} onClick={handleClick}>
          الدخول إلى لوحة الإدارة
        </button>
      </header>
    </div>
  );
}

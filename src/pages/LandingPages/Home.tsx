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
        <h1>مرحبًا بك في لوحة تحكم OTM</h1>
        <p>
          منصة <strong>OTM</strong> تمكّنك من متابعة الطلبات، مراقبة الأداء، وإدارة عمليات النقل بكفاءة وسرعة.
          <br />
          تحكّم كامل في العملاء والسائقين، وفّع وضع الصيانة، واطّلع على الإحصائيات لحظة بلحظة.
        </p>
        <button className={styles.goButton} onClick={handleClick}>
          الدخول إلى لوحة الإدارة
        </button>
      </header>
    </div>
  );
}

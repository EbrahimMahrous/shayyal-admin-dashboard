// ** Styles
import styles from "../../styles/Auth/Login.module.css";
// ** Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://otmove.online/api/v1/dashboard/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const token = data.token;
        const { name, email } = data.admin;

        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_name", name);
        localStorage.setItem("admin_email", email);
        login();
        navigate("/admin");
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("حدث خطأ أثناء محاولة تسجيل الدخول");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}

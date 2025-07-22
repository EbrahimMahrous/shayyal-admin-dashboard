import { useEffect, useState } from "react";
import styles from "../../styles/Pages/Admin/Profile.module.css";

type Employee = {
  id: number;
  name: string;
  email: string;
};

export default function Profile() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("admin_name") || "";
    const storedEmail = localStorage.getItem("admin_email") || "";
    setEmployee({ id: 4, name: storedName, email: storedEmail });
    setName(storedName);
    setEmail(storedEmail);
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(
        "https://otmove.online/api/v1/dashboard/edit_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.admin_token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("✅ تم تحديث البيانات بنجاح");
        localStorage.setItem("admin_name", name);
        localStorage.setItem("admin_email", email);
      }
    } catch (err) {
      console.error(err);
      setMessage("حدث خطأ أثناء التحديث");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const res = await fetch(
        "https://otmove.online/api/v1/dashboard/edit_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.admin_token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("✅ تم تحديث كلمة المرور بنجاح");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage("حدث خطأ أثناء تحديث كلمة المرور");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>الملف الشخصي</h2>

      <div className={styles.card}>
        <h3>تعديل البيانات</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
        />
        <button onClick={handleProfileUpdate}>تحديث البيانات</button>
      </div>

      <div className={styles.card}>
        <h3>تغيير كلمة المرور</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور الجديدة"
        />
        <button onClick={handlePasswordUpdate}>تحديث كلمة المرور</button>
      </div>

      {message && <div className={styles.success}>{message}</div>}
    </div>
  );
}

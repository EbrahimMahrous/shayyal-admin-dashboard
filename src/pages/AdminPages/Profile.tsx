import { useEffect, useState } from "react";
import styles from "../../styles/Pages/Admin/Profile.module.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("admin_name") || "";
    const storedEmail = localStorage.getItem("admin_email") || "";
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
        localStorage.setItem("admin_name", name);
        localStorage.setItem("admin_email", email);
        toast.success(" تم تحديث البيانات بنجاح");
      } else {
        toast.error(" حدث خطأ أثناء التحديث");
      }
    } catch (err) {
      console.error(err);
      toast.error(" حدث خطأ أثناء التحديث");
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(" تأكيد كلمة المرور غير متطابق");
      return;
    }

    const confirm = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم تغيير كلمة المرور الخاصة بك",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، غيّرها",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          "https://otmove.online/api/v1/dashboard/edit_password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.admin_token}`,
            },
            body: JSON.stringify({
              old_password: oldPassword,
              password: newPassword,
              password_confirmation: confirmPassword,
            }),
          }
        );

        const data = await res.json();
        if (data.success) {
          toast.success(" تم تحديث كلمة المرور بنجاح");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(" حدث خطأ أثناء تحديث كلمة المرور");
        }
      } catch (err) {
        console.error(err);
        toast.error(" حدث خطأ أثناء تحديث كلمة المرور");
      }
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>تحديث الملف الشخصي</h2>

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
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="كلمة المرور الحالية"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="كلمة المرور الجديدة"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تأكيد كلمة المرور الجديدة"
        />
        <button onClick={handlePasswordUpdate}>تحديث كلمة المرور</button>
      </div>
    </div>
  );
}

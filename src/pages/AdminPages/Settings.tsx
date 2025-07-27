import { useEffect, useState } from "react";
import styles from "../../styles/Pages/Admin/settings.module.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

type SettingsData = {
  whatsapp: string;
  x: string;
  facebook: string;
  tiktok: string;
  phone: string;
  email: string;
  shayyal_tax: string;
};

export default function Settings() {
  const [form, setForm] = useState<SettingsData>({
    whatsapp: "",
    x: "",
    facebook: "",
    tiktok: "",
    phone: "",
    email: "",
    shayyal_tax: "",
  });

  useEffect(() => {
    fetch("https://otmove.online/api/v1/dashboard/settings", {
      headers: {
        Authorization: `Bearer ${localStorage.admin_token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.setting) {
          setForm(json.setting);
        } else {
          toast.error(" فشل تحميل الإعدادات");
        }
      })
      .catch(() => toast.error(" فشل تحميل الإعدادات"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://otmove.online/api/v1/dashboard/edit_settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.admin_token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "تم الحفظ",
          text: " تم حفظ الإعدادات بنجاح",
          confirmButtonText: "حسنًا",
          customClass: {
            popup: styles.swal_popup,
            title: styles.swal_title,
            confirmButton: styles.swal_confirm_btn,
            cancelButton: styles.swal_cancel_btn,
          },
        });
      } else {
        toast.error(" حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error(err);
      toast.error(" حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2 className={styles.title}>تحديث اعدادات النظام</h2>

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>واتساب</label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>فيسبوك</label>
          <input
            type="text"
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>X (تويتر سابقًا)</label>
          <input
            type="text"
            value={form.x}
            onChange={(e) => setForm({ ...form, x: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>تيك توك</label>
          <input
            type="text"
            value={form.tiktok}
            onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>رقم الهاتف</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>نسبة ضريبة شَيَّال</label>
          <input
            type="number"
            step="0.00001"
            value={form.shayyal_tax}
            onChange={(e) => setForm({ ...form, shayyal_tax: e.target.value })}
          />
        </div>
      </div>

      <button className={styles.button} type="submit">
        حفظ الإعدادات
      </button>
    </form>
  );
}

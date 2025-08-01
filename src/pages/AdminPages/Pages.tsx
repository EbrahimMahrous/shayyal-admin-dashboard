import { useEffect, useState } from "react";
import styles from "../../styles/Pages/Admin/Pages.module.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

type Pages = {
  who_are_we: string;
  privacy_policy: string;
  terms_and_conditions: string;
};

type PageKey = "who_are_we" | "privacy_policy" | "terms_and_conditions";

const tabLabels: Record<PageKey, string> = {
  who_are_we: "من نحن",
  privacy_policy: "سياسة الخصوصية",
  terms_and_conditions: "الشروط والأحكام",
};

export default function Pages() {
  const [form, setForm] = useState<Pages>({
    who_are_we: "",
    privacy_policy: "",
    terms_and_conditions: "",
  });

  const [activeTab, setActiveTab] = useState<PageKey>("who_are_we");

  useEffect(() => {
    fetch("https://otmove.online/api/v1/dashboard/pages", {
      headers: { Authorization: `Bearer ${localStorage.admin_token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setForm(json.page);
        } else {
          toast.error(" فشل تحميل البيانات");
        }
      })
      .catch(() => {
        toast.error(" فشل تحميل البيانات");
      });
  }, []);

  const handleChange = (value: string) => {
    setForm((prev) => ({ ...prev, [activeTab]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://otmove.online/api/v1/dashboard/edit_pages",
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
          text: " تم حفظ محتوى الصفحة بنجاح",
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
      <h2 className={styles.title}>إدارة محتوى الصفحات</h2>

      {/* Tabs Navigation */}
      <div className={styles.tabs}>
        {(Object.keys(tabLabels) as PageKey[]).map((key) => (
          <button
            type="button"
            key={key}
            className={`${styles.tab} ${
              activeTab === key ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(key)}
          >
            {tabLabels[key]}
          </button>
        ))}
      </div>

      {/* Textarea for active tab */}
      <div className={styles.textareaGroup}>
        <label>{tabLabels[activeTab]}</label>
        <textarea
          value={form[activeTab]}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      <button className={styles.button} type="submit">
        حفظ التغييرات
      </button>
    </form>
  );
}

import { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import styles from "../../styles/Components/Modal.module.css";

type Admin = {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
};

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: 1,
  });

  const token = localStorage.getItem("admin_token");

  const fetchAdmins = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/admins", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setAdmins(data.admins.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleShow = async (id: number) => {
    const res = await fetch(
      `https://otmove.online/api/v1/dashboard/admins/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) {
      setSelectedAdmin(data.admin);
      setShowDetailsModal(true);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: 1,
    });
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (admin: Admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      password_confirmation: "",
      role_id: 1,
    });
    setSelectedAdmin(admin);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = (admin: Admin) => {
    Swal.fire({
      title: `هل أنت متأكد من حذف ${admin.name}؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: styles.swal_popup,
        title: styles.swal_title,
        confirmButton: styles.swal_confirm_btn,
        cancelButton: styles.swal_cancel_btn,
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://otmove.online/api/v1/dashboard/admins/${admin.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("تم حذف المشرف بنجاح.");
          fetchAdmins();
        } else {
          toast.error(`فشل الحذف! ${data.message || "حدث خطأ"}`);
        }
      }
    });
  };

  const handleStatusToggle = async (
    id: number,
    currentStatus: string | number
  ) => {
    const newStatus = currentStatus == "1" ? "0" : "1";

    const res = await fetch(
      `https://otmove.online/api/v1/dashboard/admins/change_status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (res.ok) {
      await fetchAdmins();
      toast.success("تم تغيير الحالة بنجاح");
    } else {
      toast.error("فشل تغيير الحالة");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isEditing
      ? `https://otmove.online/api/v1/dashboard/admins/${selectedAdmin?.id}`
      : "https://otmove.online/api/v1/dashboard/admins";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: isEditing ? "تم التحديث بنجاح" : "تم إنشاء المشرف بنجاح",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: styles.swal_popup,
            title: styles.swal_title,
            confirmButton: styles.swal_confirm_btn,
            cancelButton: styles.swal_cancel_btn,
          },
        });
        setShowFormModal(false);
        fetchAdmins();
      } else {
        toast.error(data.message || "فشل العملية!");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>إدارة المشرفين</h2>
        <button className={styles.addButton} onClick={handleCreate}>
          إضافة مشرف
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>البريد</th>
            <th>الحالة</th>
            <th>تاريخ الإنشاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, i) => (
            <tr key={admin.id}>
              <td>{i + 1}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                <button
                  onClick={() => handleStatusToggle(admin.id, admin.status)}
                >
                  {String(admin.status) === "1" ? (
                    <FaToggleOn color="green" />
                  ) : (
                    <FaToggleOff color="gray" />
                  )}
                </button>
              </td>
              <td>{new Date(admin.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleShow(admin.id)}>
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(admin)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(admin)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{isEditing ? "تعديل مشرف" : "إضافة مشرف"}</h3>
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              <input
                type="text"
                placeholder="اسم المشرف"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {!isEditing && (
                <>
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password_confirmation: e.target.value,
                      })
                    }
                    required
                  />
                </>
              )}
              <select
                className={styles.roleSelect}
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role_id: parseInt(e.target.value),
                  })
                }
              >
                <option value={1}>أدمن</option>
                <option value={2}>مشرف</option>
              </select>

              <button type="submit">{isEditing ? "تحديث" : "إضافة"}</button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowFormModal(false)}
              >
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}
      {showDetailsModal && selectedAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل المشرف</h3>
            <p>
              <strong>الاسم:</strong> {selectedAdmin.name}
            </p>
            <p>
              <strong>البريد:</strong> {selectedAdmin.email}
            </p>
            <p>
              <strong>الحالة:</strong>{" "}
              {selectedAdmin.status === "1" ? "نشط" : "غير نشط"}
            </p>
            <p>
              <strong>تاريخ الإنشاء:</strong>{" "}
              {new Date(selectedAdmin.created_at).toLocaleDateString()}
            </p>
            <button
              onClick={() => setShowDetailsModal(false)}
              className={styles.cancelButton}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;

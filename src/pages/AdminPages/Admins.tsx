import { useEffect, useState, type SetStateAction } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import styles from "../../styles/Pages/Admin/Admins.module.css";

type Admin = {
  id: number | string;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const handleShow = async (id: string | number) => {
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
    setFormData({ name: "", email: "" });
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (admin: Admin) => {
    if (!admin) return;
    setFormData({ name: admin.name, email: admin.email });
    setSelectedAdmin(admin);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = (admin: SetStateAction<Admin | null>) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/admins/${selectedAdmin.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setShowDeleteModal(false);
    fetchAdmins();
  };

  const handleStatusToggle = async (id: string | number) => {
    await fetch(
      `https://otmove.online/api/v1/dashboard/admins/change_status/${id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchAdmins();
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = isEditing
      ? selectedAdmin
        ? `https://otmove.online/api/v1/dashboard/admins/${selectedAdmin.id}`
        : ""
      : "https://otmove.online/api/v1/dashboard/admins";
    if (isEditing && !selectedAdmin) return;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setShowFormModal(false);
    fetchAdmins();
  };

  return (
    <div className={styles.adminsContainer}>
      <div className={styles.header}>
        <h2>إدارة المشرفين</h2>
        <button className={styles.addButton} onClick={handleCreate}>
          إضافة مشرف
        </button>
      </div>

      <table className={styles.adminsTable}>
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
                <button onClick={() => handleStatusToggle(admin.id)}>
                  {admin.status === "1" ? (
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

      {/* Form Modal */}
      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
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

      {/* Details Modal */}
      {showDetailsModal && selectedAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>هل أنت متأكد من حذف هذا المشرف؟</h3>
            <p>
              الاسم: <strong>{selectedAdmin.name}</strong>
            </p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.confirmButton}>
                حذف
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;

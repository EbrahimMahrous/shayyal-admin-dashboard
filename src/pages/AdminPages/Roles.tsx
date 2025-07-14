// Roles.tsx
import styles from "../../styles/Pages/Admin/Roles.module.css";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface Role {
  id: number;
  name: string;
  display_name: string | null;
  description: string | null;
  created_at: string;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: "", display_name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const token = localStorage.getItem("admin_token");

  const fetchRoles = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setRoles(data.roles.data);
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleShow = async (id: number) => {
    const res = await fetch(`https://otmove.online/api/v1/dashboard/roles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setSelectedRole(data.role);
      setShowDetailsModal(true);
    }
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRole) return;
    const res = await fetch(`https://otmove.online/api/v1/dashboard/roles/${selectedRole.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      fetchRoles();
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (role: Role) => {
    setIsEditing(true);
    setFormData({
      name: role.name,
      display_name: role.display_name || "",
      description: role.description || "",
    });
    setSelectedRole(role);
    setShowFormModal(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ name: "", display_name: "", description: "" });
    setShowFormModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = isEditing
      ? `https://otmove.online/api/v1/dashboard/roles/${selectedRole?.id}`
      : "https://otmove.online/api/v1/dashboard/roles";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      fetchRoles();
      setShowFormModal(false);
    }
  };

  return (
    <div className={styles.rolesContainer}>
      <div className={styles.header}>
        <h2>إدارة الأدوار</h2>
        <button onClick={handleCreate} className={styles.addButton}>إضافة دور جديد</button>
      </div>

      <table className={styles.rolesTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>اسم الدور</th>
            <th>الوصف</th>
            <th>تاريخ الإنشاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, i) => (
            <tr key={role.id}>
              <td>{i + 1}</td>
              <td>{role.display_name || role.name}</td>
              <td>{role.description || "-"}</td>
              <td>{new Date(role.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleShow(role.id)}><FaEye /></button>
                <button onClick={() => handleEdit(role)}><FaEdit /></button>
                <button onClick={() => handleDelete(role)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{isEditing ? "تعديل الدور" : "إضافة دور جديد"}</h3>
            <form onSubmit={handleSubmit} className={styles.roleForm}>
              <input
                type="text"
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="الاسم المعروض"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              />
              <textarea
                placeholder="الوصف"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
              <button type="submit">{isEditing ? "تحديث" : "إنشاء"}</button>
              <button type="button" onClick={() => setShowFormModal(false)}>إلغاء</button>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedRole && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل الدور</h3>
            <p><strong>الاسم:</strong> {selectedRole.display_name || selectedRole.name}</p>
            <p><strong>الوصف:</strong> {selectedRole.description || "-"}</p>
            <button onClick={() => setShowDetailsModal(false)}>إغلاق</button>
          </div>
        </div>
      )}

      {showDeleteModal && selectedRole && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>هل أنت متأكد من حذف الدور؟</h3>
            <p>اسم الدور: <strong>{selectedRole.display_name || selectedRole.name}</strong></p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.deleteButton}>حذف</button>
              <button onClick={() => setShowDeleteModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
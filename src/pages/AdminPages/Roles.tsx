import styles from "../../styles/Components/Modal.module.css";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface Role {
  id: number;
  name: string;
  display_name: string | null;
  description: string | null;
  created_at: string;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  display_name: string;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  // const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 5;
  const token = localStorage.getItem("admin_token");

  const fetchRoles = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setRoles(data.roles.data);
  };

  useEffect(() => {
    fetchRoles();
    // fetchPermissions();
  }, []);

  const handleShow = async (id: number) => {
    const res = await fetch(
      `https://otmove.online/api/v1/dashboard/roles/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) {
      setSelectedRole(data.role);
      setShowDetailsModal(true);
    }
  };

  const handleDelete = (role: Role) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `سيتم حذف الدور (${role.display_name || role.name}) بشكل نهائي!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: styles.swal_popup,
        title: styles.swal_title,
        confirmButton: styles.swal_confirm_btn,
        cancelButton: styles.swal_cancel_btn,
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://otmove.online/api/v1/dashboard/roles/${role.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          if (data.success) {
            toast.success("تم حذف الدور بنجاح.");
            fetchRoles();
          } else {
            toast.error("فشل في الحذف، حاول لاحقًا.");
          }
        } catch (err) {
          toast.error("حدث خطأ أثناء الاتصال بالخادم.");
        }
      }
    });
  };

  const handleEdit = (role: Role) => {
    setIsEditing(true);
    setFormData({
      name: role.name,
      display_name: role.display_name || "",
      description: role.description || "",
    });
    setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
    setSelectedRole(role);
    setShowFormModal(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ name: "", display_name: "", description: "" });
    setSelectedPermissions([]);
    setShowFormModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = isEditing
      ? `https://otmove.online/api/v1/dashboard/roles/${selectedRole?.id}`
      : "https://otmove.online/api/v1/dashboard/roles";
    const method = isEditing ? "PUT" : "POST";

    const body = {
      ...formData,
      permissions: selectedPermissions,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "تم التحديث بنجاح" : "تم الإضافة بنجاح");
        fetchRoles();
        setShowFormModal(false);
      } else {
        toast.error("فشل في الحفظ، تحقق من البيانات");
      }
    } catch (err) {
      toast.error("خطأ في الاتصال بالخادم");
    }
  };

  // const togglePermission = (id: number) => {
  //   if (selectedPermissions.includes(id)) {
  //     setSelectedPermissions(selectedPermissions.filter((pid) => pid !== id));
  //   } else {
  //     setSelectedPermissions([...selectedPermissions, id]);
  //   }
  // };

  const filteredRoles = roles.filter((role) =>
    (role.name + role.display_name + role.description)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
  const currentRoles = filteredRoles.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>إدارة الأدوار</h2>
        <button onClick={handleCreate} className={styles.addButton}>
          إضافة دور جديد
        </button>
      </div>
      <input
        type="text"
        placeholder="بحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <table className={styles.table}>
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
          {currentRoles.map((role, i) => (
            <tr key={role.id}>
              <td>{(currentPage - 1) * rolesPerPage + i + 1}</td>
              <td>{role.display_name || role.name}</td>
              <td>{role.description || "-"}</td>
              <td>{new Date(role.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleShow(role.id)}>
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(role)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(role)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? styles.activePage : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{isEditing ? "تعديل الدور" : "إضافة دور جديد"}</h3>
            <form onSubmit={handleSubmit} className={styles.roleForm}>
              <input
                type="text"
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="الاسم المعروض"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
              />
              <textarea
                placeholder="الوصف"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>

              {/* <div className={styles.permissionsContainer}>
                <h4>الصلاحيات:</h4>
                <div className={styles.permissionsList}>
                  {permissions.map((perm) => (
                    <label key={perm.id}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      {perm.display_name}
                    </label>
                  ))}
                </div>
              </div> */}

              <button type="submit">{isEditing ? "تحديث" : "إنشاء"}</button>
              <button type="button" onClick={() => setShowFormModal(false)}>
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedRole && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل الدور</h3>
            <p>
              <strong>الاسم:</strong>{" "}
              {selectedRole.display_name || selectedRole.name}
            </p>
            <p>
              <strong>الوصف:</strong> {selectedRole.description || "-"}
            </p>
            {selectedRole.permissions?.length && (
              <div>
                <strong>الصلاحيات:</strong>
                <ul>
                  {selectedRole.permissions.map((perm) => (
                    <li key={perm.id}>{perm.display_name}</li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={() => setShowDetailsModal(false)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

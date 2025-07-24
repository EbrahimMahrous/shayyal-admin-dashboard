import { useEffect, useState } from "react";
import styles from "../../styles/Components/Modal.module.css";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types
interface Item {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("admin_token");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://otmove.online/api/v1/dashboard/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setItems(data.items.data);
    } catch (err) {
      toast.error("فشل في تحميل العناصر");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetails = async (id: number) => {
    try {
      const res = await fetch(
        `https://otmove.online/api/v1/dashboard/items/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setSelectedItem(data.item);
        setShowViewModal(true);
      }
    } catch (err) {
      toast.error("فشل تحميل تفاصيل العنصر");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing
      ? `https://otmove.online/api/v1/dashboard/items/${selectedItem?.id}`
      : "https://otmove.online/api/v1/dashboard/items";

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
      if (data.success) {
        toast.success(isEditing ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
        fetchItems();
        setShowForm(false);
      } else {
        toast.error("حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      toast.error("فشل الاتصال بالسيرفر");
    }
  };

  const handleEdit = (item: Item) => {
    setIsEditing(true);
    setSelectedItem(item);
    setFormData({ name: item.name });
    setShowForm(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ name: "" });
    setShowForm(true);
  };

  const handleDelete = (item: Item) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `سيتم حذف العنصر: ${item.name}`,
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
      background: "var(--bg-color)",
      color: "var(--text-color)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://otmove.online/api/v1/dashboard/items/${item.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();

          if (data.success) {
            toast.success("تم حذف العنصر");
            fetchItems();
          } else {
            toast.error(data.message || "لا يمكن حذف هذا العنصر");
          }
        } catch (err) {
          toast.error("فشل الحذف، تحقق من الاتصال");
        }
      }
    });
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <ToastContainer position="top-left" autoClose={3000} />
      <div className={styles.header}>
        <h2>إدارة العناصر</h2>
      </div>

      <div className={styles.header}>
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={handleCreate}>
          <FaPlus /> إضافة عنصر
        </button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>تاريخ الإنشاء</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, i) => (
              <tr key={item.id}>
                <td>{startIndex + i + 1}</td>
                <td>{item.name}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => fetchItemDetails(item.id)} title="عرض">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(item)} title="تعديل">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item)} title="حذف">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Add | Edit Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{isEditing ? "تعديل عنصر" : "إضافة عنصر"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="اسم العنصر"
                required
              />
              <button type="submit">{isEditing ? "تحديث" : "إضافة"}</button>
              <button type="button" onClick={() => setShowForm(false)}>
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Show Modal */}
      {showViewModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل العنصر</h3>
            <p>
              <strong>الاسم:</strong> {selectedItem.name}
            </p>
            <p>
              <strong>تاريخ الإنشاء:</strong>{" "}
              {new Date(selectedItem.created_at).toLocaleString()}
            </p>
            <p>
              <strong>آخر تحديث:</strong>{" "}
              {new Date(selectedItem.updated_at || "").toLocaleString()}
            </p>
            <button onClick={() => setShowViewModal(false)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;

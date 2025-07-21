import { useEffect, useState } from "react";
// ** Styles
import styles from "../../styles/Components/Modal.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

type Item = {
  id: number;
  name: string;
  created_at: string;
};

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("admin_token");

  const fetchItems = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setItems(data.items.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setFormData({ name: item.name });
    setShowEditModal(true);
  };

  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    setFormData({ name: "" });
    setShowCreateModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/items/${selectedItem.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setShowDeleteModal(false);
    fetchItems();
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/items/${selectedItem.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    setShowEditModal(false);
    fetchItems();
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("https://otmove.online/api/v1/dashboard/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    setShowCreateModal(false);
    fetchItems();
  };

  //  Filter + Pagination
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
      <div className={styles.header}>
        <h2>إدارة العناصر</h2>
        <button onClick={handleCreate} className={styles.addButton}>
          <FaPlus /> إضافة عنصر
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="ابحث باسم العنصر..."
        className={styles.searchInput}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
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
                <button title="تعديل" onClick={() => handleEdit(item)}>
                  <FaEdit />
                </button>
                <button title="حذف" onClick={() => handleDelete(item)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

      {/* Add Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>إضافة عنصر جديد</h3>
            <form onSubmit={submitCreate}>
              <input
                type="text"
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <button type="submit">إضافة</button>
              <button type="button" onClick={() => setShowCreateModal(false)}>
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تعديل العنصر</h3>
            <form onSubmit={submitEdit}>
              <input
                type="text"
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <button type="submit">حفظ</button>
              <button type="button" onClick={() => setShowEditModal(false)}>
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تأكيد الحذف</h3>
            <p>
              هل أنت متأكد من حذف العنصر <strong>{selectedItem.name}</strong>؟
            </p>
            <button onClick={confirmDelete}>تأكيد</button>
            <button onClick={() => setShowDeleteModal(false)}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;

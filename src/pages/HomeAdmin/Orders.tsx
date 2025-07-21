import { useEffect, useState } from "react";
// ** Styles
import styles from "../../styles/Components/Modal.module.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

type Customer = {
  name: string;
  phone: string;
};

type Item = {
  id: number;
  name: string;
};

type Order = {
  id: number;
  customer: Customer;
  status: string;
  desc: string;
  created_at: string;
  items: Item[];
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ desc: "", status: "" });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const token = localStorage.getItem("admin_token");

  const fetchOrders = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setOrders(data.orders.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditFormData({ desc: order.desc, status: order.status });
    setShowEditModal(true);
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/orders/${selectedOrder.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setShowDeleteModal(false);
    fetchOrders();
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/orders/${selectedOrder.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      }
    );
    setShowEditModal(false);
    fetchOrders();
  };

  //  Filter + Pagination
  const filteredOrders = orders.filter((order) =>
    order.customer.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>إدارة الطلبات</h2>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="ابحث باسم العميل..."
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
            <th>العميل</th>
            <th>الهاتف</th>
            <th>الوصف</th>
            <th>الحالة</th>
            <th>العناصر</th>
            <th>تاريخ الإنشاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, i) => (
            <tr key={order.id}>
              <td>{startIndex + i + 1}</td>
              <td>{order.customer.name}</td>
              <td>{order.customer.phone}</td>
              <td>{order.desc}</td>
              <td>{order.status}</td>
              <td>{order.items.map((item) => item.name).join(", ")}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <button title="تفاصيل" onClick={() => handleShowDetails(order)}>
                  <FaEye />
                </button>
                <button title="تعديل" onClick={() => handleEdit(order)}>
                  <FaEdit />
                </button>
                <button title="حذف" onClick={() => handleDelete(order)}>
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

      {/* Show Modal */}
      {showDetailsModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل الطلب</h3>
            <p>
              <strong>العميل:</strong> {selectedOrder.customer.name}
            </p>
            <p>
              <strong>الهاتف:</strong> {selectedOrder.customer.phone}
            </p>
            <p>
              <strong>الوصف:</strong> {selectedOrder.desc}
            </p>
            <p>
              <strong>الحالة:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>العناصر:</strong>{" "}
              {selectedOrder.items.map((item) => item.name).join(", ")}
            </p>
            <button onClick={() => setShowDetailsModal(false)}>إغلاق</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تعديل بيانات الطلب</h3>
            <form onSubmit={submitEdit}>
              <input
                type="text"
                placeholder="الوصف"
                value={editFormData.desc}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, desc: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="الحالة"
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, status: e.target.value })
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
      {showDeleteModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تأكيد الحذف</h3>
            <p>
              هل أنت متأكد من حذف الطلب رقم <strong>{selectedOrder.id}</strong>؟
            </p>
            <button onClick={confirmDelete}>تأكيد</button>
            <button onClick={() => setShowDeleteModal(false)}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

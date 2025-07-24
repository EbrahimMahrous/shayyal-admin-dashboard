import { useEffect, useState } from "react";
import styles from "../../styles/Components/Modal.module.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

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

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditFormData({ desc: order.desc, status: order.status });
    setShowEditModal(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetch(
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
      const data = await res.json();
      if (data.success) {
        toast.success("تم التعديل بنجاح ✅");
        setShowEditModal(false);
        fetchOrders();
      } else {
        toast.error("فشل في التعديل ❌");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  const confirmDelete = async (order: Order) => {
    const result = await Swal.fire({
      title: `هل أنت متأكد من حذف الطلب رقم ${order.id}؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: styles.swal_popup,
        title: styles.swal_title,
        confirmButton: styles.swal_confirm_btn,
        cancelButton: styles.swal_cancel_btn,
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://otmove.online/api/v1/dashboard/orders/${order.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success) {
          toast.success("تم الحذف بنجاح ✅");
          fetchOrders();
        } else {
          toast.error(data.message || "لا يمكن حذف الطلب ❌");
        }
      } catch {
        toast.error("حدث خطأ أثناء الحذف ❌");
      }
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.customer.name.toLowerCase().includes(search.toLowerCase())
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

      <input
        type="text"
        placeholder="ابحث باسم العميل..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className={styles.searchInput}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>العميل</th>
            <th>الهاتف</th>
            <th>الوصف</th>
            <th>الحالة</th>
            <th>العناصر</th>
            <th>التاريخ</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((o, i) => (
            <tr key={o.id}>
              <td>{startIndex + i + 1}</td>
              <td>{o.customer.name}</td>
              <td>{o.customer.phone}</td>
              <td>{o.desc}</td>
              <td>{o.status}</td>
              <td>{o.items.map((it) => it.name).join(", ")}</td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedOrder(o);
                    setShowDetailsModal(true);
                  }}
                >
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(o)}>
                  <FaEdit />
                </button>
                <button onClick={() => confirmDelete(o)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تعديل الطلب</h3>
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
              <button onClick={() => setShowEditModal(false)}>إلغاء</button>
            </form>
          </div>
        </div>
      )}

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
              {selectedOrder.items.map((i) => i.name).join(", ")}
            </p>
            <button onClick={() => setShowDetailsModal(false)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

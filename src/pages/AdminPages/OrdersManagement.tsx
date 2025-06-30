// ** Style
import styles from "../../styles/Pages/Admin/OrdersManagement.module.css";
// ** Hooks
import { useState, useEffect, type ChangeEvent } from "react";
// ** Icons
import { Pencil, Trash2 } from "lucide-react";

interface Order {
  id: number;
  customer: string;
  status: string;
  total: number;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setOrders([
      { id: 1, customer: "علي", status: "قيد التنفيذ", total: 250 },
      { id: 2, customer: "سارة", status: "مكتمل", total: 600 },
      { id: 3, customer: "عمر", status: "ملغي", total: 150 },
    ]);
  }, []);

  const handleDeleteClick = (id: number) => {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete !== null) {
      setOrders(orders.filter((order) => order.id !== orderToDelete));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id ? selectedOrder : order
      )
    );
    setIsDialogOpen(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Order
  ) => {
    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        [field]: field === "total" ? Number(e.target.value) : e.target.value,
      });
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <h2 className={styles.title}>إدارة الطلبات</h2>
        <input
          type="text"
          placeholder="ابحث باسم العميل..."
          className={styles.searchInput}
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>الرقم</th>
            <th>العميل</th>
            <th>الحالة</th>
            <th>الإجمالي (ر.س)</th>
            <th className={styles.actions}>الاجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.status}</td>
              <td>{order.total}</td>
              <td className={styles.actionButtons}>
                <button
                  onClick={() => handleEdit(order)}
                  className={styles.editBtn}
                >
                  <Pencil className={styles.icon} />
                </button>
                <button
                  onClick={() => handleDeleteClick(order.id)}
                  className={styles.deleteBtn}
                >
                  <Trash2 className={styles.icon} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      {selectedOrder && isDialogOpen && (
        <div
          className={styles.dialogOverlay}
          onClick={() => setIsDialogOpen(false)}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>تعديل الطلب رقم {selectedOrder.id}</h3>
            <input
              value={selectedOrder.customer}
              onChange={(e) => handleFieldChange(e, "customer")}
              className={styles.dialogInput}
              placeholder="اسم العميل"
            />
            <input
              value={selectedOrder.status}
              onChange={(e) => handleFieldChange(e, "status")}
              className={styles.dialogInput}
              placeholder="الحالة"
            />
            <input
              type="number"
              value={selectedOrder.total}
              onChange={(e) => handleFieldChange(e, "total")}
              className={styles.dialogInput}
              placeholder="الإجمالي (ر.س)"
            />
            <button onClick={handleUpdate} className={styles.updateButton}>
              تحديث
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className={styles.dialogOverlay}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1rem" }}>
              هل أنت متأكد أنك تريد حذف هذا الطلب؟
            </h3>
            <div className={styles.confirmButtons}>
              <button
                onClick={confirmDelete}
                className={`${styles.confirmBtn} ${styles.yes}`}
              >
                نعم
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`${styles.confirmBtn} ${styles.no}`}
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

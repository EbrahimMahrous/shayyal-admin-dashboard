import { useEffect, useState } from "react";
// ** Styles
import styles from "../../styles/Components/Modal.module.css";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string;
  otp: string;
  status: string;
  image: string | null;
  created_at: string;
  updated_at: string;
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("admin_token");

  const fetchCustomers = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/customers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setCustomers(data.customers.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleShowDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    });
    setShowEditModal(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = async (customerId: number) => {
    await fetch(
      `https://otmove.online/api/v1/dashboard/customers/change_status/${customerId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchCustomers();
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/customers/${selectedCustomer.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setShowDeleteModal(false);
    fetchCustomers();
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/customers/${selectedCustomer.id}`,
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
    fetchCustomers();
  };

  // Filter + Pagination
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>إدارة العملاء</h2>
      </div>

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

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الهاتف</th>
            <th>العنوان</th>
            <th>OTP</th>
            <th>الحالة</th>
            <th>تاريخ الإنشاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((c, i) => (
            <tr key={c.id}>
              <td>{startIndex + i + 1}</td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>{c.otp}</td>
              <td>
                <button onClick={() => handleToggleStatus(c.id)}>
                  {c.status === "1" ? <FaToggleOn color="green" /> : <FaToggleOff color="gray" />}
                </button>
              </td>
              <td>{new Date(c.created_at).toLocaleDateString()}</td>
              <td>
                <button title="تفاصيل" onClick={() => handleShowDetails(c)}>
                  <FaEye />
                </button>
                <button title="تعديل" onClick={() => handleEdit(c)}>
                  <FaEdit />
                </button>
                <button title="حذف" onClick={() => handleDelete(c)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Show Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل العميل</h3>
            <p><strong>الاسم:</strong> {selectedCustomer.name}</p>
            <p><strong>الهاتف:</strong> {selectedCustomer.phone}</p>
            <p><strong>العنوان:</strong> {selectedCustomer.address}</p>
            <p><strong>OTP:</strong> {selectedCustomer.otp}</p>
            <p><strong>تاريخ الإنشاء:</strong> {new Date(selectedCustomer.created_at).toLocaleString()}</p>
            <button onClick={() => setShowDetailsModal(false)}>إغلاق</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تعديل بيانات العميل</h3>
            <form onSubmit={submitEdit}>
              <input
                type="text"
                placeholder="الاسم"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="الهاتف"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="العنوان"
                value={editFormData.address}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, address: e.target.value })
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
      {showDeleteModal && selectedCustomer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تأكيد الحذف</h3>
            <p>
              هل أنت متأكد من حذف العميل{" "}
              <strong>{selectedCustomer.name}</strong>؟
            </p>
            <button onClick={confirmDelete}>تأكيد</button>
            <button onClick={() => setShowDeleteModal(false)}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

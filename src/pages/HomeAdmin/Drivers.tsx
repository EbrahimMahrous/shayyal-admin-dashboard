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

interface Driver {
  id: number;
  name: string;
  phone: string;
  address: string;
  otp: string;
  status: string;
  image: string;
  car_number: string;
  car_license: string;
  car_type: string;
  car_dimensions: string;
  rate: string;
  created_at: string;
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
    car_number: "",
    car_license: "",
    car_type: "",
    car_dimensions: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("admin_token");

  const fetchDrivers = async () => {
    const res = await fetch("https://otmove.online/api/v1/dashboard/drivers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setDrivers(data.drivers.data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleToggleStatus = async (id: number) => {
    await fetch(
      `https://otmove.online/api/v1/dashboard/drivers/change_status/${id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchDrivers();
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditFormData({
      name: driver.name,
      phone: driver.phone,
      address: driver.address,
      car_number: driver.car_number,
      car_license: driver.car_license,
      car_type: driver.car_type,
      car_dimensions: driver.car_dimensions,
    });
    setShowEdit(true);
  };

  const handleDelete = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedDriver) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/drivers/${selectedDriver.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setShowDelete(false);
    fetchDrivers();
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;
    await fetch(
      `https://otmove.online/api/v1/dashboard/drivers/${selectedDriver.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      }
    );
    setShowEdit(false);
    fetchDrivers();
  };
  //  Filter + Pagination
  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>إدارة السائقين</h2>
      </div>

      <input
        type="text"
        placeholder="ابحث باسم السائق..."
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
            <th>السيارة</th>
            <th>الرخصة</th>
            <th>النوع</th>
            <th>الأبعاد</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDrivers.map((d, i) => (
            <tr key={d.id}>
              <td>{startIndex + i + 1}</td>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.car_number}</td>
              <td>{d.car_license}</td>
              <td>{d.car_type}</td>
              <td>{d.car_dimensions}</td>
              <td>
                <button onClick={() => handleToggleStatus(d.id)}>
                  {d.status === "1" ? (
                    <FaToggleOn color="green" />
                  ) : (
                    <FaToggleOff color="gray" />
                  )}
                </button>
              </td>
              <td>
                <button
                  title="تفاصيل"
                  onClick={() => {
                    setSelectedDriver(d);
                    setShowDetails(true);
                  }}
                >
                  <FaEye />
                </button>
                <button title="تعديل" onClick={() => handleEdit(d)}>
                  <FaEdit />
                </button>
                <button title="حذف" onClick={() => handleDelete(d)}>
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
      {showDetails && selectedDriver && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تفاصيل السائق</h3>
            <p>
              <strong>الاسم:</strong> {selectedDriver.name}
            </p>
            <p>
              <strong>الهاتف:</strong> {selectedDriver.phone}
            </p>
            <p>
              <strong>العنوان:</strong> {selectedDriver.address}
            </p>
            <p>
              <strong>رقم السيارة:</strong> {selectedDriver.car_number}
            </p>
            <p>
              <strong>رخصة السيارة:</strong> {selectedDriver.car_license}
            </p>
            <p>
              <strong>نوع السيارة:</strong> {selectedDriver.car_type}
            </p>
            <p>
              <strong>أبعاد السيارة:</strong> {selectedDriver.car_dimensions}
            </p>
            <p>
              <strong>تاريخ الإنشاء:</strong>{" "}
              {new Date(selectedDriver.created_at).toLocaleString()}
            </p>
            <button onClick={() => setShowDetails(false)}>إغلاق</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && selectedDriver && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تعديل بيانات السائق</h3>
            <form onSubmit={submitEdit}>
              <input
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                placeholder="الاسم"
              />
              <input
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                placeholder="الهاتف"
              />
              <input
                value={editFormData.address}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, address: e.target.value })
                }
                placeholder="العنوان"
              />
              <input
                value={editFormData.car_number}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    car_number: e.target.value,
                  })
                }
                placeholder="رقم السيارة"
              />
              <input
                value={editFormData.car_license}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    car_license: e.target.value,
                  })
                }
                placeholder="الرخصة"
              />
              <input
                value={editFormData.car_type}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, car_type: e.target.value })
                }
                placeholder="النوع"
              />
              <input
                value={editFormData.car_dimensions}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    car_dimensions: e.target.value,
                  })
                }
                placeholder="الأبعاد"
              />
              <button type="submit">حفظ</button>
              <button type="button" onClick={() => setShowEdit(false)}>
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && selectedDriver && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>تأكيد الحذف</h3>
            <p>
              هل أنت متأكد من حذف السائق <strong>{selectedDriver.name}</strong>؟
            </p>
            <button onClick={confirmDelete}>تأكيد</button>
            <button onClick={() => setShowDelete(false)}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;

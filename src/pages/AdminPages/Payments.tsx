import styles from "../../styles/Components/Modal.module.css";
import { useEffect, useState } from "react";

type Payment = {
  id: number;
  payment_method: string;
  amount: string;
  shayyal_amount: string;
  driver_amount: string;
  created_at: string;
  customer: { name: string };
  driver: { name: string };
  order: { id: number };
};

const ITEMS_PER_PAGE = 5;

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filtered, setFiltered] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("https://otmove.online/api/v1/dashboard/payments", {
      headers: { Authorization: `Bearer ${localStorage.admin_token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setPayments(json.payments.data);
        setFiltered(json.payments.data);
      });
  }, []);

  useEffect(() => {
    let data = [...payments];

    if (filterMethod !== "all") {
      data = data.filter((p) => p.payment_method.toLowerCase() === filterMethod);
    }

    if (search) {
      data = data.filter(
        (p) =>
          p.customer.name.toLowerCase().includes(search.toLowerCase()) ||
          p.driver.name.toLowerCase().includes(search.toLowerCase()) ||
          p.order.id.toString().includes(search)
      );
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, filterMethod, payments]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className={styles.paymentsContainer}>
      <h2 className={styles.title}>المدفوعات</h2>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="ابحث عن عميل أو سائق أو رقم طلب..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">الكل</option>
          <option value="visa">Visa</option>
          <option value="vise">Vise</option>
          <option value="cash">كاش</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>طريقة الدفع</th>
            <th>المبلغ</th>
            <th>نصيب شَيَّال</th>
            <th>الموظف</th>
            <th>الطلب</th>
            <th>العميل</th>
            <th>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.payment_method}</td>
              <td>{p.amount}</td>
              <td>{p.shayyal_amount}</td>
              <td>{p.driver.name}</td>
              <td>{p.order.id}</td>
              <td>{p.customer.name}</td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

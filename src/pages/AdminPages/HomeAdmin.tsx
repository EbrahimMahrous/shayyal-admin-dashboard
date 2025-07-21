// ** Styles
import styles from "../../styles/Pages/Admin/HomeAdmin.module.css";
// ** React & Chart.js
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
// ** react-countUp
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

interface OrdersPerMonth {
  date: string;
  count: number;
}

interface NewUsers {
  month: string;
  count: number;
}

interface OrderStatus {
  label: string;
  value: number;
}

interface DashboardStats {
  users: number;
  orders: number;
  providers: number;
  items: number;
  ordersPerMonth: OrdersPerMonth[];
  newUsers: NewUsers[];
  orderStatus: OrderStatus[];
}

let ordersBarChartInstance: Chart | null = null;
let usersLineChartInstance: Chart | null = null;
let orderStatusPieInstance: Chart | null = null;

export default function HomeAdmin() {
  const navigate = useNavigate();
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    await fetchStats();
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    orders: 0,
    providers: 0,
    items: 0,
    ordersPerMonth: [],
    newUsers: [],
    orderStatus: [],
  });

  const toggleMaintenance = () => {
    setMaintenanceMode((prev) => !prev);
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const query = new URLSearchParams();
      if (fromDate) query.append("from", fromDate);
      if (toDate) query.append("to", toDate);
      if (selectedCustomer) query.append("customer_id", selectedCustomer);
      if (selectedProvider) query.append("driver_id", selectedProvider);
      const queryString = query.toString();

      const [usersRes, providersRes, ordersRes, itemsRes] = await Promise.all([
        fetch("https://otmove.online/api/v1/dashboard/customers", { headers }),
        fetch("https://otmove.online/api/v1/dashboard/drivers", { headers }),
        fetch(`https://otmove.online/api/v1/dashboard/orders?${queryString}`, {
          headers,
        }),
        fetch("https://otmove.online/api/v1/dashboard/items", { headers }),
      ]);

      const usersData = await usersRes.json();
      const providersData = await providersRes.json();
      const ordersData = await ordersRes.json();
      const itemsData = await itemsRes.json();

      const statusCounts: { [key: string]: number } = {};
      const ordersList = ordersData.orders?.data || [];
      ordersList.forEach((order: any) => {
        const status = order.status;
        if (status) {
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        }
      });

      const formattedOrderStatus: OrderStatus[] = Object.entries(
        statusCounts
      ).map(([label, value]) => ({ label, value }));

      const groupedOrders: { [date: string]: number } = {};
      ordersList.forEach((order: any) => {
        const date = new Date(order.created_at).toISOString().split("T")[0];
        groupedOrders[date] = (groupedOrders[date] || 0) + 1;
      });
      const ordersPerMonth = Object.entries(groupedOrders).map(
        ([date, count]) => ({ date, count })
      );

      setStats({
        users: usersData?.customers?.total || 0,
        providers: providersData?.drivers?.total || 0,
        orders: ordersData?.orders?.total || 0,
        items: itemsData?.items?.total || 0,
        ordersPerMonth,
        newUsers: usersData.newUsers || [],
        orderStatus: formattedOrderStatus,
      });
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fromDate, toDate, selectedCustomer, selectedProvider]);

  useEffect(() => {
    if (!stats.ordersPerMonth.length) return;

    const ctxBar = (
      document.getElementById("ordersBarChart") as HTMLCanvasElement
    )?.getContext("2d");
    if (ctxBar) {
      if (ordersBarChartInstance) ordersBarChartInstance.destroy();
      ordersBarChartInstance = new Chart(ctxBar, {
        type: "bar",
        data: {
          labels: stats.ordersPerMonth.map((item) => item.date),
          datasets: [
            {
              label: "الطلبات",
              data: stats.ordersPerMonth.map((item) => item.count),
              backgroundColor: "#b85a62",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "عدد الطلبات يوميًا" },
          },
        },
      });
    }

    const ctxLine = (
      document.getElementById("usersLineChart") as HTMLCanvasElement
    )?.getContext("2d");
    if (ctxLine) {
      if (usersLineChartInstance) usersLineChartInstance.destroy();
      usersLineChartInstance = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: stats.ordersPerMonth.map((item) => item.date),
          datasets: [
            {
              label: "الطلبات اليومية",
              data: stats.ordersPerMonth.map((item) => item.count),
              borderColor: "#b85a62",
              tension: 0.4,
            },
          ],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      });
    }

    const ctxPie = (
      document.getElementById("orderStatusPie") as HTMLCanvasElement
    )?.getContext("2d");
    if (ctxPie) {
      if (orderStatusPieInstance) orderStatusPieInstance.destroy();
      orderStatusPieInstance = new Chart(ctxPie, {
        type: "pie",
        data: {
          labels: stats.orderStatus.map((s) => s.label),
          datasets: [
            {
              data: stats.orderStatus.map((s) => s.value),
              backgroundColor: [
                "#dc747d",
                "#f0ad4e",
                "#5cb85c",
                "#5bc0de",
                "#292b2c",
              ],
            },
          ],
        },
        options: { responsive: true },
      });
    }

    return () => {
      ordersBarChartInstance?.destroy();
      usersLineChartInstance?.destroy();
      orderStatusPieInstance?.destroy();
    };
  }, [stats]);

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.heading}>نورتنا يا بطل! لوحة التحكم أحلى بيك</h1>

      <div className={styles.filters}>
        <label>
          من:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          إلى:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <label>
          العميل:
          <input
            type="text"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            placeholder="ID العميل"
          />
        </label>
        <label>
          مزود الخدمة:
          <input
            type="text"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            placeholder="ID المزود"
          />
        </label>
      </div>

      <div className={styles.statsGrid}>
        <div
          onClick={() => navigate("/admin/customers")}
          className={styles.card}
        >
          <h2>عدد المستخدمين</h2>
          <p>
            <CountUp end={stats.users} duration={1.5} separator="," />
          </p>
        </div>
        <div onClick={() => navigate("/admin/orders")} className={styles.card}>
          <h2>عدد الطلبات</h2>
          <p>
            <CountUp end={stats.orders} duration={1.5} separator="," />
          </p>
        </div>
        <div onClick={() => navigate("/admin/drivers")} className={styles.card}>
          <h2>مقدمو الخدمة</h2>
          <p>
            <CountUp end={stats.providers} duration={1.5} separator="," />
          </p>
        </div>
        <div onClick={() => navigate("/admin/items")} className={styles.card}>
          <h2>عدد العناصر</h2>
          <p>
            <CountUp end={stats.items} duration={1.5} separator="," />
          </p>
        </div>
      </div>

      <div className={styles.charts_container}>
        <div className={styles.chart_card}>
          <h3 className={styles.subheading}>الطلبات يوميًا</h3>
          <canvas id="ordersBarChart" height="100"></canvas>
        </div>
        <div className={`${styles.chart_card} ${styles.pieChart}`}>
          <h3 className={styles.subheading}>توزيع حالات الطلبات</h3>
          <canvas id="orderStatusPie" height="100"></canvas>
        </div>
        <div className={styles.chart_card}>
          <h3 className={styles.subheading}>الطلبات اليومية بالرسم الخطي</h3>
          <canvas id="usersLineChart" height="100"></canvas>
        </div>
      </div>

      <div className={styles.actionsSection}>
        <h3 className={styles.subheading}>إجراءات سريعة</h3>
        <div className={styles.actionsGrid}>
          <button
            className={`${styles.actionBtn} ${
              maintenanceMode ? styles.maintenanceOn : styles.maintenanceOff
            }`}
            onClick={toggleMaintenance}
          >
            {maintenanceMode ? "إيقاف وضع الصيانة" : "تفعيل وضع الصيانة"}
          </button>

          <button className={styles.actionBtn} onClick={handleUpdateClick}>
            {isUpdating ? " جاري تحديث البيانات..." : " تحديث البيانات"}
          </button>
        </div>
      </div>
    </div>
  );
}

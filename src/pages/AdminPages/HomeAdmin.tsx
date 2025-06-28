// ** Styles
import styles from "../../styles/Pages/Admin/HomeAdmin.module.css";
// ** React & Chart.js
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "../../../mock/api/dashboard.json";
// ** react-countUp
import CountUp from "react-countup";

interface OrdersPerMonth {
  month: string;
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
  sales: number;
  ordersPerMonth: OrdersPerMonth[];
  newUsers: NewUsers[];
  orderStatus: OrderStatus[];
}

let ordersBarChartInstance: Chart | null = null;
let usersLineChartInstance: Chart | null = null;
let orderStatusPieInstance: Chart | null = null;

export default function HomeAdmin() {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    sales: 0,
    ordersPerMonth: [],
    newUsers: [],
    orderStatus: [],
  });

  const toggleMaintenance = () => {
    setMaintenanceMode((prev) => !prev);
  };

  const fetchStats = () => {
    fetch("/mock/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: DashboardStats) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!stats.ordersPerMonth.length) return;

    // Bar Chart
    const ctxBar = (
      document.getElementById("ordersBarChart") as HTMLCanvasElement | null
    )?.getContext("2d");

    if (ctxBar) {
      if (ordersBarChartInstance) {
        ordersBarChartInstance.destroy();
      }

      ordersBarChartInstance = new Chart(ctxBar, {
        type: "bar",
        data: {
          labels: stats.ordersPerMonth.map((item) => item.month),
          datasets: [
            {
              label: "الطلبات",
              data: stats.ordersPerMonth.map((item) => item.count),
              backgroundColor: [
                "#3e95cd",
                "#8e5ea2",
                "#3cba9f",
                "#e8c3b9",
                "#c45850",
                "#f0ad4e",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "الطلبات حسب الشهر",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "الشهور",
              },
            },
            y: {
              title: {
                display: true,
                text: "عدد الطلبات",
              },
            },
          },
        },
      });
    }

    // Line Chart
    const ctxLine = (
      document.getElementById("usersLineChart") as HTMLCanvasElement | null
    )?.getContext("2d");

    if (ctxLine) {
      if (usersLineChartInstance) {
        usersLineChartInstance.destroy();
      }

      usersLineChartInstance = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: stats.newUsers.map((item) => item.month),
          datasets: [
            {
              label: "المستخدمين الجدد",
              data: stats.newUsers.map((item) => item.count),
              borderColor: "#b85a62",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }

    // Pie Chart
    const ctxPie = (
      document.getElementById("orderStatusPie") as HTMLCanvasElement | null
    )?.getContext("2d");

    if (ctxPie) {
      if (orderStatusPieInstance) {
        orderStatusPieInstance.destroy();
      }

      orderStatusPieInstance = new Chart(ctxPie, {
        type: "pie",
        data: {
          labels: stats.orderStatus.map((s) => s.label),
          datasets: [
            {
              data: stats.orderStatus.map((s) => s.value),
              backgroundColor: ["#dc747d", "#f0ad4e", "#5cb85c"],
            },
          ],
        },
        options: {
          responsive: true,
        },
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
      <h1 className={styles.heading}>
        حيّ الله من جانا! لوحة التحكم بوجودك غير ✨
      </h1>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <h2>عدد المستخدمين</h2>
          <p>
            <CountUp end={stats.users} duration={1.5} separator="," />
          </p>
        </div>
        <div className={styles.card}>
          <h2>عدد الطلبات</h2>
          <p>
            <CountUp end={stats.orders} duration={1.5} separator="," />
          </p>
        </div>
        <div className={styles.card}>
          <h2>مقدمو الخدمة</h2>
          <p>
            <CountUp end={stats.providers} duration={1.5} separator="," />
          </p>
        </div>
        <div className={styles.card}>
          <h2>إجمالي المبيعات (ر.س)</h2>
          <p>
            <CountUp
              end={stats.sales}
              duration={1.5}
              separator=","
              suffix=" ر.س"
            />
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.charts_container}>
        <div>
          <h3 className={styles.subheading}>الطلبات خلال الأشهر الأخيرة</h3>
          <canvas id="ordersBarChart" height="100"></canvas>
        </div>
        <div>
          <h3 className={styles.subheading}>توزيع حالات الطلبات</h3>
          <canvas id="orderStatusPie" height="100"></canvas>
        </div>
        <div>
          <h3 className={styles.subheading}>عدد المستخدمين الجدد</h3>
          <canvas id="usersLineChart" height="100"></canvas>
        </div>
      </div>

      {/* Quick Actions */}
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

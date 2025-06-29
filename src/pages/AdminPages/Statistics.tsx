// ** styles
import styles from "../../styles/Pages/Admin/Statistics.module.css";
// ** hooks
import { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// ** components
import Table from "../../components/Table";
import UserMap from "../../components/UserMap";
import CountUp from "react-countup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Statistics() {
  const [loading, setLoading] = useState(true);
  type Order = {
    count: any;
    id: number;
    customer: string;
    service: string;
    date: string;
    city?: string;
  };

  type Provider = {
    name: string;
    orders: number;
    rating?: number;
    ratingsCount?: number;
  };

  type Summary = {
    totalOrders: number;
    cancellationRate: string;
  };

  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [providersData, setProvidersData] = useState<Provider[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalOrders: 0,
    cancellationRate: "0%",
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topRatedProviders, setTopRatedProviders] = useState<Provider[]>([]);

  const [filters, setFilters] = useState({
    dateRange: "",
    city: "",
    service: "",
    search: "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ dateRange: "", city: "", service: "", search: "" });
  };

  const saudiUserData = [
    { city: "الرياض", lat: 24.7136, long: 46.6753, users: 320 },
    { city: "جدة", lat: 21.4858, long: 39.1925, users: 280 },
    { city: "مكة", lat: 21.3891, long: 39.8579, users: 190 },
    { city: "المدينة المنورة", lat: 24.5247, long: 39.5692, users: 160 },
    { city: "الدمام", lat: 26.4207, long: 50.0888, users: 140 },
    { city: "الخبر", lat: 26.2172, long: 50.1971, users: 120 },
    { city: "أبها", lat: 18.2465, long: 42.5117, users: 110 },
    { city: "تبوك", lat: 28.3838, long: 36.555, users: 95 },
    { city: "نجران", lat: 17.4917, long: 44.1321, users: 85 },
    { city: "جازان", lat: 16.8895, long: 42.551, users: 75 },
  ];

  useEffect(() => {
    fetch("/mock/statistics")
      .then((res) => res.json())
      .then((data) => {
        setOrdersData(data.orders);
        setProvidersData(data.providers);
        setSummary(data.summary);
        setRecentOrders(data.recentOrders);
        setTopRatedProviders(data.topRatedProviders);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    return recentOrders.filter((order) => {
      const date = new Date(order.date);
      const today = new Date();

      let isInRange = true;
      if (filters.dateRange === "year") {
        isInRange = date.getFullYear() === today.getFullYear();
      } else if (filters.dateRange === "month") {
        isInRange =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth();
      } else if (filters.dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        isInRange = date >= weekAgo && date <= today;
      }

      const matchesCity =
        !filters.city ||
        order.city?.toLowerCase() === filters.city.toLowerCase();
      const matchesService =
        !filters.service || order.service === filters.service;
      const matchesSearch =
        !filters.search ||
        order.customer.includes(filters.search) ||
        order.service.includes(filters.search) ||
        String(order.id).includes(filters.search);

      return isInRange && matchesCity && matchesService && matchesSearch;
    });
  }, [recentOrders, filters]);

  const lineChartData = {
    labels: ordersData.map((o) => o.date),
    datasets: [
      {
        label: "عدد الطلبات",
        data: ordersData.map((o) => o.count),
        borderColor: "#dc747d",
        backgroundColor: "#fbeaec",
      },
    ],
  };

  const barChartData = {
    labels: providersData.map((p) => p.name),
    datasets: [
      {
        label: "عدد الطلبات",
        data: providersData.map((p) => p.orders),
        backgroundColor: ["#93c5fd", "#6ee7b7", "#fcd34d"],
      },
    ],
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.statistics_header}>
        <h2 className={styles.title}> لوحة الإحصائيات</h2>
        <div className={styles.filtersWrapper}>
          <select
            className={styles.select}
            value={filters.dateRange}
            onChange={(e) => handleChange("dateRange", e.target.value)}
          >
            <option value="">📆 اختر التاريخ</option>
            <option value="year">هذا السنة</option>
            <option value="month">هذا الشهر</option>
            <option value="week">هذا الأسبوع</option>
          </select>

          <select
            className={styles.select}
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
          >
            <option value="">🏠 اختر المدينة</option>
            {saudiUserData.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filters.service}
            onChange={(e) => handleChange("service", e.target.value)}
          >
            <option value="">🛠 نوع الخدمة</option>
            <option value="تنظيف">تنظيف</option>
            <option value="صيانة">صيانة</option>
            <option value="تركيب">تركيب</option>
          </select>

          <input
            type="text"
            className={styles.searchInput}
            placeholder=" ابحث بالاسم أو الرقم..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />

          <button className={styles.resetBtn} onClick={resetFilters}>
            إعادة تعيين
          </button>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.card}>
          <h3>عدد الطلبات</h3>
          <p>
            <CountUp end={summary.totalOrders} duration={1.5} separator="," />
          </p>
        </div>
        <div className={styles.card}>
          <h3>معدل الإلغاء</h3>
          <p>
            <CountUp
              end={parseFloat(
                String(summary.cancellationRate).replace("%", "")
              )}
              duration={1.5}
              separator=","
              suffix="%"
              decimals={1}
            />
          </p>
        </div>
      </div>

      <div>
        {loading ? (
          <p>جاري تحميل البيانات...</p>
        ) : (
          <>
            <div className={styles.charts_content_container}>
              <div className={styles.line_bar_container}>
                <div className={styles.chartContainer}>
                  <h4> تغير عدد الطلبات يوميًا</h4>
                  <Line data={lineChartData} />
                </div>

                <div className={styles.chartContainer}>
                  <h4> مقارنة مقدمي الخدمة</h4>
                  <Bar data={barChartData} />
                </div>
              </div>
              <div className={styles.user_map_container}>
                <UserMap
                  data={saudiUserData}
                  title="خريطة توزيع المستخدمين في مدن السعودية"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.tables_container}>
        <Table
          title=" الطلبات الأخيرة"
          columns={["رقم الطلب", "العميل", "الخدمة", "التاريخ"]}
          data={filteredOrders}
        />
        <Table
          title=" مقدمو الخدمة الأعلى تقييمًا"
          columns={["الاسم", "التقييم", "عدد التقييمات"]}
          data={topRatedProviders}
        />
      </div>
    </div>
  );
}

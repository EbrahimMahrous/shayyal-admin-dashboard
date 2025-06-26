// ** Style
import styles from "../../styles/Pages/Admin/Statistics.module.css";
// ** Assets
// ** Hooks
import { useEffect, useState } from "react";
// ** ChartJs
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Stat {
  id: number;
  title: string;
  value: number;
  unit: string;
}

export default function Statistics() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    setStats([
      { id: 1, title: "عدد الطلبات", value: 120, unit: "طلب" },
      { id: 2, title: "الإجمالي", value: 5600, unit: "ر.س" },
      { id: 3, title: "عدد المستخدمين", value: 340, unit: "مستخدم" },
    ]);
  }, []);

  const chartData = {
    labels: stats.map((s) => s.title),
    datasets: [
      {
        label: "القيمة",
        data: stats.map((s) => s.value),
        backgroundColor: ["#026aa2", "#3cba9f", "#e8c3b9"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "الرسم البياني للإحصائيات",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.container} dir="rtl">
      <h2 className={styles.title}>الإحصائيات العامة</h2>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.card}>
            <h3 className={styles.statTitle}>{stat.title}</h3>
            <p className={styles.statValue}>
              {stat.value} <span>{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

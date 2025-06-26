// ** Style
import styles from "../../styles/Pages/LandingPage/Features.module.css";
// ** Assets
// ** Hooks

const featuresData = [
  "لوحة تحكم ديناميكية وسهلة الاستخدام",
  "متابعة الطلبات والحجوزات لحظيًا",
  "إشعارات فورية لتنبيهات النظام",
  "تحليلات وتقارير مفصّلة لأداء التطبيق",
  "دعم فني مباشر وتحديثات مستمرة",
  "تصميم متجاوب يعمل على كل الأجهزة",
];

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          مميزات <span>شيّال</span>
        </h2>
        <ul className={styles.featuresList}>
          {featuresData.map((feature, index) => (
            <li
              key={index}
              className={styles.featureItem}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className={styles.bullet}></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

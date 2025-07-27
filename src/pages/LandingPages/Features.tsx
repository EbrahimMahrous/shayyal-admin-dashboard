// ** Style
import styles from "../../styles/Pages/LandingPage/Features.module.css";

const featuresData = [
  "منصة سهلة الاستخدام بواجهة عربية مبسطة.",
  "لوحة تحكم تفاعلية تتيح متابعة الطلبات والحجوزات لحظيًا.",
  "إشعارات فورية لتنبيه السائقين والعملاء.",
  "نظام تقييم ومراجعات لتحسين الجودة باستمرار.",
  "تقارير وتحليلات مفصلة لأداء الخدمات.",
  "دعم فني متوفر على مدار الساعة.",
  "تصميم متجاوب يعمل على جميع الأجهزة.",
  "دمج تقنيات الذكاء الاصطناعي والتتبع لتجربة أكثر ذكاء وفعالية.",
];

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          مميزات <span className={styles.brand}>OTM</span>
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

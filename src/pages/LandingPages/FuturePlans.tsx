// ** Style
import styles from "../../styles/Pages/LandingPage/FuturePlans.module.css";

const plans = [
  "إطلاق تطبيق خاص لسائقي النقل بواجهة مخصصة وسهلة الاستخدام.",
  "إضافة وسائل دفع إلكتروني متعددة لتسهيل المعاملات وتحسين تجربة المستخدم.",
  "التوسع الجغرافي لتغطية مزيد من المدن والمناطق داخل المملكة وخارجها.",
  "تكامل ذكي مع منصات الطرف الثالث (APIs) لتحسين سير العمليات.",
  "استخدام الذكاء الاصطناعي في التوصيات وتحسين التتبع وتحليل البيانات.",
  "توفير أدوات تحليلية متقدمة للمشرفين لمتابعة الأداء واتخاذ قرارات فعالة.",
];

export default function FuturePlans() {
  return (
    <section className={styles.plansSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          خططنا <span>المستقبلية</span>
        </h2>
        <p className={styles.subtitle}>
          في <strong>OTM</strong> نعمل باستمرار على تطوير خدماتنا لتلبية احتياجات السوق ومواكبة التطورات التقنية.
        </p>
        <ul className={styles.plansList}>
          {plans.map((plan, index) => (
            <li
              key={index}
              className={styles.planItem}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

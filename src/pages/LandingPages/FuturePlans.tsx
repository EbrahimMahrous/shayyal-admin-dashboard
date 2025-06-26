// ** Style
import styles from "../../styles/Pages/LandingPage/FuturePlans.module.css";
// ** Assets
// ** Hooks

const plans = [
  "إطلاق تطبيق خاص بالمزودين بواجهة مخصصة لهم",
  "إضافة وسائل دفع إلكتروني متعددة لتسهيل عمليات الدفع",
  "توسيع النطاق الجغرافي لخدمة أكبر عدد من المستخدمين",
  "تكامل ذكي مع منصات الطرف الثالث (APIs)",
  "تحسين تجربة المستخدم باستخدام الذكاء الاصطناعي والتعلم الآلي",
];

export default function FuturePlans() {
  return (
    <section className={styles.plansSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          رؤيتنا <span>المستقبلية</span>
        </h2>
        <p className={styles.subtitle}>
          نحن نعمل على تطوير مستمر لتقديم تجربة أفضل وأكثر تكاملًا لعملائنا.
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

// ** Style
import styles from "../../styles/Pages/LandingPage/HowItWorks.module.css";
// ** Assets
// ** Hooks

const steps = [
  "يقوم العميل بإنشاء طلب جديد من خلال التطبيق بسهولة.",
  "يتم إرسال إشعارات فورية للمزودين الأقرب للعميل.",
  "يختار المزود تنفيذ الطلب ويحدد موعد الخدمة.",
  "يمكن للمسؤول متابعة الطلب عبر لوحة التحكم التفاعلية.",
  "بعد إتمام الخدمة، يُقيّم العميل التجربة ويتم إغلاق الطلب.",
];

export default function HowItWorks() {
  return (
    <section className={styles.howSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          كيف يعمل تطبيق <span>شيّال؟</span>
        </h2>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={styles.stepCard}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <p className={styles.stepText}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ** Style
import styles from "../../styles/Pages/LandingPage/HowItWorks.module.css";

const steps = [
  "يقوم العميل بإنشاء طلب جديد من خلال تطبيق OTM بسهولة.",
  "يتم إرسال إشعارات فورية إلى أقرب السائقين المتاحين.",
  "يختار السائق تنفيذ الطلب ويحدد موعد الخدمة المناسب.",
  "يمكن للمسؤول متابعة الطلبات لحظيًا من لوحة التحكم.",
  "بعد إتمام الخدمة، يقيّم العميل التجربة ويتم إغلاق الطلب.",
];

export default function HowItWorks() {
  return (
    <section className={styles.howSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          كيف يعمل تطبيق <span>OTM؟</span>
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

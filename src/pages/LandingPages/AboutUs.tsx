// ** Style
import styles from "../../styles/Pages/LandingPage/AboutUs.module.css";
// ** Assets
// ** Hooks

export default function AboutUs() {
  return (
    <section className={styles.aboutUsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>من نحن</h2>

        <p className={styles.description}>
          <span className={styles.brand}>شيّال</span> هو أكثر من مجرد نظام
          توصيل... نحن نمكّن الأفراد والشركات من إدارة عملياتهم بكل سلاسة
          واحترافية. نقدم منصة تقنية متكاملة تساعد على تتبع الطلبات، التواصل
          الفوري، وتحسين الكفاءة التشغيلية.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>رؤيتنا</h3>
            <p>
              أن نصبح الخيار الأول في العالم العربي لإدارة خدمات النقل والتوصيل
              باستخدام التكنولوجيا الذكية والواجهات البسيطة.
            </p>
          </div>

          <div className={styles.card}>
            <h3>رسالتنا</h3>
            <p>
              تمكين المستخدم من السيطرة الكاملة على عملياته من خلال تجربة رقمية
              سلسة مدعومة بأدوات قوية وسهلة الاستخدام.
            </p>
          </div>

          <div className={styles.card}>
            <h3>فريقنا</h3>
            <p>
              يضم فريق شيّال نخبة من المطورين، المصممين، وخبراء تجربة المستخدم
              الذين يعملون بروح واحدة لتقديم منتج يليق بك.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

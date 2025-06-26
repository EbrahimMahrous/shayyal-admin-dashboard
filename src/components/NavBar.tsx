// ** Styles
import styles from "../styles/Components/NavBar.module.css";
// ** Assets
import shayyalLogo from "../assets/Pages/shayyalLogo.png";
// ** Hooks
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about-us" },
    { name: "مميزات شيّال", path: "/features" },
    { name: "كيف يعمل التطبيق؟", path: "/how-it-works" },
    { name: "ما نخطط له مستقبلاً", path: "/future-plans" },
  ];

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className={
                  location.pathname === link.path ? styles.active : undefined
                }
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.logo} onClick={() => navigate("/")}>
          <img src={shayyalLogo} alt="Shayyal Logo" />
        </div>
      </nav>
    </div>
  );
}

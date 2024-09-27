import styles from "./Header.module.css";
import Logo from "../../assets/logo.png";
import LoginImage from "../../assets/login.png";

export default function Header_a() {
  return (
    <header className={styles.header}>
      <div className={styles.header_logo}>
        <img src={Logo} className={styles.header_logo_image} alt="logo" />
        <p className={styles.header_logo_text}>TripMate</p>
      </div>
      <div className={styles.header_login}>
      <a to="/mytrip" className={styles.header_mytrip_text}>
          내 여행
        </a>
        <img src={LoginImage} className={styles.header_login_image} alt="login" />
      </div>
    </header>
  );
}

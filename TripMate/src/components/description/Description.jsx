import styles from "./Description.module.css";
import DescImage from "../../assets/desc_image.png";

export default function Description() {
  return (
    <section className={styles.desc}>
      <section className={styles.desc_left}>
        <h1 className={styles.desc_header}>
          여행준비의 모든것, <br /> TripMate와 함께!
        </h1>
        <button className={styles.desc_button}>PLAN!!</button>
      </section>
      <section>
        <img src={DescImage} className={styles.desc_image}></img>
      </section>
    </section>
  );
}

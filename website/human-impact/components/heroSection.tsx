import React from "react";
import styles from "../styles/hero.module.css";
import ReactPlayer from 'react-player';

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
        <div className={styles.placeholder}>
          <ReactPlayer url="https://youtu.be/W7BKrR6d35M" playing loop controls/>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.textContainer}>
              <h1>A sensible ecosystem</h1>
              <p className={styles.text}>We want to make people aware of the active influence people have on other ecosystems in which they themselves normally only passively participate. By asking users to pollute a system with artificial intelligence, we want them to develop a greater sense of responsibility.</p>
              <p className={styles.text}>Our project simulates an artificial ecosystem in which users can disturb the delicate balance of life, reflecting the damaging effects of humanity on the fragile ecosystems of the earth.</p>
          </div>
              {/* <button className={styles.button}>Simulation starten</button> */}
        </div>
    </div>
  );
};

export default HeroSection;
"use client";
import React from 'react';
import Navigation from '../components/Navigation';
import styles from '../styles/page.module.css';
import HeroSection from '../components/heroSection';
import SimulationElements from '../components/simulationElements';
import Footer from '../components/footer';

const Page = () => {
  return (
    <div className={styles.body}>
      <Navigation/>
      <div className={styles.page}>
        <HeroSection/>
        <SimulationElements/>
        <Footer/>
      </div>
    </div>
  );
};

export default Page;
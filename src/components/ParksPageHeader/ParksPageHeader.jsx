import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ParksPageHeader.module.css';

const ParksPageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Discover America's National Parks</h1>
        <p className={styles.heroDescription}>
          Explore the most breathtaking natural wonders across the United States.
        </p>
        <div className={styles.heroActions}>
          <button
            className={`${styles.heroButton} ${styles.exploreButton}`}
            onClick={() => navigate('/parks')}
          >
            Start Exploring
          </button>
          <button
            className={`${styles.heroButton} ${styles.planButton}`}
            onClick={() => navigate('/itineraries/new')}
          >
            Plan Your Trip
          </button>
        </div>
      </div>
      <div className={styles.heroBackground}>
        <div className={styles.heroGradient} />
        <div className={styles.heroImage} />
      </div>
    </div>
  );
};

export default ParksPageHeader;

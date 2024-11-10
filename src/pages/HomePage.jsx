import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './styles/HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      
      <div className={styles.content}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>
            Discover National Parks
          </h1>
          <p className={styles.subtitle}>
            Explore America's natural wonders and plan your next adventure
          </p>
          <div className={styles.buttonContainer}>
            <button
              onClick={() => navigate('/parks')}
              className={styles.primaryButton}
            >
              Start Exploring
            </button>
            <button
              onClick={() => navigate('/itineraries')}
              className={styles.secondaryButton}
            >
              Plan Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
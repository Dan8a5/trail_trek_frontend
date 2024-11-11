import { useNavigate } from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import styles from './styles/HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className={`w-full min-h-screen relative ${styles.container}`}>
      <div className={`w-full ${styles.navbar}`}>
        <Navbar />
      </div>
      <main className={`flex-1 flex items-center justify-center px-4 ${styles.content}`}>
        <div className={`max-w-4xl mx-auto text-center ${styles.heroText}`}>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${styles.title}`}>
            Discover National Parks
          </h1>
          <p className={`text-xl md:text-2xl mb-8 ${styles.subtitle}`}>
            Explore America's natural wonders and plan your next adventure
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${styles.buttonContainer}`}>
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
      </main>
    </div>
  );
};

export default HomePage;
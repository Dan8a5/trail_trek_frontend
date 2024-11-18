import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Map } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import styles from "./styles/HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={`w-full min-h-screen relative ${styles.container}`}>
      <div className={styles.shapes}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>

      <div className={`w-full ${styles.navbar}`}>
        <Navbar />
      </div>

      <main
        className={`flex-1 flex items-center justify-center px-4 ${styles.content}`}
      >
        <div className={`max-w-4xl mx-auto text-center ${styles.heroText}`}>
          <div className={styles.iconContainer}>
            <Compass className={styles.icon} size={48} />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#708090] to-[#FAFAD2] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Discover National Parks
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#FAFAD2] to-[#708090] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Plan Your Perfect National Park Getaway with AI-Powered Itineraries
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>63</span>
              <span className={styles.statLabel}>National Parks</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>18K+</span>
              <span className={styles.statLabel}>Miles of Trails</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>300M+</span>
              <span className={styles.statLabel}>Annual Visitors</span>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${styles.buttonContainer}`}
          >
            <button
              onClick={() => navigate("/parks")}
              className={styles.primaryButton}
            >
              <span>Start Exploring</span>
              <ArrowRight className={styles.buttonIcon} size={20} />
            </button>
            <button
              onClick={() => navigate("/itineraries")}
              className={styles.secondaryButton}
            >
              <Map size={20} />
              <span>Plan Trip</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

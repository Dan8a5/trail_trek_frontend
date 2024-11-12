import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import styles from './ParksPage.module.css';


const ParksPage = () => {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch('http://localhost:8000/parks');
        const data = await response.json();
        setParks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parks:', error);
        setLoading(false);
      }
    };
    fetchParks();
  }, []);

  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    park.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.hero} style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)'
      }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover National Parks
          </h1>
          <p className="text-xl text-white mb-8">
            Explore America's natural wonders and plan your next adventure
          </p>
          <button 
            onClick={() => navigate('/parks')} 
            className="btn btn-primary btn-sm lg:btn-md"
          >
            Explore Parks
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Search national parks..." 
            className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.parksGrid}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"/>
          </div>
        ) : filteredParks.length > 0 ? (
          filteredParks.map(park => (
            <div key={park.id} className={styles.parkCard}>
              <div style={{ padding: '1.5rem' }}>
                <h2 className="text-xl font-bold text-white mb-3">
                  {park.name}
                </h2>
                <p className="text-gray-400 mb-4">
                  {park.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Park Code: {park.parkcode}
                </p>
                <button 
                  onClick={() => navigate(`/parks/${park.parkcode}`)}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-full transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'white' }}>
            No parks found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ParksPage;

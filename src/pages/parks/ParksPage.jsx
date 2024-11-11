import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import styles from '../styles/ParksPage.module.css';

const ParksPage = () => {
  const [parks, setParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        // Update fetch URL to use full URL for local backend
        const response = await fetch('http://localhost:8000/parks');
        const data = await response.json();
        console.log("Fetched parks data:", data);  // Check the data here
        setParks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parks:', error);
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  // Filter parks based on search query
  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    park.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-theme="forest" className={styles.container}>
      <Navbar />
      <div className={styles.flexContainer}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className="max-w-md">
              <h1 className="mb-5 text-3xl lg:text-5xl font-bold">Discover National Parks</h1>
              <p className="mb-5 text-sm lg:text-base">Explore America's natural wonders and plan your next adventure</p>
              <button className="btn btn-primary">Start Exploring</button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search national parks..." 
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
              />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Parks Grid */}
        <div className="flex-grow p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className={styles.parksGrid}>
              {filteredParks.length > 0 ? (
                filteredParks.map(park => (
                  <div key={park.id} className={styles.parkCard}>
                    <div className="card-body">
                      <h2 className="card-title text-lg lg:text-xl">{park.name}</h2>
                      <p className="text-sm lg:text-base line-clamp-3">{park.description}</p>
                      <p className="text-xs lg:text-sm text-gray-500">Park Code: {park.parkcode}</p>
                      <div className="card-actions justify-end mt-4">
                        <button className="btn btn-primary btn-sm lg:btn-md">View Details</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No parks found for your search.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParksPage;

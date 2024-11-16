import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Info, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from "../../components/layout/Navbar";
import styles from './ParksPage.module.css';

const ParksPage = () => {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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

  // Get unique states from parks
  const states = [...new Set(parks.map(park => park.state))].sort();

  // Filter and sort parks
  const filteredParks = parks
    .filter(park =>
      (selectedState === 'all' || park.state === selectedState) &&
      (park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       park.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'state') return a.state.localeCompare(b.state);
      return 0;
    });

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.gradientText}>Discover National Parks</div>
          <p className="text-xl text-white/80 mb-8 max-w-2xl text-center">
            Explore America's natural wonders and plan your next adventure
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/parks')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all transform hover:-translate-y-1"
            >
              Start Exploring
            </button>
            <button 
              onClick={() => navigate('/itineraries/new')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-1"
            >
              Plan Your Trip
            </button>
          </div>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search national parks..." 
                className="w-full bg-[#121212] rounded-lg p-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-[#121212] text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121212] text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="name">Sort by Name</option>
              <option value="state">Sort by State</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.parksGrid}>
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : filteredParks.length > 0 ? (
          filteredParks.map(park => (
            <div key={park.id} className={styles.parkCard}>
              <div className="p-6 flex flex-col h-full">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin className="text-green-500" size={20} />
                  {park.name}
                </h2>
                <p className="text-gray-400 mb-4 flex-grow">
                  {park.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Info size={16} />
                    {park.parkcode}
                  </span>
                  <span>{park.state}</span>
                </div>
                <button 
                  onClick={() => navigate(`/parks/${park.parkcode}`)}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                  View Details
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-white p-8 bg-[#1a1a1a] rounded-lg">
            No parks found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ParksPage;
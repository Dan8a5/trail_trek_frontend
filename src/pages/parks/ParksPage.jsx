import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const ParksPage = () => {
  const [parks, setParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/parks');
        const data = await response.json();
        console.log('Raw API response:', data);
        setParks(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parks:', error);
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  const filteredParks = Array.isArray(parks) ? parks.filter(park => 
    park.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div data-theme="forest" className="min-h-screen">
      <Navbar />
      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="hero min-h-[40vh] lg:min-h-[60vh] bg-base-200" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content px-4">
            <div className="max-w-md">
              <h1 className="mb-5 text-3xl lg:text-5xl font-bold">Discover National Parks</h1>
              <p className="mb-5 text-sm lg:text-base">Explore America's natural wonders and plan your next adventure</p>
              <button className="btn btn-primary">Start Exploring</button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full px-4 py-6 lg:py-8">
          <div className="form-control max-w-xl mx-auto">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search national parks..." 
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
              {filteredParks.map(park => (
                <div key={park.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="card-body">
                    <h2 className="card-title text-lg lg:text-xl">{park.name}</h2>
                    <p className="text-sm lg:text-base line-clamp-3">{park.description}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Park Code: {park.parkcode}</p>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary btn-sm lg:btn-md">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParksPage;

<div className="container mx-auto px-4 max-w-7xl">
  // Content here
</div>

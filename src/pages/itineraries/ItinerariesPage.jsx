import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const ItinerariesPage = () => {
  const [parks, setParks] = useState([]);
  const [parkCode, setParkCode] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Added end date
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const fetchParks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/parks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setParks(data);
    };
    
    fetchParks();
  }, []);

  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_preferences: {
            parkcode: parkCode,
            start_date: startDate,
            end_date: endDate, // Using end date in the request
            num_days: 3,
            fitness_level: "moderate",
            preferred_activities: ["hiking", "photography"],
            visit_season: "winter"
          }
        })
      });
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-[500px] space-y-10">
          <h1 className="text-5xl font-bold text-white text-center mt-8">
            Plan Your Park Adventure
          </h1>

          <div className="space-y-6">
            <div className="relative">
              <select 
                className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
                value={parkCode}
                onChange={(e) => setParkCode(e.target.value)}
              >
                <option value="">Select a Park</option>
                {parks.map(park => (
                  <option key={park.id} value={park.parkcode}>
                    {park.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <textarea 
              className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none min-h-[120px] text-gray-300"
              placeholder="Describe your trip details (e.g., 'Looking for a 3-day trip focused on hiking and wildlife viewing, moderate difficulty level, interested in scenic spots')"
              value={tripDetails}
              onChange={(e) => setTripDetails(e.target.value)}
            />

            {/* Date inputs container */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Start Date</label>
                <input 
                  type="date" 
                  className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">End Date</label>
                <input 
                  type="date" 
                  className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate} // Prevents selecting end date before start date
                />
              </div>
            </div>

            <button 
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 rounded-full transition-colors"
              onClick={handleGenerateItinerary}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </div>

          {itinerary && (
            <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg text-white">
              <h2 className="text-xl font-bold mb-4">{itinerary.title}</h2>
              <div className="whitespace-pre-line">
                {itinerary.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItinerariesPage;
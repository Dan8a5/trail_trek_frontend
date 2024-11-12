import { useState, useEffect } from 'react';
import Navbar from "../../components/layout/Navbar/Navbar";

const ItinerariesPage = () => {
  const [parks, setParks] = useState([]);
  const [parkCode, setParkCode] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/parks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch parks');
        }
        const data = await response.json();
        setParks(data);
      } catch (error) {
        console.error('Error fetching parks:', error);
        setError('Failed to load parks. Please try again later.');
      }
    };
    
    fetchParks();
  }, []);

  const handleGenerateItinerary = async () => {
    if (!parkCode) {
      setError('Please select a park');
      return;
    }

    // Calculate number of days between start and end date
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formattedStartDate = start.toISOString().split('T')[0];
      const formattedEndDate = end.toISOString().split('T')[0];
      
      const requestBody = {
        parkcode: parkCode,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        num_days: diffDays,
        fitness_level: "moderate",
        preferred_activities: ["hiking", "photography"],
        visit_season: "winter"
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('http://127.0.0.1:8000/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (!response.ok) {
        // Handle validation errors specifically
        if (response.status === 422) {
          const errorDetail = data.detail || [];
          const errorMessages = errorDetail.map(error => 
            `${error.loc.join('.')} - ${error.msg}`
          ).join('\n');
          throw new Error(`Validation Error:\n${errorMessages}`);
        }
        throw new Error(data.detail || 'Failed to generate itinerary');
      }

      setItinerary(data);
    } catch (error) {
      console.error('Full error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[500px] space-y-10">
          <h1 className="text-5xl font-bold text-white text-center mt-8">
            Plan Your Park Adventure
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 whitespace-pre-line">
              {error}
            </div>
          )}

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Start Date</label>
                <input 
                  type="date" 
                  className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">End Date</label>
                <input 
                  type="date" 
                  className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
            </div>

            <button 
              className={`w-full ${loading ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'} 
                text-black font-semibold py-4 rounded-full transition-colors`}
              onClick={handleGenerateItinerary}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </div>

          {itinerary && (
            <div className="mt-8 p-6 bg-[#1a1a1a] rounded-lg text-white">
              <h2 className="text-2xl font-bold mb-4">{itinerary.title}</h2>
              <div className="whitespace-pre-line text-gray-300">
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
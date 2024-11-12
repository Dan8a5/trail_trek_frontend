import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar/Navbar";

const ItinerariesPage = () => {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [parkCode, setParkCode] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [fitnessLevel, setFitnessLevel] = useState('moderate');
  const [activities, setActivities] = useState(['hiking', 'photography']);
  const [season, setSeason] = useState('summer');

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

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formattedStartDate = startDate;
      const formattedEndDate = endDate;
      
      const requestBody = {
        parkcode: parkCode,
        start_date: startDate,  // Already in YYYY-MM-DD format
        end_date: endDate,      // Already in YYYY-MM-DD format
        num_days: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1,
        fitness_level: fitnessLevel,
        preferred_activities: activities,
        visit_season: season
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

            <div className="relative">
              <select 
                className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
              >
                <option value="">Select Fitness Level</option>
                {['easy', 'moderate', 'challenging'].map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">Preferred Activities</label>
              <div className="grid grid-cols-2 gap-4">
                {['hiking', 'sightseeing', 'photography', 'wildlife viewing', 'camping', 'fishing'].map(activity => (
                  <label key={activity} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary bg-[#1a1a1a]"
                      checked={activities.includes(activity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActivities([...activities, activity]);
                        } else {
                          setActivities(activities.filter(a => a !== activity));
                        }
                      }}
                    />
                    <span>{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative">
              <select 
                className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                <option value="">Select Season</option>
                {['spring', 'summer', 'fall', 'winter'].map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
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

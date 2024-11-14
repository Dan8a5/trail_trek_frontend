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

  // Set initial state for fitness level and season
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [activities, setActivities] = useState([]);
  const [season, setSeason] = useState('');

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
        start_date: startDate,
        end_date: endDate,
        num_days: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1,
        fitness_level: fitnessLevel,
        preferred_activities: activities,
        visit_season: season,
        trip_details: tripDetails
      };

      const response = await fetch('http://127.0.0.1:8000/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async () => {
    if (!itinerary) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/itineraries/save_new_itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: itinerary.title || `${parkCode} Trip`,
          description: itinerary.description || '',
          park_code: parkCode,
          start_date: startDate,
          end_date: endDate,
          fitness_level: fitnessLevel,
          preferred_activities: activities,
          visit_season: season,
          trip_details: tripDetails || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Server response:', data);
        throw new Error(data.detail || 'Failed to save itinerary');
      }

      alert('Itinerary saved successfully to your profile!');
    } catch (error) {
      setError(error.message);
      console.log('Error saving itinerary:', error);
    }
  };

  const downloadPDF = async (itineraryId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://127.0.0.1:8000/itineraries/${itineraryId}/pdf`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          }
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary_${itineraryId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setError(null);

    } catch (error) {
      setError(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[500px] space-y-10">
          <h1 className="text-5xl font-bold text-white text-center mt-10">
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
            </div>

            <div className="relative">
              <select
                className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
              >
                <option value="">Select your fitness level</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="Dificult">Difficult</option>
              </select>
            </div>

            <div className="relative">
              <select
                className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                <option value="">Select a season</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            <div className="flex gap-4">
              <input
                type="date"
                className="flex-1 bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="flex-1 bg-[#1a1a1a] rounded-lg p-4 text-white focus:outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="relative">
              <textarea
                className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
                placeholder="Tell us more about your trip preferences..."
                value={tripDetails}
                onChange={(e) => setTripDetails(e.target.value)}
                rows="4"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['hiking', 'photography', 'camping', 'wildlife viewing'].map(activity => (
                <label key={activity} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-green-500"
                    checked={activities.includes(activity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setActivities([...activities, activity]);
                      } else {
                        setActivities(activities.filter(a => a !== activity));
                      }
                    }}
                  />
                  <span className="ml-2 text-white capitalize">{activity}</span>
                </label>
              ))}
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
              <div className="whitespace-pre-line text-gray-300 mb-4">
                {itinerary.description}
              </div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-4 rounded-full transition-colors"
                onClick={saveItinerary}
              >
                Save to Profile
              </button>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 rounded-full transition-colors mt-4"
                onClick={() => downloadPDF(itinerary.id)}
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItinerariesPage;

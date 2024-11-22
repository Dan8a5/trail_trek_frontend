import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ItineraryForm from '../../components/itineraries/ItineraryForm';


const ParkDetailPage = () => {
  const { parkCode } = useParams();
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchParkDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/parks/${parkCode}`);
        const data = await response.json();
        setPark(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching park details:', error);
        setLoading(false);
      }
    };

    fetchParkDetails();
  }, [parkCode]);

  const handleItinerarySubmit = async (preferences) => {
    try {
      const formattedPreferences = {
        ...preferences,
        start_date: new Date(preferences.start_date).toISOString().split('T')[0],
        end_date: new Date(preferences.end_date).toISOString().split('T')[0]
      };

      const response = await fetch('http://127.0.0.1:8000/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedPreferences)
      });
      const data = await response.json();
      console.log('Itinerary created:', data);
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Park Details Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl">{park?.name}</h2>
              <p className="text-lg mt-4">{park?.description}</p>
              {/* Add more park details as needed */}
            </div>
          </div>

          {/* Itinerary Form Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ItineraryForm parkCode={parkCode} onSubmit={handleItinerarySubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkDetailPage;

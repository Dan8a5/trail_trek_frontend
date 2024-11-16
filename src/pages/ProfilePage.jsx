import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import styles from './styles/Gradient.module.css';

const ProfilePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();

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

    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/itineraries/${itineraryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setItineraries(prevItineraries => 
          prevItineraries.filter(itinerary => itinerary.id !== itineraryId)
        );
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  const startEditing = (itinerary) => {
    setEditingId(itinerary.id);
    setEditedTitle(itinerary.title);
    setEditedDescription(itinerary.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTitle('');
    setEditedDescription('');
  };

  const saveEdits = async (itineraryId) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/itineraries/${itineraryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription
        })
      });

      if (response.ok) {
        setItineraries(prevItineraries =>
          prevItineraries.map(itinerary =>
            itinerary.id === itineraryId
              ? { ...itinerary, title: editedTitle, description: editedDescription }
              : itinerary
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
    }
  };

  useEffect(() => {
    const fetchItineraries = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error("Error fetching itineraries:", error);
      } else {
        setItineraries(data);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div className={`min-h-screen w-screen flex flex-col ${styles.gradientBackground}`}>
      <Navbar />
      
      <div className="flex-1 px-4 pt-24 pb-16 overflow-auto">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Your Profile
          </h1>
          <h2 className="text-xl text-gray-400 mb-8 text-center">
            Saved Itineraries
          </h2>

          <div className="space-y-4">
            {itineraries.length > 0 ? (
              itineraries.map(itinerary => (
                <div key={itinerary.id} className="mt-8 p-6 bg-[#1a1a1a] rounded-lg text-white">
                  {editingId === itinerary.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none mb-4"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none mb-4"
                        rows="4"
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-full"
                          onClick={() => saveEdits(itinerary.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-4">{itinerary.title}</h2>
                      <p className="text-gray-400 mb-4">
                        {itinerary.start_date} - {itinerary.end_date}
                      </p>
                      <div className="whitespace-pre-line text-gray-300 mb-4">
                        {itinerary.description}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-full transition-colors"
                          onClick={() => startEditing(itinerary)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-black font-semibold py-3 rounded-full transition-colors"
                          onClick={() => downloadPDF(itinerary.id)}
                        >
                          Download PDF
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full transition-colors"
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">
                No saved itineraries found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

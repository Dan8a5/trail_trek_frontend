import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import styles from './styles/ProfilePage.module.css';

const ProfilePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

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
    <div className={styles.container}>
      <h1 className="text-3xl font-bold text-white mb-4">Your Profile</h1>
      <h2 className="text-xl text-white mb-6">Saved Itineraries</h2>
      <ul className="list-none p-0">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <li key={itinerary.id} className={styles.itineraryItem}>
              <h3 className={styles.itineraryTitle}>{itinerary.title}</h3>
              <p className={styles.itineraryDescription}>{itinerary.description}</p>
              <button
                className={styles.viewButton}
                onClick={() => navigate(`/itinerary/${itinerary.id}`)}
              >
                View Itinerary
              </button>
            </li>
          ))
        ) : (
          <p className="text-white">No saved itineraries found.</p>
        )}
      </ul>
    </div>
  );
};

export default ProfilePage;

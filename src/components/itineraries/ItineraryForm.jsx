import { useState } from 'react';

const ItineraryForm = ({ parkCode, onSubmit }) => {
  const [preferences, setPreferences] = useState({
    parkcode: parkCode,
    num_days: 1,
    fitness_level: 'moderate',
    preferred_activities: [],
    visit_season: 'summer',
    start_date: '',
    end_date: ''
  });

  const activities = [
    'hiking',
    'sightseeing',
    'photography',
    'wildlife viewing',
    'camping',
    'fishing'
  ];

  const fitnessLevels = ['easy', 'moderate', 'challenging'];
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Plan Your Visit</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(preferences);
      }} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Number of Days</span>
          </label>
          <input
            type="number"
            min="1"
            className="input input-bordered"
            value={preferences.num_days}
            onChange={(e) => setPreferences({...preferences, num_days: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Fitness Level</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={preferences.fitness_level}
            onChange={(e) => setPreferences({...preferences, fitness_level: e.target.value})}
          >
            {fitnessLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Activities</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map(activity => (
              <label key={activity} className="cursor-pointer label">
                <span className="label-text">{activity}</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={preferences.preferred_activities.includes(activity)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...preferences.preferred_activities, activity]
                      : preferences.preferred_activities.filter(a => a !== activity);
                    setPreferences({...preferences, preferred_activities: updated});
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Season</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={preferences.visit_season}
            onChange={(e) => setPreferences({...preferences, visit_season: e.target.value})}
          >
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={preferences.start_date}
            onChange={(e) => setPreferences({...preferences, start_date: e.target.value})}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={preferences.end_date}
            onChange={(e) => setPreferences({...preferences, end_date: e.target.value})}
          />
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">Generate Itinerary</button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;

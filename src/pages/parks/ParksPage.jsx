import { useState, useEffect } from 'react';

function ParksPage() {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/parks')
      .then(res => res.json())
      .then(data => {
        setParks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">National Parks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parks.map(park => (
          <div key={park.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{park.name}</h2>
              <p>{park.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParksPage;
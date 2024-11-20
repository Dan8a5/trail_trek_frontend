import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "../styles/Gradient.module.css";

const AVAILABLE_ACTIVITIES = [
  "hiking",
  "photography",
  "camping",
  "wildlife viewing",
  "scenic drives",
  "stargazing",
  "rock climbing",
  "kayaking",
  "fishing",
  "backpacking",
  "birdwatching",
  "ranger programs",
  "waterfalls viewing",
  "cave tours",
  "swimming",
  "biking",
  "horseback riding",
  "winter sports",
  "picnicking",
  "boating",
];

const getCurrentSeason = (date) => {
  const month = new Date(date).getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

const ItinerariesPage = () => {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [parkCode, setParkCode] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [activities, setActivities] = useState([]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    const startDateObj = new Date(newStartDate);
    const endDateObj = new Date(
      startDateObj.getFullYear(),
      startDateObj.getMonth() + 1,
      0
    );
    const formattedEndDate = endDateObj.toISOString().split("T")[0];
    setEndDate(formattedEndDate);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isActivitiesOpen && !event.target.closest(".activities-dropdown")) {
        setIsActivitiesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActivitiesOpen]);

  useEffect(() => {
    const fetchParks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://127.0.0.1:8000/parks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch parks");
        }
        const data = await response.json();
        setParks(data);
      } catch (error) {
        console.error("Error fetching parks:", error);
        setError("Failed to load parks. Please try again later.");
      }
    };

    fetchParks();
  }, []);

  const handleGenerateItinerary = async () => {
    if (!parkCode) {
      setError("Please select a park");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        parkcode: parkCode,
        start_date: startDate,
        end_date: endDate,
        num_days:
          Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
          ) + 1,
        fitness_level: fitnessLevel,
        preferred_activities: activities,
        visit_season: getCurrentSeason(startDate),
        trip_details: tripDetails,
      };

      const response = await fetch("http://127.0.0.1:8000/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const errorDetail = data.detail || [];
          const errorMessages = errorDetail
            .map((error) => `${error.loc.join(".")} - ${error.msg}`)
            .join("\n");
          throw new Error(`Validation Error:\n${errorMessages}`);
        }
        throw new Error(data.detail || "Failed to generate itinerary");
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/itineraries/save_new_itinerary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: itinerary.title || `${parkCode} Trip`,
            description: itinerary.description || "",
            park_code: parkCode,
            start_date: startDate,
            end_date: endDate,
            fitness_level: fitnessLevel,
            preferred_activities: activities,
            visit_season: getCurrentSeason(startDate),
            trip_details: tripDetails || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Server response:", data);
        throw new Error(data.detail || "Failed to save itinerary");
      }

      alert("Itinerary saved successfully to your profile!");
    } catch (error) {
      setError(error.message);
      console.log("Error saving itinerary:", error);
    }
  };

  const downloadPDF = async (itineraryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/itineraries/${itineraryId}/pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
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
    <div
      className={`min-h-screen w-screen flex flex-col ${styles.gradientBackground}`}
    >
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[500px] space-y-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#708090] to-[#FAFAD2] text-center mt-10">
            Plan Your Park Adventure
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 whitespace-pre-line text-sm font-normal">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <select
              className="w-full bg-[#1a1a1a] rounded-lg p-4 text-white appearance-none focus:outline-none"
              value={parkCode}
              onChange={(e) => setParkCode(e.target.value)}
            >
              <option value="">Select a Park</option>
              {parks
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((park) => (
                  <option key={park.id} value={park.parkcode}>
                    {park.name}
                  </option>
                ))}
            </select>

            <select
              className="w-full bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white appearance-none focus:outline-none text-sm font-normal transition-colors"
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
            >
              <option value="" className="text-gray-400 font-normal">
                Choose your adventure style
              </option>
              <option value="easy" className="font-normal">
                Casual Explorer
              </option>
              <option value="moderate" className="font-normal">
                Active Adventurer
              </option>
              <option value="Difficult" className="font-normal">
                Peak Challenger
              </option>
            </select>

            <div className="relative activities-dropdown">
              <div className="relative">
                <button
                  onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}
                  className="w-full bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white focus:outline-none flex justify-between items-center text-sm font-normal transition-colors"
                >
                  <span
                    className={`${
                      activities.length === 0 ? "text-gray-400" : "text-white"
                    } font-normal`}
                  >
                    {activities.length === 0
                      ? "Select preferred activities"
                      : `${activities.length} activities selected`}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isActivitiesOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isActivitiesOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search activities..."
                        className="w-full p-2 bg-[#252525] hover:bg-[#2f2f2f] text-white rounded-lg focus:outline-none text-sm font-normal transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {AVAILABLE_ACTIVITIES.filter((activity) =>
                        activity
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ).map((activity) => (
                        <label
                          key={activity}
                          className={`flex items-center px-4 py-2 hover:bg-[#252525] cursor-pointer transition-colors ${
                            activities.includes(activity)
                              ? "bg-green-500/20"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-600 focus:ring-green-500 focus:ring-offset-0"
                            checked={activities.includes(activity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setActivities([...activities, activity]);
                              } else {
                                setActivities(
                                  activities.filter((a) => a !== activity)
                                );
                              }
                            }}
                          />
                          <span className="ml-3 text-white capitalize text-sm font-normal">
                            {activity
                              .split("/")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join("/")}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-700">
                      <button
                        onClick={() => setIsActivitiesOpen(false)}
                        className="w-full px-4 py-2 bg-[#10B981] hover:bg-[#0EA472] text-black rounded-lg transition-colors text-sm font-normal"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {activities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activities.map((activity) => (
                    <span
                      key={activity}
                      className="inline-flex items-center bg-green-500/20 text-white px-3 py-1 rounded-full text-sm font-normal"
                    >
                      {activity.charAt(0).toUpperCase() + activity.slice(1)}
                      <button
                        onClick={() =>
                          setActivities(
                            activities.filter((a) => a !== activity)
                          )
                        }
                        className="ml-2 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <input
                type="date"
                className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white focus:outline-none text-sm font-normal transition-colors"
                value={startDate}
                onChange={handleStartDateChange}
              />
              <input
                type="date"
                className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white focus:outline-none text-sm font-normal transition-colors"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <textarea
              className="w-full bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white appearance-none focus:outline-none text-sm font-normal transition-colors"
              placeholder="Tell us more about your trip preferences..."
              value={tripDetails}
              onChange={(e) => setTripDetails(e.target.value)}
              rows="4"
            />

            <button
              className={`w-full ${
                loading ? "bg-green-700" : "bg-[#10B981] hover:bg-[#0EA472]"
              } 
   text-black font-semibold py-4 rounded-full transition-colors text-sm`}
              onClick={handleGenerateItinerary}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>
          </div>

          {itinerary && (
            <div className="mt-8 p-6 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg text-white transition-colors">
              <h2 className="text-2xl font-bold mb-4">{itinerary.title}</h2>
              <div className="whitespace-pre-line text-gray-300 mb-4 text-sm font-normal">
                {itinerary.description}
              </div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-4 rounded-full transition-colors text-sm"
                onClick={saveItinerary}
              >
                Save to Profile
              </button>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 rounded-full transition-colors mt-4 text-sm"
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

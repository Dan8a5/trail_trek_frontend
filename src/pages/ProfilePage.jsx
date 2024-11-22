import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import styles from "./styles/Gradient.module.css";

const ProfilePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const navigate = useNavigate();

  const downloadPDF = async (itineraryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/itineraries/${itineraryId}/pdf`,
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
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/itineraries/${itineraryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setItineraries((prevItineraries) =>
          prevItineraries.filter((itinerary) => itinerary.id !== itineraryId)
        );
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  const startEditing = (itinerary) => {
    setEditingId(itinerary.id);
    setEditedTitle(itinerary.title);
    setEditedDescription(itinerary.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  const saveEdits = async (itineraryId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/itineraries/${itineraryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedTitle,
            description: editedDescription,
          }),
        }
      );

      if (response.ok) {
        setItineraries((prevItineraries) =>
          prevItineraries.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  title: editedTitle,
                  description: editedDescription,
                }
              : itinerary
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating itinerary:", error);
    }
  };

  useEffect(() => {
    const fetchItineraries = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching itineraries:", error);
      } else {
        setItineraries(data);
      }
    };

    fetchItineraries();
  }, []);

  const [expandedId, setExpandedId] = useState(null);

  return (
    <div
      className={`min-h-screen w-screen flex flex-col ${styles.gradientBackground}`}
    >
      <Navbar />
      <div className="flex-1 px-4 pt-24 pb-16 overflow-auto">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Your Profile
          </h1>
          <h2 className="text-xl text-gray-400 mb-8 text-center">
            Saved Itineraries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.length > 0 ? (
              itineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className={`bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#303030] rounded-lg p-4 text-white cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-800 ${
                    expandedId === itinerary.id ? "col-span-full" : ""
                  }`}
                  onClick={() =>
                    setExpandedId(
                      expandedId === itinerary.id ? null : itinerary.id
                    )
                  }
                >
                  {editingId === itinerary.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full bg-[#121212] rounded-lg p-3 text-white focus:outline-none"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-[#121212] rounded-lg p-3 text-white focus:outline-none"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-[#10B981] hover:bg-[#0EA472] text-black font-semibold py-2 rounded-lg"
                          onClick={() => saveEdits(itinerary.id)}
                        >
                          Save
                        </button>

                        <button
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h2 className="text-lg font-bold">{itinerary.title}</h2>
                      <p className="text-sm text-gray-400">
                        {itinerary.start_date} - {itinerary.end_date}
                      </p>

                      {expandedId === itinerary.id ? (
                        <div className="whitespace-pre-line text-gray-300">
                          {itinerary.description}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {itinerary.description}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 rounded-lg transition duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(itinerary);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-sm py-2 rounded-lg transition duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPDF(itinerary.id);
                          }}
                        >
                          Download
                        </button>
                        <button
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm py-2 rounded-lg transition duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItinerary(itinerary.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
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

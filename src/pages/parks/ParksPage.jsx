import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, Loader2, LogIn } from "lucide-react";
import { animated, useSpring } from "@react-spring/web";
import Navbar from "../../components/layout/Navbar";
import styles from "./ParksPage.module.css";

const AnimatedBackground = () => {
  const [props, set] = useSpring(() => ({
    from: { scale: 1.1 },
    to: { scale: 1 },
    config: { duration: 10000 },
  }));

  return (
    <animated.div
      style={{
        ...props,
        backgroundImage: `url(https://images.unsplash.com/photo-1544572571-ab94fd872ce4?w=1920&q=80&auto=format&fit=crop)`,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.5,
        transform: props.scale.to((s) => `scale(${s})`),
      }}
    />
  );
};

const ParksPage = () => {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/parks`);
        const data = await response.json();
        
        const filteredParks = data
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(
            (park) =>
              park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              park.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        setParks(filteredParks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parks:", error);
        setLoading(false);
      }
    };
    fetchParks();
  }, []);

  const handleViewDetails = (park) => {
    window.open(park.official_website, "_blank");
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.hero}>
        <AnimatedBackground />
        <div className={styles.heroContent}>
          <animated.h1
            style={titleAnimation}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#708090] to-[#FAFAD2] mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          >
            National Parks Directory
          </animated.h1>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#FAFAD2] to-[#708090] mb-8 max-w-2xl text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Browse all 63 national parks with descriptions and official links
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/itineraries")}
              className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
              <MapPin className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
              Plan Your Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search national parks..."
                className="w-full bg-[#121212] rounded-lg p-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.parksGrid}>
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : parks.length > 0 ? (
          parks.map((park) => (
            <div key={park.id} className={styles.parkCard}>
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="text-[#10B981]" size={20} />

                    {park.name}
                  </h2>
                  <span className="text-gray-400 text-sm">{park.state}</span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {park.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {park.activities?.slice(0, 3).map((activity) => (
                    <span
                      key={activity}
                      className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-white"
                    >
                      {activity}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleViewDetails(park)}
                    className="w-full bg-[#10B981] hover:bg-[#0EA472] text-black font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    Visit Official Website
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-white p-8 bg-[#1a1a1a] rounded-lg">
            No parks found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ParksPage;

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ParksPage from "./pages/parks/ParksPage";
import ItinerariesPage from "./pages/itineraries/ItinerariesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/parks" element={<ParksPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />  {/* Profile route */}
      </Routes>
    </Router>
  );
}

export default App;

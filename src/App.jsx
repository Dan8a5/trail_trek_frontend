import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ParksPage from './pages/parks/ParksPage';
import ItinerariesPage from './pages/itineraries/ItinerariesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/parks" element={<ParksPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/" element={<ParksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
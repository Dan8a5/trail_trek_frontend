import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import ParksPage from './pages/parks/ParksPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/parks" element={<ParksPage />} />
        <Route path="/" element={<ParksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
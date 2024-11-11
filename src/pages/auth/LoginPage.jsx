import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Store the session token
      const token = data.session.access_token;
      localStorage.setItem('token', token);
      
      navigate('/parks');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-[400px]">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Trail Trek
          </h1>
          <h2 className="text-xl text-gray-400 mb-8 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="text-right">
              <button 
                type="button"
                className="text-green-500 hover:text-green-400"
                onClick={() => navigate('/reset-password')}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 rounded-full transition-colors ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button 
              type="button" 
              className="w-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold py-4 rounded-full transition-colors"
              onClick={() => navigate('/signup')}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
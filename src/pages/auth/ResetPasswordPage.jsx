import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      setMessage('Password reset link sent to your email');
    } catch (error) {
      setMessage(error.message);
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
            Reset Password
          </h2>

          {message && (
            <div className={`bg-${message.includes('sent') ? 'green' : 'red'}-500/10 border border-${message.includes('sent') ? 'green' : 'red'}-500 text-${message.includes('sent') ? 'green' : 'red'}-500 rounded-lg p-4 mb-6`}>
              {message}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <button 
              type="submit" 
              className={`w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 rounded-full transition-colors ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button 
              type="button" 
              className="w-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold py-4 rounded-full transition-colors"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
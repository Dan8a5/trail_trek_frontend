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
    <div data-theme="forest" className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-md glass bg-base-100">
        <div className="card-body px-4 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Reset Password</h1>
          <p className="text-lg sm:text-xl text-center text-accent mb-6 sm:mb-8">Enter your email to receive a reset link</p>
          
          {message && (
            <div className={`alert ${message.includes('sent') ? 'alert-success' : 'alert-error'} mb-4`}>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="form-control gap-4">
            <input 
              type="email"
              placeholder="Email"
              className="input input-bordered input-primary w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button"
              className="btn btn-outline btn-accent w-full"
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
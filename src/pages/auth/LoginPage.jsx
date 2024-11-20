import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import styles from '../styles/Gradient.module.css';

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
     const token = data.session.access_token;
     localStorage.setItem('token', token);
     navigate('/parks');
   } catch (error) {
     setError(error.message || "Failed to log in. Please try again.");
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <div className={`h-screen w-screen flex flex-col ${styles.gradientBackground}`}>
     <Navbar />
     
     <div className="flex-1 flex items-center justify-center px-4">
       <div className="w-full max-w-[400px] space-y-8">
         <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#708090] to-[#FAFAD2] text-center">
           Welcome Back
         </h1>

         {error && (
           <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 text-sm">
             {error}
           </div>
         )}

         <form onSubmit={handleLogin} className="space-y-4">
           <input 
             type="email" 
             placeholder="Email" 
             className="w-full bg-[#121212]/80 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required 
           />
           <input 
             type="password" 
             placeholder="Password" 
             className="w-full bg-[#121212]/80 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
           
           <button 
             type="submit" 
             className={`w-full ${isLoading ? 'bg-green-700' : 'bg-[#10B981] hover:bg-[#0EA472]'} 
               text-black font-semibold py-4 rounded-full transition-colors text-sm mt-6`}
             disabled={isLoading}
           >
             {isLoading ? 'Signing in...' : 'Sign In'}
           </button>

           <div className="mt-4 flex justify-between text-sm">
             <Link to="/reset-password" className="text-[#10B981] hover:text-[#0EA472]">
               Forgot Password?
             </Link>
             <Link to="/signup" className="text-[#10B981] hover:text-[#0EA472]">
               Create Account
             </Link>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
};

export default LoginPage;
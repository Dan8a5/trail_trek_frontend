import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import styles from '../styles/Gradient.module.css';

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
   <div className={`h-screen w-screen flex flex-col ${styles.gradientBackground}`}>
     <Navbar />
     
     <div className="flex-1 flex items-center justify-center px-4">
       <div className="w-[400px]">
         <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#708090] to-[#FAFAD2] text-center">
           Trail Trek
         </h1>
         <h2 className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#FAFAD2] to-[#708090] mb-8 text-center">
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
             className={`w-full ${isLoading ? 'bg-green-700' : 'bg-[#10B981] hover:bg-[#0EA472]'} 
               text-black font-semibold py-4 rounded-full transition-colors`}
             disabled={isLoading}
           >
             {isLoading ? 'Sending...' : 'Send Reset Link'}
           </button>
           <button 
             type="button" 
             className="w-full border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-black font-semibold py-4 rounded-full transition-colors"
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
import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import styles from '../styles/Gradient.module.css';

const SignupPage = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [fullName, setFullName] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);
 const navigate = useNavigate();

 const handleSignup = async (e) => {
   e.preventDefault();
   setError(null);
   if (password !== confirmPassword) {
     setError("Passwords don't match");
     return;
   }
   setIsLoading(true);
   try {
     const { error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         data: {
           full_name: fullName,
         }
       }
     });
     if (error) throw error;
     
     setSuccess(true);
     setTimeout(() => {
       navigate('/login');
     }, 2000);
   } catch (error) {
     setError(error.message);
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
           Create Account
         </h2>

         {error && (
           <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
             {error}
           </div>
         )}

         {success && (
           <div className="bg-green-500/20 border border-green-500 text-green-500 rounded-lg p-4 mb-6 text-center">
             Account created successfully! Redirecting to login...
           </div>
         )}

         <form onSubmit={handleSignup} className="space-y-6">
           <input 
             type="text"
             placeholder="Full Name"
             className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none"
             value={fullName}
             onChange={(e) => setFullName(e.target.value)}
             required
           />
           
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

           <input 
             type="password"
             placeholder="Confirm Password"
             className="w-full bg-[#121212] rounded-lg p-4 text-white focus:outline-none"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             required
           />

           <button 
             type="submit"
             className={`w-full ${isLoading ? 'bg-green-700' : 'bg-[#10B981] hover:bg-[#0EA472]'} 
               text-black font-semibold py-4 rounded-full transition-colors`}
             disabled={isLoading}
           >
             {isLoading ? 'Creating Account...' : 'Create Account'}
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

export default SignupPage;
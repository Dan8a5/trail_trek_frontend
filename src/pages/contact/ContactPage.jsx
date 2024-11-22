import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from '../styles/Gradient.module.css';

const ContactPage = () => {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   try {
     const response = await fetch('`${import.meta.env.VITE_API_URL}`iicontact', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ name, email, message })
     });
     if (response.ok) {
       setSuccess(true);
       setName('');
       setEmail('');
       setMessage('');
       setTimeout(() => navigate('/parks'), 2000);
     }
   } catch (error) {
     console.error('Error sending message:', error);
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className={`min-h-screen w-screen flex flex-col ${styles.gradientBackground}`}>
     <Navbar />
     <div className="flex-1 flex items-center justify-center px-4 py-8">
       <div className="w-full max-w-[500px] space-y-8">
         <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#708090] to-[#FAFAD2] text-center">
           Contact Us
         </h1>
         
         <form onSubmit={handleSubmit} className="space-y-6">
           <input
             type="text"
             placeholder="Your Name"
             className="w-full bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white appearance-none focus:outline-none text-sm font-normal transition-colors"
             value={name}
             onChange={(e) => setName(e.target.value)}
             required
           />
           
           <input
             type="email"
             placeholder="Your Email"
             className="w-full bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white appearance-none focus:outline-none text-sm font-normal transition-colors"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
           
           <textarea
             placeholder="Your Message"
             className="w-full bg-[#1a1a1a] hover:bg-[#252525] rounded-lg p-4 text-white appearance-none focus:outline-none text-sm font-normal transition-colors"
             rows="6"
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             required
           />
           
           <button
             type="submit"
             className={`w-full ${loading ? 'bg-green-700' : 'bg-[#10B981] hover:bg-[#0EA472]'} 
               text-black font-semibold py-4 rounded-full transition-colors text-sm`}
             disabled={loading}
           >
             {loading ? 'Sending...' : 'Send Message'}
           </button>
         </form>
         {success && (
           <div className="bg-green-500/20 border border-green-500 text-green-500 rounded-lg p-4 text-center">
             Message sent successfully! Redirecting...
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default ContactPage;
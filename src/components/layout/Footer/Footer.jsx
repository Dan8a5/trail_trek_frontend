import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[rgba(6,78,59,0.9)] py-6">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-sm font-medium text-[rgb(248,244,244)]" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          © 2024 Trail Trek
        </div>
        <div className="flex gap-6">
          <Link 
            to="/contact" 
            className="text-sm font-medium text-[rgb(248,244,244)] hover:text-green-400 transition-colors"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

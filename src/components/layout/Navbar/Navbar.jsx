import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Logo and Brand */}
          <div className={styles.logoContainer}>
            <button 
              onClick={() => navigate('/')} 
              className={styles.logoButton}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-xl font-bold">Trail Trek</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <button
              onClick={() => navigate('/parks')}
              className={styles.navLink}
            >
              <Compass className="h-4 w-4" />
              <span>Parks</span>
            </button>
            
            <button
              onClick={() => navigate('/itineraries')}
              className={styles.navLink}
            >
              Itineraries
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className={styles.loginButton}
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className={styles.mobileMenuButton}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.mobileMenuButtonInner}
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <button
              onClick={() => {
                navigate('/parks');
                setIsMenuOpen(false);
              }}
              className={styles.mobileNavLink}
            >
              Parks
            </button>
            
            <button
              onClick={() => {
                navigate('/itineraries');
                setIsMenuOpen(false);
              }}
              className={styles.mobileNavLink}
            >
              Itineraries
            </button>
            
            <button
              onClick={() => {
                navigate('/login');
                setIsMenuOpen(false);
              }}
              className={styles.mobileLoginButton}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
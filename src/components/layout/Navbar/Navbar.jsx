import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Menu, X, Tent, LogIn, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logoContainer}>
            <button 
              onClick={() => navigate('/')} 
              className={styles.logoButton}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-xl font-bold">Trail Trek</span>
            </button>
          </div>

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
              <Tent className="h-4 w-4" />
              <span>Itineraries</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={styles.navLink}
            >
              <Mail className="h-4 w-4" />
              <span>Contact Us</span>
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className={styles.navLink}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={styles.loginButton}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={styles.loginButton}
              >
                Login
              </button>
            )}
          </div>

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
              <Compass className="h-4 w-4 mr-2" />
              Parks
            </button>
            
            <button
              onClick={() => {
                navigate('/itineraries');
                setIsMenuOpen(false);
              }}
              className={styles.mobileNavLink}
            >
              <Tent className="h-4 w-4 mr-2" />
              Itineraries
            </button>

            <button
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
              className={styles.mobileNavLink}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className={styles.mobileNavLink}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={styles.mobileLoginButton}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className={styles.mobileLoginButton}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
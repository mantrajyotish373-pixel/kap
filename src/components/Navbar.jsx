// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { GiSun, GiMoon, GiStarsStack } from "react-icons/gi";
import { FaHome, FaShoppingCart, FaUserCircle, FaHandsHelping, FaUser } from "react-icons/fa";
import { BsStars, BsChatDots } from "react-icons/bs";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import AuthModal from "./AuthModal";
import "./Navbar.css";
import logo from '../assets/logo.jpeg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);
  
  // PROFILE REDIRECT - Directly go to /user-profile
  const handleProfileClick = () => {
    console.log("Profile clicked - Directing to /user-profile");
    // Always go to user-profile page
    navigate("/user-profile");
  };
  
  // Logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('authRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('backendUserId');
      
      setUser(null);
      setIsLoggedIn(false);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const closeAuthModal = () => setAuthModal(false);

  // Check login status
  const checkLoginStatus = () => {
    try {
      const userStr = localStorage.getItem('user');
      const isLoggedInStr = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      let loggedIn = false;
      let userData = null;
      
      if (userStr && userStr !== "undefined" && userStr !== "null" && userStr !== "") {
        try {
          userData = JSON.parse(userStr);
          const hasValidData = userData && (userData.name || userData.email || userData._id || userData.id);
          const hasToken = !!(token);
          const isFlagTrue = isLoggedInStr === "true";
          
          loggedIn = hasValidData && hasToken && isFlagTrue;
        } catch (e) {
          loggedIn = false;
        }
      }
      
      if (loggedIn && userData) {
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Check login on mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Listen for storage changes
  useEffect(() => {
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // Check every second
  useEffect(() => {
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navItems = [
    { to: "/", icon: <FaHome />, text: "Home" },
    { to: "/horoscope", icon: <BsStars />, text: "Horoscope" },
    { to: "/astro-connect", icon: <BsChatDots />, text: "Astro Connect" },
    { to: "/pooja", icon: <FaHandsHelping />, text: "Pooja & Rituals" },
    { to: "/shop", icon: <FaShoppingCart />, text: "Astro Shop" },
    { to: "/contact-us", icon: <FiHeart />, text: "Contact" },
  ];

  const sideMenuVariants = {
    closed: { x: "100%" },
    open: { x: "0%", transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo Section */}
        <div className="navbar-logo">
          <NavLink to="/" onClick={isMenuOpen ? closeMobileMenu : undefined}>
            <div className="logo-wrapper">
              <img src={logo} alt="MantraJyotish" />
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text">
              <span className="logo-mantra">Mantra</span>
              <span className="logo-jyotish">Jyotish</span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-wrapper">
          <ul className="desktop-links">
            {navItems.map((item) => (
              <motion.li 
                key={item.to}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <NavLink 
                  to={item.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.text}</span>
                  <span className="nav-hover-line"></span>
                </NavLink>
              </motion.li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="nav-right">
            {/* Quick Action Buttons */}
            <div className="quick-actions">
              <motion.button 
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/astro-connect')}
                title="Talk to Astrologer"
              >
                <BsChatDots />
              </motion.button>
              <motion.button 
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/horoscope')}
                title="Free Kundli"
              >
                <GiStarsStack />
              </motion.button>
            </div>

            {/* PROFILE BUTTON - Always redirects to /user-profile */}
            <motion.button 
              className="profile-nav-btn"
              onClick={handleProfileClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoggedIn && user ? (
                <>
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="profile-nav-avatar" />
                  ) : (
                    <div className="profile-nav-avatar-placeholder">
                      {getUserInitials()}
                    </div>
                  )}
                  <span className="profile-nav-name">{user?.name?.split(' ')[0] || "Profile"}</span>
                </>
              ) : (
                <>
                  <FaUserCircle className="profile-nav-icon" />
                  <span className="profile-nav-text">Profile</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="mobile-icons">
          <motion.button 
            className="mobile-profile-btn"
            onClick={handleProfileClick}
            whileTap={{ scale: 0.95 }}
          >
            {isLoggedIn && user ? (
              user?.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="mobile-avatar" />
              ) : (
                <div className="mobile-avatar-placeholder">
                  {getUserInitials()}
                </div>
              )
            ) : (
              <FaUser size={22} />
            )}
          </motion.button>

          <motion.button 
            className={`hamburger-button ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="backdrop"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="mobile-menu"
              variants={sideMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <img src={logo} alt="MantraJyotish" />
                  <span>MantraJyotish</span>
                </div>
                <motion.button 
                  onClick={closeMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  className="close-menu-btn"
                >
                  <IoClose size={28} />
                </motion.button>
              </div>

              <div className="mobile-menu-content">
                <ul className="mobile-nav-items">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink to={item.to} onClick={closeMobileMenu}>
                        <span className="mobile-nav-icon">{item.icon}</span>
                        <span className="mobile-nav-text">{item.text}</span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                {/* Profile Section in Mobile Menu */}
                <div className="mobile-profile-section">
                  {isLoggedIn && user ? (
                    <>
                      <div className="mobile-user-card" onClick={() => {
                        navigate("/user-profile");
                        closeMobileMenu();
                      }}>
                        <div className="mobile-user-avatar">
                          {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                        <div className="mobile-user-details">
                          <strong>{user?.name}</strong>
                          <span>View Profile →</span>
                        </div>
                      </div>
                      <button className="mobile-logout-btn" onClick={handleLogout}>
                        <IoLogOutOutline /> Logout
                      </button>
                    </>
                  ) : (
                    <div className="mobile-auth-section">
                      <button className="mobile-signin-btn" onClick={() => { 
                        navigate("/user-profile");
                        closeMobileMenu(); 
                      }}>
                        View Profile
                      </button>
                    </div>
                  )}
                </div>

                <div className="mobile-menu-footer">
                  <div className="footer-cosmic-text">
                    <GiMoon />
                    <span>वसुधैव कुटुम्बकम्</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal - Only for sign in */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            isLoggedIn={isLoggedIn}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
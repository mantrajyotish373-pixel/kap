// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetAstrologersQuery } from '../services/backendApi';

// Import your images
import logo from '../assets/logo.jpeg';

// Import icons
import { 
  FiArrowRight, 
  FiStar, 
  FiMoon, 
  FiSun, 
  FiCompass,
  FiMessageCircle,
  FiPhone,
  FiVideo,
  FiShield,
  FiAward,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiUser
} from 'react-icons/fi';

// Import components
import ServicesSection from '../components/ServicesSection';
import DailyInsights from '../components/DailyInsights';
import ConsultationTopics from '../components/ConsultationTopics';
import NakshatrasSection from '../components/NakshatrasSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

// Import CSS
import './HomePage.css';

// Floating Particles Component
const CosmicParticles = () => {
  const particleCount = 80;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1
  }));

  return (
    <div className="cosmic-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
};

// Floating Zodiac Icons
const FloatingZodiacIcons = () => {
  const zodiacIcons = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  return (
    <div className="floating-zodiacs">
      {zodiacIcons.map((icon, index) => (
        <div
          key={index}
          className="zodiac-icon"
          style={{
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${25 + index * 2}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  );
};

// Featured Astrologer Card - Clickable to navigate to connect page
const FeaturedAstrologerCard = ({ astrologer }) => {
  const navigate = useNavigate();
  const averageRating = astrologer.averageRating || 4.8;
  
  const handleCardClick = () => {
    navigate(`/astro-connect`);
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/astro-connect`);
  };

  const handleCallClick = (e) => {
    e.stopPropagation();
    navigate(`/astro-connect`);
  };

  return (
    <motion.div 
      className="featured-astro-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <div className="astro-card-header">
        <div className="astro-avatar-wrapper">
          <div className="avatar-ring"></div>
          <img 
            src={astrologer.profilePhoto || astrologer.user_profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=ffd700&color=1a0a2e&bold=true`}
            alt={astrologer.name}
            className="astro-avatar"
          />
          <div className="online-dot"></div>
        </div>
        <h3 className="astro-name">{astrologer.name}</h3>
        <div className="astro-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={`star ${i < Math.floor(averageRating) ? 'filled' : ''}`} />
            ))}
          </div>
          <span className="rating-value">{averageRating}</span>
          <span className="review-count">({astrologer.totalReviews || 128} reviews)</span>
        </div>
        <p className="astro-expertise">
          {astrologer.all_skills?.slice(0, 2).join(" • ") || "Vedic Astrology • Tarot"}
        </p>
        <p className="astro-experience">
          ⏱ {astrologer.experience || "10+"} Years Experience
        </p>
      </div>

      <div className="astro-pricing">
        <div className="price-item">
          <FiMessageCircle />
          <div>
            <span>Chat</span>
            <strong>₹{astrologer.chatFee || 15}/min</strong>
          </div>
        </div>
        <div className="price-item">
          <FiPhone />
          <div>
            <span>Call</span>
            <strong>₹{astrologer.callFee || 20}/min</strong>
          </div>
        </div>
        <div className="price-item">
          <FiVideo />
          <div>
            <span>Video</span>
            <strong>₹{astrologer.videoFee || 25}/min</strong>
          </div>
        </div>
      </div>

      <div className="astro-actions-home">
        <button className="connect-chat-btn" onClick={handleChatClick}>
          <FiMessageCircle /> Chat Now
        </button>
        <button className="connect-call-btn" onClick={handleCallClick}>
          <FiPhone /> Call
        </button>
      </div>
    </motion.div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const { data: astrologers = [], isLoading } = useGetAstrologersQuery();
  const featuredAstrologers = astrologers.slice(0, 6);

  const handleViewAll = () => {
    navigate('/astro-connect');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="cosmic-background">
          <div className="nebula nebula-1"></div>
          <div className="nebula nebula-2"></div>
          <div className="nebula nebula-3"></div>
        </div>

        <CosmicParticles />
        <FloatingZodiacIcons />

        <div className="hero-vignette"></div>

        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Logo Banner */}
            <motion.div 
              className="hero-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <img src={logo} alt="KalpJyotish" className="banner-logo" />
              <div className="banner-text">
                <span>MantraJyotish</span>
                <p>Your Stars, Your Success</p>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Talk to Astrologers
              <span> Get Answers Now</span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Chat or call with expert astrologers. Get guidance on love, career, money & life.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <button onClick={() => navigate('/astro-connect')} className="cta-btn primary">
                <span>Find an Astrologer</span>
                <FiArrowRight />
              </button>
              <Link to="/horoscope" className="cta-btn secondary">
                <FiSun />
                <span>Free Horoscope</span>
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="quick-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="stat-card">
                <FiUsers />
                <div>
                  <strong>50k+</strong>
                  <span>Happy Users</span>
                </div>
              </div>
              <div className="stat-card">
                <FiStar />
                <div>
                  <strong>100+</strong>
                  <span>Expert Astrologers</span>
                </div>
              </div>
              <div className="stat-card">
                <FiMessageCircle />
                <div>
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <p>Scroll down</p>
        </motion.div>
      </section>

      {/* Featured Astrologers Section - Directly after hero */}
      <section className="featured-astrologers">
        <div className="section-header">
          <div className="header-badge">
            <FiStar />
            <span>Meet Our Celestial Guides</span>
          </div>
          <h2>Our <span className="title-highlight">Astrologers</span></h2>
          <p>Connect with India's most trusted and experienced astrologers for personalized guidance</p>
        </div>

        {isLoading ? (
          <div className="loader-container">
            <div className="cosmic-loader">
              <div className="loader-ring"></div>
              <div className="loader-ring"></div>
              <div className="loader-ring"></div>
              <p>Loading celestial guides...</p>
            </div>
          </div>
        ) : (
          <div className="featured-grid">
            {featuredAstrologers.map((astro) => (
              <FeaturedAstrologerCard 
                key={astro._id} 
                astrologer={astro} 
              />
            ))}
          </div>
        )}

        <div className="view-all-container">
          <button onClick={handleViewAll} className="view-all-btn">
            View All Astrologers <FiArrowRight />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get answers in 3 simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose an Astrologer</h3>
            <p>Browse our expert astrologers</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Pick Your Service</h3>
            <p>Chat, Call or Video Call</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Your Answers</h3>
            <p>Talk & get guidance instantly</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="section-header">
          <h2>Why Choose MantraJyotish?</h2>
          <p>We make astrology simple and accessible</p>
        </div>
        <div className="features-grid">
          <div className="feature">
            <FiShield />
            <h3>100% Private</h3>
            <p>Your chats are secure & confidential</p>
          </div>
          <div className="feature">
            <FiCheckCircle />
            <h3>Verified Experts</h3>
            <p>All astrologers are certified</p>
          </div>
          <div className="feature">
            <FiTrendingUp />
            <h3>Affordable</h3>
            <p>Starting at just ₹15/min</p>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <ServicesSection />
      <DailyInsights />
      <ConsultationTopics />
      <NakshatrasSection />
      <Testimonials />
      <BlogSection />
      <Footer />
    </>
  );
};

export default HomePage;
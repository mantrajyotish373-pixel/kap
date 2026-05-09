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
  FiUser,
  FiChevronRight
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

// Floating Particles Component - subtle spiritual background
const CosmicParticles = () => {
  const particleCount = 40;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.25 + 0.05
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

// Floating Rudraksha / Divine Symbols
const FloatingSymbols = () => {
  const symbols = ["🕉️", "🔱", "🪔", "🌙", "☀️", "🔔"];

  return (
    <div className="floating-symbols">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="divine-symbol"
          style={{
            animationDelay: `${index * 1.2}s`,
            animationDuration: `${30 + index * 3}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

// Simplified Astrologer Avatar Card - Only Icon and Name
const AstrologerAvatarCard = ({ astrologer }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/astro-connect');
  };

  return (
    <motion.div 
      className="astro-avatar-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
    >
      <div className="avatar-frame">
        <img 
          src={astrologer.profilePhoto || astrologer.user_profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=b8860b&color=fff&bold=true&size=100`}
          alt={astrologer.name}
          className="astro-mini-avatar"
        />
        <div className="avatar-pulse"></div>
      </div>
      <h4 className="astro-mini-name">{astrologer.name.split(' ')[0]}</h4>
    </motion.div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const { data: astrologers = [], isLoading } = useGetAstrologersQuery();
  const featuredAstrologers = astrologers.slice(0, 8);

  const handleViewAll = () => {
    navigate('/astro-connect');
  };

  return (
    <>
      {/* Hero Section - Divine & Spiritual */}
      <section className="hero-section">
        <div className="divine-background">
          <div className="mandala-bg"></div>
          <div className="om-bg"></div>
        </div>

        <CosmicParticles />
        <FloatingSymbols />

        <div className="hero-vignette"></div>

        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Divine Banner */}
            <motion.div 
              className="hero-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <img src={logo} alt="MantraJyotish" className="banner-logo" />
              <div className="banner-text">
                <span>मंत्र ज्योतिष</span>
                <p>MantraJyotish · आपके भाग्य का मार्गदर्शक</p>
              </div>
            </motion.div>

            {/* Main Title - Sanskrit inspired */}
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="sanskrit-text">ज्योतिषं परमं ज्ञानम्</span>
              <span className="title-main">Connect with Vedas &<br />Trusted Astrologers</span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              आचार्यों से करें संवाद · प्रेम, करियर, धन और जीवन के हर प्रश्न का समाधान
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <button onClick={() => navigate('/astro-connect')} className="cta-btn primary">
                <span>विद्वानों से संपर्क करें</span>
                <FiArrowRight />
              </button>
              <Link to="/horoscope" className="cta-btn secondary">
                <FiSun />
                <span>मुफ्त कुंडली</span>
              </Link>
            </motion.div>

            {/* Divine Stats */}
            <motion.div 
              className="quick-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="stat-card">
                <FiUsers />
                <div>
                  <strong>50,000+</strong>
                  <span>मार्गदर्शित आत्माएं</span>
                </div>
              </div>
              <div className="stat-card">
                <FiStar />
                <div>
                  <strong>100+</strong>
                  <span>सिद्धहस्त आचार्य</span>
                </div>
              </div>
              <div className="stat-card">
                <FiMessageCircle />
                <div>
                  <strong>२४/७</strong>
                  <span>सेवा में</span>
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
          <p>अधिक जानकारी के लिए नीचे स्क्रॉल करें</p>
        </motion.div>
      </section>

      {/* Our Astrologers Section - Simplified Avatars only */}
      <section className="our-astrologers-section">
        <div className="section-header">
          <div className="header-badge">
            <FiStar />
            <span>हमारे विद्वान आचार्य</span>
          </div>
          <h2>Our <span className="title-highlight">Astrologers</span></h2>
          <p>ज्योतिष के क्षेत्र में दशकों का अनुभव रखने वाले हमारे प्रमाणित आचार्यों से जुड़ें</p>
        </div>

        {isLoading ? (
          <div className="loader-container">
            <div className="divine-loader">
              <div className="loader-om">🕉️</div>
              <p>आचार्यों की सूची लोड हो रही है...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="astrologer-avatars-grid">
              {featuredAstrologers.map((astro) => (
                <AstrologerAvatarCard 
                  key={astro._id} 
                  astrologer={astro} 
                />
              ))}
            </div>

            <div className="view-all-container">
              <button onClick={handleViewAll} className="view-all-btn">
                सभी आचार्यों को देखें <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </section>

      {/* How It Works Section - Divine Process */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>परामर्श प्रक्रिया</h2>
          <p>सरल, त्वरित और प्रभावी — तीन सरल चरणों में समाधान</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">१</div>
            <h3>आचार्य का चयन करें</h3>
            <p>विशेषज्ञता और अनुभव के अनुसार आचार्य चुनें</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">२</div>
            <h3>सेवा चुनें</h3>
            <p>चैट, कॉल या वीडियो कॉल — जैसा आप चाहें</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">३</div>
            <h3>प्रश्न पूछें और समाधान पाएं</h3>
            <p>तुरंत संवाद करें और मार्गदर्शन प्राप्त करें</p>
          </div>
        </div>
      </section>

      {/* Ancient Wisdom Section - New */}
      <section className="ancient-wisdom">
        <div className="wisdom-container">
          <div className="wisdom-content">
            <h2>वैदिक ज्योतिष की प्राचीन परंपरा</h2>
            <p>मंत्र ज्योतिष पर, हम प्राचीन वैदिक ग्रंथों और भारतीय ज्योतिष की समृद्ध परंपराओं का पालन करते हैं। हमारे आचार्य पीढ़ियों से चली आ रही ज्योतिष विद्या में निपुण हैं।</p>
            <div className="wisdom-features">
              <div className="wisdom-item">
                <FiCheckCircle />
                <span>प्रामाणिक ज्योतिष गणना</span>
              </div>
              <div className="wisdom-item">
                <FiCheckCircle />
                <span>पंचांग और मुहूर्त विचार</span>
              </div>
              <div className="wisdom-item">
                <FiCheckCircle />
                <span>जन्म कुंडली विश्लेषण</span>
              </div>
            </div>
          </div>
          <div className="wisdom-symbol">
            <div className="rudraksha">🔱</div>
            <div className="shlok">"यथा पिण्डे तथा ब्रह्माण्डे"</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Spiritual Reasons */}
      <section className="why-choose-us">
        <div className="section-header">
          <h2>क्यों चुनें मंत्र ज्योतिष?</h2>
          <p>हम ज्योतिष को सरल, सुलभ और प्रभावी बनाते हैं</p>
        </div>
        <div className="features-grid">
          <div className="feature">
            <FiShield />
            <h3>१००% गोपनीय</h3>
            <p>आपके संवाद पूर्णतः सुरक्षित और गुप्त</p>
          </div>
          <div className="feature">
            <FiAward />
            <h3>प्रमाणित विद्वान</h3>
            <p>सभी आचार्य ज्योतिष विषय में प्रमाणित</p>
          </div>
          <div className="feature">
            <FiTrendingUp />
            <h3>सस्ती सेवाएं</h3>
            <p>मात्र ₹१५ प्रति मिनट से शुरू</p>
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